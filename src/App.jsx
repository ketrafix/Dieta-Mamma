import React, { useState, useMemo, useEffect } from 'react';
import { 
  Info, Coffee, Sun, Moon, 
  Apple, Droplet, CheckCircle2, ChevronDown, 
  AlertCircle, PieChart, Check, X,
  ShoppingCart, Lock, Unlock, ListChecks
} from 'lucide-react';

const opzioniColazioneLiq = [
  "Caffè o tè a piacere + Latte parz. scremato 200 ml",
  "Yogurt magro naturale 250 ml",
  "Yogurt magro naturale 125 ml + Frutta 80 g",
  "Ricotta fresca 50 g"
];

const opzioniColazioneSol = [
  "Fette biscottate integrali 30 g",
  "Formaggio spalmabile light 50 g",
  "Albume uovo 60 g + affettato tacchino 15 g",
  "Biscotti secchi senza zuccheri 30 g",
  "Pane integrale o di segale 40 g",
  "Cracker o grissini integrali 30 g",
  "Gallette di mais/farro/riso 25 g",
  "Formelle di cereali (tipo Weetabix) 34 g"
];

const opzioniPranzoCarbo = [
  "Pasta integrale 60 g", "Pasta di semola 50 g", "Riso 50 g", 
  "Farro 60 g", "Orzo 50 g", "Cous cous 50 g", "Farina di mais (per polenta) 50 g", 
  "Pane comune 60 g", "Pane integrale o di segale 70 g", "Patate 220 g", "Gnocchi di patate 150 g"
];

const opzioniCenaPrimo = [
  "Passato o minestra di verdure (senza patate/legumi) 1 pz",
  "Yogurt magro naturale 125 ml",
  "Nessun primo 0 pz"
];

const opzioniCenaCarbo = [
  "Pane integrale o di segale 60 g", "Pane comune 50 g", "Pasta di semola 40 g", 
  "Pasta integrale 45 g", "Riso 40 g", "Farro 50 g", "Orzo 40 g", "Patate 170 g", 
  "Cous cous 40 g", "Semolino 40 g", "Cracker o grissini integrali 30 g", 
  "Gallette di mais/farro/riso 30 g", "Nessun carboidrato aggiuntivo 0 g"
];

const proteinRules = {
  "carne_bianca": { name: "Carne Bianca", max: 3, items: ["Carne bianca (pollo, tacchino, coniglio) 150 g - (Max 3v/sett)"] },
  "carne_rossa": { name: "Carne Rossa", max: 1, items: ["Carne rossa (manzo, vitello, cavallo, maiale) 150 g - (Max 1v/sett)"] },
  "pesce_magro": { name: "Pesce Magro", max: 2, items: ["Pesce magro (merluzzo, orata, spigola...) 250 g - (Max 2v/sett)"] },
  "pesce_grasso": { name: "Pesce Grasso", max: 1, items: ["Pesce grasso (salmone, sgombro, tonno) 150 g - (Max 1v/sett)"] },
  "uova": { name: "Uova", max: 1, items: ["Uova (n.2) 100 g - (Max 1v/sett)"] },
  "affettato": { name: "Affettato Magro", max: 2, items: ["Affettato magro (crudo, cotto, bresaola) 70 g - (Max 2v/sett)"] },
  "formaggio": { name: "Formaggi (Light/Stagionato)", max: 2, items: [
      "Formaggio light (ricotta, feta, mozz.) 150 g - (Max 2v/sett)",
      "Formaggio stagionato (grana, asiago) 70 g - (Max 2v/sett)"
    ] 
  },
  "legumi": { name: "Legumi", max: 2, items: ["Legumi freschi/scatola 150 g o secchi 50 g - (Max 1-2v/sett)"] },
  "soia": { name: "Soia (Burger/Polpette)", max: 1, items: ["Hamburgher/polpette di soia 100 g - (Max 0-1v/sett)"] },
  "pizza": { name: "Pizza (Pasto Libero)", max: 1, items: ["Pizza (Pasto Libero) 1 pz"] }
};

