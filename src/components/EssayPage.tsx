import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Essay, Question, UserAttempt } from '../types';
import { loadData } from '../utils/dataLoader';
import Timer from './Timer';
import { ArrowLeft, CheckCircle2, XCircle, RotateCcw, BookOpen, Clock } from 'lucide-react';

interface EssayPageProps {
  onShowResults: (results: UserAttempt) => void;
}

const EssayPage: React.FC<EssayPageProps> = ({ onShowResults }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [essay, setEssay] = useState<Essay | null>(null);
  const [essayQuestions, setEssayQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<{ [questionId: string]: string }>({});
  const [showResults, setShowResults] = useState(false);
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [isTimerActive, setIsTimerActive] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      
      try {
        const data = await loadData();
        const foundEssay = data.essays.find(e => e.id === id);
        
        if (foundEssay) {
          setEssay(foundEssay);
          setEssayQuestions(foundEssay.questions);
          setStartTime(Date.now());
        }
      } catch (error) {
        console.error('Error loading essay data:', error);
      }
    };

    fetchData();
  }, [id]);

  const handleAnswerSelect = (questionId: string, optionId: string) => {
    if (!showResults) {
      setAnswers(prev => ({
        ...prev,
        [questionId]: optionId
      }));
    }
  };

  const handleSubmit = () => {
    if (!essay) return;
    
    const timeSpent = Math.round((Date.now() - startTime) / 1000);
    let correctAnswers = 0;
    
    essayQuestions.forEach(question => {
      const userAnswer = answers[question.id];
      const correctOption = question.options.find(opt => opt.isCorrect);
      if (userAnswer && correctOption && userAnswer === correctOption.id) {
        correctAnswers++;
      }
    });
    
    const score = Math.round((correctAnswers / essayQuestions.length) * 100);
    
    const attempt: UserAttempt = {
      essayId: essay.id,
      answers,
      score,
      totalQuestions: essayQuestions.length,
      timeSpent,
      completedAt: new Date().toISOString()
    };
    
    setShowResults(true);
    setIsTimerActive(false);
    onShowResults(attempt);
    navigate('/results');
  };

  const handleTimeUp = () => {
    handleSubmit();
  };

  const resetTest = () => {
    setAnswers({});
    setShowResults(false);
    setStartTime(Date.now());
    setIsTimerActive(true);
  };

  const getOptionStatus = (questionId: string, optionId: string) => {
    if (!showResults) return 'default';
    
    const question = essayQuestions.find(q => q.id === questionId);
    if (!question) return 'default';
    
    const option = question.options.find(opt => opt.id === optionId);
    const userAnswer = answers[questionId];
    
    if (option?.isCorrect) return 'correct';
    if (userAnswer === optionId && !option?.isCorrect) return 'incorrect';
    return 'default';
  };

  if (!essay) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <div className="text-xl text-slate-600">Preparing your assessment...</div>
        </div>
      </div>
    );
  }

  const allAnswered = essayQuestions.every(q => answers[q.id]);

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-3 text-slate-600 hover:text-slate-900 transition-colors font-medium"
          >
            <ArrowLeft size={24} />
            <span>Back to Essays</span>
          </button>
          
          <Timer
            initialMinutes={essay.timeLimit}
            onTimeUp={handleTimeUp}
            isActive={isTimerActive}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Essay Content */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200/50 p-8">
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <BookOpen className="text-indigo-600 mr-3" size={28} />
                <h1 className="text-3xl font-bold text-slate-900">
                  {essay.title}
                </h1>
              </div>
              <div className="w-16 h-1 bg-gradient-to-r from-indigo-400 to-purple-600 mb-4"></div>
              <div className="text-sm text-slate-500 flex gap-6">
                <span className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
                  {essay.difficulty} Level
                </span>
                <span className="flex items-center gap-2">
                  <Clock size={16} />
                  {essay.timeLimit} minutes
                </span>
              </div>
            </div>
            
            <div className="prose prose-lg max-w-none">
              <div className="text-slate-800 leading-relaxed whitespace-pre-line text-lg">
                {essay.content}
              </div>
            </div>
          </div>

          {/* Questions */}
          <div className="space-y-6">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200/50 p-8">
              <div className="flex items-center mb-8">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold mr-3">
                  Q
                </div>
                <h2 className="text-2xl font-bold text-slate-900">
                  Assessment Questions
                </h2>
                <span className="ml-auto text-slate-500">({essayQuestions.length})</span>
              </div>
              <div className="w-12 h-1 bg-gradient-to-r from-indigo-400 to-purple-600 mb-8"></div>
              
              <div className="space-y-8">
                {essayQuestions.map((question, index) => (
                  <div key={question.id} className="border-b border-slate-100 pb-8 last:border-b-0">
                    <div className="flex items-start mb-6">
                      <div className="w-8 h-8 bg-gradient-to-br from-slate-700 to-slate-900 rounded-full flex items-center justify-center text-white font-bold text-sm mr-4 mt-1">
                        {index + 1}
                      </div>
                      <h3 className="text-lg font-semibold text-slate-900 leading-relaxed flex-1">
                        {question.question}
                      </h3>
                    </div>
                    
                    <div className="space-y-3 ml-12">
                      {question.options.map((option) => {
                        const status = getOptionStatus(question.id, option.id);
                        const isSelected = answers[question.id] === option.id;
                        
                        return (
                          <label
                            key={option.id}
                            className={`flex items-center p-4 rounded-xl border cursor-pointer transition-all duration-300 ${
                              status === 'correct'
                                ? 'bg-emerald-50 border-emerald-200 text-emerald-800 shadow-sm'
                                : status === 'incorrect'
                                ? 'bg-rose-50 border-rose-200 text-rose-800 shadow-sm'
                                : isSelected
                                ? 'bg-indigo-50 border-indigo-300 text-indigo-800 shadow-sm'
                                : 'bg-white border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                            }`}
                          >
                            <input
                              type="radio"
                              name={question.id}
                              value={option.id}
                              checked={isSelected}
                              onChange={() => handleAnswerSelect(question.id, option.id)}
                              disabled={showResults}
                              className="sr-only"
                            />
                            <div className="flex items-center gap-3 w-full">
                              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                                status === 'correct'
                                  ? 'border-emerald-500 bg-emerald-500'
                                  : status === 'incorrect'
                                  ? 'border-rose-500 bg-rose-500'
                                  : isSelected
                                  ? 'border-indigo-500 bg-indigo-500'
                                  : 'border-slate-300'
                              }`}>
                                {(isSelected || status === 'correct') && (
                                  <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
                                )}
                              </div>
                              <span className="text-slate-800">{option.text}</span>
                              {showResults && status === 'correct' && (
                                <CheckCircle2 size={20} className="text-emerald-600 ml-auto" />
                              )}
                              {showResults && status === 'incorrect' && (
                                <XCircle size={20} className="text-rose-600 ml-auto" />
                              )}
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4">
              {!showResults ? (
                <button
                  onClick={handleSubmit}
                  disabled={!allAnswered}
                  className={`flex-1 py-4 px-8 rounded-xl font-medium transition-all duration-300 shadow-lg ${
                    allAnswered
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 hover:shadow-xl'
                      : 'bg-slate-300 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  Submit Assessment ({Object.keys(answers).length}/{essayQuestions.length})
                </button>
              ) : (
                <button
                  onClick={resetTest}
                  className="flex-1 py-4 px-8 rounded-xl font-medium bg-gradient-to-r from-amber-600 to-orange-600 text-white hover:from-amber-500 hover:to-orange-500 transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl"
                >
                  <RotateCcw size={18} />
                  Retake Assessment
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EssayPage;