import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';

const FocusPlantTimer = () => {
  const [selectedTime, setSelectedTime] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [growthStage, setGrowthStage] = useState(0);
  const [totalFocusTime, setTotalFocusTime] = useState(0);
  const intervalRef = useRef(null);

  const timeOptions = [
    { label: '3 min', value: 3 * 60 },
    { label: '10 min', value: 10 * 60 },
    { label: '30 min', value: 30 * 60 },
    { label: '1 hour', value: 60 * 60 }
  ];

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          const newTime = prev - 1;
          const elapsed = selectedTime - newTime;

          let newStage = 0;
          if (selectedTime === 600) { // 10 min
            if (elapsed >= 600) newStage = 6;
            else if (elapsed >= 540) newStage = 5;
            else if (elapsed >= 360) newStage = 4;
            else if (elapsed >= 180) newStage = 3;
            else if (elapsed >= 120) newStage = 2;
            else if (elapsed >= 60) newStage = 1;
          } else if (selectedTime === 1800) { // 30 min
            if (elapsed >= 1800) newStage = 6;
            else if (elapsed >= 1500) newStage = 5;
            else if (elapsed >= 1200) newStage = 4;
            else if (elapsed >= 900) newStage = 3;
            else if (elapsed >= 600) newStage = 2;
            else if (elapsed >= 300) newStage = 1;
          } else if (selectedTime === 3600) { // 60 min
            if (elapsed >= 3600) newStage = 6;
            else if (elapsed >= 3000) newStage = 5;
            else if (elapsed >= 2400) newStage = 4;
            else if (elapsed >= 1800) newStage = 3;
            else if (elapsed >= 1200) newStage = 2;
            else if (elapsed >= 600) newStage = 1;
          }
          
          if (newStage !== growthStage) {
            setGrowthStage(newStage);
          }
          
          if (newTime <= 0) {
            setIsRunning(false);
            return 0;
          }
          return newTime;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, timeLeft, selectedTime, growthStage]);

  const handleTimeSelect = (seconds) => {
    setSelectedTime(seconds);
    setTimeLeft(seconds);
    setIsRunning(false);
    setGrowthStage(0);
  };

  const toggleTimer = () => {
    if (timeLeft > 0) {
      setIsRunning(!isRunning);
    }
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(selectedTime || 0);
    setGrowthStage(0);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const PlantStage = ({ stage }) => {
    const stages = [
      // Stage 0: Seed
      <div className="relative h-32 flex items-end justify-center">
        <div className="w-20 h-14 bg-gradient-to-b from-amber-700 to-amber-800 rounded-t-3xl relative">
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-amber-900 rounded-full"></div>
        </div>
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-amber-900 rounded-full"></div>
      </div>,
      
      // Stage 1: Sprout
      <div className="relative h-32 flex items-end justify-center">
        <div className="w-20 h-14 bg-gradient-to-b from-amber-700 to-amber-800 rounded-t-3xl relative">
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-amber-900 rounded-full"></div>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <div className="w-2 h-10 bg-gradient-to-t from-green-600 to-green-400"></div>
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-green-400 rounded-full"></div>
        </div>
      </div>,
      
      // Stage 2: Small plant with first leaves
      <div className="relative h-32 flex items-end justify-center">
        <div className="w-20 h-14 bg-gradient-to-b from-amber-700 to-amber-800 rounded-t-3xl relative">
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-amber-900 rounded-full"></div>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <div className="w-2 h-16 bg-gradient-to-t from-green-600 to-green-500"></div>
          <div className="absolute top-8 -left-3 w-7 h-5 bg-green-500 rounded-full transform -rotate-45"></div>
          <div className="absolute top-8 -right-3 w-7 h-5 bg-green-500 rounded-full transform rotate-45"></div>
        </div>
      </div>,
      
      // Stage 3: Growing plant
      <div className="relative h-32 flex items-end justify-center">
        <div className="w-20 h-14 bg-gradient-to-b from-amber-700 to-amber-800 rounded-t-3xl relative">
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-amber-900 rounded-full"></div>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <div className="w-3 h-24 bg-gradient-to-t from-green-700 to-green-500"></div>
          <div className="absolute top-10 -left-4 w-8 h-6 bg-green-500 rounded-full transform -rotate-45"></div>
          <div className="absolute top-10 -right-4 w-8 h-6 bg-green-500 rounded-full transform rotate-45"></div>
          <div className="absolute top-16 -left-5 w-10 h-7 bg-green-400 rounded-full transform -rotate-30"></div>
          <div className="absolute top-16 -right-5 w-10 h-7 bg-green-400 rounded-full transform rotate-30"></div>
        </div>
      </div>,
      
      // Stage 4: Mature plant
      <div className="relative h-32 flex items-end justify-center">
        <div className="w-20 h-14 bg-gradient-to-b from-amber-700 to-amber-800 rounded-t-3xl relative">
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-amber-900 rounded-full"></div>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <div className="w-3 h-28 bg-gradient-to-t from-green-700 to-green-600"></div>
          <div className="absolute top-8 -left-5 w-10 h-7 bg-green-600 rounded-full transform -rotate-45"></div>
          <div className="absolute top-8 -right-5 w-10 h-7 bg-green-600 rounded-full transform rotate-45"></div>
          <div className="absolute top-14 -left-6 w-11 h-8 bg-green-500 rounded-full transform -rotate-35"></div>
          <div className="absolute top-14 -right-6 w-11 h-8 bg-green-500 rounded-full transform rotate-35"></div>
          <div className="absolute top-20 -left-7 w-12 h-9 bg-green-400 rounded-full transform -rotate-25"></div>
          <div className="absolute top-20 -right-7 w-12 h-9 bg-green-400 rounded-full transform rotate-25"></div>
        </div>
      </div>,
      
      // Stage 5: Pre-bloom with buds
      <div className="relative h-32 flex items-end justify-center">
        <div className="w-20 h-14 bg-gradient-to-b from-amber-700 to-amber-800 rounded-t-3xl relative">
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-amber-900 rounded-full"></div>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <div className="w-3 h-28 bg-gradient-to-t from-green-700 to-green-600"></div>
          <div className="absolute top-8 -left-5 w-10 h-7 bg-green-600 rounded-full transform -rotate-45"></div>
          <div className="absolute top-8 -right-5 w-10 h-7 bg-green-600 rounded-full transform rotate-45"></div>
          <div className="absolute top-14 -left-6 w-11 h-8 bg-green-500 rounded-full transform -rotate-35"></div>
          <div className="absolute top-14 -right-6 w-11 h-8 bg-green-500 rounded-full transform rotate-35"></div>
          <div className="absolute top-20 -left-7 w-12 h-9 bg-green-400 rounded-full transform -rotate-25"></div>
          <div className="absolute top-20 -right-7 w-12 h-9 bg-green-400 rounded-full transform rotate-25"></div>
          <div className="absolute -top-2 left-1/2 -translate-x-1/2">
            <div className="w-4 h-4 bg-pink-300 rounded-full"></div>
            <div className="absolute -left-2 top-1 w-3 h-3 bg-pink-300 rounded-full"></div>
            <div className="absolute -right-2 top-1 w-3 h-3 bg-pink-300 rounded-full"></div>
          </div>
        </div>
      </div>,
      
      // Stage 6: Full bloom
      <div className="relative h-32 flex items-end justify-center">
        <div className="w-20 h-14 bg-gradient-to-b from-amber-700 to-amber-800 rounded-t-3xl relative">
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-amber-900 rounded-full"></div>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <div className="w-3 h-28 bg-gradient-to-t from-green-700 to-green-600"></div>
          <div className="absolute top-8 -left-5 w-10 h-7 bg-green-600 rounded-full transform -rotate-45"></div>
          <div className="absolute top-8 -right-5 w-10 h-7 bg-green-600 rounded-full transform rotate-45"></div>
          <div className="absolute top-14 -left-6 w-11 h-8 bg-green-500 rounded-full transform -rotate-35"></div>
          <div className="absolute top-14 -right-6 w-11 h-8 bg-green-500 rounded-full transform rotate-35"></div>
          <div className="absolute top-20 -left-7 w-12 h-9 bg-green-400 rounded-full transform -rotate-25"></div>
          <div className="absolute top-20 -right-7 w-12 h-9 bg-green-400 rounded-full transform rotate-25"></div>
          <div className="absolute -top-6 left-1/2 -translate-x-1/2">
            <div className="relative w-14 h-14">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-5 h-5 bg-pink-400 rounded-full"></div>
              <div className="absolute top-3 left-0 w-5 h-5 bg-pink-400 rounded-full"></div>
              <div className="absolute top-3 right-0 w-5 h-5 bg-pink-400 rounded-full"></div>
              <div className="absolute top-6 -left-1 w-4 h-4 bg-pink-500 rounded-full"></div>
              <div className="absolute top-6 -right-1 w-4 h-4 bg-pink-500 rounded-full"></div>
              <div className="absolute top-4 left-1/2 -translate-x-1/2 w-7 h-7 bg-yellow-300 rounded-full border-2 border-yellow-400"></div>
            </div>
          </div>
        </div>
      </div>
    ];

    return (
      <div className="transition-all duration-700 ease-out transform">
        {stages[Math.min(stage, 6)]}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-100 via-green-50 to-teal-50 flex items-center justify-center p-8">
      <div className="bg-white/60 backdrop-blur rounded-3xl shadow-2xl p-8 md:p-12 max-w-md w-full border-4 border-green-100">
        <h1 className="text-4xl font-bold text-center text-green-700 mb-2">
          Focus Garden
        </h1>
        <p className="text-center text-green-500 mb-8 text-sm">
          Stay focused and watch your plant grow! 🌱
        </p>

        {!selectedTime ? (
          <div className="space-y-4">
            <p className="text-center text-green-600 font-medium mb-6">
              Choose your focus time:
            </p>
            {timeOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleTimeSelect(option.value)}
                className="w-full py-4 px-6 bg-gradient-to-r from-green-300 to-teal-300 hover:from-green-400 hover:to-teal-400 text-green-800 rounded-2xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                {option.label}
              </button>
            ))}
          </div>
        ) : (
          <div className="space-y-8">
            <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-2xl p-8 min-h-64 flex items-end justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-stone-100 to-transparent"></div>
              <div className="relative z-10">
                <PlantStage stage={growthStage} />
              </div>
            </div>

            <div className="text-center space-y-4">
              <div className="text-6xl font-bold text-green-800 font-mono">
                {formatTime(timeLeft)}
              </div>
              <div className="text-sm text-green-600">
                Growth Stage: {growthStage}/6
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={toggleTimer}
                className="flex-1 py-4 px-6 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
              >
                {isRunning ? <Pause size={20} /> : <Play size={20} />}
                {isRunning ? 'Pause' : 'Start'}
              </button>
              <button
                onClick={resetTimer}
                className="py-4 px-6 bg-amber-500 hover:bg-amber-600 text-white rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                <RotateCcw size={20} />
              </button>
            </div>

            <button
              onClick={() => {
                setSelectedTime(null);
                setTimeLeft(0);
                setIsRunning(false);
              }}
              className="w-full py-3 text-green-600 hover:text-green-800 font-medium transition-colors"
            >
              Choose Different Time
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FocusPlantTimer;