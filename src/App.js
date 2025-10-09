import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';

const FocusPlantTimer = () => {
  const [selectedTime, setSelectedTime] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [growthStage, setGrowthStage] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customMinutes, setCustomMinutes] = useState('');
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
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, timeLeft]);

  useEffect(() => {
    if (timeLeft <= 0 && isRunning) {
      setIsRunning(false);
    }
  }, [timeLeft, isRunning]);

  useEffect(() => {
    if (!selectedTime) return;

    const elapsed = selectedTime - timeLeft;
    const progress = (elapsed / selectedTime) * 100;

    let newStage = 0;

    if (timeLeft === 0) {
      newStage = 6;
      if (!showConfetti) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 5000);
      }
    } else if (progress >= 83.33) {
      newStage = 5;
    } else if (progress >= 66.66) {
      newStage = 4;
    } else if (progress >= 50) {
      newStage = 3;
    } else if (progress >= 33.33) {
      newStage = 2;
    } else if (progress >= 16.66) {
      newStage = 1;
    }

    setGrowthStage(newStage);
  }, [timeLeft, selectedTime, showConfetti]);

  const handleTimeSelect = (seconds) => {
    setSelectedTime(seconds);
    setTimeLeft(seconds);
    setIsRunning(false);
    setGrowthStage(0);
    setElapsedTime(0);
    setShowConfetti(false);
    setShowCustomInput(false);
  };

  const handleCustomTime = () => {
    const minutes = parseInt(customMinutes);
    if (minutes && minutes > 0 && minutes <= 120) {
      const seconds = minutes * 60;
      handleTimeSelect(seconds);
    }
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
    setElapsedTime(0);
    setShowConfetti(false);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const Confetti = () => {
    const leaves = Array.from({ length: 30 }, (_, i) => {
      return {
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 2,
        duration: 3 + Math.random() * 2,
      };
    });

    return (
      <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
        {leaves.map((leaf) => (
          <div
            key={leaf.id}
            className="absolute text-2xl"
            style={{
              left: `${leaf.left}%`,
              top: '-10%',
              animation: `fall ${leaf.duration}s linear ${leaf.delay}s forwards`,
            }}
          >
            🍃
          </div>
        ))}
        <style>{`
          @keyframes fall {
            to {
              transform: translateY(100vh) rotate(360deg);
              opacity: 0;
            }
          }
        `}</style>
      </div>
    );
  };

  const PlantStage = ({ stage }) => {
    const stages = [
      // Stage 0: Seed
      <div className="relative h-32 flex items-end justify-center">
        <div className="w-24 h-16 bg-gradient-to-b from-amber-600 to-amber-800 rounded-t-full relative shadow-lg">
          <div className="absolute top-3 left-1/2 -translate-x-1/2 w-4 h-4 bg-amber-900 rounded-full opacity-40"></div>
        </div>
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-5 h-5 bg-emerald-800 rounded-full shadow-md"></div>
      </div>,

      // Stage 1: Sprout
      <div className="relative h-32 flex items-end justify-center">
        <div className="w-24 h-16 bg-gradient-to-b from-amber-600 to-amber-800 rounded-t-full relative shadow-lg">
          <div className="absolute top-3 left-1/2 -translate-x-1/2 w-4 h-4 bg-amber-900 rounded-full opacity-40"></div>
        </div>
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2">
          <div className="w-2 h-14 bg-gradient-to-t from-emerald-700 via-emerald-600 to-emerald-500 rounded-t-sm shadow"></div>
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-8 bg-gradient-to-t from-emerald-500 to-emerald-300 rounded-full opacity-80"></div>
        </div>
      </div>,

      // Stage 2: Young plant
      <div className="relative h-32 flex items-end justify-center">
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
          <div className="w-2.5 h-20 bg-gradient-to-t from-emerald-800 via-emerald-600 to-emerald-500 rounded-t-sm shadow"></div>
          <div className="absolute top-8 -left-4 w-12 h-4 bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full transform -rotate-45 shadow-sm"></div>
          <div className="absolute top-10 -right-4 w-10 h-3 bg-gradient-to-l from-emerald-600 to-emerald-400 rounded-full transform rotate-35 shadow-sm"></div>
        </div>
        <div className="w-24 h-16 bg-gradient-to-b from-amber-600 to-amber-800 rounded-t-full relative shadow-lg z-10">
          <div className="absolute top-3 left-1/2 -translate-x-1/2 w-4 h-4 bg-amber-900 rounded-full opacity-40"></div>
        </div>
      </div>,

      // Stage 3: Growing
      <div className="relative h-32 flex items-end justify-center">
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
          <div className="w-3 h-28 bg-gradient-to-t from-emerald-800 via-emerald-700 to-emerald-600 rounded-t-sm shadow"></div>
          <div className="absolute top-10 -left-5 w-14 h-5 bg-gradient-to-r from-emerald-700 to-emerald-400 rounded-full transform -rotate-40 shadow"></div>
          <div className="absolute top-12 -right-5 w-13 h-4 bg-gradient-to-l from-emerald-700 to-emerald-400 rounded-full transform rotate-40 shadow"></div>
          <div className="absolute top-16 -left-4 w-11 h-4 bg-gradient-to-r from-emerald-600 to-emerald-300 rounded-full transform -rotate-25 shadow-sm"></div>
          <div className="absolute top-18 -right-4 w-10 h-3 bg-gradient-to-l from-emerald-600 to-emerald-300 rounded-full transform rotate-25 shadow-sm"></div>
        </div>
        <div className="w-24 h-16 bg-gradient-to-b from-amber-600 to-amber-800 rounded-t-full relative shadow-lg z-10">
          <div className="absolute top-3 left-1/2 -translate-x-1/2 w-4 h-4 bg-amber-900 rounded-full opacity-40"></div>
        </div>
      </div>,

      // Stage 4: Bud
      <div className="relative h-32 flex items-end justify-center">
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
          <div className="w-3 h-32 bg-gradient-to-t from-emerald-800 via-emerald-700 to-emerald-600 rounded-t-sm shadow"></div>
          <div className="absolute top-14 -left-5 w-14 h-5 bg-gradient-to-r from-emerald-700 to-emerald-400 rounded-full transform -rotate-40 shadow"></div>
          <div className="absolute top-16 -right-5 w-13 h-4 bg-gradient-to-l from-emerald-700 to-emerald-400 rounded-full transform rotate-40 shadow"></div>
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-5 h-8 bg-gradient-to-t from-purple-600 to-purple-400 rounded-full shadow-md"></div>
        </div>
        <div className="w-24 h-16 bg-gradient-to-b from-amber-600 to-amber-800 rounded-t-full relative shadow-lg z-10">
          <div className="absolute top-3 left-1/2 -translate-x-1/2 w-4 h-4 bg-amber-900 rounded-full opacity-40"></div>
        </div>
      </div>,

      // Stage 5: Opening
      <div className="relative h-32 flex items-end justify-center">
        <div className="w-24 h-16 bg-gradient-to-b from-amber-600 to-amber-800 rounded-t-full relative shadow-lg">
          <div className="absolute top-3 left-1/2 -translate-x-1/2 w-4 h-4 bg-amber-900 rounded-full opacity-40"></div>
        </div>
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2">
          <div className="w-3 h-28 bg-gradient-to-t from-emerald-800 via-emerald-700 to-emerald-600 rounded-t-sm shadow"></div>
          <div className="absolute top-14 -left-5 w-14 h-5 bg-gradient-to-r from-emerald-700 to-emerald-400 rounded-full transform -rotate-40 shadow"></div>
          <div className="absolute top-16 -right-5 w-13 h-4 bg-gradient-to-l from-emerald-700 to-emerald-400 rounded-full transform rotate-40 shadow"></div>
          <div className="absolute -top-8 left-1/2 -translate-x-1/2">
            <div className="relative w-14 h-14">
              <div className="absolute top-1 left-1/2 -translate-x-1/2 w-4 h-10 bg-gradient-to-t from-purple-600 via-purple-400 to-purple-200 rounded-t-full shadow"></div>
              <div className="absolute top-2 left-1 w-4 h-9 bg-gradient-to-t from-purple-600 via-purple-400 to-purple-200 rounded-t-full transform -rotate-35 shadow"></div>
              <div className="absolute top-2 right-1 w-4 h-9 bg-gradient-to-t from-purple-600 via-purple-400 to-purple-200 rounded-t-full transform rotate-35 shadow"></div>
              <div className="absolute top-6 left-1/2 -translate-x-1/2 w-2 h-3 bg-yellow-300 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>,

      // Stage 6: Full bloom
      <div className="relative h-32 flex items-end justify-center">
        <div className="w-24 h-16 bg-gradient-to-b from-amber-600 to-amber-800 rounded-t-full relative shadow-lg">
          <div className="absolute top-3 left-1/2 -translate-x-1/2 w-4 h-4 bg-amber-900 rounded-full opacity-40"></div>
        </div>
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2">
          <div className="w-3 h-28 bg-gradient-to-t from-emerald-800 via-emerald-700 to-emerald-600 rounded-t-sm shadow-md"></div>
          <div className="absolute top-14 -left-5 w-14 h-5 bg-gradient-to-r from-emerald-700 to-emerald-400 rounded-full transform -rotate-40 shadow"></div>
          <div className="absolute top-16 -right-5 w-13 h-4 bg-gradient-to-l from-emerald-700 to-emerald-400 rounded-full transform rotate-40 shadow"></div>
          <div className="absolute -top-10 left-1/2 -translate-x-1/2">
            <div className="relative w-18 h-18">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-5 h-12 bg-gradient-to-t from-purple-700 via-purple-500 to-purple-200 rounded-t-full shadow-lg"></div>
              <div className="absolute top-1 -left-1 w-5 h-11 bg-gradient-to-t from-purple-700 via-purple-500 to-purple-200 rounded-t-full transform -rotate-50 shadow-lg"></div>
              <div className="absolute top-1 -right-1 w-5 h-11 bg-gradient-to-t from-purple-700 via-purple-500 to-purple-200 rounded-t-full transform rotate-50 shadow-lg"></div>
              <div className="absolute top-3 -left-2 w-4 h-9 bg-gradient-to-t from-purple-600 via-purple-400 to-pink-200 rounded-t-full transform -rotate-70 shadow-md"></div>
              <div className="absolute top-3 -right-2 w-4 h-9 bg-gradient-to-t from-purple-600 via-purple-400 to-pink-200 rounded-t-full transform rotate-70 shadow-md"></div>
              <div className="absolute top-2 left-1 w-4 h-8 bg-gradient-to-t from-purple-500 via-purple-300 to-pink-100 rounded-t-full transform -rotate-30 shadow"></div>
              <div className="absolute top-2 right-1 w-4 h-8 bg-gradient-to-t from-purple-500 via-purple-300 to-pink-100 rounded-t-full transform rotate-30 shadow"></div>
              <div className="absolute top-6 left-1/2 -translate-x-1/2 flex gap-0.5">
                <div className="w-1 h-5 bg-yellow-400 rounded-full shadow"></div>
                <div className="w-1 h-5 bg-yellow-400 rounded-full shadow"></div>
                <div className="w-1 h-5 bg-yellow-400 rounded-full shadow"></div>
              </div>
              <div className="absolute top-10 left-1/2 -translate-x-1/2 flex gap-1">
                <div className="w-1.5 h-1.5 bg-orange-500 rounded-full shadow"></div>
                <div className="w-1.5 h-1.5 bg-orange-500 rounded-full shadow"></div>
                <div className="w-1.5 h-1.5 bg-orange-500 rounded-full shadow"></div>
              </div>
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
      {showConfetti && <Confetti />}
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

            {!showCustomInput ? (
              <button
                onClick={() => setShowCustomInput(true)}
                className="w-full py-4 px-6 bg-gradient-to-r from-purple-300 to-pink-300 hover:from-purple-400 hover:to-pink-400 text-purple-800 rounded-2xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Custom Time ✏️
              </button>
            ) : (
              <div className="space-y-3">
                <div className="flex gap-2">
                  <input
                    type="number"
                    min="1"
                    max="120"
                    value={customMinutes}
                    onChange={(e) => setCustomMinutes(e.target.value)}
                    placeholder="Enter minutes (1-120)"
                    className="flex-1 py-4 px-6 rounded-2xl border-2 border-purple-300 focus:border-purple-500 outline-none text-green-800 font-semibold"
                  />
                  <button
                    onClick={handleCustomTime}
                    className="py-4 px-6 bg-gradient-to-r from-purple-400 to-pink-400 hover:from-purple-500 hover:to-pink-500 text-white rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
                  >
                    Start
                  </button>
                </div>
                <button
                  onClick={() => {
                    setShowCustomInput(false);
                    setCustomMinutes('');
                  }}
                  className="w-full py-2 text-purple-600 hover:text-purple-800 font-medium transition-colors"
                >
                  Cancel
                </button>
              </div>
            )}
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