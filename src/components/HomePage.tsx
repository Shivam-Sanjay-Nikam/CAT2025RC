import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Essay } from '../types';
import { loadData } from '../utils/dataLoader';
import { BookOpen, Clock, Search, Filter, Star, TrendingUp, Users, Award, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';

const HomePage: React.FC = () => {
  const [essays, setEssays] = useState<Essay[]>([]);
  const [filteredEssays, setFilteredEssays] = useState<Essay[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [selectedTimeRange, setSelectedTimeRange] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const essaysPerPage = 9;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await loadData();
        // Sort essays in reverse order by createdAt date (newest first)
        const sortedEssays = data.essays.sort((a, b) => {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
        setEssays(sortedEssays);
        setFilteredEssays(sortedEssays);
      } catch (error) {
        console.error('Error loading essays:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    let filtered = essays;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(essay =>
        essay.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        essay.content?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Difficulty filter
    if (selectedDifficulty !== 'all') {
      filtered = filtered.filter(essay => essay.difficulty === selectedDifficulty);
    }

    // Time range filter
    if (selectedTimeRange !== 'all') {
      filtered = filtered.filter(essay => {
        if (selectedTimeRange === 'short') return essay.timeLimit <= 10;
        if (selectedTimeRange === 'medium') return essay.timeLimit > 10 && essay.timeLimit <= 20;
        if (selectedTimeRange === 'long') return essay.timeLimit > 20;
        return true;
      });
    }

    // Maintain reverse sort order (newest first) after filtering
    const sortedFiltered = filtered.sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
    
    setFilteredEssays(sortedFiltered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [essays, searchTerm, selectedDifficulty, selectedTimeRange]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-emerald-700 bg-emerald-50 border-emerald-200';
      case 'Medium': return 'text-amber-700 bg-amber-50 border-amber-200';
      case 'Hard': return 'text-rose-700 bg-rose-50 border-rose-200';
      default: return 'text-slate-700 bg-slate-50 border-slate-200';
    }
  };

  const isNewlyAdded = (createdAt: string) => {
    const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
    return createdAt === today;
  };

  // Pagination logic
  const totalPages = Math.ceil(filteredEssays.length / essaysPerPage);
  const startIndex = (currentPage - 1) * essaysPerPage;
  const endIndex = startIndex + essaysPerPage;
  const currentEssays = filteredEssays.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-xl text-slate-600">Loading content...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Star size={16} />
            Reading Comprehension Platform
          </div>
          <h1 className="text-5xl font-bold text-slate-900 mb-6 leading-tight">
            Master CAT Reading Comprehension
            <span className="block text-indigo-600">Like Never Before</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed mb-8">
            Elevate your analytical skills with our meticulously curated passages, 
            designed by experts to mirror the complexity and depth of actual CAT examinations.
          </p>
          
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto mb-12">
            <div className="text-center">
              <div className="text-3xl font-bold text-indigo-600 mb-2">500+</div>
              <div className="text-slate-600">Reading Passages</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-indigo-600 mb-2">95%</div>
              <div className="text-slate-600">Success Rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-indigo-600 mb-2">10k+</div>
              <div className="text-slate-600">Happy Students</div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200/50 p-6 mb-12">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="text"
                placeholder="Search passages by title or content..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            {/* Filters */}
            <div className="flex gap-4">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={16} />
                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  className="pl-10 pr-8 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none cursor-pointer"
                >
                  <option value="all">All Levels</option>
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>

              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={16} />
                <select
                  value={selectedTimeRange}
                  onChange={(e) => setSelectedTimeRange(e.target.value)}
                  className="pl-10 pr-8 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none cursor-pointer"
                >
                  <option value="all">All Durations</option>
                  <option value="short">Quick (≤10 min)</option>
                  <option value="medium">Standard (11-20 min)</option>
                  <option value="long">Extended (20 min)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Results count */}
          <div className="mt-4 text-sm text-slate-600">
            Showing {startIndex + 1}-{Math.min(endIndex, filteredEssays.length)} of {filteredEssays.length} passages
          </div>
        </div>

        {/* Essays Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {currentEssays.map((essay, index) => (
            <Link
              key={essay.id}
              to={`/essay/${essay.id}`}
              className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200/50 hover:shadow-2xl hover:border-indigo-200 transition-all duration-500 overflow-hidden"
            >
              <div className="p-8">
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                      {index + 1}
                    </div>
                    <div className="flex flex-col gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(essay.difficulty)}`}>
                        {essay.difficulty}
                      </span>
                      {isNewlyAdded(essay.createdAt) && (
                        <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r from-pink-500 via-red-500 to-orange-500 text-white border-2 border-yellow-300 shadow-lg animate-pulse hover:animate-bounce transform hover:scale-110 transition-all duration-300 relative overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300 opacity-30 animate-ping"></div>
                          <Sparkles size={12} className="relative z-10 animate-spin" style={{animationDuration: '2s'}} />
                          <span className="relative z-10 text-yellow-100 drop-shadow-lg">✨ NEW ✨</span>
                          <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-300 rounded-full animate-ping"></div>
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <TrendingUp className="text-indigo-500" size={20} />
                  </div>
                </div>
                
                {/* Title */}
                <h3 className="text-xl font-bold text-slate-900 mb-4 leading-tight group-hover:text-indigo-600 transition-colors duration-300">
                  {essay.title}
                </h3>
                
                {/* Preview */}
                <p className="text-slate-600 text-sm leading-relaxed mb-6 line-clamp-3">
                  {essay.content?.substring(0, 150)}...
                </p>
                
                {/* Meta Info */}
                <div className="flex items-center justify-between text-sm text-slate-500 mb-6">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <Clock size={14} />
                      {essay.timeLimit} min
                    </span>
                    <span className="flex items-center gap-1">
                      <BookOpen size={14} />
                      {essay.questions.length} questions
                    </span>
                  </div>
                </div>
                
                {/* CTA */}
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4 border border-indigo-100">
                  <div className="flex items-center justify-between">
                    <span className="text-indigo-700 font-medium">Start Assessment</span>
                    <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center group-hover:bg-indigo-700 transition-colors duration-300">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-12">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                currentPage === 1
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  : 'bg-white text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 border border-slate-200 hover:border-indigo-200'
              }`}
            >
              <ChevronLeft size={18} />
              Previous
            </button>

            <div className="flex items-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                // Show first page, last page, current page, and pages around current page
                const shouldShow = page === 1 || page === totalPages || 
                  (page >= currentPage - 1 && page <= currentPage + 1);
                
                if (!shouldShow) {
                  // Show ellipsis
                  if (page === currentPage - 2 || page === currentPage + 2) {
                    return (
                      <span key={page} className="px-2 py-1 text-slate-400">
                        ...
                      </span>
                    );
                  }
                  return null;
                }

                return (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`w-10 h-10 rounded-lg font-medium transition-all duration-200 ${
                      page === currentPage
                        ? 'bg-indigo-600 text-white shadow-lg'
                        : 'bg-white text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 border border-slate-200 hover:border-indigo-200'
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                currentPage === totalPages
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  : 'bg-white text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 border border-slate-200 hover:border-indigo-200'
              }`}
            >
              Next
              <ChevronRight size={18} />
            </button>
          </div>
        )}

        {/* Empty State */}
        {filteredEssays.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="text-slate-400" size={32} />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">No passages found</h3>
            <p className="text-slate-600 mb-6">Try adjusting your search terms or filters</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedDifficulty('all');
                setSelectedTimeRange('all');
                setCurrentPage(1);
              }}
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors duration-200"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Bottom CTA */}
        <div className="text-center mt-20">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-12 text-white">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold mb-4">Ready to Excel in CAT 2025?</h2>
              <p className="text-xl opacity-90 mb-8">
                Join thousands of successful candidates who chose Backbenchers for their CAT preparation
              </p>
              <div className="flex items-center justify-center gap-8 mb-8">
                <div className="flex items-center gap-2">
                  <Users className="text-indigo-200" size={20} />
                  <span>10,000+ Students</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="text-indigo-200" size={20} />
                  <span>95% Success Rate</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="text-indigo-200" size={20} />
                  <span>Expert Curated</span>
                </div>
              </div>
              <Link
                to="/"
                className="inline-block bg-white text-indigo-600 px-8 py-4 rounded-xl font-bold hover:bg-slate-50 transition-colors duration-300 shadow-lg"
              >
                Start Reading Now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;