import React, { useState, useEffect } from 'react';
import { Essay } from '../types';
import { loadData } from '../utils/dataLoader';
import { BookOpen, Clock, Crown, Scroll } from 'lucide-react';

interface HomePageProps {
  onSelectEssay: (essayId: string) => void;
}

const HomePage: React.FC<HomePageProps> = ({ onSelectEssay }) => {
  const [essays, setEssays] = useState<Essay[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await loadData();
        setEssays(data.essays);
      } catch (error) {
        console.error('Error loading essays:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-emerald-700 bg-emerald-50 border-emerald-200';
      case 'Medium': return 'text-amber-700 bg-amber-50 border-amber-200';
      case 'Hard': return 'text-rose-700 bg-rose-50 border-rose-200';
      default: return 'text-slate-700 bg-slate-50 border-slate-200';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-xl text-slate-600 font-light">Loading essays...</p>
        </div>
      </div>
    );
  }

  if (essays.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-slate-600 font-light">No essays available at the moment.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div className="max-w-6xl mx-auto px-8 py-12">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <Crown className="text-amber-600 mr-4" size={48} />
            <h1 className="text-5xl font-serif text-slate-900 tracking-wide">
              CAT 2025 Reading Comprehension 
            </h1>
            <Crown className="text-amber-600 ml-4" size={48} />
          </div>
          <div className="w-24 h-1 bg-gradient-to-r from-amber-400 to-amber-600 mx-auto mb-6"></div>
          <p className="text-xl text-slate-600 leading-relaxed font-light max-w-3xl mx-auto">
            Master the art of comprehension with meticulously curated passages designed to elevate your analytical prowess and critical thinking abilities.
          </p>
        </div>

        {/* Elegant Introduction */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200/50 p-8 mb-12">
          <div className="flex items-center justify-center mb-6">
            <Scroll className="text-slate-600 mr-3" size={32} />
            <h2 className="text-2xl font-serif text-slate-800">Excellence in Comprehension</h2>
          </div>
          <p className="text-slate-600 text-center leading-relaxed font-light">
            Each passage has been carefully selected to challenge your understanding and enhance your ability to extract meaning from complex texts. 
            Approach each question with precision and thoughtful analysis.
          </p>
        </div>

        {/* Essay Collection */}
        <div className="mb-8">
          <h3 className="text-3xl font-serif text-slate-800 text-center mb-12">Distinguished Passages</h3>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {essays.map((essay, index) => (
              <div
                key={essay.id}
                className="group bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200/50 hover:shadow-2xl hover:border-slate-300/50 transition-all duration-500 cursor-pointer transform hover:-translate-y-2"
                onClick={() => onSelectEssay(essay.id)}
              >
                <div className="p-8">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gradient-to-br from-slate-700 to-slate-900 rounded-full flex items-center justify-center text-white font-serif text-lg mr-4">
                        {index + 1}
                      </div>
                      <div>
                        <h4 className="text-xl font-serif text-slate-900 leading-tight mb-2">
                          {essay.title}
                        </h4>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getDifficultyColor(essay.difficulty)}`}>
                          {essay.difficulty}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-slate-600 text-sm leading-relaxed mb-6 font-light">
                    {essay.content.substring(0, 140)}...
                  </p>
                  
                  <div className="flex items-center justify-between text-sm text-slate-500 mb-6">
                    <div className="flex items-center gap-6">
                      <span className="flex items-center gap-2">
                        <BookOpen size={16} />
                        <span className="font-light">{essay.wordCount} words</span>
                      </span>
                      <span className="flex items-center gap-2">
                        <Clock size={16} />
                        <span className="font-light">{essay.timeLimit} minutes</span>
                      </span>
                    </div>
                  </div>
                  
                  <button className="w-full bg-gradient-to-r from-slate-800 to-slate-900 text-white py-3 px-6 rounded-xl hover:from-slate-700 hover:to-slate-800 transition-all duration-300 font-medium tracking-wide shadow-lg hover:shadow-xl">
                    Begin Assessment
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="text-center mt-16">
          <div className="w-16 h-1 bg-gradient-to-r from-amber-400 to-amber-600 mx-auto mb-4"></div>
          <p className="text-slate-500 font-light italic">
            "Excellence is never an accident. It is always the result of high intention, sincere effort, and intelligent execution."
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;