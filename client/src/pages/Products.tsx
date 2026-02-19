import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import Banner from '../components/common/Banner';
import ProductCard from '../components/common/ProductCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { getProducts, Product } from '../services/product.service';

const Products: React.FC = () => {
  const { t, language } = useLanguage();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const categories = [
    { id: 'all', name: { zh: '全部', en: 'All' } },
    { id: 'hydraulic-wrench', name: { zh: '液压扳手', en: 'Hydraulic Wrenches' } },
    { id: 'hydraulic-pump', name: { zh: '液压泵站', en: 'Hydraulic Pumps' } },
    { id: 'accessories', name: { zh: '配套附件', en: 'Accessories' } },
    { id: 'service', name: { zh: '工程服务', en: 'Engineering Services' } },
  ];

  useEffect(() => {
    fetchProducts();
  }, [currentPage, selectedCategory]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params: Record<string, unknown> = {
        page: currentPage,
        limit: 12,
      };
      if (selectedCategory !== 'all') {
        params.category = selectedCategory;
      }
      if (searchTerm) {
        params.search = searchTerm;
      }
      const response = await getProducts(params);
      setProducts(response.data);
      setTotalPages(response.pagination.pages);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchProducts();
  };

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setCurrentPage(1);
  };

  return (
    <div>
      <Banner title={t('products.title')} size="small" />

      <section className="py-12 md:py-16">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row gap-6 mb-8">
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryChange(category.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {language === 'zh-CN' ? category.name.zh : category.name.en}
                </button>
              ))}
            </div>

            <form onSubmit={handleSearch} className="flex-1 max-w-md ml-auto">
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={t('products.searchPlaceholder')}
                  className="input-field pl-10"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
            </form>
          </div>

          {loading ? (
            <LoadingSpinner size="large" className="py-12" />
          ) : products.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex justify-center mt-12">
                  <nav className="flex items-center space-x-2">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 rounded-md border border-gray-300 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      {language === 'zh-CN' ? '上一页' : 'Previous'}
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-4 py-2 rounded-md text-sm font-medium ${
                          currentPage === page
                            ? 'bg-primary-600 text-white'
                            : 'border border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                    <button
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 rounded-md border border-gray-300 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      {language === 'zh-CN' ? '下一页' : 'Next'}
                    </button>
                  </nav>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">{t('products.noResults')}</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Products;
