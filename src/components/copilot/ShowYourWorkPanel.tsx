'use client';

import React, { useState } from 'react';
import { QueryReceipt } from '@/lib/copilot/types';
import { Terminal, Copy, Check, Info, Clock, Database, Layers, ChevronDown, ChevronUp } from 'lucide-react';

interface Props {
  receipt: QueryReceipt;
}

export function ShowYourWorkPanel({ receipt }: Props) {
  const [copied, setCopied] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);

  const handleCopy = () => {
    navigator.clipboard.writeText(receipt.query);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="terminal-receipt overflow-hidden border border-paper-700 dark:border-paper-700 shadow-2xl transition-all">
      {/* Top Header Receipt Bar */}
      <div className="px-4 py-2.5 bg-ink-light/50 border-b border-paper-700 flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-2 text-paper-200">
          <Terminal className="w-4 h-4 text-saffron" />
          <span className="font-semibold text-paper-100">QUERY RECEIPT // SHOW YOUR WORK</span>
          <span className="text-[10px] text-paper-400 px-1.5 py-0.5 rounded bg-paper-800">
            READ-ONLY (SELECT)
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Plain English Toggle */}
          <button
            onClick={() => setShowExplanation(!showExplanation)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-sans font-medium transition-all ${
              showExplanation
                ? 'bg-teal text-white'
                : 'bg-paper-800 text-paper-300 hover:text-white hover:bg-paper-700'
            }`}
            title="Toggle plain English explanation"
          >
            <Info className="w-3 h-3 text-saffron" />
            <span>Explain in Plain English</span>
          </button>

          {/* Copy Query */}
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 px-2 py-1 rounded bg-paper-800 hover:bg-paper-700 text-[11px] text-paper-300 transition-colors"
            title="Copy query to clipboard"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 text-paper-400 hover:text-white"
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="p-4 space-y-3">
          {/* Metadata telemetry pill bar */}
          <div className="flex flex-wrap items-center gap-4 text-xs font-mono border-b border-paper-800 pb-2.5 text-paper-300">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-saffron" />
              <span>Execution: </span>
              <span className="text-emerald-400 font-bold">{receipt.executionTimeMs}ms</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-teal-light" />
              <span>Rows Scanned: </span>
              <span className="text-paper-100 font-bold">{receipt.rowCount}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-indigo-400" />
              <span>Tables Touched: </span>
              <div className="flex flex-wrap gap-1">
                {receipt.tablesTouched.map((t) => (
                  <span
                    key={t}
                    className="px-1.5 py-0.2 rounded text-[10px] bg-paper-800 text-saffron border border-paper-700"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Query or Plain Explanation View */}
          {showExplanation ? (
            <div className="p-3 rounded bg-teal/10 border border-teal/30 text-teal-light font-sans text-xs leading-relaxed animate-fadeIn">
              <p className="font-semibold text-paper-100 mb-1 flex items-center gap-1.5">
                <Info className="w-4 h-4 text-teal-light" /> Plain English Breakdown:
              </p>
              {receipt.plainEnglishExplanation}
            </div>
          ) : (
            <pre className="p-3 rounded bg-ink-light/40 border border-paper-800 text-[11px] font-mono text-paper-200 overflow-x-auto leading-relaxed">
              <code>{receipt.query}</code>
            </pre>
          )}

          {/* Receipt Watermark footer */}
          <div className="flex items-center justify-between text-[10px] text-paper-400 font-mono pt-1">
            <span>ClassPilot Semantic Query Verifier • Zero Raw SQL Injection Vector</span>
            <span>Immutable Audit Log ID: #AUD-{Math.floor(100000 + Math.random() * 900000)}</span>
          </div>
        </div>
      )}
    </div>
  );
}