const opzioniProteine = Object.values(proteinRules).flatMap(rule => rule.items);
const giorni = ["Lunedì", "Martedì", "Mercoledì", "Giovedì", "Venerdì", "Sabato", "Domenica"];

const initialPlan = {
  "Lunedì": { colazioneLiq: opzioniColazioneLiq[0], colazioneSol: opzioniColazioneSol[0], pranzoCarbo: opzioniPranzoCarbo[0], pranzoPro: proteinRules.legumi.items[0], cenaPrimo: opzioniCenaPrimo[0], cenaPro: proteinRules.pesce_magro.items[0], cenaCarbo: opzioniCenaCarbo[0] },
  "Martedì": { colazioneLiq: opzioniColazioneLiq[0], colazioneSol: opzioniColazioneSol[0], pranzoCarbo: opzioniPranzoCarbo[2], pranzoPro: proteinRules.affettato.items[0], cenaPrimo: opzioniCenaPrimo[0], cenaPro: proteinRules.carne_bianca.items[0], cenaCarbo: opzioniCenaCarbo[0] },
  "Mercoledì": { colazioneLiq: opzioniColazioneLiq[0], colazioneSol: opzioniColazioneSol[0], pranzoCarbo: opzioniPranzoCarbo[6], pranzoPro: proteinRules.formaggio.items[0], cenaPrimo: opzioniCenaPrimo[0], cenaPro: proteinRules.uova.items[0], cenaCarbo: opzioniCenaCarbo[0] },
  "Giovedì": { colazioneLiq: opzioniColazioneLiq[0], colazioneSol: opzioniColazioneSol[0], pranzoCarbo: opzioniPranzoCarbo[3], pranzoPro: proteinRules.carne_bianca.items[0], cenaPrimo: opzioniCenaPrimo[0], cenaPro: proteinRules.pesce_magro.items[0], cenaCarbo: opzioniCenaCarbo[7] },
  "Venerdì": { colazioneLiq: opzioniColazioneLiq[0], colazioneSol: opzioniColazioneSol[0], pranzoCarbo: opzioniPranzoCarbo[0], pranzoPro: proteinRules.pesce_magro.items[0], cenaPrimo: opzioniCenaPrimo[0], cenaPro: proteinRules.carne_rossa.items[0], cenaCarbo: opzioniCenaCarbo[0] },
  "Sabato": { colazioneLiq: opzioniColazioneLiq[0], colazioneSol: opzioniColazioneSol[0], pranzoCarbo: opzioniPranzoCarbo[5], pranzoPro: proteinRules.legumi.items[0], cenaPrimo: opzioniCenaPrimo[2], cenaPro: proteinRules.pizza.items[0], cenaCarbo: opzioniCenaCarbo[12] },
  "Domenica": { colazioneLiq: opzioniColazioneLiq[0], colazioneSol: opzioniColazioneSol[0], pranzoCarbo: opzioniPranzoCarbo[10], pranzoPro: proteinRules.carne_bianca.items[0], cenaPrimo: opzioniCenaPrimo[0], cenaPro: proteinRules.affettato.items[0], cenaCarbo: opzioniCenaCarbo[0] }
};

