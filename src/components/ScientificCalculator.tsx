import React, { useState } from 'react';
import { X, RotateCcw, Delete } from 'lucide-react';

interface ScientificCalculatorProps {
  onClose: () => void;
}

export const ScientificCalculator: React.FC<ScientificCalculatorProps> = ({ onClose }) => {
  const [display, setDisplay] = useState<string>('0');
  const [memory, setMemory] = useState<number>(0);
  const [isRad, setIsRad] = useState<boolean>(true);

  const handleNum = (num: string) => {
    setDisplay(prev => (prev === '0' || prev === 'Error' ? num : prev + num));
  };

  const handleOp = (op: string) => {
    setDisplay(prev => {
      if (prev === 'Error') return '0' + op;
      return prev + ' ' + op + ' ';
    });
  };

  const handleClear = () => {
    setDisplay('0');
  };

  const handleBackspace = () => {
    setDisplay(prev => {
      if (prev.length <= 1 || prev === 'Error') return '0';
      return prev.trimEnd().slice(0, -1).trimEnd() || '0';
    });
  };

  const handleScientific = (fn: string) => {
    try {
      const val = parseFloat(display);
      if (isNaN(val)) return;

      let result = 0;
      switch (fn) {
        case 'sin':
          result = isRad ? Math.sin(val) : Math.sin((val * Math.PI) / 180);
          break;
        case 'cos':
          result = isRad ? Math.cos(val) : Math.cos((val * Math.PI) / 180);
          break;
        case 'tan':
          result = isRad ? Math.tan(val) : Math.tan((val * Math.PI) / 180);
          break;
        case 'sqrt':
          result = Math.sqrt(val);
          break;
        case 'sqr':
          result = val * val;
          break;
        case 'cube':
          result = val * val * val;
          break;
        case 'ln':
          result = Math.log(val);
          break;
        case 'log10':
          result = Math.log10(val);
          break;
        case 'inv':
          result = 1 / val;
          break;
        case 'fact':
          if (val < 0 || val > 20 || !Number.isInteger(val)) {
            setDisplay('Error');
            return;
          }
          result = 1;
          for (let i = 2; i <= val; i++) result *= i;
          break;
        case 'exp':
          result = Math.exp(val);
          break;
        default:
          return;
      }
      setDisplay(Number(result.toFixed(6)).toString());
    } catch {
      setDisplay('Error');
    }
  };

  const handleEvaluate = () => {
    try {
      // Safe sanitized arithmetic evaluation for standard expressions
      const sanitized = display.replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-');
      // eslint-disable-next-line no-eval
      const res = Function(`'use strict'; return (${sanitized})`)();
      if (typeof res === 'number' && !isNaN(res)) {
        setDisplay(Number(res.toFixed(6)).toString());
      } else {
        setDisplay('Error');
      }
    } catch {
      setDisplay('Error');
    }
  };

  return (
    <div id="gate-scientific-calculator" className="fixed bottom-6 right-6 z-50 w-80 sm:w-96 rounded-xl bg-slate-900 text-slate-100 shadow-2xl border border-slate-700 font-mono select-none">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-800 rounded-t-xl border-b border-slate-700">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
          <span className="text-xs font-bold text-slate-200 tracking-wide">GATE Virtual Calculator</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsRad(!isRad)}
            className="text-[10px] px-2 py-0.5 rounded bg-slate-700 hover:bg-slate-600 text-amber-300 font-semibold"
          >
            {isRad ? 'RAD' : 'DEG'}
          </button>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-700"
            title="Close Calculator"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Screen Display */}
      <div className="p-3 bg-slate-950 text-right">
        <div className="text-xs text-slate-500 min-h-[16px]">
          {memory !== 0 ? `M = ${memory}` : ''}
        </div>
        <div className="text-xl sm:text-2xl font-bold text-emerald-400 overflow-x-auto whitespace-nowrap scrollbar-none py-1">
          {display}
        </div>
      </div>

      {/* Button Grid */}
      <div className="p-3 grid grid-cols-5 gap-1.5 text-xs">
        {/* Row 1 */}
        <button onClick={() => handleScientific('sin')} className="p-2 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300">sin</button>
        <button onClick={() => handleScientific('cos')} className="p-2 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300">cos</button>
        <button onClick={() => handleScientific('tan')} className="p-2 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300">tan</button>
        <button onClick={handleClear} className="p-2 rounded bg-rose-900/70 hover:bg-rose-800 text-rose-200 font-bold">C</button>
        <button onClick={handleBackspace} className="p-2 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center">
          <Delete className="w-3.5 h-3.5" />
        </button>

        {/* Row 2 */}
        <button onClick={() => handleScientific('sqrt')} className="p-2 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300">√x</button>
        <button onClick={() => handleScientific('sqr')} className="p-2 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300">x²</button>
        <button onClick={() => handleScientific('cube')} className="p-2 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300">x³</button>
        <button onClick={() => handleOp('/')} className="p-2 rounded bg-slate-700 hover:bg-slate-600 text-amber-300 font-bold">÷</button>
        <button onClick={() => handleScientific('fact')} className="p-2 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300">n!</button>

        {/* Row 3 */}
        <button onClick={() => handleScientific('ln')} className="p-2 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300">ln</button>
        <button onClick={() => handleNum('7')} className="p-2 rounded bg-slate-800/80 hover:bg-slate-700 text-white font-bold">7</button>
        <button onClick={() => handleNum('8')} className="p-2 rounded bg-slate-800/80 hover:bg-slate-700 text-white font-bold">8</button>
        <button onClick={() => handleNum('9')} className="p-2 rounded bg-slate-800/80 hover:bg-slate-700 text-white font-bold">9</button>
        <button onClick={() => handleOp('*')} className="p-2 rounded bg-slate-700 hover:bg-slate-600 text-amber-300 font-bold">×</button>

        {/* Row 4 */}
        <button onClick={() => handleScientific('log10')} className="p-2 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300">log</button>
        <button onClick={() => handleNum('4')} className="p-2 rounded bg-slate-800/80 hover:bg-slate-700 text-white font-bold">4</button>
        <button onClick={() => handleNum('5')} className="p-2 rounded bg-slate-800/80 hover:bg-slate-700 text-white font-bold">5</button>
        <button onClick={() => handleNum('6')} className="p-2 rounded bg-slate-800/80 hover:bg-slate-700 text-white font-bold">6</button>
        <button onClick={() => handleOp('-')} className="p-2 rounded bg-slate-700 hover:bg-slate-600 text-amber-300 font-bold">−</button>

        {/* Row 5 */}
        <button onClick={() => handleScientific('inv')} className="p-2 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300">1/x</button>
        <button onClick={() => handleNum('1')} className="p-2 rounded bg-slate-800/80 hover:bg-slate-700 text-white font-bold">1</button>
        <button onClick={() => handleNum('2')} className="p-2 rounded bg-slate-800/80 hover:bg-slate-700 text-white font-bold">2</button>
        <button onClick={() => handleNum('3')} className="p-2 rounded bg-slate-800/80 hover:bg-slate-700 text-white font-bold">3</button>
        <button onClick={() => handleOp('+')} className="p-2 rounded bg-slate-700 hover:bg-slate-600 text-amber-300 font-bold">+</button>

        {/* Row 6 */}
        <button onClick={() => handleScientific('exp')} className="p-2 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300">eˣ</button>
        <button onClick={() => handleNum('0')} className="p-2 rounded bg-slate-800/80 hover:bg-slate-700 text-white font-bold">0</button>
        <button onClick={() => handleNum('.')} className="p-2 rounded bg-slate-800/80 hover:bg-slate-700 text-white font-bold">.</button>
        <button onClick={() => handleNum('(')} className="p-2 rounded bg-slate-800 hover:bg-slate-700 text-slate-300">(</button>
        <button onClick={() => handleNum(')')} className="p-2 rounded bg-slate-800 hover:bg-slate-700 text-slate-300">)</button>
      </div>

      <div className="px-3 pb-3">
        <button
          onClick={handleEvaluate}
          className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg transition-colors shadow"
        >
          = Calculate
        </button>
      </div>
    </div>
  );
};
