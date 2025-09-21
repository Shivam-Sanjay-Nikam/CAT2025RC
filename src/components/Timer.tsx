import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Clock, AlertTriangle } from 'lucide-react';

interface TimerProps {
  initialMinutes: number;
  onTimeUp: () => void;
  isActive: boolean;
}

const Timer: React.FC<TimerProps> = ({ initialMinutes, onTimeUp, isActive }) => {
  const [timeLeft, setTimeLeft] = useState(initialMinutes * 60);

  const handleTimeUp = useCallback(() => {
    onTimeUp();
  }, [onTimeUp]);

  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, handleTimeUp]);

  const formatTime = useCallback((seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  const { timerClass, icon } = useMemo(() => {
    const isWarning = timeLeft <= 300; // 5 minutes
    const isCritical = timeLeft <= 60; // 1 minute
    
    const timerClass = isCritical 
      ? 'bg-rose-50 text-rose-800 border-rose-200 animate-pulse'
      : isWarning 
      ? 'bg-amber-50 text-amber-800 border-amber-200'
      : 'bg-slate-50 text-slate-800 border-slate-200';
    
    const icon = isCritical ? <AlertTriangle size={24} /> : <Clock size={24} />;
    
    return { timerClass, icon };
  }, [timeLeft]);

  return (
    <div className={`flex items-center gap-3 px-6 py-3 rounded-xl font-mono text-xl shadow-lg border ${timerClass}`}>
      {icon}
      <span className="font-serif tracking-wider">{formatTime(timeLeft)}</span>
    </div>
  );
};

export default Timer;