import React, { useState, useEffect } from 'react';
import { X, Upload } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { Product, createProduct, updateProduct } from '../../services/product.service';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  product?: Product | null;
}

const ProductModal: React.FC<ProductModalProps> = ({ isOpen, onClose, onSave, product }) => {
  const { language } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: { zh: '', en: '' },
    description: { zh: '', en: '' },
    category: '',
    images: [] as string[],
    specifications: [] as { key: string; value: string }[],
    price: '',
    featured: false,
    status: 'active',
    order: 0,
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description,
        category: product.category,
        images: product.images,
        specifications: product.specifications,
        price: product.price?.toString() || '',
        featured: product.featured,
        status: product.status,
        order: product.order,
      });
    } else {
      setFormData({
        name: { zh: '', en: '' },
        description: { zh: '', en: '' },
        category: '',
        images: [],
        specifications: [],
        price: '',
        featured: false,
        status: 'active',
        order: 0,
      });
    }
  }, [product, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = {
        name: formData.name,
        description: formData.description,
        category: formData.category,
        images: formData.images,
        specifications: formData.specifications,
        price: formData.price ? parseFloat(formData.price) : undefined,
        featured: formData.featured,
        status: formData.status,
        order: formData.order,
      };

      if (product) {
        await updateProduct(product._id, data);
      } else {
        await createProduct(data);
      }
      onSave();
      onClose();
    } catch (error) {
      console.error('Failed to save product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUrlAdd = () => {
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ''],
    }));
  };

  const handleImageUrlChange = (index: number, value: string) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData(prev => ({ ...prev, images: newImages }));
  };

  const handleImageUrlRemove = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSpecAdd = () => {
    setFormData(prev => ({
      ...prev,
      specifications: [...prev.specifications, { key: '', value: '' }],
    }));
  };

  const handleSpecChange = (index: number, field: 'key' | 'value', value: string) => {
    const newSpecs = [...formData.specifications];
    newSpecs[index] = { ...newSpecs[index], [field]: value };
    setFormData(prev => ({ ...prev, specifications: newSpecs }));
  };

  const handleSpecRemove = (index: number) => {
    setFormData(prev => ({
      ...prev,
      specifications: prev.specifications.filter((_, i) => i !== index),
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
        <div className="relative bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-900">
              {product
                ? (language === 'zh-CN' ? '编辑产品' : 'Edit Product')
                : (language === 'zh-CN' ? '添加产品' : 'Add Product')}
            </h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'zh-CN' ? '产品名称 (中文)' : 'Product Name (Chinese)'}
                </label>
                <input
                  type="text"
                  value={formData.name.zh}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: { ...prev.name, zh: e.target.value } }))}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'zh-CN' ? '产品名称 (英文)' : 'Product Name (English)'}
                </label>
                <input
                  type="text"
                  value={formData.name.en}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: { ...prev.name, en: e.target.value } }))}
                  className="input-field"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'zh-CN' ? '产品描述 (中文)' : 'Description (Chinese)'}
                </label>
                <textarea
                  value={formData.description.zh}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: { ...prev.description, zh: e.target.value } }))}
                  className="input-field min-h-[100px]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'zh-CN' ? '产品描述 (英文)' : 'Description (English)'}
                </label>
                <textarea
                  value={formData.description.en}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: { ...prev.description, en: e.target.value } }))}
                  className="input-field min-h-[100px]"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'zh-CN' ? '分类' : 'Category'}
                </label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'zh-CN' ? '价格' : 'Price'}
                </label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                  className="input-field"
                  step="0.01"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'zh-CN' ? '排序' : 'Sort Order'}
                </label>
                <input
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData(prev => ({ ...prev, order: parseInt(e.target.value) || 0 }))}
                  className="input-field"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'zh-CN' ? '产品图片链接' : 'Product Image URLs'}
              </label>
              <div className="space-y-2">
                {formData.images.map((url, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="url"
                      value={url}
                      onChange={(e) => handleImageUrlChange(index, e.target.value)}
                      className="input-field flex-1"
                      placeholder="https://..."
                    />
                    <button
                      type="button"
                      onClick={() => handleImageUrlRemove(index)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={handleImageUrlAdd}
                  className="flex items-center text-sm text-primary-600 hover:text-primary-700"
                >
                  <Upload className="w-4 h-4 mr-1" />
                  {language === 'zh-CN' ? '添加图片链接' : 'Add Image URL'}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'zh-CN' ? '产品规格' : 'Product Specifications'}
              </label>
              <div className="space-y-2">
                {formData.specifications.map((spec, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={spec.key}
                      onChange={(e) => handleSpecChange(index, 'key', e.target.value)}
                      className="input-field flex-1"
                      placeholder={language === 'zh-CN' ? '规格名称' : 'Spec Name'}
                    />
                    <input
                      type="text"
                      value={spec.value}
                      onChange={(e) => handleSpecChange(index, 'value', e.target.value)}
                      className="input-field flex-1"
                      placeholder={language === 'zh-CN' ? '规格值' : 'Spec Value'}
                    />
                    <button
                      type="button"
                      onClick={() => handleSpecRemove(index)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={handleSpecAdd}
                  className="flex items-center text-sm text-primary-600 hover:text-primary-700"
                >
                  <Upload className="w-4 h-4 mr-1" />
                  {language === 'zh-CN' ? '添加规格' : 'Add Specification'}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'zh-CN' ? '状态' : 'Status'}
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                  className="input-field"
                >
                  <option value="active">{language === 'zh-CN' ? '上架' : 'Active'}</option>
                  <option value="inactive">{language === 'zh-CN' ? '下架' : 'Inactive'}</option>
                </select>
              </div>
              <div className="flex items-center">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                    className="w-4 h-4 text-primary-600 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    {language === 'zh-CN' ? '设为精选产品' : 'Mark as Featured'}
                  </span>
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                {language === 'zh-CN' ? '取消' : 'Cancel'}
              </button>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary disabled:opacity-50"
              >
                {loading
                  ? (language === 'zh-CN' ? '保存中...' : 'Saving...')
                  : (language === 'zh-CN' ? '保存' : 'Save')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
