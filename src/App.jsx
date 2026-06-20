import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Info, Coffee, Sun, Moon, 
  Apple, Droplet, CheckCircle2, ChevronDown, 
  AlertCircle, PieChart, Check, X,
  ShoppingCart, Lock, Unlock, ListChecks, Trash2,
  Wand2, Plus, MessageCircle, ShieldCheck
} from 'lucide-react';

const opzioniColazioneLiq = [
  "Caffè o tè a piacere + Latte parz. scremato 200 ml",
  "Yogurt magro naturale 250 ml",
  "Yogurt magro naturale 125 ml + Frutta 80 g",
  "Ricotta fresca 50 g (2 cucchiai)"
];

const opzioniColazioneSol = [
  "Fette biscottate integrali 30 g (n.3 circa)",
  "Formaggio spalmabile light 50 g",
  "Albume uovo 60 g + affettato tacchino 15 g",
  "Biscotti secchi senza zuccheri 30 g (n.4)",
  "Pane integrale o di segale 40 g",
  "Cracker o grissini integrali 30 g",
  "Gallette di mais/farro/riso 25 g (n.3)",
  "Formelle di cereali (tipo Weetabix) 34 g (n.2)"
];

const opzioniPranzoCarbo = [
  "Pasta integrale 60 g", "Pasta di semola 50 g", "Riso 50 g",
  "Farro 60 g", "Orzo 50 g", "Cous cous 50 g", "Farina di mais (per polenta) 50 g",
  "Pane comune 60 g", "Pane integrale o di segale 70 g", "Patate 220 g", "Gnocchi di patate 150 g"
];

const opzioniCenaPrimo = [
  "Passato o minestra di verdure (senza patate/legumi)",
  "Yogurt magro naturale 125 ml",
  "Nessun primo (se non desiderato)"
];

const opzioniCenaCarbo = [
  "Pane integrale o di segale 60 g", "Pane comune 50 g", "Pasta di semola 40 g",
  "Pasta integrale 45 g", "Riso 40 g", "Farro 50 g", "Orzo 40 g", "Patate 170 g",
  "Cous cous 40 g", "Semolino 40 g", "Cracker o grissini integrali 30 g",
  "Gallette di mais/farro/riso 30 g", "Nessun carboidrato aggiuntivo (se si mangia la pizza)"
];

