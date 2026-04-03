import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, AlertTriangle, Droplets, Brain, Wind, Shield, PlusCircle, Upload, MapPin, Calendar, User, Edit2, Trash2, ChevronRight, ExternalLink } from 'lucide-react';
import { db } from '../utils/firebase';
import { collection, addDoc, getDocs, query, orderBy, serverTimestamp, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import electronicsData from '../data/electronics.json';

const ToxicityDB = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [filteredItems, setFilteredItems] = useState(electronicsData);
  const [showBlogForm, setShowBlogForm] = useState(false);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, isAuthenticated } = useAuth();
  const { addToast } = useToast();

  // Blog form state
  const [blogData, setBlogData] = useState({
    title: '',
    location: '',
    content: '',
    attachment: null
  });
  
  // Editing state
  const [editingBlogId, setEditingBlogId] = useState(null);
  const [selectedBlog, setSelectedBlog] = useState(null);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const q = query(collection(db, 'blogs'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const blogList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setBlogs(blogList);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching blogs:', error);
      setLoading(false);
    }
  };

  const handleBlogSubmit = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      addToast('Please sign in to submit a blog', 'error');
      return;
    }

    if (!blogData.title || !blogData.location || !blogData.content) {
      addToast('Please fill in all required fields', 'error');
      return;
    }

    try {
      if (editingBlogId) {
        // Update existing blog
        await updateDoc(doc(db, 'blogs', editingBlogId), {
          title: blogData.title,
          location: blogData.location,
          content: blogData.content,
          attachment: blogData.attachment,
          updatedAt: serverTimestamp()
        });
        addToast('Blog updated successfully!', 'success');
        setEditingBlogId(null);
      } else {
        // Create new blog
        await addDoc(collection(db, 'blogs'), {
          title: blogData.title,
          location: blogData.location,
          content: blogData.content,
          attachment: blogData.attachment,
          userId: user.uid,
          userName: user.name,
          userEmail: user.email,
          createdAt: serverTimestamp()
        });
        addToast('Blog submitted successfully!', 'success');
      }
      
      setBlogData({ title: '', location: '', content: '', attachment: null });
      setShowBlogForm(false);
      fetchBlogs();
    } catch (error) {
      console.error('Error saving blog:', error);
      addToast('Failed to save blog. Please try again.', 'error');
    }
  };

  const handleEditBlog = (blog) => {
    if (!isAuthenticated || user.uid !== blog.userId) {
      addToast('You can only edit your own blogs', 'error');
      return;
    }
    
    setBlogData({
      title: blog.title,
      location: blog.location,
      content: blog.content,
      attachment: blog.attachment
    });
    setEditingBlogId(blog.id);
    setShowBlogForm(true);
  };

  const handleDeleteBlog = async (blogId) => {
    if (!isAuthenticated) {
      addToast('Please sign in to delete blogs', 'error');
      return;
    }

    const blog = blogs.find(b => b.id === blogId);
    if (blog && user.uid !== blog.userId) {
      addToast('You can only delete your own blogs', 'error');
      return;
    }

    if (window.confirm('Are you sure you want to delete this blog?')) {
      try {
        await deleteDoc(doc(db, 'blogs', blogId));
        addToast('Blog deleted successfully!', 'success');
        fetchBlogs();
      } catch (error) {
        console.error('Error deleting blog:', error);
        addToast('Failed to delete blog. Please try again.', 'error');
      }
    }
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    
    if (term.trim() === '') {
      setFilteredItems(electronicsData);
    } else {
      const filtered = electronicsData.filter(item =>
        item.name.toLowerCase().includes(term) ||
        item.category.toLowerCase().includes(term) ||
        item.description.toLowerCase().includes(term)
      );
      setFilteredItems(filtered);
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 border-red-300 text-red-800';
      case 'high':
        return 'bg-orange-100 border-orange-300 text-orange-800';
      case 'medium':
        return 'bg-yellow-100 border-yellow-300 text-yellow-800';
      default:
        return 'bg-blue-100 border-blue-300 text-blue-800';
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'critical':
        return <AlertTriangle className="h-5 w-5" />;
      case 'high':
        return <Droplets className="h-5 w-5" />;
      case 'medium':
        return <Wind className="h-5 w-5" />;
      default:
        return <Shield className="h-5 w-5" />;
    }
  };

  return (
    <>
      {/* Hero Section with Search */}
      <section className="bg-gradient-to-br from-emerald-50 via-white to-blue-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Toxicity & Health Database
            </h1>
            <p className="text-xl text-slate-600 mb-8">
              Search electronic devices to learn about toxic chemicals and their health effects
            </p>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative max-w-2xl mx-auto"
          >
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-slate-400" />
            <input
              type="text"
              placeholder="Search for laptops, batteries, phones, TVs..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-slate-200 focus:border-emerald-500 focus:outline-none text-lg shadow-lg"
            />
            {searchTerm && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilteredItems(electronicsData);
                }}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </motion.div>

          {/* ADD BLOG Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-8"
          >
            <button
              onClick={() => setShowBlogForm(true)}
              className="inline-flex items-center bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-8 py-4 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl hover:scale-105"
            >
              <PlusCircle className="h-5 w-5 mr-2" />
              ADD BLOG
            </button>
          </motion.div>
        </div>
      </section>

      {/* Results Grid */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Blogs Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-16"
          >
            <h2 className="text-3xl font-bold text-slate-900 mb-8">Community Blogs</h2>
            
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
              </div>
            ) : blogs.length === 0 ? (
              <div className="text-center py-12 bg-slate-50 rounded-2xl">
                <p className="text-slate-500 text-lg">No blogs yet. Be the first to share your story!</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {blogs.map((blog) => (
                  <motion.div
                    key={blog.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.02, boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
                    className="bg-white border-2 border-slate-200 rounded-2xl p-6 shadow-md hover:border-emerald-300 transition-all relative"
                  >
                    {/* Edit/Delete Buttons (only for author) */}
                    {isAuthenticated && user.uid === blog.userId && (
                      <div className="absolute top-4 right-4 flex space-x-2 z-10">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditBlog(blog);
                          }}
                          className="p-2 bg-blue-50 hover:bg-blue-100 rounded-full transition-colors text-blue-600"
                          title="Edit blog"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteBlog(blog.id);
                          }}
                          className="p-2 bg-red-50 hover:bg-red-100 rounded-full transition-colors text-red-600"
                          title="Delete blog"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                    
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-2 text-sm text-slate-500">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {blog.createdAt?.toDate ? blog.createdAt.toDate().toLocaleDateString() : 'Recent'}
                        </span>
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-bold text-slate-900 mb-3">{blog.title}</h3>
                    
                    <div className="flex items-center text-sm text-slate-600 mb-4">
                      <MapPin className="h-4 w-4 mr-1 text-emerald-600" />
                      <span>{blog.location}</span>
                    </div>
                    
                    <p className="text-slate-700 leading-relaxed mb-4 line-clamp-3">
                      {blog.content}
                    </p>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-slate-400" />
                        <span className="text-sm text-slate-600 font-medium">{blog.userName}</span>
                      </div>
                      <button
                        onClick={() => setSelectedBlog(blog)}
                        className="text-emerald-600 hover:text-emerald-700 text-sm font-semibold flex items-center transition-colors group"
                      >
                        Learn More
                        <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Electronics Database Section */}
          <motion.div 
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            layout
          >
            <AnimatePresence>
              {filteredItems.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  whileHover={{ scale: 1.02, boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
                  onClick={() => setSelectedItem(item)}
                  className="bg-white border-2 border-slate-200 rounded-2xl p-6 cursor-pointer shadow-md hover:border-emerald-300 transition-all"
                >
                  <div className="text-4xl mb-4">{item.image}</div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{item.name}</h3>
                  <p className="text-sm text-emerald-600 font-semibold mb-3">{item.category}</p>
                  <p className="text-slate-600 text-sm leading-relaxed">{item.description}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-xs text-slate-500">
                      {item.toxins.length} toxic substances
                    </span>
                    <span className="text-emerald-600 text-sm font-medium">Learn More →</span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {filteredItems.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <p className="text-slate-500 text-lg">No devices found matching "{searchTerm}"</p>
            </motion.div>
          )}
        </div>
      </section>

      {/* Detail View Modal */}
      <AnimatePresence>
        {selectedItem && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedItem(null)}
              className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
            />
            
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 50 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
            >
              <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex justify-between items-center rounded-t-3xl">
                  <div className="flex items-center space-x-4">
                    <span className="text-5xl">{selectedItem.image}</span>
                    <div>
                      <h2 className="text-3xl font-bold text-slate-900">{selectedItem.name}</h2>
                      <p className="text-emerald-600 font-medium">{selectedItem.category}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedItem(null)}
                    className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                  >
                    <X className="h-6 w-6 text-slate-500" />
                  </button>
                </div>

                {/* Content */}
                <div className="p-6">
                  <p className="text-slate-700 text-lg mb-8 leading-relaxed">
                    {selectedItem.description}
                  </p>

                  <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
                    <AlertTriangle className="h-6 w-6 mr-3 text-red-600" />
                    Toxic Chemicals & Health Hazards
                  </h3>

                  <div className="space-y-4">
                    {selectedItem.toxins.map((toxin, index) => (
                      <motion.div
                        key={toxin.name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`rounded-2xl border-2 p-6 ${getSeverityColor(toxin.severity)}`}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            {getSeverityIcon(toxin.severity)}
                            <h4 className="text-xl font-bold">{toxin.name}</h4>
                          </div>
                          <span className="text-xs font-semibold uppercase tracking-wide opacity-75">
                            {toxin.severity}
                          </span>
                        </div>
                        
                        <p className="text-sm font-medium mb-3 opacity-90">
                          Amount: {toxin.amount}
                        </p>
                        
                        <div className="flex items-start space-x-3">
                          <Brain className="h-5 w-5 mt-0.5 flex-shrink-0" />
                          <p className="leading-relaxed">
                            {toxin.effect}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Warning Footer */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="mt-8 bg-red-50 border-2 border-red-200 rounded-xl p-6"
                  >
                    <div className="flex items-start space-x-3">
                      <AlertTriangle className="h-6 w-6 text-red-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-bold text-red-800 mb-2">Safety Warning</h4>
                        <p className="text-red-700 text-sm leading-relaxed">
                          Never burn or improperly dispose of electronic waste. The fumes released 
                          contain these toxic chemicals and can cause immediate and long-term health damage. 
                          Always use certified recycling facilities.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Blog Form Modal */}
      <AnimatePresence>
        {showBlogForm && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowBlogForm(false)}
              className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
            />
            
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 50 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
            >
              <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex justify-between items-center rounded-t-3xl">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">{editingBlogId ? 'Edit Blog Post' : 'Submit a Blog Post'}</h2>
                    <p className="text-sm text-slate-600">{editingBlogId ? 'Update your experience with e-waste and health' : 'Share your experience with e-waste and health'}</p>
                  </div>
                  <button
                    onClick={() => setShowBlogForm(false)}
                    className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                  >
                    <X className="h-6 w-6 text-slate-500" />
                  </button>
                </div>

                {/* Form */}
                <div className="p-6">
                  <form onSubmit={handleBlogSubmit} className="space-y-6">
                    {/* Title Field */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Title *
                      </label>
                      <input
                        type="text"
                        value={blogData.title}
                        onChange={(e) => setBlogData({ ...blogData, title: e.target.value })}
                        placeholder="Enter blog title"
                        className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-emerald-500 focus:outline-none transition-colors"
                        required
                      />
                    </div>

                    {/* Location Field */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Location *
                      </label>
                      <input
                        type="text"
                        value={blogData.location}
                        onChange={(e) => setBlogData({ ...blogData, location: e.target.value })}
                        placeholder="City, State or specific location"
                        className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-emerald-500 focus:outline-none transition-colors"
                        required
                      />
                    </div>

                    {/* Content Field */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Blog Content *
                      </label>
                      <textarea
                        value={blogData.content}
                        onChange={(e) => setBlogData({ ...blogData, content: e.target.value })}
                        placeholder="Share your story, observations, or experiences..."
                        rows="6"
                        className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-emerald-500 focus:outline-none transition-colors resize-none"
                        required
                      />
                    </div>

                    {/* Attachment Field (Optional) */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Attachment (Optional)
                      </label>
                      <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center">
                        <Upload className="h-12 w-12 text-slate-400 mx-auto mb-3" />
                        <p className="text-sm text-slate-600 mb-2">
                          Drag and drop or click to upload
                        </p>
                        <p className="text-xs text-slate-500">
                          Images, documents, or other files (max 5MB)
                        </p>
                        <input
                          type="file"
                          accept="image/*,.pdf,.doc,.docx"
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                              // In a real app, you'd upload to Firebase Storage here
                              // For now, we'll just store the file name
                              setBlogData({ ...blogData, attachment: URL.createObjectURL(file) });
                              addToast('File attached successfully', 'success');
                            }
                          }}
                          className="mt-4"
                        />
                        {blogData.attachment && (
                          <p className="text-sm text-emerald-600 mt-2 font-medium">
                            File attached ✓
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex gap-4 pt-4">
                      <button
                        type="button"
                        onClick={() => setShowBlogForm(false)}
                        className="flex-1 px-6 py-3 border-2 border-slate-300 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl"
                      >
                        Submit Blog
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Blog Detail Modal */}
      <AnimatePresence>
        {selectedBlog && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedBlog(null)}
              className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
            />
            
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 50 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
            >
              <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex justify-between items-center rounded-t-3xl">
                  <div className="flex items-start space-x-4">
                    <div className="text-4xl">📝</div>
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900">{selectedBlog.title}</h2>
                      <div className="flex items-center space-x-4 mt-2 text-sm text-slate-600">
                        <div className="flex items-center space-x-1">
                          <User className="h-4 w-4" />
                          <span>{selectedBlog.userName}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-4 w-4" />
                          <span>{selectedBlog.location}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {selectedBlog.createdAt?.toDate ? selectedBlog.createdAt.toDate().toLocaleDateString() : 'Recent'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedBlog(null)}
                    className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                  >
                    <X className="h-6 w-6 text-slate-500" />
                  </button>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="prose max-w-none">
                    <p className="text-slate-700 text-lg leading-relaxed whitespace-pre-wrap">
                      {selectedBlog.content}
                    </p>
                  </div>

                  {/* Attachment (if any) */}
                  {selectedBlog.attachment && (
                    <div className="mt-8 pt-6 border-t border-slate-200">
                      <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                        <Upload className="h-5 w-5 mr-2 text-emerald-600" />
                        Attachment
                      </h3>
                      <a
                        href={selectedBlog.attachment}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center bg-emerald-50 hover:bg-emerald-100 text-emerald-700 px-6 py-3 rounded-xl font-medium transition-all"
                      >
                        <ExternalLink className="h-5 w-5 mr-2" />
                        View Attachment
                      </a>
                    </div>
                  )}

                  {/* Author Info Footer */}
                  <div className="mt-8 pt-6 border-t border-slate-200 bg-slate-50 -mx-6 -mb-6 p-6 rounded-b-3xl">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="bg-emerald-100 p-3 rounded-full">
                          <User className="h-6 w-6 text-emerald-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">{selectedBlog.userName}</p>
                          <p className="text-sm text-slate-500">{selectedBlog.userEmail}</p>
                        </div>
                      </div>
                      {isAuthenticated && user.uid === selectedBlog.userId && (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => {
                              handleEditBlog(selectedBlog);
                              setSelectedBlog(null);
                            }}
                            className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                          >
                            <Edit2 className="h-4 w-4 mr-2" />
                            Edit
                          </button>
                          <button
                            onClick={() => {
                              handleDeleteBlog(selectedBlog.id);
                              setSelectedBlog(null);
                            }}
                            className="flex items-center bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default ToxicityDB;
