import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  Tags, 
  Database, 
  DollarSign, 
  ShoppingCart, 
  Users, 
  Image as ImageIcon, 
  Settings as SettingsIcon,
  Plus,
  RefreshCw,
  X,
  Eye,
  EyeOff,
  AlertTriangle,
  TrendingUp,
  BarChart3,
  Search,
  Filter,
  Layers,
  MoreVertical,
  Edit,
  Trash2,
  CheckCircle2,
  ChevronRight,
  Menu,
  Waves,
  LayoutGrid,
  List,
  Upload,
  Link,
  FileSpreadsheet
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { cn } from '../lib/utils';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../components/Toast';
import { useStore, Product, Category, Order, OrderStatus, Vendor, SupplierType, MediaItem, Settings } from '../lib/store';

type MainTab = 'Dashboard' | 'Product Control' | 'Categories' | 'Inventory' | 'Pricing' | 'Orders' | 'Vendors' | 'Media' | 'Settings';

export default function AdminDashboard() {
  const { 
    products, 
    updateProduct, 
    deleteProduct, 
    categories, 
    updateCategory, 
    addCategory, 
    deleteCategory, 
    reorderCategories,
    orders,
    updateOrderStatus,
    vendors,
    supply,
    performance,
    addVendor,
    updateVendor,
    deleteVendor,
    addSupplyEntry,
    updateSupplyEntry,
    deleteSupplyEntry,
    media,
    addMedia,
    updateMedia,
    deleteMedia,
    assignMediaToProduct,
    settings,
    updateSettings,
    resetSettings,
    bulkAddProducts
  } = useStore();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [activeModule, setActiveModule] = useState<MainTab>('Dashboard');
  const [activeSubModule, setActiveSubModule] = useState('All Products');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  const [settingsSection, setSettingsSection] = useState<'General' | 'Delivery' | 'Units' | 'Visibility' | 'System'>('General');

  const [mediaView, setMediaView] = useState<'grid' | 'list'>('grid');
  const [mediaSearch, setMediaSearch] = useState('');
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedMediaId, setSelectedMediaId] = useState<string | null>(null);
  const [assignProductId, setAssignProductId] = useState(0);

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [availabilityFilter, setAvailabilityFilter] = useState('All');
  const [visibilityFilter, setVisibilityFilter] = useState('All');

  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [catVisibilityConsumer, setCatVisibilityConsumer] = useState(true);
  const [catVisibilityB2B, setCatVisibilityB2B] = useState(true);

  const [inventorySearch, setInventorySearch] = useState('');
  const [inventoryCategory, setInventoryCategory] = useState('All');
  const [inventoryStatus, setInventoryStatus] = useState('All');
  const [selectedInventoryIds, setSelectedInventoryIds] = useState<number[]>([]);
  const [isAddStockModalOpen, setIsAddStockModalOpen] = useState(false);
  const [stockToUpdate, setStockToUpdate] = useState<Product | null>(null);
  const [additionalStockQty, setAdditionalStockQty] = useState(0);
  const [isBulkStockModalOpen, setIsBulkStockModalOpen] = useState(false);
  const [bulkStockQty, setBulkStockQty] = useState(0);

  const [pricingSearch, setPricingSearch] = useState('');
  const [pricingCategory, setPricingCategory] = useState('All');
  const [pricingVisibility, setPricingVisibility] = useState('All');
  const [selectedPricingIds, setSelectedPricingIds] = useState<number[]>([]);
  const [isBulkPriceModalOpen, setIsBulkPriceModalOpen] = useState(false);
  const [bulkPriceAction, setBulkPriceAction] = useState<'increase' | 'decrease' | 'set'>('increase');
  const [bulkPriceTarget, setBulkPriceTarget] = useState<'consumer' | 'b2b' | 'both'>('both');
  const [bulkPriceValue, setBulkPriceValue] = useState(0);
  const [bulkPriceType, setBulkPriceType] = useState<'percentage' | 'fixed'>('percentage');

  const [orderSearch, setOrderSearch] = useState('');
  const [orderTypeFilter, setOrderTypeFilter] = useState<'All' | 'Consumer' | 'B2B'>('All');
  const [orderStatusFilter, setOrderStatusFilter] = useState<'All' | OrderStatus>('All');
  const [orderDateFilter, setOrderDateFilter] = useState('All Time');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isOrderDetailsModalOpen, setIsOrderDetailsModalOpen] = useState(false);

  const [vendorSearch, setVendorSearch] = useState('');
  const [isVendorModalOpen, setIsVendorModalOpen] = useState(false);
  const [editingVendor, setEditingVendor] = useState<Vendor | null>(null);
  const [vendorName, setVendorName] = useState('');
  const [vendorLocation, setVendorLocation] = useState('');
  const [vendorType, setVendorType] = useState<SupplierType>('Fisherman');
  const [vendorFishTypes, setVendorFishTypes] = useState<string[]>([]);

  const [supplySearch, setSupplySearch] = useState('');
  const [supplyFishFilter, setSupplyFishFilter] = useState('All');
  const [isSupplyModalOpen, setIsSupplyModalOpen] = useState(false);
  const [supplyVendorId, setSupplyVendorId] = useState(0);
  const [supplyFishName, setSupplyFishName] = useState('');
  const [supplyPrice, setSupplyPrice] = useState(0);
  const [supplyQty, setSupplyQty] = useState(0);
  const [supplyTime, setSupplyTime] = useState<'Morning' | 'Evening'>('Morning');

  const handleToggleVisibility = (id: number, type: 'Consumer' | 'B2B') => {
    const product = products.find(p => p.id === id);
    if (!product) return;
    
    if (type === 'Consumer') {
      updateProduct(id, { isVisibleConsumer: !product.isVisibleConsumer });
    } else {
      updateProduct(id, { isVisibleB2B: !product.isVisibleB2B });
    }
    showToast(`Visibility updated for ${product.name}`, "success");
  };

  const handleStockUpdate = (id: number, newStock: number) => {
    updateProduct(id, { stock: newStock });
    showToast("Stock levels updated", "success");
  };

  const menuItems = [
    { id: 'Dashboard', icon: LayoutDashboard },
    { id: 'Product Control', icon: Package, subTabs: ['All Products', 'Add Product', 'Excel Import', 'Visibility Control'] },
    { id: 'Categories', icon: Tags },
    { id: 'Inventory', icon: Database, subTabs: ['Live Stock', 'Update Stock', 'Stock Alerts'] },
    { id: 'Pricing', icon: DollarSign, subTabs: ['Product Pricing', 'Bulk Pricing', 'B2B Pricing'] },
    { id: 'Orders', icon: ShoppingCart },
    { id: 'Vendors', icon: Users, subTabs: ['Vendor List', 'Supply Mapping', 'Vendor Performance'] },
    { id: 'Media', icon: ImageIcon },
    { id: 'Settings', icon: SettingsIcon, subTabs: ['General', 'Delivery', 'Units', 'Visibility', 'System'] },
  ];

  const renderContent = () => {
    switch (activeModule) {
      case 'Dashboard':
        const lowStockItems = products.filter(p => p.stock < 100);
        const metrics = [
          { label: 'Orders Today', value: '24', icon: ShoppingCart },
          { label: 'Total Revenue Today', value: '$12,450', icon: DollarSign },
          { label: 'Available Stock (kg)', value: products.reduce((acc, p) => acc + (p.unit === 'kg' ? p.stock : 0), 0).toLocaleString(), icon: Database },
          { label: 'Low Stock Items', value: lowStockItems.length.toString(), icon: AlertTriangle, color: 'text-red-500' },
          { label: 'Active Products', value: products.filter(p => p.isVisibleConsumer || p.isVisibleB2B).length.toString(), icon: Package },
        ];

        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {metrics.map((m) => (
                <div key={m.label} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={cn("p-1.5 rounded-lg bg-gray-50", m.color || "text-gray-400")}>
                      <m.icon size={16} />
                    </div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{m.label}</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">{m.value}</h3>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                  <div className="p-4 border-b border-gray-100 bg-gray-50/50">
                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-tight">Low Stock Alerts</h3>
                  </div>
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-white text-[10px] uppercase tracking-widest font-bold text-gray-400 border-b border-gray-100">
                        <th className="px-6 py-3">Fish Name</th>
                        <th className="px-6 py-3">Current Stock</th>
                        <th className="px-6 py-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {lowStockItems.length > 0 ? (
                        lowStockItems.map((p) => (
                          <tr key={p.id}>
                            <td className="px-6 py-3 text-sm font-bold text-gray-900">{p.name}</td>
                            <td className="px-6 py-3 text-sm text-gray-500 font-mono">{p.stock} {p.unit}</td>
                            <td className="px-6 py-3">
                              <span className={cn(
                                "text-[10px] font-bold uppercase px-2 py-0.5 rounded-full",
                                p.stock < 50 ? "bg-red-50 text-red-600" : "bg-amber-50 text-amber-600"
                              )}>
                                {p.stock < 50 ? 'Critical' : 'Low'}
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={3} className="px-6 py-8 text-center text-sm text-gray-400 font-medium">All inventory levels are stable.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
                  <div className="p-4 border-b border-gray-100 bg-gray-50/50">
                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-tight">Recent Activity</h3>
                  </div>
                  <div className="p-4 divide-y divide-gray-100">
                    {[
                      { action: 'Product added', detail: 'Premium Yellowfin Tuna', time: '12m ago' },
                      { action: 'Stock updated', detail: 'Atlantic Salmon (+200kg)', time: '45m ago' },
                      { action: 'Order placed', detail: 'Order #MS-9921 from Ocean Catch', time: '1h ago' },
                      { action: 'Price changed', detail: 'King Crab adjusted to $55.00', time: '3h ago' },
                    ].map((item, i) => (
                      <div key={i} className="py-3 flex items-center justify-between first:pt-0 last:pb-0">
                        <div>
                          <p className="text-sm font-bold text-gray-900">{item.action}</p>
                          <p className="text-xs text-gray-500">{item.detail}</p>
                        </div>
                        <span className="text-[10px] font-bold text-gray-400 uppercase">{item.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-tight mb-4">Quick Actions</h3>
                  <div className="grid grid-cols-1 gap-3">
                    <button 
                      onClick={() => {
                        setActiveModule('Product Control');
                        setActiveSubModule('Add/Edit Product');
                      }}
                      className="w-full flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-xl hover:bg-brand-primary hover:text-white hover:border-brand-primary transition-all group"
                    >
                      <span className="text-sm font-bold">Add New Product</span>
                      <Plus size={16} className="text-gray-400 group-hover:text-white" />
                    </button>
                    <button 
                      onClick={() => {
                        setActiveModule('Inventory');
                        setActiveSubModule('Update Stock');
                      }}
                      className="w-full flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-xl hover:bg-brand-primary hover:text-white hover:border-brand-primary transition-all group"
                    >
                      <span className="text-sm font-bold">Update Stock</span>
                      <RefreshCw size={16} className="text-gray-400 group-hover:text-white" />
                    </button>
                    <button 
                      onClick={() => {
                        setActiveModule('Pricing');
                        setActiveSubModule('Product Pricing');
                      }}
                      className="w-full flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-xl hover:bg-brand-primary hover:text-white hover:border-brand-primary transition-all group"
                    >
                      <span className="text-sm font-bold">Change Price</span>
                      <DollarSign size={16} className="text-gray-400 group-hover:text-white" />
                    </button>
                  </div>
                </div>

                <div className="bg-brand-primary rounded-xl p-6 text-white shadow-lg shadow-brand-primary/20">
                  <p className="text-xs font-bold uppercase tracking-widest opacity-80 mb-2">Platform Health</p>
                  <div className="flex items-end justify-between">
                    <div>
                      <h4 className="text-2xl font-bold">99.9%</h4>
                      <p className="text-[10px] font-medium opacity-80">Operational Uptime</p>
                    </div>
                    <div className="h-10 w-20 flex items-end gap-1">
                       {[0.4, 0.6, 0.5, 0.9, 0.7, 0.8].map((v, i) => (
                         <div key={i} className="flex-1 bg-white/20 rounded-t" style={{ height: `${v*100}%` }} />
                       ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'Product Control':
        if (activeSubModule === 'Add Product') {
          return (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden p-8 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className="mb-8 border-b border-gray-100 pb-6 flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Product Configuration</h3>
                  <p className="text-sm text-gray-500 font-medium">Configure seafood asset metadata and market availability.</p>
                </div>
                <button 
                  onClick={() => setActiveSubModule('All Products')}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-400"
                >
                  <RefreshCw size={20} className="rotate-45" />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Fish Name</label>
                    <input type="text" placeholder="e.g. Atlantic Salmon" className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-bold focus:ring-2 focus:ring-brand-primary/10 transition-all outline-none" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Category</label>
                      <select className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-bold focus:ring-2 focus:ring-brand-primary/10 transition-all outline-none appearance-none cursor-pointer">
                        {categories.map(cat => (
                          <option key={cat.id} value={cat.name}>{cat.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Unit Type</label>
                      <select className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-bold focus:ring-2 focus:ring-brand-primary/10 transition-all outline-none appearance-none cursor-pointer">
                        <option>kg</option>
                        <option>pack</option>
                        <option>piece</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Price (₹/kg)</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold">₹</span>
                      <input type="number" placeholder="0.00" className="w-full pl-8 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-bold focus:ring-2 focus:ring-brand-primary/10 transition-all outline-none" />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Current Stock (kg)</label>
                    <input type="number" placeholder="0" className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-bold focus:ring-2 focus:ring-brand-primary/10 transition-all outline-none" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Image Reference (URL)</label>
                    <input type="text" placeholder="https://picsum.photos/seed/..." className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-bold focus:ring-2 focus:ring-brand-primary/10 transition-all outline-none" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Description (Optional)</label>
                    <textarea rows={3} placeholder="Provide key selling points..." className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium focus:ring-2 focus:ring-brand-primary/10 transition-all outline-none resize-none"></textarea>
                  </div>
                </div>
              </div>
              
              <div className="mt-12 pt-8 border-t border-gray-100 flex justify-end gap-3">
                <button 
                  onClick={() => setActiveSubModule('All Products')}
                  className="px-6 py-2.5 border border-gray-200 rounded-xl text-sm font-bold text-gray-500 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    showToast("Product updated successfully", "success");
                    setActiveSubModule('All Products');
                  }}
                  className="px-8 py-2.5 bg-brand-primary text-white rounded-xl text-sm font-bold shadow-lg shadow-brand-primary/20 hover:bg-brand-secondary transition-colors"
                >
                  Save Product
                </button>
              </div>
            </div>
          );
        }

        if (activeSubModule === 'Excel Import') {
          return (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden p-8 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className="mb-8 border-b border-gray-100 pb-6">
                <h3 className="text-xl font-bold text-gray-900">Excel Data Import</h3>
                <p className="text-sm text-gray-500 font-medium">Upload a .xlsx file to bulk import products into the system.</p>
              </div>

              <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-3xl p-12 bg-gray-50/50 hover:bg-gray-50 transition-all group">
                <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-gray-100 group-hover:scale-110 transition-transform duration-500">
                  <FileSpreadsheet size={32} className="text-emerald-500" />
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-2">Drop your Excel file here</h4>
                <p className="text-sm text-gray-400 mb-8">Supports .xlsx, .xls and .csv formats</p>
                
                <label className="px-8 py-3 bg-brand-primary text-white rounded-xl font-bold cursor-pointer hover:bg-brand-secondary transition-all shadow-lg shadow-brand-primary/20">
                  Select File
                  <input 
                    type="file" 
                    className="hidden" 
                    accept=".xlsx, .xls, .csv" 
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;

                      const reader = new FileReader();
                      reader.onload = (evt) => {
                        try {
                          const bstr = evt.target?.result;
                          const wb = XLSX.read(bstr, { type: 'binary' });
                          const wsname = wb.SheetNames[0];
                          const ws = wb.Sheets[wsname];
                          const data = XLSX.utils.sheet_to_json(ws);
                          
                          if (data.length === 0) {
                            showToast("No data found in the Excel file", "error");
                            return;
                          }

                          // Normalize data
                          const normalized = data.map((row: any) => ({
                            name: row['Product Name'] || row['name'] || row['Name'],
                            category: row['Category'] || row['category'],
                            price: parseFloat(row['Price'] || row['price'] || 0),
                            unit: row['Unit'] || row['unit'] || 'kg',
                            image: row['Image URL'] || row['image'] || row['imageUrl'],
                            origin: row['Origin'] || row['origin'],
                            description: row['Description'] || row['description']
                          })).filter(p => p.name);

                          bulkAddProducts(normalized);
                          showToast(`Successfully imported ${normalized.length} products`, "success");
                          setActiveSubModule('All Products');
                        } catch (err) {
                          showToast("Failed to parse Excel file", "error");
                          console.error(err);
                        }
                      };
                      reader.readAsBinaryString(file);
                    }}
                  />
                </label>

                <div className="mt-12 grid grid-cols-2 gap-8 w-full max-w-lg">
                  <div className="p-4 bg-white rounded-2xl border border-gray-100">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Required Columns</p>
                    <p className="text-xs font-bold text-gray-900">Product Name, Price</p>
                  </div>
                  <div className="p-4 bg-white rounded-2xl border border-gray-100">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Auto-Detection</p>
                    <p className="text-xs font-bold text-gray-900">Fish types automatically categorized</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 p-6 bg-amber-50 rounded-2xl border border-amber-100 flex gap-4">
                <AlertTriangle className="text-amber-500 shrink-0" size={20} />
                <div>
                  <p className="text-sm font-bold text-amber-900 mb-1">Before You Import</p>
                  <p className="text-xs text-amber-700 leading-relaxed font-medium">
                    Ensure your Excel headers match the requirements. If a category is not provided, the system will attempt to detect it based on the product name. Items like "Tuna" or "Salmon" will be automatically moved to the "Fish" category.
                  </p>
                </div>
              </div>
            </div>
          );
        }

        const filteredProducts = products.filter(p => {
          const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
          const matchesCategory = categoryFilter === 'All' || p.category === categoryFilter;
          const matchesAvailability = availabilityFilter === 'All' || 
            (availabilityFilter === 'In Stock' ? p.stock > 0 : p.stock === 0);
          const matchesVisibility = visibilityFilter === 'All' ||
            (visibilityFilter === 'Consumer' ? p.isVisibleConsumer : p.isVisibleB2B);
          
          return matchesSearch && matchesCategory && matchesAvailability && matchesVisibility;
        });

        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-4 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
              <div className="flex-1 flex items-center gap-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input 
                    type="text" 
                    placeholder="Search by fish name..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all"
                  />
                </div>
                
                <div className="flex items-center gap-2">
                  <select 
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-bold text-gray-600 outline-none hover:bg-gray-100 transition-colors cursor-pointer"
                  >
                    <option value="All">All Categories</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.name}>{cat.name}</option>
                    ))}
                  </select>

                  <select 
                    value={availabilityFilter}
                    onChange={(e) => setAvailabilityFilter(e.target.value)}
                    className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-bold text-gray-600 outline-none hover:bg-gray-100 transition-colors cursor-pointer"
                  >
                    <option value="All">All Availability</option>
                    <option value="In Stock">In Stock</option>
                    <option value="Out of Stock">Out of Stock</option>
                  </select>

                  <select 
                    value={visibilityFilter}
                    onChange={(e) => setVisibilityFilter(e.target.value)}
                    className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-bold text-gray-600 outline-none hover:bg-gray-100 transition-colors cursor-pointer"
                  >
                    <option value="All">All Visibility</option>
                    <option value="Consumer">Consumer Live</option>
                    <option value="B2B">B2B Live</option>
                  </select>
                </div>
              </div>
              
              <button 
                onClick={() => setActiveSubModule('Add/Edit Product')}
                className="flex items-center gap-2 px-4 py-2 bg-brand-primary text-white rounded-lg text-sm font-bold shadow-sm hover:bg-brand-secondary transition-colors shrink-0"
              >
                <Plus size={16} />
                Add New Product
              </button>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <table className="w-full text-left border-collapse table-fixed">
                <thead>
                  <tr className="bg-gray-50 text-[10px] uppercase tracking-widest font-bold text-gray-400 border-b border-gray-100">
                    <th className="px-6 py-4 w-1/4">Fish Name</th>
                    <th className="px-6 py-4 w-32">Category</th>
                    <th className="px-4 py-4 w-20">Image</th>
                    <th className="px-6 py-4 w-32">Price (₹/kg)</th>
                    <th className="px-6 py-4 w-32">Stock (kg)</th>
                    <th className="px-6 py-4 w-32">Status</th>
                    <th className="px-6 py-4 w-40">Visibility</th>
                    <th className="px-6 py-4 text-right w-24">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredProducts.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="px-6 py-4">
                        <span className="text-sm font-bold text-gray-900 group-hover:text-brand-primary transition-colors">{p.name}</span>
                        <p className="text-[10px] font-medium text-gray-400 mt-0.5">Updated: Just now</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-[10px] font-bold px-2 py-0.5 bg-gray-100 text-gray-500 rounded uppercase">{p.category}</span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                          <img src={p.image} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        </div>
                      </td>
                      <td className="px-6 py-4">
                         <div className="relative group/price">
                            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-bold">₹</span>
                            <input 
                              type="number"
                              defaultValue={p.price}
                              onBlur={(e) => {
                                updateProduct(p.id, { price: parseFloat(e.target.value) });
                                showToast(`${p.name} price adjusted to ₹${e.target.value}`, "success");
                              }}
                              className="w-full bg-gray-50 border border-gray-100 rounded px-5 py-1 text-sm font-bold focus:ring-1 focus:ring-brand-primary/20 outline-none"
                            />
                         </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-gray-900">
                         <input 
                            type="number"
                            defaultValue={p.stock}
                            onBlur={(e) => {
                              const newStock = parseInt(e.target.value);
                              updateProduct(p.id, { stock: newStock });
                              showToast(`${p.name} stock updated to ${newStock}kg`, "success");
                            }}
                            className="w-full bg-gray-50 border border-gray-100 rounded px-2 py-1 text-sm font-bold focus:ring-1 focus:ring-brand-primary/20 outline-none"
                          />
                      </td>
                      <td className="px-6 py-4">
                        <span className={cn(
                          "text-[10px] font-bold uppercase px-2 py-1 rounded",
                          p.stock > 0 ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
                        )}>{p.stock > 0 ? 'In Stock' : 'Out of Stock'}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                           <button 
                             onClick={() => handleToggleVisibility(p.id, 'Consumer')}
                             className={cn(
                               "flex items-center gap-1 px-2 py-1 rounded text-[10px] font-bold border transition-all",
                               p.isVisibleConsumer ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-gray-50 text-gray-400 border-gray-100"
                             )}
                           >
                              {p.isVisibleConsumer ? <CheckCircle2 size={12} /> : <EyeOff size={12} />}
                              CONS
                           </button>
                           <button 
                             onClick={() => handleToggleVisibility(p.id, 'B2B')}
                             className={cn(
                               "flex items-center gap-1 px-2 py-1 rounded text-[10px] font-bold border transition-all",
                               p.isVisibleB2B ? "bg-blue-50 text-blue-600 border-blue-100" : "bg-gray-50 text-gray-400 border-gray-100"
                             )}
                           >
                              {p.isVisibleB2B ? <CheckCircle2 size={12} /> : <EyeOff size={12} />}
                              B2B
                           </button>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                         <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                              onClick={() => {
                                if(window.confirm(`Are you sure you want to delete ${p.name}?`)) {
                                  deleteProduct(p.id);
                                  showToast("Product purged from system", "success");
                                }
                              }}
                              className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-all"
                            >
                               <Trash2 size={16} />
                            </button>
                         </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredProducts.length === 0 && (
                <div className="p-12 text-center">
                   <Package size={48} className="mx-auto text-gray-100 mb-4" />
                   <p className="text-sm font-bold text-gray-400">No products match your current filters.</p>
                </div>
              )}
            </div>
          </div>
        );
      case 'Inventory':
        const filteredInventoryBase = products.filter(p => {
          const matchesSearch = p.name.toLowerCase().includes(inventorySearch.toLowerCase());
          const matchesCategory = inventoryCategory === 'All' || p.category === inventoryCategory;
          
          if (activeSubModule === 'Stock Alerts') {
             const remaining = p.stock + p.incomingStock - p.soldToday;
             if (remaining >= 100) return false;
          }

          const totalStock = p.stock + p.incomingStock - p.soldToday;
          const matchesStatus = inventoryStatus === 'All' || 
            (inventoryStatus === 'Out of Stock' && totalStock <= 0) ||
            (inventoryStatus === 'Low' && totalStock > 0 && totalStock < 100) ||
            (inventoryStatus === 'In Stock' && totalStock >= 100);
          
          return matchesSearch && matchesCategory && matchesStatus;
        });

        const toggleSelection = (id: number) => {
          setSelectedInventoryIds(prev => 
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
          );
        };

        const toggleAllSelection = () => {
          if (selectedInventoryIds.length === filteredInventoryBase.length) {
            setSelectedInventoryIds([]);
          } else {
            setSelectedInventoryIds(filteredInventoryBase.map(p => p.id));
          }
        };

        return (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex items-center justify-between bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <div>
                <h1 className="text-xl font-bold text-gray-900 mb-1">
                  {activeSubModule === 'Stock Alerts' ? 'Inventory Alerts & Risks' : 'Inventory Management'}
                </h1>
                <p className="text-sm text-gray-500 font-medium">
                  {activeSubModule === 'Stock Alerts' 
                    ? 'Monitoring critical stock levels and potential fulfillment blockers.' 
                    : 'Real-time stock monitoring and distribution control.'}
                </p>
              </div>
              <div className="flex gap-3">
                {selectedInventoryIds.length > 0 && (
                  <button 
                    onClick={() => setIsBulkStockModalOpen(true)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-brand-primary/10 text-brand-primary rounded-xl text-sm font-bold border border-brand-primary/20 hover:bg-brand-primary/20 transition-all"
                  >
                    <Layers size={18} />
                    Bulk Update ({selectedInventoryIds.length})
                  </button>
                )}
                <button 
                  onClick={() => showToast("Downloading stock inventory report...", "success")}
                  className="flex items-center gap-2 px-5 py-2.5 bg-gray-50 text-gray-600 rounded-xl text-sm font-bold border border-gray-200 hover:bg-gray-100 transition-all"
                >
                  <RefreshCw size={18} />
                  Export Sheet
                </button>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input 
                  type="text" 
                  placeholder="Search inventory by fish name..." 
                  value={inventorySearch}
                  onChange={(e) => setInventorySearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/10 transition-all"
                />
              </div>
              <select 
                value={inventoryCategory}
                onChange={(e) => setInventoryCategory(e.target.value)}
                className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-bold text-gray-600 outline-none hover:border-brand-primary/30 transition-all cursor-pointer"
              >
                <option value="All">All Categories</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.name}>{cat.name}</option>
                ))}
              </select>
              {activeSubModule !== 'Stock Alerts' && (
                <select 
                  value={inventoryStatus}
                  onChange={(e) => setInventoryStatus(e.target.value)}
                  className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-bold text-gray-600 outline-none hover:border-brand-primary/30 transition-all cursor-pointer"
                >
                  <option value="All">All Levels</option>
                  <option value="In Stock">High Stock (100+)</option>
                  <option value="Low">Low Stock (&lt;100)</option>
                  <option value="Out of Stock">Out of Stock (0)</option>
                </select>
              )}
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <table className="w-full text-left border-collapse table-fixed">
                <thead>
                  <tr className="bg-gray-50 text-[10px] uppercase tracking-widest font-bold text-gray-400 border-b border-gray-100">
                    <th className="px-6 py-4 w-12 text-center">
                       <input 
                         type="checkbox" 
                         checked={selectedInventoryIds.length === filteredInventoryBase.length && filteredInventoryBase.length > 0}
                         onChange={toggleAllSelection}
                         className="w-4 h-4 rounded text-brand-primary focus:ring-brand-primary" 
                       />
                    </th>
                    <th className="px-6 py-4 w-1/4">Fish Name</th>
                    <th className="px-6 py-4 w-32">{activeSubModule === 'Update Stock' ? 'Adjust Current' : 'Current (kg)'}</th>
                    <th className="px-6 py-4 w-32">{activeSubModule === 'Update Stock' ? 'Adjust Incoming' : 'Incoming (kg)'}</th>
                    <th className="px-6 py-4 w-28 text-center">Sold (kg)</th>
                    <th className="px-6 py-4 w-32 text-center">Remaining</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right w-24">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredInventoryBase.map((p) => {
                    const remainingStock = Math.max(0, p.stock + p.incomingStock - p.soldToday);
                    const isLow = remainingStock > 0 && remainingStock < 100;
                    const isOut = remainingStock <= 0;
                    
                    return (
                      <tr key={p.id} className={cn(
                        "hover:bg-gray-50/50 transition-colors group",
                        selectedInventoryIds.includes(p.id) && "bg-brand-primary/[0.02]"
                      )}>
                        <td className="px-6 py-4 text-center">
                          <input 
                            type="checkbox"
                            checked={selectedInventoryIds.includes(p.id)}
                            onChange={() => toggleSelection(p.id)}
                            className="w-4 h-4 rounded text-brand-primary focus:ring-brand-primary" 
                          />
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm font-bold text-gray-900 group-hover:text-brand-primary transition-colors">{p.name}</span>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter mt-0.5">{p.category}</p>
                        </td>
                        <td className="px-6 py-4">
                          {activeSubModule === 'Update Stock' ? (
                            <input 
                              type="number"
                              defaultValue={p.stock}
                              onBlur={(e) => {
                                const val = Math.max(0, parseInt(e.target.value) || 0);
                                updateProduct(p.id, { stock: val });
                                showToast(`Stock adjusted for ${p.name}`, "success");
                              }}
                              className="w-20 bg-white border border-brand-primary/20 rounded px-2 py-1 text-sm font-bold outline-none focus:ring-2 focus:ring-brand-primary/10 transition-all shadow-sm"
                            />
                          ) : (
                            <span className="text-sm font-mono text-gray-600">{p.stock} kg</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {activeSubModule === 'Update Stock' ? (
                            <input 
                              type="number"
                              defaultValue={p.incomingStock}
                              onBlur={(e) => {
                                const val = Math.max(0, parseInt(e.target.value) || 0);
                                updateProduct(p.id, { incomingStock: val });
                                showToast(`Incoming queue updated for ${p.name}`, "success");
                              }}
                              className="w-20 bg-white border border-brand-primary/20 rounded px-2 py-1 text-sm font-bold outline-none focus:ring-2 focus:ring-brand-primary/10 transition-all shadow-sm"
                            />
                          ) : (
                             <span className="text-sm font-mono text-gray-600">{p.incomingStock} kg</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-center">
                           <span className="text-sm font-mono text-gray-400 font-bold">{p.soldToday}</span>
                        </td>
                        <td className="px-6 py-4 text-center">
                           <span className={cn(
                             "text-sm font-bold",
                             isOut ? "text-red-600" : isLow ? "text-amber-600" : "text-emerald-600"
                           )}>{remainingStock} kg</span>
                        </td>
                        <td className="px-6 py-4">
                           <div className="flex items-center gap-2">
                             <div className={cn(
                               "w-2 h-2 rounded-full",
                               isOut ? "bg-red-500 animate-pulse" : isLow ? "bg-amber-500" : "bg-emerald-500"
                             )} />
                             <span className={cn(
                               "text-[10px] font-bold uppercase tracking-widest",
                               isOut ? "text-red-500" : isLow ? "text-amber-500" : "text-emerald-500"
                             )}>
                                {isOut ? 'Critically Out' : isLow ? 'Low Priority' : 'Inventory Stable'}
                             </span>
                           </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                           <button 
                             onClick={() => {
                               setStockToUpdate(p);
                               setAdditionalStockQty(0);
                               setIsAddStockModalOpen(true);
                             }}
                             className="p-1 px-2 text-brand-primary hover:bg-brand-primary/10 rounded font-bold text-xs transition-colors"
                           >
                             RESTOCK
                           </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {filteredInventoryBase.length === 0 && (
                <div className="p-20 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-50 rounded-full mb-4">
                    <Package size={24} className="text-gray-300" />
                  </div>
                  <p className="text-sm font-bold text-gray-400">Inventory scan returned zero results for your criteria.</p>
                </div>
              )}
            </div>

            {/* Quick Add Stock Modal */}
            {isAddStockModalOpen && stockToUpdate && (
              <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                 <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-gray-100">
                    <div className="p-8 border-b border-gray-100 text-center">
                       <p className="text-[10px] font-bold text-brand-primary uppercase tracking-[0.2em] mb-2">Restock Terminal</p>
                       <h3 className="text-lg font-bold text-gray-900">{stockToUpdate.name}</h3>
                    </div>
                    <div className="p-8 space-y-6">
                       <div>
                          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 text-center">Addition Quantity (kg)</label>
                          <div className="flex items-center gap-4 justify-center">
                             <button 
                               onClick={() => setAdditionalStockQty(prev => Math.max(0, prev - 10))}
                               className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 text-gray-400 font-bold hover:bg-gray-100 transition-colors"
                             >
                               -10
                             </button>
                             <input 
                               type="number" 
                               value={additionalStockQty}
                               onChange={(e) => setAdditionalStockQty(Math.max(0, parseInt(e.target.value) || 0))}
                               className="w-24 px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-xl font-bold text-center outline-none focus:ring-4 focus:ring-brand-primary/5 transition-all" 
                             />
                             <button 
                               onClick={() => setAdditionalStockQty(prev => prev + 10)}
                               className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 text-gray-400 font-bold hover:bg-gray-100 transition-colors"
                             >
                               +10
                             </button>
                          </div>
                       </div>
                    </div>
                    <div className="p-8 pt-0 flex gap-4">
                       <button 
                         onClick={() => setIsAddStockModalOpen(false)}
                         className="flex-1 py-3.5 text-sm font-bold text-gray-400 hover:text-gray-600 transition-all uppercase tracking-widest"
                       >
                         Discard
                       </button>
                       <button 
                         onClick={() => {
                           if (additionalStockQty <= 0) return;
                           const newTotal = stockToUpdate.stock + additionalStockQty;
                           updateProduct(stockToUpdate.id, { stock: newTotal });
                           showToast(`Inventory replenished: +${additionalStockQty}kg for ${stockToUpdate.name}`, "success");
                           setIsAddStockModalOpen(false);
                         }}
                         className="flex-1 py-3.5 bg-brand-primary text-white rounded-2xl text-sm font-bold shadow-xl shadow-brand-primary/20 hover:bg-brand-secondary transition-all"
                       >
                         Apply Stock
                       </button>
                    </div>
                 </div>
              </div>
            )}

            {/* Bulk Update Modal */}
            {isBulkStockModalOpen && (
              <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                 <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-gray-100">
                    <div className="p-8 border-b border-gray-100 text-center">
                       <p className="text-[10px] font-bold text-brand-primary uppercase tracking-[0.2em] mb-2">Bulk Integration</p>
                       <h3 className="text-lg font-bold text-gray-900">Updating {selectedInventoryIds.length} Products</h3>
                    </div>
                    <div className="p-8 space-y-6">
                       <div>
                          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 text-center">Stock to Add (kg per item)</label>
                          <input 
                            type="number" 
                            value={bulkStockQty}
                            onChange={(e) => setBulkStockQty(Math.max(0, parseInt(e.target.value) || 0))}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-xl font-bold text-center outline-none focus:ring-4 focus:ring-brand-primary/5 transition-all" 
                          />
                       </div>
                    </div>
                    <div className="p-8 pt-0 flex gap-4">
                       <button 
                         onClick={() => setIsBulkStockModalOpen(false)}
                         className="flex-1 py-3.5 text-sm font-bold text-gray-400 hover:text-gray-600 transition-all uppercase tracking-widest"
                       >
                         Cancel
                       </button>
                       <button 
                         onClick={() => {
                           if (bulkStockQty <= 0) return;
                           selectedInventoryIds.forEach(id => {
                             const p = products.find(prod => prod.id === id);
                             if (p) {
                               updateProduct(id, { stock: p.stock + bulkStockQty });
                             }
                           });
                           showToast(`Bulk stock injection complete for ${selectedInventoryIds.length} assets`, "success");
                           setSelectedInventoryIds([]);
                           setIsBulkStockModalOpen(false);
                         }}
                         className="flex-1 py-3.5 bg-brand-primary text-white rounded-2xl text-sm font-bold shadow-xl shadow-brand-primary/20 hover:bg-brand-secondary transition-all"
                       >
                         Execute Bulk
                       </button>
                    </div>
                 </div>
              </div>
            )}
          </div>
        );

      case 'Pricing':
        const filteredPricing = products.filter(p => {
          const matchesSearch = p.name.toLowerCase().includes(pricingSearch.toLowerCase());
          const matchesCategory = pricingCategory === 'All' || p.category === pricingCategory;
          
          let matchesVisibility = true;
          if (activeSubModule === 'B2B Pricing') {
            matchesVisibility = p.isVisibleB2B;
          } else if (activeSubModule === 'Product Pricing') {
            matchesVisibility = pricingVisibility === 'All' || 
              (pricingVisibility === 'Consumer' && p.isVisibleConsumer) ||
              (pricingVisibility === 'B2B' && p.isVisibleB2B);
          }
          
          return matchesSearch && matchesCategory && matchesVisibility;
        });

        const togglePricingSelection = (id: number) => {
          setSelectedPricingIds(prev => 
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
          );
        };

        const executeBulkPriceUpdate = () => {
          selectedPricingIds.forEach(id => {
            const product = products.find(p => p.id === id);
            if (!product) return;

            const updates: Partial<Product> = { lastPriceUpdate: new Date().toISOString() };
            
            if (bulkPriceTarget === 'consumer' || bulkPriceTarget === 'both') {
              let newPrice = product.price;
              if (bulkPriceType === 'fixed') {
                newPrice = bulkPriceValue;
              } else {
                const multiplier = bulkPriceAction === 'increase' ? (1 + bulkPriceValue / 100) : (1 - bulkPriceValue / 100);
                newPrice = product.price * multiplier;
              }
              if (newPrice < 0) newPrice = 0;
              updates.price = parseFloat(newPrice.toFixed(2));
              updates.previousPrice = product.price;
            }

            if (bulkPriceTarget === 'b2b' || bulkPriceTarget === 'both') {
              let newPrice = product.b2bPrice;
              if (bulkPriceType === 'fixed') {
                newPrice = bulkPriceValue;
              } else {
                const multiplier = bulkPriceAction === 'increase' ? (1 + bulkPriceValue / 100) : (1 - bulkPriceValue / 100);
                newPrice = product.b2bPrice * multiplier;
              }
              if (newPrice < 0) newPrice = 0;
              updates.b2bPrice = parseFloat(newPrice.toFixed(2));
            }

            updateProduct(id, updates);
          });

          showToast(`Prices updated for ${selectedPricingIds.length} items`, "success");
          setIsBulkPriceModalOpen(false);
          setSelectedPricingIds([]);
        };

        return (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {activeSubModule === 'B2B Pricing' ? 'B2B Partner Pricing' : 
                   activeSubModule === 'Bulk Pricing' ? 'Bulk Modification Desk' : 'Pricing Control'}
                </h1>
                <p className="text-sm text-gray-500 font-medium">
                  {activeSubModule === 'B2B Pricing' ? 'Managing wholesale and bulk contract rates.' :
                   activeSubModule === 'Bulk Pricing' ? 'Executing large-scale pricing modifications across the catalog.' :
                   'Manage multi-channel pricing strategy and channel adjustments.'}
                </p>
              </div>
                <button 
                  onClick={() => {
                    const consumerPrices = products.map(p => ({ id: p.id, b2bPrice: p.price }));
                    consumerPrices.forEach(p => updateProduct(p.id, { b2bPrice: p.b2bPrice }));
                    showToast("B2B prices synced with Consumer prices", "success");
                  }}
                  className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-400 hover:text-brand-primary hover:border-brand-primary transition-all uppercase tracking-widest"
                >
                  Sync B2B Price
                </button>
                <button 
                   disabled={selectedPricingIds.length === 0}
                   onClick={() => setIsBulkPriceModalOpen(true)}
                   className="flex items-center gap-2 px-6 py-2.5 bg-brand-primary text-white rounded-xl text-sm font-bold shadow-lg shadow-brand-primary/20 hover:bg-brand-secondary transition-all active:scale-95 disabled:opacity-50 disabled:grayscale"
                >
                  <RefreshCw size={18} className={selectedPricingIds.length > 0 ? "animate-spin-slow" : ""} />
                  Bulk Price Update
                </button>
            </div>

            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-wrap gap-4 items-center">
              <div className="relative flex-1 min-w-[300px]">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search by product name..." 
                  value={pricingSearch}
                  onChange={(e) => setPricingSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-4 focus:ring-brand-primary/5 outline-none transition-all"
                />
              </div>
              <select 
                value={pricingCategory}
                onChange={(e) => setPricingCategory(e.target.value)}
                className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium outline-none focus:ring-4 focus:ring-brand-primary/5"
              >
                <option value="All">All Categories</option>
                {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
              </select>
              <select 
                value={pricingVisibility}
                onChange={(e) => setPricingVisibility(e.target.value)}
                className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium outline-none focus:ring-4 focus:ring-brand-primary/5"
              >
                <option value="All">All Visibility</option>
                <option value="Consumer">Consumer Only</option>
                <option value="B2B">B2B Only</option>
              </select>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-[10px] uppercase tracking-widest font-bold text-gray-400 border-b border-gray-100">
                    <th className="px-6 py-4 w-12 text-center">
                      <input 
                        type="checkbox" 
                        checked={selectedPricingIds.length === filteredPricing.length && filteredPricing.length > 0}
                        onChange={(e) => {
                          if (e.target.checked) setSelectedPricingIds(filteredPricing.map(p => p.id));
                          else setSelectedPricingIds([]);
                        }}
                        className="rounded border-gray-300 text-brand-primary focus:ring-brand-primary cursor-pointer"
                      />
                    </th>
                    <th className="px-6 py-4 font-bold text-gray-900">Portfolio Item</th>
                    <th className="px-6 py-4">Market</th>
                    <th className="px-6 py-4">{activeSubModule === 'B2B Pricing' ? 'B2B Price' : 'Retail Price'}</th>
                    {activeSubModule === 'Product Pricing' && <th className="px-6 py-4">B2B Rate</th>}
                    <th className="px-6 py-4">Bench</th>
                    <th className="px-6 py-4 text-center">Delta</th>
                    <th className="px-6 py-4 text-right">Sync Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredPricing.map((p) => {
                    const priceDiff = p.price - p.previousPrice;
                    const changePct = p.previousPrice !== 0 ? (priceDiff / p.previousPrice) * 100 : 0;
                    
                    return (
                      <tr key={p.id} className={cn("hover:bg-gray-50/50 transition-colors", selectedPricingIds.includes(p.id) && "bg-brand-primary/5")}>
                        <td className="px-6 py-4 text-center">
                          <input 
                            type="checkbox" 
                            checked={selectedPricingIds.includes(p.id)}
                            onChange={() => togglePricingSelection(p.id)}
                            className="rounded border-gray-300 text-brand-primary focus:ring-brand-primary cursor-pointer"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm font-bold text-gray-900">{p.name}</span>
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">{p.category}</p>
                        </td>
                        <td className="px-6 py-4">
                           <div className="flex gap-2">
                             {p.isVisibleConsumer && <div className="w-2 h-2 bg-emerald-500 rounded-full" title="Consumer" />}
                             {p.isVisibleB2B && <div className="w-2 h-2 bg-blue-500 rounded-full" title="B2B" />}
                           </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1 group">
                            <span className="text-gray-400 font-bold text-xs">$</span>
                            <input 
                              type="number"
                              defaultValue={activeSubModule === 'B2B Pricing' ? p.b2bPrice?.toFixed(2) : p.price.toFixed(2)}
                              onBlur={(e) => {
                                const val = parseFloat(e.target.value);
                                if (val < 0) {
                                  showToast("Price cannot be negative", "error");
                                  e.target.value = activeSubModule === 'B2B Pricing' ? (p.b2bPrice || 0).toFixed(2) : p.price.toFixed(2);
                                  return;
                                }
                                if (activeSubModule === 'B2B Pricing') {
                                   if (val !== p.b2bPrice) {
                                     updateProduct(p.id, { b2bPrice: val, lastPriceUpdate: new Date().toISOString() });
                                     showToast("B2B price updated", "success");
                                   }
                                } else {
                                   if (val !== p.price) {
                                     updateProduct(p.id, { 
                                       price: val, 
                                       previousPrice: p.price,
                                       lastPriceUpdate: new Date().toISOString()
                                     });
                                     showToast("Consumer price updated", "success");
                                   }
                                }
                              }}
                              className="w-20 bg-transparent border-b border-transparent group-hover:border-gray-200 focus:border-brand-primary focus:bg-gray-50 outline-none text-sm font-bold text-gray-900 transition-all px-1"
                            />
                          </div>
                        </td>
                        {activeSubModule === 'Product Pricing' && (
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-1 group">
                              <span className="text-brand-secondary font-bold text-xs">$</span>
                              <input 
                                type="number"
                                defaultValue={p.b2bPrice?.toFixed(2) || '0.00'}
                                onBlur={(e) => {
                                  const val = parseFloat(e.target.value);
                                  if (val < 0) {
                                    showToast("Price cannot be negative", "error");
                                    e.target.value = (p.b2bPrice || 0).toFixed(2);
                                    return;
                                  }
                                  if (val !== p.b2bPrice) {
                                    updateProduct(p.id, { 
                                      b2bPrice: val,
                                      lastPriceUpdate: new Date().toISOString()
                                    });
                                    showToast("B2B rate updated", "success");
                                  }
                                }}
                                className="w-20 bg-transparent border-b border-transparent group-hover:border-gray-200 focus:border-brand-primary focus:bg-gray-50 outline-none text-sm font-bold text-brand-secondary transition-all px-1"
                              />
                            </div>
                          </td>
                        )}
                        <td className="px-6 py-4 text-xs font-mono text-gray-400">
                          ${p.previousPrice.toFixed(2)}
                        </td>
                        <td className="px-6 py-4">
                          <span className={cn(
                            "inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest",
                            changePct > 0 ? "bg-emerald-50 text-emerald-600" :
                            changePct < 0 ? "bg-red-50 text-red-600" : "bg-gray-50 text-gray-400"
                          )}>
                            {changePct > 0 && <TrendingUp size={10} />}
                            {changePct === 0 ? 'Stable' : `${changePct > 0 ? '+' : ''}${changePct.toFixed(1)}%`}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                          {p.lastPriceUpdate ? new Date(p.lastPriceUpdate).toLocaleDateString() : 'Never'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Bulk Price Modal */}
            {isBulkPriceModalOpen && (
              <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-gray-900/40 backdrop-blur-sm animate-in fade-in duration-300">
                <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-lg border border-gray-100 overflow-hidden animate-in zoom-in-95 duration-300">
                  <div className="p-8 border-b border-gray-50 flex items-center justify-between">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">Bulk Price Adjust</h3>
                      <p className="text-gray-400 text-sm font-medium mt-1">Applying changes to {selectedPricingIds.length} assets.</p>
                    </div>
                    <button onClick={() => setIsBulkPriceModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400">
                      <X size={24} />
                    </button>
                  </div>

                  <div className="p-8 space-y-6">
                    <div className="grid grid-cols-3 gap-2 p-1 bg-gray-100 rounded-2xl">
                      <button 
                        onClick={() => setBulkPriceAction('increase')}
                        className={cn("py-2 text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all", bulkPriceAction === 'increase' ? "bg-white text-emerald-600 shadow-sm" : "text-gray-400 hover:text-gray-600")}
                      >Increase</button>
                      <button 
                        onClick={() => setBulkPriceAction('decrease')}
                        className={cn("py-2 text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all", bulkPriceAction === 'decrease' ? "bg-white text-red-600 shadow-sm" : "text-gray-400 hover:text-gray-600")}
                      >Decrease</button>
                      <button 
                        onClick={() => setBulkPriceAction('set')}
                        className={cn("py-2 text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all", bulkPriceAction === 'set' ? "bg-white text-brand-primary shadow-sm" : "text-gray-400 hover:text-gray-600")}
                      >Set Fixed</button>
                    </div>

                    <div className="space-y-2">
                       <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Target Market</label>
                       <div className="grid grid-cols-3 gap-2">
                          {['Consumer', 'B2B', 'Both'].map(t => (
                            <button 
                              key={t}
                              onClick={() => setBulkPriceTarget(t.toLowerCase() as any)}
                              className={cn(
                                "py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest border transition-all",
                                bulkPriceTarget === t.toLowerCase() ? "bg-brand-primary border-brand-primary text-white" : "border-gray-200 text-gray-400 hover:border-gray-300"
                              )}
                            >{t}</button>
                          ))}
                       </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between ml-1">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Adjustment Value</label>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => setBulkPriceType('percentage')}
                            className={cn("text-[10px] font-bold uppercase tracking-widest", bulkPriceType === 'percentage' ? "text-brand-primary underline" : "text-gray-400")}
                          >%</button>
                          <button 
                            onClick={() => setBulkPriceType('fixed')}
                            className={cn("text-[10px] font-bold uppercase tracking-widest", bulkPriceType === 'fixed' ? "text-brand-primary underline" : "text-gray-400")}
                          >$</button>
                        </div>
                      </div>
                      <div className="relative">
                        <span className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl font-bold text-gray-300">
                          {bulkPriceType === 'percentage' ? '%' : '$'}
                        </span>
                        <input 
                          type="number"
                          value={bulkPriceValue}
                          onChange={(e) => setBulkPriceValue(parseFloat(e.target.value) || 0)}
                          className="w-full pl-12 pr-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-3xl font-bold outline-none focus:ring-4 focus:ring-brand-primary/5 transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="p-8 pt-0 flex gap-4">
                    <button 
                      onClick={() => setIsBulkPriceModalOpen(false)}
                      className="flex-1 py-4 text-sm font-bold text-gray-400 hover:text-gray-600 transition-all uppercase tracking-widest"
                    >Cancel</button>
                    <button 
                      onClick={executeBulkPriceUpdate}
                      className="flex-1 py-4 bg-emerald-500 text-white rounded-2xl text-sm font-bold shadow-xl shadow-emerald-500/20 hover:bg-emerald-600 transition-all"
                    >Apply Changes</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case 'Categories':
        return (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex items-center justify-between bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <div>
                <h1 className="text-xl font-bold text-gray-900 mb-1">Categories</h1>
                <p className="text-sm text-gray-500 font-medium">Manage taxonomy and display priority for the storefront.</p>
              </div>
              <button 
                onClick={() => {
                  setEditingCategory(null);
                  setNewCategoryName('');
                  setCatVisibilityConsumer(true);
                  setCatVisibilityB2B(true);
                  setIsCategoryModalOpen(true);
                }}
                className="flex items-center gap-2 px-6 py-2.5 bg-brand-primary text-white rounded-xl text-sm font-bold shadow-lg shadow-brand-primary/20 hover:bg-brand-secondary transition-all active:scale-95"
              >
                <Plus size={18} />
                Add Category
              </button>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <table className="w-full text-left border-collapse table-fixed">
                <thead>
                  <tr className="bg-gray-50 text-[10px] uppercase tracking-widest font-bold text-gray-400 border-b border-gray-100">
                    <th className="px-6 py-4 w-1/4">Category Name</th>
                    <th className="px-6 py-4 w-32">Products</th>
                    <th className="px-6 py-4 w-32">Status</th>
                    <th className="px-6 py-4 w-44 text-center">Visibility</th>
                    <th className="px-6 py-4 w-28 text-center">Order</th>
                    <th className="px-6 py-4 text-right w-32">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {categories.map((cat) => {
                    const productCount = products.filter(p => p.category === cat.name).length;
                    return (
                      <tr key={cat.id} className="hover:bg-gray-50/50 transition-colors group">
                        <td className="px-6 py-4">
                          <span className="text-sm font-bold text-gray-900 group-hover:text-brand-primary transition-colors">{cat.name}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-xs font-bold text-gray-400 py-1 px-2 bg-gray-50 rounded border border-gray-100">{productCount} Units</span>
                        </td>
                        <td className="px-6 py-4">
                          <button 
                            onClick={() => updateCategory(cat.id, { status: cat.status === 'Active' ? 'Disabled' : 'Active' })}
                            className={cn(
                              "text-[10px] font-bold uppercase px-2 py-1 rounded transition-all border",
                              cat.status === 'Active' ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-gray-50 text-gray-400 border-gray-100"
                            )}
                          >
                            {cat.status}
                          </button>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex justify-center gap-2">
                             <button 
                               onClick={() => updateCategory(cat.id, { isVisibleConsumer: !cat.isVisibleConsumer })}
                               className={cn(
                                 "flex items-center gap-1.5 px-2 py-1 rounded text-[10px] font-bold border transition-all",
                                 cat.isVisibleConsumer ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-gray-50 text-gray-400 border-gray-100"
                               )}
                               title="Toggle Consumer Visibility"
                             >
                                {cat.isVisibleConsumer ? <CheckCircle2 size={12} /> : <EyeOff size={12} />}
                                CONS
                             </button>
                             <button 
                               onClick={() => updateCategory(cat.id, { isVisibleB2B: !cat.isVisibleB2B })}
                               className={cn(
                                 "flex items-center gap-1.5 px-2 py-1 rounded text-[10px] font-bold border transition-all",
                                 cat.isVisibleB2B ? "bg-blue-50 text-blue-600 border-blue-100" : "bg-gray-50 text-gray-400 border-gray-100"
                               )}
                               title="Toggle B2B Visibility"
                             >
                                {cat.isVisibleB2B ? <CheckCircle2 size={12} /> : <EyeOff size={12} />}
                                B2B
                             </button>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                           <div className="flex justify-center">
                            <input 
                              type="number"
                              value={cat.order}
                              onChange={(e) => updateCategory(cat.id, { order: parseInt(e.target.value) || 0 })}
                              className="w-12 bg-gray-50 border border-gray-100 rounded px-2 py-1 text-xs font-bold text-center focus:ring-1 focus:ring-brand-primary/20 outline-none hover:border-brand-primary/30"
                            />
                           </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                           <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all">
                              <button 
                                onClick={() => {
                                  setEditingCategory(cat);
                                  setNewCategoryName(cat.name);
                                  setCatVisibilityConsumer(cat.isVisibleConsumer);
                                  setCatVisibilityB2B(cat.isVisibleB2B);
                                  setIsCategoryModalOpen(true);
                                }}
                                className="p-1.5 text-gray-400 hover:text-brand-primary hover:bg-gray-50 rounded-lg transition-all"
                                title="Edit Category"
                              >
                                 <Edit size={16} />
                              </button>
                              <button 
                                onClick={() => {
                                  try {
                                    if(window.confirm(`Permanently remove visibility for "${cat.name}"?`)) {
                                      deleteCategory(cat.id);
                                      showToast("Category purged", "success");
                                    }
                                  } catch (e: any) {
                                    showToast(e.message, "error");
                                  }
                                }}
                                className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                title="Delete Category"
                              >
                                 <Trash2 size={16} />
                              </button>
                           </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Category Modal Overlay */}
            {isCategoryModalOpen && (
              <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                 <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-gray-100">
                    <div className="p-8 border-b border-gray-100 bg-gray-50/50">
                       <h3 className="text-sm font-bold text-gray-900 uppercase tracking-[0.2em]">{editingCategory ? 'Modify' : 'New'} Category</h3>
                       <p className="text-xs text-gray-400 mt-1 font-medium">Configure market access for this taxonomy node.</p>
                    </div>
                    <div className="p-8 space-y-8">
                       <div>
                          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Target Name</label>
                          <input 
                            type="text" 
                            value={newCategoryName}
                            onChange={(e) => setNewCategoryName(e.target.value)}
                            placeholder="e.g. Sustainable Wild-Catch" 
                            className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-brand-primary/5 focus:border-brand-primary/30 transition-all" 
                          />
                       </div>

                       <div className="space-y-3">
                          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Market Visibility</label>
                          <div className="grid grid-cols-2 gap-4">
                            <label className={cn(
                              "flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer",
                              catVisibilityConsumer ? "bg-emerald-50/50 border-emerald-100" : "bg-gray-50 border-gray-200"
                            )}>
                               <span className={cn("text-xs font-bold", catVisibilityConsumer ? "text-emerald-700" : "text-gray-500")}>Consumer</span>
                               <input 
                                 type="checkbox" 
                                 checked={catVisibilityConsumer}
                                 onChange={(e) => setCatVisibilityConsumer(e.target.checked)}
                                 className="w-5 h-5 rounded-lg text-emerald-500 focus:ring-emerald-500 border-gray-300 transition-all" 
                               />
                            </label>
                            <label className={cn(
                              "flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer",
                              catVisibilityB2B ? "bg-blue-50/50 border-blue-100" : "bg-gray-50 border-gray-200"
                            )}>
                               <span className={cn("text-xs font-bold", catVisibilityB2B ? "text-blue-700" : "text-gray-500")}>B2B</span>
                               <input 
                                 type="checkbox" 
                                 checked={catVisibilityB2B}
                                 onChange={(e) => setCatVisibilityB2B(e.target.checked)}
                                 className="w-5 h-5 rounded-lg text-blue-500 focus:ring-blue-500 border-gray-300 transition-all" 
                               />
                            </label>
                          </div>
                       </div>
                    </div>
                    <div className="p-8 pt-0 flex gap-4">
                       <button 
                         onClick={() => setIsCategoryModalOpen(false)}
                         className="flex-1 py-3.5 text-sm font-bold text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-2xl transition-all"
                       >
                         Discard
                       </button>
                       <button 
                         onClick={() => {
                           if (!newCategoryName) return;
                           
                           if (editingCategory) {
                             updateCategory(editingCategory.id, {
                               name: newCategoryName,
                               isVisibleConsumer: catVisibilityConsumer,
                               isVisibleB2B: catVisibilityB2B
                             });
                             showToast(`Category "${newCategoryName}" updated`, "success");
                           } else {
                             addCategory({
                               name: newCategoryName,
                               status: 'Active',
                               isVisibleConsumer: catVisibilityConsumer,
                               isVisibleB2B: catVisibilityB2B
                             });
                             showToast("Taxonomy expansion successful", "success");
                           }
                           setIsCategoryModalOpen(false);
                         }}
                         className="flex-1 py-3.5 bg-brand-primary text-white rounded-2xl text-sm font-bold shadow-xl shadow-brand-primary/20 hover:bg-brand-secondary transition-all active:scale-95"
                       >
                         {editingCategory ? 'Commit Changes' : 'Create Category'}
                       </button>
                    </div>
                 </div>
              </div>
            )}
          </div>
        );

      case 'Orders':
        const filteredOrders = orders.filter(o => {
          const matchesSearch = o.id.toLowerCase().includes(orderSearch.toLowerCase()) || 
                                o.customerName.toLowerCase().includes(orderSearch.toLowerCase());
          const matchesType = orderTypeFilter === 'All' || o.type === orderTypeFilter;
          const matchesStatus = orderStatusFilter === 'All' || o.status === orderStatusFilter;
          return matchesSearch && matchesType && matchesStatus;
        });

        return (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">Order Management</h1>
              <div className="flex gap-3">
                 <button className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-400 hover:text-brand-primary hover:border-brand-primary transition-all uppercase tracking-widest">
                    Export Manifest
                 </button>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-wrap gap-4 items-center">
              <div className="relative flex-1 min-w-[300px]">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="ID or Customer Name..." 
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-4 focus:ring-brand-primary/5 outline-none transition-all"
                />
              </div>
              <select 
                value={orderTypeFilter}
                onChange={(e) => setOrderTypeFilter(e.target.value as any)}
                className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium outline-none focus:ring-4 focus:ring-brand-primary/5"
              >
                <option value="All">All Types</option>
                <option value="Consumer">Consumer</option>
                <option value="B2B">B2B Only</option>
              </select>
              <select 
                value={orderStatusFilter}
                onChange={(e) => setOrderStatusFilter(e.target.value as any)}
                className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium outline-none focus:ring-4 focus:ring-brand-primary/5"
              >
                <option value="All">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Processing">Processing</option>
                <option value="Out for Delivery">Out for Delivery</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden no-scrollbar overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[1000px]">
                <thead>
                  <tr className="bg-gray-50 text-[10px] uppercase tracking-widest font-bold text-gray-400 border-b border-gray-100">
                    <th className="px-6 py-4">Order ID</th>
                    <th className="px-6 py-4">Customer / Entity</th>
                    <th className="px-6 py-4">Type</th>
                    <th className="px-6 py-4">Items</th>
                    <th className="px-6 py-4">Total Qty</th>
                    <th className="px-6 py-4">Total Price</th>
                    <th className="px-6 py-4">Delivery Slot</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Placed</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="px-6 py-12 text-center text-gray-400 font-medium">No transactions found matching filters.</td>
                    </tr>
                  ) : filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="px-6 py-4">
                        <span className="font-mono text-xs font-bold text-gray-900 px-2 py-1 bg-gray-50 rounded border border-gray-100">{order.id}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                           <span className="text-sm font-bold text-gray-900">{order.customerName}</span>
                           {order.businessName && <span className="text-[10px] text-brand-primary font-bold uppercase tracking-widest">{order.businessName}</span>}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                         <span className={cn(
                           "text-[10px] font-bold uppercase px-2 py-0.5 rounded border",
                           order.type === 'B2B' ? "bg-blue-50 text-blue-600 border-blue-100" : "bg-purple-50 text-purple-600 border-purple-100"
                         )}>
                           {order.type}
                         </span>
                      </td>
                      <td className="px-6 py-4 text-xs font-bold text-gray-400">
                        {order.items.length} SKUs
                      </td>
                      <td className="px-6 py-4">
                         <span className={cn(
                           "text-xs font-bold",
                           order.totalQuantity > 10 ? "text-brand-secondary" : "text-gray-900"
                         )}>{order.totalQuantity} kg</span>
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-gray-900">
                        ${order.totalPrice.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase leading-tight">
                         {order.deliverySlot}
                      </td>
                      <td className="px-6 py-4">
                         <select 
                           value={order.status}
                           onChange={(e) => {
                             const newStatus = e.target.value as OrderStatus;
                             if (newStatus === 'Processing') {
                               // Quick stock check simulation
                               const insufficient = order.items.filter(item => {
                                  const p = products.find(prod => prod.id === item.productId);
                                  return p && p.stock < 0; // The logic reduced it on order, so if it's already negative, we have issue
                               });
                               if (insufficient.length > 0) {
                                  showToast("Critical: Processing paused. Stock shortage detected.", "error");
                                  return;
                               }
                             }
                             updateOrderStatus(order.id, newStatus);
                             showToast(`Order ${order.id} status updated to ${newStatus}`, "success");
                           }}
                           className={cn(
                             "text-[10px] font-bold uppercase py-1.5 px-2.5 rounded-lg outline-none transition-all cursor-pointer border",
                             order.status === 'Pending' && "bg-gray-50 text-gray-500 border-gray-200",
                             order.status === 'Processing' && "bg-amber-50 text-amber-600 border-amber-200 shadow-sm shadow-amber-100",
                             order.status === 'Out for Delivery' && "bg-blue-50 text-blue-600 border-blue-200",
                             order.status === 'Delivered' && "bg-emerald-50 text-emerald-600 border-emerald-200",
                             order.status === 'Cancelled' && "bg-red-50 text-red-600 border-red-200"
                           )}
                         >
                           <option value="Pending">Pending</option>
                           <option value="Processing">Processing</option>
                           <option value="Out for Delivery">En Route</option>
                           <option value="Delivered">Delivered</option>
                           <option value="Cancelled">Cancelled</option>
                         </select>
                      </td>
                      <td className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                         {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="px-6 py-4 text-right">
                         <button 
                           onClick={() => {
                             setSelectedOrder(order);
                             setIsOrderDetailsModalOpen(true);
                           }}
                           className="text-brand-primary p-2 hover:bg-brand-primary/5 rounded-lg transition-colors"
                         >
                           <Eye size={18} />
                         </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Order Details Modal */}
            {isOrderDetailsModalOpen && selectedOrder && (
              <div className="fixed inset-0 z-[110] flex items-center justify-end bg-gray-900/40 backdrop-blur-sm animate-in fade-in duration-300">
                <div className="bg-white h-full w-full max-w-xl shadow-2xl overflow-hidden animate-in slide-in-from-right duration-500 flex flex-col">
                  <div className="p-8 border-b border-gray-100 flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                           <h3 className="text-2xl font-bold text-gray-900">Order Details</h3>
                           <span className="font-mono text-sm bg-gray-100 px-3 py-1 rounded-full text-gray-500 font-bold">{selectedOrder.id}</span>
                        </div>
                        <p className="text-gray-400 text-sm font-medium">Placed on {new Date(selectedOrder.createdAt).toLocaleString()}</p>
                    </div>
                    <button onClick={() => setIsOrderDetailsModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400">
                      <X size={28} />
                    </button>
                  </div>

                  <div className="flex-1 overflow-y-auto p-8 space-y-10 no-scrollbar">
                    {/* Customer Info */}
                    <div className="grid grid-cols-2 gap-8">
                       <div className="space-y-1">
                          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Customer</label>
                          <p className="text-lg font-bold text-gray-900">{selectedOrder.customerName}</p>
                          {selectedOrder.businessName && <p className="text-xs font-bold text-brand-primary uppercase tracking-widest">{selectedOrder.businessName}</p>}
                       </div>
                       <div className="space-y-1">
                          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Delivery Session</label>
                          <p className="text-sm font-bold text-gray-600">{selectedOrder.deliverySlot}</p>
                          <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Scheduled</p>
                       </div>
                    </div>

                    {/* Items List */}
                    <div className="space-y-4">
                       <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Manifest Items</label>
                          <span className="text-xs font-bold text-gray-900">{selectedOrder.items.length} SKUs</span>
                       </div>
                       <div className="space-y-3">
                          {selectedOrder.items.map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100 group hover:border-brand-primary/30 transition-all">
                               <div className="flex items-center gap-4">
                                  <div className="w-10 h-10 bg-white rounded-lg border border-gray-100 flex items-center justify-center font-bold text-brand-primary">
                                     {item.quantity}
                                  </div>
                                  <div>
                                     <p className="text-sm font-bold text-gray-900 group-hover:text-brand-primary transition-colors">{item.name}</p>
                                     <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Unit: {item.quantity} kg</p>
                                  </div>
                               </div>
                               <div className="text-right">
                                  <p className="text-sm font-bold text-gray-900">${(item.quantity * item.priceAtOrder).toFixed(2)}</p>
                                  <p className="text-[10px] font-bold text-gray-400 uppercase">@ ${item.priceAtOrder.toFixed(2)}</p>
                               </div>
                            </div>
                          ))}
                       </div>
                    </div>

                    {/* Financial Summary */}
                    <div className="space-y-4 pt-4">
                       <div className="p-6 bg-gray-900 rounded-[2rem] text-white space-y-4 shadow-xl">
                          <div className="flex justify-between text-sm">
                             <span className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Subtotal (Market)</span>
                             <span className="font-mono font-bold">${selectedOrder.totalPrice.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                             <span className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Processing & Handling</span>
                             <span className="font-mono font-bold text-emerald-400">FREE</span>
                          </div>
                          <div className="h-[1px] bg-white/10" />
                          <div className="flex justify-between items-end">
                             <span className="text-xs font-bold uppercase tracking-[0.2em] mb-1">Grand Total</span>
                             <span className="text-3xl font-bold font-serif">${selectedOrder.totalPrice.toFixed(2)}</span>
                          </div>
                       </div>
                    </div>
                  </div>

                  <div className="p-8 border-t border-gray-100 grid grid-cols-3 gap-3">
                     <button 
                       disabled={selectedOrder.status === 'Processing'}
                       onClick={() => {
                         updateOrderStatus(selectedOrder.id, 'Processing');
                         showToast("Order advanced to Processing state", "success");
                         setIsOrderDetailsModalOpen(false);
                       }}
                       className="py-3.5 bg-amber-50 text-amber-600 rounded-xl text-[10px] font-bold uppercase tracking-widest border border-amber-100 hover:bg-amber-100 transition-all disabled:opacity-50"
                     >
                       Mark Processing
                     </button>
                     <button 
                       disabled={selectedOrder.status === 'Delivered'}
                       onClick={() => {
                          updateOrderStatus(selectedOrder.id, 'Delivered');
                          showToast("Order marked as Delivered", "success");
                          setIsOrderDetailsModalOpen(false);
                       }}
                       className="py-3.5 bg-emerald-50 text-emerald-600 rounded-xl text-[10px] font-bold uppercase tracking-widest border border-emerald-100 hover:bg-emerald-100 transition-all disabled:opacity-50"
                     >
                       Mark Delivered
                     </button>
                     <button 
                       disabled={selectedOrder.status === 'Cancelled'}
                       onClick={() => {
                          updateOrderStatus(selectedOrder.id, 'Cancelled');
                          showToast("Security override executed: Order Cancelled", "error");
                          setIsOrderDetailsModalOpen(false);
                       }}
                       className="py-3.5 bg-red-50 text-red-600 rounded-xl text-[10px] font-bold uppercase tracking-widest border border-red-100 hover:bg-red-100 transition-all disabled:opacity-50"
                     >
                       Cancel Order
                     </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case 'Vendors':
        if (activeSubModule === 'Vendor List') {
          const filteredVendors = vendors.filter(v => 
            v.name.toLowerCase().includes(vendorSearch.toLowerCase()) ||
            v.location.toLowerCase().includes(vendorSearch.toLowerCase())
          );

          return (
            <div className="space-y-6 animate-in fade-in duration-500">
               <div className="flex items-center justify-between">
                 <h1 className="text-2xl font-bold text-gray-900">Vendors & Partners</h1>
                 <button 
                   onClick={() => {
                     setEditingVendor(null);
                     setVendorName('');
                     setVendorLocation('');
                     setVendorType('Fisherman');
                     setVendorFishTypes([]);
                     setIsVendorModalOpen(true);
                   }}
                   className="flex items-center gap-2 px-6 py-2.5 bg-brand-primary text-white rounded-xl text-sm font-bold shadow-lg shadow-brand-primary/20 hover:bg-brand-secondary transition-all"
                 >
                   <Plus size={18} /> Add New Vendor
                 </button>
               </div>

               <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                  <div className="relative">
                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                      type="text" 
                      placeholder="Search vendors by name or location..." 
                      value={vendorSearch}
                      onChange={(e) => setVendorSearch(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-4 focus:ring-brand-primary/5 outline-none transition-all"
                    />
                  </div>
               </div>

               <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <thead>
                       <tr className="bg-gray-50 text-[10px] uppercase tracking-widest font-bold text-gray-400 border-b border-gray-100">
                         <th className="px-6 py-4 text-center">#</th>
                         <th className="px-6 py-4">Vendor Name</th>
                         <th className="px-6 py-4">Location</th>
                         <th className="px-6 py-4">Type</th>
                         <th className="px-6 py-4">Specialization</th>
                         <th className="px-6 py-4 text-center">Status</th>
                         <th className="px-6 py-4 text-right">Actions</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                       {filteredVendors.map((v, idx) => (
                         <tr key={v.id} className="hover:bg-gray-50/50 transition-colors group">
                           <td className="px-6 py-4 text-xs font-mono text-gray-400 text-center">{idx + 1}</td>
                           <td className="px-6 py-4 font-bold text-sm text-gray-900">{v.name}</td>
                           <td className="px-6 py-4 text-sm text-gray-500 font-medium">{v.location}</td>
                           <td className="px-6 py-4">
                              <span className="text-[10px] font-bold uppercase py-1 px-2.5 rounded-full bg-gray-100 text-gray-600 border border-gray-200">{v.type}</span>
                           </td>
                           <td className="px-6 py-4">
                              <div className="flex flex-wrap gap-1">
                                {v.fishTypes.map(f => (
                                  <span key={f} className="text-[10px] font-bold text-brand-primary/80 bg-brand-primary/5 px-1.5 py-0.5 rounded uppercase">{f}</span>
                                ))}
                              </div>
                           </td>
                           <td className="px-6 py-4 text-center">
                              <button 
                                onClick={() => {
                                  updateVendor(v.id, { status: v.status === 'Active' ? 'Inactive' : 'Active' });
                                  showToast(`${v.name} status updated`, "success");
                                }}
                                className={cn(
                                  "text-[10px] font-bold uppercase transition-all",
                                  v.status === 'Active' ? "text-emerald-500" : "text-gray-400"
                                )}
                              >
                                {v.status}
                              </button>
                           </td>
                           <td className="px-6 py-4 text-right">
                              <div className="flex items-center justify-end gap-2 text-gray-400">
                                 <button 
                                   onClick={() => {
                                      setEditingVendor(v);
                                      setVendorName(v.name);
                                      setVendorLocation(v.location);
                                      setVendorType(v.type);
                                      setVendorFishTypes(v.fishTypes);
                                      setIsVendorModalOpen(true);
                                   }}
                                   className="p-1.5 hover:bg-brand-primary/5 hover:text-brand-primary rounded transition-colors"
                                 >
                                    <Edit size={16} />
                                 </button>
                                 <button 
                                   onClick={() => {
                                      if (confirm(`Sever supply relationship with ${v.name}?`)) {
                                         deleteVendor(v.id);
                                         showToast("Vendor relationship terminated", "error");
                                      }
                                   }}
                                   className="p-1.5 hover:bg-red-50 hover:text-red-500 rounded transition-colors"
                                 >
                                    <Trash2 size={16} />
                                 </button>
                              </div>
                           </td>
                         </tr>
                       ))}
                    </tbody>
                  </table>
               </div>

               {/* Add/Edit Vendor Modal */}
               {isVendorModalOpen && (
                 <div className="fixed inset-0 z-[110] flex items-center justify-center bg-gray-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-300">
                    <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-300 border border-white/20">
                       <div className="p-8 border-b border-gray-100 flex items-center justify-between">
                          <h3 className="text-xl font-bold font-serif text-gray-900">{editingVendor ? 'Update Partner' : 'New Vendor Ingress'}</h3>
                          <button onClick={() => setIsVendorModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400"><X size={24} /></button>
                       </div>
                       <div className="p-8 space-y-5">
                          <div className="space-y-1">
                             <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Entity Name</label>
                             <input 
                               value={vendorName}
                               onChange={(e) => setVendorName(e.target.value)}
                               className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-brand-primary/10 outline-none transition-all" 
                               placeholder="e.g. North Sea Fisheries" 
                             />
                          </div>
                          <div className="space-y-1">
                             <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Primary Location</label>
                             <input 
                               value={vendorLocation}
                               onChange={(e) => setVendorLocation(e.target.value)}
                               className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-brand-primary/10 outline-none transition-all" 
                               placeholder="City, Country" 
                             />
                          </div>
                          <div className="space-y-1">
                             <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Supplier Category</label>
                             <select 
                               value={vendorType}
                               onChange={(e) => setVendorType(e.target.value as any)}
                               className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-bold outline-none"
                             >
                                <option value="Fisherman">Fisherman (Direct Catch)</option>
                                <option value="Agent">Market Agent (Broker)</option>
                                <option value="Wholesaler">Wholesaler (Industrial)</option>
                             </select>
                          </div>
                       </div>
                       <div className="p-8 bg-gray-50 flex gap-3">
                          <button 
                            onClick={() => {
                               if (!vendorName || !vendorLocation) return;
                               if (editingVendor) {
                                  updateVendor(editingVendor.id, { name: vendorName, location: vendorLocation, type: vendorType });
                                  showToast("Vendor profile updated", "success");
                               } else {
                                  addVendor({ name: vendorName, location: vendorLocation, type: vendorType, fishTypes: [], status: 'Active' });
                                  showToast("New supply partner integrated", "success");
                               }
                               setIsVendorModalOpen(false);
                            }}
                            className="flex-1 py-4 bg-brand-primary text-white rounded-[1.25rem] text-sm font-bold shadow-xl shadow-brand-primary/20 hover:bg-brand-secondary transition-all active:scale-95"
                          >
                             {editingVendor ? 'Confirm Identity Update' : 'Initialize Partnership'}
                          </button>
                       </div>
                    </div>
                 </div>
               )}
            </div>
          );
        }

        if (activeSubModule === 'Supply Mapping') {
           const filteredSupply = supply.filter(s => 
             s.fishName.toLowerCase().includes(supplySearch.toLowerCase()) ||
             s.vendorName.toLowerCase().includes(supplySearch.toLowerCase())
           );

           return (
             <div className="space-y-6 animate-in fade-in duration-500">
               <div className="flex items-center justify-between">
                 <h1 className="text-2xl font-bold text-gray-900">Supply Mapping</h1>
                 <button 
                   onClick={() => {
                     setSupplyVendorId(vendors[0]?.id || 0);
                     setSupplyFishName(products[0]?.name || '');
                     setSupplyPrice(0);
                     setSupplyQty(0);
                     setSupplyTime('Morning');
                     setIsSupplyModalOpen(true);
                   }}
                   className="flex items-center gap-2 px-6 py-2.5 bg-brand-primary text-white rounded-xl text-sm font-bold shadow-lg shadow-brand-primary/20 hover:bg-brand-secondary transition-all"
                 >
                   <Plus size={18} /> New Supply Entry
                 </button>
               </div>

               <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex gap-4">
                  <div className="relative flex-1">
                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                      type="text" 
                      placeholder="Filter by fish name or vendor..." 
                      value={supplySearch}
                      onChange={(e) => setSupplySearch(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none transition-all"
                    />
                  </div>
                  <select 
                    value={supplyFishFilter}
                    onChange={(e) => setSupplyFishFilter(e.target.value)}
                    className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none font-bold"
                  >
                     <option value="All">All Fish Species</option>
                     {products.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
                  </select>
               </div>

               <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <thead>
                       <tr className="bg-gray-50 text-[10px] uppercase tracking-widest font-bold text-gray-400 border-b border-gray-100">
                         <th className="px-6 py-4">Vehicle / Vendor</th>
                         <th className="px-6 py-4">Species</th>
                         <th className="px-6 py-4 text-center">Daily Qty (kg)</th>
                         <th className="px-6 py-4 text-center">Landed Price</th>
                         <th className="px-6 py-4 text-center">Batch Slot</th>
                         <th className="px-6 py-4">Last Sync</th>
                         <th className="px-6 py-4 text-right">Actions</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                       {filteredSupply.map((s) => (
                         <tr key={s.id} className="hover:bg-gray-50/50 transition-colors group">
                           <td className="px-6 py-4">
                              <p className="text-sm font-bold text-gray-900">{s.vendorName}</p>
                           </td>
                           <td className="px-6 py-4">
                              <p className="text-sm font-bold text-brand-primary">{s.fishName}</p>
                           </td>
                           <td className="px-6 py-4 text-center">
                              <input 
                                type="number" 
                                value={s.availableQty}
                                onChange={(e) => updateSupplyEntry(s.id, { availableQty: Number(e.target.value) })}
                                className={cn(
                                  "w-20 px-2 py-1 bg-gray-50 border border-gray-100 rounded text-xs font-mono font-bold text-center",
                                  s.availableQty < 500 && "bg-red-50 text-red-600 border-red-100 outline-none"
                                )}
                              />
                           </td>
                           <td className="px-6 py-4 text-center font-mono text-sm font-bold text-gray-900">
                              $<input 
                                type="number" 
                                value={s.pricePerKg}
                                onChange={(e) => updateSupplyEntry(s.id, { pricePerKg: Number(e.target.value) })}
                                className="w-16 bg-transparent border-b border-dashed border-gray-200 focus:border-brand-primary outline-none transition-colors text-center"
                              />
                           </td>
                           <td className="px-6 py-4 text-center">
                              <span className={cn(
                                "text-[10px] font-bold uppercase px-2 py-0.5 rounded border",
                                s.supplyTime === 'Morning' ? "bg-amber-50 text-amber-600 border-amber-100" : "bg-blue-50 text-blue-600 border-blue-100"
                              )}>{s.supplyTime}</span>
                           </td>
                           <td className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest truncate">
                              {new Date(s.lastUpdated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                           </td>
                           <td className="px-6 py-4 text-right">
                              <button 
                                onClick={() => {
                                  deleteSupplyEntry(s.id);
                                  showToast("Supply batch removed from operational tracking", "error");
                                }}
                                className="p-1 px-2 border border-gray-100 text-gray-300 hover:text-red-500 hover:border-red-100 transition-all rounded shadow-sm"
                              >
                                 <X size={14} />
                              </button>
                           </td>
                         </tr>
                       ))}
                    </tbody>
                  </table>
               </div>

               {/* Add Supply Modal */}
               {isSupplyModalOpen && (
                 <div className="fixed inset-0 z-[110] flex items-center justify-center bg-gray-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-300">
                    <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-300">
                       <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                          <h3 className="text-xl font-bold text-gray-900">Operational Log: New Supply</h3>
                          <button onClick={() => setIsSupplyModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400"><X size={24} /></button>
                       </div>
                       <div className="p-8 space-y-5">
                          <div className="space-y-1">
                             <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Partner Entity</label>
                             <select 
                               value={supplyVendorId}
                               onChange={(e) => setSupplyVendorId(Number(e.target.value))}
                               className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-bold outline-none"
                             >
                                {vendors.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
                             </select>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                             <div className="space-y-1">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Fishery Species</label>
                                <select 
                                  value={supplyFishName}
                                  onChange={(e) => setSupplyFishName(e.target.value)}
                                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-bold outline-none"
                                >
                                   {products.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
                                </select>
                             </div>
                             <div className="space-y-1">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Batch Windows</label>
                                <select 
                                  value={supplyTime}
                                  onChange={(e) => setSupplyTime(e.target.value as any)}
                                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-bold outline-none"
                                >
                                   <option value="Morning">Morning Catch</option>
                                   <option value="Evening">Evening Catch</option>
                                </select>
                             </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                             <div className="space-y-1">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Landed Price ($/kg)</label>
                                <input 
                                  type="number" 
                                  value={supplyPrice}
                                  onChange={(e) => setSupplyPrice(Number(e.target.value))}
                                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-bold outline-none" 
                                />
                             </div>
                             <div className="space-y-1">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Arrival Qty (kg)</label>
                                <input 
                                  type="number" 
                                  value={supplyQty}
                                  onChange={(e) => setSupplyQty(Number(e.target.value))}
                                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-bold outline-none" 
                                />
                             </div>
                          </div>
                       </div>
                       <div className="p-8 pt-0">
                          <button 
                            onClick={() => {
                               const v = vendors.find(vend => vend.id === supplyVendorId);
                               if (!v || !supplyFishName) return;
                               addSupplyEntry({
                                  vendorId: v.id,
                                  vendorName: v.name,
                                  fishName: supplyFishName,
                                  pricePerKg: supplyPrice,
                                  availableQty: supplyQty,
                                  supplyTime: supplyTime
                               });
                               showToast(`Supply stream initialized for ${v.name}`, "success");
                               setIsSupplyModalOpen(false);
                            }}
                            className="w-full py-4 bg-brand-primary text-white rounded-2xl text-sm font-bold shadow-xl shadow-brand-primary/20 hover:bg-brand-secondary transition-all"
                          >
                             Commit Supply Entry
                          </button>
                       </div>
                    </div>
                 </div>
               )}
             </div>
           );
        }

        if (activeSubModule === 'Vendor Performance') {
           const sortedPerf = [...performance].sort((a, b) => b.reliabilityScore - a.reliabilityScore);

           return (
             <div className="space-y-6 animate-in fade-in duration-500">
                <div className="flex items-center justify-between">
                  <h1 className="text-2xl font-bold text-gray-900">Partner Intelligence</h1>
                  <span className="text-[10px] font-bold text-emerald-500 bg-emerald-50 px-3 py-1.5 border border-emerald-100 rounded-full uppercase tracking-widest">
                    Real-time KPIs Active
                  </span>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                   <table className="w-full text-left border-collapse">
                      <thead>
                         <tr className="bg-gray-50 text-[10px] uppercase tracking-widest font-bold text-gray-400 border-b border-gray-100">
                           <th className="px-6 py-4">Supply Partner</th>
                           <th className="px-6 py-4">Trust Index</th>
                           <th className="px-6 py-4">Arrival Rate (%)</th>
                           <th className="px-6 py-4">Price Consistency (%)</th>
                           <th className="px-6 py-4">Health Status</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                         {sortedPerf.map((p) => {
                            const vendor = vendors.find(v => v.id === p.vendorId);
                            if (!vendor) return null;
                            return (
                              <tr key={p.vendorId} className="hover:bg-gray-50/50 transition-colors">
                                 <td className="px-6 py-4">
                                    <p className="text-sm font-bold text-gray-900">{vendor.name}</p>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase">{vendor.type}</p>
                                 </td>
                                 <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                       <div className="flex-1 max-w-[100px] h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                          <div 
                                            className={cn(
                                              "h-full transition-all duration-1000",
                                              p.reliabilityScore > 90 ? "bg-emerald-500" : p.reliabilityScore > 80 ? "bg-amber-500" : "bg-red-500"
                                            )} 
                                            style={{ width: `${p.reliabilityScore}%` }} 
                                          />
                                       </div>
                                       <span className={cn(
                                         "text-xs font-bold",
                                         p.reliabilityScore > 90 ? "text-emerald-600" : p.reliabilityScore > 80 ? "text-amber-600" : "text-red-500"
                                       )}>{p.reliabilityScore}%</span>
                                    </div>
                                 </td>
                                 <td className="px-6 py-4 text-center">
                                    <span className="text-sm font-bold text-gray-600">{p.onTimeDelivery}%</span>
                                 </td>
                                 <td className="px-6 py-4 text-center">
                                    <span className="text-sm font-bold text-gray-600">{p.avgPriceConsistency}%</span>
                                 </td>
                                 <td className="px-6 py-4">
                                    <span className={cn(
                                      "text-[10px] font-bold uppercase px-3 py-1 rounded border",
                                      p.lastStatus === 'Excellent' && "bg-emerald-50 text-emerald-600 border-emerald-100",
                                      p.lastStatus === 'Good' && "bg-blue-50 text-blue-600 border-blue-100",
                                      p.lastStatus === 'Poor' && "bg-amber-50 text-amber-600 border-amber-100",
                                      p.lastStatus === 'Critically Low' && "bg-red-50 text-red-600 border-red-100"
                                    )}>{p.lastStatus}</span>
                                 </td>
                              </tr>
                            );
                         })}
                      </tbody>
                   </table>
                </div>
             </div>
           );
        }
        return null;

      case 'Media':
        const filteredMedia = media.filter(m => 
          m.fileName.toLowerCase().includes(mediaSearch.toLowerCase()) ||
          m.productName?.toLowerCase().includes(mediaSearch.toLowerCase())
        );

        return (
          <div className="space-y-6 animate-in fade-in duration-500">
             <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900 font-serif">Media Assets</h1>
                <div className="flex items-center gap-3">
                   <div className="flex bg-gray-100 p-1 rounded-xl">
                      <button 
                        onClick={() => setMediaView('grid')}
                        className={cn(
                          "p-2 rounded-lg transition-all",
                          mediaView === 'grid' ? "bg-white shadow-sm text-brand-primary" : "text-gray-400"
                        )}
                      >
                         <LayoutGrid size={18} />
                      </button>
                      <button 
                        onClick={() => setMediaView('list')}
                        className={cn(
                          "p-2 rounded-lg transition-all",
                          mediaView === 'list' ? "bg-white shadow-sm text-brand-primary" : "text-gray-400"
                        )}
                      >
                         <List size={18} />
                      </button>
                   </div>
                   <button 
                     onClick={() => {
                        const mockImages = [
                          { url: 'https://picsum.photos/seed/crab/800/600', fileName: 'snow_crab_fresh.jpg' },
                          { url: 'https://picsum.photos/seed/squid/800/600', fileName: 'calamari_rings.jpg' },
                          { url: 'https://picsum.photos/seed/lobster/800/600', fileName: 'lobster_red.jpg' }
                        ];
                        addMedia(mockImages);
                        showToast(`Optimized ${mockImages.length} images for CDN distribution`, "success");
                     }}
                     className="flex items-center gap-2 px-6 py-2.5 bg-brand-primary text-white rounded-xl text-sm font-bold shadow-lg shadow-brand-primary/20 hover:bg-brand-secondary transition-all"
                   >
                      <Upload size={18} /> Upload Images
                   </button>
                </div>
             </div>

             <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                <div className="relative">
                   <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                   <input 
                     type="text" 
                     placeholder="Search assets by file name or assigned product..." 
                     value={mediaSearch}
                     onChange={(e) => setMediaSearch(e.target.value)}
                     className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none transition-all"
                   />
                </div>
             </div>

             {mediaView === 'grid' ? (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                   {filteredMedia.map(m => (
                      <div key={m.id} className="group relative bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all">
                         <div className="aspect-square bg-gray-50 relative">
                            <img src={m.url} alt={m.fileName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2">
                               <button 
                                 onClick={() => {
                                    setSelectedMediaId(m.id);
                                    setAssignProductId(m.productId || products[0]?.id || 0);
                                    setIsAssignModalOpen(true);
                                 }}
                                 className="w-full py-1.5 bg-white text-gray-900 rounded-lg text-[10px] font-bold uppercase tracking-wider hover:bg-gray-100 transition-colors"
                               >
                                  {m.productId ? 'Reassign' : 'Assign Product'}
                               </button>
                               <button 
                                 onClick={() => {
                                    if (confirm("Replace this master asset across the system?")) {
                                       const newUrl = `https://picsum.photos/seed/${Math.random().toString()}/800/600`;
                                       updateMedia(m.id, { url: newUrl });
                                       showToast("Distributed image replacement complete", "info");
                                    }
                                 }}
                                 className="w-full py-1.5 bg-brand-primary text-white rounded-lg text-[10px] font-bold uppercase tracking-wider hover:bg-brand-secondary transition-colors"
                               >
                                  Replace
                               </button>
                               <button 
                                 onClick={() => {
                                    if (confirm("Delete this asset? It will be unlinked from any products.")) {
                                       deleteMedia(m.id);
                                       showToast("Asset purged from media server", "error");
                                    }
                                 }}
                                 className="w-full py-1.5 bg-red-500 text-white rounded-lg text-[10px] font-bold uppercase tracking-wider hover:bg-red-600 transition-colors"
                               >
                                  Delete
                               </button>
                            </div>
                         </div>
                         <div className="p-3">
                            <p className="text-[11px] font-bold text-gray-900 truncate mb-0.5">{m.fileName}</p>
                            <p className={cn(
                              "text-[9px] font-bold uppercase tracking-widest",
                              m.productId ? "text-brand-primary" : "text-gray-400"
                            )}>
                               {m.productName || 'Unassigned'}
                            </p>
                         </div>
                      </div>
                   ))}
                </div>
             ) : (
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                   <table className="w-full text-left border-collapse">
                      <thead>
                         <tr className="bg-gray-50 text-[10px] uppercase tracking-widest font-bold text-gray-400 border-b border-gray-100">
                           <th className="px-6 py-4 w-20">Preview</th>
                           <th className="px-6 py-4">File Information</th>
                           <th className="px-6 py-4">Linked Product</th>
                           <th className="px-6 py-4">Discovery Date</th>
                           <th className="px-6 py-4 text-right">Actions</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                         {filteredMedia.map(m => (
                            <tr key={m.id} className="hover:bg-gray-50/50 transition-colors group">
                               <td className="px-6 py-3">
                                  <img src={m.url} alt={m.fileName} className="w-12 h-12 rounded-lg object-cover border border-gray-100 shadow-sm" referrerPolicy="no-referrer" />
                               </td>
                               <td className="px-6 py-3">
                                  <p className="text-sm font-bold text-gray-900">{m.fileName}</p>
                                  <p className="text-[10px] text-gray-400 font-mono">HASH: {m.id.split('-').pop()}</p>
                               </td>
                               <td className="px-6 py-3">
                                  {m.productId ? (
                                     <span className="text-xs font-bold text-brand-primary bg-brand-primary/5 px-2 py-1 rounded-lg border border-brand-primary/10">
                                        {m.productName}
                                     </span>
                                  ) : (
                                     <span className="text-xs font-bold text-gray-400 italic">Standalone Asset</span>
                                  )}
                               </td>
                               <td className="px-6 py-3 text-xs font-medium text-gray-400">
                                  {new Date(m.uploadDate).toLocaleDateString()}
                               </td>
                               <td className="px-6 py-3 text-right">
                                  <div className="flex items-center justify-end gap-2 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                     <button 
                                       onClick={() => {
                                          setSelectedMediaId(m.id);
                                          setAssignProductId(m.productId || products[0]?.id || 0);
                                          setIsAssignModalOpen(true);
                                       }}
                                       className="p-1.5 hover:bg-brand-primary/5 hover:text-brand-primary rounded"
                                     >
                                        <Link size={16} />
                                     </button>
                                     <button 
                                       onClick={() => {
                                          deleteMedia(m.id);
                                          showToast("Asset purged", "error");
                                       }}
                                       className="p-1.5 hover:bg-red-50 hover:text-red-500 rounded"
                                     >
                                        <Trash2 size={16} />
                                     </button>
                                  </div>
                               </td>
                            </tr>
                         ))}
                      </tbody>
                   </table>
                </div>
             )}

             {/* Assign Modal */}
             {isAssignModalOpen && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center bg-gray-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-300">
                   <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-300">
                      <div className="p-8 pb-4">
                         <h3 className="text-xl font-bold text-gray-900">Map Asset to Product</h3>
                         <p className="text-xs text-gray-400 mt-1">This will update the product image across the ecosystem.</p>
                      </div>
                      <div className="p-8 space-y-4">
                         <div className="aspect-video bg-gray-100 rounded-2xl overflow-hidden border border-gray-100">
                            <img 
                              src={media.find(m => m.id === selectedMediaId)?.url} 
                              alt="Binding target" 
                              className="w-full h-full object-cover" 
                              referrerPolicy="no-referrer"
                            />
                         </div>
                         <div className="space-y-1">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Target Product</label>
                            <select 
                              value={assignProductId}
                              onChange={(e) => setAssignProductId(Number(e.target.value))}
                              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-bold outline-none ring-brand-primary/10 focus:ring-4 transition-all"
                            >
                               {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                            </select>
                         </div>
                      </div>
                      <div className="p-8 bg-gray-50 flex gap-3">
                         <button onClick={() => setIsAssignModalOpen(false)} className="flex-1 py-4 text-gray-400 text-sm font-bold">Discard</button>
                         <button 
                           onClick={() => {
                              if (selectedMediaId && assignProductId) {
                                 assignMediaToProduct(selectedMediaId, assignProductId);
                                 showToast("Product visual binding successful", "success");
                                 setIsAssignModalOpen(false);
                              }
                           }}
                           className="flex-1 py-4 bg-brand-primary text-white rounded-2xl text-sm font-bold shadow-lg shadow-brand-primary/20 hover:bg-brand-secondary transition-all"
                         >
                            Apply Binding
                         </button>
                      </div>
                   </div>
                </div>
             )}
          </div>
        );

      case 'Settings':
        const renderSettingsContent = () => {
          switch (activeSubModule) {
            case 'General':
              return (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-400">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <h4 className="text-sm font-bold text-gray-900">Platform Identity</h4>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Platform Name</label>
                        <input 
                          type="text" 
                          value={settings.platformName}
                          onChange={(e) => updateSettings({ platformName: e.target.value })}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-brand-primary/10 transition-all"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Default Language</label>
                        <select 
                          value={settings.defaultLanguage}
                          onChange={(e) => updateSettings({ defaultLanguage: e.target.value })}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-brand-primary/10 transition-all"
                        >
                          <option value="English">English</option>
                          <option value="Hindi">Hindi</option>
                          <option value="Malayalam">Malayalam</option>
                          <option value="Tamil">Tamil</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h4 className="text-sm font-bold text-gray-900">Contact Information</h4>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Support Email</label>
                        <input 
                          type="email" 
                          value={settings.contactEmail}
                          onChange={(e) => updateSettings({ contactEmail: e.target.value })}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-brand-primary/10 transition-all"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Support Phone</label>
                        <input 
                          type="text" 
                          value={settings.contactPhone}
                          onChange={(e) => updateSettings({ contactPhone: e.target.value })}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-brand-primary/10 transition-all"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            
            case 'Delivery':
              return (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-400">
                  <div className="space-y-4">
                    <h4 className="text-sm font-bold text-gray-900">Operational Delivery Slots</h4>
                    <p className="text-xs text-gray-500 max-w-md italic">Configure time windows available for consumer and wholesale fulfillment.</p>
                    
                    <div className="grid grid-cols-1 gap-3">
                      {settings.deliverySlots.map((slot, idx) => (
                        <div key={slot.id} className="flex items-center justify-between p-6 bg-white border border-gray-200 rounded-3xl shadow-sm group hover:border-brand-primary/20 transition-all">
                          <div className="flex items-center gap-4">
                            <div className={cn(
                              "w-12 h-12 rounded-2xl flex items-center justify-center transition-all",
                              slot.enabled ? "bg-brand-primary/5 text-brand-primary" : "bg-gray-50 text-gray-300"
                            )}>
                              <RefreshCw size={20} className={cn(slot.enabled && "animate-spin-slow")} />
                            </div>
                            <div>
                              <p className="text-sm font-bold text-gray-900">{slot.name}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Max Load:</span>
                                <input 
                                  type="number"
                                  value={slot.maxOrders}
                                  onChange={(e) => {
                                    const newSlots = [...settings.deliverySlots];
                                    newSlots[idx] = { ...newSlots[idx], maxOrders: Number(e.target.value) };
                                    updateSettings({ deliverySlots: newSlots });
                                  }}
                                  className="w-12 text-center text-[10px] font-bold text-brand-primary bg-brand-primary/5 rounded border-none outline-none p-0.5"
                                />
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Orders</span>
                              </div>
                            </div>
                          </div>
                          <button 
                            onClick={() => {
                              const newSlots = [...settings.deliverySlots];
                              newSlots[idx] = { ...newSlots[idx], enabled: !newSlots[idx].enabled };
                              updateSettings({ deliverySlots: newSlots });
                            }}
                            className={cn(
                              "px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border",
                              slot.enabled 
                                ? "bg-brand-primary/5 text-brand-primary border-brand-primary/20 hover:bg-brand-primary hover:text-white" 
                                : "bg-gray-50 text-gray-400 border-gray-100 hover:bg-gray-100"
                            )}
                          >
                            {slot.enabled ? 'Enabled' : 'Disabled'}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );

            case 'Units':
              return (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-400">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <h4 className="text-sm font-bold text-gray-900">Standard Localization</h4>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Default Unit</label>
                        <select 
                          value={settings.defaultUnit}
                          onChange={(e) => updateSettings({ defaultUnit: e.target.value })}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-brand-primary/10 transition-all"
                        >
                          <option value="kg">Kilograms (kg)</option>
                          <option value="lb">Pounds (lb)</option>
                          <option value="pack">Pack</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Currency Symbol</label>
                        <select 
                          value={settings.currency}
                          onChange={(e) => updateSettings({ currency: e.target.value })}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-brand-primary/10 transition-all"
                        >
                          <option value="₹">₹ (INR)</option>
                          <option value="$">$ (USD)</option>
                          <option value="€">€ (EUR)</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-sm font-bold text-gray-900">Pricing Algorithms</h4>
                      <label className="flex items-center justify-between p-6 bg-white border border-gray-200 rounded-3xl shadow-sm cursor-pointer group hover:border-brand-primary/20 transition-all">
                        <div>
                          <p className="text-sm font-bold text-gray-900">Psychological Rounding</p>
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Round to nearest 10</p>
                        </div>
                        <div 
                          onClick={() => updateSettings({ priceRounding: !settings.priceRounding })}
                          className={cn(
                            "w-12 h-6 rounded-full transition-all relative",
                            settings.priceRounding ? "bg-brand-primary" : "bg-gray-200"
                          )}
                        >
                          <div className={cn(
                            "absolute top-1 w-4 h-4 bg-white rounded-full transition-all",
                            settings.priceRounding ? "left-7" : "left-1"
                          )} />
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              );

            case 'Visibility':
              return (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-400">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-4">
                        <h4 className="text-sm font-bold text-gray-900">Market Exposure</h4>
                        <div className="space-y-3">
                           {[
                             { id: 'consumerEnabled', label: 'B2C Marketplace', desc: 'Enable consumer-facing storefront.' },
                             { id: 'b2bEnabled', label: 'B2B Wholesale Portal', desc: 'Enable institutional buying engine.' }
                           ].map(rule => (
                             <label key={rule.id} className="flex items-center justify-between p-5 bg-white border border-gray-200 rounded-3xl cursor-pointer hover:border-brand-primary/20 transition-all shadow-sm">
                               <div>
                                 <p className="text-sm font-bold text-gray-900">{rule.label}</p>
                                 <p className="text-[10px] text-gray-500 font-medium">{rule.desc}</p>
                               </div>
                               <input 
                                 type="checkbox" 
                                 checked={settings[rule.id as keyof Settings] as boolean}
                                 onChange={() => updateSettings({ [rule.id]: !(settings[rule.id as keyof Settings]) })}
                                 className="w-5 h-5 rounded text-brand-primary focus:ring-brand-primary transition-all" 
                               />
                             </label>
                           ))}
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h4 className="text-sm font-bold text-gray-900">Inventory Safeguards</h4>
                        <div className="space-y-3">
                           {[
                             { id: 'autoHideOutOfStock', label: 'Auto-Purge Shortages', desc: 'Hide products with 0 units instantly.' },
                             { id: 'globalCategoryVisibility', label: 'Category Master Toggle', desc: 'Show/hide all taxonomies globally.' }
                           ].map(rule => (
                             <label key={rule.id} className="flex items-center justify-between p-5 bg-white border border-gray-200 rounded-3xl cursor-pointer hover:border-brand-primary/20 transition-all shadow-sm">
                               <div>
                                 <p className="text-sm font-bold text-gray-900">{rule.label}</p>
                                 <p className="text-[10px] text-gray-500 font-medium">{rule.desc}</p>
                               </div>
                               <input 
                                 type="checkbox" 
                                 checked={settings[rule.id as keyof Settings] as boolean}
                                 onChange={() => updateSettings({ [rule.id]: !(settings[rule.id as keyof Settings]) })}
                                 className="w-5 h-5 rounded text-brand-primary focus:ring-brand-primary transition-all" 
                               />
                             </label>
                           ))}
                        </div>
                      </div>
                   </div>
                </div>
              );

            case 'System':
              return (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-400 max-w-2xl">
                   <div className="space-y-6">
                      <div className="space-y-4">
                        <h4 className="text-sm font-bold text-gray-900">User Experience</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                           {[
                             { id: 'enableNotifications', label: 'In-App Alerts', icon: AlertTriangle },
                             { id: 'enableQuickEditMode', label: 'Quick Edit Protocol', icon: Edit }
                           ].map(pref => (
                             <button 
                               key={pref.id}
                               onClick={() => updateSettings({ [pref.id]: !(settings[pref.id as keyof Settings]) })}
                               className={cn(
                                 "flex items-center gap-4 p-5 rounded-3xl border transition-all text-left shadow-sm",
                                 settings[pref.id as keyof Settings] 
                                   ? "bg-brand-primary/5 border-brand-primary/20 text-brand-primary" 
                                   : "bg-white border-gray-200 text-gray-400"
                               )}
                             >
                               <div className={cn("p-2 rounded-xl", settings[pref.id as keyof Settings] ? "bg-brand-primary text-white" : "bg-gray-100 text-gray-400")}>
                                 <pref.icon size={18} />
                               </div>
                               <div>
                                 <p className="text-sm font-bold">{pref.label}</p>
                                 <p className="text-[10px] font-bold uppercase tracking-widest">{settings[pref.id as keyof Settings] ? 'Active' : 'Muted'}</p>
                               </div>
                             </button>
                           ))}
                        </div>
                      </div>

                      <div className="pt-8 border-t border-gray-100">
                        <div className="bg-red-50 p-6 rounded-3xl border border-red-100">
                           <h4 className="text-sm font-bold text-red-600 mb-2">Danger Zone</h4>
                           <p className="text-xs text-red-400 font-medium mb-4">Resetting the system will restore all platform parameters to factory defaults. This action can be mimicked instantly.</p>
                           <button 
                             onClick={() => {
                               if (confirm("Restore factory default settings?")) {
                                 resetSettings();
                                 showToast("System preferences restored to baseline", "info");
                               }
                             }}
                             className="px-6 py-3 bg-white text-red-600 border border-red-200 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-red-600 hover:text-white transition-all shadow-sm"
                           >
                              Hard Reset System
                           </button>
                        </div>
                      </div>
                   </div>
                </div>
              );
            
            default:
              return null;
          }
        };

        return (
          <div className="space-y-6 animate-in fade-in duration-500">
             <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900 font-serif">Platform Settings</h1>
                <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100">
                   <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                   <span className="text-[10px] font-bold uppercase tracking-widest">Real-time Sync Active</span>
                </div>
             </div>

             <div className="bg-white rounded-[2.5rem] border border-gray-200 shadow-xl shadow-gray-200/50 overflow-hidden flex min-h-[500px]">
                {/* Secondary Settings Nav */}
                <div className="w-64 bg-gray-50/50 border-r border-gray-100 p-6 space-y-2">
                   {[
                     { id: 'General', label: 'Platform DNA', icon: SettingsIcon },
                     { id: 'Delivery', label: 'Logistics', icon: RefreshCw },
                     { id: 'Units', label: 'Localization', icon: Database },
                     { id: 'Visibility', label: 'Market Rules', icon: Eye },
                     { id: 'System', label: 'Core Prefs', icon: LayoutDashboard },
                   ].map(section => (
                     <button
                       key={section.id}
                       onClick={() => setActiveSubModule(section.id)}
                       className={cn(
                         "w-full flex items-center gap-3 px-5 py-4 rounded-2xl transition-all text-sm font-bold",
                         activeSubModule === section.id 
                           ? "bg-white text-brand-primary shadow-md shadow-brand-primary/5" 
                           : "text-gray-400 hover:text-gray-600"
                       )}
                     >
                       <section.icon size={16} />
                       {section.id}
                     </button>
                   ))}
                </div>

                {/* Settings Viewport */}
                <div className="flex-1 p-10 bg-white">
                   <div className="mb-8 pb-6 border-b border-gray-50 flex items-center justify-between">
                      <div>
                         <h2 className="text-xl font-bold text-gray-900">{activeSubModule} Configuration</h2>
                         <p className="text-xs text-gray-400 font-medium">Manage your platform's {activeSubModule.toLowerCase()} parameters.</p>
                      </div>
                      <button 
                        onClick={() => showToast(`${activeSubModule} preferences deployed`, "success")}
                        className="p-2.5 bg-gray-50 text-gray-400 hover:text-brand-primary hover:bg-brand-primary/5 rounded-xl transition-all"
                      >
                         <RefreshCw size={18} />
                      </button>
                   </div>
                   {renderSettingsContent()}
                </div>
             </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-[#f8f9fa] text-gray-900 font-sans selection:bg-brand-primary selection:text-white">
      {/* Sidebar */}
      <aside className={cn(
        "bg-white border-r border-gray-200 flex flex-col transition-all duration-300 shadow-sm shrink-0 no-scrollbar overflow-y-auto",
        sidebarOpen ? "w-64" : "w-20"
      )}>
        <div className="h-20 px-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
          <div className="flex items-center gap-3">
             <img src="/logo.png" alt="Kadal 2 Kadaai" className="h-8 w-auto" />
             {sidebarOpen && <span className="text-xl font-bold text-brand-primary tracking-tight">Kadal 2 Kadaai Ops</span>}
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {menuItems.map((item) => (
            <div key={item.id}>
              <button
                onClick={() => {
                  setActiveModule(item.id as MainTab);
                  if (item.subTabs) {
                    setActiveSubModule(item.subTabs[0]);
                  } else {
                    setActiveSubModule('');
                  }
                }}
                className={cn(
                  "w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group text-sm font-bold",
                  activeModule === item.id 
                    ? "bg-brand-primary text-white shadow-lg shadow-brand-primary/10" 
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                )}
              >
                <item.icon size={20} className={cn("shrink-0", activeModule === item.id ? "text-white" : "text-gray-400 group-hover:text-brand-primary")} />
                {sidebarOpen && (
                  <div className="flex-1 flex items-center justify-between">
                    <span>{item.id}</span>
                    {item.subTabs && <ChevronRight size={14} className={cn("transition-transform", activeModule === item.id && "-rotate-90")} />}
                  </div>
                )}
              </button>
              
              {sidebarOpen && activeModule === item.id && item.subTabs && (
                <div className="mt-1 ml-9 border-l-2 border-gray-100 pl-4 space-y-1 py-1">
                  {item.subTabs.map(subTab => (
                    <button
                      key={subTab}
                      onClick={() => setActiveSubModule(subTab)}
                      className={cn(
                        "w-full text-left py-2 text-xs font-bold uppercase tracking-widest transition-colors",
                        activeSubModule === subTab ? "text-brand-primary" : "text-gray-400 hover:text-gray-600"
                      )}
                    >
                      {subTab}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        <div className="p-4 mt-auto border-t border-gray-100 bg-gray-50/50">
          <div className={cn("flex items-center gap-4", !sidebarOpen && "justify-center")}>
            <div className="w-10 h-10 rounded-full border-2 border-white shadow-sm overflow-hidden shrink-0">
               <img src="https://ui-avatars.com/api/?name=Admin+K2K&background=1a3c5a&color=fff" alt="Admin" />
            </div>
            {sidebarOpen && (
              <div className="flex-1 overflow-hidden">
                <p className="text-xs font-bold text-gray-900 truncate">S. Commander</p>
                <p className="text-[10px] font-bold text-emerald-500 uppercase">Admin Hub</p>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Panel */}
      <main className="flex-1 flex flex-col overflow-hidden bg-gray-50/30">
        <header className="h-20 px-8 bg-white border-b border-gray-200 flex items-center justify-between shrink-0 sticky top-0 z-20">
          <div className="flex items-center gap-6">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Menu size={20} />
            </button>
            <div className="flex items-baseline gap-2">
               <h1 className="text-lg font-bold text-gray-900">{activeModule}</h1>
               {activeSubModule && (
                 <>
                   <span className="text-gray-300">/</span>
                   <span className="text-sm font-bold text-brand-primary uppercase tracking-widest">{activeSubModule}</span>
                 </>
               )}
            </div>
          </div>

          <div className="flex items-center gap-4">
             <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-100 rounded-lg">
                <BarChart3 size={14} className="text-emerald-500" />
                <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">System Operational</span>
             </div>
             <div className="w-[1px] h-6 bg-gray-200" />
             <button className="text-xs font-bold text-gray-400 hover:text-gray-900 transition-colors uppercase tracking-[0.2em]">Logout</button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-10 no-scrollbar">
           {renderContent()}
        </div>

        <footer className="h-12 px-8 bg-white border-t border-gray-200 flex items-center justify-between text-[10px] font-bold text-gray-400 uppercase tracking-widest shrink-0">
          <div className="flex gap-4">
             <span>v4.2.0-Production</span>
             <span className="text-gray-200">|</span>
             <button onClick={() => navigate('/')} className="hover:text-brand-primary transition-colors">Client View</button>
          </div>
          <div className="flex gap-6">
            <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" /> API Cloud: UP</span>
            <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" /> Stock Engine: Live</span>
          </div>
        </footer>
      </main>
    </div>
  );
}
