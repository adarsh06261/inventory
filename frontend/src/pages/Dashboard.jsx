import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Package, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle,
  Plus,
  Eye,
  Sparkles,
  ArrowUpRight,
  DollarSign,
  Activity
} from 'lucide-react';
import { productsAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalValue: 0,
    lowStock: 0,
    outOfStock: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productsAPI.getAll({ limit: 100 }); // Get products for stats (max 100)
      const productsList = response.products || [];
      setProducts(productsList);
      
      // Calculate stats
      const totalProducts = productsList.length;
      const totalValue = productsList.reduce((sum, product) => sum + (product.price * product.quantity), 0);
      const lowStock = productsList.filter(product => product.quantity > 0 && product.quantity <= 10).length;
      const outOfStock = productsList.filter(product => product.quantity === 0).length;
      
      setStats({
        totalProducts,
        totalValue,
        lowStock,
        outOfStock
      });
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const recentProducts = products.slice(0, 5);

  if (loading) {
    return <LoadingSpinner text="Loading dashboard..." />;
  }

  const statCards = [
    {
      title: 'Total Products',
      value: stats.totalProducts,
      icon: Package,
      gradient: 'from-blue-500 to-purple-600',
      change: '+12% from last month'
    },
    {
      title: 'Inventory Value',
      value: `$${stats.totalValue.toLocaleString()}`,
      icon: DollarSign,
      gradient: 'from-emerald-500 to-teal-600',
      change: '+8% from last month'
    },
    {
      title: 'Low Stock Items',
      value: stats.lowStock,
      icon: TrendingDown,
      gradient: 'from-yellow-500 to-orange-600',
      change: stats.lowStock > 0 ? 'Needs attention' : 'All good!'
    },
    {
      title: 'Out of Stock',
      value: stats.outOfStock,
      icon: AlertTriangle,
      gradient: 'from-red-500 to-pink-600',
      change: stats.outOfStock > 0 ? 'Urgent restocking' : 'All in stock'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column - Welcome & Key Stats */}
        <div className="lg:col-span-2 space-y-6">
          {/* Compact Welcome Header */}
          <div className="gradient-card p-6 relative overflow-hidden">
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-3 rounded-xl shadow-lg animation-glow">
                  <Activity className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                    Inventory Command Center
                  </h1>
                  <p className="text-white/60 text-sm">Real-time insights & analytics</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-white/90 font-semibold">Today</p>
                <p className="text-white/60 text-sm">{new Date().toLocaleDateString()}</p>
              </div>
            </div>
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/5 rounded-full blur-2xl"></div>
          </div>

          {/* Primary Stats - 2x2 Grid */}
          <div className="grid grid-cols-2 gap-6">
            {statCards.slice(0, 2).map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="stats-card group cursor-pointer">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-4 rounded-xl bg-gradient-to-r ${stat.gradient} shadow-lg group-hover:shadow-xl transition-all duration-300`}>
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <ArrowUpRight className="h-5 w-5 text-white/60 group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white/70 mb-1">{stat.title}</p>
                    <p className="text-4xl font-bold text-white mb-2">{stat.value}</p>
                    <p className="text-xs text-white/50">{stat.change}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column - Alerts & Secondary Stats */}
        <div className="space-y-6">
          {/* Alert Cards - Stacked */}
          {statCards.slice(2, 4).map((stat, index) => {
            const Icon = stat.icon;
            const isAlert = stat.value > 0;
            return (
              <div key={index} className={`stats-card group cursor-pointer ${isAlert ? 'border-2 border-yellow-500/30 animation-glow' : ''}`}>
                <div className="flex items-center space-x-4 mb-3">
                  <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.gradient} shadow-lg group-hover:shadow-xl transition-all duration-300`}>
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white/70">{stat.title}</p>
                    <p className="text-2xl font-bold text-white">{stat.value}</p>
                  </div>
                </div>
                <div className="text-xs text-white/50 bg-white/5 rounded-lg p-2">
                  {stat.change}
                </div>
              </div>
            );
          })}

          {/* Quick Insights */}
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <Sparkles className="h-5 w-5 mr-2 text-purple-400" />
              Quick Insights
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-white/70 text-sm">Total Value</span>
                <span className="text-white font-semibold">${stats.totalValue.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/70 text-sm">Avg. Product Value</span>
                <span className="text-white font-semibold">
                  ${stats.totalProducts > 0 ? (stats.totalValue / stats.totalProducts).toFixed(0) : 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/70 text-sm">Stock Health</span>
                <span className={`font-semibold ${stats.outOfStock === 0 ? 'text-emerald-400' : 'text-yellow-400'}`}>
                  {stats.outOfStock === 0 ? 'Excellent' : 'Needs Attention'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions - Full Width */}
      <div className="glass-card p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Sparkles className="h-6 w-6 text-purple-400" />
            <h2 className="text-2xl font-bold text-white">Quick Actions</h2>
          </div>
          <div className="text-white/60 text-sm">Choose an action to get started</div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            to="/products"
            className="gradient-card p-6 group hover:scale-105 transition-all duration-300"
          >
            <div className="text-center">
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-4 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300 mx-auto w-fit mb-4">
                <Plus className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-semibold text-white text-lg mb-2">Add New Product</h3>
              <p className="text-white/70 text-sm">Expand your inventory catalog</p>
            </div>
          </Link>
          
          <Link
            to="/products"
            className="gradient-card p-6 group hover:scale-105 transition-all duration-300"
          >
            <div className="text-center">
              <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-4 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300 mx-auto w-fit mb-4">
                <Eye className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-semibold text-white text-lg mb-2">View All Products</h3>
              <p className="text-white/70 text-sm">Manage your entire inventory</p>
            </div>
          </Link>

          <Link
            to="/products"
            className="gradient-card p-6 group hover:scale-105 transition-all duration-300"
          >
            <div className="text-center">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300 mx-auto w-fit mb-4">
                <Activity className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-semibold text-white text-lg mb-2">Analytics</h3>
              <p className="text-white/70 text-sm">View detailed reports</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Recent Products */}
      <div className="glass-card p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Package className="h-6 w-6 text-purple-400" />
            <h2 className="text-2xl font-bold text-white">Recent Products</h2>
          </div>
          <Link
            to="/products"
            className="text-purple-400 hover:text-purple-300 font-semibold transition-colors duration-200 flex items-center space-x-2"
          >
            <span>View all</span>
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
        
        {recentProducts.length > 0 ? (
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
                  <th className="px-6 py-4 text-left text-sm font-semibold rounded-r-xl">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="space-y-2">
                {recentProducts.map((product, index) => (
                  <tr key={product.id} className="table-row">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 p-2 rounded-lg mr-3">
                          <Package className="h-5 w-5 text-purple-400" />
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-white">
                            {product.name}
                          </div>
                          <div className="text-sm text-white/60">
                            SKU: {product.sku}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-white/80">
                      {product.type}
                    </td>
                    <td className="px-6 py-4 text-sm text-white/80">
                      {product.quantity}
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="bg-white/5 p-8 rounded-2xl max-w-md mx-auto">
              <Package className="h-16 w-16 text-white/30 mx-auto mb-4" />
              <p className="text-white/70 text-lg mb-4">No products found</p>
              <Link
                to="/products"
                className="btn-primary inline-flex items-center space-x-2"
              >
                <Plus className="h-5 w-5" />
                <span>Add your first product</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard; 