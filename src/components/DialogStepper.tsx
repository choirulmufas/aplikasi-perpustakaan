import React from 'react';
import { CircleDot, Keyboard, ShieldCheck, CloudUpload, ChevronRight } from 'lucide-react';
import type { DialogState } from '../types/book';

interface DialogStepperProps {
  currentState: DialogState;
}

export const DialogStepper: React.FC<DialogStepperProps> = ({ currentState }) => {
  const steps: { id: DialogState; label: string; icon: React.ReactNode }[] = [
    {
      id: 'idle',
      label: '1. Siap Masukan',
      icon: <CircleDot className="w-3.5 h-3.5" />,
    },
    {
      id: 'typing',
      label: '2. Mengisi Borang',
      icon: <Keyboard className="w-3.5 h-3.5" />,
    },
    {
      id: 'validating',
      label: '3. Validasi',
      icon: <ShieldCheck className="w-3.5 h-3.5" />,
    },
    {
      id: 'saving',
      label: '4. Simpan DB',
      icon: <CloudUpload className="w-3.5 h-3.5" />,
    },
  ];

  return (
    <div className="bg-slate-900 border-b border-slate-800 text-white py-2 px-4 shadow-inner">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-2 text-xs">
        {/* Step Badge */}
        <div className="flex items-center space-x-2 shrink-0">
          <span className="px-2 py-0.5 rounded bg-indigo-500/20 border border-indigo-400/40 text-indigo-300 font-mono uppercase text-[10px] font-bold tracking-wider whitespace-nowrap">
            Langkah 2: Struktur Dialog
          </span>
          <span className="text-slate-400 hidden lg:inline text-[11px]">
            Siklus Interaksi Borang:
          </span>
        </div>

        {/* Stepper Pills (No ugly scrollbar) */}
        <div className="flex items-center space-x-1 sm:space-x-1.5 overflow-x-auto w-full md:w-auto py-0.5 no-scrollbar">
          {steps.map((step, idx) => {
            const isActive = currentState === step.id;
            return (
              <React.Fragment key={step.id}>
                <div
                  className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs transition-all whitespace-nowrap shrink-0 ${
                    isActive
                      ? 'bg-emerald-500/25 border border-emerald-400/80 text-emerald-300 font-semibold ring-2 ring-emerald-400/20 shadow-xs'
                      : 'bg-slate-800/80 text-slate-400 border border-slate-700/50'
                  }`}
                >
                  <span className={isActive ? 'text-emerald-400' : 'text-slate-500'}>
                    {step.icon}
                  </span>
                  <span>{step.label}</span>
                </div>
                {idx < steps.length - 1 && (
                  <ChevronRight className="w-3 h-3 text-slate-600 shrink-0" />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
};
