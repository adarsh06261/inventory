import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { 
  Plus, 
  Search, 
  Edit, 
  Package, 
  Filter,
  X,
  Save,
  Loader
} from 'lucide-react';
import { productsAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [stockFilter, setStockFilter] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productsAPI.getAll({ limit: 100 });
      setProducts(response.products || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      if (editingProduct) {
        // For editing, we only support quantity updates based on backend API
        if (editingProduct.quantity !== parseInt(data.quantity)) {
          await productsAPI.updateQuantity(editingProduct.id, parseInt(data.quantity));
          toast.success('Product quantity updated successfully');
        }
      } else {
        // Add new product
        await productsAPI.create({
          ...data,
          quantity: parseInt(data.quantity),
          price: parseFloat(data.price),
        });
        toast.success('Product added successfully');
      }
      
      await fetchProducts();
      handleCancel();
    } catch (error) {
      console.error('Error saving product:', error);
      const message = error.response?.data?.message || 'Failed to save product';
      toast.error(message);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setValue('name', product.name);
    setValue('type', product.type);
    setValue('sku', product.sku);
    setValue('imageUrl', product.imageUrl || '');
    setValue('description', product.description || '');
    setValue('quantity', product.quantity);
    setValue('price', product.price);
    setShowAddForm(true);
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setEditingProduct(null);
    reset();
  };

  const handleQuantityUpdate = async (productId, newQuantity) => {
    try {
      await productsAPI.updateQuantity(productId, parseInt(newQuantity));
      toast.success('Quantity updated successfully');
      await fetchProducts();
    } catch (error) {
      console.error('Error updating quantity:', error);
      toast.error('Failed to update quantity');
    }
  };

  // Filter products based on search and filters
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = !typeFilter || product.type === typeFilter;
    
    const matchesStock = !stockFilter || 
                        (stockFilter === 'in-stock' && product.quantity > 10) ||
                        (stockFilter === 'low-stock' && product.quantity > 0 && product.quantity <= 10) ||
                        (stockFilter === 'out-of-stock' && product.quantity === 0);
    
    return matchesSearch && matchesType && matchesStock;
  });

  // Get unique product types for filter
  const productTypes = [...new Set(products.map(product => product.type))];

  if (loading) {
    return <LoadingSpinner text="Loading products..." />;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="gradient-card p-8 relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">Products</h1>
            <p className="text-white/70 mt-2 text-lg">Manage your inventory items with style</p>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="mt-4 sm:mt-0 btn-primary flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>Add Product</span>
          </button>
        </div>
        {/* Decorative elements */}
        <div className="absolute top-4 right-4 w-32 h-32 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-4 left-1/3 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl"></div>
      </div>

      {/* Filters */}
      <div className="glass-card p-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/60" />
            <input
              type="text"
              placeholder="Search products..."
              className="input-field pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Type Filter */}
          <select
            className="input-field"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="">All Types</option>
            {productTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>

          {/* Stock Filter */}
          <select
            className="input-field"
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value)}
          >
            <option value="">All Stock Levels</option>
            <option value="in-stock">In Stock</option>
            <option value="low-stock">Low Stock</option>
            <option value="out-of-stock">Out of Stock</option>
          </select>

          {/* Clear Filters */}
          {(searchTerm || typeFilter || stockFilter) && (
            <button
              onClick={() => {
                setSearchTerm('');
                setTypeFilter('');
                setStockFilter('');
              }}
              className="btn-outline flex items-center space-x-2"
            >
              <X className="h-4 w-4" />
              <span>Clear</span>
            </button>
          )}
        </div>
      </div>

      {/* Add/Edit Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" onClick={handleCancel}>
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
            </div>

            <div className="inline-block align-bottom glass-card px-6 pt-6 pb-6 text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-8 relative">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-white">
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </h3>
                <button
                  onClick={handleCancel}
                  className="text-white/60 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Name */}
                <div className="form-group">
                  <label className="form-label">Product Name</label>
                  <input
                    type="text"
                    className="input-field"
                    disabled={!!editingProduct}
                    {...register('name', { required: 'Name is required' })}
                  />
                  {errors.name && <p className="form-error">{errors.name.message}</p>}
                </div>

                {/* Type */}
                <div className="form-group">
                  <label className="form-label">Type</label>
                  <input
                    type="text"
                    className="input-field"
                    disabled={!!editingProduct}
                    {...register('type', { required: 'Type is required' })}
                  />
                  {errors.type && <p className="form-error">{errors.type.message}</p>}
                </div>

                {/* SKU */}
                <div className="form-group">
                  <label className="form-label">SKU</label>
                  <input
                    type="text"
                    className="input-field"
                    disabled={!!editingProduct}
                    {...register('sku', { required: 'SKU is required' })}
                  />
                  {errors.sku && <p className="form-error">{errors.sku.message}</p>}
                </div>

                {/* Image URL */}
                <div className="form-group">
                  <label className="form-label">Image URL (Optional)</label>
                  <input
                    type="url"
                    className="input-field"
                    disabled={!!editingProduct}
                    {...register('imageUrl')}
                  />
                </div>

                {/* Description */}
                <div className="form-group">
                  <label className="form-label">Description (Optional)</label>
                  <textarea
                    className="input-field"
                    rows={3}
                    disabled={!!editingProduct}
                    {...register('description')}
                  />
                </div>

                {/* Quantity */}
                <div className="form-group">
                  <label className="form-label">Quantity</label>
                  <input
                    type="number"
                    min="0"
                    className="input-field"
                    {...register('quantity', { 
                      required: 'Quantity is required',
                      min: { value: 0, message: 'Quantity must be 0 or greater' }
                    })}
                  />
                  {errors.quantity && <p className="form-error">{errors.quantity.message}</p>}
                </div>

                {/* Price */}
                <div className="form-group">
                  <label className="form-label">Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    className="input-field"
                    disabled={!!editingProduct}
                    {...register('price', { 
                      required: 'Price is required',
                      min: { value: 0, message: 'Price must be 0 or greater' }
                    })}
                  />
                  {errors.price && <p className="form-error">{errors.price.message}</p>}
                </div>

                {editingProduct && (
                  <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-xl p-4">
                    <p className="text-sm text-yellow-400 font-medium">
                      Note: Only quantity can be updated for existing products.
                    </p>
                  </div>
                )}

                <div className="flex space-x-3 pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 btn-primary flex items-center justify-center space-x-2"
                  >
                    {isSubmitting ? (
                      <Loader className="h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                    <span>{isSubmitting ? 'Saving...' : 'Save'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="flex-1 btn-outline"
                  >
                    Cancel
                  </button>
                </div>
              </form>

              {/* Decorative Elements */}
              <div className="absolute top-4 right-4 w-8 h-8 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-sm"></div>
              <div className="absolute bottom-4 left-4 w-6 h-6 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-sm"></div>
            </div>
          </div>
        </div>
      )}

      {/* Products Table */}
      <div className="glass-card overflow-hidden">
        {filteredProducts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="table-header">
                  <th className="px-6 py-4 text-left text-sm font-semibold rounded-l-xl">
                    Product
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    Type
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    Quantity
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    Price
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold rounded-r-xl">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="space-y-2">
                {filteredProducts.map((product) => (
                  <ProductRow
                    key={product.id}
                    product={product}
                    onEdit={handleEdit}
                    onQuantityUpdate={handleQuantityUpdate}
                  />
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="bg-white/5 p-8 rounded-2xl max-w-md mx-auto">
              <Package className="h-16 w-16 text-white/30 mx-auto mb-4" />
              <p className="text-white/70 text-lg mb-4">
                {products.length === 0 ? 'No products found' : 'No products match your filters'}
              </p>
              {products.length === 0 && (
                <button
                  onClick={() => setShowAddForm(true)}
                  className="btn-primary inline-flex items-center space-x-2"
                >
                  <Plus className="h-5 w-5" />
                  <span>Add your first product</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Product Row Component
const ProductRow = ({ product, onEdit, onQuantityUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newQuantity, setNewQuantity] = useState(product.quantity);

  const handleQuantitySubmit = async (e) => {
    e.preventDefault();
    if (newQuantity !== product.quantity) {
      await onQuantityUpdate(product.id, newQuantity);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setNewQuantity(product.quantity);
    setIsEditing(false);
  };

  return (
    <tr className="table-row">
      <td className="px-6 py-4">
        <div className="flex items-center">
          {product.imageUrl && (
            <img 
              className="h-12 w-12 rounded-xl object-cover mr-4 border border-white/20" 
              src={product.imageUrl} 
              alt={product.name}
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          )}
          <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 p-3 rounded-lg mr-4">
            <Package className="h-6 w-6 text-purple-400" />
          </div>
          <div>
            <div className="text-sm font-semibold text-white">{product.name}</div>
            <div className="text-sm text-white/60">SKU: {product.sku}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 text-sm text-white/80">
        {product.type}
      </td>
      <td className="px-6 py-4">
        {isEditing ? (
          <form onSubmit={handleQuantitySubmit} className="flex items-center space-x-2">
            <input
              type="number"
              min="0"
              value={newQuantity}
              onChange={(e) => setNewQuantity(parseInt(e.target.value) || 0)}
              className="w-20 px-3 py-2 text-sm bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              autoFocus
            />
            <button type="submit" className="text-emerald-400 hover:text-emerald-300 p-1 hover:bg-emerald-500/20 rounded-lg transition-colors">
              <Save className="h-4 w-4" />
            </button>
            <button type="button" onClick={handleCancel} className="text-white/60 hover:text-white p-1 hover:bg-white/10 rounded-lg transition-colors">
              <X className="h-4 w-4" />
            </button>
          </form>
        ) : (
          <div 
            className="text-sm text-white/80 cursor-pointer hover:bg-white/10 px-3 py-2 rounded-lg transition-colors font-semibold"
            onClick={() => setIsEditing(true)}
          >
            {product.quantity}
          </div>
        )}
      </td>
      <td className="px-6 py-4 text-sm text-white/80 font-semibold">
        ${product.price?.toFixed(2)}
      </td>
      <td className="px-6 py-4">
        <span
          className={`badge ${
            product.quantity === 0
              ? 'badge-danger'
              : product.quantity <= 10
              ? 'badge-warning'
              : 'badge-success'
          }`}
        >
          {product.quantity === 0
            ? 'Out of Stock'
            : product.quantity <= 10
            ? 'Low Stock'
            : 'In Stock'}
        </span>
      </td>
      <td className="px-6 py-4">
        <button
          onClick={() => onEdit(product)}
          className="text-purple-400 hover:text-purple-300 flex items-center space-x-2 px-3 py-2 hover:bg-purple-500/20 rounded-lg transition-all duration-200"
        >
          <Edit className="h-4 w-4" />
          <span>Edit</span>
        </button>
      </td>
    </tr>
  );
};

export default Products; 