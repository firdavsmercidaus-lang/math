import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calculator, 
  ChevronRight, 
  RotateCcw, 
  CheckCircle2, 
  XCircle, 
  Trophy,
  Plus,
  Minus,
  X,
  Divide,
  Layers,
  BookOpen,
  Loader2,
  Sparkles,
  ArrowLeft,
  GraduationCap,
  Target,
  BarChart3
} from 'lucide-react';
import { Grade, Operation, Question, QuizState } from './types';
import { generateQuestions } from './lib/gemini';

export default function App() {
  const [state, setState] = useState<QuizState>({
    grade: null,
    operation: null,
    questions: [],
    currentQuestionIndex: 0,
    score: 0,
    isFinished: false,
  });

  const [loading, setLoading] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const grades: Grade[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

  const operations: { id: Operation; label: string; icon: any; color: string; desc: string }[] = [
    { id: 'addition', label: "Qo'shish", icon: Plus, color: 'bg-blue-500', desc: "Sonlarni qo'shish amallari" },
    { id: 'subtraction', label: "Ayirish", icon: Minus, color: 'bg-rose-500', desc: "Ayirish va qoldiq topish" },
    { id: 'multiplication', label: "Ko'paytirish", icon: X, color: 'bg-emerald-500', desc: "Ko'paytirish jadvali va amallar" },
    { id: 'division', label: "Bo'lish", icon: Divide, color: 'bg-amber-500', desc: "Bo'lish va ulushlar" },
    { id: 'mixed', label: "Aralash", icon: Layers, color: 'bg-violet-500', desc: "Barcha amallar birgalikda" },
    { id: 'word_problems', label: "Masalalar", icon: BookOpen, color: 'bg-orange-500', desc: "Matnli matematik masalalar" },
  ];

  const startQuiz = async (grade: Grade, operation: Operation) => {
    setLoading(true);
    const questions = await generateQuestions(grade, operation);
    setState({
      grade,
      operation,
      questions,
      currentQuestionIndex: 0,
      score: 0,
      isFinished: false,
    });
    setLoading(false);
  };

  const handleAnswer = (answer: string) => {
    if (selectedAnswer) return;

    const currentQuestion = state.questions[state.currentQuestionIndex];
    const correct = answer === currentQuestion.correctAnswer;
    
    setSelectedAnswer(answer);
    setIsCorrect(correct);
    
    if (correct) {
      setState(prev => ({ ...prev, score: prev.score + 1 }));
    }
  };

  const nextQuestion = () => {
    setSelectedAnswer(null);
    setIsCorrect(null);
    
    if (state.currentQuestionIndex + 1 < state.questions.length) {
      setState(prev => ({ ...prev, currentQuestionIndex: prev.currentQuestionIndex + 1 }));
    } else {
      setState(prev => ({ ...prev, isFinished: true }));
    }
  };

  const reset = () => {
    setState({
      grade: null,
      operation: null,
      questions: [],
      currentQuestionIndex: 0,
      score: 0,
      isFinished: false,
    });
    setSelectedAnswer(null);
    setIsCorrect(null);
  };

  return (
    <div className="min-h-screen bg-[#fafafa] grid-bg selection:bg-blue-100 font-sans text-slate-900">
      <div className="fixed inset-0 mesh-gradient opacity-40 pointer-events-none" />
      
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-slate-200/50 px-6 py-4">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <motion.div 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-3 cursor-pointer group" 
            onClick={reset}
          >
            <div className="bg-blue-600 p-2.5 rounded-xl shadow-lg shadow-blue-200 group-hover:shadow-blue-300 transition-all">
              <Calculator className="text-white w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-black tracking-tight text-slate-900">MathTest<span className="text-blue-600">Zakariyo</span></h1>
            </div>
          </motion.div>

          {state.grade && (
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-full shadow-sm">
                <GraduationCap className="w-4 h-4 text-blue-500" />
                <span className="text-xs font-bold text-slate-600">{state.grade}-sinf</span>
              </div>
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-full shadow-sm">
                <Target className="w-4 h-4 text-rose-500" />
                <span className="text-xs font-bold text-slate-600">
                  {operations.find(o => o.id === state.operation)?.label}
                </span>
              </div>
            </div>
          )}
        </div>
      </header>

      <main className="relative max-w-5xl mx-auto px-6 py-12">
        <AnimatePresence mode="wait">
          {/* Step 1: Grade Selection */}
          {!state.grade && !loading && (
            <motion.div
              key="grade-selection"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-12"
            >
              <div className="text-center space-y-4 max-w-2xl mx-auto">
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-xs font-black uppercase tracking-widest mb-4"
                >
                  Xush kelibsiz
                </motion.div>
                <h2 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                  Matematika olamiga <br /> <span className="text-blue-600">marhamat!</span>
                </h2>
                <p className="text-slate-500 text-lg font-medium">Sinfingizni tanlang va bilimlaringizni sinab ko'ring</p>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4 sm:gap-6">
                {grades.map((grade, idx) => (
                  <motion.button
                    key={grade}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.05 }}
                    whileHover={{ y: -5, scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setState(prev => ({ ...prev, grade }))}
                    className="aspect-square flex flex-col items-center justify-center bg-white border border-slate-200 rounded-3xl shadow-sm hover:shadow-xl hover:border-blue-500 transition-all group relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <ChevronRight className="w-4 h-4 text-blue-500" />
                    </div>
                    <span className="text-4xl font-black text-slate-300 group-hover:text-blue-600 transition-colors">{grade}</span>
                    <span className="text-[10px] font-black text-slate-400 group-hover:text-blue-400 uppercase tracking-widest mt-1">Sinf</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 2: Operation Selection */}
          {state.grade && !state.operation && !loading && (
            <motion.div
              key="operation-selection"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-10"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div className="space-y-2">
                  <button 
                    onClick={() => setState(prev => ({ ...prev, grade: null }))}
                    className="flex items-center gap-2 text-slate-400 hover:text-blue-600 font-bold text-xs uppercase tracking-widest transition-colors mb-2"
                  >
                    <ArrowLeft className="w-4 h-4" /> Orqaga qaytish
                  </button>
                  <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                    Mavzuni tanlang
                  </h2>
                  <p className="text-slate-500 font-medium">{state.grade}-sinf o'quvchilari uchun maxsus testlar</p>
                </div>
                <div className="flex items-center gap-4 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm">
                  <div className="bg-blue-50 p-3 rounded-xl">
                    <GraduationCap className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="pr-4">
                    <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Sizning sinfingiz</span>
                    <span className="block text-lg font-black text-slate-900">{state.grade}-sinf</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {operations.map((op, idx) => (
                  <motion.button
                    key={op.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    whileHover={{ y: -8, shadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)" }}
                    onClick={() => startQuiz(state.grade!, op.id)}
                    className="group relative flex flex-col p-8 bg-white border border-slate-200 rounded-[2rem] text-left transition-all overflow-hidden"
                  >
                    <div className={`absolute top-0 right-0 w-32 h-32 ${op.color} opacity-[0.03] rounded-bl-full -mr-8 -mt-8 group-hover:opacity-[0.08] transition-opacity`} />
                    
                    <div className={`${op.color} w-14 h-14 flex items-center justify-center rounded-2xl text-white shadow-lg shadow-${op.color.split('-')[1]}-200 mb-6 group-hover:scale-110 transition-transform`}>
                      <op.icon className="w-7 h-7" />
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="text-xl font-black text-slate-900">{op.label}</h3>
                      <p className="text-sm text-slate-500 font-medium leading-relaxed">{op.desc}</p>
                    </div>

                    <div className="mt-8 flex items-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                      Boshlash <ChevronRight className="w-4 h-4" />
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Loading State */}
          {loading && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-32 space-y-6"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-blue-400 blur-3xl opacity-20 rounded-full animate-pulse" />
                <Loader2 className="w-16 h-16 text-blue-600 animate-spin relative" />
              </div>
              <div className="text-center space-y-2">
                <p className="text-xl font-black text-slate-900 tracking-tight">Savollar tayyorlanmoqda</p>
              </div>
            </motion.div>
          )}

          {/* Step 3: Quiz Interface */}
          {state.questions.length > 0 && !state.isFinished && (
            <motion.div
              key="quiz"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-3xl mx-auto space-y-8"
            >
              {/* Progress Header */}
              <div className="flex items-center justify-between gap-6">
                <div className="flex-1 space-y-2">
                  <div className="flex justify-between items-end mb-1">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Progress</span>
                    <span className="text-sm font-black text-blue-600">
                      {state.currentQuestionIndex + 1} / {state.questions.length}
                    </span>
                  </div>
                  <div className="h-3 bg-white border border-slate-200 rounded-full overflow-hidden p-0.5">
                    <motion.div 
                      className="h-full bg-blue-600 rounded-full shadow-[0_0_10px_rgba(37,99,235,0.4)]"
                      initial={{ width: 0 }}
                      animate={{ width: `${((state.currentQuestionIndex + 1) / state.questions.length) * 100}%` }}
                      transition={{ type: "spring", stiffness: 50 }}
                    />
                  </div>
                </div>
                <div className="bg-white px-4 py-2 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Ball</span>
                  <span className="text-xl font-black text-slate-900">{state.score}</span>
                </div>
              </div>

              {/* Question Area */}
              <div className="bg-white p-10 sm:p-14 rounded-[3rem] border border-slate-200 shadow-xl shadow-slate-200/50 space-y-12 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />
                
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-slate-900 text-white rounded-lg flex items-center justify-center font-black text-sm">
                      {state.currentQuestionIndex + 1}
                    </div>
                    <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Savol</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black leading-tight text-slate-900 tracking-tight">
                    {state.questions[state.currentQuestionIndex].text}
                  </h3>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {state.questions[state.currentQuestionIndex].options.map((option, idx) => {
                    const isSelected = selectedAnswer === option;
                    const isCorrectOption = option === state.questions[state.currentQuestionIndex].correctAnswer;
                    
                    let buttonClass = "group flex items-center justify-between p-6 rounded-2xl border-2 transition-all text-left font-bold text-lg ";
                    
                    if (!selectedAnswer) {
                      buttonClass += "border-slate-100 hover:border-blue-500 hover:bg-blue-50/50 text-slate-700 hover:translate-x-2";
                    } else if (isCorrectOption) {
                      buttonClass += "border-emerald-500 bg-emerald-50 text-emerald-700 ring-4 ring-emerald-500/10";
                    } else if (isSelected && !isCorrectOption) {
                      buttonClass += "border-rose-500 bg-rose-50 text-rose-700 ring-4 ring-rose-500/10";
                    } else {
                      buttonClass += "border-slate-50 bg-slate-50 text-slate-300 opacity-60";
                    }

                    return (
                      <motion.button
                        key={idx}
                        disabled={!!selectedAnswer}
                        onClick={() => handleAnswer(option)}
                        className={buttonClass}
                      >
                        <div className="flex items-center gap-4">
                          <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs transition-colors ${!selectedAnswer ? 'bg-slate-100 group-hover:bg-blue-100 text-slate-400 group-hover:text-blue-600' : isCorrectOption ? 'bg-emerald-200 text-emerald-700' : isSelected ? 'bg-rose-200 text-rose-700' : 'bg-slate-100 text-slate-300'}`}>
                            {String.fromCharCode(65 + idx)}
                          </span>
                          <span>{option}</span>
                        </div>
                        {selectedAnswer && isCorrectOption && <CheckCircle2 className="w-6 h-6 text-emerald-600" />}
                        {selectedAnswer && isSelected && !isCorrectOption && <XCircle className="w-6 h-6 text-rose-600" />}
                      </motion.button>
                    );
                  })}
                </div>

                <AnimatePresence>
                  {selectedAnswer && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="pt-10 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-8"
                    >
                      <div className="flex-1 space-y-2">
                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${isCorrect ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                          {isCorrect ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                          {isCorrect ? "To'g'ri" : "Noto'g'ri"}
                        </div>
                        {state.questions[state.currentQuestionIndex].explanation && (
                          <p className="text-slate-500 font-medium italic text-sm leading-relaxed">
                            {state.questions[state.currentQuestionIndex].explanation}
                          </p>
                        )}
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={nextQuestion}
                        className="w-full sm:w-auto flex items-center justify-center gap-3 px-10 py-5 bg-slate-900 text-white font-black rounded-2xl hover:bg-slate-800 transition-all shadow-xl shadow-slate-200"
                      >
                        Keyingisi <ChevronRight className="w-5 h-5" />
                      </motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}

          {/* Step 4: Results */}
          {state.isFinished && (
            <motion.div
              key="results"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-xl mx-auto bg-white p-12 sm:p-16 rounded-[4rem] border border-slate-200 shadow-2xl text-center space-y-10 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-yellow-400 via-orange-500 to-rose-500" />
              
              <div className="relative inline-block">
                <motion.div 
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 4 }}
                  className="relative bg-yellow-50 p-8 rounded-[2rem] inline-block shadow-inner"
                >
                  <Trophy className="w-20 h-20 text-yellow-500" />
                </motion.div>
                <motion.div 
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="absolute -top-4 -right-4 bg-rose-500 text-white p-3 rounded-full shadow-lg"
                >
                  <CheckCircle2 className="w-6 h-6" />
                </motion.div>
              </div>
              
              <div className="space-y-3">
                <h2 className="text-4xl font-black text-slate-900 tracking-tight">Ajoyib natija!</h2>
                <p className="text-slate-500 font-medium text-lg">Siz barcha savollarga javob berdingiz</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                  <BarChart3 className="w-5 h-5 text-blue-500 mx-auto mb-2" />
                  <span className="block text-3xl font-black text-slate-900">
                    {Math.round((state.score / state.questions.length) * 100)}%
                  </span>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Muvaffaqiyat</span>
                </div>
                <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 mx-auto mb-2" />
                  <span className="block text-3xl font-black text-slate-900">
                    {state.score}
                  </span>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">To'g'ri</span>
                </div>
                <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                  <XCircle className="w-5 h-5 text-rose-500 mx-auto mb-2" />
                  <span className="block text-3xl font-black text-slate-900">
                    {state.questions.length - state.score}
                  </span>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Xato</span>
                </div>
              </div>

              <div className="pt-6 space-y-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={reset}
                  className="w-full py-6 bg-blue-600 text-white font-black rounded-3xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 flex items-center justify-center gap-3 text-lg"
                >
                  <RotateCcw className="w-6 h-6" /> Qaytadan boshlash
                </motion.button>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Bilimingizni oshirishda davom eting!</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="max-w-5xl mx-auto p-12 text-center space-y-4">
        <div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent w-full mb-8" />
        <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em]">
          &copy; 2026 MathTest Zakariyo
        </p>
      </footer>
    </div>
  );
}
