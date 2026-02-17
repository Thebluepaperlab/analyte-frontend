"use client";
import React, { useState } from 'react';
import { 
  ShieldCheck, AlertTriangle, Scan, Activity, 
  Upload, Globe, Zap, Database, Cpu, Crosshair 
} from 'lucide-react';

export default function AnalyteCommandCentre() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [logs, setLogs] = useState(["SYSTEM_READY", "WAITING_FOR_UPLINK..."]);

  const addLog = (msg) => {
    setLogs(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev].slice(0, 5));
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setPreview(URL.createObjectURL(file));
    setLoading(true);
    addLog("INITIATING MOLECULAR SCAN...");
    addLog("UPLOADING DATA TO RENDER_CLOUD...");

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('https://analyte-mvp.onrender.com/analyze', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      setResult(data);
      addLog("DECODING FLUORESCENCE_SIGNATURE...");
      addLog("ANALYSIS_COMPLETE.");
    } catch (error) {
      addLog("ERROR: UPLINK_TIMEOUT");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#02040a] text-cyan-50 font-mono selection:bg-cyan-500/30 overflow-hidden relative">
      {/* SCANLINE EFFECT */}
      <div className="fixed inset-0 pointer-events-none z-50 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] bg-[length:100%_2px,3px_100%]"></div>

      {/* HEADER */}
      <header className="h-16 border-b border-cyan-900/50 bg-black/50 backdrop-blur-md flex items-center justify-between px-6 relative z-10">
        <div className="flex items-center gap-4">
          <Zap className="text-cyan-500 animate-pulse" size={24} />
          <div>
            <h1 className="text-xl font-black tracking-[0.2em] uppercase italic">Analyte <span className="text-cyan-500">v1.0</span></h1>
            <p className="text-[10px] text-cyan-700 tracking-widest">BLUE PAPER LABS // WATER_SURVEILLANCE</p>
          </div>
        </div>
        <div className="flex gap-8 text-[10px]">
          <div className="text-right">
            <p className="text-cyan-800 uppercase">Uplink Status</p>
            <p className="text-cyan-400 font-bold">CONNECTED_TO_API</p>
          </div>
        </div>
      </header>

      <main className="p-6 grid grid-cols-12 gap-6 h-[calc(100vh-64px)] relative z-10">
        {/* LEFT COLUMN: INDIA MAP */}
        <div className="col-span-12 lg:col-span-7 flex flex-col gap-6">
          <div className="flex-1 bg-black/40 border border-cyan-900/30 rounded-lg relative overflow-hidden">
            <div className="absolute top-6 left-6 z-20 bg-black/60 p-4 border border-cyan-500/20 rounded">
              <h2 className="text-xs font-bold text-cyan-500 flex items-center gap-2 mb-2 italic">
                <Globe size={14} className="animate-spin" style={{animationDuration: '10s'}} /> GEOSPATIAL_INTEL: INDIA_DOMAIN
              </h2>
              <div className="space-y-1 text-[10px]">
                 <p className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span> DELHI: LEAD_DETECTED</p>
                 <p className="flex items-center gap-2 text-gray-500"><span className="w-2 h-2 rounded-full bg-green-500"></span> MUMBAI: SAFE</p>
              </div>
            </div>
            
            {/* MOCK MAP SVG */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-30">
              <svg viewBox="0 0 400 500" className="w-[80%] h-[80%]">
                <path d="M150 50 L250 100 L300 300 L250 450 L100 400 L50 200 Z" fill="none" stroke="#0891b2" strokeWidth="2" strokeDasharray="5 5" />
              </svg>
            </div>
          </div>

          <div className="h-24 bg-black border border-cyan-900/30 rounded p-3">
            <p className="text-[9px] text-cyan-800 mb-1 uppercase tracking-widest">System_Kernel_Logs</p>
            <div className="text-[9px] font-mono text-cyan-400">
              {logs.map((log, i) => <p key={i} className={i === 0 ? "opacity-100" : "opacity-40"}>{log}</p>)}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: SCANNER */}
        <div className="col-span-12 lg:col-span-5 flex flex-col gap-6">
          <div className="flex-1 bg-gradient-to-b from-[#0B1120] to-black border border-cyan-500/20 rounded-lg p-6 flex flex-col items-center justify-center text-center">
            
            {!result && !loading && (
              <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer group">
                <Scan size={64} className="text-cyan-900 group-hover:text-cyan-500 transition-all mb-4" />
                <p className="text-xs font-bold tracking-[0.3em] uppercase">Initialize_Spectral_Scan</p>
                <input type="file" className="hidden" onChange={handleFileUpload} />
              </label>
            )}

            {loading && (
              <div className="space-y-4">
                <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="text-xs animate-pulse tracking-widest">ANALYZING_MOLECULAR_DATA...</p>
              </div>
            )}

            {result && !loading && (
              <div className="w-full space-y-6 animate-in zoom-in duration-300">
                <p className="text-[10px] text-cyan-700 uppercase tracking-[0.5em]">Tox_Report_v1</p>
                <h3 className={`text-5xl font-black ${result.lead_detected ? 'text-red-500' : 'text-cyan-400'}`}>
                  {result.status}
                </h3>
                <div className="bg-black/50 p-4 border border-cyan-900/30 rounded">
                  <p className="text-[10px] mb-2 uppercase text-gray-500">Fluorescence Density</p>
                  <p className="text-2xl font-bold">{result.fluorescence_pct}%</p>
                </div>
                <button onClick={() => {setResult(null); setPreview(null);}} className="text-[10px] text-cyan-600 hover:text-cyan-400 underline uppercase tracking-widest">Reset Scan</button>
              </div>
            )}
          </div>

          <div className="bg-cyan-950/20 border border-cyan-900/30 p-4 rounded flex items-center gap-4">
            <Cpu size={24} className="text-cyan-800" />
            <p className="text-[9px] text-cyan-700 leading-tight italic uppercase">
              Analyte v1.0 utilizing cloud-inference for lead-isotope detection. Global water surveillance enabled.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