export default function App() {
  const [selectedDay, setSelectedDay] = useState(giorni[0]);
  
  // STATI E SALVATAGGIO
  const [plan, setPlan] = useState(() => {
    const saved = localStorage.getItem('smartDietPlan');
    return saved ? JSON.parse(saved) : initialPlan;
  });
  
  const [completedDays, setCompletedDays] = useState(() => {
    const saved = localStorage.getItem('smartDietCompleted');
    return saved ? JSON.parse(saved) : {};
  });

  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('smartDietTheme');
    return saved === 'dark';
  });

  const [showInfo, setShowInfo] = useState(false);
  const [showTracker, setShowTracker] = useState(false);
  const [showShoppingList, setShowShoppingList] = useState(false);

  // Applica classe Dark Mode al documento HTML
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('smartDietTheme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('smartDietTheme', 'light');
    }
  }, [isDarkMode]);

  useEffect(() => localStorage.setItem('smartDietPlan', JSON.stringify(plan)), [plan]);
  useEffect(() => localStorage.setItem('smartDietCompleted', JSON.stringify(completedDays)), [completedDays]);

  const handleUpdate = (mealKey, value) => setPlan(prev => ({ ...prev, [selectedDay]: { ...prev[selectedDay], [mealKey]: value } }));
  const toggleCompleted = () => setCompletedDays(prev => ({ ...prev, [selectedDay]: !prev[selectedDay] }));
  const isCurrentDayLocked = completedDays[selectedDay];

  // Bilancio: Conta SOLO i giorni confermati
  const proteinStats = useMemo(() => {
    let stats = {};
    Object.keys(proteinRules).forEach(key => { stats[key] = { ...proteinRules[key], count: 0 }; });

    Object.keys(plan).forEach(dayName => {
      if (completedDays[dayName]) {
        const day = plan[dayName];
        [day.pranzoPro, day.cenaPro].forEach(meal => {
          for (let key in proteinRules) {
            if (proteinRules[key].items.includes(meal)) stats[key].count += 1;
          }
        });
      }
    });
    return stats;
  }, [plan, completedDays]);

  // Lista Spesa Intelligente (Somma i grammi!)
  const shoppingList = useMemo(() => {
    const list = {};
    
    // Aggiunte fisse automatiche
    list["Verdura (Cotta o Cruda)"] = { qty: 14, unit: "porzioni" }; // 2 al gg x 7
    list["Olio d'Oliva Extra Vergine"] = { qty: 175, unit: "g" }; // 25g al gg x 7
    list["Frutta Fresca"] = { qty: 1750, unit: "g" }; // 125g x 2 pasti x 7
    list["Acqua"] = { qty: 10.5, unit: "Litri" }; // 1.5L x 7

    Object.values(plan).forEach(day => {
      const cibi = [day.colazioneLiq, day.colazioneSol, day.pranzoCarbo, day.pranzoPro, day.cenaPrimo, day.cenaPro, day.cenaCarbo];
      
      cibi.forEach(cibo => {
        if (cibo && !cibo.includes("Nessun") && !cibo.includes("Pizza")) {
          // Rimuove la regola (Max Xv/sett) per pulire il nome
          let cleanStr = cibo.split("- (Max")[0].trim();
          
          // Estrae quantità e unità di misura con una Regex (es. "Pasta 60 g" -> "Pasta", 60, "g")
          let match = cleanStr.match(/(.*?)(\d+)\s*(g|ml|pz)$/i);
          let itemName = cleanStr;
          let qty = 1;
          let unit = 'confezione';

          if (match) {
            itemName = match[1].trim();
            qty = parseInt(match[2]);
            unit = match[3].toLowerCase();
          }

          // Unifica cibi simili 
          if(itemName.includes("Yogurt magro")) itemName = "Yogurt magro naturale";
          if(itemName.includes("Pane integrale o di segale")) itemName = "Pane integrale o segale";

          if (!list[itemName]) {
            list[itemName] = { qty: 0, unit: unit };
          }
          list[itemName].qty += qty;
        }
      });
    });
    
    // Converte l'oggetto in array e ordina in ordine alfabetico
    return Object.entries(list).map(([name, data]) => ({ name, ...data })).sort((a, b) => a.name.localeCompare(b.name));
  }, [plan]);

  const daysCompletedCount = Object.values(completedDays).filter(Boolean).length;
  const dayData = plan[selectedDay];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-sans pb-32 transition-colors duration-300">
      
      {/* HEADER */}
      <header className="bg-white dark:bg-slate-800 sticky top-0 z-20 border-b border-slate-200 dark:border-slate-700 shadow-sm transition-colors duration-300">
        <div className="max-w-3xl mx-auto flex justify-between items-center p-4">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-500 dark:bg-emerald-600 p-2.5 rounded-2xl shadow-lg shadow-emerald-500/30">
              <Apple className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-slate-800 dark:text-white tracking-tight">Smart Diet</h1>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Il menù perfetto</p>
            </div>
          </div>
          
          <div className="flex gap-2">
            {/* Bottone Dark Mode */}
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-3 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-200 rounded-xl active:scale-90 transition-all shadow-sm flex items-center justify-center"
              aria-label="Modalità Scura"
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button 
              onClick={() => setShowShoppingList(true)}
              className="p-3 bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 active:scale-90 rounded-xl transition-all border border-emerald-200 dark:border-emerald-800 shadow-sm flex items-center justify-center"
            >
              <ShoppingCart className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setShowTracker(true)}
              className="px-4 py-3 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 active:scale-95 rounded-xl transition-all flex items-center gap-2 font-bold text-sm border border-emerald-100 dark:border-emerald-800 shadow-sm"
            >
              <PieChart className="w-5 h-5" />
              <span className="hidden sm:inline">Bilancio</span>
            </button>
            <button 
              onClick={() => setShowInfo(true)}
              className="p-3 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 active:scale-90 rounded-xl transition-all border border-slate-200 dark:border-slate-600 shadow-sm flex items-center justify-center"
            >
              <Info className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto p-4 space-y-8 mt-2">
        
        {/* DAY SELECTOR CON EFFETTO PRESSIONE RISOLTO */}
        <div className="flex overflow-x-auto gap-3 hide-scrollbar pb-2 px-1">
          {giorni.map(g => (
            <button
              key={g}
              onClick={() => setSelectedDay(g)}
              className={`flex-shrink-0 px-6 py-3 rounded-2xl text-base font-bold transition-all duration-200 active:scale-95 border-2 ${
                selectedDay === g 
                  ? 'bg-emerald-600 dark:bg-emerald-500 text-white border-emerald-600 shadow-lg shadow-emerald-500/30' 
                  : completedDays[g] 
                    ? 'bg-emerald-50 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800 shadow-sm hover:bg-emerald-100 dark:hover:bg-emerald-900/60'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700'
              }`}
            >
              <span className="flex items-center gap-2">
                {g}
                {completedDays[g] && <CheckCircle2 className={`w-4 h-4 ${selectedDay === g ? 'text-emerald-200' : 'text-emerald-500'}`} />}
              </span>
            </button>
          ))}
        </div>

        {}
        <div className={`transition-all duration-300 ${isCurrentDayLocked ? 'opacity-90' : ''}`}>
          
          {isCurrentDayLocked && (
            <div className="bg-emerald-100/80 dark:bg-emerald-900/50 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-100 px-4 py-3 rounded-2xl mb-6 flex items-center gap-3 shadow-inner">
              <Lock className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <div>
                <strong className="block text-sm">Giornata Chiusa!</strong>
                <span className="text-xs">Questi pasti sono stati contati nel Bilancio. Sblocca in fondo per modificare.</span>
              </div>
            </div>
          )}

          <div className="space-y-6">
            <MealCard title="Colazione" icon={<Coffee className="w-6 h-6 text-amber-600 dark:text-amber-400" />} theme="amber">
              <Dropdown label="Bevanda / Latticino" options={opzioniColazioneLiq} value={dayData.colazioneLiq} onChange={(val) => handleUpdate('colazioneLiq', val)} locked={isCurrentDayLocked} />
              <Dropdown label="Carboidrati / Solidi" options={opzioniColazioneSol} value={dayData.colazioneSol} onChange={(val) => handleUpdate('colazioneSol', val)} locked={isCurrentDayLocked} />
            </MealCard>

            <MealCard title="Pranzo" icon={<Sun className="w-6 h-6 text-orange-500 dark:text-orange-400" />} theme="orange">
              <Dropdown label="Fonte di Carboidrati" options={opzioniPranzoCarbo} value={dayData.pranzoCarbo} onChange={(val) => handleUpdate('pranzoCarbo', val)} locked={isCurrentDayLocked} />
              <Dropdown label="Pietanza Proteica" options={opzioniProteine} value={dayData.pranzoPro} onChange={(val) => handleUpdate('pranzoPro', val)} locked={isCurrentDayLocked} />
              <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <FixedItem text="Verdura a piacere" />
                <FixedItem text="Frutta 125 g" />
              </div>
            </MealCard>

            <MealCard title="Cena" icon={<Moon className="w-6 h-6 text-indigo-500 dark:text-indigo-400" />} theme="indigo">
              <Dropdown label="Primo Piatto" options={opzioniCenaPrimo} value={dayData.cenaPrimo} onChange={(val) => handleUpdate('cenaPrimo', val)} locked={isCurrentDayLocked} />
              <Dropdown label="Pietanza Proteica" options={opzioniProteine} value={dayData.cenaPro} onChange={(val) => handleUpdate('cenaPro', val)} locked={isCurrentDayLocked} />
              <Dropdown label="Fonte di Carboidrati" options={opzioniCenaCarbo} value={dayData.cenaCarbo} onChange={(val) => handleUpdate('cenaCarbo', val)} locked={isCurrentDayLocked} />
              <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <FixedItem text="Verdura a piacere" />
                <FixedItem text="Frutta 125 g" />
              </div>
            </MealCard>
          </div>
        </div>

        {}
        <div className="pt-4 pb-8">
          <button
            onClick={toggleCompleted}
            className={`w-full py-5 rounded-2xl font-extrabold text-lg flex items-center justify-center gap-3 transition-all duration-300 active:scale-95 ${
              isCurrentDayLocked 
                ? 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-2 border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700' 
                : 'bg-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:shadow-[0_0_30px_rgba(16,185,129,0.6)] hover:bg-emerald-400'
            }`}
          >
            {isCurrentDayLocked ? (
              <><Unlock className="w-6 h-6" /> Sblocca Giornata</>
            ) : (
              <><CheckCircle2 className="w-6 h-6" /> Chiudi e Conferma Giornata</>
            )}
          </button>
        </div>

      </main>

      {/* FOOTER CONDIMENTI */}
      <div className="fixed bottom-0 w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800 p-4 z-10 shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-100 dark:bg-emerald-900/50 p-2.5 rounded-xl">
              <Droplet className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <div className="text-emerald-900 dark:text-emerald-100 font-extrabold text-base">Condimenti Fissi</div>
              <div className="text-sm text-emerald-700 dark:text-emerald-400 font-medium">Olio d'oliva o Frutta secca</div>
            </div>
          </div>
          <div className="text-right text-base text-slate-800 dark:text-slate-200">
            <span className="font-extrabold">25 g</span> <span className="text-sm text-slate-600 dark:text-slate-400">(8 cucchiaini)</span><br/>
            <span className="text-xs text-slate-500 font-medium">1 cucchiaio olio = 15g frutta secca</span>
          </div>
        </div>
      </div>

      {}
      {/* MODAL BILANCIO */}
      {showTracker && (
        <Modal title="Bilancio Settimanale" icon={<PieChart className="w-6 h-6" />} onClose={() => setShowTracker(false)}>
          <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/50 p-4 rounded-2xl mb-6 shadow-sm">
            <p className="text-[15px] leading-relaxed text-emerald-900 dark:text-emerald-100 font-medium">
              Questo bilancio è precisissimo: calcola le proteine solo dei <strong className="bg-emerald-200 dark:bg-emerald-800 px-1.5 py-0.5 rounded text-emerald-900 dark:text-emerald-100">{daysCompletedCount} giorni confermati</strong> con il bottone a fine pagina.
            </p>
          </div>
          <div className="space-y-4">
            {Object.values(proteinStats).map((stat, idx) => {
              const isOver = stat.count > stat.max;
              const isPerfect = stat.count === stat.max;
              const remaining = stat.max - stat.count;

              return (
                <div key={idx} className={`p-4 rounded-2xl border-2 transition-all ${isOver ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800/50' : isPerfect ? 'bg-emerald-50/50 dark:bg-emerald-900/20 border-emerald-400 dark:border-emerald-600' : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700'}`}>
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-bold text-slate-800 dark:text-slate-100 text-base">{stat.name}</span>
                    <div className="flex gap-1.5">
                      {Array.from({ length: Math.max(stat.max, stat.count) }).map((_, i) => (
                        <div key={i} className={`w-4 h-4 rounded-full border ${i < stat.count ? (isOver ? 'bg-red-500 border-red-600' : 'bg-emerald-500 border-emerald-600') : 'bg-slate-100 dark:bg-slate-700 border-slate-200 dark:border-slate-600'}`} />
                      ))}
                    </div>
                  </div>
                  <div className="text-sm font-bold flex items-center gap-1.5">
                    {isOver ? (
                      <span className="text-red-600 dark:text-red-400 flex items-center gap-1.5"><X className="w-4 h-4"/> Sgarro: +{stat.count - stat.max}</span>
                    ) : isPerfect ? (
                      <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5"><Check className="w-4 h-4"/> Limite raggiunto</span>
                    ) : (
                      <span className="text-slate-500 dark:text-slate-400">Rimanenti: <strong className="text-slate-800 dark:text-slate-200 text-base mx-1">{remaining}</strong></span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </Modal>
      )}

      {/* MODAL LISTA SPESA (Intelligente) */}
      {showShoppingList && (
        <Modal title="Spesa Totale (Sommata)" icon={<ListChecks className="w-6 h-6" />} onClose={() => setShowShoppingList(false)} color="blue">
          <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-900 dark:text-blue-100 px-4 py-3 rounded-2xl mb-6 shadow-sm border border-blue-100 dark:border-blue-800">
            <p className="text-[15px] font-medium leading-relaxed">Ho letto tutto il tuo piano e ho <strong>sommato i grammi</strong> degli alimenti uguali. Fantastico, no?</p>
          </div>
          <div className="space-y-2">
            {shoppingList.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center p-4 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl shadow-sm hover:border-blue-200 dark:hover:border-blue-600 transition-colors">
                <span className="text-[15px] font-semibold text-slate-700 dark:text-slate-200 pr-4">{item.name}</span>
                <span className="flex-shrink-0 bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 font-black text-sm px-3 py-1.5 rounded-lg whitespace-nowrap">
                  {item.qty} {item.unit}
                </span>
              </div>
            ))}
          </div>
        </Modal>
      )}

      {/* MODAL INFO REGOLE */}
      {showInfo && (
        <Modal title="Regole della Dieta" icon={<AlertCircle className="w-6 h-6" />} onClose={() => setShowInfo(false)} color="amber">
          <div className="space-y-6 text-[15px] text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
            <section>
              <h4 className="font-extrabold text-slate-800 dark:text-white mb-3 text-lg flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400 flex items-center justify-center text-sm">1</span>
                Regole Generali
              </h4>
              <ul className="space-y-3 bg-amber-50/50 dark:bg-amber-900/10 p-5 rounded-2xl border border-amber-100 dark:border-amber-800/50">
                <li className="flex gap-3"><CheckCircle2 className="w-5 h-5 text-amber-500 flex-shrink-0"/> <span><strong>I pesi indicati sono a crudo</strong> e al netto degli scarti.</span></li>
                <li className="flex gap-3"><CheckCircle2 className="w-5 h-5 text-amber-500 flex-shrink-0"/> <span>Non aggiungere zuccheri nelle bevande.</span></li>
                <li className="flex gap-3"><CheckCircle2 className="w-5 h-5 text-amber-500 flex-shrink-0"/> <span>Bevi almeno <strong>1.5L di acqua</strong> al giorno.</span></li>
              </ul>
            </section>
            <section>
              <h4 className="font-extrabold text-slate-800 dark:text-white mb-2 text-lg">Conversione Pesi (Crudo → Cotto)</h4>
              <div className="grid grid-cols-2 gap-3 text-sm">
                {[
                  ["Pasta", "x 2"], ["Riso", "x 2.5"], ["Gnocchi", "x 1.1"], 
                  ["Patate", "x 1"], ["Carne/Pesce", "x 0.8"], ["Legumi Secchi", "x 2.5"]
                ].map(([nome, fattore], i) => (
                  <div key={i} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4 rounded-xl flex justify-between shadow-sm">
                    <strong className="text-slate-800 dark:text-slate-200">{nome}</strong> 
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">{fattore}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </Modal>
      )}

      {/* STILI PER SCROLLBAR */}
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
  );
}

function MealCard({ title, icon, theme, children }) {
  const themeClasses = {
    amber: "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800/40 text-amber-900 dark:text-amber-100",
    orange: "bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800/40 text-orange-900 dark:text-orange-100",
    indigo: "bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800/40 text-indigo-900 dark:text-indigo-100"
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden relative transition-colors duration-300">
      <div className={`px-6 py-4 flex items-center gap-4 border-b ${themeClasses[theme]} transition-colors duration-300`}>
        <div className="bg-white dark:bg-slate-800 p-2.5 rounded-xl shadow-sm">
          {icon}
        </div>
        <h2 className="text-2xl font-extrabold tracking-tight">{title}</h2>
      </div>
      <div className="p-6 space-y-6">
        {children}
      </div>
    </div>
  );
}

function Dropdown({ label, options, value, onChange, locked }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wide ml-1">{label}</label>
      <div className="relative group">
        <select 
          value={value} 
          onChange={(e) => onChange(e.target.value)}
          disabled={locked}
          className={`w-full appearance-none border rounded-2xl px-5 py-4 pr-12 text-base font-bold transition-all shadow-sm outline-none
            ${locked 
              ? 'bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-500 border-slate-200 dark:border-slate-700 opacity-80 cursor-not-allowed' 
              : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 border-slate-300 dark:border-slate-600 hover:border-emerald-400 dark:hover:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 cursor-pointer active:scale-[0.99]'
            }
          `}
        >
          {options.map((opt, i) => (
            <option key={i} value={opt} className="bg-white dark:bg-slate-800">{opt}</option>
          ))}
        </select>
        <div className={`pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 ${locked ? 'text-slate-300 dark:text-slate-600' : 'text-slate-400 dark:text-slate-500 group-hover:text-emerald-500'}`}>
          {locked ? <Lock className="w-5 h-5" /> : <ChevronDown className="w-6 h-6" />}
        </div>
      </div>
    </div>
  );
}

function FixedItem({ text }) {
  return (
    <div className="flex items-center gap-3 bg-slate-50/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm transition-colors duration-300">
      <CheckCircle2 className="w-5 h-5 text-emerald-400 dark:text-emerald-500 flex-shrink-0" />
      <span className="font-bold text-sm leading-tight">{text}</span>
    </div>
  );
}

function Modal({ title, icon, children, onClose, color = "emerald" }) {
  const colorMap = {
    emerald: { text: "text-emerald-800 dark:text-emerald-100", bg: "bg-emerald-100 dark:bg-emerald-900/50", icon: "text-emerald-600 dark:text-emerald-400", btn: "bg-emerald-600 hover:bg-emerald-500" },
    blue: { text: "text-blue-800 dark:text-blue-100", bg: "bg-blue-100 dark:bg-blue-900/50", icon: "text-blue-600 dark:text-blue-400", btn: "bg-blue-600 hover:bg-blue-500" },
    amber: { text: "text-amber-800 dark:text-amber-100", bg: "bg-amber-100 dark:bg-amber-900/50", icon: "text-amber-600 dark:text-amber-400", btn: "bg-amber-600 hover:bg-amber-500" }
  };

  const theme = colorMap[color];

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-end sm:items-center justify-center sm:p-4 z-50 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl max-w-lg w-full max-h-[90vh] flex flex-col shadow-2xl slide-in-from-bottom-8 sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-300 border border-slate-100 dark:border-slate-800">
        <div className="p-6 flex justify-between items-center border-b border-slate-100 dark:border-slate-800">
          <h3 className={`text-2xl font-extrabold flex items-center gap-3 ${theme.text}`}>
            <div className={`p-2.5 rounded-xl ${theme.bg} ${theme.icon}`}>
              {icon}
            </div>
            {title}
          </h3>
          <button onClick={onClose} className="w-10 h-10 flex items-center justify-center bg-slate-100 dark:bg-slate-800 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-90 transition-all font-bold text-xl">✕</button>
        </div>
        <div className="p-6 overflow-y-auto hide-scrollbar">
          {children}
        </div>
        <div className="p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 sm:rounded-b-3xl">
          <button onClick={onClose} className={`w-full text-white font-extrabold text-lg py-4 rounded-2xl shadow-lg transition-all active:scale-[0.98] ${theme.btn}`}>Chiudi</button>
        </div>
      </div>
    </div>
  );
}
