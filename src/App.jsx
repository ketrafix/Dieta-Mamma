import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Info, Coffee, Sun, Moon, 
  Apple, Droplet, CheckCircle2, ChevronDown, 
  AlertCircle, PieChart, Check, X,
  ShoppingCart, Lock, Unlock, ListChecks, Trash2,
  Wand2, Plus, MessageCircle
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
  "formaggio": { name: "Formaggio", max: 1, items: ["Formaggio light (ricotta, feta, mozz.) 150 g - (Max 1v/sett)", "Formaggio stagionato (grana, asiago) 70 g - (Max 1v/sett)"] },
  "legumi": { name: "Legumi", max: 2, items: ["Legumi freschi/scatola 150 g o secchi 50 g - (Max 2v/sett)"] },
  "pizza": { name: "Pizza (Pasto Libero)", max: 1, items: ["Pizza (Pasto Libero) 1 pz"] }
};

const opzioniProteine = Object.values(proteinRules).flatMap(rule => rule.items);
const giorni = ["Lunedì", "Martedì", "Mercoledì", "Giovedì", "Venerdì", "Sabato", "Domenica"];

const initialPlan = {
  "Lunedì": { colazioneLiq: opzioniColazioneLiq[0], colazioneSol: opzioniColazioneSol[0], pranzoCarbo: opzioniPranzoCarbo[0], pranzoPro: proteinRules.legumi.items[0], cenaPrimo: opzioniCenaPrimo[0], cenaPro: proteinRules.pesce_magro.items[0], cenaCarbo: opzioniCenaCarbo[0] },
  "Martedì": { colazioneLiq: opzioniColazioneLiq[0], colazioneSol: opzioniColazioneSol[0], pranzoCarbo: opzioniPranzoCarbo[2], pranzoPro: proteinRules.affettato.items[0], cenaPrimo: opzioniCenaPrimo[0], cenaPro: proteinRules.carne_bianca.items[0], cenaCarbo: opzioniCenaCarbo[0] },
  "Mercoledì": { colazioneLiq: opzioniColazioneLiq[0], colazioneSol: opzioniColazioneSol[0], pranzoCarbo: opzioniPranzoCarbo[6], pranzoPro: proteinRules.formaggio.items[0], cenaPrimo: opzioniCenaPrimo[0], cenaPro: proteinRules.uova.items[0], cenaCarbo: opzioniCenaCarbo[0] },
  "Giovedì": { colazioneLiq: opzioniColazioneLiq[0], colazioneSol: opzioniColazioneSol[0], pranzoCarbo: opzioniPranzoCarbo[3], pranzoPro: proteinRules.carne_bianca.items[0], cenaPrimo: opzioniCenaPrimo[0], cenaPro: proteinRules.pesce_magro.items[0], cenaCarbo: opzioniCenaCarbo[7] },
  "Venerdì": { colazioneLiq: opzioniColazioneLiq[0], colazioneSol: opzioniColazioneSol[0], pranzoCarbo: opzioniPranzoCarbo[0], pranzoPro: proteinRules.pesce_grasso.items[0], cenaPrimo: opzioniCenaPrimo[2], cenaPro: proteinRules.pizza.items[0], cenaCarbo: opzioniCenaCarbo[12] },
  "Sabato": { colazioneLiq: opzioniColazioneLiq[0], colazioneSol: opzioniColazioneSol[0], pranzoCarbo: opzioniPranzoCarbo[5], pranzoPro: proteinRules.legumi.items[0], cenaPrimo: opzioniCenaPrimo[0], cenaPro: proteinRules.carne_rossa.items[0], cenaCarbo: opzioniCenaCarbo[0] },
  "Domenica": { colazioneLiq: opzioniColazioneLiq[0], colazioneSol: opzioniColazioneSol[0], pranzoCarbo: opzioniPranzoCarbo[10], pranzoPro: proteinRules.carne_bianca.items[0], cenaPrimo: opzioniCenaPrimo[0], cenaPro: proteinRules.affettato.items[0], cenaCarbo: opzioniCenaCarbo[0] }
};

