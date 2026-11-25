package com.sweetlab.backend.ai;

import com.sweetlab.backend.entity.NutritionFacts;
import com.sweetlab.backend.entity.NutritionTag;
import com.sweetlab.backend.entity.Product;
import com.sweetlab.backend.entity.ProductVariant;
import com.sweetlab.backend.enums.ProductStatus;
import com.sweetlab.backend.repository.ProductRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.document.Document;
import org.springframework.ai.embedding.EmbeddingModel;
import org.springframework.ai.vectorstore.SearchRequest;
import org.springframework.ai.vectorstore.SimpleVectorStore;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Maintains an in-memory {@link SimpleVectorStore} indexed from active products in MariaDB.
 */
@Slf4j
@Service
public class ProductVectorService {

    private final SimpleVectorStore vectorStore;
    private final ProductRepository productRepository;
    private volatile boolean indexed = false;

    public ProductVectorService(EmbeddingModel embeddingModel, ProductRepository productRepository) {
        this.vectorStore = SimpleVectorStore.builder(embeddingModel).build();
        this.productRepository = productRepository;
    }

    @EventListener(ApplicationReadyEvent.class)
    @Transactional(readOnly = true)
    public void indexActiveProductsOnStartup() {
        try {
            reindexAll();
        } catch (Exception ex) {
            log.warn("Deferred product vector indexing due to startup error: {}", ex.getMessage());
        }
    }

    @Transactional(readOnly = true)
    public synchronized void reindexAll() {
        List<Product> products = productRepository.findAll().stream()
                .filter(p -> p.getStatus() == ProductStatus.ACTIVE)
                .toList();

        if (products.isEmpty()) {
            return;
        }

        List<Document> docs = products.stream()
                .map(this::toDocument)
                .toList();
        vectorStore.add(docs);
        indexed = true;
        log.info("Indexed {} active products into SimpleVectorStore", docs.size());
    }

    public List<Long> searchSimilarProductIds(String query, int topK) {
        if (query == null || query.isBlank()) {
            return List.of();
        }
        if (!indexed) {
            reindexAll();
        }
        if (!indexed) {
            return List.of();
        }

        List<Document> results = vectorStore.similaritySearch(
                SearchRequest.builder()
                        .query(query)
                        .topK(topK)
                        .build()
        );
        if (results == null) {
            return List.of();
        }
        return results.stream()
                .map(doc -> doc.getMetadata().get("productId"))
                .filter(Number.class::isInstance)
                .map(val -> ((Number) val).longValue())
                .distinct()
                .toList();
    }

    private Document toDocument(Product product) {
        String tags = product.getNutritionTags().stream()
                .map(NutritionTag::getName)
                .collect(Collectors.joining(", "));

        String allergens = product.getAllergens().stream()
                .map(Enum::name)
                .collect(Collectors.joining(", "));

        BigDecimal minPrice = product.getVariants().stream()
                .filter(ProductVariant::isActive)
                .map(ProductVariant::getPrice)
                .min(BigDecimal::compareTo)
                .orElse(BigDecimal.ZERO);

        NutritionFacts nf = product.getNutritionFacts();
        String nutritionSummary = nf == null
                ? ""
                : String.format("Calories: %.1f kcal, Sugar: %.1fg, Protein: %.1fg, Carb: %.1fg, Fat: %.1fg",
                        nf.getCalories(), nf.getSugarG(), nf.getProteinG(), nf.getCarbG(), nf.getFatG());

        String content = String.format(
                "Tên: %s. Danh mục: %s. Thương hiệu: %s. Giá từ: %s VND. Nhãn dinh dưỡng: %s. Dị ứng: %s. Thành phần: %s. Mô tả: %s. %s",
                product.getName(),
                product.getCategory().getName(),
                product.getBrand().getName(),
                minPrice.toPlainString(),
                tags.isEmpty() ? "Không" : tags,
                allergens.isEmpty() ? "Không" : allergens,
                product.getIngredients(),
                product.getDescription(),
                nutritionSummary
        );

        return new Document(
                "product-" + product.getId(),
                content,
                Map.of(
                        "productId", product.getId(),
                        "slug", product.getSlug(),
                        "categoryId", product.getCategory().getId()
                )
        );
    }
}
