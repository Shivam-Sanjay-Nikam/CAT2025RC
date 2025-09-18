import React, { useState, useEffect } from 'react';
import { UserAttempt, Essay, Question } from '../types';
import { loadData } from '../utils/dataLoader';
import { ArrowLeft, Trophy, Clock, Target, Crown, Award, Star } from 'lucide-react';

interface ResultsPageProps {
  results: UserAttempt;
  onBack: () => void;
  onRetakeTest: () => void;
}

const ResultsPage: React.FC<ResultsPageProps> = ({ results, onBack, onRetakeTest }) => {
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
    if (score >= 75) return 'text-amber-600';
    if (score >= 60) return 'text-orange-600';
    return 'text-rose-600';
  };

  const getScoreMessage = (score: number): string => {
    if (score >= 90) return 'Exemplary performance! Your analytical prowess demonstrates mastery of comprehension.';
    if (score >= 75) return 'Commendable achievement! Your understanding reflects strong analytical capabilities.';
    if (score >= 60) return 'Satisfactory progress! Continue refining your comprehension techniques.';
    return 'Foundation established! Focus on deeper analysis and careful attention to textual details.';
  };

  const getScoreTitle = (score: number): string => {
    if (score >= 90) return 'Distinguished Scholar';
    if (score >= 75) return 'Accomplished Reader';
    if (score >= 60) return 'Developing Analyst';
    return 'Aspiring Scholar';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 90) return <Crown size={48} className="text-amber-500" />;
    if (score >= 75) return <Award size={48} className="text-amber-500" />;
    if (score >= 60) return <Star size={48} className="text-amber-500" />;
    return <Target size={48} className="text-slate-500" />;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-xl text-slate-600 font-light">Loading results...</p>
        </div>
      </div>
    );
  }

  if (!essay) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div className="max-w-5xl mx-auto px-8 py-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-12">
        <button
          onClick={onBack}
          className="flex items-center gap-3 text-slate-600 hover:text-slate-900 transition-colors font-medium"
        >
          <ArrowLeft size={24} />
          <span className="font-serif">Return to Collection</span>
        </button>
      </div>

      {/* Results Summary */}
      <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-slate-200/50 p-12 mb-12">
        <div className="text-center">
          <div className="mb-8">
            <div className="mx-auto mb-6">
              {getScoreIcon(results.score)}
            </div>
            <h1 className="text-4xl font-serif text-slate-900 mb-3 tracking-wide">
              Assessment Complete
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-amber-400 to-amber-600 mx-auto mb-4"></div>
            <p className="text-xl text-slate-600 font-light mb-2">
              {essay.title}
            </p>
            <p className="text-lg text-amber-600 font-medium">
              {getScoreTitle(results.score)}
            </p>
          </div>

          <div className={`text-7xl font-serif mb-6 ${getScoreColor(results.score)}`}>
            {results.score}%
          </div>
          
          <p className="text-xl text-slate-600 mb-12 max-w-3xl mx-auto font-light leading-relaxed">
            {getScoreMessage(results.score)}
          </p>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="text-center p-6 bg-slate-50/50 rounded-2xl border border-slate-200/50">
              <div className="flex items-center justify-center mb-4">
                <Target className="text-slate-600" size={32} />
              </div>
              <div className="text-3xl font-serif text-slate-900 mb-2">
                {Object.values(results.answers).length}/{results.totalQuestions}
              </div>
              <div className="text-sm text-slate-600 font-light">Questions Answered</div>
            </div>
            
            <div className="text-center p-6 bg-slate-50/50 rounded-2xl border border-slate-200/50">
              <div className="flex items-center justify-center mb-4">
                <Clock className="text-slate-600" size={32} />
              </div>
              <div className="text-3xl font-serif text-slate-900 mb-2">
                {formatTime(results.timeSpent)}
              </div>
              <div className="text-sm text-slate-600 font-light">Time Invested</div>
            </div>
            
            <div className="text-center p-6 bg-slate-50/50 rounded-2xl border border-slate-200/50">
              <div className="flex items-center justify-center mb-4">
                <Trophy className="text-slate-600" size={32} />
              </div>
              <div className="text-3xl font-serif text-slate-900 mb-2">
                {Math.round((results.score / 25) * 100) / 100}/4.0
              </div>
              <div className="text-sm text-slate-600 font-light">Excellence Scale</div>
            </div>
          </div>

          <div className="flex gap-6 justify-center">
            <button
              onClick={onRetakeTest}
              className="px-8 py-4 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-xl hover:from-amber-500 hover:to-amber-600 transition-all duration-300 font-medium shadow-lg hover:shadow-xl"
            >
              Retake Assessment
            </button>
            <button
              onClick={onBack}
              className="px-8 py-4 bg-slate-200 text-slate-800 rounded-xl hover:bg-slate-300 transition-all duration-300 font-medium shadow-lg hover:shadow-xl"
            >
              Explore More Passages
            </button>
          </div>
        </div>
      </div>

      {/* Detailed Results */}
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200/50 p-8">
        <div className="flex items-center mb-8">
          <Crown className="text-amber-600 mr-3" size={28} />
          <h2 className="text-2xl font-serif text-slate-900">
            Detailed Analysis
        </h2>
        </div>
        <div className="w-16 h-1 bg-gradient-to-r from-amber-400 to-amber-600 mb-8"></div>
        
        <div className="space-y-8">
          {essayQuestions.map((question, index) => {
            const userAnswer = results.answers[question.id];
            const correctOption = question.options.find(opt => opt.isCorrect);
            const userOption = question.options.find(opt => opt.id === userAnswer);
            const isCorrect = userAnswer === correctOption?.id;
            
            return (
              <div key={question.id} className="border-b border-slate-100 pb-8 last:border-b-0">
                <div className="flex items-start gap-6">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-serif text-lg ${
                    isCorrect ? 'bg-emerald-500' : 'bg-rose-500'
                  }`}>
                    {index + 1}
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-xl font-serif text-slate-900 mb-4 leading-relaxed">
                      {question.question}
                    </h3>
                    
                    <div className="space-y-4">
                      <div className={`p-4 rounded-xl border ${
                        isCorrect ? 'bg-emerald-50 border-emerald-200' : 'bg-rose-50 border-rose-200'
                      }`}>
                        <div className="font-medium text-sm text-slate-600 mb-2">
                          Your Answer:
                        </div>
                        <div className={`font-light ${isCorrect ? 'text-emerald-800' : 'text-rose-800'}`}>
                          {userOption?.text || 'No answer selected'}
                        </div>
                      </div>
                      
                      {!isCorrect && (
                        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                          <div className="font-medium text-sm text-slate-600 mb-2">
                            Correct Answer:
                          </div>
                          <div className="text-emerald-800 font-light">
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