import React, { useState, useMemo } from 'react';
import { 
  Info, Coffee, Sun, Moon, 
  Apple, Droplet, CheckCircle2, ChevronDown, 
  AlertCircle, PieChart, Check, X
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
  "Pasta integrale 60 g",
  "Pasta di semola 50 g",
  "Riso 50 g",
  "Farro 60 g",
  "Orzo 50 g",
  "Cous cous 50 g",
  "Farina di mais (per polenta) 50 g",
  "Pane comune 60 g",
  "Pane integrale o di segale 70 g",
  "Patate 220 g",
  "Gnocchi di patate 150 g"
];

const opzioniCenaPrimo = [
  "Passato o minestra di verdure (senza patate/legumi)",
  "Yogurt magro naturale 125 ml",
  "Nessun primo (se non desiderato)"
];

const opzioniCenaCarbo = [
  "Pane integrale o di segale 60 g",
  "Pane comune 50 g",
  "Pasta di semola 40 g",
  "Pasta integrale 45 g",
  "Riso 40 g",
  "Farro 50 g",
  "Orzo 40 g",
  "Patate 170 g",
  "Cous cous 40 g",
  "Semolino 40 g",
  "Cracker o grissini integrali 30 g",
  "Gallette di mais/farro/riso 30 g",
  "Nessun carboidrato aggiuntivo (se si mangia la pizza)"
];

// Regole proteiche per il tracking automatico
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
  "Lunedì": {
    colazioneLiq: opzioniColazioneLiq[0], colazioneSol: opzioniColazioneSol[0],
    pranzoCarbo: "Pasta integrale 60 g", pranzoPro: "Legumi freschi/scatola 150 g o secchi 50 g - (Max 1-2v/sett)",
    cenaPrimo: opzioniCenaPrimo[0], cenaPro: "Pesce magro (merluzzo, orata, spigola, polpo...) 250 g - (Max 2v/sett)", cenaCarbo: "Pane integrale o di segale 60 g"
  },
  "Martedì": {
    colazioneLiq: opzioniColazioneLiq[0], colazioneSol: opzioniColazioneSol[0],
    pranzoCarbo: "Riso 50 g", pranzoPro: "Affettato magro (crudo, cotto, bresaola, speck) 70 g - (Max 2v/sett)",
    cenaPrimo: opzioniCenaPrimo[0], cenaPro: "Carne bianca (pollo, tacchino, coniglio) 150 g - (Max 3v/sett)", cenaCarbo: "Pane integrale o di segale 60 g"
  },
  "Mercoledì": {
    colazioneLiq: opzioniColazioneLiq[0], colazioneSol: opzioniColazioneSol[0],
    pranzoCarbo: "Farina di mais (per polenta) 50 g", pranzoPro: "Formaggio light (ricotta, fiocchi latte, feta, mozz.) 100-150 g - (Max 2v/sett tot formaggi)",
    cenaPrimo: opzioniCenaPrimo[0], cenaPro: "Uova (n. 2) - (Max 1v/sett)", cenaCarbo: "Pane integrale o di segale 60 g"
  },
  "Giovedì": {
    colazioneLiq: opzioniColazioneLiq[0], colazioneSol: opzioniColazioneSol[0],
    pranzoCarbo: "Farro 60 g", pranzoPro: "Carne bianca (pollo, tacchino, coniglio) 150 g - (Max 3v/sett)",
    cenaPrimo: opzioniCenaPrimo[0], cenaPro: "Pesce magro (merluzzo, orata, spigola, polpo...) 250 g - (Max 2v/sett)", cenaCarbo: "Patate 170 g"
  },
  "Venerdì": {
    colazioneLiq: opzioniColazioneLiq[0], colazioneSol: opzioniColazioneSol[0],
    pranzoCarbo: "Pasta integrale 60 g", pranzoPro: "Pesce magro (merluzzo, orata, spigola, polpo...) 250 g - (Max 2v/sett)",
    cenaPrimo: opzioniCenaPrimo[0], cenaPro: "Carne rossa (manzo, vitello, cavallo, maiale) 150 g - (Max 1v/sett)", cenaCarbo: "Pane integrale o di segale 60 g"
  },
  "Sabato": {
    colazioneLiq: opzioniColazioneLiq[0], colazioneSol: opzioniColazioneSol[0],
    pranzoCarbo: "Cous cous 50 g", pranzoPro: "Legumi freschi/scatola 150 g o secchi 50 g - (Max 1-2v/sett)",
    cenaPrimo: opzioniCenaPrimo[2], cenaPro: "Pizza (Pasto Libero - Consigliato Sabato Cena)", cenaCarbo: "Nessun carboidrato aggiuntivo (se si mangia la pizza)"
  },
  "Domenica": {
    colazioneLiq: opzioniColazioneLiq[0], colazioneSol: opzioniColazioneSol[0],
    pranzoCarbo: "Gnocchi di patate 150 g", pranzoPro: "Carne bianca (pollo, tacchino, coniglio) 150 g - (Max 3v/sett)",
    cenaPrimo: opzioniCenaPrimo[0], cenaPro: "Affettato magro (crudo, cotto, bresaola, speck) 70 g - (Max 2v/sett)", cenaCarbo: "Pane integrale o di segale 60 g"
  }
};

