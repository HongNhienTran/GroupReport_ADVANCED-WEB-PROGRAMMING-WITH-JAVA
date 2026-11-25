package com.sweetlab.backend.ai;

import com.sweetlab.backend.entity.NutritionFacts;
import com.sweetlab.backend.entity.NutritionProfile;
import com.sweetlab.backend.entity.Product;
import com.sweetlab.backend.entity.ProductVariant;
import com.sweetlab.backend.entity.UserBehaviorLog;
import com.sweetlab.backend.repository.NutritionProfileRepository;
import com.sweetlab.backend.repository.ProductRepository;
import com.sweetlab.backend.repository.UserBehaviorLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.ai.tool.annotation.Tool;
import org.springframework.ai.tool.annotation.ToolParam;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Spring AI Tool Functions invoked by the LLM to query real MariaDB & VectorStore data.
 */
@Component
@RequiredArgsConstructor
public class SweetieTools {

    private final ProductVectorService productVectorService;
    private final ProductRepository productRepository;
    private final NutritionProfileRepository nutritionProfileRepository;
    private final UserBehaviorLogRepository behaviorLogRepository;

    @Tool(description = "Tìm kiếm sản phẩm bánh kẹo healthy theo ngữ nghĩa (hương vị, chế độ ăn Keto/Vegan/Sugar-Free, ít đường, thành phần). Luôn dùng tool này trước khi gợi ý sản phẩm cho khách.")
    @Transactional(readOnly = true)
    public String searchProductsByMeaning(
            @ToolParam(description = "Mô tả nhu cầu tìm kiếm sản phẩm bằng tiếng Việt") String query
    ) {
        List<Long> ids = productVectorService.searchSimilarProductIds(query, 5);
        if (ids.isEmpty()) {
            return "Không tìm thấy sản phẩm phù hợp.";
        }
        List<Product> products = productRepository.findAllById(ids);
        return products.stream()
                .map(p -> {
                    String priceRange = p.getVariants().stream()
                            .filter(ProductVariant::isActive)
                            .map(v -> v.getPrice().toPlainString())
                            .findFirst()
                            .orElse("N/A");
                    NutritionFacts nf = p.getNutritionFacts();
                    String cal = nf != null ? String.format("%.0f kcal, %.1fg đường", nf.getCalories(), nf.getSugarG()) : "";
                    return String.format("- [ID:%d] %s (slug: %s) | Danh mục: %s | Giá từ: %sđ | Dinh dưỡng/100g: %s | Dị ứng: %s",
                            p.getId(), p.getName(), p.getSlug(), p.getCategory().getName(),
                            priceRange, cal, p.getAllergens().isEmpty() ? "Không" : p.getAllergens());
                })
                .collect(Collectors.joining("\n"));
    }

    @Tool(description = "Lấy thông tin chi tiết biến thể, giá bán, tồn kho và bảng dinh dưỡng của một sản phẩm theo productId.")
    @Transactional(readOnly = true)
    public String getProductDetails(
            @ToolParam(description = "ID của sản phẩm") Long productId
    ) {
        return productRepository.findById(productId)
                .map(p -> {
                    String variants = p.getVariants().stream()
                            .filter(ProductVariant::isActive)
                            .map(v -> String.format("%s (%.0fg): %sđ, còn %d",
                                    v.getName(), v.getWeightGram(), v.getPrice().toPlainString(), v.getStockQuantity()))
                            .collect(Collectors.joining("; "));
                    NutritionFacts nf = p.getNutritionFacts();
                    String nutrition = nf == null ? "Chưa cập nhật"
                            : String.format("Per %.0fg: %.0f kcal, Protein %.1fg, Carb %.1fg, Sugar %.1fg, Fiber %.1fg, Fat %.1fg",
                                    nf.getPerAmountG(), nf.getCalories(), nf.getProteinG(), nf.getCarbG(),
                                    nf.getSugarG(), nf.getFiberG(), nf.getFatG());
                    return String.format("Sản phẩm: %s\nThành phần: %s\nBiến thể: %s\nDinh dưỡng: %s\nDị ứng: %s",
                            p.getName(), p.getIngredients(), variants, nutrition, p.getAllergens());
                })
                .orElse("Không tìm thấy sản phẩm với ID: " + productId);
    }

    @Tool(description = "Lấy hồ sơ dinh dưỡng và dị ứng của người dùng đang trò chuyện nếu có userId.")
    @Transactional(readOnly = true)
    public String getUserNutritionProfile(
            @ToolParam(description = "userId của khách hàng (bỏ qua nếu là khách chưa đăng nhập)") Long userId
    ) {
        if (userId == null) {
            return "Khách hàng chưa đăng nhập hoặc chưa thiết lập hồ sơ dinh dưỡng.";
        }
        return nutritionProfileRepository.findByUserId(userId)
                .map(this::formatNutritionProfile)
                .orElse("Khách hàng chưa cập nhật hồ sơ dinh dưỡng.");
    }

    @Tool(description = "Xem các sản phẩm hoặc từ khóa khách hàng quan tâm gần đây từ User Tracking.")
    @Transactional(readOnly = true)
    public String getRecentInterests(
            @ToolParam(description = "userId của khách hàng") Long userId
    ) {
        if (userId == null) {
            return "Chưa có dữ liệu lịch sử cá nhân.";
        }
        List<UserBehaviorLog> logs = behaviorLogRepository.findByUserIdOrderByCreatedAtDesc(
                userId, PageRequest.of(0, 5));
        if (logs.isEmpty()) {
            return "Chưa ghi nhận tương tác gần đây.";
        }
        return logs.stream()
                .map(l -> l.getProduct() != null
                        ? l.getActionType() + ": " + l.getProduct().getName()
                        : l.getActionType() + ": " + l.getKeyword())
                .collect(Collectors.joining("; "));
    }

    private String formatNutritionProfile(NutritionProfile np) {
        return String.format("Chiều cao: %.1fcm, Cân nặng: %.1fkg, Vận động: %s, Dị ứng cần tránh: %s",
                np.getHeightCm(), np.getWeightKg(), np.getActivityLevel(),
                np.getAllergens().isEmpty() ? "Không" : np.getAllergens());
    }
}