const proteinRules = {
  "carne_bianca": { name: "Carne Bianca", max: 3, items: ["Carne bianca (pollo, tacchino, coniglio) 150 g - (Max 3v/sett)"] },
  "carne_rossa": { name: "Carne Rossa", max: 1, items: ["Carne rossa (manzo, vitello, cavallo, maiale) 150 g - (Max 1v/sett)"] },
  "pesce_magro": { name: "Pesce Magro", max: 2, items: ["Pesce magro (merluzzo, orata, spigola, polpo...) 250 g - (Max 2v/sett)"] },
  "pesce_grasso": { name: "Pesce Grasso", max: 1, items: ["Pesce grasso (salmone, sgombro, tonno fresco) 150 g - (Max 1v/sett)"] },
  "uova": { name: "Uova", max: 1, items: ["Uova (n. 2) - (Max 1v/sett)"] },
  "affettato": { name: "Affettato Magro", max: 2, items: ["Affettato magro (crudo, cotto, bresaola, speck) 70 g - (Max 2v/sett)"] },
  "formaggio": { name: "Formaggi (Light o Stagionato)", max: 2, items: [
      "Formaggio light (ricotta, fiocchi latte, feta, mozz.) 100-150 g - (Max 2v/sett tot formaggi)",
      "Formaggio stagionato (grana, asiago, emmenthal...) 70 g - (Max 2v/sett tot formaggi)"
    ] 
  },
  "legumi": { name: "Legumi", max: 2, items: ["Legumi freschi/scatola 150 g o secchi 50 g - (Max 1-2v/sett)"] },
  "soia": { name: "Soia (Burger/Polpette)", max: 1, items: ["Hamburgher/polpette di soia 100 g - (Max 0-1v/sett)"] },
  "pizza": { name: "Pizza (Pasto Libero)", max: 1, items: ["Pizza (Pasto Libero - Consigliato Sabato Cena)"] }
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

const getCategory = (itemName) => {
  const lower = itemName.toLowerCase();
  if (lower.match(/carne|pollo|tacchino|coniglio|manzo|vitello|cavallo|maiale|pesce|merluzzo|orata|spigola|polpo|salmone|sgombro|tonno/)) return '🥩 Macelleria & Pescheria';
  if (lower.match(/yogurt|latte|ricotta|formaggio|affettato|crudo|cotto|bresaola|speck|uova|albume/)) return '🧀 Banco Frigo';
  if (lower.match(/verdura|frutta|patate|passato|minestra/)) return '🥦 Ortofrutta';
  return '🍝 Dispensa';
};

export default function App() {
  const [selectedDay, setSelectedDay] = useState(giorni[0]);
  const [plan, setPlan] = useState(() => { const saved = localStorage.getItem('smartDietPlan'); return saved ? JSON.parse(saved) : initialPlan; });
  const [completedDays, setCompletedDays] = useState(() => { const saved = localStorage.getItem('smartDietCompleted'); return saved ? JSON.parse(saved) : {}; });
  const [shoppingCart, setShoppingCart] = useState(() => { const saved = localStorage.getItem('smartDietCart'); return saved ? JSON.parse(saved) : {}; });
  const [customShoppingItems, setCustomShoppingItems] = useState(() => { const saved = localStorage.getItem('smartDietCustomItems'); return saved ? JSON.parse(saved) : []; });
  
  const [showInfo, setShowInfo] = useState(false);
  const [showTracker, setShowTracker] = useState(false);
  const [showShoppingList, setShowShoppingList] = useState(false);
  const [showGeneratorConfirm, setShowGeneratorConfirm] = useState(false);
  const [newCustomItem, setNewCustomItem] = useState("");

  const scrollRef = useRef(null);
  const isDown = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const handleMouseDown = (e) => { isDown.current = true; startX.current = e.pageX - scrollRef.current.offsetLeft; scrollLeft.current = scrollRef.current.scrollLeft; };
  const handleMouseLeave = () => { isDown.current = false; };
  const handleMouseUp = () => { isDown.current = false; };
  const handleMouseMove = (e) => {
    if (!isDown.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX.current) * 2;
    scrollRef.current.scrollLeft = scrollLeft.current - walk;
  };

  useEffect(() => localStorage.setItem('smartDietPlan', JSON.stringify(plan)), [plan]);
  useEffect(() => localStorage.setItem('smartDietCompleted', JSON.stringify(completedDays)), [completedDays]);
  useEffect(() => localStorage.setItem('smartDietCart', JSON.stringify(shoppingCart)), [shoppingCart]);
  useEffect(() => localStorage.setItem('smartDietCustomItems', JSON.stringify(customShoppingItems)), [customShoppingItems]);

  const handleUpdate = (mealKey, value) => setPlan(prev => ({ ...prev, [selectedDay]: { ...prev[selectedDay], [mealKey]: value } }));
  const toggleCompleted = () => setCompletedDays(prev => ({ ...prev, [selectedDay]: !prev[selectedDay] }));
  const isCurrentDayLocked = completedDays[selectedDay];

  const generateRandomPlan = () => {
    const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

    let poolPro = shuffle([
      ...Array(3).fill(proteinRules.carne_bianca.items[0]),
      ...Array(1).fill(proteinRules.carne_rossa.items[0]),
      ...Array(2).fill(proteinRules.pesce_magro.items[0]),
      ...Array(1).fill(proteinRules.pesce_grasso.items[0]),
      ...Array(1).fill(proteinRules.uova.items[0]),
      ...Array(2).fill(proteinRules.affettato.items[0]),
      ...Array(1).fill(proteinRules.formaggio.items[0]),
      ...Array(2).fill(proteinRules.legumi.items[0])
    ]);
    let poolPranzoCarbo = shuffle([...opzioniPranzoCarbo]).slice(0, 7);
    let poolCenaCarboOpzioni = opzioniCenaCarbo.filter(c => !c.includes("Nessun"));
    let poolCenaCarbo = shuffle(poolCenaCarboOpzioni).slice(0, 6);
    let poolCenaPrimo = shuffle([ opzioniCenaPrimo[0], opzioniCenaPrimo[0], opzioniCenaPrimo[0], opzioniCenaPrimo[1], opzioniCenaPrimo[1], opzioniCenaPrimo[2], opzioniCenaPrimo[2] ]);
    let poolColazioneLiq = shuffle([ opzioniColazioneLiq[0], opzioniColazioneLiq[0], opzioniColazioneLiq[1], opzioniColazioneLiq[1], opzioniColazioneLiq[2], opzioniColazioneLiq[2], opzioniColazioneLiq[3] ]);
    let poolColazioneSol = shuffle([...opzioniColazioneSol]).slice(0, 7);

    let newPlan = {};
    giorni.forEach((giorno) => {
      const isFriday = giorno === "Venerdì";
      newPlan[giorno] = {
        colazioneLiq: poolColazioneLiq.pop(), colazioneSol: poolColazioneSol.pop(),
        pranzoCarbo: poolPranzoCarbo.pop(), pranzoPro: poolPro.pop(),
        cenaPrimo: poolCenaPrimo.pop(), cenaPro: isFriday ? proteinRules.pizza.items[0] : poolPro.pop(),
        cenaCarbo: isFriday ? opzioniCenaCarbo[12] : poolCenaCarbo.pop(),
      };
    });
    setPlan(newPlan);
    setCompletedDays({}); 
    setShowGeneratorConfirm(false); 
  };

  const addCustomItem = (e) => { e.preventDefault(); if(newCustomItem.trim() === "") return; setCustomShoppingItems(prev => [...prev, newCustomItem.trim()]); setNewCustomItem(""); };
  const removeCustomItem = (indexToRemove) => { setCustomShoppingItems(prev => prev.filter((_, i) => i !== indexToRemove)); };

  const proteinStats = useMemo(() => {
    let stats = {};
    Object.keys(proteinRules).forEach(key => { stats[key] = { ...proteinRules[key], count: 0 }; });
    Object.values(plan).forEach(day => {
      [day.pranzoPro, day.cenaPro].forEach(meal => {
        for (let key in proteinRules) { if (proteinRules[key].items.includes(meal)) stats[key].count += 1; }
      });
    });
    return stats;
  }, [plan]);

  const getSmartProteinOptions = (currentSelectedValue) => {
    return opzioniProteine.map(item => {
      const ruleKey = Object.keys(proteinRules).find(key => proteinRules[key].items.includes(item));
      const stat = proteinStats[ruleKey];
      const isOverLimit = stat && stat.count >= stat.max;
      const isSelected = item === currentSelectedValue;

      if (isOverLimit && !isSelected) {
        return { label: `⛔ Sfora limite: ${item.split('(')[0].trim()}`, value: item, disabled: true };
      }
      return { label: item, value: item, disabled: false };
    });
  };

  const groupedShoppingList = useMemo(() => {
    const list = {};
    list["Verdura (Cotta o Cruda)"] = { qty: 14, unit: "porz." }; 
    list["Olio d'Oliva Extra Vergine"] = { qty: 175, unit: "g" }; 
    list["Frutta Fresca"] = { qty: 1750, unit: "g" }; 
    list["Acqua"] = { qty: 10.5, unit: "L" }; 

    Object.values(plan).forEach(day => {
      const cibi = [day.colazioneLiq, day.colazioneSol, day.pranzoCarbo, day.pranzoPro, day.cenaPrimo, day.cenaPro, day.cenaCarbo];
      cibi.forEach(cibo => {
        if (cibo && !cibo.includes("Nessun") && !cibo.includes("Pizza")) {
          let cleanStr = cibo.split("- (Max")[0].trim();
          let match = cleanStr.match(/(.*?)(\d+)\s*(g|ml|pz)$/i);
          let itemName = cleanStr;
          let qty = 1;
          let unit = 'cfz.';

          if (match) { itemName = match[1].trim(); qty = parseInt(match[2]); unit = match[3].toLowerCase(); }
          if(itemName.includes("Yogurt magro")) itemName = "Yogurt magro naturale";
          if(itemName.includes("Pane integrale o di segale")) itemName = "Pane integrale o segale";

          if (!list[itemName]) { list[itemName] = { qty: 0, unit: unit }; }
          list[itemName].qty += qty;
        }
      });
    });
    
    // Raggruppamento in Corsie
    const grouped = {
      '🥦 Ortofrutta': [],
      '🥩 Macelleria & Pescheria': [],
      '🧀 Banco Frigo': [],
      '🍝 Dispensa': [],
      '🛒 Cose Extra': customShoppingItems.map(name => ({ name, custom: true }))
    };

    Object.entries(list).forEach(([name, data]) => {
      const cat = getCategory(name);
      grouped[cat].push({ name, ...data, custom: false });
    });

    // Ordina alfabeticamente in ogni corsia
    Object.keys(grouped).forEach(key => { grouped[key].sort((a, b) => a.name.localeCompare(b.name)); });
    return grouped;
  }, [plan, customShoppingItems]);

  const sendWhatsApp = () => {
    let text = "🛒 *Lista della Spesa (Divisa a Corsie)*\n\n";
    Object.entries(groupedShoppingList).forEach(([category, items]) => {
      const unpicked = items.filter(i => !shoppingCart[i.name]);
      if(unpicked.length > 0) {
        text += `*${category}*\n`;
        unpicked.forEach(item => { text += `- ${item.name} ${item.custom ? '' : `(${item.qty} ${item.unit})`}\n`; });
        text += `\n`;
      }
    });
    text += "_(Generata da Smart Diet)_";
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const dayData = plan[selectedDay];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100/50 text-slate-800 font-sans pb-28">
      
      <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-20 border-b border-emerald-100">
        <div className="max-w-3xl mx-auto flex justify-between items-center p-4">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-tr from-emerald-500 to-teal-400 p-2 rounded-2xl shadow-lg shadow-emerald-200">
              <Apple className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-700 to-teal-600 tracking-wide">
                Smart Diet
              </h1>
              <p className="text-xs font-medium text-slate-500">Il tuo menù settimanale</p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <button onClick={() => setShowGeneratorConfirm(true)} className="p-2.5 bg-fuchsia-50 text-fuchsia-600 hover:bg-fuchsia-100 rounded-xl transition-all flex items-center border border-fuchsia-100">
              <Wand2 className="w-5 h-5" />
            </button>
            <button onClick={() => setShowShoppingList(true)} className="p-2.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-xl transition-all flex items-center border border-emerald-100">
              <ShoppingCart className="w-5 h-5" />
            </button>
            <button onClick={() => setShowTracker(true)} className="hidden sm:flex p-2.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-xl transition-all items-center gap-2 font-semibold text-sm border border-emerald-100">
              <PieChart className="w-5 h-5" /> Bilancio
            </button>
            <button onClick={() => setShowInfo(true)} className="p-2.5 bg-white text-slate-600 hover:bg-slate-50 rounded-xl transition-all flex items-center border border-slate-200">
              <Info className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto p-4 space-y-8 mt-2">
        <div 
          ref={scrollRef} onMouseDown={handleMouseDown} onMouseLeave={handleMouseLeave} onMouseUp={handleMouseUp} onMouseMove={handleMouseMove}
          className="flex overflow-x-auto gap-3 hide-scrollbar pb-2 px-1 cursor-grab active:cursor-grabbing select-none"
        >
          {giorni.map(g => (
            <button key={g} onClick={() => setSelectedDay(g)} className={`flex-shrink-0 px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${selectedDay === g ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 scale-105' : completedDays[g] ? 'bg-emerald-50 border border-emerald-200 text-emerald-700' : 'bg-white text-slate-500 hover:bg-emerald-50 border border-slate-100 shadow-sm'}`}>
              <span className="flex items-center gap-2 pointer-events-none">{g} {completedDays[g] && <CheckCircle2 className="w-4 h-4"/>}</span>
            </button>
          ))}
        </div>

        <div className={`space-y-6 transition-all duration-300 ${isCurrentDayLocked ? 'opacity-90' : ''}`}>
          {isCurrentDayLocked && (
            <div className="bg-emerald-100/80 border border-emerald-300 text-emerald-900 px-4 py-3 rounded-2xl flex items-center gap-3">
              <Lock className="w-5 h-5 text-emerald-600" />
              <div><strong className="block text-sm">Giornata Chiusa!</strong><span className="text-xs">Sblocca a fondo pagina per fare modifiche.</span></div>
            </div>
          )}

          <MealCard title="Colazione" icon={<Coffee className="w-6 h-6 text-amber-600" />} colorClass="amber">
            <Dropdown label="Bevanda / Latticino" options={opzioniColazioneLiq} value={dayData.colazioneLiq} onChange={(val) => handleUpdate('colazioneLiq', val)} locked={isCurrentDayLocked}/>
            <Dropdown label="Carboidrati / Sostituzioni Solide" options={opzioniColazioneSol} value={dayData.colazioneSol} onChange={(val) => handleUpdate('colazioneSol', val)} locked={isCurrentDayLocked}/>
          </MealCard>

          <MealCard title="Pranzo" icon={<Sun className="w-6 h-6 text-orange-500" />} colorClass="orange">
            <Dropdown label="Fonte di Carboidrati" options={opzioniPranzoCarbo} value={dayData.pranzoCarbo} onChange={(val) => handleUpdate('pranzoCarbo', val)} locked={isCurrentDayLocked}/>
            <Dropdown label="Pietanza Proteica" options={getSmartProteinOptions(dayData.pranzoPro)} value={dayData.pranzoPro} onChange={(val) => handleUpdate('pranzoPro', val)} locked={isCurrentDayLocked} isSmart={true}/>
            <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3"><FixedItem text="Verdura a piacere" /><FixedItem text="Frutta 125 g" /></div>
          </MealCard>

          <MealCard title="Cena" icon={<Moon className="w-6 h-6 text-indigo-500" />} colorClass="indigo">
            <Dropdown label="Primo" options={opzioniCenaPrimo} value={dayData.cenaPrimo} onChange={(val) => handleUpdate('cenaPrimo', val)} locked={isCurrentDayLocked}/>
            <Dropdown label="Pietanza Proteica" options={getSmartProteinOptions(dayData.cenaPro)} value={dayData.cenaPro} onChange={(val) => handleUpdate('cenaPro', val)} locked={isCurrentDayLocked} isSmart={true}/>
            <Dropdown label="Fonte di Carboidrati" options={opzioniCenaCarbo} value={dayData.cenaCarbo} onChange={(val) => handleUpdate('cenaCarbo', val)} locked={isCurrentDayLocked}/>
            <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3"><FixedItem text="Verdura a piacere" /><FixedItem text="Frutta 125 g" /></div>
          </MealCard>
        </div>

        <div className="pt-4">
          <button onClick={toggleCompleted} className={`w-full py-4 rounded-2xl font-extrabold text-lg flex items-center justify-center gap-3 transition-all duration-300 border ${isCurrentDayLocked ? 'bg-slate-100 text-slate-500 border-slate-200' : 'bg-emerald-500 border-emerald-600 text-white shadow-lg hover:bg-emerald-400'}`}>
            {isCurrentDayLocked ? <><Unlock className="w-6 h-6" /> Sblocca Giornata</> : <><CheckCircle2 className="w-6 h-6" /> Chiudi Giornata</>}
          </button>
        </div>
      </main>

      <div className="fixed bottom-0 w-full bg-white/90 backdrop-blur-lg border-t border-slate-200 p-4 z-10 shadow-[0_-10px_20px_rgba(0,0,0,0.03)] sm:hidden flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-100 p-2 rounded-xl"><Droplet className="w-5 h-5 text-emerald-600" /></div>
          <div><div className="text-emerald-900 font-bold text-xs">Condimenti</div><div className="text-[10px] text-emerald-600/80 font-medium">Olio d'oliva extravergine</div></div>
        </div>
        <div className="text-right"><span className="font-bold text-slate-800 text-sm">25 g</span><br/><span className="text-[10px] text-slate-500 font-medium">circa 8 cucchiaini</span></div>
      </div>

      {}
      {showGeneratorConfirm && (
        <Modal title="Generazione Magica ✨" icon={<Wand2 className="w-6 h-6" />} onClose={() => setShowGeneratorConfirm(false)} color="fuchsia">
          <div className="bg-fuchsia-50 p-4 rounded-2xl border border-fuchsia-100 mb-4 text-fuchsia-900 shadow-sm text-sm">
            L'algoritmo ottimizzerà <strong>tutti i nutrienti</strong> garantendoti la massima varietà ed evitando che tu mangi troppo spesso la stessa cosa.
          </div>
          <button onClick={generateRandomPlan} className="w-full py-4 rounded-2xl font-bold bg-fuchsia-600 text-white shadow-lg shadow-fuchsia-600/30 hover:bg-fuchsia-500 transition-all">Rimescola e Genera Menù</button>
        </Modal>
      )}

      {showShoppingList && (
        <Modal 
          title="Spesa a Corsie" 
          icon={<ListChecks className="w-6 h-6" />} 
          onClose={() => setShowShoppingList(false)} 
          color="blue"
          extraAction={
            <div className="flex gap-2">
              <button onClick={sendWhatsApp} className="p-2 bg-green-100 text-green-700 rounded-xl hover:bg-green-200" title="Invia su WhatsApp"><MessageCircle className="w-5 h-5"/></button>
              <button onClick={() => setShoppingCart({})} className="p-2 bg-red-100 text-red-600 rounded-xl hover:bg-red-200" title="Resetta spunte"><Trash2 className="w-5 h-5"/></button>
            </div>
          }
        >
          <div className="bg-amber-50 p-3 rounded-xl border border-amber-100 mb-5 text-xs text-amber-800 font-medium">
            <strong className="flex items-center gap-1"><AlertCircle className="w-4 h-4"/> Sconti:</strong> Giovedì Carne al Gigante / Weekend Ortofrutta in offerta.
          </div>

          <form onSubmit={addCustomItem} className="flex gap-2 mb-6">
            <input type="text" placeholder="Aggiungi detersivi, extra..." value={newCustomItem} onChange={(e) => setNewCustomItem(e.target.value)} className="flex-1 px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 focus:outline-none focus:border-blue-500 text-sm font-medium"/>
            <button type="submit" className="px-4 py-3 bg-blue-600 text-white rounded-xl font-bold shadow-md hover:bg-blue-500"><Plus className="w-5 h-5" /></button>
          </form>

          <div className="space-y-6">
            {Object.entries(groupedShoppingList).map(([category, items]) => {
              if (items.length === 0) return null;
              return (
                <div key={category}>
                  <h4 className="font-extrabold text-slate-800 bg-slate-100 px-3 py-2 rounded-lg text-sm mb-3 shadow-sm">{category}</h4>
                  <div className="space-y-2">
                    {items.map((item, idx) => {
                      const isChecked = shoppingCart[item.name];
                      return (
                        <div key={idx} className={`flex items-center justify-between p-3 border rounded-xl transition-all ${isChecked ? 'bg-slate-50 border-slate-100 opacity-60' : 'bg-white border-slate-200 shadow-sm'}`}>
                          <button onClick={() => setShoppingCart(prev => ({ ...prev, [item.name]: !prev[item.name] }))} className="flex-1 text-left font-bold text-slate-700 text-sm">
                            <span className={isChecked ? 'line-through' : ''}>{item.name}</span>
                          </button>
                          {!item.custom ? (
                            <span className="text-xs font-black bg-blue-50 text-blue-700 px-2.5 py-1 rounded-md">{item.qty} {item.unit}</span>
                          ) : (
                            <button onClick={() => removeCustomItem(customShoppingItems.indexOf(item.name))} className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </Modal>
      )}

      {showTracker && (
        <Modal title="Bilancio Settimanale" icon={<PieChart className="w-6 h-6" />} onClose={() => setShowTracker(false)} color="emerald">
          <div className="space-y-3">
            {Object.values(proteinStats).map((stat, idx) => {
              const isOver = stat.count > stat.max;
              const isPerfect = stat.count === stat.max;
              const remaining = stat.max - stat.count;
              return (
                <div key={idx} className={`p-4 rounded-2xl border ${isOver ? 'bg-red-50 border-red-200' : isPerfect ? 'bg-emerald-50/50 border-emerald-100' : 'bg-white border-slate-100 shadow-sm'}`}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-slate-800">{stat.name}</span>
                    <div className="flex gap-1">{Array.from({ length: Math.max(stat.max, stat.count) }).map((_, i) => (<div key={i} className={`w-3 h-3 rounded-full ${i < stat.count ? (isOver ? 'bg-red-500' : 'bg-emerald-500') : 'bg-slate-200'}`} />))}</div>
                  </div>
                  <div className="text-xs font-semibold flex items-center gap-1.5">
                    {isOver ? <span className="text-red-600 flex items-center gap-1"><X className="w-3 h-3"/> Hai superato il limite di {stat.count - stat.max}</span> : isPerfect ? <span className="text-emerald-600 flex items-center gap-1"><Check className="w-3 h-3"/> Limite raggiunto</span> : <span className="text-slate-500">Ti rimangono <strong className="text-slate-800">{remaining}</strong> porzion{remaining === 1 ? 'e' : 'i'}</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </Modal>
      )}

      {showInfo && (
        <Modal title="Regole della Dieta" icon={<AlertCircle className="w-6 h-6" />} onClose={() => setShowInfo(false)} color="amber">
          <ul className="space-y-3 bg-amber-50 p-4 rounded-2xl border border-amber-100 text-sm text-amber-900 font-medium mb-6">
            <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5"/> <span>Pesi a crudo e senza scarti.</span></li>
            <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5"/> <span>Bevi almeno 1.5L di acqua al giorno.</span></li>
            <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5"/> <span>Frutta zuccherina (banane, uva, fichi): Limita a 60g.</span></li>
          </ul>
          <h4 className="font-bold text-slate-800 mb-2 text-sm">Convertitore Cotto/Crudo</h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-white border border-slate-200 p-2.5 rounded-lg flex justify-between shadow-sm text-slate-600"><strong>Pasta</strong> <span>x 2</span></div>
            <div className="bg-white border border-slate-200 p-2.5 rounded-lg flex justify-between shadow-sm text-slate-600"><strong>Riso</strong> <span>x 2.5</span></div>
            <div className="bg-white border border-slate-200 p-2.5 rounded-lg flex justify-between shadow-sm text-slate-600"><strong>Gnocchi</strong> <span>x 1.1</span></div>
            <div className="bg-white border border-slate-200 p-2.5 rounded-lg flex justify-between shadow-sm text-slate-600"><strong>Patate</strong> <span>x 1</span></div>
            <div className="bg-white border border-slate-200 p-2.5 rounded-lg flex justify-between shadow-sm text-slate-600"><strong>Carne/Pesce</strong> <span>x 0.8</span></div>
            <div className="bg-white border border-slate-200 p-2.5 rounded-lg flex justify-between shadow-sm text-slate-600"><strong>Legumi</strong> <span>x 2.5</span></div>
          </div>
        </Modal>
      )}

      <style dangerouslySetInnerHTML={{__html: `.hide-scrollbar::-webkit-scrollbar { display: none; } .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }`}} />
    </div>
  );
}

function MealCard({ title, icon, colorClass, children }) {
  const colorMap = { amber: "bg-amber-50 border-amber-100 text-amber-900", orange: "bg-orange-50 border-orange-100 text-orange-900", indigo: "bg-indigo-50 border-indigo-100 text-indigo-900" };
  return (
    <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 overflow-hidden relative">
      <div className={`p-5 flex items-center gap-4 border-b ${colorMap[colorClass]}`}>
        <div className="bg-white p-2.5 rounded-2xl shadow-sm">{icon}</div>
        <h2 className="text-2xl font-extrabold tracking-tight">{title}</h2>
      </div>
      <div className="p-6 space-y-5">{children}</div>
    </div>
  );
}

function Dropdown({ label, options, value, onChange, locked, isSmart }) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex justify-between items-end ml-1">
        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{label}</label>
        {isSmart && <span className="text-[9px] font-bold text-emerald-500 bg-emerald-50 px-1.5 py-0.5 rounded-md flex items-center gap-1 border border-emerald-100" title="Le opzioni che sforano il budget settimanale sono state disabilitate!"><ShieldCheck className="w-3 h-3"/> Sostituzione Protetta</span>}
      </div>
      <div className="relative group">
        <select value={value} onChange={(e) => onChange(e.target.value)} disabled={locked} className={`w-full appearance-none rounded-2xl px-5 py-3.5 pr-12 text-sm font-semibold transition-all outline-none border ${locked ? 'bg-slate-50 text-slate-400 border-slate-200 opacity-80' : 'bg-slate-50/50 hover:bg-slate-50 text-slate-700 border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 cursor-pointer shadow-sm'}`}>
          {options.map((opt, i) => {
            const val = typeof opt === 'string' ? opt : opt.value;
            const lbl = typeof opt === 'string' ? opt : opt.label;
            const isDisabled = typeof opt === 'string' ? false : opt.disabled;
            return <option key={i} value={val} disabled={isDisabled} className={isDisabled ? 'text-red-500 font-bold bg-red-50' : 'text-slate-800'}>{lbl}</option>
          })}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400"><ChevronDown className="w-5 h-5" /></div>
      </div>
    </div>
  );
}

function FixedItem({ text }) {
  return (
    <div className="flex items-center gap-2.5 bg-slate-50 text-slate-600 text-sm p-3.5 rounded-2xl border border-slate-100 shadow-sm">
      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
      <span className="font-semibold">{text}</span>
    </div>
  );
}

function Modal({ title, icon, children, onClose, color = "emerald", extraAction }) {
  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-end sm:items-center justify-center sm:p-4 z-50 animate-in fade-in duration-200">
      <div className="bg-white rounded-t-3xl sm:rounded-3xl max-w-lg w-full max-h-[90vh] flex flex-col shadow-2xl slide-in-from-bottom-8 sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-300">
        <div className="p-5 flex justify-between items-center border-b border-slate-100">
          <h3 className={`text-xl font-extrabold flex items-center gap-3 text-${color}-800`}><div className={`bg-${color}-100 p-2 rounded-xl text-${color}-600`}>{icon}</div>{title}</h3>
          <div className="flex gap-2">
            {extraAction}
            <button onClick={onClose} className="w-9 h-9 flex items-center justify-center bg-slate-100 rounded-full text-slate-500 hover:bg-slate-200 font-bold transition-all">✕</button>
          </div>
        </div>
        <div className="p-5 overflow-y-auto hide-scrollbar">{children}</div>
      </div>
    </div>
  );
}
