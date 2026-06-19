// ... existing code ...
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Info, Coffee, Sun, Moon, 
// ... existing code ...
export default function App() {
  const [selectedDay, setSelectedDay] = useState(giorni[0]);
  
  const scrollRef = useRef(null);
  const isDown = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const [plan, setPlan] = useState(() => {
// ... existing code ...
  const daysCompletedCount = Object.values(completedDays).filter(Boolean).length;
  const dayData = plan[selectedDay];

  // Gestione del trascinamento fluido (Drag-to-Scroll)
  const handleMouseDown = (e) => {
    isDown.current = true;
    startX.current = e.pageX - scrollRef.current.offsetLeft;
    scrollLeft.current = scrollRef.current.scrollLeft;
  };
  const handleMouseLeave = () => { isDown.current = false; };
  const handleMouseUp = () => { isDown.current = false; };
  const handleMouseMove = (e) => {
    if (!isDown.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX.current) * 2; // velocità di trascinamento
    scrollRef.current.scrollLeft = scrollLeft.current - walk;
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-sans pb-32 transition-colors duration-300">
// ... existing code ...
      <main className="max-w-3xl mx-auto p-4 space-y-8 mt-2">
        
        {/* DAY SELECTOR CON TRASCINAMENTO FLUIDO */}
        <div 
          ref={scrollRef}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          className="flex overflow-x-auto gap-3 hide-scrollbar pb-4 px-1 cursor-grab active:cursor-grabbing select-none"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {giorni.map(g => (
            <button
              key={g}
              onClick={() => setSelectedDay(g)}
              className={`flex-shrink-0 px-6 py-3 rounded-2xl text-base font-bold transition-all duration-200 active:scale-95 border-2 ${
                selectedDay === g 
                  ? 'bg-emerald-600 dark:bg-emerald-500 text-white border-emerald-600 shadow-lg shadow-emerald-500/30' 
                  : completedDays[g] 
                    ? 'bg-emerald-50 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800 shadow-sm hover:bg-emerald-100 dark:hover:bg-emerald-900/60'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-300 dark:border-slate-600 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700'
              }`}
            >
              <span className="flex items-center gap-2 pointer-events-none">
                {g}
                {completedDays[g] && <CheckCircle2 className={`w-4 h-4 ${selectedDay === g ? 'text-emerald-200' : 'text-emerald-500'}`} />}
              </span>
            </button>
          ))}
        </div>

        <div className={`transition-all duration-300 ${isCurrentDayLocked ? 'opacity-90' : ''}`}>
// ... existing code ...
```

Applica questo frammento, ora la barra scorre che è una meraviglia! Puoi trascinarla col mouse su PC e farla "scivolare" fluidamente dal telefono. Fammi sapere! 🚀
