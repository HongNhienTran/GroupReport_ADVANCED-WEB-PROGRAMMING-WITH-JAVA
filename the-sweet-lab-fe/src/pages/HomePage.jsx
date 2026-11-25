import { useEffect, useState } from 'react';
import { aiApi } from '../api/aiApi';
import { catalogApi } from '../api/catalogApi';
import FlashSaleSection from '../components/homepage/FlashSaleSection';
import HeroSection from '../components/homepage/HeroSection';
import PartnerBrandsSection from '../components/homepage/PartnerBrandsSection';
import RecommendationSection from '../components/homepage/RecommendationSection';
import MainLayout from '../layouts/MainLayout';

function HomePage() {
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [flashSaleProducts, setFlashSaleProducts] = useState([]);
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [activeCategoryId, setActiveCategoryId] = useState(null);
  const [loadingProducts, setLoadingProducts] = useState(true);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [catResult, brandResult, prodResult, recResult] = await Promise.allSettled([
          catalogApi.getCategories(),
          catalogApi.getBrands(),
          catalogApi.getProducts({ page: 0, size: 8, sortBy: 'id', sortDir: 'asc' }),
          aiApi.getRecommendations({ limit: 8 }),
        ]);

        if (catResult.status === 'fulfilled') {
          setCategories(catResult.value.data || []);
        } else {
          console.error('Failed to load categories:', catResult.reason);
        }

        if (brandResult.status === 'fulfilled') {
          setBrands(brandResult.value.data || []);
        } else {
          console.error('Failed to load brands:', brandResult.reason);
        }

        if (prodResult.status === 'fulfilled') {
          const items = prodResult.value.data?.content || [];
          setFlashSaleProducts(items);
        } else {
          console.error('Failed to load products:', prodResult.reason);
        }

        if (recResult.status === 'fulfilled') {
          setRecommendedProducts(recResult.value.data || []);
        } else if (prodResult.status === 'fulfilled') {
          setRecommendedProducts(prodResult.value.data?.content || []);
        }
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchInitialData();
  }, []);

  const loadProducts = async ({ keyword = '', categoryId = null }) => {
    setLoadingProducts(true);
    setActiveCategoryId(categoryId);
    try {
      if (keyword) {
        aiApi.trackEvent({ actionType: 'SEARCH', keyword });
        const params = { page: 0, size: 8, sortBy: 'id', sortDir: 'asc', keyword };
        if (categoryId) params.categoryId = categoryId;
        const res = await catalogApi.getProducts(params);
        setRecommendedProducts(res.data?.content || []);
      } else {
        const res = await aiApi.getRecommendations({ categoryId, limit: 8 });
        setRecommendedProducts(res.data || []);
      }
    } catch (err) {
      console.error('Failed to filter products:', err);
    } finally {
      setLoadingProducts(false);
    }
  };

  return (
    <MainLayout>
      <HeroSection categories={categories} onSearch={loadProducts} />
      <FlashSaleSection products={flashSaleProducts} />
      <RecommendationSection
        categories={categories}
        products={recommendedProducts}
        activeCategoryId={activeCategoryId}
        onSelectCategory={(catId) => loadProducts({ categoryId: catId })}
        loading={loadingProducts}
      />
      <PartnerBrandsSection brands={brands} />
    </MainLayout>
  );
}

export default HomePage;