export default function App() {
  const [selectedDay, setSelectedDay] = useState(giorni[0]);
  const [plan, setPlan] = useState(initialPlan);
  const [showInfo, setShowInfo] = useState(false);
  const [showTracker, setShowTracker] = useState(false);

  // Aggiorna la selezione
  const handleUpdate = (mealKey, value) => {
    setPlan(prev => ({
      ...prev,
      [selectedDay]: {
        ...prev[selectedDay],
        [mealKey]: value
      }
    }));
  };

  // Calcolo delle statistiche proteiche settimanali
  const proteinStats = useMemo(() => {
    let stats = {};
    Object.keys(proteinRules).forEach(key => {
      stats[key] = { ...proteinRules[key], count: 0 };
    });

    Object.values(plan).forEach(day => {
      [day.pranzoPro, day.cenaPro].forEach(meal => {
        for (let key in proteinRules) {
          if (proteinRules[key].items.includes(meal)) {
            stats[key].count += 1;
          }
        }
      });
    });

    return stats;
  }, [plan]);

  const dayData = plan[selectedDay];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100/50 text-slate-800 font-sans pb-28">
      
      {/* HEADER ELEGANTE */}
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
            <button 
              onClick={() => setShowTracker(true)}
              className="p-2.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 hover:shadow-md rounded-xl transition-all flex items-center gap-2 font-semibold text-sm border border-emerald-100"
            >
              <PieChart className="w-5 h-5" />
              <span className="hidden sm:inline">Bilancio</span>
            </button>
            <button 
              onClick={() => setShowInfo(true)}
              className="p-2.5 bg-white text-slate-600 hover:bg-slate-50 hover:shadow-md rounded-xl transition-all flex items-center border border-slate-200"
            >
              <Info className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto p-4 space-y-8 mt-2">
        
        {/* DAY SELECTOR A PILLOLE */}
        <div className="flex overflow-x-auto gap-3 hide-scrollbar pb-2 px-1">
          {giorni.map(g => (
            <button
              key={g}
              onClick={() => setSelectedDay(g)}
              className={`flex-shrink-0 px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${
                selectedDay === g 
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 scale-105' 
                  : 'bg-white text-slate-500 hover:bg-emerald-50 border border-slate-100 shadow-sm'
              }`}
            >
              {g}
            </button>
          ))}
        </div>

        <div className="space-y-6">
          
          {/* COLAZIONE */}
          <MealCard 
            title="Colazione" 
            icon={<Coffee className="w-6 h-6 text-amber-600" />}
            colorClass="amber"
          >
            <Dropdown 
              label="Bevanda / Latticino" 
              options={opzioniColazioneLiq} 
              value={dayData.colazioneLiq} 
              onChange={(val) => handleUpdate('colazioneLiq', val)} 
            />
            <Dropdown 
              label="Carboidrati / Sostituzioni Solide" 
              options={opzioniColazioneSol} 
              value={dayData.colazioneSol} 
              onChange={(val) => handleUpdate('colazioneSol', val)} 
            />
          </MealCard>

          {/* PRANZO */}
          <MealCard 
            title="Pranzo" 
            icon={<Sun className="w-6 h-6 text-orange-500" />}
            colorClass="orange"
          >
            <Dropdown 
              label="Fonte di Carboidrati" 
              options={opzioniPranzoCarbo} 
              value={dayData.pranzoCarbo} 
              onChange={(val) => handleUpdate('pranzoCarbo', val)} 
            />
            <Dropdown 
              label="Pietanza Proteica" 
              options={opzioniProteine} 
              value={dayData.pranzoPro} 
              onChange={(val) => handleUpdate('pranzoPro', val)} 
            />
            
            <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <FixedItem text="Verdura a piacere" />
              <FixedItem text="Frutta 125 g" />
            </div>
          </MealCard>

          {/* CENA */}
          <MealCard 
            title="Cena" 
            icon={<Moon className="w-6 h-6 text-indigo-500" />}
            colorClass="indigo"
          >
            <Dropdown 
              label="Primo" 
              options={opzioniCenaPrimo} 
              value={dayData.cenaPrimo} 
              onChange={(val) => handleUpdate('cenaPrimo', val)} 
            />
            <Dropdown 
              label="Pietanza Proteica" 
              options={opzioniProteine} 
              value={dayData.cenaPro} 
              onChange={(val) => handleUpdate('cenaPro', val)} 
            />
            <Dropdown 
              label="Fonte di Carboidrati" 
              options={opzioniCenaCarbo} 
              value={dayData.cenaCarbo} 
              onChange={(val) => handleUpdate('cenaCarbo', val)} 
            />

            <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <FixedItem text="Verdura a piacere" />
              <FixedItem text="Frutta 125 g" />
            </div>
          </MealCard>
        </div>

      </main>

      {/* FIXED FOOTER - CONDIMENTI */}
      <div className="fixed bottom-0 w-full bg-white/90 backdrop-blur-lg border-t border-slate-200 p-4 z-10 shadow-[0_-10px_20px_rgba(0,0,0,0.03)]">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-100 p-2 rounded-xl">
              <Droplet className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <div className="text-emerald-900 font-bold text-sm">Condimenti Giornalieri</div>
              <div className="text-xs text-emerald-600/80 font-medium">Olio d'oliva o Frutta secca</div>
            </div>
          </div>
          <div className="text-right text-sm">
            <span className="font-bold text-slate-800">25 g</span> (8 cucchiaini)<br/>
            <span className="text-[11px] text-slate-500 font-medium">1 cucchiaio olio = 15g frutta secca</span>
          </div>
        </div>
      </div>

      {/* TRACKER MODAL (BILANCIO SETTIMANALE) */}
      {showTracker && (
        <Modal title="Bilancio Proteine" icon={<PieChart className="w-6 h-6" />} onClose={() => setShowTracker(false)} color="emerald">
          <p className="text-sm text-slate-600 mb-6 bg-emerald-50 p-3 rounded-xl border border-emerald-100">
            Questo pannello calcola automaticamente le fonti proteiche che hai inserito nei vari giorni. Ti aiuta a capire <strong>cosa ti rimane da mangiare</strong> per rispettare le frequenze della dieta.
          </p>
          
          <div className="space-y-3">
            {Object.values(proteinStats).map((stat, idx) => {
              const isOver = stat.count > stat.max;
              const isPerfect = stat.count === stat.max;
              const remaining = stat.max - stat.count;

              return (
                <div key={idx} className={`p-4 rounded-2xl border ${isOver ? 'bg-red-50 border-red-200' : isPerfect ? 'bg-emerald-50/50 border-emerald-100' : 'bg-white border-slate-100 shadow-sm'}`}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-slate-800">{stat.name}</span>
                    <div className="flex gap-1">
                      {/* Dots progress bar */}
                      {Array.from({ length: Math.max(stat.max, stat.count) }).map((_, i) => (
                        <div 
                          key={i} 
                          className={`w-3 h-3 rounded-full ${
                            i < stat.count 
                              ? (isOver ? 'bg-red-500 shadow-sm shadow-red-200' : 'bg-emerald-500 shadow-sm shadow-emerald-200') 
                              : 'bg-slate-200'
                          }`} 
                        />
                      ))}
                    </div>
                  </div>
                  <div className="text-xs font-semibold flex items-center gap-1.5">
                    {isOver ? (
                      <span className="text-red-600 flex items-center gap-1"><X className="w-3 h-3"/> Hai superato il limite di {stat.count - stat.max}</span>
                    ) : isPerfect ? (
                      <span className="text-emerald-600 flex items-center gap-1"><Check className="w-3 h-3"/> Limite raggiunto</span>
                    ) : (
                      <span className="text-slate-500">Ti rimangono <strong className="text-slate-800">{remaining}</strong> porzion{remaining === 1 ? 'e' : 'i'}</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </Modal>
      )}

      {/* INFO MODAL */}
      {showInfo && (
        <Modal title="Regole della Dieta" icon={<AlertCircle className="w-6 h-6" />} onClose={() => setShowInfo(false)} color="emerald">
          <div className="space-y-6 text-sm text-slate-600">
            <section>
              <h4 className="font-bold text-slate-800 mb-3 text-base flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs">1</span>
                Regole Generali
              </h4>
              <ul className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5"/> <span><strong>I pesi indicati sono a crudo</strong> e al netto degli scarti.</span></li>
                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5"/> <span>Non aggiungere zuccheri nelle bevande.</span></li>
                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5"/> <span>Non aggiungere formaggio sul primo piatto se non indicato.</span></li>
                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5"/> <span>Biscotti secchi: rigorosamente senza zuccheri e grassi &lt; 12g/100g.</span></li>
                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5"/> <span>Bevi almeno <strong>1.5L di acqua</strong> al giorno.</span></li>
              </ul>
            </section>

            <section>
              <h4 className="font-bold text-slate-800 mb-2 text-base">Frutta Limitata</h4>
              <p className="bg-amber-50 text-amber-800 p-4 rounded-2xl border border-amber-100">
                Limita a <strong>60g a porzione</strong> (anziché 125g) i frutti zuccherini: banane, uva, cachi, fichi e mandarini.
              </p>
            </section>

            <section>
              <h4 className="font-bold text-slate-800 mb-2 text-base">Conversione Pesi (Crudo → Cotto)</h4>
              <p className="mb-3 text-xs italic text-slate-500">Moltiplica il peso crudo previsto per il fattore qui sotto se devi pesare l'alimento già cotto.</p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-white border border-slate-200 p-3 rounded-xl flex justify-between shadow-sm"><strong>Pasta</strong> <span>x 2</span></div>
                <div className="bg-white border border-slate-200 p-3 rounded-xl flex justify-between shadow-sm"><strong>Riso</strong> <span>x 2.5</span></div>
                <div className="bg-white border border-slate-200 p-3 rounded-xl flex justify-between shadow-sm"><strong>Gnocchi</strong> <span>x 1.1</span></div>
                <div className="bg-white border border-slate-200 p-3 rounded-xl flex justify-between shadow-sm"><strong>Patate</strong> <span>x 1</span></div>
                <div className="bg-white border border-slate-200 p-3 rounded-xl flex justify-between shadow-sm"><strong>Carne/Pesce</strong> <span>x 0.8</span></div>
                <div className="bg-white border border-slate-200 p-3 rounded-xl flex justify-between shadow-sm"><strong>Legumi Secchi</strong> <span>x 2.5</span></div>
              </div>
            </section>
          </div>
        </Modal>
      )}

      {/* Stili Globali */}
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
  );
}

// COMPONENTI DI SUPPORTO

function MealCard({ title, icon, colorClass, children }) {
  const colorMap = {
    amber: "bg-amber-50 border-amber-100 text-amber-900",
    orange: "bg-orange-50 border-orange-100 text-orange-900",
    indigo: "bg-indigo-50 border-indigo-100 text-indigo-900"
  };

  return (
    <div className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100/60 overflow-hidden relative">
      <div className={`p-5 flex items-center gap-4 border-b ${colorMap[colorClass]}`}>
        <div className="bg-white p-2.5 rounded-2xl shadow-sm">
          {icon}
        </div>
        <h2 className="text-2xl font-extrabold tracking-tight">{title}</h2>
      </div>
      <div className="p-6 space-y-5">
        {children}
      </div>
    </div>
  );
}

function Dropdown({ label, options, value, onChange }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">{label}</label>
      <div className="relative group">
        <select 
          value={value} 
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none bg-slate-50/50 hover:bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-2xl px-5 py-3.5 pr-12 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all cursor-pointer font-semibold shadow-sm"
        >
          {options.map((opt, i) => (
            <option key={i} value={opt}>{opt}</option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400 group-hover:text-emerald-500 transition-colors">
          <ChevronDown className="w-5 h-5" />
        </div>
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

function Modal({ title, icon, children, onClose, color = "emerald" }) {
  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-end sm:items-center justify-center sm:p-4 z-50 animate-in fade-in duration-200">
      <div className="bg-white rounded-t-3xl sm:rounded-3xl max-w-lg w-full max-h-[90vh] flex flex-col shadow-2xl slide-in-from-bottom-8 sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-300">
        <div className={`p-5 flex justify-between items-center border-b border-slate-100`}>
          <h3 className={`text-xl font-extrabold flex items-center gap-3 text-${color}-800`}>
            <div className={`bg-${color}-100 p-2 rounded-xl text-${color}-600`}>
              {icon}
            </div>
            {title}
          </h3>
          <button 
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center bg-slate-100 rounded-full text-slate-500 hover:bg-slate-200 hover:text-slate-800 transition-colors font-bold"
          >
            ✕
          </button>
        </div>
        <div className="p-6 overflow-y-auto hide-scrollbar">
          {children}
        </div>
        <div className="p-4 border-t border-slate-100 bg-white sm:rounded-b-3xl">
          <button 
            onClick={onClose}
            className={`w-full bg-${color}-600 text-white font-bold text-lg py-4 rounded-2xl hover:bg-${color}-700 shadow-lg shadow-${color}-600/20 transition-all active:scale-[0.98]`}
          >
            Chiudi
          </button>
        </div>
      </div>
    </div>
  );
}