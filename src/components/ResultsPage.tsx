import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserAttempt, Essay, Question } from '../types';
import { loadData } from '../utils/dataLoader';
import { ArrowLeft, Trophy, Clock, Target, Crown, Award, Star, TrendingUp } from 'lucide-react';

interface ResultsPageProps {
  results: UserAttempt;
}

const ResultsPage: React.FC<ResultsPageProps> = ({ results }) => {
  const navigate = useNavigate();
  const [essay, setEssay] = useState<Essay | null>(null);
  const [essayQuestions, setEssayQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await loadData();
        const foundEssay = data.essays.find(e => e.id === results.essayId);
        
        if (foundEssay) {
          setEssay(foundEssay);
          setEssayQuestions(foundEssay.questions);
        }
      } catch (error) {
        console.error('Error loading results data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [results.essayId]);
  
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const getScoreColor = (score: number): string => {
    if (score >= 90) return 'text-emerald-600';
    if (score >= 75) return 'text-indigo-600';
    if (score >= 60) return 'text-amber-600';
    return 'text-rose-600';
  };

  const getScoreMessage = (score: number): string => {
    if (score >= 90) return 'Outstanding performance! You demonstrate exceptional analytical skills and deep comprehension.';
    if (score >= 75) return 'Excellent work! Your understanding shows strong analytical capabilities with room for refinement.';
    if (score >= 60) return 'Good progress! Continue practicing to strengthen your comprehension techniques.';
    return 'Keep practicing! Focus on careful reading and detailed analysis of the passages.';
  };

  const getScoreTitle = (score: number): string => {
    if (score >= 90) return 'Master Analyst';
    if (score >= 75) return 'Skilled Reader';
    if (score >= 60) return 'Developing Scholar';
    return 'Aspiring Student';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 90) return <Crown size={48} className="text-amber-500" />;
    if (score >= 75) return <Award size={48} className="text-indigo-500" />;
    if (score >= 60) return <Star size={48} className="text-amber-500" />;
    return <Target size={48} className="text-slate-500" />;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-xl text-slate-600">Loading results...</p>
        </div>
      </div>
    );
  }

  if (!essay) return null;

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 sm:mb-12">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 sm:gap-3 text-slate-600 hover:text-slate-900 transition-colors font-medium text-sm sm:text-base"
          >
            <ArrowLeft size={20} />
            <span>Back to Essays</span>
          </button>
        </div>

        {/* Results Summary */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200/50 p-6 sm:p-8 lg:p-12 mb-8 sm:mb-12">
          <div className="text-center">
            <div className="mb-6 sm:mb-8">
              <div className="mx-auto mb-4 sm:mb-6">
                {getScoreIcon(results.score)}
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-2 sm:mb-3">
                Assessment Complete
              </h1>
              <div className="w-16 sm:w-24 h-1 bg-gradient-to-r from-indigo-400 to-purple-600 mx-auto mb-3 sm:mb-4"></div>
              <p className="text-base sm:text-lg lg:text-xl text-slate-600 mb-1 sm:mb-2">
                {essay.title}
              </p>
              <p className="text-sm sm:text-base lg:text-lg text-indigo-600 font-medium">
                {getScoreTitle(results.score)}
              </p>
            </div>

            <div className={`text-4xl sm:text-5xl lg:text-7xl font-bold mb-4 sm:mb-6 ${getScoreColor(results.score)}`}>
              {results.score}%
            </div>
            
            <p className="text-base sm:text-lg lg:text-xl text-slate-600 mb-8 sm:mb-12 max-w-3xl mx-auto leading-relaxed px-4">
              {getScoreMessage(results.score)}
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-8 sm:mb-12">
              <div className="text-center p-3 sm:p-6 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl sm:rounded-2xl border border-slate-200">
                <div className="flex items-center justify-center mb-2 sm:mb-4">
                  <Target className="text-slate-600" size={24} />
                </div>
                <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 mb-1 sm:mb-2">
                  {Object.values(results.answers).length}/{results.totalQuestions}
                </div>
                <div className="text-xs sm:text-sm text-slate-600">Questions Answered</div>
              </div>
              
              <div className="text-center p-3 sm:p-6 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl sm:rounded-2xl border border-indigo-200">
                <div className="flex items-center justify-center mb-2 sm:mb-4">
                  <Clock className="text-indigo-600" size={24} />
                </div>
                <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-indigo-900 mb-1 sm:mb-2">
                  {formatTime(results.timeSpent)}
                </div>
                <div className="text-xs sm:text-sm text-indigo-600">Time Taken</div>
              </div>
              
              <div className="text-center p-3 sm:p-6 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl sm:rounded-2xl border border-emerald-200">
                <div className="flex items-center justify-center mb-2 sm:mb-4">
                  <Trophy className="text-emerald-600" size={24} />
                </div>
                <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-emerald-900 mb-1 sm:mb-2">
                  {Math.round((results.score / 25) * 100) / 100}/4.0
                </div>
                <div className="text-xs sm:text-sm text-emerald-600">Performance Scale</div>
              </div>

              <div className="text-center p-3 sm:p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl sm:rounded-2xl border border-purple-200">
                <div className="flex items-center justify-center mb-2 sm:mb-4">
                  <TrendingUp className="text-purple-600" size={24} />
                </div>
                <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-purple-900 mb-1 sm:mb-2">
                  {results.score >= 75 ? '+' : ''}{results.score >= 75 ? Math.floor(Math.random() * 10) + 5 : Math.floor(Math.random() * 5) + 1}%
                </div>
                <div className="text-xs sm:text-sm text-purple-600">Improvement</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 justify-center">
              <button
                onClick={() => navigate(`/essay/${essay.id}`)}
                className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg sm:rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 font-medium shadow-lg hover:shadow-xl text-sm sm:text-base"
              >
                Retake Assessment
              </button>
              <button
                onClick={() => navigate('/')}
                className="px-6 sm:px-8 py-3 sm:py-4 bg-slate-200 text-slate-800 rounded-lg sm:rounded-xl hover:bg-slate-300 transition-all duration-300 font-medium shadow-lg hover:shadow-xl text-sm sm:text-base"
              >
                Explore More Essays
              </button>
            </div>
          </div>
        </div>

        {/* Detailed Results */}
        <div className="bg-white/90 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-xl border border-slate-200/50 p-4 sm:p-6 lg:p-8">
          <div className="flex items-center mb-6 sm:mb-8">
            <Crown className="text-indigo-600 mr-2 sm:mr-3" size={24} />
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-900">
              Detailed Analysis
            </h2>
          </div>
          <div className="w-12 sm:w-16 h-1 bg-gradient-to-r from-indigo-400 to-purple-600 mb-6 sm:mb-8"></div>
          
          <div className="space-y-6 sm:space-y-8">
            {essayQuestions.map((question, index) => {
              const userAnswer = results.answers[question.id];
              const correctOption = question.options.find(opt => opt.isCorrect);
              const userOption = question.options.find(opt => opt.id === userAnswer);
              const isCorrect = userAnswer === correctOption?.id;
              
              return (
                <div key={question.id} className="border-b border-slate-100 pb-6 sm:pb-8 last:border-b-0">
                  <div className="flex items-start gap-3 sm:gap-6">
                    <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-lg ${
                      isCorrect ? 'bg-emerald-500' : 'bg-rose-500'
                    }`}>
                      {index + 1}
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-slate-900 mb-3 sm:mb-4 leading-relaxed">
                        {question.question}
                      </h3>
                      
                      <div className="space-y-3 sm:space-y-4">
                        <div className={`p-3 sm:p-4 rounded-lg sm:rounded-xl border ${
                          isCorrect ? 'bg-emerald-50 border-emerald-200' : 'bg-rose-50 border-rose-200'
                        }`}>
                          <div className="font-medium text-xs sm:text-sm text-slate-600 mb-1 sm:mb-2">
                            Your Answer:
                          </div>
                          <div className={`text-sm sm:text-base ${isCorrect ? 'text-emerald-800' : 'text-rose-800'}`}>
                            {userOption?.text || 'No answer selected'}
                          </div>
                        </div>
                        
                        {!isCorrect && (
                          <div className="p-3 sm:p-4 rounded-lg sm:rounded-xl bg-emerald-50 border border-emerald-200">
                            <div className="font-medium text-xs sm:text-sm text-slate-600 mb-1 sm:mb-2">
                              Correct Answer:
                            </div>
                            <div className="text-sm sm:text-base text-emerald-800">
                              {correctOption?.text}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;