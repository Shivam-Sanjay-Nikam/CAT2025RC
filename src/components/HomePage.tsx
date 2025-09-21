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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Hero Section */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium mb-4 sm:mb-6">
            <Star size={14} className="sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Reading Comprehension Platform</span>
            <span className="sm:hidden">RC Platform</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-4 sm:mb-6 leading-tight px-2">
            Master CAT Reading Comprehension
            <span className="block text-indigo-600">Like Never Before</span>
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed mb-6 sm:mb-8 px-4">
            Elevate your analytical skills with our meticulously curated passages, 
            designed by experts to mirror the complexity and depth of actual CAT examinations.
          </p>
          
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8 max-w-2xl mx-auto mb-8 sm:mb-12">
            <div className="text-center">
              <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-indigo-600 mb-1 sm:mb-2">Will Add upto 500+</div>
              <div className="text-sm sm:text-base text-slate-600">Reading Passages</div>
            </div>
            <div className="text-center">
              <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-indigo-600 mb-1 sm:mb-2">100+ current</div>
              <div className="text-sm sm:text-base text-slate-600">Happy Students</div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200/50 p-4 sm:p-6 mb-8 sm:mb-12">
          <div className="flex flex-col gap-4 sm:gap-6">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Search passages by title or content..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <div className="relative flex-1">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={14} />
                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  className="w-full pl-9 sm:pl-10 pr-8 py-2.5 sm:py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none cursor-pointer text-sm sm:text-base"
                >
                  <option value="all">All Levels</option>
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>

              <div className="relative flex-1">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={14} />
                <select
                  value={selectedTimeRange}
                  onChange={(e) => setSelectedTimeRange(e.target.value)}
                  className="w-full pl-9 sm:pl-10 pr-8 py-2.5 sm:py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none cursor-pointer text-sm sm:text-base"
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
          <div className="mt-3 sm:mt-4 text-xs sm:text-sm text-slate-600">
            Showing {startIndex + 1}-{Math.min(endIndex, filteredEssays.length)} of {filteredEssays.length} passages
          </div>
        </div>

        {/* Essays Grid */}
        <div className="grid gap-4 sm:gap-6 lg:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {currentEssays.map((essay, index) => (
            <Link
              key={essay.id}
              to={`/essay/${essay.id}`}
              className="group bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg border border-slate-200/50 hover:shadow-2xl hover:border-indigo-200 transition-all duration-500 overflow-hidden"
            >
              <div className="p-4 sm:p-6 lg:p-8">
                {/* Header */}
                <div className="flex items-start justify-between mb-4 sm:mb-6">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg sm:rounded-xl flex items-center justify-center text-white font-bold text-sm sm:text-base lg:text-lg shadow-lg">
                      {index + 1}
                    </div>
                    <div className="flex flex-col gap-1 sm:gap-2">
                      <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(essay.difficulty)}`}>
                        {essay.difficulty}
                      </span>
                      {isNewlyAdded(essay.createdAt) && (
                        <span className="inline-flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs font-bold bg-gradient-to-r from-pink-500 via-red-500 to-orange-500 text-white border-2 border-yellow-300 shadow-lg animate-pulse hover:animate-bounce transform hover:scale-110 transition-all duration-300 relative overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300 opacity-30 animate-ping"></div>
                          <Sparkles size={10} className="relative z-10 animate-spin sm:w-3 sm:h-3" style={{animationDuration: '2s'}} />
                          <span className="relative z-10 text-yellow-100 drop-shadow-lg text-xs">✨ NEW ✨</span>
                          <div className="absolute -top-1 -right-1 w-2 h-2 sm:w-3 sm:h-3 bg-yellow-300 rounded-full animate-ping"></div>
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <TrendingUp className="text-indigo-500" size={16} />
                  </div>
                </div>
                
                {/* Title */}
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-3 sm:mb-4 leading-tight group-hover:text-indigo-600 transition-colors duration-300">
                  {essay.title}
                </h3>
                
                {/* Preview */}
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-4 sm:mb-6 line-clamp-3">
                  {essay.content?.substring(0, 120)}...
                </p>
                
                {/* Meta Info */}
                <div className="flex items-center justify-between text-xs sm:text-sm text-slate-500 mb-4 sm:mb-6">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <span className="flex items-center gap-1">
                      <Clock size={12} />
                      {essay.timeLimit} min
                    </span>
                    <span className="flex items-center gap-1">
                      <BookOpen size={12} />
                      {essay.questions.length} questions
                    </span>
                  </div>
                </div>
                
                {/* CTA */}
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-indigo-100">
                  <div className="flex items-center justify-between">
                    <span className="text-indigo-700 font-medium text-sm sm:text-base">Start Assessment</span>
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-indigo-600 rounded-md sm:rounded-lg flex items-center justify-center group-hover:bg-indigo-700 transition-colors duration-300">
                      <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
          <div className="flex justify-center items-center gap-2 sm:gap-4 mt-8 sm:mt-12 px-4">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 rounded-lg font-medium transition-all duration-200 text-sm sm:text-base ${
                currentPage === 1
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  : 'bg-white text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 border border-slate-200 hover:border-indigo-200'
              }`}
            >
              <ChevronLeft size={16} />
              <span className="hidden sm:inline">Previous</span>
            </button>

            <div className="flex items-center gap-1 sm:gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                // Show first page, last page, current page, and pages around current page
                const shouldShow = page === 1 || page === totalPages || 
                  (page >= currentPage - 1 && page <= currentPage + 1);
                
                if (!shouldShow) {
                  // Show ellipsis
                  if (page === currentPage - 2 || page === currentPage + 2) {
                    return (
                      <span key={page} className="px-1 sm:px-2 py-1 text-slate-400 text-sm">
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
                    className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg font-medium transition-all duration-200 text-sm sm:text-base ${
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
              className={`flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 rounded-lg font-medium transition-all duration-200 text-sm sm:text-base ${
                currentPage === totalPages
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  : 'bg-white text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 border border-slate-200 hover:border-indigo-200'
              }`}
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRight size={16} />
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
        <div className="text-center mt-12 sm:mt-16 lg:mt-20 px-4">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12 text-white">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">Ready to Excel in CAT 2025?</h2>
              <p className="text-base sm:text-lg lg:text-xl opacity-90 mb-6 sm:mb-8">
                Join thousands of successful candidates who chose Backbenchers for their CAT preparation
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 lg:gap-8 mb-6 sm:mb-8">
                <div className="flex items-center gap-2">
                  <Users className="text-indigo-200" size={18} />
                  <span className="text-sm sm:text-base">10,000+ Students</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="text-indigo-200" size={18} />
                  <span className="text-sm sm:text-base">95% Success Rate</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="text-indigo-200" size={18} />
                  <span className="text-sm sm:text-base">Expert Curated</span>
                </div>
              </div>
              <Link
                to="/"
                className="inline-block bg-white text-indigo-600 px-6 sm:px-8 py-3 sm:py-4 rounded-lg sm:rounded-xl font-bold hover:bg-slate-50 transition-colors duration-300 shadow-lg text-sm sm:text-base"
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