export default function App() {
  const [selectedDay, setSelectedDay] = useState(giorni[0]);
  
  const [plan, setPlan] = useState(() => {
    const saved = localStorage.getItem('smartDietPlan');
    return saved ? JSON.parse(saved) : initialPlan;
  });
  
  const [completedDays, setCompletedDays] = useState(() => {
    const saved = localStorage.getItem('smartDietCompleted');
    return saved ? JSON.parse(saved) : {};
  });

  const [shoppingCart, setShoppingCart] = useState(() => {
    const saved = localStorage.getItem('smartDietCart');
    return saved ? JSON.parse(saved) : {};
  });

  const [customShoppingItems, setCustomShoppingItems] = useState(() => {
    const saved = localStorage.getItem('smartDietCustomItems');
    return saved ? JSON.parse(saved) : [];
  });

  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('smartDietTheme');
    return saved === 'dark';
  });

  const [showInfo, setShowInfo] = useState(false);
  const [showTracker, setShowTracker] = useState(false);
  const [showShoppingList, setShowShoppingList] = useState(false);
  const [newCustomItem, setNewCustomItem] = useState("");

  const scrollRef = useRef(null);
  const isDown = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

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
    const walk = (x - startX.current) * 2;
    scrollRef.current.scrollLeft = scrollLeft.current - walk;
  };

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
  useEffect(() => localStorage.setItem('smartDietCart', JSON.stringify(shoppingCart)), [shoppingCart]);
  useEffect(() => localStorage.setItem('smartDietCustomItems', JSON.stringify(customShoppingItems)), [customShoppingItems]);

  const handleUpdate = (mealKey, value) => setPlan(prev => ({ ...prev, [selectedDay]: { ...prev[selectedDay], [mealKey]: value } }));
  const toggleCompleted = () => setCompletedDays(prev => ({ ...prev, [selectedDay]: !prev[selectedDay] }));
  const isCurrentDayLocked = completedDays[selectedDay];

  const generateRandomPlan = () => {
    if(!window.confirm("🪄 Vuoi creare un menù settimanale perfetto? Distribuirò le proteine rispettando tutti i limiti e metterò la Pizza il Venerdì!")) return;
    
    // Pool esatto di 13 pasti (esclusa la pizza che è fissa)
    let exactPool = [
      ...Array(3).fill(proteinRules.carne_bianca.items[0]),
      ...Array(1).fill(proteinRules.carne_rossa.items[0]),
      ...Array(2).fill(proteinRules.pesce_magro.items[0]),
      ...Array(1).fill(proteinRules.pesce_grasso.items[0]),
      ...Array(1).fill(proteinRules.uova.items[0]),
      ...Array(2).fill(proteinRules.affettato.items[0]),
      ...Array(1).fill(proteinRules.formaggio.items[0]),
      ...Array(2).fill(proteinRules.legumi.items[0])
    ];
    
    exactPool.sort(() => Math.random() - 0.5);

    let newPlan = {};
    
    giorni.forEach((giorno) => {
      const isFriday = giorno === "Venerdì";
      
      let pranzoPro = exactPool.pop();
      let cenaPro = isFriday ? proteinRules.pizza.items[0] : exactPool.pop();

      newPlan[giorno] = {
        colazioneLiq: opzioniColazioneLiq[Math.floor(Math.random() * opzioniColazioneLiq.length)],
        colazioneSol: opzioniColazioneSol[Math.floor(Math.random() * opzioniColazioneSol.length)],
        pranzoCarbo: opzioniPranzoCarbo[Math.floor(Math.random() * opzioniPranzoCarbo.length)],
        pranzoPro: pranzoPro,
        cenaPrimo: opzioniCenaPrimo[Math.floor(Math.random() * opzioniCenaPrimo.length)],
        cenaPro: cenaPro,
        // Nessun carboidrato extra venerdì sera
        cenaCarbo: isFriday ? opzioniCenaCarbo[12] : opzioniCenaCarbo[Math.floor(Math.random() * 12)],
      };
    });

    setPlan(newPlan);
    setCompletedDays({}); // Sblocca tutte le giornate
  };

  const addCustomItem = (e) => {
    e.preventDefault();
    if(newCustomItem.trim() === "") return;
    setCustomShoppingItems(prev => [...prev, newCustomItem.trim()]);
    setNewCustomItem("");
  };

  const removeCustomItem = (indexToRemove) => {
    setCustomShoppingItems(prev => prev.filter((_, i) => i !== indexToRemove));
  };

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

  const shoppingList = useMemo(() => {
    const list = {};
    list["Verdura (Cotta o Cruda)"] = { qty: 14, unit: "porzioni", category: 'base' }; 
    list["Olio d'Oliva Extra Vergine"] = { qty: 175, unit: "g", category: 'base' }; 
    list["Frutta Fresca"] = { qty: 1750, unit: "g", category: 'base' }; 
    list["Acqua"] = { qty: 10.5, unit: "Litri", category: 'base' }; 

    Object.values(plan).forEach(day => {
      const cibi = [day.colazioneLiq, day.colazioneSol, day.pranzoCarbo, day.pranzoPro, day.cenaPrimo, day.cenaPro, day.cenaCarbo];
      cibi.forEach(cibo => {
        if (cibo && !cibo.includes("Nessun") && !cibo.includes("Pizza")) {
          let cleanStr = cibo.split("- (Max")[0].trim();
          let match = cleanStr.match(/(.*?)(\d+)\s*(g|ml|pz)$/i);
          let itemName = cleanStr;
          let qty = 1;
          let unit = 'confezione';

          if (match) {
            itemName = match[1].trim();
            qty = parseInt(match[2]);
            unit = match[3].toLowerCase();
          }

          if(itemName.includes("Yogurt magro")) itemName = "Yogurt magro naturale";
          if(itemName.includes("Pane integrale o di segale")) itemName = "Pane integrale o segale";

          if (!list[itemName]) {
            list[itemName] = { qty: 0, unit: unit, category: 'food' };
          }
          list[itemName].qty += qty;
        }
      });
    });
    
    return Object.entries(list).map(([name, data]) => ({ name, ...data })).sort((a, b) => a.name.localeCompare(b.name));
  }, [plan]);

  const sendWhatsApp = () => {
    let text = "🛒 *Lista della Spesa Settimanale*\n\n";
    
    text += "🍽️ *Alimenti:*\n";
    shoppingList.forEach(item => {
      if(!shoppingCart[item.name]) {
        text += `- ${item.name} (${item.qty} ${item.unit})\n`;
      }
    });

    if(customShoppingItems.length > 0) {
      const unpickedExtra = customShoppingItems.filter(item => !shoppingCart[item]);
      if(unpickedExtra.length > 0) {
        text += "\n➕ *Cose Extra:*\n";
        unpickedExtra.forEach(item => {
          text += `- ${item}\n`;
        });
      }
    }

    text += "\n_(Generata dall'App Smart Diet)_";
    const encodedText = encodeURIComponent(text);
    window.open(`https://wa.me/?text=${encodedText}`, '_blank');
  };

  const daysCompletedCount = Object.values(completedDays).filter(Boolean).length;
  const dayData = plan[selectedDay];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-sans pb-32 transition-colors duration-300">
      
      {/* HEADER OTTIMIZZATO PER TELEFONO (I PULSANTI SONO PIU' PICCOLI SU MOBILE) */}
      <header className="bg-white dark:bg-slate-800 sticky top-0 z-20 border-b-2 border-slate-200 dark:border-slate-700 shadow-sm transition-colors duration-300">
        <div className="max-w-3xl mx-auto flex justify-between items-center p-3 sm:p-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="bg-emerald-500 dark:bg-emerald-600 p-2 sm:p-2.5 rounded-xl sm:rounded-2xl shadow-lg shadow-emerald-500/30">
              <Apple className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-800 dark:text-white tracking-tight">Smart Diet</h1>
              <p className="text-[11px] sm:text-sm font-medium text-slate-500 dark:text-slate-400">Il menù perfetto</p>
            </div>
          </div>
          
          <div className="flex gap-1.5 sm:gap-2">
            <button 
              onClick={generateRandomPlan}
              className="p-2 sm:p-3 bg-fuchsia-100 dark:bg-fuchsia-900/40 text-fuchsia-700 dark:text-fuchsia-400 active:scale-90 rounded-xl transition-all border-2 border-fuchsia-200 dark:border-fuchsia-800 shadow-sm flex items-center justify-center hover:bg-fuchsia-200 dark:hover:bg-fuchsia-800"
              title="Genera Menù Casuale Perfetto"
            >
              <Wand2 className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button onClick={() => setIsDarkMode(!isDarkMode)} className="hidden sm:flex p-2 sm:p-3 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-200 rounded-xl active:scale-90 transition-all shadow-sm items-center justify-center border-2 border-transparent">
              {isDarkMode ? <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" /> : <Moon className="w-4 h-4 sm:w-5 sm:h-5 text-slate-700" />}
            </button>
            <button onClick={() => setShowShoppingList(true)} className="p-2 sm:p-3 bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 active:scale-90 rounded-xl transition-all border-2 border-emerald-200 dark:border-emerald-800 shadow-sm flex items-center justify-center hover:bg-emerald-50 dark:hover:bg-slate-700">
              <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button onClick={() => setShowTracker(true)} className="hidden sm:flex px-3 sm:px-4 py-2 sm:py-3 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 active:scale-95 rounded-xl transition-all items-center gap-2 font-bold text-sm border-2 border-emerald-200 dark:border-emerald-800 shadow-sm hover:bg-emerald-100 dark:hover:bg-emerald-900/50">
              <PieChart className="w-4 h-4 sm:w-5 sm:h-5" /> <span className="hidden md:inline">Bilancio</span>
            </button>
            <button onClick={() => setShowInfo(true)} className="p-2 sm:p-3 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 active:scale-90 rounded-xl transition-all border-2 border-slate-200 dark:border-slate-600 shadow-sm flex items-center justify-center hover:bg-slate-50 dark:hover:bg-slate-700">
              <Info className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto p-4 space-y-8 mt-2">
        
        {/* BARRA DEI GIORNI */}
        <div 
          ref={scrollRef}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          className="flex overflow-x-auto gap-3 hide-scrollbar pb-2 px-1 cursor-grab active:cursor-grabbing select-none"
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

        {/* SCHEDA PASTI */}
        <div className={`transition-all duration-300 ${isCurrentDayLocked ? 'opacity-90' : ''}`}>
          {isCurrentDayLocked && (
            <div className="bg-emerald-100/80 dark:bg-emerald-900/50 border-2 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-100 px-4 py-3 rounded-2xl mb-6 flex items-center gap-3 shadow-inner">
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

        {/* TASTO CHIUDI GIORNATA */}
        <div className="pt-4 pb-8">
          <button
            onClick={toggleCompleted}
            className={`w-full py-5 rounded-2xl font-extrabold text-lg flex items-center justify-center gap-3 transition-all duration-300 active:scale-95 border-2 ${
              isCurrentDayLocked 
                ? 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-300 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700' 
                : 'bg-emerald-500 border-emerald-600 text-white shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:shadow-[0_0_30px_rgba(16,185,129,0.6)] hover:bg-emerald-400'
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

      {/* BARRA NAVIGAZIONE FISSA PER TELEFONO IN BASSO */}
      <div className="fixed bottom-0 w-full flex justify-between px-4 sm:hidden pb-4 pointer-events-none z-30">
          <button onClick={() => setIsDarkMode(!isDarkMode)} className="p-3 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-200 rounded-full shadow-lg border-2 border-slate-200 dark:border-slate-700 pointer-events-auto">
              {isDarkMode ? <Sun className="w-6 h-6 text-yellow-400" /> : <Moon className="w-6 h-6 text-slate-700" />}
          </button>
          <button onClick={() => setShowTracker(true)} className="p-3 bg-emerald-500 text-white rounded-full shadow-lg border-2 border-emerald-600 pointer-events-auto flex items-center gap-2 pr-4">
              <PieChart className="w-6 h-6" /> <span className="font-bold">Bilancio</span>
          </button>
      </div>

      {showTracker && (
        <Modal title="Bilancio Settimanale" icon={<PieChart className="w-6 h-6" />} onClose={() => setShowTracker(false)}>
          <div className="bg-emerald-50 dark:bg-emerald-900/20 border-2 border-emerald-200 dark:border-emerald-800/50 p-4 rounded-2xl mb-6 shadow-sm">
            <p className="text-[15px] leading-relaxed text-emerald-900 dark:text-emerald-100 font-medium">
              Calcolo delle proteine basato sui <strong className="bg-emerald-200 dark:bg-emerald-800 px-1.5 py-0.5 rounded text-emerald-900 dark:text-emerald-100">{daysCompletedCount} giorni confermati</strong>.
            </p>
          </div>
          <div className="space-y-4">
            {Object.values(proteinStats).map((stat, idx) => {
              const isOver = stat.count > stat.max;
              const isPerfect = stat.count === stat.max;
              const remaining = stat.max - stat.count;

              return (
                <div key={idx} className={`p-4 rounded-2xl border-2 transition-all ${isOver ? 'bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-800/50' : isPerfect ? 'bg-emerald-50/50 dark:bg-emerald-900/20 border-emerald-400 dark:border-emerald-600' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-600'}`}>
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-bold text-slate-800 dark:text-slate-100 text-base">{stat.name}</span>
                    <div className="flex gap-1.5">
                      {Array.from({ length: Math.max(stat.max, stat.count) }).map((_, i) => (
                        <div key={i} className={`w-4 h-4 rounded-full border-2 ${i < stat.count ? (isOver ? 'bg-red-500 border-red-600' : 'bg-emerald-500 border-emerald-600') : 'bg-slate-100 dark:bg-slate-700 border-slate-300 dark:border-slate-600'}`} />
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

      {showShoppingList && (
        <Modal 
          title="Spesa della Settimana" 
          icon={<ListChecks className="w-6 h-6" />} 
          onClose={() => setShowShoppingList(false)} 
          color="blue"
          extraAction={
            <div className="flex gap-2">
              <button onClick={sendWhatsApp} className="p-2 bg-green-100 text-green-700 rounded-xl hover:bg-green-200 dark:bg-green-900/40 dark:text-green-400 transition-colors" title="Invia su WhatsApp">
                <MessageCircle className="w-5 h-5"/>
              </button>
              <button onClick={() => { if(window.confirm("Vuoi rimuovere tutte le spunte?")) setShoppingCart({}); }} className="p-2 bg-red-100 text-red-600 rounded-xl hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 transition-colors" title="Resetta spunte">
                <Trash2 className="w-5 h-5"/>
              </button>
            </div>
          }
        >
          {/* Promemoria Sconti Raggiunti */}
          <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-2xl border-2 border-amber-200 dark:border-amber-800 mb-6 shadow-sm">
            <h3 className="font-extrabold text-amber-900 dark:text-amber-400 mb-2 flex items-center gap-2">
              <AlertCircle className="w-5 h-5" /> Promemoria Sconti
            </h3>
            <ul className="text-sm text-amber-800 dark:text-amber-300 space-y-1.5 ml-1 font-medium">
              <li>• <strong>Giovedì:</strong> Carne in sconto al Gigante!</li>
              <li>• <strong>Sabato & Domenica:</strong> Frutta e Verdura in offerta.</li>
            </ul>
          </div>

          <form onSubmit={addCustomItem} className="flex gap-2 mb-6">
            <input 
              type="text" 
              placeholder="Aggiungi detersivi, extra..." 
              value={newCustomItem}
              onChange={(e) => setNewCustomItem(e.target.value)}
              className="flex-1 px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:border-blue-500 outline-none"
            />
            <button type="submit" className="px-4 py-3 bg-blue-600 text-white rounded-xl font-bold shadow-md hover:bg-blue-500 active:scale-95 transition-all">
              <Plus className="w-5 h-5" />
            </button>
          </form>

          {customShoppingItems.length > 0 && (
            <div className="mb-6 space-y-2">
              <h4 className="font-extrabold text-slate-500 dark:text-slate-400 uppercase text-xs tracking-wider mb-3">Cose Extra</h4>
              {customShoppingItems.map((item, idx) => {
                const isChecked = shoppingCart[item];
                return (
                  <div key={`custom-${idx}`} className={`flex items-center justify-between p-3 border-2 rounded-xl transition-all ${isChecked ? 'bg-slate-100 border-slate-200 opacity-60' : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600'}`}>
                    <button onClick={() => setShoppingCart(prev => ({ ...prev, [item]: !prev[item] }))} className="flex-1 text-left font-bold text-slate-700 dark:text-slate-200">
                      <span className={isChecked ? 'line-through' : ''}>{item}</span>
                    </button>
                    <button onClick={() => removeCustomItem(idx)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )
              })}
            </div>
          )}

          <h4 className="font-extrabold text-slate-500 dark:text-slate-400 uppercase text-xs tracking-wider mb-3">Alimenti Dieta</h4>
          <div className="space-y-3">
            {shoppingList.map((item, idx) => {
              const isChecked = shoppingCart[item.name];
              return (
                <button 
                  key={idx} 
                  onClick={() => setShoppingCart(prev => ({ ...prev, [item.name]: !prev[item.name] }))}
                  className={`w-full flex justify-between items-center p-4 border-2 rounded-2xl transition-all active:scale-[0.98] ${
                    isChecked 
                      ? 'bg-slate-100 border-slate-200 text-slate-400 dark:bg-slate-800/50 dark:border-slate-700 dark:text-slate-500 line-through' 
                      : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:border-blue-400 dark:hover:border-blue-500 shadow-sm'
                  }`}
                >
                  <span className="text-[15px] font-bold pr-4 text-left">{item.name}</span>
                  <span className={`flex-shrink-0 font-black text-sm px-3 py-1.5 rounded-lg whitespace-nowrap ${
                    isChecked 
                      ? 'bg-slate-200 text-slate-400 dark:bg-slate-700 dark:text-slate-500' 
                      : 'bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300'
                  }`}>
                    {item.qty} {item.unit}
                  </span>
                </button>
              );
            })}
          </div>
        </Modal>
      )}

      {showInfo && (
        <Modal title="Regole della Dieta" icon={<AlertCircle className="w-6 h-6" />} onClose={() => setShowInfo(false)} color="amber">
          <div className="space-y-6 text-sm text-slate-600 dark:text-slate-300">
            <section>
              <h4 className="font-bold text-slate-800 dark:text-slate-100 mb-3 text-base flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400 flex items-center justify-center text-xs">1</span>
                Regole Generali
              </h4>
              <ul className="space-y-3 bg-amber-50 dark:bg-amber-900/10 p-4 rounded-2xl border-2 border-amber-200 dark:border-amber-800/50">
                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5"/> <span><strong>I pesi indicati sono a crudo</strong> e al netto degli scarti.</span></li>
                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5"/> <span>Non aggiungere zuccheri nelle bevande.</span></li>
                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5"/> <span>Bevi almeno <strong>1.5L di acqua</strong> al giorno.</span></li>
              </ul>
            </section>
            <section>
              <h4 className="font-bold text-slate-800 dark:text-slate-100 mb-2 text-base">Conversione Pesi (Crudo → Cotto)</h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 p-3 rounded-xl flex justify-between shadow-sm"><strong>Pasta</strong> <span>x 2</span></div>
                <div className="bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 p-3 rounded-xl flex justify-between shadow-sm"><strong>Riso</strong> <span>x 2.5</span></div>
                <div className="bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 p-3 rounded-xl flex justify-between shadow-sm"><strong>Gnocchi</strong> <span>x 1.1</span></div>
                <div className="bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 p-3 rounded-xl flex justify-between shadow-sm"><strong>Patate</strong> <span>x 1</span></div>
                <div className="bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 p-3 rounded-xl flex justify-between shadow-sm"><strong>Carne/Pesce</strong> <span>x 0.8</span></div>
                <div className="bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 p-3 rounded-xl flex justify-between shadow-sm"><strong>Legumi Secchi</strong> <span>x 2.5</span></div>
              </div>
            </section>
          </div>
        </Modal>
      )}

      {/* STILI */}
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
  );
}

function MealCard({ title, icon, theme, children }) {
  const themeClasses = {
    amber: "bg-amber-50 dark:bg-amber-900/20 border-amber-300 dark:border-amber-800/40 text-amber-900 dark:text-amber-100",
    orange: "bg-orange-50 dark:bg-orange-900/20 border-orange-300 dark:border-orange-800/40 text-orange-900 dark:text-orange-100",
    indigo: "bg-indigo-50 dark:bg-indigo-900/20 border-indigo-300 dark:border-indigo-800/40 text-indigo-900 dark:text-indigo-100"
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border-2 border-slate-300 dark:border-slate-600 overflow-hidden relative transition-colors duration-300">
      <div className={`px-6 py-4 flex items-center gap-4 border-b-2 ${themeClasses[theme]} transition-colors duration-300`}>
        <div className="bg-white dark:bg-slate-800 p-2.5 rounded-xl shadow-sm border border-white/50 dark:border-slate-700">
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
          className={`w-full appearance-none border-2 rounded-2xl px-5 py-4 pr-12 text-base font-bold transition-all shadow-sm outline-none
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
    <div className="flex items-center gap-3 bg-slate-50/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 p-4 rounded-2xl border-2 border-slate-200 dark:border-slate-700 shadow-sm transition-colors duration-300">
      <CheckCircle2 className="w-5 h-5 text-emerald-400 dark:text-emerald-500 flex-shrink-0" />
      <span className="font-bold text-sm leading-tight">{text}</span>
    </div>
  );
}

function Modal({ title, icon, children, onClose, color = "emerald", extraAction }) {
  const colorMap = {
    emerald: { text: "text-emerald-800 dark:text-emerald-100", bg: "bg-emerald-100 dark:bg-emerald-900/50", icon: "text-emerald-600 dark:text-emerald-400", btn: "bg-emerald-600 hover:bg-emerald-500 border-emerald-600" },
    blue: { text: "text-blue-800 dark:text-blue-100", bg: "bg-blue-100 dark:bg-blue-900/50", icon: "text-blue-600 dark:text-blue-400", btn: "bg-blue-600 hover:bg-blue-500 border-blue-600" },
    amber: { text: "text-amber-800 dark:text-amber-100", bg: "bg-amber-100 dark:bg-amber-900/50", icon: "text-amber-600 dark:text-amber-400", btn: "bg-amber-600 hover:bg-amber-500 border-amber-600" }
  };

  const theme = colorMap[color];

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-end sm:items-center justify-center sm:p-4 z-50 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl max-w-lg w-full max-h-[90vh] flex flex-col shadow-2xl slide-in-from-bottom-8 sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-300 border-2 border-slate-200 dark:border-slate-700">
        <div className="p-4 sm:p-6 flex justify-between items-center border-b-2 border-slate-100 dark:border-slate-800">
          <h3 className={`text-xl sm:text-2xl font-extrabold flex items-center gap-2 sm:gap-3 ${theme.text}`}>
            <div className={`p-2 sm:p-2.5 rounded-xl border border-white/20 ${theme.bg} ${theme.icon}`}>
              {icon}
            </div>
            {title}
          </h3>
          <div className="flex gap-1.5 sm:gap-2 items-center">
            {extraAction}
            <button onClick={onClose} className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center bg-slate-100 dark:bg-slate-800 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-90 transition-all font-bold text-xl border-2 border-transparent hover:border-slate-300 dark:hover:border-slate-600">✕</button>
          </div>
        </div>
        <div className="p-4 sm:p-6 overflow-y-auto hide-scrollbar">
          {children}
        </div>
        <div className="p-4 sm:p-5 border-t-2 border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 sm:rounded-b-3xl">
          <button onClick={onClose} className={`w-full text-white font-extrabold text-base sm:text-lg py-3 sm:py-4 rounded-2xl shadow-lg transition-all active:scale-[0.98] border-2 ${theme.btn}`}>Chiudi</button>
        </div>
      </div>
    </div>
  );
}
