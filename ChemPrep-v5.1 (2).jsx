import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { 
  Activity, AlertCircle, AlertTriangle, Archive, ArrowRight,
  BarChart2, BarChart3, Bell, Book, Box,
  Building2, Calculator, Calendar, Camera, Check,
  CheckCircle, CheckCircle2, ChevronDown, ChevronLeft, ChevronRight,
  Circle, Clock, Database, DollarSign, Download,
  Edit2, FileOutput, FileSpreadsheet, FileText, Filter,
  FolderOpen, GitBranch, GripVertical, History, Layers,
  LayoutDashboard, Link2, Loader, Menu, Monitor,
  Package, Percent, Play, Plus, Printer,
  QrCode, RefreshCw, Save, ScanLine, Search,
  Settings, Share2, Square, Table, Tag,
  Trash2, TrendingUp, Triangle, Upload, User,
  Users, Wrench, X, Zap,
} from 'lucide-react';

// ================================================
// ChemPrep v4.8.0 - FASE 1: STATUS WORKFLOW, VALIDATIE & STAPPEN! - 2025-02-15
// ================================================
console.log('%c âœ… ChemPrep v4.7.0 - NUMMER EDITING & FASES! ', 'background: #10b981; color: white; font-size: 20px; padding: 8px; font-weight: bold;');
console.log('');
console.log('%c ðŸŽ¯ NIEUWE FEATURES v4.7.0: ', 'background: #ec4899; color: white; font-weight: bold; padding: 4px;');
console.log('âœ… EDITABLE ACTIVITY ID NUMMER:');
console.log('   ðŸ“‹ Prefix = read-only (A, B, C, ...)');
console.log('   âœï¸  Nummer = BEWERKBAAR! (010, 020, 030, ...)');
console.log('   ðŸš€ Wijzig nummer â†’ Activiteit verspringt automatisch!');
console.log('   ðŸ’¡ Voorbeeld: A020 â†’ A015 â†’ Direct gesorteerd!');
console.log('');
console.log('âœ… FASE GROUPING IN TABEL:');
console.log('   ðŸ“Š Activiteiten gegroepeerd per fase');
console.log('   ðŸŽ¨ Fase headers met visual styling');
console.log('   ðŸ”¢ Counter per fase (bijv. "TA (5 activiteiten)")');
console.log('   ðŸŽ¯ Volgorde: PRE-TA â†’ UITBEDRIJF â†’ TA â†’ INBEDRIJF â†’ POST-TA');
console.log('');
console.log('âœ… CROSS-FASE DRAG & DROP:');
console.log('   ðŸ–±ï¸  Sleep activiteit naar andere fase');
console.log('   ðŸ”„ Fase wijzigt AUTOMATISCH!');
console.log('   ðŸ“ Activiteit sorteert binnen nieuwe fase op nummer');
console.log('   ðŸŽŠ Toast: "Verplaatst naar fase X"');
console.log('');
console.log('%c ðŸŽ¨ FASE VOLGORDE (ALTIJD VAST): ', 'background: #3b82f6; color: white; font-weight: bold; padding: 4px;');
console.log('1ï¸âƒ£  PRE-TA      (paars)');
console.log('2ï¸âƒ£  UITBEDRIJF  (oranje)');
console.log('3ï¸âƒ£  TA          (blauw)');
console.log('4ï¸âƒ£  INBEDRIJF   (groen)');
console.log('5ï¸âƒ£  POST-TA     (grijs)');
console.log('â†’ Fases NOOIT door elkaar!');
console.log('');
console.log('%c ðŸ“‹ SORTERING LOGICA: ', 'background: #f59e0b; color: white; font-weight: bold; padding: 4px;');
console.log('Eerst: Sorteer op fase (volgorde hierboven)');
console.log('Dan: Sorteer op Activity ID nummer binnen fase');
console.log('');
console.log('Voorbeeld TA fase:');
console.log('  A010, A020, A030, A040');
console.log('Voorbeeld INBEDRIJF fase:');
console.log('  A050, A060, A070');
console.log('');
console.log('%c ðŸ’¡ USE CASES: ', 'background: #8b5cf6; color: white; font-weight: bold; padding: 4px;');
console.log('USE CASE 1: Nummer Wijzigen');
console.log('  â†’ Open activity editor');
console.log('  â†’ Wijzig nummer: 020 â†’ 015');
console.log('  â†’ Save â†’ Activiteit verspringt! âœ¨');
console.log('');
console.log('USE CASE 2: Fase Wijzigen');
console.log('  â†’ Sleep activiteit naar andere fase sectie');
console.log('  â†’ Drop â†’ Fase wijzigt automatisch! âœ¨');
console.log('  â†’ Sorteert op nummer binnen nieuwe fase');
console.log('');
// ================================================

// ===== FASE 1: STATUS WORKFLOW SYSTEM =====
const STATUS_OPTIONS = {
  GEEN: { label: 'Geen', color: 'bg-gray-100 text-gray-700', icon: Clock },
  IN_VOORBEREIDING: { label: 'In voorbereiding', color: 'bg-blue-100 text-blue-700', icon: Clock },
  GEREED: { label: 'Gereed', color: 'bg-green-100 text-green-700', icon: CheckCircle2 },
  AKKOORD: { label: 'Akkoord', color: 'bg-emerald-100 text-emerald-700', icon: CheckCircle2 },
  NIET_VAN_TOEPASSING: { label: 'N.v.t.', color: 'bg-gray-50 text-gray-500', icon: X }
};

// Compact horizontal status badge for werkpakket header
const StatusMeetpuntCompact = ({ title, icon: Icon, status, onStatusChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const config = STATUS_OPTIONS[status] || STATUS_OPTIONS.GEEN;
  const StatusIcon = config.icon;
  
  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex flex-col items-center gap-1 px-3 py-2 hover:bg-gray-50 rounded-lg transition-colors"
      >
        <div className="flex items-center gap-1.5">
          <Icon className="w-4 h-4 text-gray-500" />
          <span className="text-xs font-medium text-gray-700">{title}</span>
        </div>
        <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
          <StatusIcon className="w-3 h-3" />
          <span>{config.label}</span>
        </div>
      </button>
      
      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute top-full mt-1 left-0 bg-white border border-gray-200 rounded-lg shadow-lg z-20 min-w-[180px]">
            {Object.entries(STATUS_OPTIONS).map(([key, cfg]) => (
              <button
                key={key}
                onClick={() => {
                  onStatusChange(key);
                  setIsOpen(false);
                }}
                className={`w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 ${
                  status === key ? 'bg-blue-50 font-medium' : ''
                }`}
              >
                <cfg.icon className="w-3.5 h-3.5" />
                {cfg.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

// Status overview cell for Scope Manager table
const StatusOverviewCell = ({ statusMeetpoints }) => {
  if (!statusMeetpoints) return null;
  
  const statusCounts = Object.values(statusMeetpoints).reduce((acc, status) => {
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});
  
  const total = Object.keys(statusMeetpoints).length;
  const akkoord = statusCounts['AKKOORD'] || 0;
  const gereed = statusCounts['GEREED'] || 0;
  const inProgress = statusCounts['IN_VOORBEREIDING'] || 0;
  
  // Determine overall status color
  let bgColor = 'bg-gray-100';
  let textColor = 'text-gray-700';
  if (akkoord === total) {
    bgColor = 'bg-emerald-100';
    textColor = 'text-emerald-700';
  } else if (akkoord + gereed === total) {
    bgColor = 'bg-green-100';
    textColor = 'text-green-700';
  } else if (inProgress > 0) {
    bgColor = 'bg-blue-100';
    textColor = 'text-blue-700';
  }
  
  return (
    <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium ${bgColor} ${textColor}`}>
      <CheckCircle2 className="w-3 h-3" />
      <span>{akkoord + gereed}/{total}</span>
    </div>
  );
};

// ===== FASE 1: PLANNING VALIDATIE =====
const validatePlanning = (scopeItem) => {
  const issues = [];
  const warnings = [];
  
  if (!scopeItem.plannedActivities || scopeItem.plannedActivities.length === 0) {
    issues.push({ 
      type: 'error', 
      message: 'Geen activiteiten gepland', 
      field: 'activities' 
    });
  } else {
    scopeItem.plannedActivities.forEach((activity) => {
      // Check resources
      if (!activity.resources || activity.resources.length === 0) {
        issues.push({ 
          type: 'error', 
          message: `Activiteit ${activity.activityId}: Geen resources toegewezen`,
          field: 'resources',
          activityId: activity.id
        });
      }
      
      // Check duration
      if (!activity.duration || activity.duration <= 0) {
        issues.push({
          type: 'error',
          message: `Activiteit ${activity.activityId}: Geen geldige doorlooptijd`,
          field: 'duration',
          activityId: activity.id
        });
      }
      
      // Check phase
      if (!activity.phase) {
        issues.push({
          type: 'error',
          message: `Activiteit ${activity.activityId}: Geen fase toegewezen`,
          field: 'phase',
          activityId: activity.id
        });
      }
      
      // Warning: no description
      if (!activity.overrideDescription || activity.overrideDescription.trim() === '') {
        warnings.push({
          type: 'warning',
          message: `Activiteit ${activity.activityId}: Geen beschrijving`,
          field: 'description',
          activityId: activity.id
        });
      }
      
      // Warning: no steps for long activities
      if (activity.duration > 8 && (!activity.steps || activity.steps.length === 0)) {
        warnings.push({
          type: 'warning',
          message: `Activiteit ${activity.activityId}: Lange activiteit zonder stappen (${activity.duration}h)`,
          field: 'steps',
          activityId: activity.id
        });
      }
    });
  }
  
  return {
    isValid: issues.filter(i => i.type === 'error').length === 0,
    errorCount: issues.filter(i => i.type === 'error').length,
    warningCount: warnings.length,
    issues: [...issues, ...warnings]
  };
};

const ValidationReport = ({ result, onClose }) => {
  if (!result) return null;
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col">
        <div className={`p-4 ${result.isValid ? 'bg-green-50' : 'bg-red-50'} border-b`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {result.isValid ? (
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              ) : (
                <AlertCircle className="w-6 h-6 text-red-600" />
              )}
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  {result.isValid ? 'Planning Validatie Geslaagd!' : 'Planning Validatie Mislukt'}
                </h2>
                <p className="text-sm text-gray-600">
                  {result.errorCount} errors · {result.warningCount} warnings
                </p>
              </div>
            </div>
            <button onClick={onClose} className="p-1 hover:bg-black/5 rounded">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {result.issues.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-2" />
              <p>Alle checks geslaagd!</p>
            </div>
          ) : (
            result.issues.map((issue, idx) => (
              <div
                key={idx}
                className={`p-3 rounded border-l-4 ${
                  issue.type === 'error' 
                    ? 'bg-red-50 border-red-500' 
                    : 'bg-yellow-50 border-yellow-500'
                }`}
              >
                <div className="flex items-start gap-2">
                  {issue.type === 'error' ? (
                    <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{issue.message}</p>
                    <p className="text-xs text-gray-600 mt-1">Field: {issue.field}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

// ===== FASE 1: ACTIVITY STEPS =====
const ActivityStepsEditor = ({ steps = [], onChange }) => {
  const [isExpanded, setIsExpanded] = useState(steps.length > 0);
  const [editingStep, setEditingStep] = useState(null);
  
  const addStep = () => {
    const newStep = {
      id: `step-${Date.now()}`,
      sequence: steps.length > 0 ? Math.max(...steps.map(s => s.sequence)) + 10 : 10,
      description: '',
      notes: ''
    };
    onChange([...steps, newStep]);
    setEditingStep(newStep.id);
  };
  
  const updateStep = (stepId, field, value) => {
    onChange(steps.map(step => 
      step.id === stepId ? { ...step, [field]: value } : step
    ));
  };
  
  const deleteStep = (stepId) => {
    onChange(steps.filter(step => step.id !== stepId));
  };
  
  const moveStep = (stepId, direction) => {
    const index = steps.findIndex(s => s.id === stepId);
    if (index === -1) return;
    
    const newSteps = [...steps];
    if (direction === 'up' && index > 0) {
      [newSteps[index], newSteps[index - 1]] = [newSteps[index - 1], newSteps[index]];
    } else if (direction === 'down' && index < steps.length - 1) {
      [newSteps[index], newSteps[index + 1]] = [newSteps[index + 1], newSteps[index]];
    }
    
    // Renumber sequences
    newSteps.forEach((step, idx) => {
      step.sequence = (idx + 1) * 10;
    });
    
    onChange(newSteps);
  };
  
  return (
    <div className="border border-gray-200 rounded-lg mt-3">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-2">
          {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          <span className="font-medium text-sm">Activity Steps</span>
          <span className="text-xs text-gray-500">({steps.length})</span>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            addStep();
            setIsExpanded(true);
          }}
          className="px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 flex items-center gap-1"
        >
          <Plus className="w-3 h-3" />
          Add
        </button>
      </button>
      
      {isExpanded && (
        <div className="p-3 pt-0 space-y-2">
          {steps.length === 0 ? (
            <div className="text-center py-6 text-gray-500">
              <FileText className="w-10 h-10 mx-auto mb-2 opacity-30" />
              <p className="text-sm">Geen stappen gedefinieerd</p>
              <button
                onClick={addStep}
                className="mt-2 text-blue-600 hover:underline text-xs"
              >
                + Eerste stap toevoegen
              </button>
            </div>
          ) : (
            steps.map((step, idx) => (
              <div key={step.id} className="flex items-start gap-2 p-2 border border-gray-200 rounded bg-gray-50">
                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => moveStep(step.id, 'up')}
                    disabled={idx === 0}
                    className="p-0.5 hover:bg-gray-200 rounded disabled:opacity-30"
                  >
                    <ChevronDown className="w-3 h-3 rotate-180" />
                  </button>
                  <GripVertical className="w-3 h-3 text-gray-400" />
                  <button
                    onClick={() => moveStep(step.id, 'down')}
                    disabled={idx === steps.length - 1}
                    className="p-0.5 hover:bg-gray-200 rounded disabled:opacity-30"
                  >
                    <ChevronDown className="w-3 h-3" />
                  </button>
                </div>
                
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-gray-700 w-12">
                      Stap {idx + 1}
                    </span>
                    <input
                      type="text"
                      value={step.description}
                      onChange={(e) => updateStep(step.id, 'description', e.target.value)}
                      placeholder="Beschrijving..."
                      className="flex-1 px-2 py-1 border border-gray-300 rounded text-xs"
                    />
                  </div>
                  
                  {editingStep === step.id && (
                    <textarea
                      value={step.notes}
                      onChange={(e) => updateStep(step.id, 'notes', e.target.value)}
                      placeholder="Notities (optioneel)..."
                      className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
                      rows={2}
                    />
                  )}
                </div>
                
                <div className="flex gap-0.5">
                  <button
                    onClick={() => setEditingStep(editingStep === step.id ? null : step.id)}
                    className="p-1 hover:bg-gray-200 rounded text-blue-600"
                    title="Edit notes"
                  >
                    <FileText className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => deleteStep(step.id)}
                    className="p-1 hover:bg-red-100 rounded text-red-600"
                    title="Delete"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};



// ===== FASE 3: TRA CONSTANTS =====
const TRA_HAZARD_CATEGORIES = [
  { id: 'electrical', label: 'Elektrisch', icon: 'zap', color: '#f59e0b' },
  { id: 'mechanical', label: 'Mechanisch', icon: 'tool', color: '#6366f1' },
  { id: 'chemical', label: 'Chemisch/ATEX', icon: 'flask', color: '#ef4444' },
  { id: 'height', label: 'Werken op hoogte', icon: 'arrow-up', color: '#f97316' },
  { id: 'confined', label: 'Besloten ruimte', icon: 'box', color: '#8b5cf6' },
  { id: 'pressure', label: 'Druk/temperatuur', icon: 'thermometer', color: '#0ea5e9' },
  { id: 'radiation', label: 'Straling', icon: 'radio', color: '#22c55e' },
  { id: 'ergonomic', label: 'Ergonomisch', icon: 'user', color: '#64748b' },
  { id: 'fire', label: 'Brand/explosie', icon: 'flame', color: '#dc2626' },
  { id: 'other', label: 'Overig', icon: 'alert-triangle', color: '#94a3b8' },
];

const TRA_PROBABILITY = [
  { value: 1, label: 'Zeer onwaarschijnlijk', short: 'ZO' },
  { value: 2, label: 'Onwaarschijnlijk', short: 'O' },
  { value: 3, label: 'Mogelijk', short: 'M' },
  { value: 4, label: 'Waarschijnlijk', short: 'W' },
  { value: 5, label: 'Zeer waarschijnlijk', short: 'ZW' },
];

const TRA_SEVERITY = [
  { value: 1, label: 'Verwaarloosbaar', short: 'VW' },
  { value: 2, label: 'Gering letsel', short: 'GL' },
  { value: 3, label: 'Ernstig letsel', short: 'EL' },
  { value: 4, label: 'Blijvend letsel', short: 'BL' },
  { value: 5, label: 'Fataal', short: 'F' },
];

const TRA_REQUIRED_PERMITS = [
  { id: 'werkvergunning', label: 'Werkvergunning' },
  { id: 'hot_work', label: 'Hete werkzaamheden' },
  { id: 'confined_space', label: 'Besloten ruimte' },
  { id: 'electrical_isolation', label: 'Elektrische isolatie' },
  { id: 'radiation', label: 'Stralingsbescherming' },
  { id: 'excavation', label: 'Graafwerkzaamheden' },
  { id: 'lifting', label: 'Hijswerk' },
  { id: 'radiography', label: 'Radiografie' },
];

const TRA_PPE = [
  { id: 'helmet', label: 'Helm' },
  { id: 'safety_glasses', label: 'Veiligheidsbril' },
  { id: 'hearing', label: 'Gehoorbescherming' },
  { id: 'gloves', label: 'Handschoenen' },
  { id: 'safety_shoes', label: 'Veiligheidsschoenen' },
  { id: 'coverall', label: 'Veiligheidspak' },
  { id: 'harness', label: 'Valbescherming' },
  { id: 'gasmask', label: 'Gasmasker' },
  { id: 'airfed', label: 'Persluchtmasker' },
  { id: 'face_shield', label: 'Gezichtsscherm' },
];

const getTraRiskLevel = (probability, severity) => {
  const score = probability * severity;
  if (score >= 15) return { level: 'KRITIEK', color: '#dc2626', bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-300' };
  if (score >= 8) return { level: 'HOOG', color: '#f97316', bg: 'bg-orange-100', text: 'text-orange-800', border: 'border-orange-300' };
  if (score >= 4) return { level: 'MEDIUM', color: '#f59e0b', bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-300' };
  return { level: 'LAAG', color: '#22c55e', bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-300' };
};

// ===== FASE 2: NORM TABLES =====
const NORM_TABLES = [
  { id: 'flange-open', name: 'Flens openen', category: 'Mechanical', unit: 'stuks', rate: 0.5 },
  { id: 'flange-close', name: 'Flens sluiten', category: 'Mechanical', unit: 'stuks', rate: 0.75 },
  { id: 'gasket-replace', name: 'Pakking vervangen', category: 'Mechanical', unit: 'stuks', rate: 0.25 },
  { id: 'valve-inspect', name: 'Klep inspecteren', category: 'Mechanical', unit: 'stuks', rate: 2.0 },
  { id: 'pump-dismantle', name: 'Pomp demonteren', category: 'Mechanical', unit: 'stuks', rate: 8.0 },
  { id: 'pump-assemble', name: 'Pomp monteren', category: 'Mechanical', unit: 'stuks', rate: 10.0 },
  { id: 'pipe-weld', name: 'Leiding lassen', category: 'Piping', unit: 'meters', rate: 2.5 },
  { id: 'pipe-cut', name: 'Leiding snijden', category: 'Piping', unit: 'stuks', rate: 1.0 },
  { id: 'blind-install', name: 'Steekschijf plaatsen', category: 'Piping', unit: 'stuks', rate: 0.75 },
  { id: 'motor-disconnect', name: 'Motor afkoppelen', category: 'Electrical', unit: 'stuks', rate: 1.5 },
  { id: 'motor-connect', name: 'Motor aankoppelen', category: 'Electrical', unit: 'stuks', rate: 2.0 },
  { id: 'cable-pull', name: 'Kabel trekken', category: 'Electrical', unit: 'meters', rate: 0.3 },
  { id: 'sensor-calibrate', name: 'Sensor kalibreren', category: 'Instrumentation', unit: 'stuks', rate: 1.0 },
  { id: 'valve-calibrate', name: 'Regelklep kalibreren', category: 'Instrumentation', unit: 'stuks', rate: 1.5 },
  { id: 'scaffold-m3', name: 'Steiger (volume)', category: 'Scaffold', unit: 'm3', rate: 0.5 },
  { id: 'scaffold-m2', name: 'Steiger (oppervlak)', category: 'Scaffold', unit: 'm2', rate: 0.3 },
];

const CORRECTION_FACTORS = {
  taskSpecific: {
    heightWork: { label: 'Werk op hoogte', percentage: 15 },
    hydraulicTools: { label: 'Hydraulisch gereedschap', percentage: -20 },
    confinedSpace: { label: 'Besloten ruimte', percentage: 25 },
    hotWork: { label: 'Hete werkzaamheden', percentage: 10 },
  },
  general: {
    airMask: { label: 'Luchtmasker', percentage: 10 },
    protectiveGear: { label: 'Beschermende kleding', percentage: 5 },
    nightShift: { label: 'Nachtdienst', percentage: 15 },
    coldWeather: { label: 'Koud weer', percentage: 10 },
  }
};

const calculateNormUnits = (calculation) => {
  if (!calculation || !calculation.enabled) return 0;
  const { aantal = 0, handeling = 0, afmeting = 1, corrections = {} } = calculation;
  let units = aantal * handeling * afmeting;
  if (corrections.taskSpecific) {
    Object.entries(corrections.taskSpecific).forEach(([key, enabled]) => {
      if (enabled && CORRECTION_FACTORS.taskSpecific[key]) {
        units *= (1 + CORRECTION_FACTORS.taskSpecific[key].percentage / 100);
      }
    });
  }
  if (corrections.general) {
    Object.entries(corrections.general).forEach(([key, enabled]) => {
      if (enabled && CORRECTION_FACTORS.general[key]) {
        units *= (1 + CORRECTION_FACTORS.general[key].percentage / 100);
      }
    });
  }
  return Math.round(units * 100) / 100;
};

const calculateCostRuleTotal = (rule) => {
  const base = (rule.aantal || 0) * (rule.tarief || 0);
  const withFixed = base + (rule.vastePrijs || 0);
  return Math.round(withFixed * (1 + (rule.toeslag || 0) / 100) * 100) / 100;
};

const generateCostRules = (scopeItem, resources, materials) => {
  const resourceMap = new Map();
  const materialMap = new Map();
  (scopeItem.plannedActivities || []).forEach(activity => {
    (activity.resources || []).forEach(res => {
      const key = res.resourceId;
      if (!resourceMap.has(key)) resourceMap.set(key, { totalUnits: 0 });
      resourceMap.get(key).totalUnits += res.units || 0;
    });
    (activity.materials || []).forEach(mat => {
      const key = mat.materialId;
      if (!materialMap.has(key)) materialMap.set(key, { totalQuantity: 0 });
      materialMap.get(key).totalQuantity += mat.quantity || 0;
    });
  });
  const costRules = [];
  resourceMap.forEach((data, resourceId) => {
    const resource = resources.find(r => r.id === resourceId);
    if (resource) {
      const rule = {
        id: `cost-res-${resourceId}`,
        type: 'resource',
        description: resource.name,
        aantal: data.totalUnits,
        eenheid: 'uur',
        tarief: resource.defaultRate || 75,
        vastePrijs: 0,
        toeslag: 0,
        totaal: 0,
        category: 'Labor',
        isAutoGenerated: true
      };
      rule.totaal = calculateCostRuleTotal(rule);
      costRules.push(rule);
    }
  });
  materialMap.forEach((data, materialId) => {
    const material = materials.find(m => m.id === materialId);
    if (material) {
      const rule = {
        id: `cost-mat-${materialId}`,
        type: 'material',
        description: material.description || material.materialCode || 'Materiaal',
        aantal: data.totalQuantity,
        eenheid: material.unit || 'stuks',
        tarief: material.unitPrice || 0,
        vastePrijs: 0,
        toeslag: 0,
        totaal: 0,
        category: 'Materials',
        isAutoGenerated: true
      };
      rule.totaal = calculateCostRuleTotal(rule);
      costRules.push(rule);
    }
  });
  return costRules;
};

const calculateTotalCost = (scopeItem) => {
  const rules = scopeItem.costRules || [];
  const subtotal = rules.reduce((s, r) => s + (r.totaal || 0), 0);
  const contingencyPct = scopeItem.contingency?.percentage || 0;
  const contingencyAmount = subtotal * (contingencyPct / 100);
  return {
    subtotal: Math.round(subtotal * 100) / 100,
    contingencyAmount: Math.round(contingencyAmount * 100) / 100,
    total: Math.round((subtotal + contingencyAmount) * 100) / 100
  };
};

const getCostBreakdown = (costRules) => {
  const breakdown = {};
  costRules.forEach(rule => {
    const cat = rule.category || 'Other';
    breakdown[cat] = (breakdown[cat] || 0) + (rule.totaal || 0);
  });
  const total = Object.values(breakdown).reduce((s, v) => s + v, 0);
  return Object.entries(breakdown)
    .map(([category, amount]) => ({
      category,
      amount: Math.round(amount * 100) / 100,
      percentage: total > 0 ? Math.round((amount / total) * 100) : 0
    }))
    .sort((a, b) => b.amount - a.amount);
};

// ===== FASE 2: FULL CALCULATION EDITOR =====
const CalculationEditor = ({ calculation, onChange }) => {
  const calc = calculation || {
    enabled: false,
    normTableId: '',
    aantal: 1,
    handeling: 0,
    eenheid: 'stuks',
    afmeting: 1.0,
    corrections: { taskSpecific: {}, general: {} }
  };

  const selectedNorm = NORM_TABLES.find(n => n.id === calc.normTableId);
  const calculatedUnits = calculateNormUnits(calc);

  const update = (updates) => onChange({ ...calc, ...updates });

  const selectNorm = (normId) => {
    const norm = NORM_TABLES.find(n => n.id === normId);
    if (norm) update({ normTableId: normId, handeling: norm.rate, eenheid: norm.unit });
  };

  const toggleTaskCorr = (key, val) => update({
    corrections: { ...calc.corrections, taskSpecific: { ...calc.corrections.taskSpecific, [key]: val } }
  });

  const toggleGenCorr = (key, val) => update({
    corrections: { ...calc.corrections, general: { ...calc.corrections.general, [key]: val } }
  });

  const categories = [...new Set(NORM_TABLES.map(n => n.category))];

  return (
    <div className="border border-slate-200 rounded-lg overflow-hidden">
      <div className="flex items-center justify-between p-4 bg-slate-50 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <Calculator className="w-5 h-5 text-blue-600" />
          <div>
            <h3 className="font-semibold text-slate-900">Norm-based Calculaties</h3>
            {calc.enabled && calculatedUnits > 0 && (
              <p className="text-sm text-blue-600 font-medium">Resultaat: {calculatedUnits} {calc.eenheid}</p>
            )}
          </div>
        </div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={calc.enabled}
            onChange={(e) => update({ enabled: e.target.checked })}
            className="w-4 h-4 rounded"
          />
          <span className="text-sm font-medium">Inschakelen</span>
        </label>
      </div>

      {calc.enabled && (
        <div className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Norm Table</label>
            <select
              value={calc.normTableId}
              onChange={(e) => selectNorm(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
            >
              <option value="">-- Selecteer een norm --</option>
              {categories.map(cat => (
                <optgroup key={cat} label={cat}>
                  {NORM_TABLES.filter(n => n.category === cat).map(norm => (
                    <option key={norm.id} value={norm.id}>
                      {norm.name} ({norm.rate} u/{norm.unit})
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Aantal</label>
              <input type="number" value={calc.aantal} min="0" step="0.5"
                onChange={(e) => update({ aantal: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Norm (u/{calc.eenheid})</label>
              <input type="number" value={calc.handeling} min="0" step="0.25"
                onChange={(e) => update({ handeling: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Afmeting factor</label>
              <input type="number" value={calc.afmeting} min="0.1" step="0.1"
                onChange={(e) => update({ afmeting: parseFloat(e.target.value) || 1 })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-semibold text-slate-700 mb-2">Taak-specifiek</h4>
              <div className="space-y-1">
                {Object.entries(CORRECTION_FACTORS.taskSpecific).map(([key, cfg]) => (
                  <label key={key} className="flex items-center gap-2 text-sm">
                    <input type="checkbox"
                      checked={calc.corrections?.taskSpecific?.[key] || false}
                      onChange={(e) => toggleTaskCorr(key, e.target.checked)}
                      className="w-4 h-4" />
                    <span>{cfg.label} ({cfg.percentage > 0 ? '+' : ''}{cfg.percentage}%)</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-700 mb-2">Algemeen</h4>
              <div className="space-y-1">
                {Object.entries(CORRECTION_FACTORS.general).map(([key, cfg]) => (
                  <label key={key} className="flex items-center gap-2 text-sm">
                    <input type="checkbox"
                      checked={calc.corrections?.general?.[key] || false}
                      onChange={(e) => toggleGenCorr(key, e.target.checked)}
                      className="w-4 h-4" />
                    <span>{cfg.label} (+{cfg.percentage}%)</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {calc.normTableId && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-blue-900">Berekend resultaat:</span>
                <span className="text-2xl font-bold text-blue-600">{calculatedUnits} {calc.eenheid}</span>
              </div>
              <p className="text-xs text-blue-700 mt-1">
                {calc.aantal} x {calc.handeling} x {calc.afmeting} x correcties = {calculatedUnits}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ===== FASE 2: COST RULES TABLE =====
const CostRulesTable = ({ costRules, onUpdate, onDelete, onAdd }) => {
  const [editingId, setEditingId] = useState(null);

  const updateRule = (id, field, value) => {
    const updated = costRules.map(rule => {
      if (rule.id === id) {
        const newRule = { ...rule, [field]: value };
        newRule.totaal = calculateCostRuleTotal(newRule);
        return newRule;
      }
      return rule;
    });
    onUpdate(updated);
  };

  const subtotal = costRules.reduce((s, r) => s + (r.totaal || 0), 0);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-slate-900">Cost Rules ({costRules.length})</h3>
          <p className="text-xs text-slate-500">Klik op een waarde om te bewerken</p>
        </div>
        <button onClick={onAdd}
          className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
          <Plus className="w-4 h-4" /> Manual item
        </button>
      </div>

      <div className="border border-slate-200 rounded-lg overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-3 py-2 text-left text-xs font-semibold text-slate-600 uppercase">Type</th>
              <th className="px-3 py-2 text-left text-xs font-semibold text-slate-600 uppercase">Omschrijving</th>
              <th className="px-3 py-2 text-right text-xs font-semibold text-slate-600 uppercase">Aantal</th>
              <th className="px-3 py-2 text-right text-xs font-semibold text-slate-600 uppercase">Tarief</th>
              <th className="px-3 py-2 text-right text-xs font-semibold text-slate-600 uppercase">Toeslag</th>
              <th className="px-3 py-2 text-right text-xs font-semibold text-slate-600 uppercase">Totaal</th>
              <th className="px-3 py-2"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {costRules.map(rule => (
              <tr key={rule.id} className="hover:bg-slate-50">
                <td className="px-3 py-2">
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                    rule.type === 'resource' ? 'bg-blue-100 text-blue-700' :
                    rule.type === 'material' ? 'bg-green-100 text-green-700' :
                    'bg-slate-100 text-slate-700'
                  }`}>{rule.type}</span>
                </td>
                <td className="px-3 py-2">
                  {editingId === rule.id && rule.type === 'manual' ? (
                    <input type="text" value={rule.description}
                      onChange={(e) => updateRule(rule.id, 'description', e.target.value)}
                      className="w-full px-2 py-1 border rounded" autoFocus />
                  ) : (
                    <span onClick={() => rule.type === 'manual' && setEditingId(rule.id)}
                      className={rule.type === 'manual' ? 'cursor-pointer hover:text-blue-600' : ''}>
                      {rule.description}
                    </span>
                  )}
                </td>
                <td className="px-3 py-2 text-right">
                  {editingId === rule.id ? (
                    <input type="number" value={rule.aantal} step="0.5"
                      onChange={(e) => updateRule(rule.id, 'aantal', parseFloat(e.target.value) || 0)}
                      className="w-20 px-2 py-1 border rounded text-right" />
                  ) : (
                    <span onClick={() => setEditingId(rule.id)} className="cursor-pointer hover:text-blue-600">
                      {rule.aantal} {rule.eenheid}
                    </span>
                  )}
                </td>
                <td className="px-3 py-2 text-right">
                  {editingId === rule.id ? (
                    <input type="number" value={rule.tarief} step="0.5"
                      onChange={(e) => updateRule(rule.id, 'tarief', parseFloat(e.target.value) || 0)}
                      className="w-24 px-2 py-1 border rounded text-right" />
                  ) : (
                    <span onClick={() => setEditingId(rule.id)} className="cursor-pointer hover:text-blue-600">
                      €{rule.tarief.toFixed(2)}
                    </span>
                  )}
                </td>
                <td className="px-3 py-2 text-right">
                  {editingId === rule.id ? (
                    <input type="number" value={rule.toeslag} step="1" min="0" max="100"
                      onChange={(e) => updateRule(rule.id, 'toeslag', parseFloat(e.target.value) || 0)}
                      className="w-16 px-2 py-1 border rounded text-right" />
                  ) : (
                    <span onClick={() => setEditingId(rule.id)} className="cursor-pointer hover:text-blue-600">
                      {rule.toeslag}%
                    </span>
                  )}
                </td>
                <td className="px-3 py-2 text-right font-semibold text-slate-900">
                  €{(rule.totaal || 0).toFixed(2)}
                </td>
                <td className="px-3 py-2">
                  <button onClick={() => onDelete(rule.id)}
                    className="p-1 hover:bg-red-100 rounded text-red-500">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-slate-50 border-t-2 border-slate-300">
            <tr>
              <td colSpan="5" className="px-3 py-2 text-right font-semibold text-slate-700">Subtotaal:</td>
              <td className="px-3 py-2 text-right font-bold text-slate-900">€{subtotal.toFixed(2)}</td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};


// ===== SIMPLE ERROR DISPLAY (FUNCTIONAL) =====
const ErrorDisplay = () => {
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const handleError = (event) => {
      console.error('ðŸš¨ ERROR CAUGHT:', event.error);
      setError({
        message: event.error?.toString() || 'Unknown error',
        stack: event.error?.stack || 'No stack trace'
      });
    };
    
    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);
  
  if (!error) return null;
  
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: '#fee',
      padding: '20px',
      overflow: 'auto',
      fontFamily: 'monospace',
      fontSize: '14px',
      zIndex: 99999
    }}>
      <div style={{ 
        backgroundColor: '#dc2626', 
        color: 'white', 
        padding: '16px', 
        borderRadius: '8px',
        marginBottom: '16px',
        fontWeight: 'bold',
        fontSize: '18px'
      }}>
        ðŸš¨ ERROR - ChemPrep Crashed
      </div>
      
      <div style={{
        backgroundColor: 'white',
        padding: '16px',
        borderRadius: '8px',
        marginBottom: '16px',
        border: '2px solid #dc2626'
      }}>
        <div style={{ fontWeight: 'bold', marginBottom: '8px', color: '#dc2626' }}>
          Error Message:
        </div>
        <div style={{ color: '#000', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
          {error.message}
        </div>
      </div>

      <div style={{
        backgroundColor: 'white',
        padding: '16px',
        borderRadius: '8px',
        marginBottom: '16px',
        border: '2px solid #dc2626'
      }}>
        <div style={{ fontWeight: 'bold', marginBottom: '8px', color: '#dc2626' }}>
          Stack Trace:
        </div>
        <div style={{ 
          color: '#000', 
          whiteSpace: 'pre-wrap', 
          wordBreak: 'break-word',
          fontSize: '12px'
        }}>
          {error.stack}
        </div>
      </div>

      <button 
        onClick={() => {
          localStorage.clear();
          window.location.reload();
        }}
        style={{
          width: '100%',
          padding: '16px',
          backgroundColor: '#dc2626',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          fontSize: '16px',
          fontWeight: 'bold',
          cursor: 'pointer'
        }}
      >
        ðŸ”„ Clear Storage & Reload
      </button>

      <div style={{
        marginTop: '16px',
        padding: '12px',
        backgroundColor: '#fef3c7',
        borderRadius: '8px',
        fontSize: '12px',
        color: '#92400e'
      }}>
        ðŸ’¡ Tip: Screenshot deze error en stuur naar Claude voor een fix!
      </div>
    </div>
  );
};

// ===== TOAST NOTIFICATION SYSTEM =====
const ToastContext = React.createContext();

const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'success', title = '') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type, title }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const toast = {
    success: (message, title = 'Gelukt!') => addToast(message, 'success', title),
    error: (message, title = 'Fout') => addToast(message, 'error', title),
    warning: (message, title = 'Waarschuwing') => addToast(message, 'warning', title),
    info: (message, title = 'Info') => addToast(message, 'info', title),
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed top-4 right-4 z-[100] space-y-2 pointer-events-none">
        {toasts.map(toast => (
          <Toast key={toast.id} {...toast} onClose={() => removeToast(toast.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

const Toast = ({ message, type, title, onClose }) => {
  const Icon = type === 'success' ? CheckCircle : 
               type === 'error' ? AlertTriangle : 
               type === 'warning' ? AlertTriangle : CheckCircle;

  const colors = {
    success: 'bg-green-50 border-green-200 text-green-900',
    error: 'bg-red-50 border-red-200 text-red-900',
    warning: 'bg-orange-50 border-orange-200 text-orange-900',
    info: 'bg-blue-50 border-blue-200 text-blue-900'
  };

  const iconColors = {
    success: 'text-green-600',
    error: 'text-red-600',
    warning: 'text-orange-600',
    info: 'text-blue-600'
  };

  return (
    <div className={`${colors[type]} border rounded-lg shadow-lg p-4 min-w-[320px] max-w-md animate-slide-in-right pointer-events-auto`}>
      <div className="flex items-start gap-3">
        <Icon className={`w-5 h-5 ${iconColors[type]} flex-shrink-0 mt-0.5`} />
        <div className="flex-1">
          {title && <p className="font-semibold text-sm mb-1">{title}</p>}
          <p className="text-sm">{message}</p>
        </div>
        <button onClick={onClose} className="hover:bg-black/5 rounded p-1 transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

const useToast = () => {
  const context = React.useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context.toast;
};

// ===== CONFIRMATION DIALOG =====
const ConfirmDialog = ({ isOpen, onClose, onConfirm, title, message, confirmText = 'Bevestigen', cancelText = 'Annuleren', danger = false }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[90]">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4">
        <div className={`p-6 border-b ${danger ? 'bg-red-50 border-red-200' : 'bg-slate-50 border-slate-200'}`}>
          <h3 className={`text-xl font-bold ${danger ? 'text-red-900' : 'text-slate-900'}`}>{title}</h3>
        </div>
        <div className="p-6">
          <p className="text-slate-700">{message}</p>
        </div>
        <div className="p-6 bg-slate-50 border-t flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`px-4 py-2 rounded-lg transition-colors ${
              danger 
                ? 'bg-red-500 text-white hover:bg-red-600' 
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

// Add CSS animation
const style = document.createElement('style');
style.textContent = `
  @keyframes slide-in-right {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  .animate-slide-in-right {
    animation: slide-in-right 0.3s ease-out;
  }
  
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
  .animate-spin {
    animation: spin 1s linear infinite;
  }
  
  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }
  .animate-pulse {
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }
`;
document.head.appendChild(style);

// ===== LOADING SPINNER =====
const LoadingSpinner = ({ size = 'md', className = '' }) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };
  
  return <Loader className={`animate-spin ${sizes[size]} ${className}`} />;
};

// ===== DEBOUNCED INPUT HOOK =====
const useDebounce = (value, delay = 300) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// ===== TYPES =====
const ResourceType = {
  LABOR: 'Labor',
  EQUIPMENT: 'Equipment',
  MATERIAL: 'Material'
};

// ===== UTILITY FUNCTIONS =====
const calculateActivityDates = (activities, projectStartDate) => {
  if (!activities || !Array.isArray(activities) || activities.length === 0) {
    return [];
  }
  
  if (!projectStartDate) {
    console.warn('No projectStartDate provided, returning activities without dates');
    return activities;
  }
  
  const startDate = new Date(projectStartDate);
  if (isNaN(startDate.getTime())) {
    console.warn('Invalid projectStartDate, returning activities without dates');
    return activities;
  }
  
  const activitiesWithDates = {};
  
  // First pass: calculate dates for activities without predecessors
  activities.forEach(activity => {
    if (!activity.relationships || activity.relationships.length === 0) {
      activitiesWithDates[activity.id] = {
        ...activity,
        calculatedStart: new Date(startDate),
        calculatedEnd: new Date(startDate.getTime() + (activity.duration || 1) * 24 * 60 * 60 * 1000)
      };
    }
  });
  
  // Second pass: calculate dates for activities with predecessors
  let changed = true;
  let iterations = 0;
  while (changed && iterations < 100) {
    changed = false;
    iterations++;
    
    activities.forEach(activity => {
      if (activitiesWithDates[activity.id]) return;
      
      const relationships = activity.relationships || [];
      let allPredecessorsCalculated = true;
      let latestEnd = new Date(startDate);
      
      relationships.forEach(rel => {
        const predecessor = activitiesWithDates[rel.predecessorActivityId];
        if (!predecessor) {
          allPredecessorsCalculated = false;
        } else {
          const predEnd = new Date(predecessor.calculatedEnd);
          predEnd.setDate(predEnd.getDate() + (rel.lag || 0));
          if (predEnd > latestEnd) latestEnd = predEnd;
        }
      });
      
      if (allPredecessorsCalculated) {
        activitiesWithDates[activity.id] = {
          ...activity,
          calculatedStart: new Date(latestEnd),
          calculatedEnd: new Date(latestEnd.getTime() + (activity.duration || 1) * 24 * 60 * 60 * 1000)
        };
        changed = true;
      }
    });
  }
  
  // Convert object back to array
  return activities.map(activity => activitiesWithDates[activity.id] || activity);
};

// ===== INITIAL DATA =====
const getInitialProjects = () => {
  const saved = localStorage.getItem('chemprep_projects_v1');
  return saved ? JSON.parse(saved) : [
    { 
      id: 'proj-1', 
      factory: 'U&F', 
      name: 'TA2024 - U&F Plant', 
      startDate: '2024-09-01',
      p6ProjectCode: 'UF-TA-2024',
      generalCosts: [
        { id: 'gc-1', description: 'Huur Ketenpark (6 mnd)', cost: 120000, category: 'Facilitair' },
        { id: 'gc-2', description: 'Veiligheid & Bewaking', cost: 75000, category: 'HSE', supplierId: 'sup-securitas' },
        { id: 'gc-3', description: 'Catering & Voorzieningen', cost: 45000, category: 'Facilitair' },
      ] 
    },
    { id: 'proj-2', factory: 'U&F', name: 'Pre-TA 2026', startDate: '2026-03-01', p6ProjectCode: 'UF-PRE-2026' },
    { id: 'proj-3', factory: 'MEB', name: 'MEB TA2025', startDate: '2025-05-10', p6ProjectCode: 'MEB-TA-2025' },
    { id: 'proj-4', factory: 'SALT', name: 'Zoutfabriek Inspectieronde 2024', startDate: '2024-11-01', p6ProjectCode: 'SALT-INS-2024' },
  ];
};

const getInitialWorkflowStatuses = () => {
  const saved = localStorage.getItem('chemprep_workflow_statuses_v1');
  return saved ? JSON.parse(saved) : [
    { id: 'ws-1', name: 'New Scope', color: '#06b6d4' },
    { id: 'ws-2', name: 'Planning in Progress', color: '#3b82f6' },
    { id: 'ws-3', name: 'Planned', color: '#8b5cf6' },
    { id: 'ws-4', name: 'Review', color: '#f97316' },
    { id: 'ws-5', name: 'Approved', color: '#16a34a' },
    { id: 'ws-6', name: 'Scheduled', color: '#0ea5e9' },
    { id: 'ws-7', name: 'Complete', color: '#1e293b' },
  ];
};

const getInitialUsers = () => {
  const saved = localStorage.getItem('chemprep_users_v1');
  return saved ? JSON.parse(saved) : [
    { id: 'user-1', name: 'Jan Jansen' },
    { id: 'user-2', name: 'Piet Pietersen' },
    { id: 'user-3', name: 'Klaas Klaassen' },
  ];
};

const getInitialMaterials = () => {
  const saved = localStorage.getItem('chemprep_materials_v1');
  return saved ? JSON.parse(saved) : [
    { id: 'mat-1', description: 'Pakking 4" 150# Spiral Wound 316', supplier: 'Klinger', articleNumber: 'G-104-SW', price: 45.50, unit: 'st' },
    { id: 'mat-2', description: 'Boutset M20x120 A193 B7', supplier: 'Fabory', articleNumber: 'B-20-120', price: 12.20, unit: 'set' },
    { id: 'mat-3', description: 'Afsluiter 2" Gate 150# RF', supplier: 'Econosto', articleNumber: 'AV-2-G-150', price: 380.00, unit: 'st' },
    { id: 'mat-4', description: 'Druktransmitter Rosemount 3051', supplier: 'Emerson', articleNumber: '3051S-T', price: 1250.00, unit: 'st' },
    { id: 'mat-5', description: 'Pakking 6" 300# Spiral Wound', supplier: 'Klinger', articleNumber: 'G-106-SW', price: 78.50, unit: 'st' },
  ];
};

const getInitialDocCategories = () => {
  const saved = localStorage.getItem('chemprep_doc_categories_v1');
  return saved ? JSON.parse(saved) : [
    { id: 'dc-1', name: 'Taak Risico Analyse (TRA)', icon: 'shield' },
    { id: 'dc-2', name: 'P&ID', icon: 'diagram' },
    { id: 'dc-3', name: 'Isometric', icon: 'vector' },
    { id: 'dc-4', name: 'Werkvergunning', icon: 'clipboard' },
    { id: 'dc-5', name: 'Foto', icon: 'camera' },
  ];
};

const getInitialFunctionalLocations = () => {
  const saved = localStorage.getItem('chemprep_funclocs_v1');
  return saved ? JSON.parse(saved) : [
    { id: 'fl-1', code: '01-UF-REACT', description: 'U&F Reactor Sectie' },
    { id: 'fl-2', code: '01-UF-PUMP', description: 'U&F Pompenkelder' },
    { id: 'fl-3', code: '02-MEB-DIST', description: 'MEB Distillatie' },
  ];
};

const getInitialEquipment = () => {
  const saved = localStorage.getItem('chemprep_equipment_v1');
  return saved ? JSON.parse(saved) : [
    { id: 'eq-1', tagNumber: 'V-401-A', description: 'Drukvat 10m3', type: 'Vat' },
    { id: 'eq-2', tagNumber: 'P-505-B', description: 'Centrifugaalpomp', type: 'Pomp' },
    { id: 'eq-3', tagNumber: 'E-203', description: 'Warmtewisselaar', type: 'Heat Exchanger' },
  ];
};

const getInitialActivityCodes = () => {
  const saved = localStorage.getItem('chemprep_activity_codes_v1');
  return saved ? JSON.parse(saved) : [
    { 
      id: 'ac-1', 
      name: 'Werktype', 
      values: [
        { id: 'acv-1-1', value: 'MECH', description: 'Mechanical' },
        { id: 'acv-1-2', value: 'E&I', description: 'Electrical & Instrumentation' },
        { id: 'acv-1-3', value: 'CIVIL', description: 'Civil' },
        { id: 'acv-1-4', value: 'INSP', description: 'Inspectie' },
      ] 
    },
    { 
      id: 'ac-2', 
      name: 'Kritikaliteit', 
      values: [
        { id: 'acv-2-1', value: 'HOOG', description: 'Kritisch Pad' },
        { id: 'acv-2-2', value: 'NORMAAL', description: 'Normale Prioriteit' },
      ] 
    }
  ];
};

const getInitialScopeItems = () => {
  const saved = localStorage.getItem('chemprep_scope_v14');
  return saved ? JSON.parse(saved) : [
    {
      id: 'scope-1',
      projectId: 'proj-1',
      tagNumber: 'V-401-A',
      description: 'Vat inspectie en inwendige reiniging',
      priority: 'High',
      status: 'In Scope',
      workflowStatusId: 'ws-3',
      plannerId: 'user-1',
      workOrderNumber: 'WO-2024-1234',
      notificationNumber: 'NOT-567890',
      functionalLocationId: 'fl-1',
      equipmentId: 'eq-1',
      statusMeetpoints: {
        werkbeschrijving: 'IN_VOORBEREIDING',
        materialen: 'GEEN',
        calculaties: 'NIET_VAN_TOEPASSING',
        tra: 'NIET_VAN_TOEPASSING',
        documenten: 'GEEN',
        kosten: 'NIET_VAN_TOEPASSING'
      },
      costRules: [],
      contingency: { percentage: 10, amount: 0 },
      totalCost: 0,
      plannedActivities: [
        {
          id: 'pa-1-1',
          templateId: 'temp-loto-on',
          activityId: 'A010',
          overrideDescription: 'LOTO plaatsen op V-401-A',
          wbsId: '0',
          wbsCode: 'V401A.010',
          duration: 1,
          phase: 'UITBEDRIJF',
          resources: [{ resourceId: 'res-1', units: 1, unitsPerTime: 8, allocatedSupplierId: 'sup-2' }],
          materials: [],
          risks: [{ id: 'risk-1', hazard: 'Elektrische spanning', measure: 'LOTO procedure volgen' }],
          holdPoint: false,
          relationships: [],
          activityCodes: { 'ac-1': 'acv-1-1' },
          udfValues: {},
          executionStatus: 'Planned',
          progress: 0,
          steps: []
        },
        {
          id: 'pa-1-2',
          templateId: 'temp-1',
          activityId: 'A020',
          overrideDescription: 'Steiger bouwen rondom V-401-A',
          wbsId: '0',
          wbsCode: 'V401A.020',
          duration: 16,
          phase: 'PRE-TA',
          resources: [{ resourceId: 'res-3', units: 16, unitsPerTime: 8, allocatedSupplierId: 'sup-1' }],
          materials: [],
          risks: [],
          holdPoint: false,
          relationships: [],
          activityCodes: { 'ac-1': 'acv-1-1' },
          udfValues: {},
          executionStatus: 'Planned',
          progress: 0,
          steps: []
        },
        {
          id: 'pa-1-3',
          templateId: 'temp-2',
          activityId: 'A030',
          overrideDescription: 'Flensverbindingen mangat openen',
          wbsId: '0',
          wbsCode: 'V401A.030',
          duration: 4,
          phase: 'TA',
          resources: [{ resourceId: 'res-1', units: 4, unitsPerTime: 8, allocatedSupplierId: 'sup-2' }],
          materials: [{ id: 'mat-assign-1', materialId: 'mat-1', quantity: 2 }],
          risks: [],
          holdPoint: false,
          relationships: [
            { predecessorActivityId: 'pa-1-1', type: 'FS', lag: 0 },
            { predecessorActivityId: 'pa-1-2', type: 'FS', lag: 0 }
          ],
          activityCodes: { 'ac-1': 'acv-1-1' },
          udfValues: {},
          executionStatus: 'Planned',
          progress: 0,
          steps: []
        },
        {
          id: 'pa-1-4',
          templateId: 'temp-insp-int',
          activityId: 'A040',
          overrideDescription: 'Visuele inspectie vatwand',
          wbsId: '0',
          wbsCode: 'V401A.040',
          duration: 2,
          phase: 'TA',
          resources: [],
          materials: [],
          risks: [{ id: 'risk-2', hazard: 'Confined space', measure: 'Mangatwacht aanwezig' }],
          holdPoint: true,
          relationships: [{ predecessorActivityId: 'pa-1-3', type: 'FS', lag: 0 }],
          activityCodes: { 'ac-1': 'acv-1-4' },
          udfValues: {},
          executionStatus: 'Planned',
          progress: 0,
          steps: []
        },
        {
          id: 'pa-1-5',
          templateId: 'temp-mech-close',
          activityId: 'A050',
          overrideDescription: 'Flensverbindingen mangat sluiten',
          wbsId: '0',
          wbsCode: 'V401A.050',
          duration: 4,
          phase: 'TA',
          resources: [{ resourceId: 'res-1', units: 4, unitsPerTime: 8, allocatedSupplierId: 'sup-2' }],
          materials: [{ id: 'mat-assign-2', materialId: 'mat-1', quantity: 2 }],
          risks: [],
          holdPoint: false,
          relationships: [{ predecessorActivityId: 'pa-1-4', type: 'FS', lag: 0 }],
          activityCodes: { 'ac-1': 'acv-1-1' },
          udfValues: {},
          executionStatus: 'Planned',
          progress: 0,
          steps: []
        },
        {
          id: 'pa-1-6',
          templateId: 'temp-scaf-rem',
          activityId: 'A060',
          overrideDescription: 'Steiger verwijderen',
          wbsId: '0',
          wbsCode: 'V401A.060',
          duration: 8,
          phase: 'POST-TA',
          resources: [{ resourceId: 'res-3', units: 8, unitsPerTime: 8, allocatedSupplierId: 'sup-1' }],
          materials: [],
          risks: [],
          holdPoint: false,
          relationships: [{ predecessorActivityId: 'pa-1-5', type: 'FS', lag: 0 }],
          activityCodes: { 'ac-1': 'acv-1-1' },
          udfValues: {},
          executionStatus: 'Planned',
          progress: 0,
          steps: []
        },
        {
          id: 'pa-1-7',
          templateId: 'temp-loto-off',
          activityId: 'A070',
          overrideDescription: 'LOTO verwijderen',
          wbsId: '0',
          wbsCode: 'V401A.070',
          duration: 1,
          phase: 'INBEDRIJF',
          resources: [{ resourceId: 'res-1', units: 1, unitsPerTime: 8, allocatedSupplierId: 'sup-2' }],
          materials: [],
          risks: [],
          holdPoint: false,
          relationships: [{ predecessorActivityId: 'pa-1-5', type: 'FS', lag: 0 }],
          activityCodes: { 'ac-1': 'acv-1-1' },
          udfValues: {},
          executionStatus: 'Planned',
          progress: 0,
          steps: []
        },
      ],
      scopeUdfValues: {},
      materials: [],
      manualCostItems: []
    },
    {
      id: 'scope-2',
      projectId: 'proj-3',
      tagNumber: 'P-505-B',
      description: 'Pomp revisie MEB',
      priority: 'High',
      status: 'In Scope',
      workflowStatusId: 'ws-2',
      plannerId: 'user-2',
      equipmentId: 'eq-2',
      plannedActivities: [
        {
          id: 'pa-2-1',
          templateId: 'temp-ei-disc',
          activityId: 'A010',
          overrideDescription: 'Motor afkoppelen P-505-B',
          wbsId: '0',
          wbsCode: 'P505B.010',
          duration: 2,
          phase: 'UITBEDRIJF',
          resources: [{ resourceId: 'res-5', units: 2, unitsPerTime: 8, allocatedSupplierId: 'sup-spi' }],
          materials: [],
          risks: [],
          holdPoint: false,
          relationships: [],
          activityCodes: { 'ac-1': 'acv-1-2' },
          udfValues: {},
          executionStatus: 'Planned',
          progress: 0,
          steps: []
        }
      ],
      scopeUdfValues: {},
      materials: [],
      manualCostItems: []
    },
    {
      id: 'scope-3',
      projectId: 'proj-1',
      tagNumber: 'E-203',
      description: 'Warmtewisselaar vervangen',
      priority: 'Medium',
      status: 'Op Hold',
      workflowStatusId: 'ws-1',
      equipmentId: 'eq-3',
      plannedActivities: [
        {
          id: 'pa-3-1',
          templateId: 'temp-1',
          activityId: 'C010',
          overrideDescription: 'Steiger bouwen voor E-203',
          wbsId: '0',
          wbsCode: 'E203.010',
          duration: 24,
          phase: 'PRE-TA',
          resources: [],
          materials: [],
          risks: [],
          holdPoint: false,
          relationships: [],
          activityCodes: {},
          udfValues: {},
          executionStatus: 'Planned',
          progress: 0,
          steps: []
        },
        {
          id: 'pa-3-2',
          templateId: 'temp-2',
          activityId: 'C020',
          overrideDescription: 'Blindplaten plaatsen E-203',
          wbsId: '0',
          wbsCode: 'E203.020',
          duration: 8,
          phase: 'TA',
          resources: [],
          materials: [],
          risks: [],
          holdPoint: false,
          relationships: [],
          activityCodes: {},
          udfValues: {},
          executionStatus: 'Planned',
          progress: 0,
          steps: []
        }
      ],
      scopeUdfValues: {},
      materials: [],
      manualCostItems: []
    },
    {
      id: 'scope-4',
      projectId: 'proj-1',
      tagNumber: 'L-100-B',
      description: 'Leidingwerk inspectie',
      priority: 'Low',
      status: 'Uit Scope',
      workflowStatusId: 'ws-1',
      plannedActivities: [],
      scopeUdfValues: {},
      materials: [],
      manualCostItems: []
    },
    {
      id: 'scope-5',
      projectId: 'proj-1',
      tagNumber: 'R-602',
      description: 'Reactor katalysator vervangen',
      priority: 'High',
      status: 'In Scope',
      workflowStatusId: 'ws-5',
      plannerId: 'user-3',
      plannedActivities: [],
      scopeUdfValues: {},
      materials: [],
      manualCostItems: []
    },
  ];
};

const getInitialTemplates = () => {
  const saved = localStorage.getItem('chemprep_templates_v9');
  return saved ? JSON.parse(saved) : [
    { id: 'temp-loto-on', code: 'SAFE-LOTO-ON', description: 'Aanbrengen Veiligstelling (LOTO)', category: 'Veiligheid', defaultPhase: 'UITBEDRIJF', isAdjustable: false, resources: [{ resourceId: 'res-1', quantity: 1 }] },
    { id: 'temp-loto-off', code: 'SAFE-LOTO-OFF', description: 'Verwijderen Veiligstelling (LOTO)', category: 'Veiligheid', defaultPhase: 'INBEDRIJF', isAdjustable: false, resources: [{ resourceId: 'res-1', quantity: 1 }] },
    { id: 'temp-1', code: 'SCAF-INST', description: 'Plaatsen Steiger', category: 'Steigerbouw', defaultPhase: 'PRE-TA', isAdjustable: true, resources: [{ resourceId: 'res-3', quantity: 16 }] },
    { id: 'temp-scaf-rem', code: 'SCAF-REM', description: 'Verwijderen Steiger', category: 'Steigerbouw', defaultPhase: 'POST-TA', isAdjustable: true, resources: [{ resourceId: 'res-3', quantity: 8 }] },
    { id: 'temp-2', code: 'MECH-OPEN', description: 'Flensverbinding Openen', category: 'Mechanical', defaultPhase: 'TA', isAdjustable: true, resources: [{ resourceId: 'res-1', quantity: 4 }] },
    { id: 'temp-mech-close', code: 'MECH-CLOSE', description: 'Flensverbinding Sluiten', category: 'Mechanical', defaultPhase: 'TA', isAdjustable: true, resources: [{ resourceId: 'res-1', quantity: 4 }] },
    { id: 'temp-insp-int', code: 'INSP-INT', description: 'Inwendige Inspectie (Visueel)', category: 'Inspectie', defaultPhase: 'TA', isAdjustable: false, resources: [] },
    { id: 'temp-ei-disc', code: 'EI-DISC', description: 'Motor Elektrisch Afkoppelen', category: 'E&I', defaultPhase: 'UITBEDRIJF', isAdjustable: false, resources: [{ resourceId: 'res-5', quantity: 2 }] },
    { id: 'temp-ei-conn', code: 'EI-CONN', description: 'Motor Elektrisch Aankoppelen', category: 'E&I', defaultPhase: 'INBEDRIJF', isAdjustable: false, resources: [{ resourceId: 'res-5', quantity: 2 }] },
  ];
};

const getInitialResources = () => [
  { id: 'res-1', name: 'Pijpfitter 1e klas', type: ResourceType.LABOR, unit: 'uur', defaultUnitsPerTime: 8 },
  { id: 'res-2', name: 'Lasser (Hoge Druk)', type: ResourceType.LABOR, unit: 'uur', defaultUnitsPerTime: 8 },
  { id: 'res-3', name: 'Steigerbouwer', type: ResourceType.LABOR, unit: 'uur', defaultUnitsPerTime: 8 },
  { id: 'res-4', name: 'Instrument Fitter', type: ResourceType.LABOR, unit: 'uur', defaultUnitsPerTime: 8 },
  { id: 'res-5', name: 'E&I Technicus', type: ResourceType.LABOR, unit: 'uur', defaultUnitsPerTime: 8 },
  { id: 'res-6', name: 'Veiligheidswacht (Mangatwacht)', type: ResourceType.LABOR, unit: 'uur', defaultUnitsPerTime: 8 },
  { id: 'res-7', name: 'Kraanmachinist 100T', type: ResourceType.LABOR, unit: 'uur', defaultUnitsPerTime: 8 },
  { id: 'res-eq-1', name: 'Mobiele Kraan 100T', type: ResourceType.EQUIPMENT, unit: 'uur' },
  { id: 'res-eq-2', name: 'Hoogwerker 20m', type: ResourceType.EQUIPMENT, unit: 'dag' },
];

const getInitialSuppliers = () => [
  { 
    id: 'sup-1', 
    name: 'Brand Steigerbouw', 
    costAccountId: '4500-SCAF', 
    category: 'Steigerbouw', 
    rates: [{ resourceId: 'res-3', rate: 58 }] 
  },
  { 
    id: 'sup-2', 
    name: 'Stork Mechanical', 
    costAccountId: '4200-MECH', 
    category: 'Mechanical', 
    rates: [
      { resourceId: 'res-1', rate: 75 }, 
      { resourceId: 'res-2', rate: 89 }
    ] 
  },
  { 
    id: 'sup-mammoet', 
    name: 'Mammoet', 
    costAccountId: '4600-CRANE', 
    category: 'Hijs- en Hefwerk', 
    rates: [
      { resourceId: 'res-7', rate: 120 }, 
      { resourceId: 'res-eq-1', rate: 250 }
    ] 
  },
  {
    id: 'sup-spi',
    name: 'SPIE E&I',
    costAccountId: '4300-EI',
    category: 'E&I',
    rates: [
      { resourceId: 'res-4', rate: 78 },
      { resourceId: 'res-5', rate: 82 }
    ]
  },
  {
    id: 'sup-securitas',
    name: 'Securitas',
    costAccountId: '4800-HSE',
    category: 'Veiligheid',
    rates: [{ resourceId: 'res-6', rate: 45 }]
  },
];

// ===== SIDEBAR COMPONENT =====
const Sidebar = ({ mode, activeTab, setActiveTab, lastSaved, activeProject, onSwitchProject, isAdminMode, onToggleAdmin, alertCount = 0 }) => {
  const projectTabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'scope', label: 'Scope Manager', icon: Package },
    { id: 'planning', label: 'Planning & Gantt', icon: Calendar },
    { id: 'scurve', label: 'S-Curve', icon: TrendingUp },
    { id: 'evm', label: 'Earned Value', icon: BarChart2 },
    { id: 'notifications', label: 'Notificaties', icon: Bell, badge: alertCount },
    { id: 'criticalpath', label: 'Kritisch Pad', icon: GitBranch },
    { id: 'backup', label: 'Backup & Restore', icon: Archive },
    { id: 'documents', label: 'Documenten', icon: FileText },
    { id: 'tra', label: 'T.R.A. Overzicht', icon: AlertTriangle },
    { id: 'exports', label: 'Export Hub', icon: Download },
    { id: 'disciplines', label: 'Disciplines', icon: Layers },
    { id: 'materials', label: 'Materialen', icon: Package },
    { id: 'qrcodes', label: 'QR Codes', icon: QrCode },
    { id: 'progress', label: 'Progress Tracking', icon: Activity },

    { id: 'columns', label: 'Kolommen', icon: Table },
  ];

  const globalTabs = [
    { id: 'projectSelector', label: 'Projects', icon: Building2 },
    { id: 'library', label: 'Library', icon: Book },
    { id: 'users', label: 'Gebruikers', icon: Users },
    { id: 'changelog', label: 'Changelog', icon: History },
    { id: 'admin', label: 'Admin', icon: Settings },
  ];

  const tabs = mode === 'project' ? projectTabs : globalTabs;

  return (
    <div className="w-64 bg-gradient-to-b from-slate-900 to-slate-800 text-white flex flex-col shadow-2xl">
      {/* Header */}
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-blue-500 p-2 rounded-lg">
            <Wrench className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold">ChemPrep</h1>
            <p className="text-xs text-slate-400">Werk Voorbereiding</p>
          </div>
        </div>
        
        {mode === 'project' && activeProject && (
          <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700">
            <div className="flex items-center gap-2 mb-1">
              <Building2 className="w-4 h-4 text-blue-400" />
              <span className="text-xs text-slate-400">{activeProject.factory}</span>
            </div>
            <div className="font-semibold text-sm truncate">{activeProject.name}</div>
            <div className="flex items-center gap-2 mt-2 text-xs text-slate-400">
              <Calendar className="w-3 h-3" />
              {new Date(activeProject.startDate).toLocaleDateString('nl-NL')}
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive 
                  ? 'bg-blue-500 text-white shadow-lg' 
                  : 'text-slate-300 hover:bg-slate-700/50'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{tab.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-700 space-y-3">
        {mode === 'project' && lastSaved && (
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Save className="w-3 h-3" />
            <span>Opgeslagen: {lastSaved.toLocaleTimeString('nl-NL')}</span>
          </div>
        )}
        
        {onToggleAdmin && (
          <button
            onClick={onToggleAdmin}
            className={`w-full flex items-center justify-between gap-2 px-4 py-2 rounded-lg transition-colors ${
              isAdminMode 
                ? 'bg-orange-500/20 text-orange-300 hover:bg-orange-500/30' 
                : 'text-slate-400 hover:bg-slate-700/50'
            }`}
          >
            <div className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              <span className="text-sm">Admin Mode</span>
            </div>
            <div className={`w-10 h-5 rounded-full transition-colors ${
              isAdminMode ? 'bg-orange-500' : 'bg-slate-600'
            }`}>
              <div className={`w-4 h-4 rounded-full bg-white transform transition-transform mt-0.5 ${
                isAdminMode ? 'translate-x-5' : 'translate-x-0.5'
              }`} />
            </div>
          </button>
        )}
        
        {mode === 'project' && onSwitchProject && (
          <button
            onClick={onSwitchProject}
            className="w-full flex items-center gap-2 px-4 py-2 rounded-lg text-slate-300 hover:bg-slate-700/50 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="text-sm">Andere Project</span>
          </button>
        )}
      </div>
    </div>
  );
};

// ===== PROJECT SELECTOR COMPONENT =====
const ProjectSelector = ({ projects, onProjectSelect, onLibraryClick }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProjects = projects.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.factory.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const factoryColors = {
    'U&F': 'bg-blue-500',
    'SALT': 'bg-purple-500',
    'MEB': 'bg-green-500'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-8">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full mb-6">
            <Wrench className="w-8 h-8 text-blue-400" />
            <h1 className="text-4xl font-bold text-white">ChemPrep</h1>
          </div>
          <p className="text-xl text-slate-300">Selecteer een project om te starten</p>
        </div>

        <div className="mb-6">
          <input
            type="text"
            placeholder="Zoek project of fabriek..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-6 py-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="grid gap-4">
          {filteredProjects.map(project => (
            <button
              key={project.id}
              onClick={() => onProjectSelect(project.id)}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 hover:border-blue-500/50 transition-all group"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 text-left">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`${factoryColors[project.factory]} text-white px-3 py-1 rounded-full text-sm font-semibold`}>
                      {project.factory}
                    </span>
                    <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
                      {project.name}
                    </h3>
                  </div>
                  <div className="flex items-center gap-4 text-slate-400 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>Start: {new Date(project.startDate).toLocaleDateString('nl-NL')}</span>
                    </div>
                    {project.p6ProjectCode && (
                      <div className="flex items-center gap-2">
                        <Tag className="w-4 h-4" />
                        <span>{project.p6ProjectCode}</span>
                      </div>
                    )}
                  </div>
                </div>
                <ChevronRight className="w-6 h-6 text-slate-400 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-12 text-slate-400">
            <p>Geen projecten gevonden</p>
          </div>
        )}

        {onLibraryClick && (
          <div className="mt-8 flex justify-center gap-4">
            <button
              onClick={onLibraryClick}
              className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white px-6 py-3 rounded-lg hover:bg-white/20 transition-colors"
            >
              <Book className="w-5 h-5" />
              Library Hub
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// ===== SAP IMPORT TAB COMPONENT =====
const SAPImportTab = ({ onImport, scopeItems, setScopeItems }) => {
  const toast = useToast();
  const [file, setFile] = useState(null);
  const [parsedData, setParsedData] = useState(null);
  const [preview, setPreview] = useState([]);
  const [mapping, setMapping] = useState({
    tagNumber: 'Functional Location',
    description: 'Description',
    orderNumber: 'Order',
    costCenter: 'Cost Center',
    plannerGroup: 'Planner Group',
    systemStatus: 'System Status'
  });
  const [importStats, setImportStats] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileUpload = async (e) => {
    const uploadedFile = e.target.files[0];
    if (!uploadedFile) return;

    setFile(uploadedFile);
    setIsProcessing(true);
    toast.info('Bestand wordt verwerkt...', 'SAP Import');

    try {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = event.target.result;
          let parsed;

          if (uploadedFile.name.endsWith('.csv')) {
            // Parse CSV
            const lines = data.split('\n');
            const headers = lines[0].split(',').map(h => h.trim());
            parsed = lines.slice(1).map(line => {
              const values = line.split(',');
              const obj = {};
              headers.forEach((h, i) => obj[h] = values[i]?.trim());
              return obj;
            }).filter(row => Object.values(row).some(v => v));
          } else {
            // For Excel, we'll need a library like SheetJS
            // For now, show instruction
            toast.warning('Excel files vereisen SheetJS library', 'Upload CSV bestand voor nu');
            setIsProcessing(false);
            return;
          }

          setParsedData(parsed);
          setPreview(parsed.slice(0, 10)); // First 10 rows
          toast.success(parsed.length + ' rijen gevonden', 'Bestand verwerkt');
        } catch (error) {
          toast.error('Fout bij verwerken bestand: ' + error.message);
        } finally {
          setIsProcessing(false);
        }
      };

      if (uploadedFile.name.endsWith('.csv')) {
        reader.readAsText(uploadedFile);
      } else {
        reader.readAsArrayBuffer(uploadedFile);
      }
    } catch (error) {
      toast.error('Fout bij uploaden: ' + error.message);
      setIsProcessing(false);
    }
  };

  const handleImport = () => {
    if (!parsedData) {
      toast.error('Geen data om te importeren');
      return;
    }

    setIsProcessing(true);
    toast.info('Import wordt uitgevoerd...', 'Even geduld');

    try {
      let imported = 0;
      let skipped = 0;
      let updated = 0;
      const newScopeItems = [];

      parsedData.forEach(row => {
        const tagNumber = row[mapping.tagNumber];
        const description = row[mapping.description];

        if (!tagNumber) {
          skipped++;
          return;
        }

        // Check if scope item exists
        const existingIndex = scopeItems.findIndex(s => s.tagNumber === tagNumber);

        if (existingIndex >= 0) {
          // Update existing
          scopeItems[existingIndex] = {
            ...scopeItems[existingIndex],
            description: description || scopeItems[existingIndex].description,
            sapOrderNumber: row[mapping.orderNumber],
            costCenter: row[mapping.costCenter],
            plannerGroup: row[mapping.plannerGroup],
            systemStatus: row[mapping.systemStatus]
          };
          updated++;
        } else {
          // Create new
          newScopeItems.push({
            id: 'scope-' + Date.now() + '-' + imported,
            tagNumber: tagNumber,
            description: description || 'GeÃ¯mporteerd uit SAP',
            status: 'In Scope',
            plannedActivities: [],
            sapOrderNumber: row[mapping.orderNumber],
            costCenter: row[mapping.costCenter],
            plannerGroup: row[mapping.plannerGroup],
            systemStatus: row[mapping.systemStatus],
            workflowStatusId: null,
            plannerId: null
          });
          imported++;
        }
      });

      // Update scope items
      setScopeItems([...scopeItems, ...newScopeItems]);

      // Show stats
      const stats = {
        total: parsedData.length,
        imported: imported,
        updated: updated,
        skipped: skipped
      };
      setImportStats(stats);

      toast.success(
        imported + ' nieuw, ' + updated + ' bijgewerkt, ' + skipped + ' overgeslagen',
        'Import voltooid!'
      );
    } catch (error) {
      toast.error('Fout bij import: ' + error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const availableColumns = parsedData && parsedData.length > 0 
    ? Object.keys(parsedData[0]) 
    : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-slate-900">SAP Data Import</h3>
          <p className="text-sm text-slate-600 mt-1">
            Importeer equipment en werk orders vanuit SAP (CSV/Excel)
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Database className="w-8 h-8 text-blue-600" />
        </div>
      </div>

      {/* File Upload */}
      <div className="bg-white border-2 border-dashed border-slate-300 rounded-lg p-8 hover:border-blue-400 transition-colors">
        <div className="text-center">
          <Upload className="w-12 h-12 mx-auto text-slate-400 mb-4" />
          <label className="cursor-pointer">
            <span className="text-blue-600 hover:text-blue-700 font-semibold">
              Klik om bestand te uploaden
            </span>
            <span className="text-slate-600"> of sleep hier naartoe</span>
            <input
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
          <p className="text-xs text-slate-500 mt-2">
            CSV of Excel (.xlsx, .xls) - Max 10MB
          </p>
          {file && (
            <div className="mt-4 inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-lg">
              <FileSpreadsheet className="w-4 h-4" />
              <span className="text-sm font-medium">{file.name}</span>
            </div>
          )}
        </div>
      </div>

      {/* Mapping Configuration */}
      {parsedData && (
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-6">
          <h4 className="font-semibold text-slate-900 mb-4">Kolom Mapping</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Tag Number (FLOC)
              </label>
              <select
                value={mapping.tagNumber}
                onChange={(e) => setMapping({...mapping, tagNumber: e.target.value})}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {availableColumns.map(col => (
                  <option key={col} value={col}>{col}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Description
              </label>
              <select
                value={mapping.description}
                onChange={(e) => setMapping({...mapping, description: e.target.value})}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {availableColumns.map(col => (
                  <option key={col} value={col}>{col}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Order Number
              </label>
              <select
                value={mapping.orderNumber}
                onChange={(e) => setMapping({...mapping, orderNumber: e.target.value})}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">(Optioneel)</option>
                {availableColumns.map(col => (
                  <option key={col} value={col}>{col}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Cost Center
              </label>
              <select
                value={mapping.costCenter}
                onChange={(e) => setMapping({...mapping, costCenter: e.target.value})}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">(Optioneel)</option>
                {availableColumns.map(col => (
                  <option key={col} value={col}>{col}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Preview */}
      {preview.length > 0 && (
        <div>
          <h4 className="font-semibold text-slate-900 mb-3">
            Preview (eerste 10 rijen van {parsedData.length})
          </h4>
          <div className="border border-slate-200 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-100">
                  <tr>
                    {availableColumns.map(col => (
                      <th key={col} className="px-3 py-2 text-left font-medium text-slate-700 border-b border-slate-200">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                  {preview.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      {availableColumns.map(col => (
                        <td key={col} className="px-3 py-2 text-slate-600">
                          {row[col] || '-'}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Import Stats */}
      {importStats && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-green-900">Import Succesvol!</p>
              <div className="mt-2 space-y-1 text-sm text-green-700">
                <p>â€¢ Totaal verwerkt: {importStats.total} rijen</p>
                <p>â€¢ Nieuw aangemaakt: {importStats.imported} scope items</p>
                <p>â€¢ Bijgewerkt: {importStats.updated} scope items</p>
                <p>â€¢ Overgeslagen: {importStats.skipped} rijen</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-200">
        <div>
          {parsedData && (
            <p className="text-sm text-slate-600">
              {parsedData.length} rijen gereed voor import
            </p>
          )}
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setFile(null);
              setParsedData(null);
              setPreview([]);
              setImportStats(null);
            }}
            className="px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            Reset
          </button>
          <button
            onClick={handleImport}
            disabled={!parsedData || isProcessing}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed"
          >
            {isProcessing ? (
              <>
                <LoadingSpinner size="sm" className="text-white" />
                <span>Importeren...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Importeer naar Scope</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Help Section */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-900 mb-2">ðŸ“˜ SAP Export Instructies</h4>
        <div className="text-sm text-blue-700 space-y-1">
          <p>1. In SAP: Ga naar IW38 (Equipment List) of IW39 (Order List)</p>
          <p>2. Selecteer filters (Plant, Planning Plant, etc.)</p>
          <p>3. Voer uit en exporteer naar Excel (System â†’ List â†’ Save â†’ Local File)</p>
          <p>4. Opslaan als CSV of Excel bestand</p>
          <p>5. Upload het bestand hier</p>
        </div>
      </div>
    </div>
  );
};

// ===== P6 EXPORT TAB COMPONENT =====
const P6ExportTab = ({ project, scopeItems, resources, activityCodes }) => {
  const toast = useToast();
  const [exportOptions, setExportOptions] = useState({
    includeActivities: true,
    includeRelationships: true,
    includeResources: true,
    includeActivityCodes: true,
    includeWBS: true,
    includeCalendars: true
  });
  const [preview, setPreview] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [stats, setStats] = useState(null);
  const [fullXER, setFullXER] = useState(null);

  const generateXER = () => {
    setIsGenerating(true);
    toast.info('XER bestand wordt gegenereerd...', 'Even geduld');

    setTimeout(() => {
      try {
        let xer = '';
        const projectCode = project?.p6ProjectCode || 'CHEMPREP';
        const projectName = project?.name || 'ChemPrep Project';
        const projectStart = project?.startDate || new Date().toISOString().split('T')[0];

        // XER Header
        xer += 'ERMHDR\t19.12.0.0\tPrimavera P6\n';
        xer += '%T\tERMHDR\n';
        xer += '%F\tfile_version\tfile_application\n';
        xer += '%R\t19.12.0.0\tPrimavera P6 - Version 19.12\n';
        xer += '%E\n\n';

        // Project
        xer += '%T\tPROJECT\n';
        xer += '%F\tproj_id\tproj_short_name\tproj_name\tplan_start_date\tplan_end_date\n';
        xer += '%R\t1\t' + projectCode + '\t' + projectName + '\t' + projectStart + '\t\n';
        xer += '%E\n\n';

        // Calendar
        if (exportOptions.includeCalendars) {
          xer += '%T\tCALENDAR\n';
          xer += '%F\tclndr_id\tclndr_name\tdefault_flag\tclndr_type\tday_hr_cnt\tweek_hr_cnt\tmonth_hr_cnt\tyear_hr_cnt\n';
          xer += '%R\t1\tStandard\tY\tCA_Base\t8.00\t40.00\t160.00\t1920.00\n';
          xer += '%E\n\n';
        }

        // WBS Structure
        const scopeWBS = {};
        if (exportOptions.includeWBS) {
          xer += '%T\tPROJWBS\n';
          xer += '%F\twbs_id\tproj_id\twbs_short_name\twbs_name\tparent_wbs_id\n';
          xer += '%R\t1\t1\t' + projectCode + '\t' + projectName + '\t\n';
          
          let wbsId = 2;
          scopeItems.forEach(scope => {
            scopeWBS[scope.id] = wbsId;
            xer += '%R\t' + wbsId + '\t1\t' + scope.tagNumber + '\t' + scope.description + '\t1\n';
            wbsId++;
          });
          xer += '%E\n\n';
        }

        // Activities
        let taskId = 1;
        const activityMap = {};
        
        if (exportOptions.includeActivities) {
          xer += '%T\tTASK\n';
          xer += '%F\ttask_id\tproj_id\twbs_id\ttask_code\ttask_name\ttask_type\tduration_type\ttarget_drtn_hr_cnt\tstatus_code\tcomplete_pct_type\tphys_complete_pct\n';
          
          scopeItems.forEach(scope => {
            const wbsId = scopeWBS[scope.id] || 1;
            
            (scope.plannedActivities || []).forEach(activity => {
              activityMap[activity.id] = taskId;
              const duration = (activity.duration || 1) * 8;
              const status = activity.executionStatus === 'Completed' ? 'TK_Complete' : 
                            activity.executionStatus === 'In Progress' ? 'TK_Active' : 'TK_NotStart';
              const pctComplete = activity.progress || 0;
              
              xer += '%R\t' + taskId + '\t1\t' + wbsId + '\t' + activity.activityId + '\t' + activity.overrideDescription + '\tTT_Task\tDT_FixDrtn\t' + duration + '\t' + status + '\tCP_Phys\t' + pctComplete + '\n';
              taskId++;
            });
          });
          xer += '%E\n\n';
        }

        // Relationships
        if (exportOptions.includeRelationships && exportOptions.includeActivities) {
          xer += '%T\tTASKPRED\n';
          xer += '%F\ttask_pred_id\ttask_id\tpred_task_id\tpred_type\tlag_hr_cnt\n';
          
          let predId = 1;
          scopeItems.forEach(scope => {
            (scope.plannedActivities || []).forEach(activity => {
              const successorId = activityMap[activity.id];
              
              (activity.relationships || []).forEach(rel => {
                const predecessorId = activityMap[rel.predecessorActivityId];
                
                if (predecessorId && successorId) {
                  const predType = rel.type === 'SS' ? 'PR_SS' : rel.type === 'FF' ? 'PR_FF' : rel.type === 'SF' ? 'PR_SF' : 'PR_FS';
                  const lag = (rel.lag || 0) * 8;
                  
                  xer += '%R\t' + predId + '\t' + successorId + '\t' + predecessorId + '\t' + predType + '\t' + lag + '\n';
                  predId++;
                }
              });
            });
          });
          xer += '%E\n\n';
        }

        // Resources
        if (exportOptions.includeResources && resources && resources.length > 0) {
          xer += '%T\tRSRC\n';
          xer += '%F\trsrc_id\trsrc_short_name\trsrc_name\trsrc_type\n';
          
          resources.forEach((resource, idx) => {
            const rsrcId = idx + 1;
            const rsrcCode = resource.code || 'RES' + rsrcId;
            xer += '%R\t' + rsrcId + '\t' + rsrcCode + '\t' + resource.name + '\tRT_Labor\n';
          });
          xer += '%E\n\n';

          // Resource Assignments
          xer += '%T\tTASKRSRC\n';
          xer += '%F\ttaskrsrc_id\ttask_id\trsrc_id\ttarget_qty\n';
          
          let taskrsrcId = 1;
          scopeItems.forEach(scope => {
            (scope.plannedActivities || []).forEach(activity => {
              const tId = activityMap[activity.id];
              
              (activity.resources || []).forEach(resAssign => {
                const rsrcIdx = resources.findIndex(r => r.id === resAssign.resourceId);
                
                if (rsrcIdx >= 0 && tId) {
                  const rsrcId = rsrcIdx + 1;
                  const qty = resAssign.units || 0;
                  
                  xer += '%R\t' + taskrsrcId + '\t' + tId + '\t' + rsrcId + '\t' + qty + '\n';
                  taskrsrcId++;
                }
              });
            });
          });
          xer += '%E\n\n';
        }

        // Activity Codes
        if (exportOptions.includeActivityCodes && activityCodes && activityCodes.length > 0) {
          xer += '%T\tACTVTYPE\n';
          xer += '%F\tactv_code_type_id\tactv_short_name\tactv_code_type_name\n';
          
          activityCodes.forEach((codeType, idx) => {
            xer += '%R\t' + (idx + 1) + '\t' + codeType.code + '\t' + codeType.name + '\n';
          });
          xer += '%E\n\n';
        }

        // Calculate stats
        const totalActivities = scopeItems.reduce((sum, s) => sum + (s.plannedActivities?.length || 0), 0);
        const totalRelationships = scopeItems.reduce((sum, s) => {
          return sum + (s.plannedActivities || []).reduce((rsum, a) => rsum + (a.relationships?.length || 0), 0);
        }, 0);

        setStats({
          activities: totalActivities,
          relationships: totalRelationships,
          resources: resources.length,
          scopeItems: scopeItems.length
        });

        setFullXER(xer);
        setPreview(xer.substring(0, 2000));
        toast.success('XER bestand gegenereerd', totalActivities + ' activities klaar');
      } catch (error) {
        toast.error('Fout bij genereren: ' + error.message);
      } finally {
        setIsGenerating(false);
      }
    }, 500);
  };

  const handleDownload = () => {
    if (!fullXER) {
      generateXER();
      return;
    }

    const blob = new Blob([fullXER], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const filename = (project?.p6ProjectCode || 'ChemPrep') + '_' + new Date().toISOString().split('T')[0] + '.xer';
    
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success('XER bestand gedownload', filename);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-slate-900">Primavera P6 Export</h3>
          <p className="text-sm text-slate-600 mt-1">Exporteer project naar P6 XER formaat</p>
        </div>
        <FileOutput className="w-8 h-8 text-orange-600" />
      </div>

      <div className="bg-gradient-to-r from-orange-50 to-orange-100 border border-orange-200 rounded-lg p-4">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-xs text-orange-700 font-semibold">PROJECT CODE</p>
            <p className="text-lg font-bold text-orange-900">{project?.p6ProjectCode || 'CHEMPREP-001'}</p>
          </div>
          <div>
            <p className="text-xs text-orange-700 font-semibold">PROJECT NAME</p>
            <p className="text-lg font-bold text-orange-900">{project?.name || 'ChemPrep Project'}</p>
          </div>
          <div>
            <p className="text-xs text-orange-700 font-semibold">START DATE</p>
            <p className="text-lg font-bold text-orange-900">{project?.startDate || new Date().toISOString().split('T')[0]}</p>
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <h4 className="font-semibold text-slate-900 mb-4">Export Opties</h4>
        <div className="grid grid-cols-2 gap-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={exportOptions.includeActivities} onChange={(e) => setExportOptions({...exportOptions, includeActivities: e.target.checked})} className="w-4 h-4 text-blue-600 rounded" />
            <span className="text-sm font-medium text-slate-700">Activities (TASK)</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={exportOptions.includeRelationships} onChange={(e) => setExportOptions({...exportOptions, includeRelationships: e.target.checked})} disabled={!exportOptions.includeActivities} className="w-4 h-4 text-blue-600 rounded" />
            <span className="text-sm font-medium text-slate-700">Relationships (TASKPRED)</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={exportOptions.includeResources} onChange={(e) => setExportOptions({...exportOptions, includeResources: e.target.checked})} className="w-4 h-4 text-blue-600 rounded" />
            <span className="text-sm font-medium text-slate-700">Resources (RSRC)</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={exportOptions.includeActivityCodes} onChange={(e) => setExportOptions({...exportOptions, includeActivityCodes: e.target.checked})} className="w-4 h-4 text-blue-600 rounded" />
            <span className="text-sm font-medium text-slate-700">Activity Codes (ACTVTYPE)</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={exportOptions.includeWBS} onChange={(e) => setExportOptions({...exportOptions, includeWBS: e.target.checked})} className="w-4 h-4 text-blue-600 rounded" />
            <span className="text-sm font-medium text-slate-700">WBS Structure (PROJWBS)</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={exportOptions.includeCalendars} onChange={(e) => setExportOptions({...exportOptions, includeCalendars: e.target.checked})} className="w-4 h-4 text-blue-600 rounded" />
            <span className="text-sm font-medium text-slate-700">Calendars (40h/week)</span>
          </label>
        </div>
      </div>

      {stats && (
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-xs text-blue-700 font-semibold">ACTIVITIES</p>
            <p className="text-2xl font-bold text-blue-900">{stats.activities}</p>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-xs text-green-700 font-semibold">RELATIONSHIPS</p>
            <p className="text-2xl font-bold text-green-900">{stats.relationships}</p>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <p className="text-xs text-purple-700 font-semibold">RESOURCES</p>
            <p className="text-2xl font-bold text-purple-900">{stats.resources}</p>
          </div>
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <p className="text-xs text-orange-700 font-semibold">WBS ELEMENTS</p>
            <p className="text-2xl font-bold text-orange-900">{stats.scopeItems}</p>
          </div>
        </div>
      )}

      {preview && (
        <div>
          <h4 className="font-semibold text-slate-900 mb-3">XER Preview (eerste 2000 characters)</h4>
          <div className="bg-slate-900 text-green-400 rounded-lg p-4 font-mono text-xs overflow-auto max-h-96">
            <pre>{preview}...</pre>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between pt-4 border-t border-slate-200">
        <div className="text-sm text-slate-600">
          Klaar om {scopeItems.reduce((sum, s) => sum + (s.plannedActivities?.length || 0), 0)} activities te exporteren
        </div>
        <div className="flex items-center gap-3">
          <button onClick={generateXER} disabled={isGenerating} className="px-4 py-2 text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-50">
            {isGenerating ? <><LoadingSpinner size="sm" /><span className="ml-2">Genereren...</span></> : 'Preview'}
          </button>
          <button onClick={handleDownload} disabled={isGenerating} className="flex items-center gap-2 px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:bg-slate-300">
            <Download className="w-4 h-4" />
            <span>Download XER</span>
          </button>
        </div>
      </div>

      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
        <h4 className="font-semibold text-orange-900 mb-2">ðŸ“˜ P6 Import Instructies</h4>
        <div className="text-sm text-orange-700 space-y-1">
          <p>1. In Primavera P6: File â†’ Import</p>
          <p>2. Selecteer XER format</p>
          <p>3. Browse naar .xer bestand</p>
          <p>4. Import options: Create new project</p>
          <p>5. Verify data en klik Import</p>
          <p>6. Tools â†’ Schedule om project te schedulen</p>
        </div>
      </div>
    </div>
  );
};

// ===== PROGRESS TRACKING TAB COMPONENT =====
// ===== PROGRESS TRACKING MODULE (STANDALONE) =====
const ProgressTracking = ({ scopeItems, setScopeItems, resources, suppliers, projectStartDate, templates }) => {
  const toast = useToast();
  const [selectedScope, setSelectedScope] = useState(null);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [showWerkpakketReport, setShowWerkpakketReport] = useState(false);
  const [progressInput, setProgressInput] = useState(0);
  const [hoursToday, setHoursToday] = useState(0);
  const [crewSize, setCrewSize] = useState(1);
  const [notes, setNotes] = useState('');
  const [photos, setPhotos] = useState([]);

  // QR Code Search - search by tag number
  const handleQRSearch = (qrText) => {
    const found = scopeItems.find(s => 
      s.tagNumber.toLowerCase() === qrText.toLowerCase() ||
      s.tagNumber.toLowerCase().includes(qrText.toLowerCase())
    );
    
    if (found) {
      setSelectedScope(found);
      setSearchTerm('');
      setShowQRScanner(false);
      toast.success('Pakket gevonden', found.tagNumber);
    } else {
      toast.error('Pakket niet gevonden', qrText);
    }
  };

  // Quick search
  const handleQuickSearch = () => {
    if (!searchTerm.trim()) return;
    handleQRSearch(searchTerm);
  };

  // Calculate overall progress
  const calculateOverallProgress = () => {
    let totalActivities = 0;
    let totalProgress = 0;
    
    scopeItems.forEach(scope => {
      (scope.plannedActivities || []).forEach(activity => {
        totalActivities++;
        totalProgress += (activity.progress || 0);
      });
    });
    
    return totalActivities > 0 ? Math.round(totalProgress / totalActivities) : 0;
  };

  const overallProgress = calculateOverallProgress();

  // Get activities by status
  const getActivitiesByStatus = () => {
    const byStatus = { planned: 0, active: 0, complete: 0, onHold: 0 };
    scopeItems.forEach(scope => {
      (scope.plannedActivities || []).forEach(activity => {
        if (activity.executionStatus === 'Completed') byStatus.complete++;
        else if (activity.executionStatus === 'In Progress') byStatus.active++;
        else if (activity.executionStatus === 'On Hold') byStatus.onHold++;
        else byStatus.planned++;
      });
    });
    return byStatus;
  };

  const statusCounts = getActivitiesByStatus();

  const handleSaveProgress = () => {
    if (!selectedScope || !selectedActivity) {
      toast.error('Selecteer eerst een activiteit');
      return;
    }

    const updatedScopes = scopeItems.map(scope => {
      if (scope.id === selectedScope.id) {
        const updatedActivities = scope.plannedActivities.map(activity => {
          if (activity.id === selectedActivity.id) {
            return {
              ...activity,
              progress: progressInput,
              lastUpdate: new Date().toISOString(),
              hoursToday: hoursToday,
              crewSize: crewSize,
              progressNotes: notes,
              photos: photos,
              executionStatus: progressInput === 100 ? 'Completed' : 
                              progressInput > 0 ? 'In Progress' : 'Planned'
            };
          }
          return activity;
        });
        return { ...scope, plannedActivities: updatedActivities };
      }
      return scope;
    });

    setScopeItems(updatedScopes);
    toast.success('Progress bijgewerkt', selectedActivity.activityId + ' - ' + progressInput + '%');
    
    // Don't reset - keep selection for next update
    setProgressInput(0);
    setHoursToday(0);
    setCrewSize(1);
    setNotes('');
    setPhotos([]);
  };

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    const newPhotos = files.map(file => ({
      id: 'photo-' + Date.now() + '-' + Math.random(),
      name: file.name,
      url: URL.createObjectURL(file),
      timestamp: new Date().toISOString()
    }));
    setPhotos([...photos, ...newPhotos]);
    toast.success(files.length + ' foto\'s toegevoegd');
  };

  const handleSelectActivity = (activity) => {
    setSelectedActivity(activity);
    setProgressInput(activity.progress || 0);
    setHoursToday(activity.hoursToday || 0);
    setCrewSize(activity.crewSize || 1);
    setNotes(activity.progressNotes || '');
    setPhotos(activity.photos || []);
  };

  return (
    <div className="h-full flex flex-col bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b px-8 py-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Progress Tracking</h2>
            <p className="text-sm text-slate-600 mt-1">Tablet-vriendelijke interface voor voortgang in het veld</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-3xl font-bold text-blue-600">{overallProgress}%</div>
              <div className="text-xs text-slate-500">Overall Progress</div>
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-slate-50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-slate-600">{statusCounts.planned}</div>
            <div className="text-xs text-slate-500">Planned</div>
          </div>
          <div className="bg-blue-50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-blue-600">{statusCounts.active}</div>
            <div className="text-xs text-blue-500">Active</div>
          </div>
          <div className="bg-green-50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-green-600">{statusCounts.complete}</div>
            <div className="text-xs text-green-500">Complete</div>
          </div>
          <div className="bg-orange-50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-orange-600">{statusCounts.onHold}</div>
            <div className="text-xs text-orange-500">On Hold</div>
          </div>
        </div>
      </div>

      {/* QR Scanner / Quick Search */}
      <div className="bg-white border-b px-8 py-4">
        <div className="flex items-center gap-3">
          <div className="flex-1 flex items-center gap-3">
            <QrCode className="w-6 h-6 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleQuickSearch()}
              placeholder="Scan QR code of typ Tag Number (bijv. V-401-A)..."
              className="flex-1 px-4 py-3 text-lg border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              onClick={handleQuickSearch}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
            >
              Zoek
            </button>
          </div>
        </div>
        {selectedScope && (
          <div className="mt-3 flex items-center justify-between bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div>
              <span className="font-semibold text-blue-900">{selectedScope.tagNumber}</span>
              <span className="text-blue-700 ml-2">{selectedScope.description}</span>
              <span className="text-blue-600 ml-2">({selectedScope.plannedActivities?.length || 0} activities)</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowWerkpakketReport(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <FileText className="w-4 h-4" />
                Werkpakket Report
              </button>
              <button
                onClick={() => {
                  setSelectedScope(null);
                  setSelectedActivity(null);
                  setSearchTerm('');
                }}
                className="p-2 hover:bg-blue-200 rounded"
              >
                <X className="w-5 h-5 text-blue-700" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Main Content - Split View */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Activities List */}
        <div className="w-1/2 border-r border-slate-200 bg-white overflow-y-auto">
          {selectedScope ? (
            <div className="p-4">
              <h3 className="font-semibold text-slate-900 mb-3">Activiteiten in {selectedScope.tagNumber}</h3>
              <div className="space-y-2">
                {(selectedScope.plannedActivities || []).map((activity) => (
                  <button
                    key={activity.id}
                    onClick={() => handleSelectActivity(activity)}
                    className={'w-full text-left p-4 rounded-lg border-2 transition-all ' + 
                      (selectedActivity?.id === activity.id 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50')}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-sm font-semibold text-slate-700">{activity.activityId}</span>
                      <span className={'text-xs px-2 py-1 rounded-full font-semibold ' + 
                        (activity.executionStatus === 'Completed' ? 'bg-green-100 text-green-700' :
                         activity.executionStatus === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                         activity.executionStatus === 'On Hold' ? 'bg-orange-100 text-orange-700' :
                         'bg-slate-100 text-slate-600')}>
                        {activity.executionStatus}
                      </span>
                    </div>
                    <div className="font-medium text-slate-900 mb-2">{activity.overrideDescription}</div>
                    <div className="flex items-center gap-4 text-xs text-slate-600">
                      <span>Duration: {activity.duration}d</span>
                      <span className="font-semibold text-blue-600">Progress: {activity.progress || 0}%</span>
                      {activity.lastUpdate && (
                        <span>Updated: {new Date(activity.lastUpdate).toLocaleDateString('nl-NL')}</span>
                      )}
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2 mt-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all"
                        style={{ width: (activity.progress || 0) + '%' }}
                      />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-center p-8">
              <div>
                <QrCode className="w-16 h-16 mx-auto text-slate-300 mb-4" />
                <p className="text-lg font-semibold text-slate-600">Scan of zoek een pakket</p>
                <p className="text-sm text-slate-500 mt-2">Gebruik de zoekbalk hierboven</p>
              </div>
            </div>
          )}
        </div>

        {/* Right: Progress Form */}
        <div className="w-1/2 bg-slate-50 overflow-y-auto">
          {selectedActivity ? (
            <div className="p-6 space-y-6">
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">Update Progress</h3>
                <p className="text-sm text-slate-600">{selectedActivity.activityId} - {selectedActivity.overrideDescription}</p>
              </div>

              {/* Progress Slider */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-medium text-slate-700">Progress</label>
                  <span className="text-4xl font-bold text-blue-600">{progressInput}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={progressInput}
                  onChange={(e) => setProgressInput(parseInt(e.target.value))}
                  className="w-full h-4 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-slate-500 mt-2">
                  <span>0%</span>
                  <span>25%</span>
                  <span>50%</span>
                  <span>75%</span>
                  <span>100%</span>
                </div>
              </div>

              {/* Hours & Crew */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Uren vandaag</label>
                  <input
                    type="number"
                    min="0"
                    step="0.5"
                    value={hoursToday}
                    onChange={(e) => setHoursToday(parseFloat(e.target.value))}
                    className="w-full px-4 py-3 text-lg border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="8"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Crew size</label>
                  <input
                    type="number"
                    min="1"
                    value={crewSize}
                    onChange={(e) => setCrewSize(parseInt(e.target.value))}
                    className="w-full px-4 py-3 text-lg border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="1"
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Notities</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Voeg notities toe over voortgang, problemen, of observaties..."
                />
              </div>

              {/* Photos */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Foto's ({photos.length})</label>
                <label className="flex items-center justify-center gap-2 px-6 py-4 bg-slate-100 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:bg-slate-200 transition-colors">
                  <Camera className="w-5 h-5 text-slate-600" />
                  <span className="font-medium text-slate-700">Voeg foto's toe</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </label>
                {photos.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 mt-3">
                    {photos.map(photo => (
                      <div key={photo.id} className="relative group">
                        <img 
                          src={photo.url} 
                          alt={photo.name}
                          className="w-full h-24 object-cover rounded border border-slate-200"
                        />
                        <button
                          onClick={() => setPhotos(photos.filter(p => p.id !== photo.id))}
                          className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Save Button */}
              <button
                onClick={handleSaveProgress}
                className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Save className="w-5 h-5" />
                Opslaan Progress
              </button>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-center p-8">
              <div>
                <Activity className="w-16 h-16 mx-auto text-slate-300 mb-4" />
                <p className="text-lg font-semibold text-slate-600">Selecteer een activiteit</p>
                <p className="text-sm text-slate-500 mt-2">Klik op een activiteit in de lijst</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Werkpakket Report Modal */}
      {showWerkpakketReport && selectedScope && (
        <ScopeItemDetailView
          scopeItem={selectedScope}
          onClose={() => setShowWerkpakketReport(false)}
          onUpdate={(updated) => {
            setScopeItems(scopeItems.map(s => s.id === updated.id ? updated : s));
            setSelectedScope(updated);
          }}
          resources={resources}
          suppliers={suppliers}
          projectStartDate={projectStartDate}
          templates={templates}
        />
      )}
    </div>
  );
};
// ===== LIBRARY HUB COMPONENT =====
const LibraryHub = ({
  project,
  templates,
  setTemplates,
  resources,
  setResources,
  suppliers,
  setSuppliers,
  materials,
  setMaterials,
  activityCodes,
  setActivityCodes,
  workflowStatuses,
  setWorkflowStatuses,
  docCategories,
  setDocCategories,
  scopeItems,
  setScopeItems,
  customColumns,
  setCustomColumns,
  defaultColumns,
  setDefaultColumns,
  isAdminMode
}) => {
  const [activeTab, setActiveTab] = useState('sapImport'); // Start on SAP Import tab
  const [searchTerm, setSearchTerm] = useState('');
  const [editingItem, setEditingItem] = useState(null);
  const [showEditor, setShowEditor] = useState(false);

  const tabs = [
    { id: 'sapImport', label: 'SAP Import', icon: Database, count: null },
    { id: 'p6Export', label: 'P6 Export', icon: FileOutput, count: null },
    { id: 'progressTracking', label: 'Progress Tracking', icon: Activity, count: null },
    { id: 'columns', label: 'Kolommen', icon: Table, count: customColumns?.length || 0 },
    { id: 'templates', label: 'Templates', icon: FileText, count: templates.length },
    { id: 'resources', label: 'Resources', icon: Users, count: resources.length },
    { id: 'suppliers', label: 'Suppliers', icon: Building2, count: suppliers.length },
    { id: 'materials', label: 'Materials', icon: Box, count: materials.length },
    { id: 'activityCodes', label: 'Activity Codes', icon: Tag, count: activityCodes.length },
    { id: 'workflowStatuses', label: 'Workflow Statuses', icon: Circle, count: workflowStatuses.length },
    { id: 'docCategories', label: 'Document Categories', icon: FolderOpen, count: docCategories.length },
  ];

  const handleAdd = (type) => {
    setEditingItem({ type, data: null });
    setShowEditor(true);
  };

  const handleEdit = (type, item) => {
    setEditingItem({ type, data: item });
    setShowEditor(true);
  };

  const handleDelete = (type, id) => {
    if (!confirm('Weet je zeker dat je dit item wilt verwijderen?')) return;

    switch (type) {
      case 'templates':
        setTemplates(templates.filter(t => t.id !== id));
        break;
      case 'resources':
        setResources(resources.filter(r => r.id !== id));
        break;
      case 'suppliers':
        setSuppliers(suppliers.filter(s => s.id !== id));
        break;
      case 'materials':
        setMaterials(materials.filter(m => m.id !== id));
        break;
      case 'activityCodes':
        setActivityCodes(activityCodes.filter(ac => ac.id !== id));
        break;
      case 'workflowStatuses':
        setWorkflowStatuses(workflowStatuses.filter(ws => ws.id !== id));
        break;
      case 'docCategories':
        setDocCategories(docCategories.filter(dc => dc.id !== id));
        break;
    }
  };

  const handleSave = (type, data) => {
    const isNew = !data.id;
    const newData = isNew ? { ...data, id: `${type}-${Date.now()}` } : data;

    switch (type) {
      case 'templates':
        setTemplates(isNew ? [...templates, newData] : templates.map(t => t.id === newData.id ? newData : t));
        break;
      case 'resources':
        setResources(isNew ? [...resources, newData] : resources.map(r => r.id === newData.id ? newData : r));
        break;
      case 'suppliers':
        setSuppliers(isNew ? [...suppliers, newData] : suppliers.map(s => s.id === newData.id ? newData : s));
        break;
      case 'materials':
        setMaterials(isNew ? [...materials, newData] : materials.map(m => m.id === newData.id ? newData : m));
        break;
      case 'activityCodes':
        setActivityCodes(isNew ? [...activityCodes, newData] : activityCodes.map(ac => ac.id === newData.id ? newData : ac));
        break;
      case 'workflowStatuses':
        setWorkflowStatuses(isNew ? [...workflowStatuses, newData] : workflowStatuses.map(ws => ws.id === newData.id ? newData : ws));
        break;
      case 'docCategories':
        setDocCategories(isNew ? [...docCategories, newData] : docCategories.map(dc => dc.id === newData.id ? newData : dc));
        break;
    }

    setShowEditor(false);
    setEditingItem(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Library Hub</h2>
        <p className="text-slate-600">Centraal beheer van alle master data en templates</p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="border-b">
          <div className="flex overflow-x-auto">
            {tabs.map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setSearchTerm('');
                  }}
                  className={`flex items-center gap-2 px-6 py-4 border-b-2 transition-colors whitespace-nowrap ${
                    isActive
                      ? 'border-blue-500 text-blue-600 bg-blue-50'
                      : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="font-medium">{tab.label}</span>
                  {tab.count !== null && (
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      isActive ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'sapImport' && (
            <SAPImportTab
              scopeItems={scopeItems}
              setScopeItems={setScopeItems}
            />
          )}
          {activeTab === 'p6Export' && (
            <P6ExportTab
              project={project}
              scopeItems={scopeItems}
              resources={resources}
              activityCodes={activityCodes}
            />
          )}
          {activeTab === 'progressTracking' && (
            <ProgressTracking
              scopeItems={scopeItems}
              setScopeItems={setScopeItems}
              resources={resources}
              project={project}
            />
          )}
          {activeTab === 'columns' && (
            <ColumnLibrary
              customColumns={customColumns}
              setCustomColumns={setCustomColumns}
              defaultColumns={defaultColumns}
              setDefaultColumns={setDefaultColumns}
              isAdminMode={isAdminMode}
            />
          )}
          {activeTab === 'templates' && (
            <TemplatesTab
              templates={templates}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              onAdd={() => handleAdd('templates')}
              onEdit={(item) => handleEdit('templates', item)}
              onDelete={(id) => handleDelete('templates', id)}
              scopeItems={scopeItems}
              resources={resources}
            />
          )}
          {activeTab === 'resources' && (
            <ResourcesTab
              resources={resources}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              onAdd={() => handleAdd('resources')}
              onEdit={(item) => handleEdit('resources', item)}
              onDelete={(id) => handleDelete('resources', id)}
            />
          )}
          {activeTab === 'suppliers' && (
            <SuppliersTab
              suppliers={suppliers}
              resources={resources}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              onAdd={() => handleAdd('suppliers')}
              onEdit={(item) => handleEdit('suppliers', item)}
              onDelete={(id) => handleDelete('suppliers', id)}
            />
          )}
          {activeTab === 'materials' && (
            <MaterialsTab
              materials={materials}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              onAdd={() => handleAdd('materials')}
              onEdit={(item) => handleEdit('materials', item)}
              onDelete={(id) => handleDelete('materials', id)}
            />
          )}
          {activeTab === 'activityCodes' && (
            <ActivityCodesTab
              activityCodes={activityCodes}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              onAdd={() => handleAdd('activityCodes')}
              onEdit={(item) => handleEdit('activityCodes', item)}
              onDelete={(id) => handleDelete('activityCodes', id)}
            />
          )}
          {activeTab === 'workflowStatuses' && (
            <WorkflowStatusesTab
              workflowStatuses={workflowStatuses}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              onAdd={() => handleAdd('workflowStatuses')}
              onEdit={(item) => handleEdit('workflowStatuses', item)}
              onDelete={(id) => handleDelete('workflowStatuses', id)}
              scopeItems={scopeItems}
            />
          )}
          {activeTab === 'docCategories' && (
            <DocCategoriesTab
              docCategories={docCategories}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              onAdd={() => handleAdd('docCategories')}
              onEdit={(item) => handleEdit('docCategories', item)}
              onDelete={(id) => handleDelete('docCategories', id)}
            />
          )}
        </div>
      </div>

      {/* Editor Modal */}
      {showEditor && editingItem && (
        <LibraryItemEditor
          type={editingItem.type}
          item={editingItem.data}
          onSave={(data) => handleSave(editingItem.type, data)}
          onClose={() => {
            setShowEditor(false);
            setEditingItem(null);
          }}
          resources={resources}
        />
      )}
    </div>
  );
};

// ===== TEMPLATES TAB =====
const TemplatesTab = ({ templates, searchTerm, setSearchTerm, onAdd, onEdit, onDelete, scopeItems, resources }) => {
  const filtered = templates.filter(t =>
    t.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getUsageCount = (templateId) => {
    return scopeItems.reduce((count, item) => {
      return count + (item.plannedActivities?.filter(a => a.templateId === templateId).length || 0);
    }, 0);
  };

  return (
    <div className="space-y-4">
      {showBulkEdit && <BulkEditPanel selectedIds={selectedItems} scopeItems={filteredItems} onApply={handleBulkApply} onClose={() => setShowBulkEdit(false)} />}
      <div className="flex items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Zoek templates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          onClick={onAdd}
          className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Nieuwe Template
        </button>
      </div>

      <div className="grid gap-3">
        {filtered.map(template => {
          const usageCount = getUsageCount(template.id);
          return (
            <div key={template.id} className="bg-slate-50 border border-slate-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-mono text-sm font-semibold text-blue-600">{template.code}</span>
                    <span className="text-xs px-2 py-1 bg-slate-200 text-slate-700 rounded-full">{template.category}</span>
                    {template.defaultPhase && (
                      <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">{template.defaultPhase}</span>
                    )}
                    {!template.isAdjustable && (
                      <span className="text-xs px-2 py-1 bg-orange-100 text-orange-700 rounded-full">Fixed</span>
                    )}
                  </div>
                  <p className="text-sm text-slate-900 font-medium mb-2">{template.description}</p>
                  <div className="flex items-center gap-4 text-xs text-slate-600">
                    <span>{template.resources?.length || 0} resources</span>
                    <span>{template.materials?.length || 0} materials</span>
                    {usageCount > 0 && (
                      <span className="text-blue-600">âœ“ Gebruikt in {usageCount} activiteiten</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onEdit(template)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete(template.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-slate-500">
          <FileText className="w-12 h-12 mx-auto mb-3 text-slate-400" />
          <p>Geen templates gevonden</p>
        </div>
      )}
    </div>
  );
};

// ===== RESOURCES TAB =====
const ResourcesTab = ({ resources, searchTerm, setSearchTerm, onAdd, onEdit, onDelete }) => {
  const filtered = resources.filter(r =>
    r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const groupedByType = {
    Labor: filtered.filter(r => r.type === ResourceType.LABOR),
    Equipment: filtered.filter(r => r.type === ResourceType.EQUIPMENT),
    Material: filtered.filter(r => r.type === ResourceType.MATERIAL),
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Zoek resources..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          onClick={onAdd}
          className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Nieuwe Resource
        </button>
      </div>

      {Object.entries(groupedByType).map(([type, items]) => items.length > 0 && (
        <div key={type}>
          <h3 className="text-sm font-semibold text-slate-700 mb-2">{type}</h3>
          <div className="grid gap-2">
            {items.map(resource => (
              <div key={resource.id} className="bg-slate-50 border border-slate-200 rounded-lg p-3 hover:border-blue-300 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-900">{resource.name}</p>
                    <p className="text-xs text-slate-600">
                      Unit: {resource.unit}
                      {resource.defaultUnitsPerTime && ` | Default: ${resource.defaultUnitsPerTime}/dag`}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onEdit(resource)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(resource.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {filtered.length === 0 && (
        <div className="text-center py-12 text-slate-500">
          <Users className="w-12 h-12 mx-auto mb-3 text-slate-400" />
          <p>Geen resources gevonden</p>
        </div>
      )}
    </div>
  );
};

// ===== SUPPLIERS TAB =====
const SuppliersTab = ({ suppliers, resources, searchTerm, setSearchTerm, onAdd, onEdit, onDelete }) => {
  const filtered = suppliers.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.costAccountId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Zoek suppliers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          onClick={onAdd}
          className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Nieuwe Supplier
        </button>
      </div>

      <div className="grid gap-3">
        {filtered.map(supplier => (
          <div key={supplier.id} className="bg-slate-50 border border-slate-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-semibold text-slate-900">{supplier.name}</h3>
                  <span className="text-xs px-2 py-1 bg-slate-200 text-slate-700 rounded-full">{supplier.category}</span>
                </div>
                <p className="text-xs text-slate-600 mb-2 font-mono">{supplier.costAccountId}</p>
                <div className="flex flex-wrap gap-2">
                  {supplier.rates.map((rate, idx) => {
                    const resource = resources.find(r => r.id === rate.resourceId);
                    return resource ? (
                      <span key={idx} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
                        {resource.name}: â‚¬ {rate.rate}/uur
                      </span>
                    ) : null;
                  })}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onEdit(supplier)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDelete(supplier.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-slate-500">
          <Building2 className="w-12 h-12 mx-auto mb-3 text-slate-400" />
          <p>Geen suppliers gevonden</p>
        </div>
      )}
    </div>
  );
};

// ===== MATERIALS TAB =====
const MaterialsTab = ({ materials, searchTerm, setSearchTerm, onAdd, onEdit, onDelete }) => {
  const filtered = materials.filter(m =>
    m.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.articleNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.supplier.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Zoek materials..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          onClick={onAdd}
          className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Nieuw Material
        </button>
      </div>

      <div className="grid gap-3">
        {filtered.map(material => (
          <div key={material.id} className="bg-slate-50 border border-slate-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-medium text-slate-900 mb-1">{material.description}</h3>
                <div className="flex items-center gap-4 text-xs text-slate-600">
                  <span>Art: {material.articleNumber}</span>
                  <span>â‚¬ {material.price} / {material.unit}</span>
                  <span>{material.supplier}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onEdit(material)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDelete(material.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-slate-500">
          <Box className="w-12 h-12 mx-auto mb-3 text-slate-400" />
          <p>Geen materials gevonden</p>
        </div>
      )}
    </div>
  );
};

// ===== ACTIVITY CODES TAB =====
const ActivityCodesTab = ({ activityCodes, searchTerm, setSearchTerm, onAdd, onEdit, onDelete }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Zoek activity codes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          onClick={onAdd}
          className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Nieuwe Activity Code
        </button>
      </div>

      <div className="grid gap-3">
        {activityCodes.map(code => (
          <div key={code.id} className="bg-slate-50 border border-slate-200 rounded-lg p-4">
            <div className="flex items-start justify-between mb-3">
              <h3 className="font-semibold text-slate-900">{code.name}</h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onEdit(code)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDelete(code.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {code.values.map(value => (
                <span key={value.id} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
                  {value.value} - {value.description}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ===== WORKFLOW STATUSES TAB =====
const WorkflowStatusesTab = ({ workflowStatuses, searchTerm, setSearchTerm, onAdd, onEdit, onDelete, scopeItems }) => {
  const getUsageCount = (statusId) => {
    return scopeItems.filter(item => item.workflowStatusId === statusId).length;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Zoek workflow statuses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          onClick={onAdd}
          className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Nieuwe Status
        </button>
      </div>

      <div className="grid gap-2">
        {workflowStatuses.map(status => {
          const usageCount = getUsageCount(status.id);
          return (
            <div key={status.id} className="bg-slate-50 border border-slate-200 rounded-lg p-3 hover:border-blue-300 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <div 
                    className="w-4 h-4 rounded-full" 
                    style={{ backgroundColor: status.color }}
                  ></div>
                  <span className="font-medium text-slate-900">{status.name}</span>
                  {usageCount > 0 && (
                    <span className="text-xs text-slate-600">({usageCount} items)</span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onEdit(status)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete(status.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ===== DOC CATEGORIES TAB =====
const DocCategoriesTab = ({ docCategories, searchTerm, setSearchTerm, onAdd, onEdit, onDelete }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Zoek document categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          onClick={onAdd}
          className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Nieuwe Category
        </button>
      </div>

      <div className="grid gap-2">
        {docCategories.map(category => (
          <div key={category.id} className="bg-slate-50 border border-slate-200 rounded-lg p-3 hover:border-blue-300 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FolderOpen className="w-4 h-4 text-slate-400" />
                <span className="font-medium text-slate-900">{category.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onEdit(category)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDelete(category.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ===== LIBRARY ITEM EDITOR (SIMPLE VERSION) =====
const LibraryItemEditor = ({ type, item, onSave, onClose, resources }) => {
  const [formData, setFormData] = useState(item || {});

  const renderForm = () => {
    switch (type) {
      case 'materials':
        return (
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Beschrijving"
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
            />
            <input
              type="text"
              placeholder="Artikel nummer"
              value={formData.articleNumber || ''}
              onChange={(e) => setFormData({ ...formData, articleNumber: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
            />
            <input
              type="text"
              placeholder="Supplier"
              value={formData.supplier || ''}
              onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
            />
            <div className="grid grid-cols-2 gap-4">
              <input
                type="number"
                placeholder="Prijs"
                value={formData.price || ''}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 border rounded-lg"
              />
              <input
                type="text"
                placeholder="Unit (st, m, kg)"
                value={formData.unit || ''}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
          </div>
        );
      case 'workflowStatuses':
        return (
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Status naam"
              value={formData.name || ''}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
            />
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Kleur</label>
              <input
                type="color"
                value={formData.color || '#3b82f6'}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                className="w-full h-10 border rounded-lg"
              />
            </div>
          </div>
        );
      case 'docCategories':
        return (
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Category naam"
              value={formData.name || ''}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
        );
      default:
        return <p className="text-slate-600">Editor voor {type} komt binnenkort...</p>;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-2xl font-bold">
                {item ? 'Bewerken' : 'Nieuw'} - {type}
              </h3>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {renderForm()}
        </div>

        <div className="border-t p-6 bg-slate-50 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors"
          >
            Annuleren
          </button>
          <button
            onClick={() => printWerkpakket(formData, null)}
            className="flex items-center gap-2 px-4 py-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors text-sm"
          >
            <Printer className="w-4 h-4" />
            Afdrukken
          </button>
          <button
            onClick={() => onSave(formData)}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Opslaan
          </button>
        </div>
      </div>
    </div>
  );
};

// ===== GANTT CHART MODAL =====
const GanttChartModal = ({ 
  scopeItem, 
  onClose, 
  onEditActivity,
  projectStartDate,
  resources,
  suppliers
}) => {
  const [zoomLevel, setZoomLevel] = useState('day'); // day, week, month
  const [groupByPhase, setGroupByPhase] = useState(true);

  const activities = scopeItem.plannedActivities || [];
  const activitiesWithDates = calculateActivityDates(activities, projectStartDate);
  
  // Calculate project timeline bounds
  const projectStart = new Date(projectStartDate);
  let earliestStart = projectStart;
  let latestEnd = projectStart;
  
  activitiesWithDates.forEach(activity => {
    if (activity.calculatedStart && activity.calculatedStart < earliestStart) earliestStart = activity.calculatedStart;
    if (activity.calculatedEnd && activity.calculatedEnd > latestEnd) latestEnd = activity.calculatedEnd;
  });
  
  // Add padding
  earliestStart = new Date(earliestStart.getTime() - 7 * 24 * 60 * 60 * 1000);
  latestEnd = new Date(latestEnd.getTime() + 7 * 24 * 60 * 60 * 1000);
  
  const totalDays = Math.ceil((latestEnd - earliestStart) / (24 * 60 * 60 * 1000));
  const dayWidth = zoomLevel === 'day' ? 40 : zoomLevel === 'week' ? 20 : 10;
  const timelineWidth = totalDays * dayWidth;
  
  // Generate timeline dates
  const timelineDates = [];
  const currentDate = new Date(earliestStart);
  while (currentDate <= latestEnd) {
    timelineDates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  // Group activities by phase if needed
  const phases = ['PRE-TA', 'UITBEDRIJF', 'TA', 'INBEDRIJF', 'POST-TA'];
  const groupedActivities = groupByPhase
    ? phases.map(phase => ({
        phase,
        activities: activities.filter(a => a.phase === phase)
      })).filter(g => g.activities.length > 0)
    : [{ phase: 'All', activities }];
  
  const getBarPosition = (activity) => {
    const activityData = activitiesWithDates.find(a => a.id === activity.id);
    if (!activityData || !activityData.calculatedStart) return { left: 0, width: 0 };
    
    const startOffset = Math.floor((activityData.calculatedStart - earliestStart) / (24 * 60 * 60 * 1000));
    const duration = activity.duration || 1;
    
    return {
      left: startOffset * dayWidth,
      width: duration * dayWidth
    };
  };
  
  const getPhaseColor = (phase) => {
    switch(phase) {
      case 'PRE-TA': return 'bg-blue-500';
      case 'UITBEDRIJF': return 'bg-purple-500';
      case 'TA': return 'bg-green-500';
      case 'INBEDRIJF': return 'bg-yellow-500';
      case 'POST-TA': return 'bg-orange-500';
      default: return 'bg-slate-500';
    }
  };
  
  const formatDate = (date) => {
    return date.toLocaleDateString('nl-NL', { day: '2-digit', month: 'short' });
  };
  
  // Find critical path (simplified - activities with no float)
  const criticalPath = new Set();
  Object.values(activitiesWithDates).forEach(activity => {
    if (activity.relationships && activity.relationships.length > 0) {
      // Simplified: mark activities with dependencies
      criticalPath.add(activity.id);
    }
  });

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-7xl max-h-[95vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-2xl font-bold mb-2">Gantt Chart Timeline</h3>
              <p className="text-green-100">{scopeItem.tagNumber} - {scopeItem.description}</p>
              <p className="text-sm text-green-100 mt-2">
                {activities.length} activities | {totalDays} dagen | 
                Start: {formatDate(projectStart)}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Controls */}
        <div className="border-b p-4 bg-slate-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-600">Zoom:</span>
                <div className="flex gap-1 bg-white border border-slate-300 rounded-lg p-1">
                  <button
                    onClick={() => setZoomLevel('day')}
                    className={`px-3 py-1 rounded text-xs ${
                      zoomLevel === 'day' ? 'bg-blue-500 text-white' : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    Dag
                  </button>
                  <button
                    onClick={() => setZoomLevel('week')}
                    className={`px-3 py-1 rounded text-xs ${
                      zoomLevel === 'week' ? 'bg-blue-500 text-white' : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    Week
                  </button>
                  <button
                    onClick={() => setZoomLevel('month')}
                    className={`px-3 py-1 rounded text-xs ${
                      zoomLevel === 'month' ? 'bg-blue-500 text-white' : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    Maand
                  </button>
                </div>
              </div>
              
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={groupByPhase}
                  onChange={(e) => setGroupByPhase(e.target.checked)}
                  className="rounded"
                />
                <span className="text-slate-600">Groepeer per Phase</span>
              </label>
            </div>
            
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded"></div>
                <span className="text-slate-600">Hold Point</span>
              </div>
              <div className="flex items-center gap-2">
                <Link2 className="w-3 h-3 text-blue-500" />
                <span className="text-slate-600">Dependencies</span>
              </div>
            </div>
          </div>
        </div>

        {/* Gantt Chart */}
        <div className="flex-1 overflow-auto">
          <div className="min-w-max">
            {/* Timeline Header */}
            <div className="sticky top-0 z-10 bg-white border-b">
              <div className="flex">
                {/* Activity Names Column */}
                <div className="w-80 flex-shrink-0 border-r bg-slate-50">
                  <div className="h-12 flex items-center px-4 border-b font-semibold text-slate-700 text-sm">
                    Activity
                  </div>
                </div>
                
                {/* Timeline Dates */}
                <div className="flex-1 relative" style={{ width: timelineWidth }}>
                  <div className="flex h-12">
                    {timelineDates.filter((_, i) => 
                      zoomLevel === 'day' ? true :
                      zoomLevel === 'week' ? i % 7 === 0 :
                      i % 30 === 0
                    ).map((date, i) => (
                      <div
                        key={i}
                        className="flex-shrink-0 border-l px-2 py-1 text-xs text-slate-600"
                        style={{ width: dayWidth * (zoomLevel === 'day' ? 1 : zoomLevel === 'week' ? 7 : 30) }}
                      >
                        <div className="font-medium">{formatDate(date)}</div>
                        {zoomLevel === 'day' && (
                          <div className="text-slate-400">
                            {date.toLocaleDateString('nl-NL', { weekday: 'short' })}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Activity Rows */}
            <div>
              {groupedActivities.map((group, groupIdx) => (
                <div key={groupIdx}>
                  {groupByPhase && (
                    <div className="bg-slate-100 border-b">
                      <div className="flex">
                        <div className="w-80 flex-shrink-0 border-r px-4 py-2">
                          <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold text-white ${getPhaseColor(group.phase)}`}>
                            {group.phase}
                          </span>
                        </div>
                        <div className="flex-1"></div>
                      </div>
                    </div>
                  )}
                  
                  {group.activities.map((activity, actIdx) => {
                    const activityData = activitiesWithDates.find(a => a.id === activity.id);
                    const barPos = getBarPosition(activity);
                    const resource = resources.find(r => r.id === activity.resources[0]?.resourceId);
                    const isCritical = criticalPath.has(activity.id);
                    
                    return (
                      <div key={activity.id} className="border-b hover:bg-blue-50/50 transition-colors group">
                        <div className="flex">
                          {/* Activity Info Column */}
                          <div className="w-80 flex-shrink-0 border-r p-3">
                            <div className="flex items-start gap-2">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-mono text-xs font-semibold text-slate-500">
                                    {activity.activityId}
                                  </span>
                                  {activity.holdPoint && (
                                    <span className="bg-red-100 text-red-700 text-xs px-1.5 py-0.5 rounded font-semibold">
                                      HOLD
                                    </span>
                                  )}
                                  {activity.relationships && activity.relationships.length > 0 && (
                                    <Link2 className="w-3 h-3 text-blue-500" />
                                  )}
                                </div>
                                <p className="text-sm text-slate-900 truncate">
                                  {activity.overrideDescription}
                                </p>
                                {resource && (
                                  <p className="text-xs text-slate-500 mt-1 truncate">
                                    {activity.resources[0].units}h - {resource.name}
                                  </p>
                                )}
                              </div>
                              <button
                                onClick={() => onEditActivity(activity)}
                                className="opacity-0 group-hover:opacity-100 p-1 text-blue-600 hover:bg-blue-100 rounded transition-all"
                              >
                                <Edit2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                          
                          {/* Timeline Column */}
                          <div className="flex-1 relative" style={{ width: timelineWidth }}>
                            {/* Grid Lines */}
                            <div className="absolute inset-0 flex">
                              {timelineDates.map((_, i) => (
                                <div
                                  key={i}
                                  className="flex-shrink-0 border-l border-slate-200"
                                  style={{ width: dayWidth }}
                                />
                              ))}
                            </div>
                            
                            {/* Activity Bar */}
                            {activityData && (
                              <div className="relative h-full py-2">
                                <div
                                  className={`absolute top-2 h-8 rounded ${getPhaseColor(activity.phase)} 
                                    ${activity.holdPoint ? 'ring-2 ring-red-500' : ''} 
                                    ${isCritical ? 'ring-2 ring-yellow-400' : ''}
                                    shadow hover:shadow-lg transition-shadow cursor-pointer group/bar`}
                                  style={{
                                    left: barPos.left,
                                    width: barPos.width
                                  }}
                                  onClick={() => onEditActivity(activity)}
                                >
                                  <div className="h-full flex items-center justify-center px-2">
                                    <span className="text-xs font-medium text-white truncate">
                                      {activity.duration}d
                                    </span>
                                  </div>
                                  
                                  {/* Tooltip */}
                                  <div className="absolute bottom-full left-0 mb-2 opacity-0 group-hover/bar:opacity-100 transition-opacity pointer-events-none z-20">
                                    <div className="bg-slate-900 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap shadow-xl">
                                      <div className="font-semibold mb-1">{activity.overrideDescription}</div>
                                      <div className="text-slate-300">
                                        Start: {formatDate(activityData.calculatedStart)}
                                      </div>
                                      <div className="text-slate-300">
                                        Eind: {formatDate(activityData.calculatedEnd)}
                                      </div>
                                      <div className="text-slate-300">
                                        Duration: {activity.duration} dagen
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                
                                {/* Dependencies Lines */}
                                {activity.relationships && activity.relationships.map((rel, relIdx) => {
                                  const predActivity = activities.find(a => a.id === rel.predecessorActivityId);
                                  if (!predActivity) return null;
                                  
                                  const predData = activitiesWithDates.find(a => a.id === predActivity.id);
                                  if (!predData) return null;
                                  
                                  const predPos = getBarPosition(predActivity);
                                  const thisPos = barPos;
                                  
                                  // Simple arrow from end of predecessor to start of this activity
                                  const lineStartX = predPos.left + predPos.width;
                                  const lineEndX = thisPos.left;
                                  const lineY = 18; // Middle of bar
                                  
                                  return (
                                    <svg
                                      key={relIdx}
                                      className="absolute top-0 pointer-events-none"
                                      style={{ left: 0, top: 0, width: timelineWidth, height: '100%' }}
                                    >
                                      <defs>
                                        <marker
                                          id={`arrow-${activity.id}-${relIdx}`}
                                          markerWidth="10"
                                          markerHeight="10"
                                          refX="9"
                                          refY="3"
                                          orient="auto"
                                          markerUnits="strokeWidth"
                                        >
                                          <path d="M0,0 L0,6 L9,3 z" fill="#3b82f6" />
                                        </marker>
                                      </defs>
                                      <path
                                        d={`M ${lineStartX} ${lineY} L ${lineEndX} ${lineY}`}
                                        stroke="#3b82f6"
                                        strokeWidth="2"
                                        fill="none"
                                        markerEnd={`url(#arrow-${activity.id}-${relIdx})`}
                                      />
                                      {/* Relationship Type Label */}
                                      <text
                                        x={(lineStartX + lineEndX) / 2}
                                        y={lineY - 5}
                                        className="text-xs fill-blue-600 font-semibold"
                                        textAnchor="middle"
                                      >
                                        {rel.type}
                                      </text>
                                    </svg>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
            
            {activities.length === 0 && (
              <div className="text-center py-12 text-slate-500">
                <Calendar className="w-12 h-12 mx-auto mb-3 text-slate-400" />
                <p>Geen activiteiten gepland</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t p-4 bg-slate-50">
          <div className="flex justify-between items-center">
            <div className="text-sm text-slate-600">
              <strong>Tip:</strong> Klik op een activity bar om te bewerken
            </div>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors"
            >
              Sluiten
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ===== ACTIVITY EDITOR MODAL =====
const ActivityEditorModal = ({
  activity,
  scopeItem,
  onSave,
  onClose,
  onDelete,
  resources,
  materials,
  suppliers,
  templates,
  allActivitiesInScope
}) => {
  const [formData, setFormData] = useState(activity ? { ...activity, calculation: activity.calculation !== undefined ? activity.calculation : null, tra: activity.tra || { approved: false, approvedBy: '', approvedDate: '', permits: {}, ppe: {}, risks: activity.risks || [] } } : {
    id: `pa-${Date.now()}`,
    templateId: '',
    activityId: '',
    overrideDescription: '',
    wbsId: '0',
    wbsCode: '',
    duration: 1,
    phase: 'TA',
    resources: [],
    materials: [],
    risks: [],
    holdPoint: false,
    relationships: [],
    activityCodes: {},
    udfValues: {},
    executionStatus: 'Planned',
    progress: 0,
    steps: [],
    calculation: null,
    tra: { approved: false, approvedBy: '', approvedDate: '', permits: {}, ppe: {}, risks: [] }
  });

  const [showMaterialSearch, setShowMaterialSearch] = useState(false);
  const [materialSearchTerm, setMaterialSearchTerm] = useState('');
  const [showRiskForm, setShowRiskForm] = useState(false);
  const [newRisk, setNewRisk] = useState({ hazard: '', measure: '' });
  const [selectedTemplateId, setSelectedTemplateId] = useState(activity?.templateId || '');
  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});
  const [activeTab, setActiveTab] = useState('basis'); // New: tabs

  const phases = ['PRE-TA', 'UITBEDRIJF', 'TA', 'INBEDRIJF', 'POST-TA'];

  // Form validation
  useEffect(() => {
    const newErrors = {};
    
    // Activity ID is auto-generated, no validation needed
    
    if (touched.overrideDescription && !formData.overrideDescription) {
      newErrors.overrideDescription = 'Beschrijving is verplicht';
    }
    
    setErrors(newErrors);
  }, [formData.overrideDescription, touched]);

  const hasErrors = Object.keys(errors).length > 0;
  const canSave = formData.activityId && formData.overrideDescription && !hasErrors;

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // ESC = close
      if (e.key === 'Escape') {
        onClose();
      }
      // Ctrl/Cmd + S = save
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        // Validate before saving
        if (formData.activityId && formData.overrideDescription) {
          onSave(formData);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [formData, onClose, onSave]);

  // Template auto-fill handler
  const handleTemplateSelect = (templateId) => {
    setSelectedTemplateId(templateId);
    
    if (!templateId) return;
    
    const template = templates.find(t => t.id === templateId);
    if (!template) return;

    // Auto-fill from template
    setFormData(prev => ({
      ...prev,
      templateId: template.id,
      overrideDescription: prev.overrideDescription || template.description,
      phase: template.defaultPhase || prev.phase,
      // Convert template resources to activity resources format
      resources: template.resources?.map((tr, idx) => ({
        resourceId: tr.resourceId,
        units: tr.quantity || 8,
        unitsPerTime: 8,
        allocatedSupplierId: ''
      })) || prev.resources,
      // Convert template materials to activity materials format
      materials: template.materials?.map((tm, idx) => ({
        id: `mat-assign-${Date.now()}-${idx}`,
        materialId: tm.materialId,
        quantity: tm.quantity || 1
      })) || prev.materials,
      // Keep existing values for duration, holdPoint, etc.
      duration: prev.duration || 1,
    }));
  };

  const selectedTemplate = templates.find(t => t.id === selectedTemplateId);

  const handleAddResource = () => {
    const duration = formData.duration || 1;
    const defaultUnitsPerTime = 1;
    setFormData({
      ...formData,
      resources: [...formData.resources, { 
        resourceId: '', 
        unitsPerTime: defaultUnitsPerTime, 
        units: defaultUnitsPerTime * duration, 
        allocatedSupplierId: '' 
      }]
    });
  };

  const handleUpdateResource = (index, field, value) => {
    const newResources = [...formData.resources];
    newResources[index][field] = value;
    
    // Auto-calculate units when duration or unitsPerTime changes
    if (field === 'unitsPerTime') {
      // unitsPerTime changed â†’ recalculate units
      const duration = formData.duration || 1;
      newResources[index].units = (value || 0) * duration;
    }
    
    setFormData({ ...formData, resources: newResources });
  };

  const handleRemoveResource = (index) => {
    setFormData({
      ...formData,
      resources: formData.resources.filter((_, i) => i !== index)
    });
  };

  const handleAddMaterial = (material) => {
    const exists = formData.materials.find(m => m.materialId === material.id);
    if (!exists) {
      setFormData({
        ...formData,
        materials: [...formData.materials, { id: `mat-assign-${Date.now()}`, materialId: material.id, quantity: 1 }]
      });
    }
    setShowMaterialSearch(false);
    setMaterialSearchTerm('');
  };

  const handleUpdateMaterialQuantity = (index, quantity) => {
    const newMaterials = [...formData.materials];
    newMaterials[index].quantity = parseInt(quantity) || 0;
    setFormData({ ...formData, materials: newMaterials });
  };

  const handleRemoveMaterial = (index) => {
    setFormData({
      ...formData,
      materials: formData.materials.filter((_, i) => i !== index)
    });
  };

  const handleAddRisk = () => {
    if (newRisk.hazard && newRisk.measure) {
      setFormData({
        ...formData,
        risks: [...formData.risks, { id: `risk-${Date.now()}`, ...newRisk }]
      });
      setNewRisk({ hazard: '', measure: '' });
      setShowRiskForm(false);
    }
  };

  const handleRemoveRisk = (index) => {
    setFormData({
      ...formData,
      risks: formData.risks.filter((_, i) => i !== index)
    });
  };

  const handleAddRelationship = () => {
    setFormData({
      ...formData,
      relationships: [...formData.relationships, { predecessorActivityId: '', type: 'FS', lag: 0 }]
    });
  };

  const handleUpdateRelationship = (index, field, value) => {
    const newRelationships = [...formData.relationships];
    newRelationships[index][field] = value;
    setFormData({ ...formData, relationships: newRelationships });
  };

  const handleRemoveRelationship = (index) => {
    setFormData({
      ...formData,
      relationships: formData.relationships.filter((_, i) => i !== index)
    });
  };

  const filteredMaterials = materials.filter(m =>
    m.description.toLowerCase().includes(materialSearchTerm.toLowerCase()) ||
    m.articleNumber.toLowerCase().includes(materialSearchTerm.toLowerCase())
  );

  const availablePredecessors = allActivitiesInScope.filter(a => a.id !== formData.id);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[95vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-2xl font-bold mb-2">
                {activity ? 'Activiteit Bewerken' : 'Nieuwe Activiteit'}
              </h3>
              <p className="text-blue-100">{scopeItem.tagNumber} - {scopeItem.description}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-slate-200 bg-white px-6">
          <div className="flex gap-1">
            {[
              { id: 'basis', label: '📋 Basis' },
              { id: 'calculaties', label: '🧮 Calculaties' },
              { id: 'relaties', label: '🔗 Relaties' },
              { id: 'materialen', label: '📦 Materialen' },
              { id: 'risicos', label: '🛡️ T.R.A.' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            {/* BASIS TAB */}
            {activeTab === 'basis' && (
              <>
            {/* Template Selector - NEW! */}
            {!activity && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  ðŸŽ¯ Start from Template (optioneel)
                </label>
                <select
                  value={selectedTemplateId}
                  onChange={(e) => handleTemplateSelect(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="">-- Selecteer een template om te starten --</option>
                  {templates.map(template => (
                    <option key={template.id} value={template.id}>
                      {template.code} - {template.description} ({template.category})
                    </option>
                  ))}
                </select>
                {selectedTemplate && (
                  <div className="mt-3 p-3 bg-white rounded-lg border border-blue-200">
                    <p className="text-xs font-semibold text-slate-700 mb-2">Template Preview:</p>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-slate-600">Phase:</span>
                        <span className="ml-2 font-medium text-slate-900">{selectedTemplate.defaultPhase || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="text-slate-600">Resources:</span>
                        <span className="ml-2 font-medium text-slate-900">{selectedTemplate.resources?.length || 0}</span>
                      </div>
                      <div>
                        <span className="text-slate-600">Materials:</span>
                        <span className="ml-2 font-medium text-slate-900">{selectedTemplate.materials?.length || 0}</span>
                      </div>
                      <div>
                        <span className="text-slate-600">Adjustable:</span>
                        <span className={`ml-2 font-medium ${selectedTemplate.isAdjustable ? 'text-green-600' : 'text-orange-600'}`}>
                          {selectedTemplate.isAdjustable ? 'Yes' : 'Fixed'}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Existing form fields... */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                  Activity ID * 
                  <span className="text-xs font-normal text-slate-500">(Prefix auto, nummer aanpasbaar)</span>
                </label>
                <div className="flex gap-2">
                  {/* Prefix - Read-only */}
                  <div className="w-20">
                    <input
                      type="text"
                      value={formData.activityId.replace(/\d+$/, '')}
                      readOnly
                      placeholder="A"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-slate-100 text-slate-700 font-mono font-bold cursor-not-allowed text-center"
                      title="Prefix is vast per werkpakket"
                    />
                  </div>
                  {/* Number - Editable */}
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={formData.activityId.replace(/^[A-Z]+/, '')}
                      onChange={(e) => {
                        const prefix = formData.activityId.replace(/\d+$/, '');
                        const newNumber = e.target.value.replace(/\D/g, ''); // Only digits
                        if (newNumber) {
                          const paddedNumber = newNumber.padStart(3, '0');
                          setFormData({ ...formData, activityId: prefix + paddedNumber });
                        }
                      }}
                      placeholder="010"
                      maxLength="4"
                      className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono font-semibold"
                      title="Wijzig nummer om positie aan te passen"
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-400">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </div>
                  </div>
                </div>
                <p className="mt-1 text-xs text-slate-500">
                  ðŸ’¡ Wijzig het nummer om de volgorde aan te passen. Prefix blijft vast per werkpakket.
                </p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  WBS Code
                </label>
                <input
                  type="text"
                  value={formData.wbsCode || ''}
                  onChange={(e) => setFormData({ ...formData, wbsCode: e.target.value })}
                  placeholder="V401A.010"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Beschrijving *
              </label>
              <input
                type="text"
                value={formData.overrideDescription}
                onChange={(e) => setFormData({ ...formData, overrideDescription: e.target.value })}
                onBlur={() => handleBlur('overrideDescription')}
                placeholder="Bijvoorbeeld: Steiger bouwen rondom V-401-A"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.overrideDescription 
                    ? 'border-red-300 focus:ring-red-500' 
                    : 'border-slate-300 focus:ring-blue-500'
                }`}
              />
              {errors.overrideDescription && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertTriangle className="w-4 h-4" />
                  {errors.overrideDescription}
                </p>
              )}
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Duration (dagen) *
                </label>
                <input
                  type="number"
                  value={formData.duration}
                  onChange={(e) => {
                    const newDuration = parseInt(e.target.value) || 1;
                    
                    // Recalculate all resource units based on new duration
                    const updatedResources = formData.resources.map(res => ({
                      ...res,
                      units: (res.unitsPerTime || 0) * newDuration
                    }));
                    
                    setFormData({ 
                      ...formData, 
                      duration: newDuration,
                      resources: updatedResources
                    });
                  }}
                  min="1"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Phase *
                </label>
                <select
                  value={formData.phase}
                  onChange={(e) => setFormData({ ...formData, phase: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {phases.map(phase => (
                    <option key={phase} value={phase}>{phase}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Hold Point
                </label>
                <div className="flex items-center h-10">
                  <input
                    type="checkbox"
                    checked={formData.holdPoint}
                    onChange={(e) => setFormData({ ...formData, holdPoint: e.target.checked })}
                    className="w-5 h-5 text-blue-500 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-slate-700">Ja</span>
                </div>
              </div>
            </div>

            {/* Resources */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-semibold text-slate-700">Resources</label>
                <button
                  onClick={handleAddResource}
                  className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm"
                >
                  <Plus className="w-4 h-4" />
                  Resource Toevoegen
                </button>
              </div>
              <div className="space-y-3">
                {formData.resources.map((res, index) => (
                  <div key={index} className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                    <div className="grid grid-cols-12 gap-2 items-center">
                      <div className="col-span-4">
                        <label className="text-xs text-slate-600 mb-1 block">Resource</label>
                        <select
                          value={res.resourceId}
                          onChange={(e) => handleUpdateResource(index, 'resourceId', e.target.value)}
                          className="w-full px-2 py-1 text-sm border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Selecteer...</option>
                          {resources.map(r => (
                            <option key={r.id} value={r.id}>{r.name}</option>
                          ))}
                        </select>
                      </div>
                      <div className="col-span-2">
                        <label className="text-xs text-slate-600 mb-1 block">Units/Time</label>
                        <input
                          type="number"
                          value={res.unitsPerTime || 0}
                          onChange={(e) => handleUpdateResource(index, 'unitsPerTime', parseFloat(e.target.value) || 0)}
                          placeholder="8"
                          step="0.1"
                          min="0"
                          className="w-full px-2 py-1 text-sm border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="text-xs text-slate-600 mb-1 block">Units</label>
                        <div className="px-2 py-1 text-sm bg-slate-100 border border-slate-300 rounded text-slate-700 font-medium">
                          {res.units || 0}
                        </div>
                      </div>
                      <div className="col-span-3">
                        <label className="text-xs text-slate-600 mb-1 block">Supplier</label>
                        <select
                          value={res.allocatedSupplierId}
                          onChange={(e) => handleUpdateResource(index, 'allocatedSupplierId', e.target.value)}
                          className="w-full px-2 py-1 text-sm border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Geen</option>
                          {suppliers.map(s => (
                            <option key={s.id} value={s.id}>{s.name}</option>
                          ))}
                        </select>
                      </div>
                      <div className="col-span-1 flex justify-end items-end">
                        <button
                          onClick={() => handleRemoveResource(index)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                          title="Verwijderen"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="mt-2 text-xs text-slate-500">
                      Berekening: {res.unitsPerTime || 0} units/time Ã— {formData.duration} dagen = {res.units || 0} units
                    </div>
                  </div>
                ))}
                {formData.resources.length === 0 && (
                  <p className="text-sm text-slate-500 text-center py-2">Geen resources toegevoegd</p>
                )}
              </div>
            </div>

              </>
            )}

            {/* MATERIALEN TAB */}
            {activeTab === 'materialen' && (
              <>
            {/* Materials */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-semibold text-slate-700">Materialen</label>
                <button
                  onClick={() => setShowMaterialSearch(true)}
                  className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm"
                >
                  <Plus className="w-4 h-4" />
                  Materiaal Toevoegen
                </button>
              </div>
              <div className="space-y-2">
                {formData.materials.map((mat, index) => {
                  const material = materials.find(m => m.id === mat.materialId);
                  return material ? (
                    <div key={index} className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-slate-900">{material.description}</p>
                          <p className="text-xs text-slate-500">Art: {material.articleNumber} | â‚¬ {material.price}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            value={mat.quantity}
                            onChange={(e) => handleUpdateMaterialQuantity(index, e.target.value)}
                            min="1"
                            className="w-16 px-2 py-1 text-sm border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <span className="text-xs text-slate-500">{material.unit}</span>
                          <button
                            onClick={() => handleRemoveMaterial(index)}
                            className="p-1 text-red-600 hover:bg-red-50 rounded ml-2"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : null;
                })}
                {formData.materials.length === 0 && (
                  <p className="text-sm text-slate-500 text-center py-2">Geen materialen toegevoegd</p>
                )}
              </div>

              {/* Material Search Modal */}
              {showMaterialSearch && (
                <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
                  <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-96 overflow-hidden">
                    <div className="p-4 border-b">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-slate-900">Materiaal Zoeken</h4>
                        <button
                          onClick={() => setShowMaterialSearch(false)}
                          className="p-1 hover:bg-slate-100 rounded"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                      <input
                        type="text"
                        value={materialSearchTerm}
                        onChange={(e) => setMaterialSearchTerm(e.target.value)}
                        placeholder="Zoek op beschrijving of artikelnummer..."
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        autoFocus
                      />
                    </div>
                    <div className="overflow-y-auto max-h-64 p-4">
                      {filteredMaterials.map(material => (
                        <button
                          key={material.id}
                          onClick={() => handleAddMaterial(material)}
                          className="w-full text-left p-3 hover:bg-slate-50 rounded-lg border border-slate-200 mb-2 transition-colors"
                        >
                          <p className="text-sm font-medium text-slate-900">{material.description}</p>
                          <div className="flex items-center gap-4 mt-1 text-xs text-slate-500">
                            <span>Art: {material.articleNumber}</span>
                            <span>â‚¬ {material.price} / {material.unit}</span>
                            <span>{material.supplier}</span>
                          </div>
                        </button>
                      ))}
                      {filteredMaterials.length === 0 && (
                        <p className="text-center text-slate-500 py-4">Geen materialen gevonden</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

              </>
            )}

            {/* RELATIES TAB */}
            {activeTab === 'relaties' && (
              <>
            {/* Relationships */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-semibold text-slate-700">Dependencies (Relationships)</label>
                <button
                  onClick={handleAddRelationship}
                  className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm"
                >
                  <Plus className="w-4 h-4" />
                  Dependency Toevoegen
                </button>
              </div>
              <div className="space-y-2">
                {formData.relationships.map((rel, index) => (
                  <div key={index} className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                    <div className="grid grid-cols-12 gap-2 items-center">
                      <div className="col-span-6">
                        <select
                          value={rel.predecessorActivityId}
                          onChange={(e) => handleUpdateRelationship(index, 'predecessorActivityId', e.target.value)}
                          className="w-full px-2 py-1 text-sm border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Selecteer predecessor...</option>
                          {availablePredecessors.map(a => (
                            <option key={a.id} value={a.id}>
                              {a.activityId} - {a.overrideDescription}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="col-span-2">
                        <select
                          value={rel.type}
                          onChange={(e) => handleUpdateRelationship(index, 'type', e.target.value)}
                          className="w-full px-2 py-1 text-sm border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="FS">FS</option>
                          <option value="SS">SS</option>
                          <option value="FF">FF</option>
                          <option value="SF">SF</option>
                        </select>
                      </div>
                      <div className="col-span-3">
                        <input
                          type="number"
                          value={rel.lag}
                          onChange={(e) => handleUpdateRelationship(index, 'lag', parseInt(e.target.value) || 0)}
                          placeholder="Lag (dagen)"
                          className="w-full px-2 py-1 text-sm border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="col-span-1 flex justify-end">
                        <button
                          onClick={() => handleRemoveRelationship(index)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                {formData.relationships.length === 0 && (
                  <p className="text-sm text-slate-500 text-center py-2">Geen dependencies toegevoegd</p>
                )}
              </div>
            </div>

              </>
            )}

            {/* TRA TAB (was Risico's) */}
            {activeTab === 'risicos' && (() => {
              const tra = formData.tra || { approved: false, approvedBy: '', approvedDate: '', permits: {}, ppe: {}, risks: formData.risks || [] };
              const updateTra = (updates) => setFormData({ ...formData, tra: { ...tra, ...updates } });
              const updateRisk = (idx, updates) => {
                const risks = tra.risks.map((r, i) => i === idx ? { ...r, ...updates } : r);
                updateTra({ risks });
              };
              const addRisk = () => {
                const risk = { id: `risk-${Date.now()}`, hazard: '', category: 'other', measure: '', probability: 3, severity: 3, residualProbability: 1, residualSeverity: 2 };
                updateTra({ risks: [...tra.risks, risk] });
              };
              const removeRisk = (idx) => updateTra({ risks: tra.risks.filter((_, i) => i !== idx) });

              const highestRisk = tra.risks.length > 0 ? Math.max(...tra.risks.map(r => (r.probability || 1) * (r.severity || 1))) : 0;
              const overallLevel = highestRisk > 0 ? getTraRiskLevel(highestRisk >= 25 ? 5 : Math.ceil(highestRisk/5), Math.min(5, highestRisk)) : null;

              return (
              <div className="space-y-5">

                {/* TRA Header */}
                <div className={`rounded-xl p-4 border-2 ${tra.approved ? 'bg-green-50 border-green-300' : 'bg-orange-50 border-orange-200'}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-slate-900 flex items-center gap-2">
                        <AlertTriangle className={`w-5 h-5 ${tra.approved ? 'text-green-600' : 'text-orange-500'}`} />
                        Taak Risico Analyse (TRA)
                      </h3>
                      <p className="text-sm text-slate-600 mt-0.5">
                        {tra.risks.length} risico's · {tra.risks.filter(r => (r.probability||1)*(r.severity||1) >= 8).length} hoog/kritiek
                        {overallLevel && <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-bold ${overallLevel.bg} ${overallLevel.text}`}>{overallLevel.level}</span>}
                      </p>
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={!!tra.approved}
                        onChange={(e) => updateTra({ approved: e.target.checked, approvedDate: e.target.checked ? new Date().toISOString().split('T')[0] : '' })}
                        className="w-4 h-4" />
                      <span className={`text-sm font-bold ${tra.approved ? 'text-green-700' : 'text-slate-500'}`}>
                        {tra.approved ? '✓ TRA Goedgekeurd' : 'TRA Goedkeuren'}
                      </span>
                    </label>
                  </div>
                  {tra.approved && (
                    <div className="grid grid-cols-2 gap-3 mt-3">
                      <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">Goedgekeurd door</label>
                        <input type="text" value={tra.approvedBy || ''} onChange={(e) => updateTra({ approvedBy: e.target.value })}
                          placeholder="Naam toolboxhouder"
                          className="w-full px-3 py-1.5 border border-green-300 rounded-lg text-sm bg-white" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">Datum</label>
                        <input type="date" value={tra.approvedDate || ''}
                          onChange={(e) => updateTra({ approvedDate: e.target.value })}
                          className="w-full px-3 py-1.5 border border-green-300 rounded-lg text-sm bg-white" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Permits */}
                <div className="bg-white border border-slate-200 rounded-xl p-4">
                  <h4 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
                    <span className="w-5 h-5 bg-blue-100 text-blue-700 rounded text-xs flex items-center justify-center font-bold">V</span>
                    Vereiste Vergunningen
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {TRA_REQUIRED_PERMITS.map(permit => (
                      <label key={permit.id} className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer transition-colors ${tra.permits?.[permit.id] ? 'bg-blue-50 border-blue-300' : 'border-slate-200 hover:bg-slate-50'}`}>
                        <input type="checkbox" checked={!!(tra.permits?.[permit.id])}
                          onChange={(e) => updateTra({ permits: { ...(tra.permits || {}), [permit.id]: e.target.checked } })}
                          className="w-4 h-4" />
                        <span className="text-sm text-slate-700">{permit.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* PPE */}
                <div className="bg-white border border-slate-200 rounded-xl p-4">
                  <h4 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
                    <span className="w-5 h-5 bg-orange-100 text-orange-700 rounded text-xs flex items-center justify-center font-bold">P</span>
                    Persoonlijke Beschermingsmiddelen (PBM)
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {TRA_PPE.map(ppe => (
                      <label key={ppe.id} className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer transition-colors ${tra.ppe?.[ppe.id] ? 'bg-orange-50 border-orange-300' : 'border-slate-200 hover:bg-slate-50'}`}>
                        <input type="checkbox" checked={!!(tra.ppe?.[ppe.id])}
                          onChange={(e) => updateTra({ ppe: { ...(tra.ppe || {}), [ppe.id]: e.target.checked } })}
                          className="w-4 h-4" />
                        <span className="text-sm text-slate-700">{ppe.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Risk Matrix - Risks list */}
                <div className="bg-white border border-slate-200 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-bold text-slate-800">Risico's ({tra.risks.length})</h4>
                    <button onClick={addRisk}
                      className="flex items-center gap-1 px-3 py-1.5 bg-red-600 text-white rounded-lg text-xs font-medium hover:bg-red-700 transition-colors">
                      <Plus className="w-3.5 h-3.5" /> Risico Toevoegen
                    </button>
                  </div>

                  {tra.risks.length === 0 ? (
                    <p className="text-sm text-slate-400 text-center py-4">Nog geen risico's. Klik op "Risico Toevoegen".</p>
                  ) : (
                    <div className="space-y-3">
                      {tra.risks.map((risk, idx) => {
                        const initial = getTraRiskLevel(risk.probability || 1, risk.severity || 1);
                        const residual = getTraRiskLevel(risk.residualProbability || 1, risk.residualSeverity || 1);
                        const cat = TRA_HAZARD_CATEGORIES.find(c => c.id === risk.category);
                        return (
                          <div key={risk.id || idx} className={`border-2 ${initial.border} rounded-xl p-3`}>
                            <div className="flex items-start gap-2 mb-3">
                              <div className="flex-1 space-y-2">
                                {/* Category + Hazard */}
                                <div className="grid grid-cols-3 gap-2">
                                  <select value={risk.category || 'other'}
                                    onChange={(e) => updateRisk(idx, { category: e.target.value })}
                                    className="px-2 py-1.5 border border-slate-200 rounded-lg text-xs bg-white">
                                    {TRA_HAZARD_CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                                  </select>
                                  <input type="text" value={risk.hazard || ''} placeholder="Gevaar / hazard"
                                    onChange={(e) => updateRisk(idx, { hazard: e.target.value })}
                                    className="col-span-2 px-2 py-1.5 border border-slate-200 rounded-lg text-xs" />
                                </div>
                                {/* Measure */}
                                <input type="text" value={risk.measure || ''} placeholder="Beheersmaatregel / control measure"
                                  onChange={(e) => updateRisk(idx, { measure: e.target.value })}
                                  className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-xs" />
                              </div>
                              <button onClick={() => removeRisk(idx)} className="p-1 hover:bg-red-50 rounded text-red-400">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>

                            {/* Risk scores */}
                            <div className="grid grid-cols-2 gap-3">
                              {/* Initieel */}
                              <div className={`${initial.bg} rounded-lg p-2`}>
                                <p className="text-xs font-bold text-slate-600 mb-2">Initieel risico</p>
                                <div className="grid grid-cols-2 gap-2 mb-2">
                                  <div>
                                    <p className="text-xs text-slate-500 mb-1">Kans</p>
                                    <select value={risk.probability || 3}
                                      onChange={(e) => updateRisk(idx, { probability: parseInt(e.target.value) })}
                                      className="w-full px-1.5 py-1 border border-slate-200 rounded text-xs bg-white">
                                      {TRA_PROBABILITY.map(p => <option key={p.value} value={p.value}>{p.value} - {p.short}</option>)}
                                    </select>
                                  </div>
                                  <div>
                                    <p className="text-xs text-slate-500 mb-1">Ernst</p>
                                    <select value={risk.severity || 3}
                                      onChange={(e) => updateRisk(idx, { severity: parseInt(e.target.value) })}
                                      className="w-full px-1.5 py-1 border border-slate-200 rounded text-xs bg-white">
                                      {TRA_SEVERITY.map(s => <option key={s.value} value={s.value}>{s.value} - {s.short}</option>)}
                                    </select>
                                  </div>
                                </div>
                                <div className={`px-2 py-1 rounded text-center ${initial.bg} ${initial.text} border ${initial.border}`}>
                                  <span className="text-xs font-bold">{initial.level}</span>
                                  <span className="text-xs ml-1">({(risk.probability||1) * (risk.severity||1)})</span>
                                </div>
                              </div>

                              {/* Residueel */}
                              <div className={`${residual.bg} rounded-lg p-2`}>
                                <p className="text-xs font-bold text-slate-600 mb-2">Residueel risico</p>
                                <div className="grid grid-cols-2 gap-2 mb-2">
                                  <div>
                                    <p className="text-xs text-slate-500 mb-1">Kans</p>
                                    <select value={risk.residualProbability || 1}
                                      onChange={(e) => updateRisk(idx, { residualProbability: parseInt(e.target.value) })}
                                      className="w-full px-1.5 py-1 border border-slate-200 rounded text-xs bg-white">
                                      {TRA_PROBABILITY.map(p => <option key={p.value} value={p.value}>{p.value} - {p.short}</option>)}
                                    </select>
                                  </div>
                                  <div>
                                    <p className="text-xs text-slate-500 mb-1">Ernst</p>
                                    <select value={risk.residualSeverity || 2}
                                      onChange={(e) => updateRisk(idx, { residualSeverity: parseInt(e.target.value) })}
                                      className="w-full px-1.5 py-1 border border-slate-200 rounded text-xs bg-white">
                                      {TRA_SEVERITY.map(s => <option key={s.value} value={s.value}>{s.value} - {s.short}</option>)}
                                    </select>
                                  </div>
                                </div>
                                <div className={`px-2 py-1 rounded text-center ${residual.bg} ${residual.text} border ${residual.border}`}>
                                  <span className="text-xs font-bold">{residual.level}</span>
                                  <span className="text-xs ml-1">({(risk.residualProbability||1) * (risk.residualSeverity||1)})</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

              </div>
              );
            })()}

            {/* FASE 2: CALCULATIES TAB */}
            {activeTab === 'calculaties' && (
              <div className="space-y-4">
                {(() => {
                  const calc = formData.calculation || { enabled: false, normTableId: '', aantal: 1, handeling: 0, eenheid: 'stuks', afmeting: 1.0, corrections: { taskSpecific: {}, general: {} } };
                  const updateCalc = (updates) => setFormData({ ...formData, calculation: { ...calc, ...updates } });
                  const units = (() => {
                    if (!calc.enabled || !calc.aantal || !calc.handeling) return 0;
                    let u = calc.aantal * calc.handeling * (calc.afmeting || 1);
                    Object.entries(calc.corrections?.taskSpecific || {}).forEach(([k, on]) => { if (on && CORRECTION_FACTORS.taskSpecific[k]) u *= (1 + CORRECTION_FACTORS.taskSpecific[k].percentage / 100); });
                    Object.entries(calc.corrections?.general || {}).forEach(([k, on]) => { if (on && CORRECTION_FACTORS.general[k]) u *= (1 + CORRECTION_FACTORS.general[k].percentage / 100); });
                    return Math.round(u * 100) / 100;
                  })();
                  const cats = [...new Set(NORM_TABLES.map(n => n.category))];
                  return (
                    <div className="border border-slate-200 rounded-xl overflow-hidden">
                      {/* Header */}
                      <div className="flex items-center justify-between p-4 bg-slate-50 border-b border-slate-200">
                        <div className="flex items-center gap-3">
                          <Calculator className="w-5 h-5 text-blue-600" />
                          <div>
                            <p className="font-semibold text-slate-900">Norm-based Calculaties</p>
                            {calc.enabled && units > 0 && (
                              <p className="text-sm font-medium text-blue-600">Resultaat: {units} {calc.eenheid}</p>
                            )}
                          </div>
                        </div>
                        <label className="flex items-center gap-2 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={!!calc.enabled}
                            onChange={(e) => updateCalc({ enabled: e.target.checked })}
                            className="w-4 h-4"
                          />
                          <span className="text-sm font-medium text-slate-700">Inschakelen</span>
                        </label>
                      </div>

                      {/* Content - only when enabled */}
                      {calc.enabled && (
                        <div className="p-4 space-y-5">

                          {/* Norm selector */}
                          <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Norm Table</label>
                            <select
                              value={calc.normTableId || ''}
                              onChange={(e) => {
                                const norm = NORM_TABLES.find(n => n.id === e.target.value);
                                if (norm) updateCalc({ normTableId: norm.id, handeling: norm.rate, eenheid: norm.unit });
                                else updateCalc({ normTableId: '' });
                              }}
                              className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white text-sm"
                            >
                              <option value="">-- Selecteer een norm --</option>
                              {cats.map(cat => (
                                <optgroup key={cat} label={cat}>
                                  {NORM_TABLES.filter(n => n.category === cat).map(norm => (
                                    <option key={norm.id} value={norm.id}>
                                      {norm.name} ({norm.rate} u/{norm.unit})
                                    </option>
                                  ))}
                                </optgroup>
                              ))}
                            </select>
                          </div>

                          {/* Inputs */}
                          <div className="grid grid-cols-3 gap-3">
                            <div>
                              <label className="block text-xs font-semibold text-slate-600 mb-1">Aantal</label>
                              <input type="number" min="0" step="0.5" value={calc.aantal}
                                onChange={(e) => updateCalc({ aantal: parseFloat(e.target.value) || 0 })}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm" />
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-slate-600 mb-1">Norm (u/{calc.eenheid})</label>
                              <input type="number" min="0" step="0.25" value={calc.handeling}
                                onChange={(e) => updateCalc({ handeling: parseFloat(e.target.value) || 0 })}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm" />
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-slate-600 mb-1">Afmeting</label>
                              <input type="number" min="0.1" step="0.1" value={calc.afmeting}
                                onChange={(e) => updateCalc({ afmeting: parseFloat(e.target.value) || 1 })}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm" />
                            </div>
                          </div>

                          {/* Corrections */}
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-xs font-bold text-slate-600 uppercase mb-2">Taak-specifiek</p>
                              {Object.entries(CORRECTION_FACTORS.taskSpecific).map(([key, cfg]) => (
                                <label key={key} className="flex items-center gap-2 text-sm py-0.5 cursor-pointer">
                                  <input type="checkbox"
                                    checked={!!(calc.corrections?.taskSpecific?.[key])}
                                    onChange={(e) => updateCalc({ corrections: { ...calc.corrections, taskSpecific: { ...(calc.corrections?.taskSpecific || {}), [key]: e.target.checked } } })}
                                    className="w-4 h-4" />
                                  <span>{cfg.label} <span className="text-slate-400">({cfg.percentage > 0 ? '+' : ''}{cfg.percentage}%)</span></span>
                                </label>
                              ))}
                            </div>
                            <div>
                              <p className="text-xs font-bold text-slate-600 uppercase mb-2">Algemeen</p>
                              {Object.entries(CORRECTION_FACTORS.general).map(([key, cfg]) => (
                                <label key={key} className="flex items-center gap-2 text-sm py-0.5 cursor-pointer">
                                  <input type="checkbox"
                                    checked={!!(calc.corrections?.general?.[key])}
                                    onChange={(e) => updateCalc({ corrections: { ...calc.corrections, general: { ...(calc.corrections?.general || {}), [key]: e.target.checked } } })}
                                    className="w-4 h-4" />
                                  <span>{cfg.label} <span className="text-slate-400">(+{cfg.percentage}%)</span></span>
                                </label>
                              ))}
                            </div>
                          </div>

                          {/* Result */}
                          {calc.normTableId && (
                            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                              <div className="flex items-center justify-between">
                                <span className="font-semibold text-blue-900">Berekend:</span>
                                <span className="text-2xl font-bold text-blue-600">{units} {calc.eenheid}</span>
                              </div>
                              <p className="text-xs text-blue-600 mt-1">
                                {calc.aantal} × {calc.handeling} × {calc.afmeting} + correcties = {units}
                              </p>
                            </div>
                          )}

                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>
            )}

            {/* BASIS TAB: Activity Steps Section */}
            {activeTab === 'basis' && (
            <div className="mt-6">
              <ActivityStepsEditor
                steps={formData.steps || []}
                onChange={(newSteps) => {
                  setFormData({ ...formData, steps: newSteps });
                }}
              />
            </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t p-6 bg-slate-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {activity && onDelete && (
                <button
                  onClick={onDelete}
                  className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Verwijderen
                </button>
              )}
              {hasErrors && (
                <div className="flex items-center gap-2 text-orange-600 text-sm">
                  <AlertTriangle className="w-4 h-4" />
                  <span>{Object.keys(errors).length} {Object.keys(errors).length === 1 ? 'fout' : 'fouten'} gevonden</span>
                </div>
              )}
            </div>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="px-6 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors"
              >
                Annuleren
              </button>
              <button
                onClick={() => canSave && onSave(formData)}
                disabled={!canSave}
                className={`flex items-center gap-2 px-6 py-2 rounded-lg transition-colors ${
                  canSave
                    ? 'bg-blue-500 text-white hover:bg-blue-600'
                    : 'bg-slate-300 text-slate-500 cursor-not-allowed'
                }`}
                title={!canSave ? 'Vul alle verplichte velden in' : ''}
              >
                <Check className="w-4 h-4" />
                Opslaan
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
// ===== SCOPE ITEM DETAIL VIEW (WERKPAKKET - COMPLETE & TESTED) =====
const ScopeItemDetailView = ({ scopeItem, onClose, onUpdate, resources, suppliers, projectStartDate, templates }) => {
  const toast = useToast();
  const [activities, setActivities] = useState(scopeItem?.plannedActivities || []);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [editingCell, setEditingCell] = useState(null);

  const activitiesWithDates = useMemo(() => {
    if (!scopeItem || !activities.length) return [];
    try {
      return calculateActivityDates(activities, new Date(projectStartDate));
    } catch (error) {
      console.error('Error calculating dates:', error);
      return activities;
    }
  }, [activities, projectStartDate, scopeItem]);

  if (!scopeItem) return null;

  const handleUpdateActivity = (activityId, field, value) => {
    setActivities(activities.map(a => a.id === activityId ? { ...a, [field]: value } : a));
  };

  const handleCellEdit = (activityId, field, value) => {
    handleUpdateActivity(activityId, field, value);
    setEditingCell(null);
    toast.success(field + ' bijgewerkt');
  };

  const handleSave = () => {
    onUpdate({ ...scopeItem, plannedActivities: activities });
    toast.success('Wijzigingen opgeslagen', scopeItem.tagNumber);
  };

  const handleGenerateWorkPackage = async () => {
    setIsGeneratingReport(true);
    toast.info('PDF wordt gegenereerd...', 'Even geduld');
    try {
      await new Promise(r => setTimeout(r, 1000));
      const pdfContent = generatePDFContent(scopeItem, activitiesWithDates, resources, suppliers);
      const blob = new Blob([pdfContent], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'Werkpakket_' + scopeItem.tagNumber + '_' + new Date().toISOString().split('T')[0] + '.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success('Werkpakket gegenereerd', 'Download gestart');
    } catch (error) {
      toast.error('Fout bij genereren werkpakket');
    } finally {
      setIsGeneratingReport(false);
    }
  };

  const handleExportExcel = async () => {
    setIsExporting(true);
    toast.info('Excel wordt geÃ«xporteerd...');
    try {
      await new Promise(r => setTimeout(r, 800));
      const csvContent = generateCSVContent(scopeItem, activitiesWithDates, resources);
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'Werkpakket_' + scopeItem.tagNumber + '_' + new Date().toISOString().split('T')[0] + '.csv';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success('Excel geÃ«xporteerd');
    } catch (error) {
      toast.error('Fout bij exporteren');
    } finally {
      setIsExporting(false);
    }
  };

  const handlePrint = () => {
    toast.info('Print venster wordt geopend...');
    setTimeout(() => {
      const printWindow = window.open('', '_blank');
      const printContent = generatePrintHTML(scopeItem, activitiesWithDates, resources, suppliers);
      printWindow.document.write(printContent);
      printWindow.document.close();
      setTimeout(() => {
        printWindow.print();
        toast.success('Print dialoog geopend');
      }, 500);
    }, 300);
  };

  const getTotalHours = () => activities.reduce((t, a) => t + a.resources.reduce((s, r) => s + (r.units || 0), 0), 0);
  const getTotalDuration = () => activities.reduce((t, a) => t + (a.duration || 0), 0);

  return (
    <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-[95vw] max-h-[95vh] overflow-hidden flex flex-col">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-lg">
                <ChevronLeft className="w-6 h-6" />
              </button>
              <div>
                <h2 className="text-3xl font-bold">{scopeItem.tagNumber}</h2>
                <p className="text-blue-100 mt-1">{scopeItem.description}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="bg-white/10 px-4 py-2 rounded-lg border border-white/20">
                <div className="text-xs text-blue-100">STATUS</div>
                <div className="text-sm font-semibold">{scopeItem.status}</div>
              </div>
              <div className="bg-white/10 px-4 py-2 rounded-lg border border-white/20">
                <div className="text-xs text-blue-100">ACTIVITEITEN</div>
                <div className="text-sm font-semibold">{activities.length}</div>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={handleGenerateWorkPackage} disabled={isGeneratingReport}
              className="flex items-center gap-2 bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 disabled:bg-red-300">
              {isGeneratingReport ? <><LoadingSpinner size="sm" className="text-white" /><span>Genereren...</span></> : 
              <><FileText className="w-5 h-5" /><span className="font-semibold">PDF</span></>}
            </button>
            <button onClick={handleExportExcel} disabled={isExporting}
              className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 disabled:bg-green-300">
              {isExporting ? <><LoadingSpinner size="sm" className="text-white" /><span>Exporteren...</span></> : 
              <><Download className="w-5 h-5" /><span className="font-semibold">EXCEL</span></>}
            </button>
            <button onClick={handlePrint} className="flex items-center gap-2 bg-purple-500 text-white px-6 py-3 rounded-lg hover:bg-purple-600">
              <FileText className="w-5 h-5" /><span className="font-semibold">PRINT</span>
            </button>
            <button onClick={handleSave} className="flex items-center gap-2 bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 ml-auto">
              <Save className="w-5 h-5" /><span className="font-semibold">OPSLAAN</span>
            </button>
          </div>
        </div>

        <div className="bg-slate-50 border-b px-6 py-3">
          <div className="flex items-center gap-8 text-sm">
            <div><span className="text-slate-600">Totaal:</span><span className="ml-2 font-semibold">{activities.length}</span></div>
            <div><span className="text-slate-600">Uren:</span><span className="ml-2 font-semibold">{getTotalHours().toFixed(2)}</span></div>
            <div><span className="text-slate-600">Doorloop:</span><span className="ml-2 font-semibold">{getTotalDuration()} dagen</span></div>
            <div className="ml-auto text-xs text-slate-500">ðŸ’¡ Klik in cellen om te bewerken</div>
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          <table className="w-full border-collapse">
            <thead className="bg-slate-700 text-white sticky top-0 z-10">
              <tr>
                <th className="px-4 py-3 text-left text-sm border-r border-slate-600">ID</th>
                <th className="px-4 py-3 text-left text-sm border-r border-slate-600">NAAM</th>
                <th className="px-4 py-3 text-left text-sm border-r border-slate-600 w-32">STATUS</th>
                <th className="px-4 py-3 text-left text-sm border-r border-slate-600 w-24">DOORLOOP</th>
                <th className="px-4 py-3 text-left text-sm border-r border-slate-600 w-24">UREN</th>
                <th className="px-4 py-3 text-left text-sm border-r border-slate-600 w-32">START</th>
                <th className="px-4 py-3 text-left text-sm border-r border-slate-600 w-32">EIND</th>
                <th className="px-4 py-3 text-left text-sm w-32">RESOURCE</th>
              </tr>
            </thead>
            <tbody>
              {activitiesWithDates.map((activity, idx) => {
                const totalHours = activity.resources.reduce((s, r) => s + (r.units || 0), 0);
                const resource = resources.find(r => r.id === activity.resources[0]?.resourceId);
                return (
                  <tr key={activity.id} className={'border-b hover:bg-blue-50 ' + (idx % 2 === 0 ? 'bg-white' : 'bg-slate-50')}>
                    <td className="px-4 py-3 border-r border-slate-200"><span className="font-mono text-xs text-slate-600">{activity.activityId}</span></td>
                    <td className="px-4 py-3 border-r border-slate-200">
                      {editingCell === activity.id + '-desc' ? (
                        <input type="text" defaultValue={activity.overrideDescription}
                          onBlur={(e) => handleCellEdit(activity.id, 'overrideDescription', e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' ? handleCellEdit(activity.id, 'overrideDescription', e.target.value) : e.key === 'Escape' ? setEditingCell(null) : null}
                          autoFocus className="w-full px-2 py-1 border-2 border-blue-500 rounded" />
                      ) : (
                        <div onClick={() => setEditingCell(activity.id + '-desc')} className="cursor-pointer hover:bg-blue-100 px-2 py-1 rounded">{activity.overrideDescription}</div>
                      )}
                    </td>
                    <td className="px-4 py-3 border-r border-slate-200">
                      {editingCell === activity.id + '-stat' ? (
                        <select value={activity.executionStatus} onChange={(e) => handleCellEdit(activity.id, 'executionStatus', e.target.value)} onBlur={() => setEditingCell(null)} autoFocus className="w-full px-2 py-1 border-2 border-blue-500 rounded">
                          <option value="Planned">Planned</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Completed">Completed</option>
                          <option value="On Hold">On Hold</option>
                        </select>
                      ) : (
                        <span onClick={() => setEditingCell(activity.id + '-stat')} className="inline-flex px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold cursor-pointer hover:bg-blue-200">{activity.executionStatus}</span>
                      )}
                    </td>
                    <td className="px-4 py-3 border-r border-slate-200">
                      {editingCell === activity.id + '-dur' ? (
                        <input type="number" defaultValue={activity.duration}
                          onBlur={(e) => handleCellEdit(activity.id, 'duration', parseInt(e.target.value) || 1)}
                          onKeyDown={(e) => e.key === 'Enter' ? handleCellEdit(activity.id, 'duration', parseInt(e.target.value) || 1) : e.key === 'Escape' ? setEditingCell(null) : null}
                          autoFocus min="1" className="w-full px-2 py-1 border-2 border-blue-500 rounded text-center" />
                      ) : (
                        <div onClick={() => setEditingCell(activity.id + '-dur')} className="text-center cursor-pointer hover:bg-blue-100 px-2 py-1 rounded font-mono">{activity.duration}</div>
                      )}
                    </td>
                    <td className="px-4 py-3 border-r border-slate-200 text-right font-mono">{totalHours.toFixed(2)}</td>
                    <td className="px-4 py-3 border-r border-slate-200 text-sm">{activity.calculatedStart ? activity.calculatedStart.toLocaleDateString('nl-NL') + ', ' + activity.calculatedStart.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' }) : '-'}</td>
                    <td className="px-4 py-3 border-r border-slate-200 text-sm">{activity.calculatedEnd ? activity.calculatedEnd.toLocaleDateString('nl-NL') + ', ' + activity.calculatedEnd.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' }) : '-'}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{resource ? resource.name + ' (' + (activity.resources[0]?.units || 0) + 'u)' : '-'}</td>
                  </tr>
                );
              })}
              {activities.length === 0 && (
                <tr><td colSpan="8" className="px-4 py-12 text-center text-slate-500">
                  <Package className="w-12 h-12 mx-auto mb-3 text-slate-400" />
                  <p className="font-medium">Geen activiteiten</p>
                  <p className="text-sm mt-1">Voeg activiteiten toe om te starten</p>
                </td></tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="bg-slate-50 border-t px-6 py-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-600"><strong>Tip:</strong> Klik in cellen om te bewerken. Enter = opslaan, ESC = annuleren.</p>
            <div className="flex gap-3">
              <button onClick={onClose} className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300">Sluiten</button>
              <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"><Save className="w-4 h-4" />Opslaan</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ===== QR CODE MODAL COMPONENT =====
const QRCodeModal = ({ scope, onClose }) => {
  if (!scope) return null;

  // Simple QR code text representation for now
  // In production, use a proper QR code library like qrcode.react
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-xl p-8 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-slate-900">QR Code</h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="bg-slate-100 p-6 rounded-lg mb-4">
          <div className="bg-white p-6 rounded border-2 border-slate-300 mb-4">
            <div className="grid grid-cols-8 gap-1">
              {Array(64).fill(0).map((_, idx) => {
                const isBlack = Math.random() > 0.5;
                return (
                  <div 
                    key={idx}
                    className={isBlack ? 'bg-black' : 'bg-white'}
                    style={{ aspectRatio: '1/1' }}
                  />
                );
              })}
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-slate-900 mb-1">{scope.tagNumber}</div>
            <div className="text-sm text-slate-600">{scope.description}</div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-700">
          <strong>Tip:</strong> Print deze QR code en plak op het equipment. Scan met tablet in Progress Tracking voor snelle toegang.
        </div>
        
        <button
          onClick={() => window.print()}
          className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Print QR Code
        </button>
      </div>
    </div>
  );
};

// ===== COLUMN CONFIGURATOR MODAL =====
const ColumnConfigurator = ({ visibleColumns, availableColumns, onApply, onClose }) => {
  const [localColumns, setLocalColumns] = useState([...visibleColumns]);
  const [draggedColumn, setDraggedColumn] = useState(null);

  // Log initial state
  useEffect(() => {
    console.log('ðŸ“‹ ColumnConfigurator mounted with visibleColumns:', visibleColumns);
    console.log('ðŸ“‹ localColumns initialized:', localColumns);
  }, []);

  const handleDragStart = (e, columnId) => {
    setDraggedColumn(columnId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, targetColumnId) => {
    e.preventDefault();
    if (draggedColumn === targetColumnId) return;

    const draggedIdx = localColumns.indexOf(draggedColumn);
    const targetIdx = localColumns.indexOf(targetColumnId);
    
    const newColumns = [...localColumns];
    newColumns.splice(draggedIdx, 1);
    newColumns.splice(targetIdx, 0, draggedColumn);
    setLocalColumns(newColumns);
  };

  const handleDragEnd = () => {
    setDraggedColumn(null);
  };

  const toggleColumn = (columnId) => {
    console.log('ðŸ”„ toggleColumn called for:', columnId);
    const column = availableColumns.find(c => c.id === columnId);
    console.log('ðŸ”„ Column found:', column);
    
    if (column?.locked) {
      console.log('âš ï¸ Column is locked, cannot toggle');
      return;
    }

    const isCurrentlyVisible = localColumns.includes(columnId);
    console.log('ðŸ”„ Currently visible:', isCurrentlyVisible);

    let newColumns;
    if (isCurrentlyVisible) {
      // Remove column
      newColumns = localColumns.filter(id => id !== columnId);
      console.log('âž– Removing column. New columns:', newColumns);
    } else {
      // Add column
      newColumns = [...localColumns, columnId];
      console.log('âž• Adding column. New columns:', newColumns);
    }
    
    setLocalColumns(newColumns);
  };

  const handleApply = () => {
    console.log('%c ðŸŽ¯ COLUMN CONFIGURATOR: APPLYING ', 'background: #3b82f6; color: white; font-size: 14px; padding: 4px;');
    console.log('Final localColumns:', localColumns);
    console.log('Calling onApply with:', localColumns);
    onApply([...localColumns]); // Force new array reference
    console.log('Calling onClose');
    onClose();
  };

  const handleReset = () => {
    const defaultColumns = ['expand', 'tagNumber', 'description', 'priority', 'status', 'workflow', 'planner', 'activities', 'actions'];
    console.log('ðŸ”„ Resetting to default columns:', defaultColumns);
    setLocalColumns(defaultColumns);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4" onClick={onClose}>
      <div className="bg-white rounded-t-xl sm:rounded-xl shadow-2xl w-full sm:max-w-2xl flex flex-col" style={{maxHeight: '500px', height: '500px'}} onClick={(e) => e.stopPropagation()}>
        {/* Header - 50px */}
        <div className="flex-shrink-0 bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-3 flex items-center justify-between">
          <h3 className="text-base font-bold text-white">Kolommen</h3>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded">
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Content - Scrollable - calc(500px - 50px - 60px) = 390px */}
        <div className="flex-1 overflow-y-auto p-3" style={{maxHeight: '390px'}}>
          {/* Zichtbare Kolommen */}
          <div className="mb-3">
            <h4 className="font-semibold text-sm mb-2">Zichtbaar ({localColumns.length})</h4>
            <div className="space-y-1">
              {localColumns.map(columnId => {
                const column = availableColumns.find(c => c.id === columnId);
                if (!column) return null;
                
                return (
                  <div
                    key={columnId}
                    draggable={!column.locked}
                    onDragStart={(e) => handleDragStart(e, columnId)}
                    onDragOver={(e) => handleDragOver(e, columnId)}
                    onDragEnd={handleDragEnd}
                    className={'flex items-center gap-2 p-2 border rounded transition-all ' + 
                      (draggedColumn === columnId ? 'border-blue-500 bg-blue-50 opacity-50' : 'hover:bg-slate-50 ') +
                      (!column.locked ? 'cursor-move' : '')}
                  >
                    {!column.locked && (
                      <svg className="w-4 h-4 text-slate-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                      </svg>
                    )}
                    <input
                      type="checkbox"
                      checked={true}
                      onChange={() => toggleColumn(columnId)}
                      disabled={column.locked}
                      className="w-4 h-4 flex-shrink-0"
                    />
                    <span className="text-sm flex-1">{column.label || '(Actions)'}</span>
                    {column.locked && <span className="text-xs text-slate-500">ðŸ”’</span>}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Beschikbare Kolommen */}
          {availableColumns.filter(col => !localColumns.includes(col.id) && !col.locked).length > 0 && (
            <div>
              <h4 className="font-semibold text-sm mb-2">Beschikbaar</h4>
              <div className="space-y-1">
                {availableColumns
                  .filter(col => !localColumns.includes(col.id) && !col.locked)
                  .map(column => (
                    <button
                      key={column.id}
                      onClick={() => toggleColumn(column.id)}
                      className="w-full flex items-center gap-2 p-2 border rounded hover:bg-blue-50 text-left"
                    >
                      <Plus className="w-4 h-4 text-blue-600" />
                      <span className="text-sm">{column.label}</span>
                    </button>
                  ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer - 60px - ALWAYS VISIBLE */}
        <div className="flex-shrink-0 border-t bg-white px-3 py-3 flex items-center justify-between gap-2" style={{height: '60px', boxShadow: '0 -2px 10px rgba(0,0,0,0.1)'}}>
          <button
            onClick={handleReset}
            className="px-2 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded"
          >
            Reset
          </button>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-100 rounded"
            >
              Annuleren
            </button>
            <button
              onClick={handleApply}
              className="px-4 py-1.5 bg-blue-600 text-white rounded font-semibold text-sm"
            >
              âœ“ OK ({localColumns.length})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ===== SCOPE ITEM CREATOR MODAL =====
const ScopeItemCreator = ({ 
  onSave, 
  onClose, 
  existingScopeItems = [], 
  availableColumns = [], 
  customColumns = [] 
}) => {
  // Safety checks
  const safeExistingItems = Array.isArray(existingScopeItems) ? existingScopeItems : [];
  const safeCustomColumns = Array.isArray(customColumns) ? customColumns : [];
  
  const [activeTab, setActiveTab] = useState('default');
  const [formData, setFormData] = useState({
    tagNumber: '',
    description: '',
    workOrderNumber: '',
    priority: 'Medium',
    status: 'In Scope',
    workflow: '',
    planner: '',
    discipline: '',
    area: '',
    system: '',
    notes: ''
  });
  const [customData, setCustomData] = useState({});
  const [duplicate, setDuplicate] = useState(null);
  const [errors, setErrors] = useState({});

  // Check for duplicates as user types
  useEffect(() => {
    if (formData.tagNumber.trim()) {
      const existing = safeExistingItems.find(
        item => item.tagNumber.toLowerCase() === formData.tagNumber.toLowerCase().trim()
      );
      setDuplicate(existing || null);
    } else {
      setDuplicate(null);
    }
  }, [formData.tagNumber, safeExistingItems]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.tagNumber.trim()) {
      newErrors.tagNumber = 'Tag Number is verplicht';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Beschrijving is verplicht';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      setActiveTab('default');
      return;
    }

    if (duplicate) {
      if (!window.confirm(`Tag Number "${formData.tagNumber}" bestaat al. Wilt u het bestaande item overschrijven?`)) {
        return;
      }
    }

    const newItem = {
      id: duplicate?.id || 'scope-' + Date.now(),
      ...formData,
      ...customData,
      plannedActivities: duplicate?.plannedActivities || [],
      isParent: false
    };

    console.log('âœ¨ Creating/updating scope item:', newItem);
    onSave(newItem, !!duplicate);
    onClose();
  };

  const handleCustomFieldChange = (columnId, value) => {
    setCustomData(prev => ({
      ...prev,
      [columnId]: value
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex-shrink-0 bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex items-center justify-between rounded-t-xl">
          <h3 className="text-xl font-bold text-white">
            {duplicate ? 'âš ï¸ Update Bestaand Item' : 'âœ¨ Nieuw Scope Item'}
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-lg">
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex-shrink-0 border-b border-slate-200 bg-slate-50">
          <div className="flex">
            <button
              onClick={() => setActiveTab('default')}
              className={`flex-1 px-6 py-3 font-semibold transition-colors ${
                activeTab === 'default'
                  ? 'bg-white text-blue-600 border-b-2 border-blue-600'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              ðŸ“ Default Data
              {Object.keys(errors).length > 0 && activeTab !== 'default' && (
                <span className="ml-2 text-red-500">âš ï¸</span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('custom')}
              className={`flex-1 px-6 py-3 font-semibold transition-colors ${
                activeTab === 'custom'
                  ? 'bg-white text-purple-600 border-b-2 border-purple-600'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              ðŸ”§ Custom Data ({safeCustomColumns.length})
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Duplicate Warning */}
          {duplicate && (
            <div className="mb-4 p-4 bg-orange-50 border-2 border-orange-300 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-semibold text-orange-900 mb-1">Tag Number al in gebruik!</h4>
                  <p className="text-sm text-orange-700 mb-2">
                    <strong>{duplicate.tagNumber}</strong> - {duplicate.description}
                  </p>
                  <p className="text-xs text-orange-600">
                    Bij opslaan wordt het bestaande item bijgewerkt.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Default Data Tab */}
          {activeTab === 'default' && (
            <div className="space-y-4">
              {/* Tag Number */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Tag Number * {errors.tagNumber && <span className="text-red-600">({errors.tagNumber})</span>}
                </label>
                <input
                  type="text"
                  value={formData.tagNumber}
                  onChange={(e) => setFormData({...formData, tagNumber: e.target.value})}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                    errors.tagNumber ? 'border-red-500' : 'border-slate-300'
                  }`}
                  placeholder="bijv. P-001"
                  autoFocus
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Beschrijving * {errors.description && <span className="text-red-600">({errors.description})</span>}
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                    errors.description ? 'border-red-500' : 'border-slate-300'
                  }`}
                  placeholder="Beschrijving van het scope item"
                  rows={3}
                />
              </div>

              {/* Work Order */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Work Order</label>
                <input
                  type="text"
                  value={formData.workOrderNumber}
                  onChange={(e) => setFormData({...formData, workOrderNumber: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="bijv. WO-2024-001"
                />
              </div>

              {/* Priority & Status */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Prioriteit</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({...formData, priority: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="In Scope">In Scope</option>
                    <option value="Op Hold">Op Hold</option>
                    <option value="Uit Scope">Uit Scope</option>
                  </select>
                </div>
              </div>

              {/* Discipline & Area */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Discipline</label>
                  <select
                    value={formData.discipline}
                    onChange={(e) => setFormData({...formData, discipline: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">-</option>
                    <option value="Mechanical">Mechanical</option>
                    <option value="Electrical">Electrical</option>
                    <option value="Instrumentation">Instrumentation</option>
                    <option value="Civil">Civil</option>
                    <option value="Piping">Piping</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Area</label>
                  <input
                    type="text"
                    value={formData.area}
                    onChange={(e) => setFormData({...formData, area: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* System */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">System</label>
                <input
                  type="text"
                  value={formData.system}
                  onChange={(e) => setFormData({...formData, system: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Notities</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Extra notities..."
                />
              </div>
            </div>
          )}

          {/* Custom Data Tab */}
          {activeTab === 'custom' && (
            <div className="space-y-4">
              {safeCustomColumns.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">ðŸ”§</div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">Geen custom kolommen</h3>
                  <p className="text-slate-600">
                    Ga naar Kolommen om custom velden toe te voegen.
                  </p>
                </div>
              ) : (
                safeCustomColumns.map(column => (
                  <div key={column.id}>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      {column.label}
                    </label>
                    
                    {column.type === 'text' && (
                      <input
                        type="text"
                        value={customData[column.id] || ''}
                        onChange={(e) => handleCustomFieldChange(column.id, e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      />
                    )}
                    
                    {column.type === 'number' && (
                      <input
                        type="number"
                        value={customData[column.id] || ''}
                        onChange={(e) => handleCustomFieldChange(column.id, e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      />
                    )}
                    
                    {column.type === 'select' && column.options && (
                      <select
                        value={customData[column.id] || ''}
                        onChange={(e) => handleCustomFieldChange(column.id, e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="">-</option>
                        {column.options.map(opt => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    )}
                    
                    {column.type === 'date' && (
                      <input
                        type="date"
                        value={customData[column.id] || ''}
                        onChange={(e) => handleCustomFieldChange(column.id, e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      />
                    )}
                    
                    {column.type === 'checkbox' && (
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={customData[column.id] || false}
                          onChange={(e) => handleCustomFieldChange(column.id, e.target.checked)}
                          className="w-4 h-4 text-purple-600 rounded"
                        />
                        <span className="text-sm text-slate-600">Ja</span>
                      </label>
                    )}
                    
                    {column.type === 'email' && (
                      <input
                        type="email"
                        value={customData[column.id] || ''}
                        onChange={(e) => handleCustomFieldChange(column.id, e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      />
                    )}
                    
                    {column.type === 'url' && (
                      <input
                        type="url"
                        value={customData[column.id] || ''}
                        onChange={(e) => handleCustomFieldChange(column.id, e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      />
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 border-t border-slate-200 px-6 py-4 bg-slate-50 flex items-center justify-between rounded-b-xl">
          <button
            onClick={onClose}
            className="px-4 py-2 text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
          >
            Annuleren
          </button>
          <div className="flex items-center gap-2">
            {activeTab === 'custom' && (
              <button
                onClick={() => setActiveTab('default')}
                className="px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              >
                â† Default
              </button>
            )}
            {activeTab === 'default' && safeCustomColumns.length > 0 && (
              <button
                onClick={() => setActiveTab('custom')}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Custom Data â†’
              </button>
            )}
            <button
              onClick={handleSubmit}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              {duplicate ? 'ðŸ”„ Update' : 'âœ¨ Aanmaken'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ===== COLUMN LIBRARY PAGE =====
const ColumnLibrary = ({ 
  customColumns = [], 
  setCustomColumns, 
  defaultColumns = [], 
  setDefaultColumns, 
  isAdminMode = false 
}) => {
  const [editingColumn, setEditingColumn] = useState(null);
  const [showEditor, setShowEditor] = useState(false);
  
  // Safety checks
  const safeCustomColumns = Array.isArray(customColumns) ? customColumns : [];
  const safeDefaultColumns = Array.isArray(defaultColumns) ? defaultColumns : [];

  const handleSaveColumn = (columnData) => {
    if (columnData.isDefault) {
      // Admin editing default column
      if (!isAdminMode) {
        alert('âš ï¸ Alleen admins kunnen default kolommen bewerken!');
        return;
      }
      setDefaultColumns(safeDefaultColumns.map(col => 
        col.id === columnData.id ? columnData : col
      ));
    } else {
      // Regular user editing custom column
      if (editingColumn) {
        // Update existing
        setCustomColumns(safeCustomColumns.map(col => 
          col.id === columnData.id ? columnData : col
        ));
      } else {
        // Add new
        setCustomColumns([...safeCustomColumns, columnData]);
      }
    }
  };

  const handleDeleteColumn = (columnId, isDefault) => {
    if (isDefault) {
      alert('âŒ Default kolommen kunnen niet worden verwijderd. Gebruik "Verberg" in plaats daarvan.');
      return;
    }
    if (window.confirm('Weet je zeker dat je deze kolom wilt verwijderen?')) {
      setCustomColumns(safeCustomColumns.filter(col => col.id !== columnId));
    }
  };

  const handleToggleHidden = (columnId) => {
    if (!isAdminMode) {
      alert('âš ï¸ Alleen admins kunnen default kolommen verbergen!');
      return;
    }
    setDefaultColumns(safeDefaultColumns.map(col =>
      col.id === columnId ? { ...col, hidden: !col.hidden } : col
    ));
  };

  const handleAddDefaultColumn = () => {
    if (!isAdminMode) {
      alert('âš ï¸ Alleen admins kunnen default kolommen toevoegen!');
      return;
    }
    setEditingColumn({
      id: '',
      label: '',
      type: 'text',
      width: 'w-40',
      editable: true,
      isDefault: true,
      hidden: false
    });
    setShowEditor(true);
  };

  const getTypeIcon = (type) => {
    const icons = {
      text: 'ðŸ“',
      number: 'ðŸ”¢',
      select: 'ðŸ“‹',
      date: 'ðŸ“…',
      checkbox: 'âœ“',
      email: 'ðŸ“§',
      url: 'ðŸ”—',
      expand: 'âŠž',
      actions: 'âš™ï¸'
    };
    return icons[type] || 'ðŸ“';
  };

  // Filter out hidden default columns for non-admins
  const visibleDefaultColumns = isAdminMode 
    ? safeDefaultColumns 
    : safeDefaultColumns.filter(col => !col.hidden);

  return (
    <div className="p-8">
      {/* Admin Mode Banner */}
      {isAdminMode && (
        <div className="mb-6 p-4 bg-orange-50 border-2 border-orange-300 rounded-lg">
          <div className="flex items-center gap-3">
            <Settings className="w-5 h-5 text-orange-600" />
            <div>
              <h3 className="font-semibold text-orange-900">ðŸ” Admin Mode Actief</h3>
              <p className="text-sm text-orange-700">
                Je kunt nu default kolommen bewerken, verbergen en nieuwe default kolommen toevoegen.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="mb-6">
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Kolommen Library</h2>
        <p className="text-slate-600">
          Beheer custom kolommen voor je project. {isAdminMode && 'Als admin kun je ook default kolommen aanpassen.'}
        </p>
      </div>

      {/* Default Columns */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-slate-900">Default Kolommen</h3>
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-500">{visibleDefaultColumns.length} kolommen</span>
            {isAdminMode && (
              <button
                onClick={handleAddDefaultColumn}
                className="flex items-center gap-2 px-3 py-1.5 bg-orange-600 text-white text-sm rounded-lg hover:bg-orange-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Nieuwe Default Kolom
              </button>
            )}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {visibleDefaultColumns.map(column => (
            <div 
              key={column.id} 
              className={`bg-white border rounded-lg p-4 hover:shadow-md transition-shadow ${
                column.hidden ? 'border-slate-300 opacity-60' : 'border-slate-200'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{getTypeIcon(column.type)}</span>
                  <div>
                    <h4 className="font-semibold text-slate-900">{column.label || '(Expand)'}</h4>
                    <p className="text-xs text-slate-500">{column.type}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">Default</span>
                  {column.hidden && (
                    <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded">Verborgen</span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-4 text-xs text-slate-500 mb-3">
                <span>Breedte: {column.width}</span>
                <span>{column.editable ? 'âœ“ Editable' : 'âœ— Read-only'}</span>
              </div>
              {column.options && (
                <div className="text-xs text-slate-500 mb-3">
                  <span className="font-medium">Opties:</span> {column.options.join(', ')}
                </div>
              )}
              {isAdminMode && (
                <div className="flex items-center gap-2 pt-2 border-t border-slate-200">
                  <button
                    onClick={() => {
                      setEditingColumn(column);
                      setShowEditor(true);
                    }}
                    className="flex-1 px-3 py-1.5 text-sm bg-orange-100 text-orange-700 rounded hover:bg-orange-200"
                  >
                    Bewerken
                  </button>
                  <button
                    onClick={() => handleToggleHidden(column.id)}
                    className="px-3 py-1.5 text-sm bg-slate-100 text-slate-700 rounded hover:bg-slate-200"
                    title={column.hidden ? 'Toon kolom' : 'Verberg kolom'}
                  >
                    {column.hidden ? 'ðŸ‘ï¸' : 'ðŸ™ˆ'}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Custom Columns */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-slate-900">Custom Kolommen</h3>
          <button
            onClick={() => {
              setEditingColumn(null);
              setShowEditor(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Nieuwe Kolom
          </button>
        </div>

        {safeCustomColumns.length === 0 ? (
          <div className="bg-slate-50 border-2 border-dashed border-slate-300 rounded-lg p-12 text-center">
            <div className="text-6xl mb-4">ðŸ”§</div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Nog geen custom kolommen</h3>
            <p className="text-slate-600 mb-4">
              Maak je eerste custom kolom om ChemPrep aan te passen aan jouw project behoeften.
            </p>
            <button
              onClick={() => {
                setEditingColumn(null);
                setShowEditor(true);
              }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              <Plus className="w-5 h-5" />
              Maak eerste kolom
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {safeCustomColumns.map(column => (
              <div key={column.id} className="bg-white border-2 border-purple-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{getTypeIcon(column.type)}</span>
                    <div>
                      <h4 className="font-semibold text-slate-900">{column.label}</h4>
                      <p className="text-xs text-slate-500">{column.type}</p>
                    </div>
                  </div>
                  <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded">Custom</span>
                </div>
                <div className="flex items-center gap-4 text-xs text-slate-500 mb-3">
                  <span>Breedte: {column.width}</span>
                  <span>{column.editable ? 'âœ“ Editable' : 'âœ— Read-only'}</span>
                </div>
                {column.options && column.options.length > 0 && (
                  <div className="text-xs text-slate-500 mb-3">
                    <span className="font-medium">Opties:</span> {column.options.slice(0, 3).join(', ')}
                    {column.options.length > 3 && ` (+${column.options.length - 3})`}
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setEditingColumn(column);
                      setShowEditor(true);
                    }}
                    className="flex-1 px-3 py-1.5 text-sm bg-slate-100 text-slate-700 rounded hover:bg-slate-200"
                  >
                    Bewerken
                  </button>
                  <button
                    onClick={() => handleDeleteColumn(column.id, false)}
                    className="px-3 py-1.5 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Column Editor Modal */}
      {showEditor && (
        <ColumnEditor
          column={editingColumn}
          onSave={handleSaveColumn}
          onClose={() => {
            setShowEditor(false);
            setEditingColumn(null);
          }}
          isAdmin={isAdminMode}
        />
      )}
    </div>
  );
};

// ===== COLUMN EDITOR MODAL =====
const ColumnEditor = ({ column, onSave, onClose, isAdmin }) => {
  const [formData, setFormData] = useState(column || {
    id: '',
    label: '',
    type: 'text',
    width: 'w-40',
    editable: true,
    options: [],
    isDefault: false,
    hidden: false
  });
  const [optionsText, setOptionsText] = useState(
    column?.options ? column.options.join('\n') : ''
  );

  const handleSubmit = () => {
    if (!formData.label.trim()) {
      alert('Label is verplicht');
      return;
    }

    const finalData = { ...formData };
    
    // Generate ID for new columns
    if (!finalData.id) {
      if (finalData.isDefault) {
        // For new default columns, admin must provide ID
        alert('ID is verplicht voor default kolommen');
        return;
      } else {
        // For custom columns, auto-generate
        finalData.id = 'custom_' + Date.now();
      }
    }
    
    // Parse options for select type
    if (finalData.type === 'select') {
      finalData.options = optionsText
        .split('\n')
        .map(o => o.trim())
        .filter(o => o.length > 0);
      
      if (finalData.options.length === 0) {
        alert('Select type vereist minimaal 1 optie');
        return;
      }
    }

    console.log('ðŸ’¾ Saving column:', finalData);
    onSave(finalData);
    onClose();
  };

  const typeOptions = [
    { value: 'text', label: 'ðŸ“ Text', description: 'Vrij tekst veld' },
    { value: 'number', label: 'ðŸ”¢ Number', description: 'Alleen nummers' },
    { value: 'select', label: 'ðŸ“‹ Select', description: 'Dropdown lijst' },
    { value: 'date', label: 'ðŸ“… Date', description: 'Datum picker' },
    { value: 'checkbox', label: 'âœ“ Checkbox', description: 'Ja/Nee' },
    { value: 'email', label: 'ðŸ“§ Email', description: 'Email adres' },
    { value: 'url', label: 'ðŸ”— URL', description: 'Web link' },
  ];

  const widthOptions = [
    { value: 'w-12', label: 'Extra Small (48px)' },
    { value: 'w-24', label: 'Small (96px)' },
    { value: 'w-32', label: 'Medium (128px)' },
    { value: 'w-40', label: 'Large (160px)' },
    { value: 'w-48', label: 'Extra Large (192px)' },
    { value: 'w-64', label: 'XXL (256px)' },
  ];

  const isNewDefaultColumn = formData.isDefault && !column?.id;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
        <div className={`px-6 py-4 flex items-center justify-between rounded-t-xl ${
          formData.isDefault ? 'bg-gradient-to-r from-orange-600 to-orange-700' : 'bg-gradient-to-r from-purple-600 to-purple-700'
        }`}>
          <h3 className="text-xl font-bold text-white">
            {column ? 'Kolom Bewerken' : formData.isDefault ? 'ðŸ” Nieuwe Default Kolom' : 'Nieuwe Kolom'}
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-lg">
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {/* Admin Warning for Default Columns */}
          {formData.isDefault && isAdmin && (
            <div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
              <p className="text-sm text-orange-800">
                ðŸ” <strong>Admin Mode:</strong> Je bewerkt een default kolom. Deze wijzigingen zijn globaal voor alle projecten.
              </p>
            </div>
          )}

          {/* ID Field (alleen voor nieuwe default columns) */}
          {isNewDefaultColumn && isAdmin && (
            <div className="mb-4">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                ID * (bijv. "budget", "inspector")
              </label>
              <input
                type="text"
                value={formData.id}
                onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                placeholder="bijv. budget"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 font-mono text-sm"
              />
              <p className="text-xs text-slate-500 mt-1">
                Unieke ID voor deze kolom (lowercase, geen spaties)
              </p>
            </div>
          )}

          {/* Existing ID (read-only voor bestaande default columns) */}
          {formData.isDefault && column?.id && (
            <div className="mb-4">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                ID
              </label>
              <input
                type="text"
                value={formData.id}
                disabled
                className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-slate-100 font-mono text-sm text-slate-600"
              />
              <p className="text-xs text-slate-500 mt-1">
                ID kan niet worden gewijzigd
              </p>
            </div>
          )}

          {/* Label */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Label *
            </label>
            <input
              type="text"
              value={formData.label}
              onChange={(e) => setFormData({ ...formData, label: e.target.value })}
              placeholder="bijv. Inspector"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              autoFocus={!isNewDefaultColumn}
            />
          </div>

          {/* Type */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Type *
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              disabled={formData.isDefault && !isAdmin}
            >
              {typeOptions.map(opt => (
                <option key={opt.value} value={opt.value}>
                  {opt.label} - {opt.description}
                </option>
              ))}
            </select>
            {formData.isDefault && !isAdmin && (
              <p className="text-xs text-slate-500 mt-1">Default kolommen type kan niet worden gewijzigd</p>
            )}
          </div>

          {/* Options for Select type */}
          {formData.type === 'select' && (
            <div className="mb-4">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Opties (Ã©Ã©n per regel) *
              </label>
              <textarea
                value={optionsText}
                onChange={(e) => setOptionsText(e.target.value)}
                placeholder="John&#10;Jane&#10;Mike"
                rows={5}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 font-mono text-sm"
              />
              <p className="text-xs text-slate-500 mt-1">
                {optionsText.split('\n').filter(o => o.trim()).length} opties
              </p>
            </div>
          )}

          {/* Width */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Breedte
            </label>
            <select
              value={formData.width}
              onChange={(e) => setFormData({ ...formData, width: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            >
              {widthOptions.map(opt => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Editable */}
          <div className="mb-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.editable}
                onChange={(e) => setFormData({ ...formData, editable: e.target.checked })}
                className="w-4 h-4 text-purple-600 rounded"
              />
              <span className="text-sm font-medium text-slate-700">
                Bewerkbaar (dubbel-klik om te bewerken)
              </span>
            </label>
          </div>
        </div>

        <div className="border-t border-slate-200 px-6 py-4 bg-slate-50 flex items-center justify-end gap-3 rounded-b-xl">
          <button
            onClick={onClose}
            className="px-4 py-2 text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
          >
            Annuleren
          </button>
          <button
            onClick={handleSubmit}
            className={`px-6 py-2 text-white rounded-lg transition-colors font-semibold ${
              formData.isDefault ? 'bg-orange-600 hover:bg-orange-700' : 'bg-purple-600 hover:bg-purple-700'
            }`}
          >
            {column ? 'Opslaan' : 'Aanmaken'}
          </button>
        </div>
      </div>
    </div>
  );
};

// ===== VIEW MANAGER MODAL =====
const ViewManager = ({ currentView, views, onSaveView, onLoadView, onDeleteView, onClose }) => {
  const [viewName, setViewName] = useState('');
  const [viewType, setViewType] = useState('personal');
  const [showSaveForm, setShowSaveForm] = useState(false);

  const handleSave = () => {
    if (!viewName.trim()) {
      alert('Geef een naam op voor de weergave');
      return;
    }

    onSaveView({
      name: viewName,
      type: viewType
    });

    setViewName('');
    setShowSaveForm(false);
  };

  const personalViews = views.filter(v => v.type === 'personal');
  const globalViews = views.filter(v => v.type === 'global');

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Layers className="w-6 h-6 text-white" />
            <h3 className="text-xl font-bold text-white">Weergaven Beheren</h3>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {!showSaveForm ? (
            <button
              onClick={() => setShowSaveForm(true)}
              className="w-full flex items-center justify-center gap-2 p-4 border-2 border-dashed border-slate-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors mb-6"
            >
              <Plus className="w-5 h-5 text-purple-600" />
              <span className="font-semibold text-purple-600">Huidige Weergave Opslaan</span>
            </button>
          ) : (
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-6">
              <h4 className="font-semibold text-slate-900 mb-3">Nieuwe Weergave Opslaan</h4>
              <div className="space-y-3">
                <input
                  type="text"
                  value={viewName}
                  onChange={(e) => setViewName(e.target.value)}
                  placeholder="Naam van weergave..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  autoFocus
                />
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="viewType"
                      value="personal"
                      checked={viewType === 'personal'}
                      onChange={(e) => setViewType(e.target.value)}
                      className="w-4 h-4 text-purple-600"
                    />
                    <span className="text-sm font-medium text-slate-700">Persoonlijk</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="viewType"
                      value="global"
                      checked={viewType === 'global'}
                      onChange={(e) => setViewType(e.target.value)}
                      className="w-4 h-4 text-purple-600"
                    />
                    <span className="text-sm font-medium text-slate-700">Globaal (voor iedereen)</span>
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Opslaan
                  </button>
                  <button
                    onClick={() => {
                      setShowSaveForm(false);
                      setViewName('');
                    }}
                    className="px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    Annuleren
                  </button>
                </div>
              </div>
            </div>
          )}

          {personalViews.length > 0 && (
            <div className="mb-6">
              <h4 className="font-semibold text-slate-900 mb-3">Persoonlijke Weergaven</h4>
              <div className="space-y-2">
                {personalViews.map(view => (
                  <div key={view.id} className="flex items-center gap-2 p-3 border border-slate-200 rounded-lg hover:bg-slate-50">
                    <User className="w-5 h-5 text-blue-600" />
                    <span className="flex-1 font-medium text-slate-900">{view.name}</span>
                    <button
                      onClick={() => onLoadView(view)}
                      className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Laden
                    </button>
                    <button
                      onClick={() => onDeleteView(view.id)}
                      className="p-1 text-red-600 hover:bg-red-50 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {globalViews.length > 0 && (
            <div>
              <h4 className="font-semibold text-slate-900 mb-3">Globale Weergaven</h4>
              <div className="space-y-2">
                {globalViews.map(view => (
                  <div key={view.id} className="flex items-center gap-2 p-3 border border-slate-200 rounded-lg hover:bg-slate-50">
                    <Users className="w-5 h-5 text-purple-600" />
                    <span className="flex-1 font-medium text-slate-900">{view.name}</span>
                    <button
                      onClick={() => onLoadView(view)}
                      className="px-3 py-1 text-sm bg-purple-600 text-white rounded hover:bg-purple-700"
                    >
                      Laden
                    </button>
                    <button
                      onClick={() => onDeleteView(view.id)}
                      className="p-1 text-red-600 hover:bg-red-50 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {views.length === 0 && !showSaveForm && (
            <div className="text-center py-8 text-slate-500">
              <Layers className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>Nog geen opgeslagen weergaven</p>
              <p className="text-sm mt-1">Klik hierboven om je eerste weergave op te slaan</p>
            </div>
          )}
        </div>

        <div className="border-t border-slate-200 px-6 py-4 bg-slate-50">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors font-semibold"
          >
            Sluiten
          </button>
        </div>
      </div>
    </div>
  );
};

// ===== ACTIVITY ID GENERATION HELPERS =====
const generatePrefix = (index) => {
  // Generate A, B, C, ... Z, AA, AB, AC, ... ZZ, AAA, ...
  let prefix = '';
  let num = index;
  
  while (num >= 0) {
    prefix = String.fromCharCode(65 + (num % 26)) + prefix;
    num = Math.floor(num / 26) - 1;
  }
  
  return prefix;
};

const generateActivityId = (prefix, sequenceNumber) => {
  // Generate A010, A020, A030, etc.
  const paddedNumber = String(sequenceNumber).padStart(3, '0');
  return `${prefix}${paddedNumber}`;
};

const getScopePrefix = (scopeIndex) => {
  // Generate A, B, C, ... Z, AA, AB, AC, ... infinite
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let prefix = '';
  let index = scopeIndex;
  
  do {
    prefix = letters[index % 26] + prefix;
    index = Math.floor(index / 26) - 1;
  } while (index >= 0);
  
  return prefix;
};

const getNextActivityId = (activities, prefix) => {
  // Find highest sequence number for this prefix
  const existingIds = activities
    .map(a => a.activityId)
    .filter(id => id && id.startsWith(prefix));
  
  if (existingIds.length === 0) {
    return generateActivityId(prefix, 10); // Start at 010
  }
  
  const maxNumber = Math.max(...existingIds.map(id => {
    const numPart = id.replace(prefix, '');
    return parseInt(numPart) || 0;
  }));
  
  return generateActivityId(prefix, maxNumber + 10);
};

const renumberActivities = (activities, prefix) => {
  // Renumber all activities in sequence: A010, A020, A030, ...
  return activities.map((activity, index) => ({
    ...activity,
    activityId: generateActivityId(prefix, (index + 1) * 10)
  }));
};

const sortActivitiesByPhaseAndNumber = (activities) => {
  // Phase order (strict sequence)
  const phaseOrder = ['PRE-TA', 'UITBEDRIJF', 'TA', 'INBEDRIJF', 'POST-TA'];
  
  return [...activities].sort((a, b) => {
    // First sort by phase
    const phaseA = phaseOrder.indexOf(a.phase || 'TA');
    const phaseB = phaseOrder.indexOf(b.phase || 'TA');
    
    if (phaseA !== phaseB) {
      return phaseA - phaseB;
    }
    
    // Then sort by activityId number within same phase
    const numA = parseInt(a.activityId.replace(/^[A-Z]+/, '') || '0');
    const numB = parseInt(b.activityId.replace(/^[A-Z]+/, '') || '0');
    
    return numA - numB;
  });
};

const groupActivitiesByPhase = (activities) => {
  // Group activities by phase in correct order
  const phaseOrder = ['PRE-TA', 'UITBEDRIJF', 'TA', 'INBEDRIJF', 'POST-TA'];
  const grouped = {};
  
  // Initialize all phases
  phaseOrder.forEach(phase => {
    grouped[phase] = [];
  });
  
  // Group activities
  activities.forEach(activity => {
    const phase = activity.phase || 'TA';
    if (grouped[phase]) {
      grouped[phase].push(activity);
    }
  });
  
  return grouped;
};

// ===== WERKPAKKET DETAIL PAGE (FULLSCREEN) =====
const WerkpakketDetailPage = ({ 
  scopeItem, 
  onBack, 
  onUpdate,
  resources,
  suppliers,
  materials,
  projectStartDate,
  templates,
  scopeItemIndex = 0 // NEW: Index for prefix generation
}) => {
  const toast = useToast();
  const [activeTab, setActiveTab] = useState('activities');
  const [editingActivity, setEditingActivity] = useState(null);
  const [draggedActivity, setDraggedActivity] = useState(null);
  const [validationResult, setValidationResult] = useState(null); // FASE 1: Validation
  
  // Generate and persist prefix for this scope item
  const activityPrefix = scopeItem.activityPrefix || getScopePrefix(scopeItemIndex);
  
  // Save prefix to scopeItem if not already set
  useEffect(() => {
    if (!scopeItem.activityPrefix) {
      onUpdate({ ...scopeItem, activityPrefix: activityPrefix });
    }
  }, []);
  
  const tabs = [
    { id: 'activities', label: 'Activiteiten', icon: Activity },
    { id: 'relationships', label: 'Relaties', icon: Link2 },
    { id: 'materials', label: 'Materialen', icon: Box },
    { id: 'costs', label: 'Kostenbewaking', icon: DollarSign },
  ];

  const handleAddActivity = () => {
    const activities = scopeItem.plannedActivities || [];
    const newActivityId = getNextActivityId(activities, activityPrefix);
    
    setEditingActivity({
      id: `pa-${Date.now()}`,
      templateId: '',
      activityId: newActivityId, // AUTO-GENERATED!
      overrideDescription: '',
      duration: 1,
      phase: 'TA',
      resources: [],
      materials: [],
      risks: [],
      relationships: [],
      executionStatus: 'Planned',
      progress: 0
    });
  };

  const handleEditActivity = (activity) => {
    setEditingActivity(activity);
  };

  const handleSaveActivity = (activityData) => {
    const activities = scopeItem.plannedActivities || [];
    let updatedActivities;
    
    // Check if activity exists in current list
    const existingIndex = activities.findIndex(a => a.id === activityData.id);
    const isNew = existingIndex === -1;
    
    if (isNew) {
      // Add new activity
      updatedActivities = [...activities, activityData];
    } else {
      // Update existing activity
      updatedActivities = activities.map(a => a.id === activityData.id ? activityData : a);
    }
    
    // Sort by phase and activityId number
    updatedActivities = sortActivitiesByPhaseAndNumber(updatedActivities);
    
    onUpdate({ ...scopeItem, plannedActivities: updatedActivities });
    setEditingActivity(null);
    toast.success(isNew ? 'Activiteit toegevoegd' : 'Activiteit bijgewerkt en gesorteerd');
  };

  const handleDeleteActivity = (activityId) => {
    const activity = (scopeItem.plannedActivities || []).find(a => a.id === activityId);
    if (!activity) {
      toast.error('Activiteit niet gevonden');
      return;
    }
    
    const confirmMessage = `Weet je zeker dat je "${activity.overrideDescription || activity.activityId}" wilt verwijderen?`;
    if (!window.confirm(confirmMessage)) return;
    
    const updatedActivities = (scopeItem.plannedActivities || []).filter(a => a.id !== activityId);
    onUpdate({ ...scopeItem, plannedActivities: updatedActivities });
    setEditingActivity(null); // Close modal if it's open
    toast.success('Activiteit verwijderd');
  };

  // Drag and Drop handlers for activity reordering
  const handleDragStart = (e, activity) => {
    setDraggedActivity(activity);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, targetActivity) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, targetActivity) => {
    e.preventDefault();
    
    if (!draggedActivity || draggedActivity.id === targetActivity.id) {
      setDraggedActivity(null);
      return;
    }
    
    const activities = scopeItem.plannedActivities || [];
    
    // Update phase if dragging to different phase
    const phaseChanged = draggedActivity.phase !== targetActivity.phase;
    const updatedDragged = {
      ...draggedActivity,
      phase: targetActivity.phase // Adopt target's phase!
    };
    
    // Update the activity with new phase
    const newActivities = activities.map(a => 
      a.id === draggedActivity.id ? updatedDragged : a
    );
    
    // Sort by phase and activity number
    const sortedActivities = sortActivitiesByPhaseAndNumber(newActivities);
    
    onUpdate({ ...scopeItem, plannedActivities: sortedActivities });
    setDraggedActivity(null);
    
    if (phaseChanged) {
      toast.success(`Activiteit verplaatst naar fase "${targetActivity.phase}" en gesorteerd`);
    } else {
      toast.success('Volgorde aangepast en gesorteerd');
    }
  };

  const handleDragEnd = () => {
    setDraggedActivity(null);
  };

  return (
    <div className="h-screen flex flex-col bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                className="flex items-center gap-2 px-3 py-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
                Terug naar Scope Manager
              </button>
              <div className="h-8 w-px bg-slate-300" />
              <div>
                <h1 className="text-2xl font-bold text-slate-900">{scopeItem.tagNumber}</h1>
                <p className="text-sm text-slate-600">{scopeItem.description}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                scopeItem.priority === 'High' ? 'bg-red-100 text-red-700' :
                scopeItem.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                'bg-green-100 text-green-700'
              }`}>
                {scopeItem.priority}
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                scopeItem.status === 'In Scope' ? 'bg-green-100 text-green-700' :
                scopeItem.status === 'Op Hold' ? 'bg-orange-100 text-orange-700' :
                'bg-slate-100 text-slate-700'
              }`}>
                {scopeItem.status}
              </span>
            </div>
          </div>

          {/* FASE 1: Status Meetpunten Bar */}
          <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center gap-1 flex-wrap">
              <span className="text-xs font-semibold text-gray-600 mr-2">STATUS:</span>
              
              <StatusMeetpuntCompact
                title="Werkbeschr."
                icon={FileText}
                status={scopeItem.statusMeetpoints?.werkbeschrijving || 'GEEN'}
                onStatusChange={(status) => {
                  onUpdate({
                    ...scopeItem,
                    statusMeetpoints: { ...scopeItem.statusMeetpoints, werkbeschrijving: status }
                  });
                }}
              />
              <div className="w-px h-8 bg-gray-300 mx-1" />
              
              <StatusMeetpuntCompact
                title="Materialen"
                icon={Package}
                status={scopeItem.statusMeetpoints?.materialen || 'GEEN'}
                onStatusChange={(status) => {
                  onUpdate({
                    ...scopeItem,
                    statusMeetpoints: { ...scopeItem.statusMeetpoints, materialen: status }
                  });
                }}
              />
              <div className="w-px h-8 bg-gray-300 mx-1" />
              
              <StatusMeetpuntCompact
                title="T.R.A."
                icon={AlertTriangle}
                status={scopeItem.statusMeetpoints?.tra || 'NIET_VAN_TOEPASSING'}
                onStatusChange={(status) => {
                  onUpdate({
                    ...scopeItem,
                    statusMeetpoints: { ...scopeItem.statusMeetpoints, tra: status }
                  });
                }}
              />
              <div className="w-px h-8 bg-gray-300 mx-1" />
              
              <StatusMeetpuntCompact
                title="Documenten"
                icon={FileText}
                status={scopeItem.statusMeetpoints?.documenten || 'GEEN'}
                onStatusChange={(status) => {
                  onUpdate({
                    ...scopeItem,
                    statusMeetpoints: { ...scopeItem.statusMeetpoints, documenten: status }
                  });
                }}
              />
              <div className="w-px h-8 bg-gray-300 mx-1" />
              
              <StatusMeetpuntCompact
                title="Kosten"
                icon={DollarSign}
                status={scopeItem.statusMeetpoints?.kosten || 'NIET_VAN_TOEPASSING'}
                onStatusChange={(status) => {
                  onUpdate({
                    ...scopeItem,
                    statusMeetpoints: { ...scopeItem.statusMeetpoints, kosten: status }
                  });
                }}
              />
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-t-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-slate-50 text-blue-600 font-semibold border-b-2 border-blue-600'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto px-6 py-6">
          {activeTab === 'activities' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-900">Activiteiten ({scopeItem.plannedActivities?.length || 0})</h2>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setValidationResult(validatePlanning(scopeItem))}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Validate Planning
                  </button>
                  <button
                    onClick={handleAddActivity}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Nieuwe Activiteit
                  </button>
                </div>
              </div>

              {/* Drag & Drop Info */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="text-blue-600 mt-0.5">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-blue-900 mb-1">ðŸ’¡ Drag & Drop tussen Fases</h3>
                    <p className="text-sm text-blue-700">
                      Sleep activiteiten binnen dezelfde fase of naar een andere fase. De fase wijzigt automatisch! Activiteiten worden gesorteerd op Activity ID nummer binnen elke fase.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                {(() => {
                  const sortedActivities = sortActivitiesByPhaseAndNumber(scopeItem.plannedActivities || []);
                  const groupedActivities = groupActivitiesByPhase(sortedActivities);
                  const phaseOrder = ['PRE-TA', 'UITBEDRIJF', 'TA', 'INBEDRIJF', 'POST-TA'];
                  
                  if (sortedActivities.length === 0) {
                    return (
                      <div className="text-center py-12 text-slate-500">
                        <Activity className="w-12 h-12 mx-auto mb-3 opacity-30" />
                        <p>Nog geen activiteiten</p>
                        <p className="text-sm mt-1">Klik op "Nieuwe Activiteit" om te beginnen</p>
                      </div>
                    );
                  }
                  
                  return (
                    <table className="w-full">
                      <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                          <th className="px-3 py-3 text-center text-xs font-semibold text-slate-600 uppercase w-12">â‹®â‹®</th>
                          <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">ID</th>
                          <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Beschrijving</th>
                          <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Fase</th>
                          <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Duration</th>
                          <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Calc.</th>
                          <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Progress</th>
                          <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Acties</th>
                        </tr>
                      </thead>
                      <tbody>
                        {phaseOrder.map(phase => {
                          const activitiesInPhase = groupedActivities[phase] || [];
                          
                          if (activitiesInPhase.length === 0) return null;
                          
                          return (
                            <React.Fragment key={phase}>
                              {/* Phase Header Row */}
                              <tr className="bg-gradient-to-r from-blue-50 to-slate-50 border-t-2 border-blue-200">
                                <td colSpan="8" className="px-6 py-3">
                                  <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                    <span className="font-bold text-blue-900 uppercase text-sm tracking-wide">
                                      {phase}
                                    </span>
                                    <span className="text-xs text-blue-600 font-medium">
                                      ({activitiesInPhase.length} {activitiesInPhase.length === 1 ? 'activiteit' : 'activiteiten'})
                                    </span>
                                  </div>
                                </td>
                              </tr>
                              
                              {/* Activities in this phase */}
                              {activitiesInPhase.map((activity, idx) => {
                                const isDragging = draggedActivity?.id === activity.id;
                                
                                return (
                                  <tr 
                                    key={activity.id} 
                                    draggable
                                    onDragStart={(e) => handleDragStart(e, activity)}
                                    onDragOver={(e) => handleDragOver(e, activity)}
                                    onDrop={(e) => handleDrop(e, activity)}
                                    onDragEnd={handleDragEnd}
                                    className={`hover:bg-slate-50 transition-all border-b border-slate-100 ${
                                      isDragging ? 'opacity-50 bg-blue-50' : ''
                                    }`}
                                  >
                                    {/* Drag Handle */}
                                    <td className="px-3 py-4 text-center">
                                      <div className="cursor-move text-slate-400 hover:text-slate-600">
                                        <svg className="w-4 h-4 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                                        </svg>
                                      </div>
                                    </td>
                                    <td className="px-6 py-4">
                                      <span className="font-mono text-sm font-semibold text-blue-600">{activity.activityId}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                      <span className="text-sm text-slate-900">{activity.overrideDescription}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                      <span className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${
                                        phase === 'PRE-TA' ? 'bg-purple-100 text-purple-700' :
                                        phase === 'UITBEDRIJF' ? 'bg-orange-100 text-orange-700' :
                                        phase === 'TA' ? 'bg-blue-100 text-blue-700' :
                                        phase === 'INBEDRIJF' ? 'bg-green-100 text-green-700' :
                                        'bg-slate-100 text-slate-700'
                                      }`}>
                                        {phase}
                                      </span>
                                    </td>
                                    <td className="px-6 py-4">
                                      <span className="text-sm text-slate-600">{activity.duration}d</span>
                                    </td>
                                    <td className="px-6 py-4">
                                      {activity.calculation?.enabled && calculateNormUnits(activity.calculation) > 0 ? (
                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-cyan-100 text-cyan-700 rounded text-xs font-medium">
                                          <Calculator className="w-3 h-3" />
                                          {calculateNormUnits(activity.calculation)} {activity.calculation.eenheid}
                                        </span>
                                      ) : (
                                        <span className="text-xs text-slate-300">—</span>
                                      )}
                                    </td>
                                    <td className="px-6 py-4">
                                      <span className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${
                                        activity.executionStatus === 'Completed' ? 'bg-green-100 text-green-700' :
                                        activity.executionStatus === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                                        activity.executionStatus === 'On Hold' ? 'bg-orange-100 text-orange-700' :
                                        'bg-slate-100 text-slate-600'
                                      }`}>
                                        {activity.executionStatus}
                                      </span>
                                    </td>
                                    <td className="px-6 py-4">
                                      <div className="flex items-center gap-2">
                                        <div className="w-24 bg-slate-200 rounded-full h-2">
                                          <div 
                                            className="bg-blue-600 h-2 rounded-full" 
                                            style={{ width: `${activity.progress || 0}%` }}
                                          />
                                        </div>
                                        <span className="text-sm text-slate-600">{activity.progress || 0}%</span>
                                      </div>
                                    </td>
                                    <td className="px-6 py-4">
                                      <div className="flex items-center gap-2">
                                        <button
                                          onClick={() => handleEditActivity(activity)}
                                          className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                                        >
                                          <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button
                                          onClick={() => handleDeleteActivity(activity.id)}
                                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                                        >
                                          <Trash2 className="w-4 h-4" />
                                        </button>
                                      </div>
                                    </td>
                                  </tr>
                                );
                              })}
                            </React.Fragment>
                          );
                        })}
                      </tbody>
                    </table>
                  );
                })()}
              </div>
            </div>
          )}

          {activeTab === 'relationships' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-900">Relaties & Dependencies</h2>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                {scopeItem.plannedActivities && scopeItem.plannedActivities.length > 0 ? (
                  <div className="p-6">
                    <p className="text-sm text-slate-600 mb-4">
                      Overzicht van alle dependencies tussen activiteiten in dit scope item.
                    </p>
                    
                    {scopeItem.plannedActivities.map(activity => {
                      const hasRelationships = activity.relationships && activity.relationships.length > 0;
                      
                      return (
                        <div key={activity.id} className="mb-4 pb-4 border-b border-slate-200 last:border-b-0">
                          <div className="flex items-start gap-3">
                            <div className="flex-1">
                              <div className="font-semibold text-slate-900">
                                {activity.activityId} - {activity.overrideDescription}
                              </div>
                              
                              {hasRelationships ? (
                                <div className="mt-2 space-y-2">
                                  {activity.relationships.map((rel, idx) => {
                                    const predecessor = scopeItem.plannedActivities.find(a => a.id === rel.predecessorId);
                                    return (
                                      <div key={idx} className="flex items-center gap-2 text-sm">
                                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                                          {rel.type}
                                        </span>
                                        <span className="text-slate-600">
                                          Afhankelijk van: <span className="font-medium text-slate-900">
                                            {predecessor ? `${predecessor.activityId} - ${predecessor.overrideDescription}` : 'Onbekend'}
                                          </span>
                                        </span>
                                        {rel.lag !== 0 && (
                                          <span className="text-slate-500">
                                            (Lag: {rel.lag} dagen)
                                          </span>
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>
                              ) : (
                                <p className="text-sm text-slate-500 mt-1">Geen dependencies</p>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12 text-slate-500">
                    <Link2 className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p>Geen activiteiten om relaties voor te tonen</p>
                    <p className="text-sm mt-1">Voeg eerst activiteiten toe</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'materials' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-900">Materialen Overzicht</h2>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                {scopeItem.plannedActivities && scopeItem.plannedActivities.length > 0 ? (
                  <div className="p-6">
                    <p className="text-sm text-slate-600 mb-4">
                      Alle materialen benodigd voor activiteiten in dit scope item.
                    </p>
                    
                    {(() => {
                      // Collect all materials from all activities
                      const allMaterials = [];
                      scopeItem.plannedActivities.forEach(activity => {
                        if (activity.materials && activity.materials.length > 0) {
                          activity.materials.forEach(mat => {
                            const material = materials.find(m => m.id === mat.materialId);
                            if (material) {
                              allMaterials.push({
                                activity: activity,
                                material: material,
                                quantity: mat.quantity || 1
                              });
                            }
                          });
                        }
                      });
                      
                      if (allMaterials.length === 0) {
                        return (
                          <div className="text-center py-12 text-slate-500">
                            <Box className="w-12 h-12 mx-auto mb-3 opacity-30" />
                            <p>Geen materialen toegewezen</p>
                            <p className="text-sm mt-1">Voeg materialen toe aan activiteiten</p>
                          </div>
                        );
                      }
                      
                      return (
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead className="bg-slate-50 border-b border-slate-200">
                              <tr>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Materiaal</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Activiteit</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Quantity</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Eenheid</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200">
                              {allMaterials.map((item, idx) => (
                                <tr key={idx} className="hover:bg-slate-50">
                                  <td className="px-4 py-3">
                                    <div className="font-medium text-slate-900">{item.material.name}</div>
                                    <div className="text-sm text-slate-600">{item.material.description}</div>
                                  </td>
                                  <td className="px-4 py-3">
                                    <div className="text-sm text-slate-900">{item.activity.activityId}</div>
                                    <div className="text-xs text-slate-600">{item.activity.overrideDescription}</div>
                                  </td>
                                  <td className="px-4 py-3 text-slate-900">{item.quantity}</td>
                                  <td className="px-4 py-3 text-slate-600">{item.material.unit}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      );
                    })()}
                  </div>
                ) : (
                  <div className="text-center py-12 text-slate-500">
                    <Box className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p>Geen activiteiten om materialen voor te tonen</p>
                    <p className="text-sm mt-1">Voeg eerst activiteiten toe</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'costs' && (
            <div className="space-y-6">

              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Kostenbewaking</h2>
                  <p className="text-sm text-slate-500 mt-1">Auto-genereer cost rules vanuit resources en materialen</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-500 uppercase font-medium">Totaal</p>
                  <p className="text-3xl font-bold text-emerald-600">
                    €{(() => {
                      const c = calculateTotalCost(scopeItem);
                      return c.total.toFixed(2);
                    })()}
                  </p>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    const newRules = generateCostRules(scopeItem, resources, materials);
                    onUpdate({ ...scopeItem, costRules: newRules });
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  Refresh Cost Rules
                </button>
              </div>

              {/* Category breakdown */}
              {(scopeItem.costRules || []).length > 0 && (
                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                  <h3 className="font-semibold text-slate-900 mb-4">Category Breakdown</h3>
                  <div className="space-y-3">
                    {getCostBreakdown(scopeItem.costRules).map(({ category, amount, percentage }) => (
                      <div key={category} className="flex items-center gap-3">
                        <span className="w-28 text-sm text-slate-600">{category}</span>
                        <div className="flex-1 h-6 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-emerald-500 flex items-center justify-end px-2 transition-all"
                            style={{ width: percentage + '%' }}
                          >
                            {percentage > 10 && (
                              <span className="text-xs text-white font-medium">{percentage}%</span>
                            )}
                          </div>
                        </div>
                        <span className="w-28 text-right font-semibold text-slate-900">€{amount.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Cost rules table */}
              {(scopeItem.costRules || []).length > 0 ? (
                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                  <CostRulesTable
                    costRules={scopeItem.costRules}
                    onUpdate={(rules) => onUpdate({ ...scopeItem, costRules: rules })}
                    onDelete={(id) => onUpdate({ ...scopeItem, costRules: (scopeItem.costRules || []).filter(r => r.id !== id) })}
                    onAdd={() => {
                      const newRule = {
                        id: 'cost-manual-' + Date.now(),
                        type: 'manual',
                        description: 'Manual item',
                        aantal: 1,
                        eenheid: 'stuks',
                        tarief: 0,
                        vastePrijs: 0,
                        toeslag: 0,
                        totaal: 0,
                        category: 'Other',
                        isAutoGenerated: false
                      };
                      onUpdate({ ...scopeItem, costRules: [...(scopeItem.costRules || []), newRule] });
                    }}
                  />
                </div>
              ) : (
                <div className="bg-white border border-slate-200 rounded-xl p-12 text-center shadow-sm">
                  <DollarSign className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-500 mb-4">Nog geen cost rules. Klik op "Refresh Cost Rules" om te genereren vanuit je activiteiten.</p>
                </div>
              )}

              {/* Contingency */}
              {(scopeItem.costRules || []).length > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-blue-900">Contingency</h3>
                    <span className="text-lg font-bold text-blue-700">
                      €{calculateTotalCost(scopeItem).contingencyAmount.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <input
                      type="range" min="0" max="30" step="1"
                      value={scopeItem.contingency?.percentage || 10}
                      onChange={(e) => onUpdate({
                        ...scopeItem,
                        contingency: { percentage: parseInt(e.target.value) }
                      })}
                      className="flex-1"
                    />
                    <span className="w-12 text-right font-bold text-blue-800">
                      {scopeItem.contingency?.percentage || 10}%
                    </span>
                  </div>
                  <div className="flex justify-between mt-3 pt-3 border-t border-blue-200">
                    <span className="text-sm text-blue-700">Subtotaal:</span>
                    <span className="font-semibold text-blue-800">€{calculateTotalCost(scopeItem).subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-sm font-bold text-blue-900">TOTAAL:</span>
                    <span className="font-bold text-lg text-blue-900">€{calculateTotalCost(scopeItem).total.toFixed(2)}</span>
                  </div>
                </div>
              )}

            </div>
          )}
        </div>
      </div>

      {/* Activity Edit Modal */}
      {editingActivity !== null && (
        <ActivityEditorModal
          activity={editingActivity}
          scopeItem={scopeItem}
          onSave={handleSaveActivity}
          onClose={() => setEditingActivity(null)}
          onDelete={() => handleDeleteActivity(editingActivity.id)}
          resources={resources}
          materials={materials}
          suppliers={suppliers}
          templates={templates}
          allActivitiesInScope={scopeItem.plannedActivities || []}
        />
      )}

      {/* FASE 1: Validation Report Modal */}
      {validationResult && (
        <ValidationReport
          result={validationResult}
          onClose={() => setValidationResult(null)}
        />
      )}
    </div>
  );
};

// ===== SCOPE MANAGER COMPONENT (COMPLETE) =====
const ScopeManager = ({ 
  scopeItems, 
  setScopeItems, 
  templates, 
  resources, 
  materials, 
  suppliers,
  workflowStatuses,
  users,
  projectStartDate,
  activeProjectId,
  customColumns = [],
  defaultColumns = []
}) => {
  const toast = useToast();
  
  // Safety check: ensure defaultColumns is always an array
  const safeDefaultColumns = Array.isArray(defaultColumns) ? defaultColumns : [];
  
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [expandedRows, setExpandedRows] = useState({});
  const [selectedScopeId, setSelectedScopeId] = useState(null);
  const [showDetailPanel, setShowDetailPanel] = useState(false);
  const [editingActivity, setEditingActivity] = useState(null);
  const [editingScopeId, setEditingScopeId] = useState(null);
  const [showGanttChart, setShowGanttChart] = useState(false);
  const [ganttScopeItem, setGanttScopeItem] = useState(null);
  const [showTemplateQuickAdd, setShowTemplateQuickAdd] = useState(false);
  const [quickAddScopeId, setQuickAddScopeId] = useState(null);
  const [selectedActivities, setSelectedActivities] = useState({}); // { scopeId: [activityIds] }
  const [copiedActivities, setCopiedActivities] = useState([]);
  const [showBulkEditModal, setShowBulkEditModal] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false });
  const [detailViewScopeId, setDetailViewScopeId] = useState(null);
  const [showQRModal, setShowQRModal] = useState(false);
  const [qrScopeItem, setQRScopeItem] = useState(null);
  
  // Sort state
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc'); // 'asc' or 'desc'
  
  // Filter operators state
  const [filterOperators, setFilterOperators] = useState({
    tagNumber: 'contains',
    description: 'contains',
    status: 'equals',
    priority: 'equals'
  });
  
  // NEW: Column Management State
  const [visibleColumns, setVisibleColumns] = useState(() => {
    const saved = localStorage.getItem('scopeManager_columns_' + activeProjectId);
    const defaultColumns = ['expand', 'tagNumber', 'description', 'priority', 'status', 'workflow', 'planner', 'activities', 'actions'];
    if (saved) {
      console.log('ðŸ“‚ Loading saved columns from localStorage:', saved);
      try {
        const parsed = JSON.parse(saved);
        console.log('âœ… Columns loaded:', parsed);
        return parsed;
      } catch (e) {
        console.error('âŒ Error parsing saved columns:', e);
        return defaultColumns;
      }
    }
    console.log('ðŸ“‹ Using default columns');
    return defaultColumns;
  });
  
  // Create a stable reference to setVisibleColumns
  const setVisibleColumnsRef = useRef(setVisibleColumns);
  useEffect(() => {
    setVisibleColumnsRef.current = setVisibleColumns;
  }, [setVisibleColumns]);
  
  // Stable wrapper function that always uses latest setter
  const updateVisibleColumns = useCallback((newColumns) => {
    console.log('%c ðŸ”„ updateVisibleColumns called ', 'background: #10b981; color: white; font-weight: bold; padding: 4px;');
    console.log('New columns:', newColumns);
    setVisibleColumnsRef.current(newColumns);
  }, []);
  
  // Header column drag & drop handlers
  const handleHeaderDragStart = (e, columnId) => {
    console.log('ðŸŽ¯ Header drag start:', columnId);
    setDraggedHeaderColumn(columnId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleHeaderDragOver = (e, targetColumnId) => {
    e.preventDefault();
    if (!draggedHeaderColumn || draggedHeaderColumn === targetColumnId) return;
    
    const draggedIdx = visibleColumns.indexOf(draggedHeaderColumn);
    const targetIdx = visibleColumns.indexOf(targetColumnId);
    
    // Check if locked
    const draggedCol = availableColumns.find(c => c.id === draggedHeaderColumn);
    const targetCol = availableColumns.find(c => c.id === targetColumnId);
    if (draggedCol?.locked || targetCol?.locked) return;
    
    const newColumns = [...visibleColumns];
    newColumns.splice(draggedIdx, 1);
    newColumns.splice(targetIdx, 0, draggedHeaderColumn);
    
    console.log('ðŸ”„ Reordering columns:', newColumns);
    updateVisibleColumns(newColumns);
  };

  const handleHeaderDragEnd = () => {
    console.log('ðŸ Header drag end');
    setDraggedHeaderColumn(null);
  };
  
  const [columnFilters, setColumnFilters] = useState({});
  const [draggedHeaderColumn, setDraggedHeaderColumn] = useState(null);
  const [showColumnConfig, setShowColumnConfig] = useState(false);
  const [showCreator, setShowCreator] = useState(false);
  const [modalKey, setModalKey] = useState(0); // Force re-mount
  const [showViewManager, setShowViewManager] = useState(false);
  const [savedViews, setSavedViews] = useState(() => {
    const saved = localStorage.getItem('scopeManager_views_' + activeProjectId);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return [];
  });
  const [editingCell, setEditingCell] = useState(null); // { scopeId, columnId, value }
  
  // Remove the useEffect that loads from localStorage (now done in useState)
  // This prevents double initialization
  
  // Merge default columns (filtering hidden) with custom columns
  const availableColumns = useMemo(() => {
    // Filter out hidden default columns
    const visibleDefaults = safeDefaultColumns.filter(col => !col.hidden);
    const merged = [...visibleDefaults, ...customColumns];
    console.log('ðŸ“Š Available columns (default + custom):', merged.length, 'total');
    console.log('   - Default (visible):', visibleDefaults.length);
    console.log('   - Custom:', customColumns.length);
    return merged;
  }, [customColumns, safeDefaultColumns]);
  
  // Track visibleColumns changes
  useEffect(() => {
    console.log('%c ðŸ“Š VISIBLE COLUMNS CHANGED ', 'background: #8b5cf6; color: white; font-weight: bold; padding: 4px;');
    console.log('New visibleColumns:', visibleColumns);
    console.log('Length:', visibleColumns.length);
    console.log('Items:', visibleColumns.join(', '));
  }, [visibleColumns]);
  
  // Save column config to localStorage
  useEffect(() => {
    if (activeProjectId && visibleColumns.length > 0) {
      console.log('ðŸ’¾ Saving columns:', visibleColumns);
      localStorage.setItem('scopeManager_columns_' + activeProjectId, JSON.stringify(visibleColumns));
      console.log('âœ… Columns saved to localStorage');
    }
  }, [visibleColumns, activeProjectId]);
  
  // Save views to localStorage
  useEffect(() => {
    if (activeProjectId) {
      localStorage.setItem('scopeManager_views_' + activeProjectId, JSON.stringify(savedViews));
    }
  }, [savedViews, activeProjectId]);

  // Helper: Get column filter value
  const getColumnFilter = (columnId, item) => {
    const filter = columnFilters[columnId];
    if (!filter) return true;
    
    const column = availableColumns.find(c => c.id === columnId);
    if (!column) return true;
    
    const filterLower = filter.toLowerCase();
    
    switch (columnId) {
      case 'tagNumber':
        return item.tagNumber?.toLowerCase().includes(filterLower);
      case 'description':
        return item.description?.toLowerCase().includes(filterLower);
      case 'workOrderNumber':
        return item.workOrderNumber?.toLowerCase().includes(filterLower);
      case 'priority':
        return item.priority?.toLowerCase().includes(filterLower);
      case 'status':
        return item.status?.toLowerCase().includes(filterLower);
      case 'workflow':
        const workflow = workflowStatuses.find(w => w.id === item.workflowStatusId);
        return workflow?.name?.toLowerCase().includes(filterLower);
      case 'planner':
        const planner = users.find(u => u.id === item.plannerId);
        return planner?.name?.toLowerCase().includes(filterLower);
      case 'discipline':
        return item.discipline?.toLowerCase().includes(filterLower);
      case 'area':
        return item.area?.toLowerCase().includes(filterLower);
      case 'system':
        return item.system?.toLowerCase().includes(filterLower);
      case 'notes':
        return item.notes?.toLowerCase().includes(filterLower);
      default:
        return true;
    }
  };

  // Helper: Save view
  const handleSaveView = (viewData) => {
    const newView = {
      id: 'view-' + Date.now(),
      name: viewData.name,
      type: viewData.type,
      columns: visibleColumns,
      filters: columnFilters,
      createdAt: new Date().toISOString()
    };
    setSavedViews([...savedViews, newView]);
    toast.success('Weergave opgeslagen', viewData.name);
  };

  // Helper: Load view
  const handleLoadView = (view) => {
    setVisibleColumns(view.columns);
    setColumnFilters(view.filters || {});
    toast.success('Weergave geladen', view.name);
  };

  // Helper: Delete view
  const handleDeleteView = (viewId) => {
    if (!window.confirm('Weet je zeker dat je deze weergave wilt verwijderen?')) return;
    setSavedViews(savedViews.filter(v => v.id !== viewId));
    toast.success('Weergave verwijderd');
  };

  // Helper: Handle cell edit
  const handleCellEdit = (scopeId, columnId, value) => {
    const updatedItems = scopeItems.map(item => {
      if (item.id === scopeId) {
        return { ...item, [columnId]: value };
      }
      return item;
    });
    setScopeItems(updatedItems);
    setEditingCell(null);
    toast.success('Bijgewerkt');
  };

  // Helper: Start cell edit
  const startCellEdit = (scopeId, columnId, currentValue) => {
    setEditingCell({ scopeId, columnId, value: currentValue || '' });
  };

  // Helper: Cancel cell edit
  const cancelCellEdit = () => {
    setEditingCell(null);
  };
  
  // Helper: Render cell content
  const renderCell = (columnId, item, workflow, planner) => {
    const column = availableColumns.find(c => c.id === columnId);
    if (!column) return null;
    
    const isEditing = editingCell?.scopeId === item.id && editingCell?.columnId === columnId;
    
    switch (columnId) {
      case 'expand':
        return (
          <td className="px-4 py-4">
            {(item.plannedActivities?.length || 0) > 0 && (
              <button
                onClick={() => toggleRowExpansion(item.id)}
                className="p-1 hover:bg-slate-200 rounded transition-colors"
              >
                {expandedRows[item.id] ? (
                  <ChevronDown className="w-4 h-4 text-slate-600" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-slate-600" />
                )}
              </button>
            )}
          </td>
        );
        
      case 'tagNumber':
        return (
          <td className="px-6 py-4" onDoubleClick={() => column.editable && startCellEdit(item.id, columnId, item.tagNumber)}>
            {isEditing ? (
              <input
                type="text"
                value={editingCell.value}
                onChange={(e) => setEditingCell({...editingCell, value: e.target.value})}
                onBlur={() => handleCellEdit(item.id, columnId, editingCell.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleCellEdit(item.id, columnId, editingCell.value);
                  if (e.key === 'Escape') cancelCellEdit();
                }}
                autoFocus
                className="w-full px-2 py-1 border-2 border-blue-500 rounded font-mono text-sm"
              />
            ) : (
              <span className="font-mono text-sm font-semibold text-blue-600">{item.tagNumber}</span>
            )}
          </td>
        );
        
      case 'description':
        return (
          <td className="px-6 py-4" onDoubleClick={() => column.editable && startCellEdit(item.id, columnId, item.description)}>
            {isEditing ? (
              <input
                type="text"
                value={editingCell.value}
                onChange={(e) => setEditingCell({...editingCell, value: e.target.value})}
                onBlur={() => handleCellEdit(item.id, columnId, editingCell.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleCellEdit(item.id, columnId, editingCell.value);
                  if (e.key === 'Escape') cancelCellEdit();
                }}
                autoFocus
                className="w-full px-2 py-1 border-2 border-blue-500 rounded text-sm"
              />
            ) : (
              <div>
                <span className="text-sm text-slate-700">{item.description}</span>
                {item.workOrderNumber && (
                  <span className="block text-xs text-slate-500 mt-1">WO: {item.workOrderNumber}</span>
                )}
              </div>
            )}
          </td>
        );
        
      case 'workOrderNumber':
        return (
          <td className="px-6 py-4" onDoubleClick={() => column.editable && startCellEdit(item.id, columnId, item.workOrderNumber)}>
            {isEditing ? (
              <input
                type="text"
                value={editingCell.value}
                onChange={(e) => setEditingCell({...editingCell, value: e.target.value})}
                onBlur={() => handleCellEdit(item.id, columnId, editingCell.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleCellEdit(item.id, columnId, editingCell.value);
                  if (e.key === 'Escape') cancelCellEdit();
                }}
                autoFocus
                className="w-full px-2 py-1 border-2 border-blue-500 rounded text-sm"
              />
            ) : (
              <span className="text-sm text-slate-600">{item.workOrderNumber || '-'}</span>
            )}
          </td>
        );
        
      case 'priority':
        return (
          <td className="px-6 py-4" onDoubleClick={() => column.editable && startCellEdit(item.id, columnId, item.priority)}>
            {isEditing ? (
              <select
                value={editingCell.value}
                onChange={(e) => {
                  setEditingCell({...editingCell, value: e.target.value});
                  handleCellEdit(item.id, columnId, e.target.value);
                }}
                onBlur={() => cancelCellEdit()}
                autoFocus
                className="w-full px-2 py-1 border-2 border-blue-500 rounded text-sm"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            ) : (
              <span className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${
                item.priority === 'High' ? 'bg-red-100 text-red-700' :
                item.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                'bg-green-100 text-green-700'
              }`}>
                {item.priority}
              </span>
            )}
          </td>
        );
        
      case 'status':
        return (
          <td className="px-6 py-4" onDoubleClick={() => column.editable && startCellEdit(item.id, columnId, item.status)}>
            {isEditing ? (
              <select
                value={editingCell.value}
                onChange={(e) => {
                  setEditingCell({...editingCell, value: e.target.value});
                  handleCellEdit(item.id, columnId, e.target.value);
                }}
                onBlur={() => cancelCellEdit()}
                autoFocus
                className="w-full px-2 py-1 border-2 border-blue-500 rounded text-sm"
              >
                <option value="In Scope">In Scope</option>
                <option value="Op Hold">Op Hold</option>
                <option value="Uit Scope">Uit Scope</option>
              </select>
            ) : (
              <span className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${
                item.status === 'In Scope' ? 'bg-green-100 text-green-700' :
                item.status === 'Op Hold' ? 'bg-orange-100 text-orange-700' :
                'bg-slate-100 text-slate-700'
              }`}>
                {item.status}
              </span>
            )}
          </td>
        );
        
      case 'workflow':
        return (
          <td className="px-6 py-4">
            {workflow && (
              <span 
                className="inline-flex px-3 py-1 rounded-full text-xs font-semibold text-white"
                style={{ backgroundColor: workflow.color }}
              >
                {workflow.name}
              </span>
            )}
          </td>
        );
        
      case 'planner':
        return (
          <td className="px-6 py-4">
            {planner && (
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-slate-400" />
                <span className="text-sm text-slate-700">{planner.name}</span>
              </div>
            )}
          </td>
        );
        
      case 'activities':
        return (
          <td className="px-6 py-4">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-slate-400" />
              <span className="text-sm text-slate-600">
                {item.plannedActivities?.length || 0}
              </span>
              {(!item.plannedActivities || item.plannedActivities.length === 0) && (
                <button
                  onClick={() => handleAddActivity(item.id)}
                  className="ml-2 text-xs text-blue-600 hover:text-blue-700"
                >
                  + Toevoegen
                </button>
              )}
            </div>
          </td>
        );
        
      case 'discipline':
        return (
          <td className="px-6 py-4" onDoubleClick={() => column.editable && startCellEdit(item.id, columnId, item.discipline)}>
            {isEditing ? (
              <select
                value={editingCell.value}
                onChange={(e) => {
                  setEditingCell({...editingCell, value: e.target.value});
                  handleCellEdit(item.id, columnId, e.target.value);
                }}
                onBlur={() => cancelCellEdit()}
                autoFocus
                className="w-full px-2 py-1 border-2 border-blue-500 rounded text-sm"
              >
                <option value="">-</option>
                <option value="Mechanical">Mechanical</option>
                <option value="Electrical">Electrical</option>
                <option value="Instrumentation">Instrumentation</option>
                <option value="Civil">Civil</option>
                <option value="Piping">Piping</option>
              </select>
            ) : (
              <span className="text-sm text-slate-700">{item.discipline || '-'}</span>
            )}
          </td>
        );
        
      case 'area':
      case 'system':
      case 'notes':
        return (
          <td className="px-6 py-4" onDoubleClick={() => column.editable && startCellEdit(item.id, columnId, item[columnId])}>
            {isEditing ? (
              <input
                type="text"
                value={editingCell.value}
                onChange={(e) => setEditingCell({...editingCell, value: e.target.value})}
                onBlur={() => handleCellEdit(item.id, columnId, editingCell.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleCellEdit(item.id, columnId, editingCell.value);
                  if (e.key === 'Escape') cancelCellEdit();
                }}
                autoFocus
                className="w-full px-2 py-1 border-2 border-blue-500 rounded text-sm"
              />
            ) : (
              <span className="text-sm text-slate-700">{item[columnId] || '-'}</span>
            )}
          </td>
        );
        
      case 'actions':
        return (
          <td className="px-6 py-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setQRScopeItem(item);
                  setShowQRModal(true);
                }}
                className="flex items-center gap-1 px-3 py-1.5 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors text-sm font-medium"
                title="Toon QR Code"
              >
                <QrCode className="w-4 h-4" />
                QR
              </button>
              <button
                onClick={() => handleOpenDetailView(item.id)}
                className="flex items-center gap-1 px-3 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
                title="Open werkpakket view"
              >
                <FileText className="w-4 h-4" />
                Werkpakket
              </button>
              {(item.plannedActivities?.length || 0) > 0 && (
                <button
                  onClick={() => handleOpenGanttChart(item)}
                  className="flex items-center gap-1 px-3 py-1.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-medium"
                  title="Gantt Chart"
                >
                  <Calendar className="w-4 h-4" />
                  Timeline
                </button>
              )}
            </div>
          </td>
        );
        
      default:
        // Handle custom columns with type-aware rendering
        const value = item[columnId];
        
        return (
          <td className="px-6 py-4" onDoubleClick={() => column.editable && startCellEdit(item.id, columnId, value)}>
            {isEditing ? (
              // Editing mode - type-specific inputs
              <>
                {column.type === 'text' && (
                  <input
                    type="text"
                    value={editingCell.value || ''}
                    onChange={(e) => setEditingCell({...editingCell, value: e.target.value})}
                    onBlur={() => handleCellEdit(item.id, columnId, editingCell.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleCellEdit(item.id, columnId, editingCell.value);
                      if (e.key === 'Escape') cancelCellEdit();
                    }}
                    autoFocus
                    className="w-full px-2 py-1 border-2 border-blue-500 rounded text-sm"
                  />
                )}
                
                {column.type === 'number' && (
                  <input
                    type="number"
                    value={editingCell.value || ''}
                    onChange={(e) => setEditingCell({...editingCell, value: e.target.value})}
                    onBlur={() => handleCellEdit(item.id, columnId, editingCell.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleCellEdit(item.id, columnId, editingCell.value);
                      if (e.key === 'Escape') cancelCellEdit();
                    }}
                    autoFocus
                    className="w-full px-2 py-1 border-2 border-blue-500 rounded text-sm"
                  />
                )}
                
                {column.type === 'select' && column.options && (
                  <select
                    value={editingCell.value || ''}
                    onChange={(e) => {
                      setEditingCell({...editingCell, value: e.target.value});
                      handleCellEdit(item.id, columnId, e.target.value);
                    }}
                    onBlur={() => cancelCellEdit()}
                    autoFocus
                    className="w-full px-2 py-1 border-2 border-blue-500 rounded text-sm"
                  >
                    <option value="">-</option>
                    {column.options.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                )}
                
                {column.type === 'date' && (
                  <input
                    type="date"
                    value={editingCell.value || ''}
                    onChange={(e) => setEditingCell({...editingCell, value: e.target.value})}
                    onBlur={() => handleCellEdit(item.id, columnId, editingCell.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleCellEdit(item.id, columnId, editingCell.value);
                      if (e.key === 'Escape') cancelCellEdit();
                    }}
                    autoFocus
                    className="w-full px-2 py-1 border-2 border-blue-500 rounded text-sm"
                  />
                )}
                
                {column.type === 'checkbox' && (
                  <input
                    type="checkbox"
                    checked={editingCell.value || false}
                    onChange={(e) => {
                      setEditingCell({...editingCell, value: e.target.checked});
                      handleCellEdit(item.id, columnId, e.target.checked);
                    }}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                )}
                
                {column.type === 'email' && (
                  <input
                    type="email"
                    value={editingCell.value || ''}
                    onChange={(e) => setEditingCell({...editingCell, value: e.target.value})}
                    onBlur={() => handleCellEdit(item.id, columnId, editingCell.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleCellEdit(item.id, columnId, editingCell.value);
                      if (e.key === 'Escape') cancelCellEdit();
                    }}
                    autoFocus
                    className="w-full px-2 py-1 border-2 border-blue-500 rounded text-sm"
                  />
                )}
                
                {column.type === 'url' && (
                  <input
                    type="url"
                    value={editingCell.value || ''}
                    onChange={(e) => setEditingCell({...editingCell, value: e.target.value})}
                    onBlur={() => handleCellEdit(item.id, columnId, editingCell.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleCellEdit(item.id, columnId, editingCell.value);
                      if (e.key === 'Escape') cancelCellEdit();
                    }}
                    autoFocus
                    className="w-full px-2 py-1 border-2 border-blue-500 rounded text-sm"
                  />
                )}
              </>
            ) : (
              // Display mode - type-specific rendering
              <>
                {(column.type === 'text' || column.type === 'number' || !column.type) && (
                  <span className="text-sm text-slate-700">{value || '-'}</span>
                )}
                
                {column.type === 'select' && (
                  <span className="inline-flex px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                    {value || '-'}
                  </span>
                )}
                
                {column.type === 'date' && (
                  <span className="text-sm text-slate-700">
                    {value ? new Date(value).toLocaleDateString('nl-NL') : '-'}
                  </span>
                )}
                
                {column.type === 'checkbox' && (
                  <span className="text-lg">
                    {value ? 'âœ“' : 'âœ—'}
                  </span>
                )}
                
                {column.type === 'email' && (
                  value ? (
                    <a href={`mailto:${value}`} className="text-sm text-blue-600 hover:underline">
                      {value}
                    </a>
                  ) : (
                    <span className="text-sm text-slate-400">-</span>
                  )
                )}
                
                {column.type === 'url' && (
                  value ? (
                    <a href={value} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline flex items-center gap-1">
                      Link <Link2 className="w-3 h-3" />
                    </a>
                  ) : (
                    <span className="text-sm text-slate-400">-</span>
                  )
                )}
                
                {column.type === 'statusMeetpoints' && (
                  <StatusOverviewCell statusMeetpoints={item.statusMeetpoints} />
                )}
              </>
            )}
          </td>
        );
    }
  };

  // Filter operator function
  const applyFilterOperator = (value, filterValue, operator) => {
    if (!filterValue || filterValue.trim() === '') return true;
    
    const val = String(value || '').toLowerCase();
    const filter = String(filterValue).toLowerCase();
    
    switch (operator) {
      case 'contains':
        return val.includes(filter);
      case 'notContains':
        return !val.includes(filter);
      case 'equals':
        return val === filter;
      case 'notEquals':
        return val !== filter;
      case 'startsWith':
        return val.startsWith(filter);
      case 'endsWith':
        return val.endsWith(filter);
      default:
        return val.includes(filter);
    }
  };

  const filteredItems = scopeItems.filter(item => {
    const matchesSearch = item.tagNumber.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || item.priority === filterPriority;
    
    // Check all column filters with operators
    const matchesColumnFilters = Object.keys(columnFilters).every(columnId => {
      const filterValue = columnFilters[columnId];
      if (!filterValue || filterValue.trim() === '') return true;
      
      const column = availableColumns.find(c => c.id === columnId);
      if (!column) return true;
      
      const operator = filterOperators[columnId] || 'contains';
      const itemValue = item[columnId];
      
      return applyFilterOperator(itemValue, filterValue, operator);
    });
    
    return matchesSearch && matchesStatus && matchesPriority && matchesColumnFilters;
  });

  // Sort filtered items
  const sortedItems = useMemo(() => {
    if (!sortColumn) return filteredItems;
    
    const sorted = [...filteredItems].sort((a, b) => {
      let aVal = a[sortColumn];
      let bVal = b[sortColumn];
      
      // Handle null/undefined
      if (aVal == null) aVal = '';
      if (bVal == null) bVal = '';
      
      // Convert to string for comparison
      aVal = String(aVal).toLowerCase();
      bVal = String(bVal).toLowerCase();
      
      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
    
    return sorted;
  }, [filteredItems, sortColumn, sortDirection]);

  // Handle column header click for sorting
  const handleColumnSort = (columnId) => {
    const column = availableColumns.find(c => c.id === columnId);
    
    // Don't sort special columns
    if (!column || column.id === 'expand' || column.id === 'actions' || column.id === 'activities') {
      return;
    }
    
    if (sortColumn === columnId) {
      // Toggle direction
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      // New column
      setSortColumn(columnId);
      setSortDirection('asc');
    }
  };

  const toggleRowExpansion = (scopeId) => {
    setExpandedRows(prev => ({
      ...prev,
      [scopeId]: !prev[scopeId]
    }));
  };

  const openDetailPanel = (scopeId) => {
    setSelectedScopeId(scopeId);
    setShowDetailPanel(true);
  };

  const handleEditActivity = (scopeId, activity) => {
    setEditingScopeId(scopeId);
    setEditingActivity(activity);
  };

  const handleAddActivity = (scopeId) => {
    setEditingScopeId(scopeId);
    setEditingActivity(null);
  };

  const handleSaveActivity = (activityData) => {
    const isNew = !editingActivity;
    
    const updatedScopeItems = scopeItems.map(item => {
      if (item.id === editingScopeId) {
        const activities = item.plannedActivities || [];
        
        if (editingActivity) {
          // Update existing activity
          return {
            ...item,
            plannedActivities: activities.map(a => 
              a.id === editingActivity.id ? activityData : a
            )
          };
        } else {
          // Add new activity
          return {
            ...item,
            plannedActivities: [...activities, activityData]
          };
        }
      }
      return item;
    });
    
    setScopeItems(updatedScopeItems);
    setEditingActivity(null);
    setEditingScopeId(null);
    
    // Toast notification
    toast.success(
      isNew ? 'Nieuwe activiteit toegevoegd' : 'Wijzigingen opgeslagen',
      isNew ? 'Activiteit aangemaakt' : 'Bijgewerkt'
    );
  };

  const handleDeleteActivity = () => {
    if (!editingActivity || !editingScopeId) return;
    
    // Show confirmation dialog
    setConfirmDialog({
      isOpen: true,
      title: 'Activiteit verwijderen?',
      message: `Weet je zeker dat je "${editingActivity.overrideDescription}" wilt verwijderen? Deze actie kan niet ongedaan worden gemaakt.`,
      danger: true,
      onConfirm: () => {
        const updatedScopeItems = scopeItems.map(item => {
          if (item.id === editingScopeId) {
            return {
              ...item,
              plannedActivities: item.plannedActivities.filter(a => a.id !== editingActivity.id)
            };
          }
          return item;
        });
        
        setScopeItems(updatedScopeItems);
        setEditingActivity(null);
        setEditingScopeId(null);
        
        toast.success('Activiteit verwijderd');
      }
    });
  };

  const handleOpenGanttChart = (scopeItem) => {
    setGanttScopeItem(scopeItem);
    setShowGanttChart(true);
  };

  const handleEditActivityFromGantt = (activity) => {
    const scopeId = ganttScopeItem.id;
    setEditingScopeId(scopeId);
    setEditingActivity(activity);
    setShowGanttChart(false);
  };

  const handleQuickAddFromTemplate = (scopeId) => {
    setQuickAddScopeId(scopeId);
    setShowTemplateQuickAdd(true);
  };

  const handleOpenDetailView = (scopeId) => {
    // Navigate to werkpakket page instead of modal
    if (window.handleNavigateToWerkpakket) {
      window.handleNavigateToWerkpakket(scopeId);
    }
  };

  const handleUpdateScopeItemFromDetailView = (updatedScopeItem) => {
    const updatedItems = scopeItems.map(item => 
      item.id === updatedScopeItem.id ? updatedScopeItem : item
    );
    setScopeItems(updatedItems);
    toast.success('Scope item bijgewerkt', updatedScopeItem.tagNumber);
  };

  const handleSaveNewItem = (newItem, isUpdate) => {
    if (isUpdate) {
      // Update existing
      const updatedItems = scopeItems.map(item => 
        item.id === newItem.id ? { ...item, ...newItem } : item
      );
      setScopeItems(updatedItems);
      toast.success('Scope item bijgewerkt', newItem.tagNumber);
    } else {
      // Create new
      const finalItem = {
        ...newItem,
        projectId: activeProjectId
      };
      setScopeItems([...scopeItems, finalItem]);
      toast.success('Nieuw scope item aangemaakt', newItem.tagNumber);
    }
  };

  const handleSelectTemplateForQuickAdd = (template) => {
    // Create activity from template
    const newActivity = {
      id: `pa-${Date.now()}`,
      templateId: template.id,
      activityId: `A${String(Date.now()).slice(-3)}`,
      overrideDescription: template.description,
      wbsId: '0',
      wbsCode: '',
      duration: 1,
      phase: template.defaultPhase || 'TA',
      resources: template.resources?.map((tr) => ({
        resourceId: tr.resourceId,
        units: tr.quantity || 8,
        unitsPerTime: 8,
        allocatedSupplierId: ''
      })) || [],
      materials: template.materials?.map((tm, idx) => ({
        id: `mat-assign-${Date.now()}-${idx}`,
        materialId: tm.materialId,
        quantity: tm.quantity || 1
      })) || [],
      risks: [],
      holdPoint: false,
      relationships: [],
      activityCodes: {},
      udfValues: {},
      executionStatus: 'Planned',
      progress: 0
    };

    const updatedScopeItems = scopeItems.map(item => {
      if (item.id === quickAddScopeId) {
        return {
          ...item,
          plannedActivities: [...(item.plannedActivities || []), newActivity]
        };
      }
      return item;
    });

    setScopeItems(updatedScopeItems);
    setShowTemplateQuickAdd(false);
    setQuickAddScopeId(null);
    
    // Toast notification
    const scopeItem = scopeItems.find(s => s.id === quickAddScopeId);
    toast.success(
      `Activity toegevoegd vanuit template "${template.code}"`,
      scopeItem ? `Toegevoegd aan ${scopeItem.tagNumber}` : 'Activiteit aangemaakt'
    );
  };

  // Bulk Operations Handlers
  const handleToggleActivitySelection = (scopeId, activityId) => {
    setSelectedActivities(prev => {
      const scopeSelections = prev[scopeId] || [];
      const isSelected = scopeSelections.includes(activityId);
      
      if (isSelected) {
        const newSelections = scopeSelections.filter(id => id !== activityId);
        if (newSelections.length === 0) {
          const { [scopeId]: _, ...rest } = prev;
          return rest;
        }
        return { ...prev, [scopeId]: newSelections };
      } else {
        return { ...prev, [scopeId]: [...scopeSelections, activityId] };
      }
    });
  };

  const handleSelectAllActivities = (scopeId, activities) => {
    const allActivityIds = activities.map(a => a.id);
    const currentSelections = selectedActivities[scopeId] || [];
    const allSelected = allActivityIds.every(id => currentSelections.includes(id));
    
    if (allSelected) {
      // Deselect all
      const { [scopeId]: _, ...rest } = selectedActivities;
      setSelectedActivities(rest);
    } else {
      // Select all
      setSelectedActivities({ ...selectedActivities, [scopeId]: allActivityIds });
    }
  };

  const handleCopySelectedActivities = (scopeId) => {
    const scope = scopeItems.find(s => s.id === scopeId);
    if (!scope) return;
    
    const selectedIds = selectedActivities[scopeId] || [];
    const activitiesToCopy = scope.plannedActivities.filter(a => selectedIds.includes(a.id));
    
    setCopiedActivities(activitiesToCopy);
    
    // Clear selection after copy
    const { [scopeId]: _, ...rest } = selectedActivities;
    setSelectedActivities(rest);
    
    // Toast notification
    toast.success(`${activitiesToCopy.length} activiteiten gekopieerd naar clipboard`, 'Gekopieerd');
  };

  const handlePasteActivities = (targetScopeId) => {
    if (copiedActivities.length === 0) return;
    
    const targetScope = scopeItems.find(s => s.id === targetScopeId);
    if (!targetScope) return;
    
    const updatedScopeItems = scopeItems.map(item => {
      if (item.id === targetScopeId) {
        const newActivities = copiedActivities.map(activity => ({
          ...activity,
          id: `pa-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          relationships: [] // Clear relationships when pasting
        }));
        
        return {
          ...item,
          plannedActivities: [...(item.plannedActivities || []), ...newActivities]
        };
      }
      return item;
    });
    
    setScopeItems(updatedScopeItems);
    
    // Toast notification
    toast.success(
      `${copiedActivities.length} activiteiten toegevoegd aan ${targetScope.tagNumber}`,
      'Geplakt'
    );
  };

  const handleBulkDelete = (scopeId) => {
    const selectedIds = selectedActivities[scopeId] || [];
    if (selectedIds.length === 0) return;
    
    // Show confirmation dialog
    setConfirmDialog({
      isOpen: true,
      title: 'Activiteiten verwijderen?',
      message: `Je staat op het punt om ${selectedIds.length} activiteiten permanent te verwijderen. Deze actie kan niet ongedaan worden gemaakt.`,
      danger: true,
      confirmText: `Verwijder ${selectedIds.length} activiteiten`,
      onConfirm: () => {
        const updatedScopeItems = scopeItems.map(item => {
          if (item.id === scopeId) {
            return {
              ...item,
              plannedActivities: item.plannedActivities.filter(a => !selectedIds.includes(a.id))
            };
          }
          return item;
        });
        
        setScopeItems(updatedScopeItems);
        
        // Clear selection
        const { [scopeId]: _, ...rest } = selectedActivities;
        setSelectedActivities(rest);
        
        // Toast notification
        toast.success(`${selectedIds.length} activiteiten verwijderd`);
      }
    });
  };

  const handleBulkEdit = (scopeId, transformFn) => {
    const selectedIds = selectedActivities[scopeId] || [];
    if (selectedIds.length === 0) return;
    
    const updatedScopeItems = scopeItems.map(item => {
      if (item.id === scopeId) {
        return {
          ...item,
          plannedActivities: item.plannedActivities.map(activity => {
            if (selectedIds.includes(activity.id)) {
              return transformFn(activity);
            }
            return activity;
          })
        };
      }
      return item;
    });
    
    setScopeItems(updatedScopeItems);
    setShowBulkEditModal(false);
    
    // Clear selection
    const { [scopeId]: _, ...rest } = selectedActivities;
    setSelectedActivities(rest);
    
    // Toast notification
    toast.success(`${selectedIds.length} activiteiten bijgewerkt`, 'Bulk edit voltooid');
  };

  const getSelectedCount = (scopeId) => {
    return (selectedActivities[scopeId] || []).length;
  };

  const selectedScope = scopeItems.find(s => s.id === selectedScopeId);
  const editingScope = scopeItems.find(s => s.id === editingScopeId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Scope Manager</h2>
          <p className="text-slate-600">Beheer alle scope items en activiteiten</p>
        </div>
        <button
          onClick={() => setShowCreator(true)}
          className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Nieuw Scope Item
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-slate-600" />
            <h3 className="font-semibold text-slate-900">Filters & Weergave</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                console.log('ðŸ”§ Opening column configurator');
                console.log('Current visibleColumns:', visibleColumns);
                setModalKey(k => k + 1); // Force fresh mount
                setShowColumnConfig(true);
              }}
              className="flex items-center gap-2 px-3 py-2 text-sm bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
            >
              <Settings className="w-4 h-4" />
              Kolommen ({visibleColumns.length})
            </button>
            <button
              onClick={() => {
                console.log('ðŸ› DEBUG INFO:');
                console.log('visibleColumns:', visibleColumns);
                console.log('availableColumns:', availableColumns);
                console.log('localStorage key:', 'scopeManager_columns_' + activeProjectId);
                console.log('localStorage value:', localStorage.getItem('scopeManager_columns_' + activeProjectId));
                alert('Check console (F12) voor debug info');
              }}
              className="px-2 py-2 text-xs bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200"
              title="Debug: Toon kolom info in console"
            >
              ðŸ›
            </button>
            <button
              onClick={() => setShowViewManager(true)}
              className="flex items-center gap-2 px-3 py-2 text-sm bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors"
            >
              <Layers className="w-4 h-4" />
              Weergaven ({savedViews.length})
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Zoek tag number of beschrijving..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Alle Statussen</option>
            <option value="In Scope">In Scope</option>
            <option value="Op Hold">Op Hold</option>
            <option value="Uit Scope">Uit Scope</option>
          </select>
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Alle Prioriteiten</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
      </div>

      {/* Scope Items Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Debug Info */}
        <div className="bg-blue-50 border-b border-blue-200 px-4 py-2 text-xs text-blue-700">
          <strong>Actieve kolommen ({visibleColumns.length}):</strong> {visibleColumns.map(id => availableColumns.find(c => c.id === id)?.label || id).join(', ')}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full" key={visibleColumns.join(',')}>
            <thead className="bg-slate-50">
              <tr className="border-b border-slate-200">
                {visibleColumns.map(columnId => {
                  const column = availableColumns.find(c => c.id === columnId);
                  if (!column) return null;
                  
                  const isDragging = draggedHeaderColumn === columnId;
                  const isDraggable = !column.locked;
                  const isSortable = column.id !== 'expand' && column.id !== 'actions' && column.id !== 'activities';
                  const isSorted = sortColumn === columnId;
                  
                  return (
                    <th 
                      key={columnId} 
                      draggable={isDraggable}
                      onDragStart={(e) => isDraggable && handleHeaderDragStart(e, columnId)}
                      onDragOver={(e) => isDraggable && handleHeaderDragOver(e, columnId)}
                      onDragEnd={handleHeaderDragEnd}
                      onClick={() => isSortable && handleColumnSort(columnId)}
                      className={'px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase transition-all ' + column.width + 
                        (isDraggable ? ' cursor-move hover:bg-slate-100' : '') +
                        (isDragging ? ' opacity-50 bg-blue-100' : '') +
                        (isSortable ? ' cursor-pointer select-none' : '')}
                    >
                      <div className="flex items-center gap-2">
                        {isDraggable && (
                          <svg className="w-3 h-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                          </svg>
                        )}
                        {column.label}
                        {isSortable && (
                          <span className="ml-1">
                            {isSorted ? (
                              sortDirection === 'asc' ? (
                                <span className="text-blue-600">â–²</span>
                              ) : (
                                <span className="text-blue-600">â–¼</span>
                              )
                            ) : (
                              <span className="text-slate-300">â¬</span>
                            )}
                          </span>
                        )}
                      </div>
                    </th>
                  );
                })}
              </tr>
              {/* Filter Row */}
              <tr className="border-b border-slate-300 bg-slate-100">
                {visibleColumns.map(columnId => {
                  const column = availableColumns.find(c => c.id === columnId);
                  if (!column) return null;
                  
                  if (column.id === 'expand' || column.id === 'actions') {
                    return <th key={columnId} className="px-4 py-2"></th>;
                  }
                  
                  const filterOperator = filterOperators[columnId] || 'contains';
                  
                  return (
                    <th key={columnId} className="px-2 py-2">
                      <div className="flex flex-col gap-1">
                        {/* Operator Dropdown */}
                        <select
                          value={filterOperator}
                          onChange={(e) => setFilterOperators({...filterOperators, [columnId]: e.target.value})}
                          className="w-full px-1 py-0.5 text-[10px] border border-slate-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <option value="contains">Bevat</option>
                          <option value="notContains">Bevat niet</option>
                          <option value="equals">Gelijk aan</option>
                          <option value="notEquals">Niet gelijk aan</option>
                          <option value="startsWith">Begint met</option>
                          <option value="endsWith">Eindigt met</option>
                        </select>
                        {/* Filter Input */}
                        <input
                          type="text"
                          value={columnFilters[columnId] || ''}
                          onChange={(e) => setColumnFilters({...columnFilters, [columnId]: e.target.value})}
                          placeholder="Filter..."
                          className="w-full px-2 py-1 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {sortedItems.map(item => {
                const workflow = workflowStatuses.find(ws => ws.id === item.workflowStatusId);
                const planner = users.find(u => u.id === item.plannerId);
                const isExpanded = expandedRows[item.id];
                const activitiesWithDates = calculateActivityDates(item.plannedActivities || [], projectStartDate);

                return (
                  <React.Fragment key={item.id}>
                    {/* Main Row - Dynamic Columns */}
                    <tr className="hover:bg-slate-50 transition-colors">
                      {visibleColumns.map(columnId => renderCell(columnId, item, workflow, planner))}
                    </tr>

                    {/* Expanded Activities */}
                    {isExpanded && (item.plannedActivities?.length || 0) > 0 && (
                      <tr>
                        <td colSpan="9" className="bg-slate-50 px-4 py-4">
                          <div className="ml-8">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-4">
                                <h4 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                  <Layers className="w-4 h-4" />
                                  Geplande Activiteiten ({item.plannedActivities.length})
                                </h4>
                                {item.plannedActivities.length > 0 && (
                                  <button
                                    onClick={() => handleSelectAllActivities(item.id, item.plannedActivities)}
                                    className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                                  >
                                    {getSelectedCount(item.id) === item.plannedActivities.length ? 'Deselecteer alles' : 'Selecteer alles'}
                                  </button>
                                )}
                              </div>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleQuickAddFromTemplate(item.id)}
                                  className="flex items-center gap-1 px-3 py-1.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
                                >
                                  <FileText className="w-4 h-4" />
                                  Vanuit Template
                                </button>
                                <button
                                  onClick={() => handleAddActivity(item.id)}
                                  className="flex items-center gap-1 px-3 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
                                >
                                  <Plus className="w-4 h-4" />
                                  Custom Activity
                                </button>
                              </div>
                            </div>

                            {/* Bulk Action Toolbar */}
                            {getSelectedCount(item.id) > 0 && (
                              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-3">
                                    <span className="text-sm font-semibold text-blue-900">
                                      {getSelectedCount(item.id)} activiteiten geselecteerd
                                    </span>
                                    <button
                                      onClick={() => {
                                        const { [item.id]: _, ...rest } = selectedActivities;
                                        setSelectedActivities(rest);
                                      }}
                                      className="text-xs text-blue-600 hover:text-blue-700"
                                    >
                                      Wis selectie
                                    </button>
                                  </div>
                                  <div className="flex gap-2">
                                    <button
                                      onClick={() => handleCopySelectedActivities(item.id)}
                                      className="flex items-center gap-1 px-3 py-1.5 bg-white border border-blue-300 text-blue-700 rounded-lg hover:bg-blue-50 transition-colors text-sm"
                                    >
                                      <FileText className="w-4 h-4" />
                                      KopiÃ«ren ({getSelectedCount(item.id)})
                                    </button>
                                    <button
                                      onClick={() => {
                                        setEditingScopeId(item.id);
                                        setShowBulkEditModal(true);
                                      }}
                                      className="flex items-center gap-1 px-3 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
                                    >
                                      <Edit2 className="w-4 h-4" />
                                      Bulk Edit
                                    </button>
                                    <button
                                      onClick={() => handleBulkDelete(item.id)}
                                      className="flex items-center gap-1 px-3 py-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                      Verwijderen
                                    </button>
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Paste Button */}
                            {copiedActivities.length > 0 && (
                              <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-3">
                                <div className="flex items-center justify-between">
                                  <span className="text-sm text-green-800">
                                    ðŸ“‹ {copiedActivities.length} activiteiten gekopieerd
                                  </span>
                                  <button
                                    onClick={() => handlePasteActivities(item.id)}
                                    className="flex items-center gap-1 px-3 py-1.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
                                  >
                                    <Plus className="w-4 h-4" />
                                    Plakken in {item.tagNumber}
                                  </button>
                                </div>
                              </div>
                            )}

                            <div className="space-y-2">
                              {item.plannedActivities.map(activity => {
                                const activityWithDate = activitiesWithDates.find(a => a.id === activity.id);
                                const resource = resources.find(r => r.id === activity.resources[0]?.resourceId);
                                const supplier = suppliers.find(s => s.id === activity.resources[0]?.allocatedSupplierId);
                                const hasRelationships = activity.relationships && activity.relationships.length > 0;
                                const isSelected = (selectedActivities[item.id] || []).includes(activity.id);

                                return (
                                  <div 
                                    key={activity.id} 
                                    className={`bg-white border rounded-lg p-4 hover:border-blue-300 transition-colors group ${
                                      isSelected ? 'border-blue-500 bg-blue-50' : 'border-slate-200'
                                    }`}
                                  >
                                    <div className="grid grid-cols-12 gap-4 items-start">
                                      {/* Checkbox */}
                                      <div className="col-span-1 flex items-center justify-center">
                                        <input
                                          type="checkbox"
                                          checked={isSelected}
                                          onChange={() => handleToggleActivitySelection(item.id, activity.id)}
                                          className="w-4 h-4 text-blue-500 rounded focus:ring-2 focus:ring-blue-500"
                                        />
                                      </div>

                                      {/* Activity ID & Description */}
                                      <div className="col-span-3">
                                        <div className="flex items-center gap-2 mb-1">
                                          <span className="font-mono text-xs font-semibold text-slate-500">
                                            {activity.activityId}
                                          </span>
                                          {activity.holdPoint && (
                                            <span className="bg-red-100 text-red-700 text-xs px-2 py-0.5 rounded-full font-semibold">
                                              HOLD
                                            </span>
                                          )}
                                        </div>
                                        <p className="text-sm text-slate-900 font-medium">{activity.overrideDescription}</p>
                                        {activity.wbsCode && (
                                          <p className="text-xs text-slate-500 mt-1">WBS: {activity.wbsCode}</p>
                                        )}
                                      </div>

                                      {/* Phase */}
                                      <div className="col-span-2">
                                        <span className={`inline-flex px-2 py-1 rounded text-xs font-semibold ${
                                          activity.phase === 'PRE-TA' ? 'bg-blue-100 text-blue-700' :
                                          activity.phase === 'UITBEDRIJF' ? 'bg-purple-100 text-purple-700' :
                                          activity.phase === 'TA' ? 'bg-green-100 text-green-700' :
                                          activity.phase === 'INBEDRIJF' ? 'bg-yellow-100 text-yellow-700' :
                                          'bg-slate-100 text-slate-700'
                                        }`}>
                                          {activity.phase}
                                        </span>
                                      </div>

                                      {/* Duration & Dates */}
                                      <div className="col-span-3">
                                        <div className="text-xs text-slate-600">
                                          <div className="flex items-center gap-2 mb-1">
                                            <Clock className="w-3 h-3" />
                                            <span>{activity.duration} dagen</span>
                                          </div>
                                          {activityWithDate && (
                                            <>
                                              <div className="text-xs text-slate-500">
                                                Start: {activityWithDate.calculatedStart.toLocaleDateString('nl-NL', { day: '2-digit', month: 'short' })}
                                              </div>
                                              <div className="text-xs text-slate-500">
                                                Eind: {activityWithDate.calculatedEnd.toLocaleDateString('nl-NL', { day: '2-digit', month: 'short' })}
                                              </div>
                                            </>
                                          )}
                                        </div>
                                      </div>

                                      {/* Resources */}
                                      <div className="col-span-2">
                                        {activity.resources.length > 0 ? (
                                          <div className="text-xs">
                                            <div className="font-medium text-slate-700 mb-1">Resources:</div>
                                            {resource && (
                                              <div className="text-slate-600">
                                                {activity.resources[0].units}h - {resource.name}
                                              </div>
                                            )}
                                            {supplier && (
                                              <div className="text-slate-500">{supplier.name}</div>
                                            )}
                                          </div>
                                        ) : (
                                          <span className="text-xs text-slate-400">Geen resources</span>
                                        )}
                                      </div>

                                      {/* Actions */}
                                      <div className="col-span-1 flex justify-end gap-2">
                                        {hasRelationships && (
                                          <div className="relative group/tooltip">
                                            <Link2 className="w-4 h-4 text-blue-500" />
                                            <div className="absolute right-0 top-6 bg-slate-900 text-white text-xs rounded px-2 py-1 opacity-0 group-hover/tooltip:opacity-100 transition-opacity whitespace-nowrap z-10">
                                              {activity.relationships.length} dependencies
                                            </div>
                                          </div>
                                        )}
                                        <button
                                          onClick={() => handleEditActivity(item.id, activity)}
                                          className="opacity-0 group-hover:opacity-100 p-1 text-blue-600 hover:bg-blue-50 rounded transition-all"
                                          title="Bewerken"
                                        >
                                          <Edit2 className="w-4 h-4" />
                                        </button>
                                      </div>
                                    </div>

                                    {/* Materials */}
                                    {activity.materials && activity.materials.length > 0 && (
                                      <div className="mt-3 pt-3 border-t border-slate-200">
                                        <div className="flex items-center gap-2 text-xs">
                                          <Box className="w-3 h-3 text-slate-400" />
                                          <span className="font-medium text-slate-600">Materials:</span>
                                          {activity.materials.map(mat => {
                                            const material = materials.find(m => m.id === mat.materialId);
                                            return material ? (
                                              <span key={mat.id} className="text-slate-600">
                                                {mat.quantity}x {material.description}
                                              </span>
                                            ) : null;
                                          })}
                                        </div>
                                      </div>
                                    )}

                                    {/* Risks */}
                                    {activity.risks && activity.risks.length > 0 && (
                                      <div className="mt-2">
                                        <div className="flex items-start gap-2 text-xs">
                                          <AlertTriangle className="w-3 h-3 text-orange-500 mt-0.5" />
                                          <div>
                                            {activity.risks.map(risk => (
                                              <div key={risk.id} className="text-slate-600">
                                                <span className="font-medium">{risk.hazard}:</span> {risk.measure}
                                              </div>
                                            ))}
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-12 text-slate-500">
            <Package className="w-12 h-12 mx-auto mb-3 text-slate-400" />
            <p>Geen scope items gevonden</p>
          </div>
        )}
      </div>

      {/* Summary */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-slate-700">
          <strong>Totaal:</strong> {filteredItems.length} van {scopeItems.length} items weergegeven
        </p>
      </div>

      {/* Detail Panel */}
      {showDetailPanel && selectedScope && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-8">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Panel Header */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-2xl font-bold mb-2">{selectedScope.tagNumber}</h3>
                  <p className="text-blue-100">{selectedScope.description}</p>
                </div>
                <button
                  onClick={() => setShowDetailPanel(false)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Panel Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold text-slate-700">Work Order</label>
                    <p className="text-slate-900">{selectedScope.workOrderNumber || '-'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-slate-700">Notification</label>
                    <p className="text-slate-900">{selectedScope.notificationNumber || '-'}</p>
                  </div>
                </div>

                {/* Activities Summary */}
                <div>
                  <h4 className="text-lg font-bold text-slate-900 mb-3">Activiteiten Overzicht</h4>
                  <div className="bg-slate-50 rounded-lg p-4">
                    <p className="text-slate-700">
                      <strong>{selectedScope.plannedActivities?.length || 0}</strong> activiteiten gepland
                    </p>
                  </div>
                </div>

                {/* Close Button */}
                <div className="flex justify-end pt-4 border-t">
                  <button
                    onClick={() => setShowDetailPanel(false)}
                    className="px-6 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors"
                  >
                    Sluiten
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Activity Editor Modal */}
      {editingScopeId && editingScope && (
        <ActivityEditorModal
          activity={editingActivity}
          scopeItem={editingScope}
          onSave={handleSaveActivity}
          onClose={() => {
            setEditingActivity(null);
            setEditingScopeId(null);
          }}
          onDelete={editingActivity ? handleDeleteActivity : null}
          resources={resources}
          materials={materials}
          suppliers={suppliers}
          templates={templates}
          allActivitiesInScope={editingScope.plannedActivities || []}
        />
      )}

      {/* Gantt Chart Modal */}
      {showGanttChart && ganttScopeItem && (
        <GanttChartModal
          scopeItem={ganttScopeItem}
          onClose={() => {
            setShowGanttChart(false);
            setGanttScopeItem(null);
          }}
          onEditActivity={handleEditActivityFromGantt}
          projectStartDate={projectStartDate}
          resources={resources}
          suppliers={suppliers}
        />
      )}

      {/* Scope Item Detail View (Werkpakket) */}
      {detailViewScopeId && scopeItems.find(s => s.id === detailViewScopeId) && (
        <ScopeItemDetailView
          scopeItem={scopeItems.find(s => s.id === detailViewScopeId)}
          onClose={() => setDetailViewScopeId(null)}
          onUpdate={handleUpdateScopeItemFromDetailView}
          resources={resources}
          suppliers={suppliers}
          projectStartDate={projectStartDate}
          templates={templates}
        />
      )}

      {/* Template Quick Add Modal */}
      {showTemplateQuickAdd && quickAddScopeId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
            <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-2xl font-bold mb-2">Selecteer Template</h3>
                  <p className="text-green-100">Kies een template om snel een activity toe te voegen</p>
                </div>
                <button
                  onClick={() => {
                    setShowTemplateQuickAdd(false);
                    setQuickAddScopeId(null);
                  }}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid gap-3">
                {templates.map(template => (
                  <button
                    key={template.id}
                    onClick={() => handleSelectTemplateForQuickAdd(template)}
                    className="text-left bg-slate-50 border border-slate-200 rounded-lg p-4 hover:border-green-300 hover:bg-green-50 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-sm font-semibold text-blue-600">{template.code}</span>
                        <span className="text-xs px-2 py-1 bg-slate-200 text-slate-700 rounded-full">{template.category}</span>
                        {template.defaultPhase && (
                          <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">{template.defaultPhase}</span>
                        )}
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-400" />
                    </div>
                    <p className="text-sm text-slate-900 font-medium mb-2">{template.description}</p>
                    <div className="flex items-center gap-4 text-xs text-slate-600">
                      <span>{template.resources?.length || 0} resources</span>
                      <span>{template.materials?.length || 0} materials</span>
                      {!template.isAdjustable && (
                        <span className="text-orange-600 font-semibold">Fixed template</span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t p-4 bg-slate-50">
              <p className="text-sm text-slate-600 text-center">
                <strong>Tip:</strong> Selecteer een template om deze direct als activity toe te voegen. Je kunt deze daarna nog bewerken.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Edit Modal */}
      {showBulkEditModal && editingScopeId && (
        <BulkEditModal
          scopeId={editingScopeId}
          selectedCount={getSelectedCount(editingScopeId)}
          onSave={(updates) => handleBulkEdit(editingScopeId, updates)}
          onClose={() => setShowBulkEditModal(false)}
          resources={resources}
          suppliers={suppliers}
        />
      )}

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog({ isOpen: false })}
        onConfirm={confirmDialog.onConfirm || (() => {})}
        title={confirmDialog.title}
        message={confirmDialog.message}
        confirmText={confirmDialog.confirmText}
        cancelText={confirmDialog.cancelText}
        danger={confirmDialog.danger}
      />
      
      {/* QR Code Modal */}
      {showQRModal && qrScopeItem && (
        <QRCodeModal
          scope={qrScopeItem}
          onClose={() => {
            setShowQRModal(false);
            setQRScopeItem(null);
          }}
        />
      )}
      {/* Column Configurator Modal */}
      {showColumnConfig && (
        <ColumnConfigurator
          key={modalKey}
          visibleColumns={visibleColumns}
          availableColumns={availableColumns}
          onApply={(newColumns) => {
            console.log('%c ðŸŽ¯ APPLYING NEW COLUMNS ', 'background: #3b82f6; color: white; font-size: 14px; padding: 4px;');
            console.log('New columns from modal:', newColumns);
            
            // Validate newColumns
            if (!Array.isArray(newColumns) || newColumns.length === 0) {
              console.error('âŒ Invalid newColumns:', newColumns);
              alert('ERROR: Invalid columns received!');
              return;
            }
            
            console.log('âœ… Validation passed, calling updateVisibleColumns...');
            
            // Use stable wrapper function
            updateVisibleColumns(newColumns);
            
            console.log('ðŸ“¢ updateVisibleColumns called');
            
            // Save to localStorage
            localStorage.setItem('scopeManager_columns_' + activeProjectId, JSON.stringify(newColumns));
            console.log('âœ… Columns saved to localStorage');
            
            toast.success('Kolommen configuratie opgeslagen', `${newColumns.length} kolommen actief`);
          }}
          onClose={() => {
            console.log('ðŸšª Closing column configurator');
            setShowColumnConfig(false);
          }}
        />
      )}

      {showCreator && (
        <ScopeItemCreator
          onSave={handleSaveNewItem}
          onClose={() => setShowCreator(false)}
          existingScopeItems={scopeItems}
          availableColumns={availableColumns}
          customColumns={customColumns}
        />
      )}
      
      {/* View Manager Modal */}
      {showViewManager && (
        <ViewManager
          currentView={{ columns: visibleColumns, filters: columnFilters }}
          views={savedViews}
          onSaveView={handleSaveView}
          onLoadView={handleLoadView}
          onDeleteView={handleDeleteView}
          onClose={() => setShowViewManager(false)}
        />
      )}
    </div>
  );
};

// ===== BULK EDIT MODAL =====
const BulkEditModal = ({ scopeId, selectedCount, onSave, onClose, resources, suppliers }) => {
  const [updates, setUpdates] = useState({
    updatePhase: false,
    phase: 'TA',
    updateSupplier: false,
    supplierId: '',
    updateDuration: false,
    durationMultiplier: 1.0,
  });

  const phases = ['PRE-TA', 'UITBEDRIJF', 'TA', 'INBEDRIJF', 'POST-TA'];

  const handleApply = () => {
    const activityUpdates = {};
    
    if (updates.updatePhase) {
      activityUpdates.phase = updates.phase;
    }
    
    if (updates.updateSupplier) {
      // This will update the supplier for all resources in selected activities
      activityUpdates.resources = (existingResources) => 
        existingResources.map(r => ({ ...r, allocatedSupplierId: updates.supplierId }));
    }
    
    if (updates.updateDuration && updates.durationMultiplier !== 1.0) {
      activityUpdates.duration = (existingDuration) => 
        Math.max(1, Math.round(existingDuration * updates.durationMultiplier));
    }
    
    // Special handling for resources and duration
    onSave((activity) => {
      const updatedActivity = { ...activity };
      
      if (updates.updatePhase) {
        updatedActivity.phase = updates.phase;
      }
      
      if (updates.updateSupplier && activity.resources) {
        updatedActivity.resources = activity.resources.map(r => ({ 
          ...r, 
          allocatedSupplierId: updates.supplierId 
        }));
      }
      
      if (updates.updateDuration && updates.durationMultiplier !== 1.0) {
        updatedActivity.duration = Math.max(1, Math.round(activity.duration * updates.durationMultiplier));
      }
      
      return updatedActivity;
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-2xl font-bold mb-2">Bulk Edit</h3>
              <p className="text-blue-100">{selectedCount} activiteiten wijzigen</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Phase Update */}
          <div className="flex items-start gap-4">
            <input
              type="checkbox"
              checked={updates.updatePhase}
              onChange={(e) => setUpdates({ ...updates, updatePhase: e.target.checked })}
              className="mt-2 w-5 h-5 text-blue-500 rounded"
            />
            <div className="flex-1">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Phase wijzigen
              </label>
              <select
                value={updates.phase}
                onChange={(e) => setUpdates({ ...updates, phase: e.target.value })}
                disabled={!updates.updatePhase}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100"
              >
                {phases.map(phase => (
                  <option key={phase} value={phase}>{phase}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Supplier Update */}
          <div className="flex items-start gap-4">
            <input
              type="checkbox"
              checked={updates.updateSupplier}
              onChange={(e) => setUpdates({ ...updates, updateSupplier: e.target.checked })}
              className="mt-2 w-5 h-5 text-blue-500 rounded"
            />
            <div className="flex-1">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Supplier wijzigen (voor alle resources)
              </label>
              <select
                value={updates.supplierId}
                onChange={(e) => setUpdates({ ...updates, supplierId: e.target.value })}
                disabled={!updates.updateSupplier}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100"
              >
                <option value="">Selecteer supplier...</option>
                {suppliers.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Duration Multiplier */}
          <div className="flex items-start gap-4">
            <input
              type="checkbox"
              checked={updates.updateDuration}
              onChange={(e) => setUpdates({ ...updates, updateDuration: e.target.checked })}
              className="mt-2 w-5 h-5 text-blue-500 rounded"
            />
            <div className="flex-1">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Duration aanpassen (vermenigvuldiger)
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  max="10"
                  value={updates.durationMultiplier}
                  onChange={(e) => setUpdates({ ...updates, durationMultiplier: parseFloat(e.target.value) || 1.0 })}
                  disabled={!updates.updateDuration}
                  className="w-32 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100"
                />
                <span className="text-sm text-slate-600">
                  {updates.durationMultiplier === 1.0 ? 'Geen wijziging' :
                   updates.durationMultiplier > 1.0 ? `${((updates.durationMultiplier - 1) * 100).toFixed(0)}% langer` :
                   `${((1 - updates.durationMultiplier) * 100).toFixed(0)}% korter`}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-2">
                Bijvoorbeeld: 1.5 = 50% langer, 0.5 = 50% korter
              </p>
            </div>
          </div>

          {/* Warning */}
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <div className="flex gap-3">
              <AlertTriangle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-orange-900 mb-1">Let op</p>
                <p className="text-sm text-orange-800">
                  Deze wijzigingen worden toegepast op alle {selectedCount} geselecteerde activiteiten.
                  Deze actie kan niet ongedaan gemaakt worden.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t p-6 bg-slate-50">
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors"
            >
              Annuleren
            </button>
            <button
              onClick={handleApply}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Toepassen op {selectedCount} activiteiten
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ===== DASHBOARD COMPONENT (from previous version) =====
const Dashboard = ({ scopeItems, templates, resources, suppliers, workflowStatuses }) => {
  const [selectedPhase, setSelectedPhase] = useState('all');

  const stats = useMemo(() => {
    const items = scopeItems;
    const total = items.length;
    const inScope = items.filter(i => i.status === 'In Scope').length;
    const onHold = items.filter(i => i.status === 'Op Hold').length;
    const outOfScope = items.filter(i => i.status === 'Uit Scope').length;
    const highPriority = items.filter(i => i.priority === 'High').length;
    const totalActivities = items.reduce((s, i) => s + (i.plannedActivities?.length || 0), 0);
    
    // Activities by execution status
    const allActivities = items.flatMap(i => i.plannedActivities || []);
    const completed = allActivities.filter(a => a.executionStatus === 'Completed').length;
    const inProgress = allActivities.filter(a => a.executionStatus === 'In Progress').length;
    const planned = allActivities.filter(a => a.executionStatus === 'Planned').length;
    const overallProgress = totalActivities > 0 ? Math.round((completed / totalActivities) * 100) : 0;

    // Costs from Fase 2
    const totalCost = items.reduce((s, i) => {
      const rules = i.costRules || [];
      const subtotal = rules.reduce((ss, r) => ss + (r.totaal || 0), 0);
      const contingency = subtotal * ((i.contingency?.percentage || 0) / 100);
      return s + subtotal + contingency;
    }, 0);
    const itemsWithCost = items.filter(i => (i.costRules || []).length > 0).length;

    // Meetpoints completeness
    const meetpointKeys = ['werkbeschrijving', 'materialen', 'calculaties', 'tra', 'documenten', 'kosten'];
    const readyItems = items.filter(i => {
      if (!i.statusMeetpoints) return false;
      const mp = i.statusMeetpoints;
      return meetpointKeys.every(k => mp[k] === 'AKKOORD' || mp[k] === 'NIET_VAN_TOEPASSING');
    }).length;

    // Activities by phase
    const phaseData = {};
    ['PRE-TA', 'UITBEDRIJF', 'TA', 'INBEDRIJF', 'POST-TA'].forEach(phase => {
      const phaseActs = allActivities.filter(a => a.phase === phase);
      const phaseCompleted = phaseActs.filter(a => a.executionStatus === 'Completed').length;
      phaseData[phase] = {
        total: phaseActs.length,
        completed: phaseCompleted,
        inProgress: phaseActs.filter(a => a.executionStatus === 'In Progress').length,
        progress: phaseActs.length > 0 ? Math.round((phaseCompleted / phaseActs.length) * 100) : 0,
        duration: phaseActs.reduce((s, a) => s + (a.duration || 0), 0)
      };
    });

    return { total, inScope, onHold, outOfScope, highPriority, totalActivities, completed, inProgress, planned, overallProgress, totalCost, itemsWithCost, readyItems, phaseData, allActivities };
  }, [scopeItems]);

  const workflowDist = useMemo(() => {
    return workflowStatuses.map(ws => ({
      ...ws,
      count: scopeItems.filter(i => i.workflowStatusId === ws.id).length
    })).filter(ws => ws.count > 0);
  }, [scopeItems, workflowStatuses]);

  // Mini progress bar
  const ProgressBar = ({ value, max, color = 'bg-blue-500', height = 'h-2' }) => (
    <div className={`w-full bg-slate-100 rounded-full overflow-hidden ${height}`}>
      <div className={`${color} h-full rounded-full transition-all duration-500`} style={{ width: `${max > 0 ? Math.round((value/max)*100) : 0}%` }} />
    </div>
  );

  // Donut-like ring indicator
  const RingProgress = ({ value, color, size = 80 }) => {
    const r = 30;
    const circ = 2 * Math.PI * r;
    const offset = circ - (value / 100) * circ;
    return (
      <svg width={size} height={size} viewBox="0 0 80 80">
        <circle cx="40" cy="40" r={r} fill="none" stroke="#e2e8f0" strokeWidth="8" />
        <circle cx="40" cy="40" r={r} fill="none" stroke={color} strokeWidth="8"
          strokeDasharray={circ} strokeDashoffset={offset}
          strokeLinecap="round" transform="rotate(-90 40 40)" style={{ transition: 'stroke-dashoffset 0.6s ease' }} />
        <text x="40" y="45" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#1e293b">{value}%</text>
      </svg>
    );
  };

  const phases = ['PRE-TA', 'UITBEDRIJF', 'TA', 'INBEDRIJF', 'POST-TA'];
  const phaseColors = { 'PRE-TA': '#8b5cf6', 'UITBEDRIJF': '#f97316', 'TA': '#3b82f6', 'INBEDRIJF': '#22c55e', 'POST-TA': '#64748b' };
  const phaseBg = { 'PRE-TA': 'bg-purple-500', 'UITBEDRIJF': 'bg-orange-500', 'TA': 'bg-blue-500', 'INBEDRIJF': 'bg-green-500', 'POST-TA': 'bg-slate-500' };

  // Meetpoint labels
  const mpLabels = {
    werkbeschrijving: 'Werkbeschrijving', materialen: 'Materialen',
    calculaties: 'Calculaties', tra: 'T.R.A.', documenten: 'Documenten', kosten: 'Kosten'
  };
  const mpDist = useMemo(() => {
    const keys = Object.keys(mpLabels);
    return keys.map(key => {
      const akkoord = scopeItems.filter(i => i.statusMeetpoints?.[key] === 'AKKOORD').length;
      const nvt = scopeItems.filter(i => i.statusMeetpoints?.[key] === 'NIET_VAN_TOEPASSING').length;
      const geen = scopeItems.filter(i => !i.statusMeetpoints?.[key] || i.statusMeetpoints?.[key] === 'GEEN').length;
      return { key, label: mpLabels[key], akkoord, nvt, geen, total: scopeItems.length };
    });
  }, [scopeItems]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Dashboard</h2>
          <p className="text-slate-500 mt-1">Project status & voortgang overzicht</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-slate-400 uppercase font-semibold">Laatste update</p>
          <p className="text-sm font-medium text-slate-600">{new Date().toLocaleString('nl-NL')}</p>
        </div>
      </div>

      {/* Top KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Scope Items', value: stats.total, sub: `${stats.inScope} in scope`, icon: Package, color: 'bg-blue-500', text: 'text-blue-600' },
          { label: 'Activiteiten', value: stats.totalActivities, sub: `${stats.completed} afgerond`, icon: CheckCircle, color: 'bg-emerald-500', text: 'text-emerald-600' },
          { label: 'Totale Kosten', value: `€${(stats.totalCost/1000).toFixed(0)}k`, sub: `${stats.itemsWithCost} items geprijsd`, icon: DollarSign, color: 'bg-amber-500', text: 'text-amber-600' },
          { label: 'TA Gereed', value: `${stats.readyItems}/${stats.inScope}`, sub: 'Meetpoints akkoord', icon: CheckCircle, color: 'bg-purple-500', text: 'text-purple-600' },
        ].map(({ label, value, sub, icon: Icon, color, text }) => (
          <div key={label} className="bg-white rounded-xl p-5 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <p className="text-sm text-slate-500 font-medium">{label}</p>
              <div className={`${color} p-2 rounded-lg`}>
                <Icon className="w-4 h-4 text-white" />
              </div>
            </div>
            <p className={`text-3xl font-bold ${text} mb-1`}>{value}</p>
            <p className="text-xs text-slate-400">{sub}</p>
          </div>
        ))}
      </div>

      {/* Overall Progress + Phase Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Overall Progress Ring */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <h3 className="font-bold text-slate-900 mb-4">Totale Voortgang</h3>
          <div className="flex items-center gap-6">
            <RingProgress value={stats.overallProgress} color="#3b82f6" />
            <div className="space-y-2 flex-1">
              <div className="flex justify-between text-sm">
                <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-green-500 inline-block"></span>Afgerond</span>
                <span className="font-semibold">{stats.completed}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-blue-400 inline-block"></span>In uitvoering</span>
                <span className="font-semibold">{stats.inProgress}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-slate-300 inline-block"></span>Gepland</span>
                <span className="font-semibold">{stats.planned}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Phase Progress */}
        <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <h3 className="font-bold text-slate-900 mb-4">Voortgang per Fase</h3>
          <div className="space-y-3">
            {phases.map(phase => {
              const d = stats.phaseData[phase];
              return (
                <div key={phase} className="flex items-center gap-3">
                  <span className={`text-xs font-bold text-white px-2 py-0.5 rounded ${phaseBg[phase]} w-24 text-center shrink-0`}>{phase}</span>
                  <div className="flex-1">
                    <div className="w-full h-5 bg-slate-100 rounded-full overflow-hidden relative">
                      <div className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${d.progress}%`, backgroundColor: phaseColors[phase] }} />
                      {d.inProgress > 0 && (
                        <div className="absolute top-0 h-full bg-blue-200 rounded-r-full"
                          style={{ left: `${d.progress}%`, width: `${d.total > 0 ? Math.round((d.inProgress/d.total)*100) : 0}%` }} />
                      )}
                    </div>
                  </div>
                  <div className="text-right shrink-0 w-28 text-xs text-slate-500">
                    {d.completed}/{d.total} act · {d.duration}d
                  </div>
                  <span className="text-sm font-bold w-10 text-right" style={{ color: phaseColors[phase] }}>{d.progress}%</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Meetpoints Readiness + Workflow + Cost */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Meetpoints */}
        <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <h3 className="font-bold text-slate-900 mb-4">Meetpoints Gereedheid</h3>
          <div className="space-y-3">
            {mpDist.map(({ key, label, akkoord, nvt, geen, total }) => {
              const effectiveTotal = total - nvt;
              const pct = effectiveTotal > 0 ? Math.round((akkoord / effectiveTotal) * 100) : 100;
              return (
                <div key={key} className="flex items-center gap-3">
                  <span className="text-sm text-slate-600 w-36 shrink-0">{label}</span>
                  <div className="flex-1 h-5 bg-slate-100 rounded-full overflow-hidden relative">
                    <div className="h-full bg-emerald-500 rounded-full transition-all duration-700"
                      style={{ width: `${pct}%` }} />
                    {nvt > 0 && (
                      <div className="absolute top-0 right-0 h-full bg-slate-200 rounded-r-full"
                        style={{ width: `${Math.round((nvt/total)*100)}%` }} />
                    )}
                  </div>
                  <div className="flex gap-2 text-xs shrink-0">
                    <span className="text-emerald-600 font-semibold">{akkoord} ✓</span>
                    {nvt > 0 && <span className="text-slate-400">{nvt} n.v.t.</span>}
                    {geen > 0 && <span className="text-red-400">{geen} ×</span>}
                  </div>
                  <span className="text-sm font-bold w-10 text-right text-emerald-600">{pct}%</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Workflow + Priority */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200">
            <h3 className="font-bold text-slate-900 mb-3">Workflow Status</h3>
            <div className="space-y-2">
              {workflowDist.map(ws => (
                <div key={ws.id} className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: ws.color }} />
                  <span className="text-xs text-slate-600 flex-1 truncate">{ws.name}</span>
                  <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden mx-1">
                    <div className="h-full rounded-full" style={{ backgroundColor: ws.color, width: `${stats.inScope > 0 ? Math.round((ws.count/stats.total)*100) : 0}%` }} />
                  </div>
                  <span className="text-xs font-semibold text-slate-700 w-4 text-right">{ws.count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200">
            <h3 className="font-bold text-slate-900 mb-3">Scope Status</h3>
            {[
              { label: 'In Scope', count: stats.inScope, color: 'bg-green-500' },
              { label: 'Op Hold', count: stats.onHold, color: 'bg-orange-400' },
              { label: 'Uit Scope', count: stats.outOfScope, color: 'bg-slate-300' },
            ].map(({ label, count, color }) => (
              <div key={label} className="flex items-center gap-3 mb-2">
                <div className={`w-2 h-2 rounded-full ${color}`} />
                <span className="text-xs text-slate-600 flex-1">{label}</span>
                <div className="w-20 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className={`${color} h-full rounded-full`} style={{ width: `${stats.total > 0 ? Math.round((count/stats.total)*100) : 0}%` }} />
                </div>
                <span className="text-sm font-bold text-slate-700 w-6 text-right">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Cost Overview (Fase 2 data) */}
      {stats.itemsWithCost > 0 && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <h3 className="font-bold text-slate-900 mb-4">Kosten Overzicht (Top items)</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="text-left py-2 px-3 text-xs font-semibold text-slate-500 uppercase">Tag</th>
                  <th className="text-left py-2 px-3 text-xs font-semibold text-slate-500 uppercase">Omschrijving</th>
                  <th className="text-right py-2 px-3 text-xs font-semibold text-slate-500 uppercase">Cost Rules</th>
                  <th className="text-right py-2 px-3 text-xs font-semibold text-slate-500 uppercase">Subtotaal</th>
                  <th className="text-right py-2 px-3 text-xs font-semibold text-slate-500 uppercase">Totaal incl. cont.</th>
                  <th className="text-left py-2 px-3 text-xs font-semibold text-slate-500 uppercase">Bar</th>
                </tr>
              </thead>
              <tbody>
                {scopeItems
                  .filter(i => (i.costRules || []).length > 0)
                  .map(i => {
                    const subtotal = (i.costRules || []).reduce((s, r) => s + (r.totaal || 0), 0);
                    const contingency = subtotal * ((i.contingency?.percentage || 0) / 100);
                    const total = subtotal + contingency;
                    return { ...i, subtotal, total };
                  })
                  .sort((a, b) => b.total - a.total)
                  .slice(0, 8)
                  .map((item, idx) => {
                    const maxCost = Math.max(...scopeItems.filter(i => (i.costRules||[]).length > 0).map(i => {
                      const s = (i.costRules||[]).reduce((ss,r)=>ss+(r.totaal||0),0);
                      return s * (1 + ((i.contingency?.percentage||0)/100));
                    }));
                    return (
                      <tr key={item.id} className="border-b border-slate-50 hover:bg-slate-50">
                        <td className="py-2 px-3 font-mono text-xs font-semibold text-blue-600">{item.tagNumber}</td>
                        <td className="py-2 px-3 text-slate-700 max-w-xs truncate">{item.description}</td>
                        <td className="py-2 px-3 text-right text-slate-500">{(item.costRules||[]).length}</td>
                        <td className="py-2 px-3 text-right font-medium">€{item.subtotal.toFixed(0)}</td>
                        <td className="py-2 px-3 text-right font-bold text-emerald-700">€{item.total.toFixed(0)}</td>
                        <td className="py-2 px-3 w-32">
                          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${maxCost > 0 ? Math.round((item.total/maxCost)*100) : 0}%` }} />
                          </div>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-slate-200">
                  <td colSpan="3" className="py-2 px-3 text-xs font-semibold text-slate-500">TOTAAL ({stats.itemsWithCost} items)</td>
                  <td className="py-2 px-3 text-right font-bold">€{scopeItems.reduce((s,i)=>{const sub=(i.costRules||[]).reduce((ss,r)=>ss+(r.totaal||0),0);return s+sub;},0).toFixed(0)}</td>
                  <td className="py-2 px-3 text-right font-bold text-emerald-700">€{stats.totalCost.toFixed(0)}</td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}

      {/* Scope items needing attention */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <h3 className="font-bold text-slate-900 mb-4">Scope Items - Status Overzicht</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="text-left py-2 px-3 text-xs font-semibold text-slate-500 uppercase">Tag</th>
                <th className="text-left py-2 px-3 text-xs font-semibold text-slate-500 uppercase">Beschrijving</th>
                <th className="text-center py-2 px-3 text-xs font-semibold text-slate-500 uppercase">Prio</th>
                <th className="text-center py-2 px-3 text-xs font-semibold text-slate-500 uppercase">Activiteiten</th>
                <th className="text-center py-2 px-3 text-xs font-semibold text-slate-500 uppercase">Voortgang</th>
                <th className="text-left py-2 px-3 text-xs font-semibold text-slate-500 uppercase">Workflow</th>
              </tr>
            </thead>
            <tbody>
              {scopeItems.filter(i => i.status === 'In Scope').slice(0, 10).map(item => {
                const acts = item.plannedActivities || [];
                const done = acts.filter(a => a.executionStatus === 'Completed').length;
                const pct = acts.length > 0 ? Math.round((done/acts.length)*100) : 0;
                const workflow = workflowStatuses.find(ws => ws.id === item.workflowStatusId);
                return (
                  <tr key={item.id} className="border-b border-slate-50 hover:bg-slate-50">
                    <td className="py-2 px-3 font-mono text-xs font-semibold text-blue-600">{item.tagNumber}</td>
                    <td className="py-2 px-3 text-slate-700 max-w-xs truncate">{item.description}</td>
                    <td className="py-2 px-3 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                        item.priority === 'High' ? 'bg-red-100 text-red-700' :
                        item.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-green-100 text-green-700'}`}>{item.priority}</span>
                    </td>
                    <td className="py-2 px-3 text-center text-slate-500">{done}/{acts.length}</td>
                    <td className="py-2 px-3">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${pct === 100 ? 'bg-emerald-500' : pct > 50 ? 'bg-blue-400' : 'bg-slate-300'}`}
                            style={{ width: `${pct}%` }} />
                        </div>
                        <span className="text-xs text-slate-500 w-8">{pct}%</span>
                      </div>
                    </td>
                    <td className="py-2 px-3">
                      {workflow && (
                        <span className="px-2 py-0.5 rounded-full text-xs font-semibold text-white"
                          style={{ backgroundColor: workflow.color }}>{workflow.name}</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

// Import other components from previous version (Costing, Execution, Wallboard)
// ... (keeping the same as before for brevity)


// ===== FASE 3: GANTT / PLANNING VIEW =====
const PlanningGantt = ({ scopeItems, resources }) => {
  const [viewMode, setViewMode] = useState('days'); // days, weeks
  const [filterPhase, setFilterPhase] = useState('all');
  const [startOffset, setStartOffset] = useState(0);

  const phases = ['PRE-TA', 'UITBEDRIJF', 'TA', 'INBEDRIJF', 'POST-TA'];
  const phaseColors = { 'PRE-TA': '#8b5cf6', 'UITBEDRIJF': '#f97316', 'TA': '#3b82f6', 'INBEDRIJF': '#22c55e', 'POST-TA': '#64748b' };
  const statusColors = { 'Completed': '#22c55e', 'In Progress': '#3b82f6', 'On Hold': '#f97316', 'Planned': '#94a3b8' };

  // Build flat activity list with calculated positions
  const activities = useMemo(() => {
    const result = [];
    let currentDay = 0;

    const phaseOffsets = {};
    phases.forEach(phase => {
      phaseOffsets[phase] = currentDay;
      const phaseDuration = scopeItems.reduce((max, item) => {
        const acts = (item.plannedActivities || []).filter(a => a.phase === phase);
        const totalDur = acts.reduce((s, a) => s + (a.duration || 1), 0);
        return Math.max(max, totalDur);
      }, 0);
      currentDay += phaseDuration || 5;
    });

    scopeItems.forEach(item => {
      const acts = item.plannedActivities || [];
      if (acts.length === 0) return;

      phases.forEach(phase => {
        const phaseActs = acts.filter(a => a.phase === phase);
        let dayOffset = phaseOffsets[phase] || 0;

        phaseActs.forEach(act => {
          result.push({
            id: act.id,
            activityId: act.activityId,
            description: act.overrideDescription,
            scopeTag: item.tagNumber,
            scopeDesc: item.description,
            phase,
            duration: act.duration || 1,
            startDay: dayOffset,
            status: act.executionStatus || 'Planned',
            progress: act.progress || 0,
            resources: (act.resources || []).length,
            isHoldPoint: act.holdPoint,
          });
          dayOffset += act.duration || 1;
        });
      });
    });

    return result.filter(a => filterPhase === 'all' || a.phase === filterPhase);
  }, [scopeItems, filterPhase]);

  const totalDays = useMemo(() => {
    if (activities.length === 0) return 30;
    return Math.max(...activities.map(a => a.startDay + a.duration)) + 5;
  }, [activities]);

  const visibleDays = viewMode === 'days' ? 30 : 14;
  const dayWidth = viewMode === 'days' ? 28 : 60;
  const maxOffset = Math.max(0, totalDays - visibleDays);

  const phaseSpans = useMemo(() => {
    const spans = {};
    phases.forEach(phase => {
      const phaseActs = activities.filter(a => a.phase === phase);
      if (phaseActs.length === 0) return;
      const start = Math.min(...phaseActs.map(a => a.startDay));
      const end = Math.max(...phaseActs.map(a => a.startDay + a.duration));
      spans[phase] = { start, end };
    });
    return spans;
  }, [activities]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Planning & Gantt</h2>
          <p className="text-slate-500 text-sm mt-1">{activities.length} activiteiten · {totalDays} dagen totaal</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex rounded-lg border border-slate-200 overflow-hidden">
            {['all', ...phases].map(p => (
              <button key={p} onClick={() => setFilterPhase(p)}
                className={`px-3 py-1.5 text-xs font-medium transition-colors ${filterPhase === p ? 'bg-blue-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'}`}>
                {p === 'all' ? 'Alle' : p}
              </button>
            ))}
          </div>
        </div>
      </div>

      {activities.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center border border-slate-200 shadow-sm">
          <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500">Geen activiteiten gepland. Voeg activiteiten toe via Scope Manager.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">

          {/* Phase header legend */}
          <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 border-b border-slate-200 flex-wrap">
            {phases.map(phase => {
              const span = phaseSpans[phase];
              if (!span) return null;
              const acts = activities.filter(a => a.phase === phase);
              return (
                <div key={phase} className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded" style={{ backgroundColor: phaseColors[phase] }} />
                  <span className="text-xs font-semibold text-slate-700">{phase}</span>
                  <span className="text-xs text-slate-400">({acts.length} activiteiten, dag {span.start + 1}–{span.end})</span>
                </div>
              );
            })}
          </div>

          {/* Navigation */}
          <div className="flex items-center gap-2 px-4 py-2 border-b border-slate-100 bg-white">
            <button onClick={() => setStartOffset(Math.max(0, startOffset - 7))}
              className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500" title="Vorige week">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs text-slate-500">Dag {startOffset + 1}–{Math.min(startOffset + visibleDays, totalDays)} van {totalDays}</span>
            <button onClick={() => setStartOffset(Math.min(maxOffset, startOffset + 7))}
              className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500" title="Volgende week">
              <ChevronRight className="w-4 h-4" />
            </button>
            <div className="flex-1" />
            <div className="flex rounded-lg border border-slate-200 overflow-hidden">
              <button onClick={() => setViewMode('days')} className={`px-3 py-1 text-xs ${viewMode === 'days' ? 'bg-blue-600 text-white' : 'bg-white text-slate-600'}`}>Dagen</button>
              <button onClick={() => setViewMode('weeks')} className={`px-3 py-1 text-xs ${viewMode === 'weeks' ? 'bg-blue-600 text-white' : 'bg-white text-slate-600'}`}>Weken</button>
            </div>
          </div>

          <div className="overflow-auto max-h-[60vh]">
            {/* Day header */}
            <div className="flex sticky top-0 z-10 bg-white border-b border-slate-200">
              <div className="w-72 shrink-0 px-3 py-2 text-xs font-semibold text-slate-500 bg-slate-50 border-r border-slate-200">Activiteit</div>
              <div className="flex">
                {Array.from({ length: visibleDays }, (_, i) => {
                  const day = startOffset + i + 1;
                  const isWeekend = (day % 7 === 0 || day % 7 === 6);
                  return (
                    <div key={i} className={`text-center text-xs py-2 border-r border-slate-100 shrink-0 ${isWeekend ? 'bg-slate-50 text-slate-400' : 'text-slate-600'}`}
                      style={{ width: dayWidth }}>
                      {viewMode === 'days' ? `D${day}` : `W${Math.ceil(day/7)}`}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Phase groups with activities */}
            {phases.map(phase => {
              const phaseActs = activities.filter(a => a.phase === phase);
              if (phaseActs.length === 0) return null;
              return (
                <div key={phase}>
                  {/* Phase header row */}
                  <div className="flex border-b border-slate-100" style={{ backgroundColor: phaseColors[phase] + '15' }}>
                    <div className="w-72 shrink-0 px-3 py-1.5 border-r border-slate-200">
                      <span className="text-xs font-bold" style={{ color: phaseColors[phase] }}>
                        ■ {phase} ({phaseActs.length} activiteiten)
                      </span>
                    </div>
                    <div className="flex-1 relative" style={{ minWidth: visibleDays * dayWidth }}>
                      {/* Phase span bar */}
                      {phaseSpans[phase] && (() => {
                        const span = phaseSpans[phase];
                        const left = Math.max(0, (span.start - startOffset) * dayWidth);
                        const right = Math.min(visibleDays * dayWidth, (span.end - startOffset) * dayWidth);
                        if (right <= 0 || left >= visibleDays * dayWidth) return null;
                        return (
                          <div className="absolute top-1 bottom-1 rounded opacity-20"
                            style={{ left, width: right - left, backgroundColor: phaseColors[phase] }} />
                        );
                      })()}
                    </div>
                  </div>

                  {/* Activity rows */}
                  {phaseActs.map((act, idx) => {
                    const barLeft = (act.startDay - startOffset) * dayWidth;
                    const barWidth = act.duration * dayWidth - 2;
                    const isVisible = barLeft + barWidth > 0 && barLeft < visibleDays * dayWidth;
                    const clampedLeft = Math.max(0, barLeft);
                    const clampedWidth = Math.min(barWidth, visibleDays * dayWidth - clampedLeft);
                    const color = statusColors[act.status] || '#94a3b8';

                    return (
                      <div key={act.id} className={`flex border-b border-slate-50 hover:bg-slate-50 ${idx % 2 === 0 ? '' : 'bg-slate-50/30'}`}>
                        <div className="w-72 shrink-0 px-3 py-2 border-r border-slate-100">
                          <div className="flex items-center gap-2">
                            {act.isHoldPoint && <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" title="Hold Point" />}
                            <span className="text-xs font-mono font-semibold text-blue-600 shrink-0">{act.activityId}</span>
                            <span className="text-xs text-slate-600 truncate">{act.description}</span>
                          </div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs text-slate-400 truncate">{act.scopeTag}</span>
                            {act.resources > 0 && <span className="text-xs text-slate-400">{act.resources} res.</span>}
                            <span className="text-xs text-slate-400">{act.duration}d</span>
                          </div>
                        </div>
                        <div className="relative flex-1" style={{ minWidth: visibleDays * dayWidth }}>
                          {/* Weekend shading */}
                          {Array.from({ length: visibleDays }, (_, i) => {
                            const day = startOffset + i + 1;
                            if (day % 7 === 0 || day % 7 === 6) {
                              return <div key={i} className="absolute top-0 bottom-0 bg-slate-100/50" style={{ left: i * dayWidth, width: dayWidth }} />;
                            }
                            return null;
                          })}
                          {/* Activity bar */}
                          {isVisible && (
                            <div className="absolute top-1.5 rounded-md flex items-center overflow-hidden"
                              style={{ left: clampedLeft, width: Math.max(4, clampedWidth), height: 22, backgroundColor: color + '30', border: `1.5px solid ${color}` }}>
                              {/* Progress fill */}
                              {act.progress > 0 && (
                                <div className="absolute left-0 top-0 bottom-0 rounded-l-md"
                                  style={{ width: `${act.progress}%`, backgroundColor: color + '60' }} />
                              )}
                              {clampedWidth > 40 && (
                                <span className="relative z-10 px-1.5 text-xs font-medium truncate" style={{ color }}>
                                  {act.status === 'Completed' ? '✓' : act.progress > 0 ? `${act.progress}%` : ''}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 px-4 py-3 bg-slate-50 border-t border-slate-200">
            <span className="text-xs font-semibold text-slate-500">Status:</span>
            {Object.entries(statusColors).map(([status, color]) => (
              <div key={status} className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded" style={{ backgroundColor: color }} />
                <span className="text-xs text-slate-600">{status}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};


// ===== FASE 3: DOCUMENT MANAGEMENT =====
const DocumentManagement = ({ scopeItems, onUpdate }) => {
  const [selectedScopeId, setSelectedScopeId] = useState('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingDoc, setEditingDoc] = useState(null);
  const [newDoc, setNewDoc] = useState({ 
    title: '', type: 'Procedure', docNumber: '', revision: 'A', 
    url: '', status: 'Concept', scopeIds: [] 
  });

  const DOC_TYPES = ['Procedure', 'Tekening', 'P&ID', 'Werkinstructie', 'TRA', 'Vergunning', 'Certificaat', 'Rapport', 'Overig'];
  const DOC_STATUS = ['Concept', 'Ter Review', 'Goedgekeurd', 'Vervallen'];
  const STATUS_COLORS = { 'Concept': 'bg-slate-100 text-slate-700', 'Ter Review': 'bg-yellow-100 text-yellow-700', 'Goedgekeurd': 'bg-green-100 text-green-700', 'Vervallen': 'bg-red-100 text-red-700' };

  // Collect all documents from all scope items
  const allDocuments = useMemo(() => {
    const docs = [];
    scopeItems.forEach(item => {
      (item.documents || []).forEach(doc => {
        docs.push({ ...doc, _scopeTag: item.tagNumber, _scopeDesc: item.description, _scopeId: item.id });
      });
    });
    return docs;
  }, [scopeItems]);

  const filteredDocs = useMemo(() => {
    if (selectedScopeId === 'all') return allDocuments;
    return allDocuments.filter(d => d._scopeId === selectedScopeId);
  }, [allDocuments, selectedScopeId]);

  const addDocument = () => {
    if (!newDoc.title || newDoc.scopeIds.length === 0) return;
    const doc = { ...newDoc, id: `doc-${Date.now()}`, addedAt: new Date().toISOString() };
    delete doc.scopeIds;

    const updatedItems = scopeItems.map(item => {
      if (!newDoc.scopeIds.includes(item.id)) return item;
      return { ...item, documents: [...(item.documents || []), { ...doc }] };
    });

    updatedItems.forEach(item => {
      if (newDoc.scopeIds.includes(item.id)) onUpdate(item);
    });
    setNewDoc({ title: '', type: 'Procedure', docNumber: '', revision: 'A', url: '', status: 'Concept', scopeIds: [] });
    setShowAddForm(false);
  };

  const deleteDocument = (docId, scopeId) => {
    const item = scopeItems.find(i => i.id === scopeId);
    if (!item) return;
    onUpdate({ ...item, documents: (item.documents || []).filter(d => d.id !== docId) });
  };

  const updateDocStatus = (docId, scopeId, newStatus) => {
    const item = scopeItems.find(i => i.id === scopeId);
    if (!item) return;
    onUpdate({ ...item, documents: (item.documents || []).map(d => d.id === docId ? { ...d, status: newStatus } : d) });
  };

  // Stats
  const stats = {
    total: allDocuments.length,
    goedgekeurd: allDocuments.filter(d => d.status === 'Goedgekeurd').length,
    terReview: allDocuments.filter(d => d.status === 'Ter Review').length,
    byType: DOC_TYPES.reduce((acc, t) => { acc[t] = allDocuments.filter(d => d.type === t).length; return acc; }, {})
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Document Management</h2>
          <p className="text-slate-500 text-sm mt-1">{stats.total} documenten · {stats.goedgekeurd} goedgekeurd</p>
        </div>
        <button onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
          <Plus className="w-4 h-4" /> Document Toevoegen
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Totaal', value: stats.total, color: 'text-slate-900', bg: 'bg-slate-50' },
          { label: 'Goedgekeurd', value: stats.goedgekeurd, color: 'text-green-700', bg: 'bg-green-50' },
          { label: 'Ter Review', value: stats.terReview, color: 'text-yellow-700', bg: 'bg-yellow-50' },
          { label: 'Concept', value: stats.total - stats.goedgekeurd - stats.terReview, color: 'text-slate-600', bg: 'bg-slate-50' },
        ].map(({ label, value, color, bg }) => (
          <div key={label} className={`${bg} rounded-xl p-4 border border-slate-200`}>
            <p className="text-xs text-slate-500 font-medium">{label}</p>
            <p className={`text-3xl font-bold mt-1 ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Filter + Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="flex items-center gap-3 p-4 border-b border-slate-100">
          <span className="text-sm font-medium text-slate-600">Filter op scope item:</span>
          <select value={selectedScopeId} onChange={(e) => setSelectedScopeId(e.target.value)}
            className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm bg-white">
            <option value="all">Alle ({allDocuments.length})</option>
            {scopeItems.filter(i => (i.documents || []).length > 0).map(item => (
              <option key={item.id} value={item.id}>{item.tagNumber} - {item.description} ({(item.documents||[]).length})</option>
            ))}
          </select>
          <span className="text-xs text-slate-400 ml-auto">{filteredDocs.length} documenten zichtbaar</span>
        </div>

        {filteredDocs.length === 0 ? (
          <div className="p-12 text-center">
            <FileText className="w-12 h-12 text-slate-200 mx-auto mb-3" />
            <p className="text-slate-400">Geen documenten gevonden. Voeg documenten toe via de knop hierboven.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Document</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Type</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Nr / Rev</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Scope Item</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Status</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Acties</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredDocs.map(doc => (
                <tr key={doc.id + doc._scopeId} className="hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <div className="font-medium text-slate-900">{doc.title}</div>
                    {doc.url && <a href={doc.url} target="_blank" rel="noreferrer" className="text-xs text-blue-500 hover:underline">Link openen</a>}
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-medium">{doc.type}</span>
                  </td>
                  <td className="px-4 py-3 text-slate-500 text-xs">
                    {doc.docNumber && <span className="font-mono">{doc.docNumber}</span>}
                    {doc.revision && <span className="ml-1 text-slate-400">Rev. {doc.revision}</span>}
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-mono text-xs text-blue-600 font-semibold">{doc._scopeTag}</span>
                    <span className="text-xs text-slate-400 ml-1 truncate">{doc._scopeDesc?.slice(0, 25)}</span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <select value={doc.status}
                      onChange={(e) => updateDocStatus(doc.id, doc._scopeId, e.target.value)}
                      className={`text-xs font-semibold px-2 py-1 rounded-full border-0 cursor-pointer ${STATUS_COLORS[doc.status] || 'bg-slate-100 text-slate-700'}`}>
                      {DOC_STATUS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button onClick={() => deleteDocument(doc.id, doc._scopeId)}
                      className="p-1 hover:bg-red-50 rounded text-red-400 hover:text-red-600 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Type distribution */}
      {stats.total > 0 && (
        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200">
          <h3 className="font-semibold text-slate-900 mb-3">Documenten per Type</h3>
          <div className="grid grid-cols-3 gap-3">
            {DOC_TYPES.filter(t => stats.byType[t] > 0).map(type => (
              <div key={type} className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg">
                <FileText className="w-4 h-4 text-slate-400" />
                <span className="text-sm text-slate-600 flex-1">{type}</span>
                <span className="text-sm font-bold text-slate-900">{stats.byType[type]}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Document Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-5 rounded-t-xl flex items-center justify-between">
              <h3 className="text-white font-bold text-lg">Document Toevoegen</h3>
              <button onClick={() => setShowAddForm(false)} className="text-white hover:bg-white/20 p-1 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Titel *</label>
                <input type="text" value={newDoc.title} onChange={(e) => setNewDoc({ ...newDoc, title: e.target.value })}
                  placeholder="bijv. V-401 Veiligheidsprocedure"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Type</label>
                  <select value={newDoc.type} onChange={(e) => setNewDoc({ ...newDoc, type: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white">
                    {DOC_TYPES.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Status</label>
                  <select value={newDoc.status} onChange={(e) => setNewDoc({ ...newDoc, status: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white">
                    {DOC_STATUS.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Document Nr.</label>
                  <input type="text" value={newDoc.docNumber} onChange={(e) => setNewDoc({ ...newDoc, docNumber: e.target.value })}
                    placeholder="bijv. DOC-2024-001"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Revisie</label>
                  <input type="text" value={newDoc.revision} onChange={(e) => setNewDoc({ ...newDoc, revision: e.target.value })}
                    placeholder="A"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">URL / Link (optioneel)</label>
                <input type="text" value={newDoc.url} onChange={(e) => setNewDoc({ ...newDoc, url: e.target.value })}
                  placeholder="https://sharepoint.company.com/..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Koppelen aan scope items *</label>
                <div className="border border-slate-200 rounded-lg max-h-40 overflow-y-auto">
                  {scopeItems.filter(i => i.status === 'In Scope').map(item => (
                    <label key={item.id} className="flex items-center gap-2 px-3 py-2 hover:bg-slate-50 cursor-pointer">
                      <input type="checkbox"
                        checked={newDoc.scopeIds.includes(item.id)}
                        onChange={(e) => setNewDoc({ ...newDoc, scopeIds: e.target.checked ? [...newDoc.scopeIds, item.id] : newDoc.scopeIds.filter(id => id !== item.id) })}
                        className="w-4 h-4" />
                      <span className="text-xs font-mono font-semibold text-blue-600">{item.tagNumber}</span>
                      <span className="text-xs text-slate-600">{item.description}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <div className="border-t p-4 flex justify-end gap-3">
              <button onClick={() => setShowAddForm(false)}
                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg text-sm">Annuleren</button>
              <button onClick={addDocument} disabled={!newDoc.title || newDoc.scopeIds.length === 0}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed">
                Document Toevoegen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


// ===== FASE 3: TRA PROJECT OVERVIEW =====
const TRAOverview = ({ scopeItems }) => {
  const [filterLevel, setFilterLevel] = useState('all');

  // Collect all TRAs from all activities
  const allTRAs = useMemo(() => {
    const list = [];
    scopeItems.forEach(item => {
      (item.plannedActivities || []).forEach(act => {
        const tra = act.tra;
        if (!tra) return;
        const risks = tra.risks || [];
        if (risks.length === 0) return;

        const highestScore = risks.length > 0 ? Math.max(...risks.map(r => (r.probability||1)*(r.severity||1))) : 0;
        const level = getTraRiskLevel(Math.ceil(Math.sqrt(highestScore)), Math.ceil(Math.sqrt(highestScore)));

        const permitsCount = Object.values(tra.permits || {}).filter(Boolean).length;
        const ppeCount = Object.values(tra.ppe || {}).filter(Boolean).length;
        const criticalRisks = risks.filter(r => (r.probability||1)*(r.severity||1) >= 15).length;
        const highRisks = risks.filter(r => { const s=(r.probability||1)*(r.severity||1); return s >= 8 && s < 15; }).length;

        list.push({
          activityId: act.activityId,
          activityDesc: act.overrideDescription,
          scopeTag: item.tagNumber,
          scopeDesc: item.description,
          phase: act.phase,
          tra,
          risks,
          highestScore,
          level,
          permitsCount,
          ppeCount,
          criticalRisks,
          highRisks,
        });
      });
    });
    return list;
  }, [scopeItems]);

  const filtered = filterLevel === 'all' ? allTRAs
    : filterLevel === 'critical' ? allTRAs.filter(t => t.criticalRisks > 0)
    : filterLevel === 'high' ? allTRAs.filter(t => t.highRisks > 0)
    : filterLevel === 'not_approved' ? allTRAs.filter(t => !t.tra.approved)
    : allTRAs;

  // Stats
  const stats = {
    total: allTRAs.length,
    approved: allTRAs.filter(t => t.tra.approved).length,
    critical: allTRAs.filter(t => t.criticalRisks > 0).length,
    high: allTRAs.filter(t => t.highRisks > 0).length,
    totalRisks: allTRAs.reduce((s, t) => s + t.risks.length, 0),
  };

  // All risks flattened for the matrix
  const allRisks = allTRAs.flatMap(t => t.risks.map(r => ({ ...r, activityId: t.activityId, scopeTag: t.scopeTag })));
  const riskMatrix = useMemo(() => {
    const matrix = {};
    for (let p = 1; p <= 5; p++) {
      for (let s = 1; s <= 5; s++) {
        matrix[`${p}-${s}`] = allRisks.filter(r => (r.probability||1) === p && (r.severity||1) === s).length;
      }
    }
    return matrix;
  }, [allRisks]);

  const phaseColors = { 'PRE-TA': 'bg-purple-100 text-purple-700', 'UITBEDRIJF': 'bg-orange-100 text-orange-700', 'TA': 'bg-blue-100 text-blue-700', 'INBEDRIJF': 'bg-green-100 text-green-700', 'POST-TA': 'bg-slate-100 text-slate-700' };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">T.R.A. Overzicht</h2>
          <p className="text-slate-500 text-sm mt-1">{stats.total} activiteiten met TRA · {stats.totalRisks} risico's totaal</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'TRA's Totaal', value: stats.total, color: 'text-slate-900', bg: 'bg-slate-50', border: 'border-slate-200' },
          { label: 'Goedgekeurd', value: stats.approved, color: 'text-green-700', bg: 'bg-green-50', border: 'border-green-200' },
          { label: 'KRITIEK risico', value: stats.critical, color: 'text-red-700', bg: 'bg-red-50', border: 'border-red-200' },
          { label: 'HOOG risico', value: stats.high, color: 'text-orange-700', bg: 'bg-orange-50', border: 'border-orange-200' },
        ].map(({ label, value, color, bg, border }) => (
          <div key={label} className={`${bg} border ${border} rounded-xl p-4`}>
            <p className="text-xs text-slate-500 font-medium">{label}</p>
            <p className={`text-3xl font-bold mt-1 ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Risk Matrix + Legend */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Risk Matrix */}
        <div className="lg:col-span-2 bg-white rounded-xl p-5 shadow-sm border border-slate-200">
          <h3 className="font-bold text-slate-900 mb-4">Risicomatrix (initieel)</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr>
                  <th className="p-2 text-slate-500 text-left">Kans → Ernst ↓</th>
                  {TRA_SEVERITY.map(s => (
                    <th key={s.value} className="p-2 text-center text-slate-600 font-semibold w-16">{s.value}<br/><span className="text-slate-400 font-normal">{s.short}</span></th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {TRA_PROBABILITY.slice().reverse().map(p => (
                  <tr key={p.value}>
                    <td className="p-2 text-slate-600 font-semibold">{p.value} {p.short}</td>
                    {TRA_SEVERITY.map(s => {
                      const score = p.value * s.value;
                      const level = getTraRiskLevel(p.value, s.value);
                      const count = riskMatrix[`${p.value}-${s.value}`] || 0;
                      return (
                        <td key={s.value} className={`p-2 text-center ${level.bg} border border-white`}>
                          <div className={`w-10 h-10 mx-auto rounded-lg flex flex-col items-center justify-center ${level.bg}`}>
                            <span className={`text-xs font-bold ${level.text}`}>{score}</span>
                            {count > 0 && <span className={`text-xs font-bold mt-0.5 ${level.text}`}>{count}x</span>}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center gap-3 mt-3 text-xs">
            {[
              { level: 'LAAG', bg: 'bg-green-100', text: 'text-green-800', range: '1-3' },
              { level: 'MEDIUM', bg: 'bg-yellow-100', text: 'text-yellow-800', range: '4-7' },
              { level: 'HOOG', bg: 'bg-orange-100', text: 'text-orange-800', range: '8-14' },
              { level: 'KRITIEK', bg: 'bg-red-100', text: 'text-red-800', range: '15-25' },
            ].map(({ level, bg, text, range }) => (
              <span key={level} className={`px-2 py-0.5 rounded font-semibold ${bg} ${text}`}>{level} ({range})</span>
            ))}
          </div>
        </div>

        {/* Approvals */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200">
          <h3 className="font-bold text-slate-900 mb-4">Goedkeuringsstatus</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex-1 h-4 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-green-500 rounded-full transition-all"
                  style={{ width: `${stats.total > 0 ? Math.round((stats.approved/stats.total)*100) : 0}%` }} />
              </div>
              <span className="text-sm font-bold text-green-600 w-10 text-right">
                {stats.total > 0 ? Math.round((stats.approved/stats.total)*100) : 0}%
              </span>
            </div>
            <p className="text-sm text-slate-500">{stats.approved} van {stats.total} TRA's goedgekeurd</p>

            {stats.total > 0 && stats.approved < stats.total && (
              <div className="mt-3">
                <p className="text-xs font-semibold text-slate-500 uppercase mb-2">Nog goed te keuren:</p>
                <div className="space-y-1 max-h-48 overflow-y-auto">
                  {allTRAs.filter(t => !t.tra.approved).slice(0, 10).map(t => (
                    <div key={t.activityId} className="flex items-center gap-2 p-2 bg-orange-50 rounded-lg border border-orange-100">
                      <AlertTriangle className="w-3 h-3 text-orange-500 shrink-0" />
                      <span className="text-xs font-mono text-blue-600 font-semibold shrink-0">{t.activityId}</span>
                      <span className="text-xs text-slate-600 truncate">{t.activityDesc}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Filter + TRA List */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="flex items-center gap-3 p-4 border-b border-slate-100">
          <span className="text-sm font-medium text-slate-600">Filter:</span>
          {[
            { id: 'all', label: `Alle (${allTRAs.length})` },
            { id: 'not_approved', label: `Niet goedgekeurd (${allTRAs.length - stats.approved})` },
            { id: 'critical', label: `Kritiek (${stats.critical})` },
            { id: 'high', label: `Hoog (${stats.high})` },
          ].map(f => (
            <button key={f.id} onClick={() => setFilterLevel(f.id)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${filterLevel === f.id ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
              {f.label}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-slate-400">Geen TRA's gevonden. Voeg risico's toe via de activiteit editor (tab TRA).</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Activiteit</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Scope</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Fase</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Risico's</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Vergunningen</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-slate-500 uppercase">PBM</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map(t => (
                <tr key={t.activityId + t.scopeTag} className="hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <span className="font-mono text-xs font-semibold text-blue-600">{t.activityId}</span>
                    <p className="text-xs text-slate-600 truncate max-w-48">{t.activityDesc}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-mono text-xs font-semibold text-slate-700">{t.scopeTag}</span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${phaseColors[t.phase] || 'bg-slate-100 text-slate-600'}`}>{t.phase}</span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <span className="text-sm font-bold text-slate-700">{t.risks.length}</span>
                      {t.criticalRisks > 0 && <span className="px-1.5 py-0.5 bg-red-100 text-red-700 text-xs font-bold rounded">{t.criticalRisks} krit.</span>}
                      {t.highRisks > 0 && <span className="px-1.5 py-0.5 bg-orange-100 text-orange-700 text-xs font-bold rounded">{t.highRisks} hoog</span>}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center text-sm">{t.permitsCount > 0 ? <span className="font-semibold text-blue-600">{t.permitsCount}</span> : <span className="text-slate-300">—</span>}</td>
                  <td className="px-4 py-3 text-center text-sm">{t.ppeCount > 0 ? <span className="font-semibold text-orange-600">{t.ppeCount}</span> : <span className="text-slate-300">—</span>}</td>
                  <td className="px-4 py-3 text-center">
                    {t.tra.approved ? (
                      <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-bold rounded-full">✓ Goedgekeurd</span>
                    ) : (
                      <span className="px-2 py-0.5 bg-orange-100 text-orange-700 text-xs font-bold rounded-full">Wachten</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};


// ===== FASE 3: EXPORT HUB =====
const ExportHub = ({ project, scopeItems, resources, templates }) => {
  const toast = useToast();
  const [activeExport, setActiveExport] = useState('excel');
  const [isExporting, setIsExporting] = useState(false);

  // ── Helpers ──────────────────────────────────────────────
  const download = (content, filename, mime) => {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename;
    document.body.appendChild(a); a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const ts = () => new Date().toISOString().split('T')[0];
  const projectCode = project?.p6ProjectCode || project?.name?.replace(/\s+/g,'-') || 'ChemPrep';
  const projectName = project?.name || 'ChemPrep Project';

  // ── Stats ────────────────────────────────────────────────
  const stats = useMemo(() => {
    const allActs = scopeItems.flatMap(i => i.plannedActivities || []);
    const allRisks = allActs.flatMap(a => (a.tra?.risks || []));
    const totalCost = scopeItems.reduce((s, i) => {
      const sub = (i.costRules || []).reduce((ss, r) => ss + (r.totaal || 0), 0);
      return s + sub * (1 + ((i.contingency?.percentage || 0) / 100));
    }, 0);
    return {
      inScope: scopeItems.filter(i => i.status === 'In Scope').length,
      total: scopeItems.length,
      activities: allActs.length,
      completed: allActs.filter(a => a.executionStatus === 'Completed').length,
      documents: scopeItems.reduce((s, i) => s + (i.documents || []).length, 0),
      risks: allRisks.length,
      criticalRisks: allRisks.filter(r => (r.probability||1)*(r.severity||1) >= 15).length,
      totalCost,
      itemsWithCost: scopeItems.filter(i => (i.costRules||[]).length > 0).length,
    };
  }, [scopeItems]);

  // ── CSV Export ───────────────────────────────────────────
  const exportCSV = () => {
    setIsExporting(true);
    try {
      const escape = (v) => `"${String(v || '').replace(/"/g, '""')}"`;

      // Sheet 1: Scope items
      const scopeHeaders = ['Tag Number','Description','Status','Priority','Type','System','Discipline','Workflow','Activities','Completed','Cost (subtotal)','Cost (total incl. cont.)','Contingency %','Documents','Risks'];
      const scopeRows = scopeItems.map(item => {
        const acts = item.plannedActivities || [];
        const completed = acts.filter(a => a.executionStatus === 'Completed').length;
        const sub = (item.costRules || []).reduce((s, r) => s + (r.totaal || 0), 0);
        const total = sub * (1 + ((item.contingency?.percentage || 0) / 100));
        const allRisks = acts.flatMap(a => a.tra?.risks || []);
        return [
          escape(item.tagNumber), escape(item.description), escape(item.status), escape(item.priority),
          escape(item.equipmentType), escape(item.system), escape(item.discipline), escape(item.workflowStatusId),
          acts.length, completed, sub.toFixed(2), total.toFixed(2),
          item.contingency?.percentage || 0, (item.documents || []).length, allRisks.length
        ].join(',');
      });
      const scopeCSV = [scopeHeaders.join(','), ...scopeRows].join('\n');

      // Sheet 2: Activities
      const actHeaders = ['Scope Tag','Activity ID','Description','Phase','Duration (d)','Status','Progress %','Resources','Materials','Has TRA','TRA Approved','Critical Risks'];
      const actRows = scopeItems.flatMap(item =>
        (item.plannedActivities || []).map(act => {
          const risks = act.tra?.risks || [];
          const crit = risks.filter(r => (r.probability||1)*(r.severity||1) >= 15).length;
          return [
            escape(item.tagNumber), escape(act.activityId), escape(act.overrideDescription),
            escape(act.phase), act.duration || 1, escape(act.executionStatus), act.progress || 0,
            (act.resources || []).length, (act.materials || []).length,
            risks.length > 0 ? 'Ja' : 'Nee', act.tra?.approved ? 'Ja' : 'Nee', crit
          ].join(',');
        })
      );
      const actCSV = [actHeaders.join(','), ...actRows].join('\n');

      // Combined: two sections separated
      const combined = `SCOPE ITEMS\n${scopeCSV}\n\n\nACTIVITEITEN\n${actCSV}`;
      download(combined, `${projectCode}_rapport_${ts()}.csv`, 'text/csv;charset=utf-8');
      toast.success('CSV gedownload', `${scopeItems.length} scope items · ${stats.activities} activiteiten`);
    } catch(e) {
      toast.error('Fout: ' + e.message);
    } finally {
      setIsExporting(false);
    }
  };

  // ── HTML Report Export ───────────────────────────────────
  const exportHTMLReport = () => {
    setIsExporting(true);
    try {
      const phases = ['PRE-TA', 'UITBEDRIJF', 'TA', 'INBEDRIJF', 'POST-TA'];
      const phaseColors = { 'PRE-TA': '#8b5cf6', 'UITBEDRIJF': '#f97316', 'TA': '#3b82f6', 'INBEDRIJF': '#22c55e', 'POST-TA': '#64748b' };

      const phaseSummary = phases.map(phase => {
        const acts = scopeItems.flatMap(i => (i.plannedActivities || []).filter(a => a.phase === phase));
        const done = acts.filter(a => a.executionStatus === 'Completed').length;
        return { phase, total: acts.length, done, pct: acts.length > 0 ? Math.round((done/acts.length)*100) : 0 };
      });

      const html = `<!DOCTYPE html>
<html lang="nl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>ChemPrep Rapport - ${projectName}</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #1e293b; background: #f8fafc; }
  .header { background: linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%); color: white; padding: 40px; }
  .header h1 { font-size: 28px; font-weight: 800; margin-bottom: 4px; }
  .header p { opacity: 0.8; font-size: 14px; }
  .header .meta { display: flex; gap: 32px; margin-top: 20px; }
  .header .meta div { border-left: 2px solid rgba(255,255,255,0.3); padding-left: 16px; }
  .header .meta label { font-size: 11px; opacity: 0.7; text-transform: uppercase; letter-spacing: 0.05em; }
  .header .meta p { font-size: 20px; font-weight: 700; margin-top: 2px; }
  .container { max-width: 1100px; margin: 0 auto; padding: 32px; }
  .section { margin-bottom: 32px; }
  .section h2 { font-size: 18px; font-weight: 700; color: #1e293b; margin-bottom: 16px; padding-bottom: 8px; border-bottom: 2px solid #e2e8f0; }
  .kpi-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 24px; }
  .kpi { background: white; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; }
  .kpi label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: #64748b; }
  .kpi .value { font-size: 32px; font-weight: 800; color: #1e293b; margin: 4px 0; }
  .kpi .sub { font-size: 12px; color: #94a3b8; }
  .phase-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 12px; }
  .phase-card { background: white; border: 1px solid #e2e8f0; border-radius: 10px; padding: 16px; text-align: center; }
  .phase-badge { display: inline-block; padding: 3px 10px; border-radius: 20px; color: white; font-size: 11px; font-weight: 700; margin-bottom: 8px; }
  .phase-pct { font-size: 28px; font-weight: 800; }
  .phase-sub { font-size: 11px; color: #94a3b8; margin-top: 2px; }
  .progress-bar { height: 6px; background: #e2e8f0; border-radius: 3px; margin-top: 10px; overflow: hidden; }
  .progress-fill { height: 100%; border-radius: 3px; }
  table { width: 100%; border-collapse: collapse; background: white; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0; }
  th { background: #f8fafc; text-align: left; padding: 12px 16px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #64748b; border-bottom: 1px solid #e2e8f0; }
  td { padding: 12px 16px; border-bottom: 1px solid #f1f5f9; font-size: 13px; }
  tr:last-child td { border-bottom: none; }
  tr:hover td { background: #f8fafc; }
  .tag { font-family: monospace; font-weight: 700; color: #2563eb; }
  .badge { display: inline-block; padding: 2px 8px; border-radius: 20px; font-size: 11px; font-weight: 600; }
  .badge-red { background: #fee2e2; color: #991b1b; }
  .badge-yellow { background: #fef3c7; color: #92400e; }
  .badge-green { background: #d1fae5; color: #065f46; }
  .badge-blue { background: #dbeafe; color: #1e40af; }
  .badge-slate { background: #f1f5f9; color: #475569; }
  .cost-total { font-weight: 800; color: #059669; }
  .footer { text-align: center; padding: 24px; color: #94a3b8; font-size: 12px; border-top: 1px solid #e2e8f0; margin-top: 40px; }
  @media print { body { background: white; } .container { padding: 0; } }
</style>
</head>
<body>
<div class="header">
  <h1>ChemPrep Turnaround Rapport</h1>
  <p>${projectName}</p>
  <div class="meta">
    <div><label>Rapport datum</label><p>${new Date().toLocaleDateString('nl-NL')}</p></div>
    <div><label>Project code</label><p>${projectCode}</p></div>
    <div><label>Start datum</label><p>${project?.startDate || '—'}</p></div>
    <div><label>Scope items</label><p>${stats.inScope} / ${stats.total}</p></div>
    <div><label>Totale kosten</label><p>€${(stats.totalCost/1000).toFixed(0)}k</p></div>
  </div>
</div>

<div class="container">
  <div class="section">
    <h2>Project KPI's</h2>
    <div class="kpi-grid">
      <div class="kpi"><label>Scope Items In Scope</label><div class="value">${stats.inScope}</div><div class="sub">van ${stats.total} totaal</div></div>
      <div class="kpi"><label>Activiteiten</label><div class="value">${stats.activities}</div><div class="sub">${stats.completed} afgerond (${stats.activities > 0 ? Math.round((stats.completed/stats.activities)*100) : 0}%)</div></div>
      <div class="kpi"><label>Totale Kosten</label><div class="value">€${(stats.totalCost/1000).toFixed(0)}k</div><div class="sub">${stats.itemsWithCost} items geprijsd</div></div>
      <div class="kpi"><label>Kritieke Risico's</label><div class="value">${stats.criticalRisks}</div><div class="sub">van ${stats.risks} totale risks</div></div>
    </div>

    <div class="phase-grid">
      ${phaseSummary.map(p => `
      <div class="phase-card">
        <div class="phase-badge" style="background:${phaseColors[p.phase]}">${p.phase}</div>
        <div class="phase-pct" style="color:${phaseColors[p.phase]}">${p.pct}%</div>
        <div class="phase-sub">${p.done}/${p.total} activiteiten</div>
        <div class="progress-bar"><div class="progress-fill" style="width:${p.pct}%;background:${phaseColors[p.phase]}"></div></div>
      </div>`).join('')}
    </div>
  </div>

  <div class="section">
    <h2>Scope Items Overzicht</h2>
    <table>
      <thead><tr>
        <th>Tag</th><th>Omschrijving</th><th>Prioriteit</th><th>Activiteiten</th><th>Voortgang</th><th>Kosten</th><th>Risico's</th>
      </tr></thead>
      <tbody>
        ${scopeItems.filter(i => i.status === 'In Scope').map(item => {
          const acts = item.plannedActivities || [];
          const done = acts.filter(a => a.executionStatus === 'Completed').length;
          const pct = acts.length > 0 ? Math.round((done/acts.length)*100) : 0;
          const sub = (item.costRules||[]).reduce((s,r)=>s+(r.totaal||0),0);
          const tot = sub*(1+((item.contingency?.percentage||0)/100));
          const risks = acts.flatMap(a => a.tra?.risks||[]);
          const crit = risks.filter(r=>(r.probability||1)*(r.severity||1)>=15).length;
          const prioBadge = item.priority === 'High' ? 'badge-red' : item.priority === 'Medium' ? 'badge-yellow' : 'badge-green';
          return `<tr>
            <td class="tag">${item.tagNumber}</td>
            <td>${item.description}</td>
            <td><span class="badge ${prioBadge}">${item.priority}</span></td>
            <td>${done}/${acts.length}</td>
            <td>${pct}%</td>
            <td class="cost-total">${tot > 0 ? '€' + tot.toFixed(0) : '—'}</td>
            <td>${crit > 0 ? `<span class="badge badge-red">${crit} krit.</span>` : risks.length > 0 ? risks.length : '—'}</td>
          </tr>`;
        }).join('')}
      </tbody>
    </table>
  </div>

  ${stats.risks > 0 ? `
  <div class="section">
    <h2>T.R.A. - Kritieke Risico's</h2>
    <table>
      <thead><tr><th>Activiteit</th><th>Scope</th><th>Gevaar</th><th>Maatregel</th><th>Score</th><th>Niveau</th></tr></thead>
      <tbody>
        ${scopeItems.flatMap(item => (item.plannedActivities||[]).flatMap(act =>
          (act.tra?.risks||[]).filter(r=>(r.probability||1)*(r.severity||1)>=8).map(r => {
            const score = (r.probability||1)*(r.severity||1);
            const level = score >= 15 ? 'KRITIEK' : 'HOOG';
            const badge = score >= 15 ? 'badge-red' : 'badge-yellow';
            return `<tr>
              <td class="tag">${act.activityId}</td>
              <td class="tag">${item.tagNumber}</td>
              <td>${r.hazard || '—'}</td>
              <td>${r.measure || '—'}</td>
              <td>${score}</td>
              <td><span class="badge ${badge}">${level}</span></td>
            </tr>`;
          })
        )).join('')}
      </tbody>
    </table>
  </div>` : ''}

  ${stats.totalCost > 0 ? `
  <div class="section">
    <h2>Kosten Samenvatting</h2>
    <table>
      <thead><tr><th>Tag</th><th>Omschrijving</th><th>Cost Rules</th><th>Subtotaal</th><th>Contingency</th><th>Totaal</th></tr></thead>
      <tbody>
        ${scopeItems.filter(i=>(i.costRules||[]).length>0).map(item => {
          const sub = (item.costRules||[]).reduce((s,r)=>s+(r.totaal||0),0);
          const cont = sub*((item.contingency?.percentage||0)/100);
          const tot = sub+cont;
          return `<tr>
            <td class="tag">${item.tagNumber}</td>
            <td>${item.description}</td>
            <td>${(item.costRules||[]).length}</td>
            <td>€${sub.toFixed(0)}</td>
            <td>${item.contingency?.percentage||0}% (€${cont.toFixed(0)})</td>
            <td class="cost-total">€${tot.toFixed(0)}</td>
          </tr>`;
        }).join('')}
        <tr style="font-weight:800;border-top:2px solid #e2e8f0">
          <td colspan="5" style="text-align:right;color:#64748b">PROJECTTOTAAL:</td>
          <td class="cost-total">€${stats.totalCost.toFixed(0)}</td>
        </tr>
      </tbody>
    </table>
  </div>` : ''}
</div>
<div class="footer">
  Gegenereerd door ChemPrep v4.9.0 · ${new Date().toLocaleString('nl-NL')} · Vertrouwelijk
</div>
</body></html>`;

      download(html, `${projectCode}_rapport_${ts()}.html`, 'text/html;charset=utf-8');
      toast.success('HTML rapport gedownload', 'Open in browser en druk Ctrl+P voor PDF');
    } catch(e) {
      toast.error('Fout: ' + e.message);
    } finally {
      setIsExporting(false);
    }
  };

  // ── TRA Export ───────────────────────────────────────────
  const exportTRAReport = () => {
    setIsExporting(true);
    try {
      const escape = (v) => `"${String(v || '').replace(/"/g, '""')}"`;
      const headers = ['Activiteit ID','Omschrijving','Scope Tag','Fase','Gevaar','Categorie','Maatregel','Kans (init)','Ernst (init)','Score (init)','Niveau (init)','Kans (resid)','Ernst (resid)','Score (resid)','Niveau (resid)','TRA Goedgekeurd','Goedgekeurd Door','Datum'];
      const rows = [];
      scopeItems.forEach(item => {
        (item.plannedActivities || []).forEach(act => {
          const tra = act.tra || {};
          const risks = tra.risks || [];
          risks.forEach(risk => {
            const initScore = (risk.probability||1)*(risk.severity||1);
            const residScore = (risk.residualProbability||1)*(risk.residualSeverity||1);
            const initLevel = getTraRiskLevel(risk.probability||1, risk.severity||1).level;
            const residLevel = getTraRiskLevel(risk.residualProbability||1, risk.residualSeverity||1).level;
            rows.push([
              escape(act.activityId), escape(act.overrideDescription), escape(item.tagNumber), escape(act.phase),
              escape(risk.hazard), escape(TRA_HAZARD_CATEGORIES.find(c=>c.id===risk.category)?.label || risk.category),
              escape(risk.measure),
              risk.probability||1, risk.severity||1, initScore, initLevel,
              risk.residualProbability||1, risk.residualSeverity||1, residScore, residLevel,
              tra.approved ? 'Ja' : 'Nee', escape(tra.approvedBy), escape(tra.approvedDate)
            ].join(','));
          });
        });
      });
      const csv = [headers.join(','), ...rows].join('\n');
      download(csv, `${projectCode}_TRA_${ts()}.csv`, 'text/csv;charset=utf-8');
      toast.success('TRA rapport gedownload', `${rows.length} risico's geëxporteerd`);
    } catch(e) {
      toast.error('Fout: ' + e.message);
    } finally {
      setIsExporting(false);
    }
  };

  // ── Kosten Export ────────────────────────────────────────
  const exportCostReport = () => {
    setIsExporting(true);
    try {
      const escape = (v) => `"${String(v || '').replace(/"/g, '""')}"`;
      const headers = ['Scope Tag','Scope Omschrijving','Type','Omschrijving','Eenheid','Aantal','Tarief (€)','Vaste Prijs (€)','Toeslag (%)','Totaal (€)','Categorie','Auto-gegenereerd'];
      const rows = [];
      scopeItems.forEach(item => {
        (item.costRules || []).forEach(rule => {
          rows.push([
            escape(item.tagNumber), escape(item.description),
            escape(rule.type), escape(rule.description), escape(rule.eenheid),
            rule.aantal, rule.tarief, rule.vastePrijs || 0, rule.toeslag || 0, rule.totaal || 0,
            escape(rule.category), rule.isAutoGenerated ? 'Ja' : 'Nee'
          ].join(','));
        });
        const sub = (item.costRules||[]).reduce((s,r)=>s+(r.totaal||0),0);
        const cont = sub*((item.contingency?.percentage||0)/100);
        if ((item.costRules||[]).length > 0) {
          rows.push([escape(item.tagNumber),escape(item.description),'TOTAAL','','','','','','','',(sub+cont).toFixed(2),'',''].join(','));
        }
      });
      const totalAll = scopeItems.reduce((s,i)=>{const sub=(i.costRules||[]).reduce((ss,r)=>ss+(r.totaal||0),0);return s+sub*(1+((i.contingency?.percentage||0)/100));},0);
      rows.push(['PROJECTTOTAAL','','','','','','','','','',totalAll.toFixed(2),'',''].join(','));
      const csv = [headers.join(','), ...rows].join('\n');
      download(csv, `${projectCode}_kosten_${ts()}.csv`, 'text/csv;charset=utf-8');
      toast.success('Kostenrapport gedownload', `€${(totalAll/1000).toFixed(0)}k totaal`);
    } catch(e) {
      toast.error('Fout: ' + e.message);
    } finally {
      setIsExporting(false);
    }
  };

  const exports = [
    {
      id: 'excel',
      icon: '📊',
      title: 'Scope & Activiteiten CSV',
      description: 'Alle scope items + activiteiten in CSV formaat. Open in Excel voor verdere analyse.',
      format: 'CSV',
      color: 'from-green-500 to-emerald-600',
      action: exportCSV,
      info: [`${stats.total} scope items`, `${stats.activities} activiteiten`, 'Kosten, voortgang, risico-status per item'],
    },
    {
      id: 'rapport',
      icon: '📄',
      title: 'HTML Volledig Rapport',
      description: 'Professioneel rapport met KPI's, fase-voortgang, kosten en TRA samenvatting. Druk af als PDF via Ctrl+P.',
      format: 'HTML → PDF',
      color: 'from-blue-500 to-blue-700',
      action: exportHTMLReport,
      info: ['Dashboard KPI's', 'Scope items tabel', 'Kosten overzicht', 'Kritieke risico's', 'Print-klaar opmaak'],
    },
    {
      id: 'tra',
      icon: '🛡️',
      title: 'TRA Rapport CSV',
      description: 'Export van alle TRA-risico's met initieel en residueel risico, beheersmaatregelen en goedkeuringsstatus.',
      format: 'CSV',
      color: 'from-orange-500 to-red-600',
      action: exportTRAReport,
      info: [`${stats.risks} risico's totaal`, `${stats.criticalRisks} kritiek`, 'Kans/ernst scores', 'Initieel + residueel'],
    },
    {
      id: 'kosten',
      icon: '💰',
      title: 'Kostenrapport CSV',
      description: 'Gedetailleerde kostenexport per scope item en cost rule, inclusief contingency totalen.',
      format: 'CSV',
      color: 'from-amber-500 to-yellow-600',
      action: exportCostReport,
      info: [`${stats.itemsWithCost} items met kosten`, `€${(stats.totalCost/1000).toFixed(0)}k projecttotaal`, 'Per cost rule uitgesplitst'],
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Export Hub</h2>
        <p className="text-slate-500 text-sm mt-1">Exporteer projectdata naar verschillende formaten</p>
      </div>

      {/* Export cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {exports.map(exp => (
          <div key={exp.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className={`bg-gradient-to-r ${exp.color} p-4 flex items-center gap-3`}>
              <span className="text-3xl">{exp.icon}</span>
              <div>
                <h3 className="font-bold text-white">{exp.title}</h3>
                <span className="text-xs text-white/80 bg-white/20 px-2 py-0.5 rounded-full">{exp.format}</span>
              </div>
            </div>
            <div className="p-4">
              <p className="text-sm text-slate-600 mb-3">{exp.description}</p>
              <ul className="space-y-1 mb-4">
                {exp.info.map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-xs text-slate-500">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <button
                onClick={exp.action}
                disabled={isExporting}
                className={`w-full flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r ${exp.color} text-white rounded-lg font-medium text-sm hover:opacity-90 transition-opacity disabled:opacity-50`}
              >
                <Download className="w-4 h-4" />
                {isExporting ? 'Bezig...' : `Download ${exp.format}`}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* P6 XER export - existing component embedded */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-orange-600 to-red-700 p-4 flex items-center gap-3">
          <span className="text-3xl">🏗️</span>
          <div>
            <h3 className="font-bold text-white">Primavera P6 XER Export</h3>
            <span className="text-xs text-white/80 bg-white/20 px-2 py-0.5 rounded-full">XER</span>
          </div>
        </div>
        <div className="p-4">
          <P6ExportTab
            project={project}
            scopeItems={scopeItems}
            resources={resources}
            activityCodes={[]}
          />
        </div>
      </div>

      {/* Tips */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
        <h3 className="font-semibold text-blue-900 mb-3">Tips voor exporteren</h3>
        <div className="grid grid-cols-2 gap-3 text-sm text-blue-800">
          <div className="flex gap-2"><span>📊</span><span><strong>CSV naar Excel:</strong> Open het .csv bestand in Excel en gebruik Data → Tekst naar kolommen voor correcte opmaak.</span></div>
          <div className="flex gap-2"><span>📄</span><span><strong>HTML naar PDF:</strong> Open het rapport in Chrome, druk Ctrl+P en kies "Opslaan als PDF" met A4 formaat.</span></div>
          <div className="flex gap-2"><span>🏗️</span><span><strong>P6 XER:</strong> Importeer via File → Import → XER in Primavera P6 Professional.</span></div>
          <div className="flex gap-2"><span>🛡️</span><span><strong>TRA CSV:</strong> Gebruik voor veiligheidsrapportages en toolbox-meetings.</span></div>
        </div>
      </div>
    </div>
  );
};


// ===== FASE 3: DISCIPLINE MANAGEMENT =====
const DISCIPLINES = [
  { id: 'Mechanical',       label: 'Mechanical',        color: '#3b82f6', bg: 'bg-blue-500',    light: 'bg-blue-50',    text: 'text-blue-700',    border: 'border-blue-200' },
  { id: 'Piping',           label: 'Piping',            color: '#8b5cf6', bg: 'bg-violet-500',  light: 'bg-violet-50',  text: 'text-violet-700',  border: 'border-violet-200' },
  { id: 'Electrical',       label: 'Electrical',        color: '#f59e0b', bg: 'bg-amber-500',   light: 'bg-amber-50',   text: 'text-amber-700',   border: 'border-amber-200' },
  { id: 'Instrumentation',  label: 'Instrumentation',   color: '#10b981', bg: 'bg-emerald-500', light: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  { id: 'Civil',            label: 'Civil',             color: '#f97316', bg: 'bg-orange-500',  light: 'bg-orange-50',  text: 'text-orange-700',  border: 'border-orange-200' },
  { id: 'Scaffold',         label: 'Scaffold',          color: '#64748b', bg: 'bg-slate-500',   light: 'bg-slate-50',   text: 'text-slate-700',   border: 'border-slate-200' },
  { id: 'Inspection',       label: 'Inspection',        color: '#06b6d4', bg: 'bg-cyan-500',    light: 'bg-cyan-50',    text: 'text-cyan-700',    border: 'border-cyan-200' },
];

const DisciplineManagement = ({ scopeItems, onUpdate }) => {
  const [selectedDiscipline, setSelectedDiscipline] = useState('all');
  const [viewMode, setViewMode] = useState('cards'); // cards | table | matrix
  const [editingItem, setEditingItem] = useState(null);

  // Stats per discipline
  const disciplineStats = useMemo(() => {
    return DISCIPLINES.map(disc => {
      const items = scopeItems.filter(i => i.discipline === disc.id);
      const allActs = items.flatMap(i => i.plannedActivities || []);
      const done = allActs.filter(a => a.executionStatus === 'Completed').length;
      const cost = items.reduce((s, i) => {
        const sub = (i.costRules || []).reduce((ss, r) => ss + (r.totaal || 0), 0);
        return s + sub * (1 + ((i.contingency?.percentage || 0) / 100));
      }, 0);
      const risks = allActs.flatMap(a => a.tra?.risks || []);
      const critRisks = risks.filter(r => (r.probability||1)*(r.severity||1) >= 15).length;
      return {
        ...disc,
        items: items.length,
        inScope: items.filter(i => i.status === 'In Scope').length,
        activities: allActs.length,
        completed: done,
        progress: allActs.length > 0 ? Math.round((done / allActs.length) * 100) : 0,
        cost,
        risks: risks.length,
        critRisks,
        highPriority: items.filter(i => i.priority === 'High').length,
        totalDuration: allActs.reduce((s, a) => s + (a.duration || 0), 0),
      };
    });
  }, [scopeItems]);

  const unassigned = useMemo(() =>
    scopeItems.filter(i => !i.discipline || !DISCIPLINES.find(d => d.id === i.discipline)),
    [scopeItems]
  );

  const filteredItems = useMemo(() => {
    if (selectedDiscipline === 'all') return scopeItems;
    if (selectedDiscipline === 'unassigned') return unassigned;
    return scopeItems.filter(i => i.discipline === selectedDiscipline);
  }, [scopeItems, selectedDiscipline, unassigned]);

  const totalItems = scopeItems.length;
  const totalCost = disciplineStats.reduce((s, d) => s + d.cost, 0);

  const assignDiscipline = (itemId, discipline) => {
    const item = scopeItems.find(i => i.id === itemId);
    if (item) onUpdate({ ...item, discipline });
  };

  const disc = (id) => DISCIPLINES.find(d => d.id === id);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Discipline Management</h2>
          <p className="text-slate-500 text-sm mt-1">
            {totalItems} scope items · {DISCIPLINES.filter(d => disciplineStats.find(s => s.id === d.id && s.items > 0)).length} actieve disciplines
            {unassigned.length > 0 && <span className="ml-2 text-orange-500 font-medium">· {unassigned.length} niet toegewezen</span>}
          </p>
        </div>
        <div className="flex rounded-lg border border-slate-200 overflow-hidden">
          {[{ id: 'cards', label: 'Kaarten' }, { id: 'table', label: 'Tabel' }, { id: 'matrix', label: 'Matrix' }].map(v => (
            <button key={v.id} onClick={() => setViewMode(v.id)}
              className={`px-3 py-2 text-sm font-medium transition-colors ${viewMode === v.id ? 'bg-blue-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'}`}>
              {v.label}
            </button>
          ))}
        </div>
      </div>

      {/* Discipline filter tabs */}
      <div className="flex gap-2 flex-wrap">
        <button onClick={() => setSelectedDiscipline('all')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedDiscipline === 'all' ? 'bg-slate-800 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
          Alle ({totalItems})
        </button>
        {disciplineStats.filter(d => d.items > 0).map(d => (
          <button key={d.id} onClick={() => setSelectedDiscipline(d.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${selectedDiscipline === d.id ? 'text-white' : `bg-white border ${d.border} ${d.text} hover:${d.light}`}`}
            style={selectedDiscipline === d.id ? { backgroundColor: d.color } : {}}>
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }} />
            {d.label} ({d.items})
          </button>
        ))}
        {unassigned.length > 0 && (
          <button onClick={() => setSelectedDiscipline('unassigned')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${selectedDiscipline === 'unassigned' ? 'bg-orange-600 text-white' : 'bg-white border border-orange-200 text-orange-700 hover:bg-orange-50'}`}>
            ⚠️ Niet toegewezen ({unassigned.length})
          </button>
        )}
      </div>

      {/* CARDS VIEW */}
      {viewMode === 'cards' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
          {disciplineStats.filter(d => selectedDiscipline === 'all' ? d.items > 0 : d.id === selectedDiscipline).map(d => (
            <div key={d.id} className={`bg-white rounded-xl border-2 ${d.border} shadow-sm overflow-hidden`}>
              {/* Card header */}
              <div className="p-4 flex items-center gap-3" style={{ background: `linear-gradient(135deg, ${d.color}15, ${d.color}05)` }}>
                <div className={`${d.bg} p-2.5 rounded-lg`}>
                  <span className="text-white text-lg font-bold">{d.label[0]}</span>
                </div>
                <div>
                  <h3 className={`font-bold ${d.text}`}>{d.label}</h3>
                  <p className="text-xs text-slate-500">{d.inScope} in scope · {d.items} totaal</p>
                </div>
                {d.highPriority > 0 && (
                  <span className="ml-auto text-xs font-bold bg-red-100 text-red-700 px-2 py-0.5 rounded-full">{d.highPriority} High prio</span>
                )}
              </div>
              {/* Stats */}
              <div className="p-4 space-y-3">
                {/* Progress */}
                <div>
                  <div className="flex justify-between text-xs text-slate-500 mb-1">
                    <span>Activiteiten voortgang</span>
                    <span className="font-bold" style={{ color: d.color }}>{d.progress}%</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{ width: `${d.progress}%`, backgroundColor: d.color }} />
                  </div>
                  <p className="text-xs text-slate-400 mt-1">{d.completed}/{d.activities} activiteiten · {d.totalDuration}d totaal</p>
                </div>
                {/* Cost + Risks */}
                <div className="grid grid-cols-2 gap-3">
                  <div className={`${d.light} rounded-lg p-3`}>
                    <p className="text-xs text-slate-500 mb-0.5">Kosten</p>
                    <p className={`text-lg font-bold ${d.text}`}>{d.cost > 0 ? `€${(d.cost/1000).toFixed(0)}k` : '—'}</p>
                  </div>
                  <div className={`${d.critRisks > 0 ? 'bg-red-50' : d.light} rounded-lg p-3`}>
                    <p className="text-xs text-slate-500 mb-0.5">Risico's</p>
                    <p className={`text-lg font-bold ${d.critRisks > 0 ? 'text-red-600' : d.text}`}>
                      {d.risks > 0 ? d.risks : '—'}
                      {d.critRisks > 0 && <span className="text-xs font-normal text-red-500 ml-1">({d.critRisks} krit.)</span>}
                    </p>
                  </div>
                </div>
                {/* Cost bar (relative to total) */}
                {totalCost > 0 && d.cost > 0 && (
                  <div>
                    <div className="flex justify-between text-xs text-slate-400 mb-0.5">
                      <span>Aandeel projectkosten</span>
                      <span>{Math.round((d.cost/totalCost)*100)}%</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${Math.round((d.cost/totalCost)*100)}%`, backgroundColor: d.color }} />
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
          {selectedDiscipline === 'unassigned' && unassigned.map(item => (
            <div key={item.id} className="bg-white rounded-xl border-2 border-orange-200 shadow-sm p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-orange-400 mt-0.5 shrink-0" />
                <div className="flex-1">
                  <span className="font-mono text-sm font-bold text-blue-600">{item.tagNumber}</span>
                  <p className="text-sm text-slate-600">{item.description}</p>
                </div>
              </div>
              <div className="mt-3">
                <label className="block text-xs font-medium text-slate-500 mb-1">Wijs discipline toe:</label>
                <select onChange={(e) => e.target.value && assignDiscipline(item.id, e.target.value)}
                  defaultValue=""
                  className="w-full px-3 py-2 border border-orange-200 rounded-lg text-sm bg-white">
                  <option value="">-- Selecteer discipline --</option>
                  {DISCIPLINES.map(d => <option key={d.id} value={d.id}>{d.label}</option>)}
                </select>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TABLE VIEW */}
      {viewMode === 'table' && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Tag</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Omschrijving</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Discipline</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Prio</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Activiteiten</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Voortgang</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Kosten</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Discipline wijzigen</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredItems.map(item => {
                const acts = item.plannedActivities || [];
                const done = acts.filter(a => a.executionStatus === 'Completed').length;
                const pct = acts.length > 0 ? Math.round((done/acts.length)*100) : 0;
                const sub = (item.costRules||[]).reduce((s,r)=>s+(r.totaal||0),0);
                const tot = sub*(1+((item.contingency?.percentage||0)/100));
                const d = disc(item.discipline);
                return (
                  <tr key={item.id} className="hover:bg-slate-50">
                    <td className="px-4 py-2.5 font-mono text-xs font-bold text-blue-600">{item.tagNumber}</td>
                    <td className="px-4 py-2.5 text-slate-700 max-w-xs truncate">{item.description}</td>
                    <td className="px-4 py-2.5 text-center">
                      {d ? (
                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold text-white`} style={{ backgroundColor: d.color }}>{d.label}</span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-orange-100 text-orange-700">Niet toegewezen</span>
                      )}
                    </td>
                    <td className="px-4 py-2.5 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${item.priority === 'High' ? 'bg-red-100 text-red-700' : item.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>{item.priority}</span>
                    </td>
                    <td className="px-4 py-2.5 text-center text-slate-500 text-xs">{done}/{acts.length}</td>
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full rounded-full bg-emerald-500" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="text-xs text-slate-400 w-8">{pct}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-2.5 text-right font-semibold text-emerald-700 text-xs">{tot > 0 ? `€${tot.toFixed(0)}` : '—'}</td>
                    <td className="px-4 py-2.5 text-center">
                      <select value={item.discipline || ''}
                        onChange={(e) => assignDiscipline(item.id, e.target.value)}
                        className="px-2 py-1 border border-slate-200 rounded text-xs bg-white">
                        <option value="">—</option>
                        {DISCIPLINES.map(d => <option key={d.id} value={d.id}>{d.label}</option>)}
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* MATRIX VIEW - disciplines vs phases */}
      {viewMode === 'matrix' && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-4 border-b border-slate-100">
            <h3 className="font-semibold text-slate-900">Discipline × Fase Matrix</h3>
            <p className="text-xs text-slate-500 mt-0.5">Aantal activiteiten per discipline per fase</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Discipline</th>
                  {['PRE-TA','UITBEDRIJF','TA','INBEDRIJF','POST-TA'].map(phase => (
                    <th key={phase} className="text-center px-3 py-3 text-xs font-semibold text-slate-500 uppercase">{phase}</th>
                  ))}
                  <th className="text-center px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Totaal</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Kosten</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {disciplineStats.filter(d => d.items > 0).map(d => {
                  const discItems = scopeItems.filter(i => i.discipline === d.id);
                  const discActs = discItems.flatMap(i => i.plannedActivities || []);
                  const phaseBreakdown = ['PRE-TA','UITBEDRIJF','TA','INBEDRIJF','POST-TA'].map(phase => {
                    const phaseActs = discActs.filter(a => a.phase === phase);
                    const done = phaseActs.filter(a => a.executionStatus === 'Completed').length;
                    return { count: phaseActs.length, done };
                  });
                  return (
                    <tr key={d.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-2">
                          <span className="w-3 h-3 rounded" style={{ backgroundColor: d.color }} />
                          <span className={`font-semibold ${d.text}`}>{d.label}</span>
                          <span className="text-xs text-slate-400">({d.items} items)</span>
                        </span>
                      </td>
                      {phaseBreakdown.map(({ count, done }, i) => (
                        <td key={i} className="px-3 py-3 text-center">
                          {count > 0 ? (
                            <div>
                              <span className="text-sm font-bold" style={{ color: count === done && done > 0 ? '#22c55e' : '#1e293b' }}>{count}</span>
                              {done > 0 && <span className="text-xs text-slate-400 ml-1">({done}✓)</span>}
                            </div>
                          ) : <span className="text-slate-200">—</span>}
                        </td>
                      ))}
                      <td className="px-4 py-3 text-center">
                        <span className="font-bold text-slate-900">{d.activities}</span>
                        <span className="text-xs text-emerald-600 ml-1">{d.progress}%</span>
                      </td>
                      <td className="px-4 py-3 text-right font-semibold text-emerald-700 text-xs">{d.cost > 0 ? `€${(d.cost/1000).toFixed(0)}k` : '—'}</td>
                    </tr>
                  );
                })}
                {/* Unassigned row */}
                {unassigned.length > 0 && (
                  <tr className="bg-orange-50">
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-2 text-orange-700 font-semibold">
                        <AlertTriangle className="w-3 h-3" /> Niet toegewezen
                      </span>
                    </td>
                    <td colSpan="5" className="px-3 py-3 text-center text-orange-600 text-sm">{unassigned.length} items zonder discipline</td>
                    <td className="px-4 py-3 text-center font-bold text-orange-700">{unassigned.length}</td>
                    <td></td>
                  </tr>
                )}
                {/* Totals row */}
                <tr className="bg-slate-50 border-t-2 border-slate-200 font-bold">
                  <td className="px-4 py-3 text-slate-700">TOTAAL</td>
                  {['PRE-TA','UITBEDRIJF','TA','INBEDRIJF','POST-TA'].map(phase => {
                    const count = scopeItems.flatMap(i => i.plannedActivities || []).filter(a => a.phase === phase).length;
                    return <td key={phase} className="px-3 py-3 text-center text-slate-700">{count}</td>;
                  })}
                  <td className="px-4 py-3 text-center text-slate-700">{disciplineStats.reduce((s,d)=>s+d.activities,0)}</td>
                  <td className="px-4 py-3 text-right text-emerald-700">€{(totalCost/1000).toFixed(0)}k</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};


// ===== COSTING PAGE =====
const CostingPage = ({ scopeItems, onUpdate }) => {
  const [activeView, setActiveView] = useState('overview');
  const [editingCell, setEditingCell] = useState(null);

  const allCostRules = useMemo(() =>
    scopeItems.flatMap(item =>
      (item.costRules || []).map(r => ({ ...r, _scopeTag: item.tagNumber, _scopeId: item.id, _contingencyPct: item.contingency?.percentage || 0 }))
    ), [scopeItems]);

  const totalsByCategory = useMemo(() => {
    const cats = {};
    allCostRules.forEach(r => {
      const cat = r.category || 'Other';
      if (!cats[cat]) cats[cat] = { subtotal: 0, count: 0 };
      cats[cat].subtotal += r.totaal || 0;
      cats[cat].count += 1;
    });
    return Object.entries(cats).map(([cat, v]) => ({ cat, ...v })).sort((a,b) => b.subtotal - a.subtotal);
  }, [allCostRules]);

  const totalsByDiscipline = useMemo(() =>
    DISCIPLINES.map(disc => {
      const items = scopeItems.filter(i => i.discipline === disc.id);
      const subtotal = items.reduce((s, i) => s + (i.costRules||[]).reduce((ss,r)=>ss+(r.totaal||0),0), 0);
      const contingency = items.reduce((s,i) => {
        const sub = (i.costRules||[]).reduce((ss,r)=>ss+(r.totaal||0),0);
        return s + sub*((i.contingency?.percentage||0)/100);
      }, 0);
      return { ...disc, subtotal, contingency, total: subtotal + contingency };
    }).filter(d => d.total > 0), [scopeItems]);

  const projectTotals = useMemo(() => {
    const subtotal = scopeItems.reduce((s,i) => s + (i.costRules||[]).reduce((ss,r)=>ss+(r.totaal||0),0), 0);
    const contingency = scopeItems.reduce((s,i) => {
      const sub = (i.costRules||[]).reduce((ss,r)=>ss+(r.totaal||0),0);
      return s + sub*((i.contingency?.percentage||0)/100);
    }, 0);
    return { subtotal, contingency, total: subtotal+contingency };
  }, [scopeItems]);

  const catColors = { 'Labor': '#3b82f6', 'Materials': '#22c55e', 'Other': '#64748b', 'Equipment': '#f59e0b', 'Subcontract': '#8b5cf6' };

  const updateCostRule = (scopeId, ruleId, field, value) => {
    const item = scopeItems.find(i => i.id === scopeId);
    if (!item) return;
    const updated = { ...item, costRules: item.costRules.map(r => {
      if (r.id !== ruleId) return r;
      const newR = { ...r, [field]: value };
      newR.totaal = (newR.aantal||0)*(newR.tarief||0)*(1+(newR.toeslag||0)/100)+(newR.vastePrijs||0);
      return newR;
    })};
    onUpdate(updated);
  };

  const EditCell = ({ val, scopeId, ruleId, field, type='number' }) => {
    const key = `${ruleId}-${field}`;
    const [v, setV] = useState(val);
    if (editingCell === key) return (
      <input type={type} value={v} autoFocus className="w-20 px-1 py-0.5 border border-blue-400 rounded text-xs text-right"
        onChange={e => setV(type==='number' ? parseFloat(e.target.value)||0 : e.target.value)}
        onBlur={() => { updateCostRule(scopeId, ruleId, field, type==='number' ? parseFloat(v)||0 : v); setEditingCell(null); }}
        onKeyDown={e => { if(e.key==='Enter') { updateCostRule(scopeId, ruleId, field, type==='number' ? parseFloat(v)||0 : v); setEditingCell(null); }}} />
    );
    return <span onClick={() => setEditingCell(key)} className="cursor-pointer hover:text-blue-600 hover:underline">{val}</span>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Kostenbeheer</h2>
          <p className="text-slate-500 text-sm mt-1">Project-niveau kostenoverzicht en -beheer</p>
        </div>
        <div className="flex rounded-lg border border-slate-200 overflow-hidden">
          {[{id:'overview',label:'Overzicht'},{id:'detail',label:'Detail'},{id:'discipline',label:'Discipline'}].map(v => (
            <button key={v.id} onClick={() => setActiveView(v.id)}
              className={`px-4 py-2 text-sm font-medium transition-colors ${activeView===v.id?'bg-blue-600 text-white':'bg-white text-slate-600 hover:bg-slate-50'}`}>
              {v.label}
            </button>
          ))}
        </div>
      </div>

      {/* Totals banner */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Subtotaal', value: projectTotals.subtotal, color: 'text-slate-900', bg: 'bg-slate-50', border: 'border-slate-200' },
          { label: 'Contingency', value: projectTotals.contingency, color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200' },
          { label: 'PROJECTTOTAAL', value: projectTotals.total, color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-300' },
        ].map(({label,value,color,bg,border}) => (
          <div key={label} className={`${bg} border ${border} rounded-xl p-5`}>
            <p className="text-xs font-semibold text-slate-500 uppercase">{label}</p>
            <p className={`text-3xl font-bold mt-1 ${color}`}>€{(value/1000).toFixed(1)}k</p>
            <p className="text-xs text-slate-400 mt-0.5">€{value.toFixed(0)}</p>
          </div>
        ))}
      </div>

      {/* OVERVIEW */}
      {activeView === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Category breakdown */}
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-900 mb-4">Kosten per Categorie</h3>
            <div className="space-y-3">
              {totalsByCategory.map(({cat, subtotal, count}) => (
                <div key={cat} className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full shrink-0" style={{backgroundColor: catColors[cat]||'#94a3b8'}} />
                  <span className="text-sm text-slate-600 w-28 shrink-0">{cat}</span>
                  <div className="flex-1 h-5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full flex items-center px-2"
                      style={{width:`${projectTotals.subtotal>0?Math.round((subtotal/projectTotals.subtotal)*100):0}%`, backgroundColor: catColors[cat]||'#94a3b8'}}>
                      {projectTotals.subtotal>0&&Math.round((subtotal/projectTotals.subtotal)*100)>15&&
                        <span className="text-white text-xs font-medium">{Math.round((subtotal/projectTotals.subtotal)*100)}%</span>}
                    </div>
                  </div>
                  <span className="text-xs text-slate-400 w-6">{count}×</span>
                  <span className="text-sm font-bold text-slate-900 w-24 text-right">€{subtotal.toFixed(0)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Top 8 scope items by cost */}
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-900 mb-4">Top Scope Items (kosten)</h3>
            <div className="space-y-2">
              {scopeItems
                .filter(i => (i.costRules||[]).length > 0)
                .map(i => {
                  const sub = (i.costRules||[]).reduce((s,r)=>s+(r.totaal||0),0);
                  const tot = sub*(1+((i.contingency?.percentage||0)/100));
                  return {...i, tot};
                })
                .sort((a,b)=>b.tot-a.tot).slice(0,8)
                .map(item => (
                  <div key={item.id} className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-blue-600 w-20 shrink-0">{item.tagNumber}</span>
                    <div className="flex-1 h-4 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-400 rounded-full"
                        style={{width:`${projectTotals.total>0?Math.round((item.tot/projectTotals.total)*100):0}%`}} />
                    </div>
                    <span className="text-xs font-bold text-emerald-700 w-20 text-right">€{item.tot.toFixed(0)}</span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* DETAIL */}
      {activeView === 'detail' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-4 py-3 bg-slate-50 border-b border-slate-100 text-xs text-slate-500">
            Klik op een waarde om te bewerken
          </div>
          <div className="overflow-x-auto max-h-[60vh] overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-white border-b border-slate-200 z-10">
                <tr>
                  {['Scope','Type','Omschrijving','Aantal','Eenheid','Tarief','Toeslag','Totaal','Cat.'].map(h => (
                    <th key={h} className="px-3 py-2.5 text-left text-xs font-semibold text-slate-500 uppercase whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {scopeItems.filter(i=>(i.costRules||[]).length>0).flatMap(item =>
                  item.costRules.map(rule => (
                    <tr key={rule.id} className="hover:bg-slate-50">
                      <td className="px-3 py-2 font-mono text-xs font-bold text-blue-600 whitespace-nowrap">{item.tagNumber}</td>
                      <td className="px-3 py-2">
                        <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${rule.type==='resource'?'bg-blue-100 text-blue-700':rule.type==='material'?'bg-green-100 text-green-700':'bg-slate-100 text-slate-600'}`}>{rule.type}</span>
                      </td>
                      <td className="px-3 py-2 text-slate-700 max-w-xs truncate text-xs">{rule.description}</td>
                      <td className="px-3 py-2 text-right font-mono text-xs">
                        <EditCell val={rule.aantal} scopeId={item.id} ruleId={rule.id} field="aantal" />
                      </td>
                      <td className="px-3 py-2 text-xs text-slate-500">{rule.eenheid}</td>
                      <td className="px-3 py-2 text-right font-mono text-xs">
                        €<EditCell val={rule.tarief?.toFixed(2)} scopeId={item.id} ruleId={rule.id} field="tarief" />
                      </td>
                      <td className="px-3 py-2 text-right text-xs">
                        <EditCell val={rule.toeslag||0} scopeId={item.id} ruleId={rule.id} field="toeslag" />%
                      </td>
                      <td className="px-3 py-2 text-right font-bold text-emerald-700 text-xs">€{(rule.totaal||0).toFixed(0)}</td>
                      <td className="px-3 py-2 text-xs text-slate-400">{rule.category}</td>
                    </tr>
                  ))
                )}
              </tbody>
              <tfoot className="border-t-2 border-slate-300 bg-slate-50">
                <tr>
                  <td colSpan="7" className="px-3 py-2.5 text-right font-bold text-slate-700 text-sm">PROJECTTOTAAL (incl. contingency):</td>
                  <td className="px-3 py-2.5 text-right font-bold text-emerald-700">€{projectTotals.total.toFixed(0)}</td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}

      {/* DISCIPLINE */}
      {activeView === 'discipline' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Discipline</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500 uppercase">Subtotaal</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500 uppercase">Contingency</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500 uppercase">Totaal</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Aandeel</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {totalsByDiscipline.map(d => (
                  <tr key={d.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{backgroundColor:d.color}} />
                      <span className="font-semibold text-slate-800">{d.label}</span>
                    </td>
                    <td className="px-4 py-3 text-right text-slate-600">€{d.subtotal.toFixed(0)}</td>
                    <td className="px-4 py-3 text-right text-amber-600">€{d.contingency.toFixed(0)}</td>
                    <td className="px-4 py-3 text-right font-bold text-emerald-700">€{d.total.toFixed(0)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full rounded-full" style={{width:`${projectTotals.total>0?Math.round((d.total/projectTotals.total)*100):0}%`,backgroundColor:d.color}} />
                        </div>
                        <span className="text-xs text-slate-500 w-8">{projectTotals.total>0?Math.round((d.total/projectTotals.total)*100):0}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="border-t-2 border-slate-300 bg-slate-50">
                <tr>
                  <td className="px-4 py-2.5 font-bold text-slate-700">TOTAAL</td>
                  <td className="px-4 py-2.5 text-right font-bold">€{projectTotals.subtotal.toFixed(0)}</td>
                  <td className="px-4 py-2.5 text-right font-bold text-amber-600">€{projectTotals.contingency.toFixed(0)}</td>
                  <td className="px-4 py-2.5 text-right font-bold text-emerald-700">€{projectTotals.total.toFixed(0)}</td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

// ===== EXECUTION PAGE =====
const ExecutionPage = ({ scopeItems, setScopeItems }) => {
  const toast = useToast();
  const [search, setSearch] = useState('');
  const [filterPhase, setFilterPhase] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [expandedItem, setExpandedItem] = useState(null);

  const phases = ['PRE-TA', 'UITBEDRIJF', 'TA', 'INBEDRIJF', 'POST-TA'];
  const statuses = ['Planned', 'In Progress', 'On Hold', 'Completed'];
  const statusColors = { 'Planned':'bg-slate-100 text-slate-700', 'In Progress':'bg-blue-100 text-blue-700', 'On Hold':'bg-orange-100 text-orange-700', 'Completed':'bg-green-100 text-green-700' };
  const phaseColors = { 'PRE-TA':'bg-purple-500','UITBEDRIJF':'bg-orange-500','TA':'bg-blue-500','INBEDRIJF':'bg-green-500','POST-TA':'bg-slate-500' };

  const allActivities = useMemo(() =>
    scopeItems.flatMap(item =>
      (item.plannedActivities||[]).map(act => ({...act, _scopeTag: item.tagNumber, _scopeDesc: item.description, _scopeId: item.id}))
    ), [scopeItems]);

  const filtered = useMemo(() => allActivities.filter(a => {
    const matchSearch = !search || a.activityId?.toLowerCase().includes(search.toLowerCase()) || a.overrideDescription?.toLowerCase().includes(search.toLowerCase()) || a._scopeTag?.toLowerCase().includes(search.toLowerCase());
    const matchPhase = filterPhase === 'all' || a.phase === filterPhase;
    const matchStatus = filterStatus === 'all' || a.executionStatus === filterStatus;
    return matchSearch && matchPhase && matchStatus;
  }), [allActivities, search, filterPhase, filterStatus]);

  const updateActivity = (scopeId, actId, updates) => {
    setScopeItems(prev => prev.map(item => {
      if (item.id !== scopeId) return item;
      return { ...item, plannedActivities: item.plannedActivities.map(a => a.id === actId ? {...a, ...updates} : a) };
    }));
  };

  const setStatus = (a, status) => {
    const progress = status === 'Completed' ? 100 : status === 'Planned' ? 0 : a.progress || 0;
    updateActivity(a._scopeId, a.id, { executionStatus: status, progress });
    toast.success(`${a.activityId} → ${status}`);
  };

  const stats = useMemo(() => ({
    total: allActivities.length,
    planned: allActivities.filter(a=>a.executionStatus==='Planned').length,
    inProgress: allActivities.filter(a=>a.executionStatus==='In Progress').length,
    onHold: allActivities.filter(a=>a.executionStatus==='On Hold').length,
    completed: allActivities.filter(a=>a.executionStatus==='Completed').length,
    overallPct: allActivities.length > 0 ? Math.round((allActivities.filter(a=>a.executionStatus==='Completed').length / allActivities.length) * 100) : 0,
  }), [allActivities]);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Uitvoering</h2>
          <p className="text-slate-500 text-sm mt-1">{stats.completed}/{stats.total} activiteiten afgerond · {stats.overallPct}% compleet</p>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-4 gap-4">
        {[
          {label:'Gepland',value:stats.planned,color:'text-slate-700',bg:'bg-slate-50',border:'border-slate-200'},
          {label:'In Uitvoering',value:stats.inProgress,color:'text-blue-700',bg:'bg-blue-50',border:'border-blue-200'},
          {label:'On Hold',value:stats.onHold,color:'text-orange-700',bg:'bg-orange-50',border:'border-orange-200'},
          {label:'Afgerond',value:stats.completed,color:'text-green-700',bg:'bg-green-50',border:'border-green-200'},
        ].map(({label,value,color,bg,border}) => (
          <div key={label} className={`${bg} border ${border} rounded-xl p-4`}>
            <p className="text-xs text-slate-500 font-medium">{label}</p>
            <p className={`text-3xl font-bold mt-1 ${color}`}>{value}</p>
            <p className="text-xs text-slate-400 mt-0.5">{stats.total > 0 ? Math.round((value/stats.total)*100) : 0}%</p>
          </div>
        ))}
      </div>

      {/* Overall progress bar */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-slate-700">Totale voortgang</span>
          <span className="text-2xl font-bold text-blue-600">{stats.overallPct}%</span>
        </div>
        <div className="h-4 bg-slate-100 rounded-full overflow-hidden flex">
          <div className="h-full bg-green-500 transition-all" style={{width:`${stats.total>0?Math.round((stats.completed/stats.total)*100):0}%`}} />
          <div className="h-full bg-blue-400 transition-all" style={{width:`${stats.total>0?Math.round((stats.inProgress/stats.total)*100):0}%`}} />
          <div className="h-full bg-orange-300 transition-all" style={{width:`${stats.total>0?Math.round((stats.onHold/stats.total)*100):0}%`}} />
        </div>
        <div className="flex gap-4 mt-2 text-xs text-slate-500">
          {[{c:'bg-green-500',l:'Afgerond'},{c:'bg-blue-400',l:'In uitvoering'},{c:'bg-orange-300',l:'On hold'},{c:'bg-slate-200',l:'Gepland'}].map(({c,l})=>(
            <span key={l} className="flex items-center gap-1"><span className={`w-2.5 h-2.5 rounded-full ${c}`}/>{l}</span>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap bg-white rounded-xl p-3 border border-slate-200 shadow-sm">
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Zoek activiteit, tag..."
          className="px-3 py-2 border border-slate-200 rounded-lg text-sm flex-1 min-w-48" />
        <select value={filterPhase} onChange={e=>setFilterPhase(e.target.value)}
          className="px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white">
          <option value="all">Alle fasen</option>
          {phases.map(p=><option key={p} value={p}>{p}</option>)}
        </select>
        <select value={filterStatus} onChange={e=>setFilterStatus(e.target.value)}
          className="px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white">
          <option value="all">Alle statussen</option>
          {statuses.map(s=><option key={s} value={s}>{s}</option>)}
        </select>
        <span className="text-xs text-slate-400">{filtered.length} activiteiten</span>
      </div>

      {/* Activity list */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-y-auto max-h-[55vh]">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-slate-50 border-b border-slate-200 z-10">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Activiteit</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Scope</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-slate-500 uppercase">Fase</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-slate-500 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase w-48">Voortgang</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-slate-500 uppercase">Acties</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map(act => (
                <tr key={act.id} className={`hover:bg-slate-50 ${act.executionStatus==='Completed'?'opacity-60':''}`}>
                  <td className="px-4 py-3">
                    <div className="font-mono text-xs font-bold text-blue-600">{act.activityId}</div>
                    <div className="text-xs text-slate-600 truncate max-w-52">{act.overrideDescription}</div>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs font-semibold text-slate-600">{act._scopeTag}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold text-white ${phaseColors[act.phase]||'bg-slate-400'}`}>{act.phase}</span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <select value={act.executionStatus||'Planned'}
                      onChange={e=>setStatus(act, e.target.value)}
                      className={`text-xs font-semibold px-2 py-1 rounded-full border-0 cursor-pointer ${statusColors[act.executionStatus]||statusColors['Planned']}`}>
                      {statuses.map(s=><option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <input type="range" min="0" max="100" step="5"
                        value={act.progress||0}
                        onChange={e=>updateActivity(act._scopeId, act.id, {progress:parseInt(e.target.value)})}
                        className="flex-1 h-1.5 accent-blue-600" />
                      <span className="text-xs font-semibold w-8 text-slate-600">{act.progress||0}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-1">
                      {act.executionStatus !== 'In Progress' && (
                        <button onClick={()=>setStatus(act,'In Progress')}
                          className="px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700">Start</button>
                      )}
                      {act.executionStatus !== 'Completed' && (
                        <button onClick={()=>setStatus(act,'Completed')}
                          className="px-2 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700">✓</button>
                      )}
                      {act.executionStatus === 'Completed' && (
                        <button onClick={()=>setStatus(act,'In Progress')}
                          className="px-2 py-1 bg-slate-400 text-white text-xs rounded hover:bg-slate-500">Heropen</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// ===== WALLBOARD PAGE =====
const WallboardPage = ({ scopeItems, workflowStatuses }) => {
  const [now, setNow] = useState(new Date());
  const [filterPhase, setFilterPhase] = useState('TA');

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(t);
  }, []);

  const phases = ['PRE-TA','UITBEDRIJF','TA','INBEDRIJF','POST-TA'];
  const phaseColors = {'PRE-TA':'#8b5cf6','UITBEDRIJF':'#f97316','TA':'#3b82f6','INBEDRIJF':'#22c55e','POST-TA':'#64748b'};

  const allActivities = useMemo(() =>
    scopeItems.flatMap(item =>
      (item.plannedActivities||[]).map(a => ({...a, _scopeTag: item.tagNumber, _scopeDesc: item.description}))
    ), [scopeItems]);

  const inProgress = allActivities.filter(a => a.executionStatus === 'In Progress' && (filterPhase==='all'||a.phase===filterPhase));
  const holdPoints = allActivities.filter(a => a.holdPoint && a.executionStatus !== 'Completed' && (filterPhase==='all'||a.phase===filterPhase));
  const recentCompleted = allActivities.filter(a => a.executionStatus === 'Completed' && (filterPhase==='all'||a.phase===filterPhase)).slice(-6);

  const phaseSummary = phases.map(phase => {
    const acts = allActivities.filter(a => a.phase === phase);
    const done = acts.filter(a => a.executionStatus === 'Completed').length;
    const ip = acts.filter(a => a.executionStatus === 'In Progress').length;
    return { phase, total: acts.length, done, ip, pct: acts.length > 0 ? Math.round((done/acts.length)*100) : 0 };
  });

  const overallPct = allActivities.length > 0 ? Math.round((allActivities.filter(a=>a.executionStatus==='Completed').length / allActivities.length)*100) : 0;

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black tracking-tight">TURNAROUND WALLBOARD</h1>
          <p className="text-slate-400 text-lg mt-1">Live voortgang overzicht</p>
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold text-blue-400 tabular-nums">
            {now.toLocaleTimeString('nl-NL', {hour:'2-digit',minute:'2-digit'})}
          </p>
          <p className="text-slate-400">{now.toLocaleDateString('nl-NL', {weekday:'long',day:'numeric',month:'long'})}</p>
        </div>
      </div>

      {/* Overall KPI bar */}
      <div className="bg-slate-900 rounded-2xl p-5 border border-slate-800">
        <div className="flex items-center justify-between mb-3">
          <span className="text-slate-300 font-semibold text-lg">TOTALE VOORTGANG</span>
          <span className="text-5xl font-black text-blue-400">{overallPct}%</span>
        </div>
        <div className="h-6 bg-slate-800 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full transition-all duration-1000"
            style={{width:`${overallPct}%`}} />
        </div>
        <div className="flex gap-6 mt-3 text-sm text-slate-400">
          <span><span className="text-emerald-400 font-bold">{allActivities.filter(a=>a.executionStatus==='Completed').length}</span> afgerond</span>
          <span><span className="text-blue-400 font-bold">{allActivities.filter(a=>a.executionStatus==='In Progress').length}</span> in uitvoering</span>
          <span><span className="text-orange-400 font-bold">{allActivities.filter(a=>a.executionStatus==='On Hold').length}</span> on hold</span>
          <span><span className="text-slate-400 font-bold">{allActivities.filter(a=>a.executionStatus==='Planned').length}</span> gepland</span>
        </div>
      </div>

      {/* Phase selector */}
      <div className="flex gap-2">
        <button onClick={()=>setFilterPhase('all')}
          className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors ${filterPhase==='all'?'bg-white text-slate-900':'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}>
          Alle fasen
        </button>
        {phases.map(p => {
          const s = phaseSummary.find(ps=>ps.phase===p);
          return (
            <button key={p} onClick={()=>setFilterPhase(p)}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors flex items-center gap-2 ${filterPhase===p?'text-white':'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
              style={filterPhase===p?{backgroundColor:phaseColors[p]}:{}}>
              {p}
              {s && <span className="text-xs opacity-80">{s.pct}%</span>}
            </button>
          );
        })}
      </div>

      {/* Phase progress grid */}
      <div className="grid grid-cols-5 gap-3">
        {phaseSummary.map(({phase,total,done,ip,pct}) => (
          <div key={phase} className={`rounded-xl p-4 border ${filterPhase===phase||filterPhase==='all'?'border-opacity-100':'border-slate-700 opacity-50'}`}
            style={{backgroundColor:phaseColors[phase]+'20',borderColor:phaseColors[phase]}}>
            <p className="text-xs font-bold mb-1" style={{color:phaseColors[phase]}}>{phase}</p>
            <p className="text-3xl font-black" style={{color:phaseColors[phase]}}>{pct}%</p>
            <div className="mt-2 h-2 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full rounded-full" style={{width:`${pct}%`,backgroundColor:phaseColors[phase]}} />
            </div>
            <p className="text-xs text-slate-400 mt-1">{done}/{total} · {ip} actief</p>
          </div>
        ))}
      </div>

      {/* Main grid: in progress + hold points */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* In Progress */}
        <div className="lg:col-span-2 bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
          <div className="px-5 py-3 border-b border-slate-800 flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-blue-400 animate-pulse" />
            <h3 className="font-bold text-slate-200 text-lg">IN UITVOERING</h3>
            <span className="ml-auto text-blue-400 font-bold text-lg">{inProgress.length}</span>
          </div>
          {inProgress.length === 0 ? (
            <div className="p-8 text-center text-slate-500">Geen activiteiten in uitvoering voor deze fase</div>
          ) : (
            <div className="divide-y divide-slate-800">
              {inProgress.map(act => (
                <div key={act.id} className="px-5 py-4 flex items-center gap-4 hover:bg-slate-800/50 transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-mono text-sm font-bold text-blue-400">{act.activityId}</span>
                      <span className={`px-2 py-0.5 rounded text-xs font-bold text-white`} style={{backgroundColor:phaseColors[act.phase]||'#64748b'}}>{act.phase}</span>
                      {act.holdPoint && <span className="px-2 py-0.5 rounded bg-red-900 text-red-300 text-xs font-bold">HOLD POINT</span>}
                    </div>
                    <p className="text-slate-200 font-medium">{act.overrideDescription}</p>
                    <p className="text-slate-500 text-sm">{act._scopeTag} · {act._scopeDesc?.slice(0,40)}</p>
                  </div>
                  <div className="text-right w-20">
                    <p className="text-2xl font-black text-blue-400">{act.progress||0}%</p>
                    <div className="h-2 bg-slate-700 rounded-full mt-1 overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full" style={{width:`${act.progress||0}%`}} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Hold Points + Recently Completed */}
        <div className="space-y-4">
          <div className="bg-slate-900 rounded-2xl border border-red-900 overflow-hidden">
            <div className="px-5 py-3 border-b border-red-900 bg-red-950 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-400" />
              <h3 className="font-bold text-red-300">HOLD POINTS</h3>
              <span className="ml-auto text-red-400 font-bold">{holdPoints.length}</span>
            </div>
            {holdPoints.length === 0 ? (
              <div className="p-4 text-slate-500 text-sm text-center">Geen hold points</div>
            ) : (
              <div className="divide-y divide-slate-800">
                {holdPoints.slice(0,5).map(act => (
                  <div key={act.id} className="px-4 py-3">
                    <span className="font-mono text-xs font-bold text-red-400">{act.activityId}</span>
                    <p className="text-sm text-slate-300 truncate">{act.overrideDescription}</p>
                    <p className="text-xs text-slate-500">{act._scopeTag}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-slate-900 rounded-2xl border border-emerald-900 overflow-hidden">
            <div className="px-5 py-3 border-b border-emerald-900 bg-emerald-950 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <h3 className="font-bold text-emerald-300">RECENT AFGEROND</h3>
            </div>
            {recentCompleted.length === 0 ? (
              <div className="p-4 text-slate-500 text-sm text-center">Nog niets afgerond</div>
            ) : (
              <div className="divide-y divide-slate-800">
                {recentCompleted.reverse().map(act => (
                  <div key={act.id} className="px-4 py-3 flex items-center gap-2">
                    <span className="text-emerald-400">✓</span>
                    <div>
                      <span className="font-mono text-xs font-bold text-emerald-400">{act.activityId}</span>
                      <p className="text-sm text-slate-300 truncate">{act.overrideDescription}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};


// ===== S-CURVE COMPONENT =====
const SCurvePage = ({ scopeItems, project }) => {
  const [viewMode, setViewMode] = useState('activities');   // activities | cost | cumulative
  const [showBaseline, setShowBaseline] = useState(true);
  const [resolution, setResolution] = useState('week');     // day | week

  const projectStart = useMemo(() => {
    if (project?.startDate) return new Date(project.startDate);
    return new Date();
  }, [project]);

  // ── Build timeline data ──────────────────────────────────
  const timelineData = useMemo(() => {
    const phases = ['PRE-TA','UITBEDRIJF','TA','INBEDRIJF','POST-TA'];
    const phaseColors = { 'PRE-TA':'#8b5cf6','UITBEDRIJF':'#f97316','TA':'#3b82f6','INBEDRIJF':'#22c55e','POST-TA':'#64748b' };
    const allActs = [];

    // Assign sequential dates per phase
    let phaseOffset = 0;
    phases.forEach(phase => {
      const phaseActs = scopeItems.flatMap(item =>
        (item.plannedActivities || [])
          .filter(a => a.phase === phase)
          .map(a => ({ ...a, _itemId: item.id, _itemTag: item.tagNumber, _itemCost: (item.costRules||[]).reduce((s,r)=>s+(r.totaal||0),0) / Math.max((item.plannedActivities||[]).length,1) }))
      );
      let actOffset = 0;
      phaseActs.forEach(act => {
        const dur = act.duration || 1;
        allActs.push({ ...act, _phase: phase, _phaseColor: phaseColors[phase], _dayStart: phaseOffset + actOffset, _dayEnd: phaseOffset + actOffset + dur });
        actOffset += dur;
      });
      phaseOffset += actOffset;
    });

    if (allActs.length === 0) return { points: [], totalDays: 0, totalActivities: 0, totalCost: 0 };
    const totalDays = Math.max(...allActs.map(a => a._dayEnd), 1);
    const totalActivities = allActs.length;
    const totalCost = allActs.reduce((s,a) => s + a._itemCost, 0);

    // Determine bucket size
    const bucketSize = resolution === 'week' ? 7 : 1;
    const buckets = Math.ceil(totalDays / bucketSize) + 1;

    // ── Planned S-curve: each activity contributes uniformly over its duration
    const plannedActPerDay = new Array(totalDays + 1).fill(0);
    const plannedCostPerDay = new Array(totalDays + 1).fill(0);
    allActs.forEach(act => {
      const dur = act._dayEnd - act._dayStart;
      for (let d = act._dayStart; d < act._dayEnd; d++) {
        if (d < plannedActPerDay.length) {
          plannedActPerDay[d] += 1 / dur;
          plannedCostPerDay[d] += act._itemCost / dur;
        }
      }
    });

    // ── Actual S-curve: based on progress %
    const actualActPerDay = new Array(totalDays + 1).fill(0);
    const actualCostPerDay = new Array(totalDays + 1).fill(0);
    allActs.forEach(act => {
      const prog = (act.progress || 0) / 100;
      if (prog <= 0) return;
      const dur = act._dayEnd - act._dayStart;
      const doneByDay = Math.round(prog * dur);
      for (let d = act._dayStart; d < act._dayStart + doneByDay; d++) {
        if (d < actualActPerDay.length) {
          actualActPerDay[d] += 1 / dur;
          actualCostPerDay[d] += act._itemCost / dur;
        }
      }
    });

    // ── Aggregate into buckets ──
    const points = [];
    let cumPlannedAct = 0, cumActualAct = 0;
    let cumPlannedCost = 0, cumActualCost = 0;
    for (let b = 0; b < buckets; b++) {
      const dayStart = b * bucketSize;
      const dayEnd = Math.min(dayStart + bucketSize, totalDays + 1);
      let pAct = 0, aAct = 0, pCost = 0, aCost = 0;
      for (let d = dayStart; d < dayEnd; d++) {
        pAct += plannedActPerDay[d] || 0;
        aAct += actualActPerDay[d] || 0;
        pCost += plannedCostPerDay[d] || 0;
        aCost += actualCostPerDay[d] || 0;
      }
      cumPlannedAct += pAct;
      cumActualAct += aAct;
      cumPlannedCost += pCost;
      cumActualCost += aCost;

      const date = new Date(projectStart);
      date.setDate(date.getDate() + dayStart);
      const label = resolution === 'week'
        ? `W${b+1}`
        : date.toLocaleDateString('nl-NL',{day:'numeric',month:'numeric'});

      points.push({
        label,
        day: dayStart,
        date,
        plannedPct:  Math.min(100, Math.round((cumPlannedAct / totalActivities) * 100)),
        actualPct:   Math.min(100, Math.round((cumActualAct / totalActivities) * 100)),
        plannedCost: Math.round(cumPlannedCost),
        actualCost:  Math.round(cumActualCost),
        plannedAct:  Math.round(cumPlannedAct),
        actualAct:   Math.round(cumActualAct),
      });
    }

    // Phase breakdown for legend
    const phaseBreakdown = phases.map(phase => {
      const acts = allActs.filter(a => a._phase === phase);
      const done = acts.filter(a => (a.progress||0) >= 100).length;
      const inProg = acts.filter(a => (a.progress||0) > 0 && (a.progress||0) < 100).length;
      const totalDurPhase = acts.reduce((s,a)=>s+(a.duration||1),0);
      return { phase, color: phaseColors[phase], total: acts.length, done, inProg, totalDurPhase };
    }).filter(p => p.total > 0);

    // Variance at last actual point
    const lastActualIdx = points.reduce((best, p, i) => p.actualPct > 0 ? i : best, 0);
    const variance = points[lastActualIdx]
      ? points[lastActualIdx].actualPct - points[lastActualIdx].plannedPct
      : 0;

    return { points, totalDays, totalActivities, totalCost, phaseBreakdown, variance, lastActualIdx };
  }, [scopeItems, project, resolution]);

  // ── Viewport / visible data ──────────────────────────────
  const { points } = timelineData;
  const chartW = 780, chartH = 280;
  const padL = 48, padR = 20, padT = 16, padB = 40;
  const innerW = chartW - padL - padR;
  const innerH = chartH - padT - padB;

  const toX = (i) => padL + (i / Math.max(points.length - 1, 1)) * innerW;
  const toY = (pct) => padT + innerH - (pct / 100) * innerH;

  const makePath = (key) => {
    if (points.length === 0) return '';
    return points.map((p, i) => `${i===0?'M':'L'}${toX(i).toFixed(1)},${toY(p[key]).toFixed(1)}`).join(' ');
  };

  const makeArea = (key, baseKey) => {
    if (points.length === 0) return '';
    const top = points.map((p, i) => `${i===0?'M':'L'}${toX(i).toFixed(1)},${toY(p[key]).toFixed(1)}`).join(' ');
    const bottom = [...points].reverse().map((p, i, arr) => `${i===0?'L':'L'}${toX(arr.length-1-i).toFixed(1)},${toY(p[baseKey]||0).toFixed(1)}`).join(' ');
    return top + ' ' + bottom + ' Z';
  };

  const yLabels = [0,20,40,60,80,100];

  const kv = viewMode === 'cost' ? 'plannedCost' : 'plannedPct';
  const av = viewMode === 'cost' ? 'actualCost' : 'actualPct';
  const lastActual = points.length > 0 ? points[points.length - 1] : null;
  const completedCount = scopeItems.flatMap(i => i.plannedActivities||[]).filter(a => a.executionStatus === 'Completed').length;
  const totalActs = scopeItems.flatMap(i => i.plannedActivities||[]).length;
  const overallPct = totalActs > 0 ? Math.round((completedCount/totalActs)*100) : 0;
  const varStyle = (timelineData.variance || 0) >= 0 ? 'text-green-600' : 'text-red-600';
  const varLabel = (timelineData.variance || 0) >= 0 ? `+${timelineData.variance}%` : `${timelineData.variance}%`;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">S-Curve Voortgang</h2>
          <p className="text-slate-500 text-sm mt-1">Gepland vs. actueel over de looptijd · {timelineData.totalActivities} activiteiten · {timelineData.totalDays} dagen</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-lg border border-slate-200 overflow-hidden text-xs">
            {[['activities','Activiteiten'],['cost','Kosten']].map(([v,l]) => (
              <button key={v} onClick={() => setViewMode(v)}
                className={`px-3 py-2 font-medium transition-colors ${viewMode===v ? 'bg-blue-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'}`}>{l}</button>
            ))}
          </div>
          <div className="flex rounded-lg border border-slate-200 overflow-hidden text-xs">
            {[['week','Week'],['day','Dag']].map(([v,l]) => (
              <button key={v} onClick={() => setResolution(v)}
                className={`px-3 py-2 font-medium transition-colors ${resolution===v ? 'bg-slate-700 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'}`}>{l}</button>
            ))}
          </div>
          <button onClick={() => setShowBaseline(b => !b)}
            className={`px-3 py-2 rounded-lg border text-xs font-medium transition-colors ${showBaseline ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-600 border-slate-200'}`}>
            Baseline
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Totale voortgang', value: `${overallPct}%`, sub: `${completedCount}/${totalActs} activiteiten`, color: 'text-blue-600', bg: 'bg-blue-50 border-blue-200' },
          { label: 'Variance (plan vs actuel)', value: varLabel, sub: 'op laatste meetpunt', color: varStyle, bg: (timelineData.variance||0) >= 0 ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200' },
          { label: 'Projectduur', value: `${timelineData.totalDays}d`, sub: `${Math.ceil(timelineData.totalDays/7)} weken totaal`, color: 'text-slate-700', bg: 'bg-slate-50 border-slate-200' },
          { label: 'Totale projectwaarde', value: timelineData.totalCost > 0 ? `€${(timelineData.totalCost/1000).toFixed(0)}k` : '—', sub: 'incl. contingency', color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200' },
        ].map(k => (
          <div key={k.label} className={`rounded-xl border p-4 ${k.bg}`}>
            <p className="text-xs font-medium text-slate-500 mb-1">{k.label}</p>
            <p className={`text-2xl font-bold ${k.color}`}>{k.value}</p>
            <p className="text-xs text-slate-400 mt-0.5">{k.sub}</p>
          </div>
        ))}
      </div>

      {/* S-Curve Chart */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
        <div className="flex items-center gap-5 mb-4">
          <h3 className="font-bold text-slate-900">S-Curve</h3>
          <div className="flex items-center gap-4 text-xs">
            {showBaseline && <span className="flex items-center gap-1.5"><span className="inline-block w-8 h-0.5 bg-blue-400" style={{borderTop:'2px dashed #93c5fd'}}></span> Gepland</span>}
            <span className="flex items-center gap-1.5"><span className="inline-block w-8 h-0.5 bg-emerald-500" style={{borderTop:'2px solid #10b981'}}></span> Actueel</span>
          </div>
        </div>

        {points.length === 0 ? (
          <div className="flex items-center justify-center h-64 text-slate-400">
            <div className="text-center"><Activity className="w-12 h-12 mx-auto mb-2 opacity-20" /><p>Geen activiteiten met data</p></div>
          </div>
        ) : (
          <svg viewBox={`0 0 ${chartW} ${chartH}`} className="w-full" style={{height:320}}>
            {/* Grid */}
            {yLabels.map(pct => {
              const y = toY(pct);
              return (
                <g key={pct}>
                  <line x1={padL} y1={y} x2={chartW-padR} y2={y} stroke="#f1f5f9" strokeWidth="1" />
                  <text x={padL-6} y={y+4} textAnchor="end" fontSize="10" fill="#94a3b8">{viewMode==='cost' ? '' : `${pct}%`}</text>
                </g>
              );
            })}

            {/* X axis labels - sparse */}
            {points.filter((_,i) => i === 0 || i === points.length-1 || i % Math.max(1,Math.floor(points.length/8)) === 0).map((p, _, arr, i) => {
              const idx = points.indexOf(p);
              return (
                <text key={idx} x={toX(idx)} y={chartH-padB+16} textAnchor="middle" fontSize="9" fill="#94a3b8">{p.label}</text>
              );
            })}

            {/* Area under planned */}
            {showBaseline && (
              <path d={makeArea(kv, '__zero')} fill="#dbeafe" opacity="0.3" />
            )}

            {/* Area under actual */}
            <path d={makeArea(av, '__zero')} fill="#d1fae5" opacity="0.4" />

            {/* Planned line */}
            {showBaseline && (
              <path d={makePath(kv)} fill="none" stroke="#93c5fd" strokeWidth="2" strokeDasharray="5 3" />
            )}

            {/* Actual line */}
            <path d={makePath(av)} fill="none" stroke="#10b981" strokeWidth="2.5" />

            {/* Dots on actual - sparse */}
            {points.filter((_,i) => i % Math.max(1, Math.floor(points.length/12)) === 0 || i === points.length-1).map((p) => {
              const i = points.indexOf(p);
              return (
                <circle key={i} cx={toX(i)} cy={toY(p[av])} r="3.5" fill="#10b981" stroke="white" strokeWidth="1.5" />
              );
            })}

            {/* Axes */}
            <line x1={padL} y1={padT} x2={padL} y2={chartH-padB} stroke="#e2e8f0" strokeWidth="1" />
            <line x1={padL} y1={chartH-padB} x2={chartW-padR} y2={chartH-padB} stroke="#e2e8f0" strokeWidth="1" />

            {/* Y-axis label */}
            <text x={12} y={chartH/2} textAnchor="middle" fontSize="10" fill="#94a3b8" transform={`rotate(-90, 12, ${chartH/2})`}>
              {viewMode === 'cost' ? 'Kosten (€)' : 'Voortgang (%)'}
            </text>
          </svg>
        )}
      </div>

      {/* Phase breakdown */}
      {timelineData.phaseBreakdown && timelineData.phaseBreakdown.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <h3 className="font-bold text-slate-900 mb-4">Voortgang per Fase</h3>
          <div className="space-y-4">
            {timelineData.phaseBreakdown.map(p => {
              const donePct = p.total > 0 ? Math.round((p.done/p.total)*100) : 0;
              const inProgPct = p.total > 0 ? Math.round((p.inProg/p.total)*100) : 0;
              return (
                <div key={p.phase}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded" style={{backgroundColor: p.color}} />
                      <span className="font-semibold text-slate-800 text-sm">{p.phase}</span>
                      <span className="text-xs text-slate-400">{p.total} activiteiten · {p.totalDurPhase}d</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs">
                      <span className="text-green-600 font-semibold">{p.done} klaar</span>
                      {p.inProg > 0 && <span className="text-blue-600 font-semibold">{p.inProg} bezig</span>}
                      <span className="font-bold text-slate-700" style={{color: p.color}}>{donePct}%</span>
                    </div>
                  </div>
                  <div className="h-5 bg-slate-100 rounded-full overflow-hidden flex">
                    <div className="h-full transition-all duration-500 rounded-l-full" style={{width:`${donePct}%`, backgroundColor: p.color}} />
                    <div className="h-full transition-all duration-500" style={{width:`${inProgPct}%`, backgroundColor: p.color, opacity: 0.4}} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Detailed data table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
          <h3 className="font-bold text-slate-900">Detailtabel</h3>
          <span className="text-xs text-slate-400">{points.length} meetpunten</span>
        </div>
        <div className="overflow-x-auto max-h-64">
          <table className="w-full text-xs">
            <thead className="sticky top-0 bg-slate-50">
              <tr>
                <th className="text-left px-4 py-2 font-semibold text-slate-500">Periode</th>
                <th className="text-right px-4 py-2 font-semibold text-blue-500">Gepland (%)</th>
                <th className="text-right px-4 py-2 font-semibold text-emerald-600">Actueel (%)</th>
                <th className="text-right px-4 py-2 font-semibold text-slate-500">Variance</th>
                <th className="text-right px-4 py-2 font-semibold text-blue-500">Gepland (acts)</th>
                <th className="text-right px-4 py-2 font-semibold text-emerald-600">Actueel (acts)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {points.filter((_,i) => i % (resolution==='week' ? 1 : 5) === 0 || i === points.length-1).map((p, i) => {
                const varPct = p.actualPct - p.plannedPct;
                return (
                  <tr key={i} className="hover:bg-slate-50">
                    <td className="px-4 py-2 font-mono text-slate-600">{p.label}</td>
                    <td className="px-4 py-2 text-right text-blue-600 font-semibold">{p.plannedPct}%</td>
                    <td className="px-4 py-2 text-right text-emerald-600 font-semibold">{p.actualPct}%</td>
                    <td className={`px-4 py-2 text-right font-bold ${varPct >= 0 ? 'text-green-600' : 'text-red-600'}`}>{varPct >= 0 ? '+' : ''}{varPct}%</td>
                    <td className="px-4 py-2 text-right text-slate-500">{p.plannedAct}</td>
                    <td className="px-4 py-2 text-right text-emerald-700">{p.actualAct}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};


// ===== BULK EDIT PANEL =====
// Embedded as an overlay inside ScopeManager – triggered by "Bulk Edit" button
const BulkEditPanel = ({ selectedIds, scopeItems, onApply, onClose }) => {
  const [fields, setFields] = useState({
    status: '', priority: '', discipline: '', system: '', area: '',
    workflowStatusId: '', contingencyPct: ''
  });
  const [touched, setTouched] = useState({});

  const selected = scopeItems.filter(i => selectedIds.has(i.id));
  const set = (k, v) => { setFields(f => ({ ...f, [k]: v })); setTouched(t => ({ ...t, [k]: true })); };

  const handleApply = () => {
    const updates = {};
    Object.entries(fields).forEach(([k, v]) => { if (touched[k] && v !== '') updates[k] = v; });
    if (Object.keys(updates).length === 0) return;
    onApply(selectedIds, updates);
    onClose();
  };

  const touchedCount = Object.values(touched).filter(Boolean).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Bulk Bewerken</h3>
            <p className="text-sm text-slate-500 mt-0.5">{selected.length} werkpaketten geselecteerd</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg"><X className="w-5 h-5 text-slate-400" /></button>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-5 text-sm text-amber-700">
          Alleen ingevulde velden worden toegepast. Lege velden worden overgeslagen.
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {[
              { key:'status', label:'Status', opts:['In Scope','Out of Scope','On Hold','Completed'] },
              { key:'priority', label:'Prioriteit', opts:['High','Medium','Low'] },
              { key:'discipline', label:'Discipline', opts:['Mechanical','Piping','Electrical','Instrumentation','Civil','Scaffold','Inspection'] },
              { key:'workflowStatusId', label:'Workflow Status', opts:['preparation','review','approved','in_progress','completed'] },
            ].map(({ key, label, opts }) => (
              <div key={key}>
                <label className="block text-xs font-semibold text-slate-600 mb-1">{label}</label>
                <select value={fields[key]} onChange={e => set(key, e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg text-sm ${touched[key] && fields[key] ? 'border-blue-400 bg-blue-50' : 'border-slate-200 bg-white'}`}>
                  <option value="">-- niet wijzigen --</option>
                  {opts.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { key:'system', label:'Systeem', type:'text', placeholder:'bijv. Stoom' },
              { key:'area', label:'Area', type:'text', placeholder:'bijv. Reactor Area' },
              { key:'contingencyPct', label:'Contingency %', type:'number', placeholder:'bijv. 10' },
            ].map(({ key, label, type, placeholder }) => (
              <div key={key}>
                <label className="block text-xs font-semibold text-slate-600 mb-1">{label}</label>
                <input type={type} placeholder={placeholder} value={fields[key]}
                  onChange={e => set(key, e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg text-sm ${touched[key] && fields[key] ? 'border-blue-400 bg-blue-50' : 'border-slate-200'}`} />
              </div>
            ))}
          </div>
        </div>

        {/* Preview */}
        <div className="mt-5 bg-slate-50 rounded-lg p-3 max-h-36 overflow-y-auto">
          <p className="text-xs font-semibold text-slate-500 mb-2">GESELECTEERDE WERKPAKKETTEN</p>
          {selected.map(i => (
            <div key={i.id} className="flex items-center gap-2 text-xs py-1 border-b border-slate-100 last:border-0">
              <span className="font-mono font-bold text-blue-600">{i.tagNumber}</span>
              <span className="text-slate-600 truncate">{i.description}</span>
            </div>
          ))}
        </div>

        <div className="flex gap-3 mt-5">
          <button onClick={onClose} className="flex-1 px-4 py-2.5 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50">Annuleren</button>
          <button onClick={handleApply} disabled={touchedCount === 0}
            className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 disabled:opacity-40 transition-opacity">
            Toepassen op {selected.length} items ({touchedCount} veld{touchedCount !== 1 ? 'en' : ''})
          </button>
        </div>
      </div>
    </div>
  );
};


// ===== USER MANAGEMENT =====
const ROLES = [
  { id: 'admin',      label: 'Admin',           color: 'text-red-700 bg-red-100',      desc: 'Volledige toegang, gebruikersbeheer' },
  { id: 'engineer',   label: 'Engineer',         color: 'text-blue-700 bg-blue-100',    desc: 'Scope, activiteiten, calculaties' },
  { id: 'supervisor', label: 'Supervisor',       color: 'text-purple-700 bg-purple-100',desc: 'Uitvoering, TRA goedkeuring, voortgang' },
  { id: 'inspector',  label: 'Inspector',        color: 'text-amber-700 bg-amber-100',  desc: 'Hold points, TRA inzien, documenten' },
  { id: 'viewer',     label: 'Viewer',           color: 'text-slate-700 bg-slate-100',  desc: 'Alleen lezen, wallboard' },
];

const INITIAL_USERS = [
  { id: 'u1', name: 'Jan de Vries',   email: 'j.devries@chemco.nl',    role: 'admin',      active: true,  lastActive: '2026-02-15' },
  { id: 'u2', name: 'Petra Smits',    email: 'p.smits@chemco.nl',      role: 'engineer',   active: true,  lastActive: '2026-02-17' },
  { id: 'u3', name: 'Tom Bakker',     email: 't.bakker@chemco.nl',     role: 'supervisor', active: true,  lastActive: '2026-02-16' },
  { id: 'u4', name: 'Lisa van Dam',   email: 'l.vandam@chemco.nl',     role: 'inspector',  active: true,  lastActive: '2026-02-14' },
  { id: 'u5', name: 'Erik Jansen',    email: 'e.jansen@chemco.nl',     role: 'viewer',     active: false, lastActive: '2026-01-20' },
];

const UserManagement = () => {
  const toast = useToast();
  const [users, setUsers] = useState(() => {
    try { return JSON.parse(localStorage.getItem('chemprep_users') || 'null') || INITIAL_USERS; } catch { return INITIAL_USERS; }
  });
  const [showAdd, setShowAdd] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', role: 'viewer', active: true });

  const save = (u) => { localStorage.setItem('chemprep_users', JSON.stringify(u)); setUsers(u); };

  const handleAddOrEdit = () => {
    if (!form.name || !form.email) { toast.error('Naam en e-mail zijn verplicht'); return; }
    let updated;
    if (editUser) {
      updated = users.map(u => u.id === editUser.id ? { ...u, ...form } : u);
      toast.success('Gebruiker bijgewerkt', form.name);
    } else {
      updated = [...users, { id: 'u' + Date.now(), lastActive: new Date().toISOString().split('T')[0], ...form }];
      toast.success('Gebruiker toegevoegd', form.name);
    }
    save(updated);
    setShowAdd(false); setEditUser(null); setForm({ name:'', email:'', role:'viewer', active:true });
  };

  const toggleActive = (id) => {
    const updated = users.map(u => u.id === id ? { ...u, active: !u.active } : u);
    save(updated);
  };

  const deleteUser = (id) => {
    if (!window.confirm('Gebruiker verwijderen?')) return;
    save(users.filter(u => u.id !== id));
    toast.info('Gebruiker verwijderd');
  };

  const openEdit = (u) => { setForm({ name:u.name, email:u.email, role:u.role, active:u.active }); setEditUser(u); setShowAdd(true); };

  const roleBadge = (roleId) => {
    const r = ROLES.find(r => r.id === roleId);
    return r ? <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${r.color}`}>{r.label}</span> : null;
  };

  const stats = ROLES.map(r => ({ ...r, count: users.filter(u => u.role === r.id && u.active).length }));

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Gebruikersbeheer</h2>
          <p className="text-slate-500 text-sm mt-1">{users.filter(u=>u.active).length} actieve gebruikers · {users.length} totaal</p>
        </div>
        <button onClick={() => { setEditUser(null); setForm({ name:'',email:'',role:'viewer',active:true }); setShowAdd(true); }}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg font-medium text-sm hover:bg-blue-700">
          <Plus className="w-4 h-4" /> Gebruiker toevoegen
        </button>
      </div>

      {/* Role overview cards */}
      <div className="grid grid-cols-5 gap-3">
        {stats.map(r => (
          <div key={r.id} className="bg-white border border-slate-200 rounded-xl p-3 text-center shadow-sm">
            <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${r.color}`}>{r.label}</span>
            <p className="text-3xl font-black text-slate-900 mt-2">{r.count}</p>
            <p className="text-xs text-slate-400 mt-0.5 leading-tight">{r.desc}</p>
          </div>
        ))}
      </div>

      {/* Role permissions matrix */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-100 bg-slate-50">
          <h3 className="font-bold text-slate-900">Rollen & Rechten</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="text-left px-4 py-3 font-semibold text-slate-500">Module</th>
                {ROLES.map(r => <th key={r.id} className="text-center px-3 py-3 font-semibold text-slate-500">{r.label}</th>)}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {[
                ['Dashboard', true, true, true, true, true],
                ['Scope Manager (lezen)', true, true, true, true, true],
                ['Scope Manager (schrijven)', true, true, false, false, false],
                ['Activiteiten bewerken', true, true, true, false, false],
                ['Kostenbeheer', true, true, false, false, false],
                ['Calculaties', true, true, false, false, false],
                ['T.R.A. bewerken', true, true, true, false, false],
                ['T.R.A. goedkeuren', true, false, true, true, false],
                ['Documents beheren', true, true, true, false, false],
                ['Export', true, true, true, false, false],
                ['Wallboard', true, true, true, true, true],
                ['Gebruikersbeheer', true, false, false, false, false],
              ].map(([module, ...perms]) => (
                <tr key={module} className="hover:bg-slate-50">
                  <td className="px-4 py-2.5 font-medium text-slate-700">{module}</td>
                  {perms.map((ok, i) => (
                    <td key={i} className="px-3 py-2.5 text-center">
                      {ok ? <CheckCircle className="w-4 h-4 text-green-500 mx-auto" /> : <X className="w-4 h-4 text-slate-200 mx-auto" />}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Users table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-100 bg-slate-50">
          <h3 className="font-bold text-slate-900">Gebruikers</h3>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase">Naam</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">E-mail</th>
              <th className="text-center px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Rol</th>
              <th className="text-center px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Status</th>
              <th className="text-center px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Laatst actief</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {users.map(u => (
              <tr key={u.id} className={`hover:bg-slate-50 ${!u.active ? 'opacity-50' : ''}`}>
                <td className="px-5 py-3 font-semibold text-slate-800">{u.name}</td>
                <td className="px-4 py-3 text-slate-500 font-mono text-xs">{u.email}</td>
                <td className="px-4 py-3 text-center">{roleBadge(u.role)}</td>
                <td className="px-4 py-3 text-center">
                  <button onClick={() => toggleActive(u.id)}
                    className={`px-2 py-0.5 rounded-full text-xs font-bold transition-colors ${u.active ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>
                    {u.active ? 'Actief' : 'Inactief'}
                  </button>
                </td>
                <td className="px-4 py-3 text-center text-xs text-slate-400">{u.lastActive}</td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button onClick={() => openEdit(u)} className="p-1.5 hover:bg-blue-50 rounded-lg text-blue-600"><Edit2 className="w-3.5 h-3.5" /></button>
                    <button onClick={() => deleteUser(u.id)} className="p-1.5 hover:bg-red-50 rounded-lg text-red-400"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-slate-900">{editUser ? 'Gebruiker bewerken' : 'Gebruiker toevoegen'}</h3>
              <button onClick={() => { setShowAdd(false); setEditUser(null); }} className="p-2 hover:bg-slate-100 rounded-lg"><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <div className="space-y-4">
              {[{ key:'name', label:'Naam', type:'text', placeholder:'Volledige naam' }, { key:'email', label:'E-mail', type:'email', placeholder:'naam@bedrijf.nl' }].map(f => (
                <div key={f.key}>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">{f.label}</label>
                  <input type={f.type} placeholder={f.placeholder} value={form[f.key]} onChange={e => setForm(x=>({...x,[f.key]:e.target.value}))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" />
                </div>
              ))}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Rol</label>
                <select value={form.role} onChange={e => setForm(x=>({...x,role:e.target.value}))} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm">
                  {ROLES.map(r => <option key={r.id} value={r.id}>{r.label} — {r.desc}</option>)}
                </select>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.active} onChange={e => setForm(x=>({...x,active:e.target.checked}))} className="w-4 h-4 accent-blue-600" />
                <span className="text-sm font-medium text-slate-700">Account actief</span>
              </label>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => { setShowAdd(false); setEditUser(null); }} className="flex-1 px-4 py-2.5 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50">Annuleren</button>
              <button onClick={handleAddOrEdit} className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700">
                {editUser ? 'Opslaan' : 'Toevoegen'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


// ===== CHANGELOG / REVISIE HISTORIE =====
// Hook to log changes – attach to any update function
const useChangelog = () => {
  const addEntry = useCallback((action, entity, detail, user = 'Gebruiker') => {
    const entry = {
      id: Date.now(),
      ts: new Date().toISOString(),
      action,     // 'create' | 'update' | 'delete' | 'approve' | 'status'
      entity,     // 'scope' | 'activity' | 'tra' | 'document' | 'cost'
      detail,     // human readable string
      user,
    };
    try {
      const log = JSON.parse(localStorage.getItem('chemprep_changelog') || '[]');
      const updated = [entry, ...log].slice(0, 500); // keep last 500
      localStorage.setItem('chemprep_changelog', JSON.stringify(updated));
    } catch {}
  }, []);
  return { addEntry };
};

const ChangelogPage = () => {
  const [log, setLog] = useState([]);
  const [entityFilter, setEntityFilter] = useState('all');
  const [actionFilter, setActionFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const load = () => {
      try {
        const stored = JSON.parse(localStorage.getItem('chemprep_changelog') || '[]');
        // If empty, inject demo entries
        if (stored.length === 0) {
          const demo = [
            { id:1, ts:'2026-02-17T09:15:00', action:'create',  entity:'scope',    detail:'Scope item aangemaakt: P-101 Pomp revisie',            user:'Petra Smits' },
            { id:2, ts:'2026-02-17T09:32:00', action:'update',  entity:'activity', detail:'Activiteit MA-001 duur gewijzigd: 2d → 3d',             user:'Tom Bakker' },
            { id:3, ts:'2026-02-17T10:05:00', action:'approve', entity:'tra',      detail:'TRA goedgekeurd voor MA-001 (P-101)',                    user:'Lisa van Dam' },
            { id:4, ts:'2026-02-17T10:40:00', action:'status',  entity:'scope',    detail:'Status gewijzigd: Out of Scope → In Scope (E-202)',      user:'Jan de Vries' },
            { id:5, ts:'2026-02-17T11:00:00', action:'create',  entity:'document', detail:'Document toegevoegd: Procedure PROC-001 (P-101)',         user:'Petra Smits' },
            { id:6, ts:'2026-02-16T14:20:00', action:'update',  entity:'cost',     detail:'Cost rule bijgewerkt: Arbeid €1.200 → €1.450 (HE-301)',  user:'Petra Smits' },
            { id:7, ts:'2026-02-16T15:10:00', action:'delete',  entity:'activity', detail:'Activiteit verwijderd: MA-003 Inspectie (V-501)',         user:'Jan de Vries' },
            { id:8, ts:'2026-02-15T08:55:00', action:'create',  entity:'scope',    detail:'Scope item aangemaakt: HE-301 Warmtewisselaar reiniging', user:'Jan de Vries' },
            { id:9, ts:'2026-02-15T13:30:00', action:'status',  entity:'activity', detail:'Status → In Progress: MA-002 (P-101)',                   user:'Tom Bakker' },
            { id:10,ts:'2026-02-14T16:00:00', action:'update',  entity:'scope',    detail:'Prioriteit gewijzigd: Low → High (V-501)',               user:'Petra Smits' },
          ];
          setLog(demo);
        } else {
          setLog(stored);
        }
      } catch { setLog([]); }
    };
    load();
    const interval = setInterval(load, 10000);
    return () => clearInterval(interval);
  }, []);

  const clearLog = () => {
    if (window.confirm('Changelog wissen?')) {
      localStorage.removeItem('chemprep_changelog');
      setLog([]);
    }
  };

  const filtered = log.filter(e => {
    if (entityFilter !== 'all' && e.entity !== entityFilter) return false;
    if (actionFilter !== 'all' && e.action !== actionFilter) return false;
    if (searchTerm && !e.detail?.toLowerCase().includes(searchTerm.toLowerCase()) && !e.user?.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const actionStyle = {
    create:  { bg:'bg-green-100',  text:'text-green-700',  label:'Aangemaakt' },
    update:  { bg:'bg-blue-100',   text:'text-blue-700',   label:'Bijgewerkt' },
    delete:  { bg:'bg-red-100',    text:'text-red-700',    label:'Verwijderd' },
    approve: { bg:'bg-purple-100', text:'text-purple-700', label:'Goedgekeurd' },
    status:  { bg:'bg-amber-100',  text:'text-amber-700',  label:'Status' },
  };
  const entityStyle = {
    scope:    { bg:'bg-slate-100', text:'text-slate-600' },
    activity: { bg:'bg-blue-50',   text:'text-blue-600' },
    tra:      { bg:'bg-red-50',    text:'text-red-600' },
    document: { bg:'bg-indigo-50', text:'text-indigo-600' },
    cost:     { bg:'bg-green-50',  text:'text-green-600' },
  };

  const groupedByDate = filtered.reduce((acc, e) => {
    const date = new Date(e.ts).toLocaleDateString('nl-NL', { weekday:'long', day:'numeric', month:'long' });
    if (!acc[date]) acc[date] = [];
    acc[date].push(e);
    return acc;
  }, {});

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Changelog</h2>
          <p className="text-slate-500 text-sm mt-1">{log.length} wijzigingen gelogd · {filtered.length} zichtbaar</p>
        </div>
        <button onClick={clearLog} className="flex items-center gap-2 px-3 py-2 border border-red-200 text-red-600 rounded-lg text-sm hover:bg-red-50">
          <Trash2 className="w-4 h-4" /> Wissen
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input type="text" placeholder="Zoeken op detail of gebruiker..." value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm" />
        </div>
        <div className="flex rounded-lg border border-slate-200 overflow-hidden">
          {[['all','Alle'], ['scope','Scope'], ['activity','Activiteit'], ['tra','TRA'], ['document','Document'], ['cost','Kosten']].map(([v,l]) => (
            <button key={v} onClick={() => setEntityFilter(v)}
              className={`px-3 py-2 text-xs font-medium transition-colors ${entityFilter===v ? 'bg-blue-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'}`}>{l}</button>
          ))}
        </div>
        <div className="flex rounded-lg border border-slate-200 overflow-hidden">
          {[['all','Alle'], ['create','Aangemaakt'], ['update','Bijgewerkt'], ['delete','Verwijderd'], ['approve','Goedgekeurd']].map(([v,l]) => (
            <button key={v} onClick={() => setActionFilter(v)}
              className={`px-3 py-2 text-xs font-medium transition-colors ${actionFilter===v ? 'bg-slate-700 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'}`}>{l}</button>
          ))}
        </div>
      </div>

      {/* Timeline grouped by date */}
      {Object.keys(groupedByDate).length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center border border-slate-200 shadow-sm">
          <Clock className="w-12 h-12 text-slate-200 mx-auto mb-3" />
          <p className="text-slate-400">Geen wijzigingen gevonden.</p>
        </div>
      ) : Object.entries(groupedByDate).map(([date, entries]) => (
        <div key={date}>
          <div className="flex items-center gap-3 mb-3">
            <div className="h-px flex-1 bg-slate-200" />
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{date}</span>
            <div className="h-px flex-1 bg-slate-200" />
          </div>
          <div className="space-y-2">
            {entries.map(e => {
              const as = actionStyle[e.action] || actionStyle.update;
              const es = entityStyle[e.entity] || entityStyle.scope;
              const time = new Date(e.ts).toLocaleTimeString('nl-NL', { hour:'2-digit', minute:'2-digit' });
              return (
                <div key={e.id} className="bg-white rounded-xl border border-slate-200 shadow-sm flex items-start gap-4 p-3.5 hover:border-slate-300 transition-colors">
                  {/* Action badge */}
                  <span className={`shrink-0 mt-0.5 px-2 py-0.5 rounded-full text-xs font-bold ${as.bg} ${as.text}`}>{as.label}</span>
                  {/* Detail */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-800">{e.detail}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${es.bg} ${es.text}`}>{e.entity}</span>
                      <span className="text-xs text-slate-400">{e.user}</span>
                    </div>
                  </div>
                  {/* Time */}
                  <span className="shrink-0 text-xs text-slate-400 font-mono mt-0.5">{time}</span>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};


// ===== PRINT WERKPAKKET =====
const printWerkpakket = (item, project) => {
  const phases = ['PRE-TA', 'UITBEDRIJF', 'TA', 'INBEDRIJF', 'POST-TA'];
  const phaseColors = { 'PRE-TA':'#8b5cf6','UITBEDRIJF':'#f97316','TA':'#3b82f6','INBEDRIJF':'#22c55e','POST-TA':'#64748b' };
  const acts = item.plannedActivities || [];
  const allRisks = acts.flatMap(a => a.tra?.risks || []);
  const critRisks = allRisks.filter(r => (r.probability||1)*(r.severity||1) >= 15).length;
  const sub = (item.costRules||[]).reduce((s,r)=>s+(r.totaal||0),0);
  const cont = sub * ((item.contingency?.percentage||0)/100);
  const totalCost = sub + cont;
  const docs = item.documents || [];
  const completedActs = acts.filter(a => a.executionStatus === 'Completed').length;
  const progressPct = acts.length > 0 ? Math.round((completedActs/acts.length)*100) : 0;

  const actsHTML = phases.flatMap(phase => {
    const phaseActs = acts.filter(a => a.phase === phase);
    if (phaseActs.length === 0) return [];
    return [
      `<tr style="background:${phaseColors[phase]}18">
        <td colspan="7" style="padding:6px 12px;font-weight:700;color:${phaseColors[phase]};font-size:11px;letter-spacing:.05em">${phase}</td>
      </tr>`,
      ...phaseActs.map(a => {
        const risks = a.tra?.risks || [];
        const maxScore = risks.reduce((m,r)=>Math.max(m,(r.probability||1)*(r.severity||1)),0);
        const riskBadge = maxScore>=15?'<span style="background:#fee2e2;color:#991b1b;padding:1px 6px;border-radius:10px;font-size:10px;font-weight:700">KRITIEK</span>':
                          maxScore>=8 ?'<span style="background:#fef3c7;color:#92400e;padding:1px 6px;border-radius:10px;font-size:10px;font-weight:700">HOOG</span>':'';
        const statusColor = a.executionStatus==='Completed'?'#22c55e':a.executionStatus==='In Progress'?'#3b82f6':'#94a3b8';
        return `<tr style="border-bottom:1px solid #f1f5f9">
          <td style="padding:7px 12px;font-family:monospace;font-size:11px;font-weight:700;color:#2563eb">${a.activityId||''}</td>
          <td style="padding:7px 8px;font-size:12px;color:#1e293b">${a.overrideDescription||''}</td>
          <td style="padding:7px 8px;text-align:center;font-size:11px">${a.duration||1}d</td>
          <td style="padding:7px 8px;text-align:center;font-size:11px">${(a.resources||[]).length}</td>
          <td style="padding:7px 8px;text-align:center;font-size:11px">${riskBadge||'—'}</td>
          <td style="padding:7px 8px;text-align:center;font-size:11px">${a.holdPoint?'<span style="color:#ef4444;font-weight:700">●</span>':'—'}</td>
          <td style="padding:7px 8px;text-align:center">
            <span style="color:${statusColor};font-size:11px;font-weight:600">${a.executionStatus||'Planned'}</span>
          </td>
        </tr>`;
      })
    ];
  }).join('');

  const costsHTML = (item.costRules||[]).map(r =>
    `<tr style="border-bottom:1px solid #f1f5f9">
      <td style="padding:6px 12px;font-size:12px">${r.description||''}</td>
      <td style="padding:6px 8px;font-size:11px;color:#64748b">${r.category||''}</td>
      <td style="padding:6px 8px;text-align:right;font-size:12px">${r.aantal||''}</td>
      <td style="padding:6px 8px;text-align:right;font-size:12px">${r.eenheid||''}</td>
      <td style="padding:6px 8px;text-align:right;font-size:12px">€${(r.tarief||0).toFixed(2)}</td>
      <td style="padding:6px 8px;text-align:right;font-weight:700;color:#059669">€${(r.totaal||0).toFixed(2)}</td>
    </tr>`
  ).join('');

  const docsHTML = docs.map(d =>
    `<tr style="border-bottom:1px solid #f1f5f9">
      <td style="padding:6px 12px;font-family:monospace;font-size:11px">${d.docNumber||''}</td>
      <td style="padding:6px 8px;font-size:12px">${d.title||''}</td>
      <td style="padding:6px 8px;font-size:11px;color:#64748b">${d.type||''}</td>
      <td style="padding:6px 8px;font-size:11px">${d.revision||''}</td>
      <td style="padding:6px 8px;font-size:11px">
        <span style="padding:1px 8px;border-radius:10px;font-size:10px;font-weight:700;background:${d.status==='Goedgekeurd'?'#d1fae5':d.status==='Ter Review'?'#fef3c7':'#f1f5f9'};color:${d.status==='Goedgekeurd'?'#065f46':d.status==='Ter Review'?'#92400e':'#475569'}">${d.status||''}</span>
      </td>
    </tr>`
  ).join('');

  // TRA summary
  const traActs = acts.filter(a => (a.tra?.risks||[]).length > 0);
  const traHTML = traActs.map(a => {
    const tra = a.tra || {};
    const risks = tra.risks || [];
    const maxScore = risks.reduce((m,r)=>Math.max(m,(r.probability||1)*(r.severity||1)),0);
    const level = maxScore>=15?'KRITIEK':maxScore>=8?'HOOG':maxScore>=4?'MEDIUM':'LAAG';
    const levelColor = maxScore>=15?'#991b1b':maxScore>=8?'#92400e':maxScore>=4?'#1e40af':'#065f46';
    const levelBg = maxScore>=15?'#fee2e2':maxScore>=8?'#fef3c7':maxScore>=4?'#dbeafe':'#d1fae5';
    const permits = Object.entries(tra.permits||{}).filter(([,v])=>v).map(([k])=>k).join(', ');
    const ppe = Object.entries(tra.ppe||{}).filter(([,v])=>v).map(([k])=>k).join(', ');
    return `<tr style="border-bottom:1px solid #f1f5f9">
      <td style="padding:6px 12px;font-family:monospace;font-size:11px;font-weight:700;color:#2563eb">${a.activityId||''}</td>
      <td style="padding:6px 8px;font-size:12px">${a.overrideDescription||''}</td>
      <td style="padding:6px 8px;text-align:center;font-size:11px">${risks.length}</td>
      <td style="padding:6px 8px;text-align:center"><span style="padding:2px 8px;border-radius:10px;font-size:10px;font-weight:700;background:${levelBg};color:${levelColor}">${level}</span></td>
      <td style="padding:6px 8px;font-size:10px;color:#64748b">${permits||'—'}</td>
      <td style="padding:6px 8px;font-size:10px;color:#64748b">${ppe||'—'}</td>
      <td style="padding:6px 8px;text-align:center;font-size:11px">${tra.approved?'<span style="color:#22c55e;font-weight:700">✓ Goedgekeurd</span>':'<span style="color:#f97316">Wachtend</span>'}</td>
    </tr>`;
  }).join('');

  const html = `<!DOCTYPE html>
<html lang="nl">
<head>
<meta charset="UTF-8">
<title>Werkpakket ${item.tagNumber}</title>
<style>
  * { box-sizing:border-box; margin:0; padding:0; }
  body { font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif; color:#1e293b; background:white; font-size:13px; }
  .page { max-width:960px; margin:0 auto; padding:24px; }
  .header { background:linear-gradient(135deg,#1e3a5f,#2563eb); color:white; padding:24px; border-radius:12px; margin-bottom:20px; }
  .header h1 { font-size:22px; font-weight:800; margin-bottom:2px; }
  .header .tag { font-family:monospace; font-size:28px; font-weight:900; opacity:.9; }
  .meta-grid { display:grid; grid-template-columns:repeat(6,1fr); gap:0; border:1px solid #e2e8f0; border-radius:10px; overflow:hidden; margin-bottom:16px; }
  .meta-cell { padding:10px 14px; border-right:1px solid #e2e8f0; }
  .meta-cell:last-child { border-right:none; }
  .meta-cell label { font-size:9px; font-weight:700; text-transform:uppercase; letter-spacing:.05em; color:#94a3b8; display:block; margin-bottom:3px; }
  .meta-cell p { font-size:13px; font-weight:700; color:#1e293b; }
  .section { background:white; border:1px solid #e2e8f0; border-radius:10px; overflow:hidden; margin-bottom:16px; }
  .section-header { background:#f8fafc; padding:10px 16px; border-bottom:1px solid #e2e8f0; display:flex; align-items:center; justify-content:space-between; }
  .section-header h2 { font-size:13px; font-weight:700; color:#475569; text-transform:uppercase; letter-spacing:.05em; }
  table { width:100%; border-collapse:collapse; }
  th { background:#f8fafc; padding:7px 12px; font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:.04em; color:#94a3b8; text-align:left; border-bottom:1px solid #e2e8f0; }
  .sign-row { display:grid; grid-template-columns:repeat(3,1fr); gap:12px; margin-bottom:16px; }
  .sign-box { border:1px solid #e2e8f0; border-radius:8px; padding:14px; }
  .sign-box label { font-size:10px; font-weight:700; text-transform:uppercase; color:#94a3b8; display:block; margin-bottom:8px; }
  .sign-line { border-top:1.5px solid #cbd5e1; margin-top:32px; }
  .sign-sub { font-size:10px; color:#94a3b8; margin-top:4px; }
  .progress-bar { height:8px; background:#e2e8f0; border-radius:4px; overflow:hidden; }
  .progress-fill { height:100%; border-radius:4px; }
  .badge { display:inline-block; padding:2px 8px; border-radius:10px; font-size:10px; font-weight:700; }
  .footer { text-align:center; padding:16px; color:#94a3b8; font-size:10px; border-top:1px solid #e2e8f0; margin-top:20px; }
  @media print {
    body { -webkit-print-color-adjust:exact; print-color-adjust:exact; }
    .no-print { display:none !important; }
    .page { padding:0; }
    .page-break { page-break-before:always; }
  }
</style>
</head>
<body>
<div class="page">

  <!-- Print button -->
  <div class="no-print" style="text-align:right;margin-bottom:16px">
    <button onclick="window.print()" style="padding:10px 20px;background:#2563eb;color:white;border:none;border-radius:8px;font-weight:700;cursor:pointer;font-size:14px">🖨️ Afdrukken / Opslaan als PDF</button>
  </div>

  <!-- Header -->
  <div class="header">
    <div style="display:flex;justify-content:space-between;align-items:flex-start">
      <div>
        <div style="font-size:10px;opacity:.7;text-transform:uppercase;letter-spacing:.1em;margin-bottom:4px">WERKPAKKET</div>
        <div class="tag">${item.tagNumber}</div>
        <h1 style="margin-top:6px">${item.description}</h1>
        <p style="opacity:.7;font-size:12px;margin-top:4px">${project?.name || ''} · ${project?.p6ProjectCode || ''}</p>
      </div>
      <div style="text-align:right">
        <div style="font-size:10px;opacity:.7;margin-bottom:4px">Voortgang</div>
        <div style="font-size:40px;font-weight:900">${progressPct}%</div>
        <div style="font-size:11px;opacity:.7">${completedActs}/${acts.length} activiteiten klaar</div>
      </div>
    </div>
    <div style="margin-top:16px">
      <div style="background:rgba(255,255,255,.2);border-radius:4px;height:10px;overflow:hidden">
        <div style="background:rgba(255,255,255,.9);height:100%;border-radius:4px;width:${progressPct}%"></div>
      </div>
    </div>
  </div>

  <!-- Meta grid -->
  <div class="meta-grid">
    <div class="meta-cell"><label>Status</label><p>${item.status||'—'}</p></div>
    <div class="meta-cell"><label>Prioriteit</label><p>${item.priority||'—'}</p></div>
    <div class="meta-cell"><label>Discipline</label><p>${item.discipline||'—'}</p></div>
    <div class="meta-cell"><label>Systeem</label><p>${item.system||'—'}</p></div>
    <div class="meta-cell"><label>Area</label><p>${item.area||'—'}</p></div>
    <div class="meta-cell"><label>Totale kosten</label><p style="color:#059669">€${totalCost.toFixed(0)}</p></div>
  </div>
  <div class="meta-grid" style="margin-bottom:16px">
    <div class="meta-cell"><label>Activiteiten</label><p>${acts.length}</p></div>
    <div class="meta-cell"><label>Kritieke risico's</label><p style="color:${critRisks>0?'#ef4444':'#22c55e'}">${critRisks}</p></div>
    <div class="meta-cell"><label>Documenten</label><p>${docs.length}</p></div>
    <div class="meta-cell"><label>Contingency</label><p>${item.contingency?.percentage||0}%</p></div>
    <div class="meta-cell"><label>Workflow status</label><p>${item.workflowStatusId||'—'}</p></div>
    <div class="meta-cell"><label>Datum</label><p>${new Date().toLocaleDateString('nl-NL')}</p></div>
  </div>

  <!-- Activiteiten -->
  <div class="section">
    <div class="section-header">
      <h2>Activiteiten (${acts.length})</h2>
      <span style="font-size:11px;color:#94a3b8">${completedActs} afgerond · ${acts.filter(a=>a.executionStatus==='In Progress').length} bezig</span>
    </div>
    <table>
      <thead><tr>
        <th style="width:90px">ID</th><th>Omschrijving</th><th style="width:40px;text-align:center">Duur</th>
        <th style="width:50px;text-align:center">Res.</th><th style="width:70px;text-align:center">TRA</th>
        <th style="width:50px;text-align:center">Hold</th><th style="width:80px;text-align:center">Status</th>
      </tr></thead>
      <tbody>${actsHTML || '<tr><td colspan="7" style="padding:12px;text-align:center;color:#94a3b8">Geen activiteiten</td></tr>'}</tbody>
    </table>
  </div>

  ${(item.costRules||[]).length > 0 ? `
  <!-- Kosten -->
  <div class="section">
    <div class="section-header">
      <h2>Kostenbewaking</h2>
      <span style="font-weight:700;color:#059669">Totaal incl. cont.: €${totalCost.toFixed(0)}</span>
    </div>
    <table>
      <thead><tr><th>Omschrijving</th><th>Cat.</th><th style="text-align:right">Aantal</th><th style="text-align:right">Eenheid</th><th style="text-align:right">Tarief</th><th style="text-align:right">Totaal</th></tr></thead>
      <tbody>${costsHTML}</tbody>
      <tfoot>
        <tr style="background:#f8fafc;border-top:2px solid #e2e8f0">
          <td colspan="5" style="padding:8px 12px;text-align:right;font-weight:700;color:#475569">Subtotaal</td>
          <td style="padding:8px 12px;text-align:right;font-weight:700">€${sub.toFixed(0)}</td>
        </tr>
        <tr style="background:#f8fafc">
          <td colspan="5" style="padding:6px 12px;text-align:right;color:#94a3b8;font-size:11px">Contingency (${item.contingency?.percentage||0}%)</td>
          <td style="padding:6px 12px;text-align:right;color:#94a3b8;font-size:11px">€${cont.toFixed(0)}</td>
        </tr>
        <tr style="background:#f0fdf4;border-top:1px solid #bbf7d0">
          <td colspan="5" style="padding:8px 12px;text-align:right;font-weight:800;color:#065f46">TOTAAL</td>
          <td style="padding:8px 12px;text-align:right;font-weight:800;color:#059669;font-size:15px">€${totalCost.toFixed(0)}</td>
        </tr>
      </tfoot>
    </table>
  </div>` : ''}

  ${traActs.length > 0 ? `
  <!-- TRA -->
  <div class="section">
    <div class="section-header">
      <h2>TRA Samenvatting</h2>
      <span style="font-size:11px;color:#94a3b8">${allRisks.length} risico's · ${critRisks > 0 ? critRisks + ' kritiek' : 'geen kritiek'}</span>
    </div>
    <table>
      <thead><tr><th>Activiteit</th><th>Omschrijving</th><th style="text-align:center">Risks</th><th style="text-align:center">Niveau</th><th>Vergunningen</th><th>PBM</th><th style="text-align:center">Status</th></tr></thead>
      <tbody>${traHTML}</tbody>
    </table>
  </div>` : ''}

  ${docs.length > 0 ? `
  <!-- Documenten -->
  <div class="section">
    <div class="section-header"><h2>Documenten (${docs.length})</h2></div>
    <table>
      <thead><tr><th>Nr.</th><th>Titel</th><th>Type</th><th>Rev.</th><th>Status</th></tr></thead>
      <tbody>${docsHTML}</tbody>
    </table>
  </div>` : ''}

  <!-- Handtekeningen -->
  <div class="sign-row">
    ${['Werkvoorbereider','Supervisor / Toezichthouder','Safety Officer'].map(role => `
    <div class="sign-box">
      <label>${role}</label>
      <div style="height:10px"></div>
      <div class="sign-line"></div>
      <div class="sign-sub">Naam & handtekening</div>
      <div style="height:8px"></div>
      <div class="sign-line"></div>
      <div class="sign-sub">Datum</div>
    </div>`).join('')}
  </div>

  <div class="footer">
    Gegenereerd door ChemPrep v5.0 · ${new Date().toLocaleString('nl-NL')} · ${project?.name || ''} · Vertrouwelijk document
  </div>
</div>
</body></html>`;

  const win = window.open('', '_blank');
  win.document.write(html);
  win.document.close();
};


// ===== EARNED VALUE MANAGEMENT =====
const EVMPage = ({ scopeItems, project }) => {
  const [groupBy, setGroupBy] = useState('discipline'); // discipline | phase | all

  const evm = useMemo(() => {
    const projectStart = project?.startDate ? new Date(project.startDate) : new Date();
    const today = new Date();
    const elapsed = Math.max(1, Math.round((today - projectStart) / (1000*60*60*24)));

    // BAC = Budget at Completion
    const bac = scopeItems.reduce((s, item) => {
      const sub = (item.costRules||[]).reduce((ss,r)=>ss+(r.totaal||0),0);
      return s + sub * (1 + ((item.contingency?.percentage||0)/100));
    }, 0);

    const allActs = scopeItems.flatMap(item =>
      (item.plannedActivities||[]).map(a => ({
        ...a,
        _itemTag: item.tagNumber,
        _discipline: item.discipline || 'Overig',
        _cost: bac > 0 ? (((item.costRules||[]).reduce((s,r)=>s+(r.totaal||0),0) * (1+((item.contingency?.percentage||0)/100))) / Math.max((item.plannedActivities||[]).length, 1)) : 0
      }))
    );

    const totalActs = allActs.length || 1;
    const totalDur = allActs.reduce((s,a)=>s+(a.duration||1),0) || 1;

    // Planned Value (PV): how much should be done by now (linear spread)
    // Simplified: fraction of elapsed vs total duration
    const totalProjectDays = allActs.reduce((s,a)=>s+(a.duration||1),0) || 1;
    const pvPct = Math.min(1, elapsed / totalProjectDays);
    const pv = bac * pvPct;

    // Earned Value (EV): value of work actually completed
    const ev = allActs.reduce((s,a) => s + ((a.progress||0)/100) * a._cost, 0);

    // Actual Cost (AC): estimated – in real world this would come from time sheets
    // We approximate: AC = EV * 1.0..1.3 depending on status
    const completedActs = allActs.filter(a=>a.executionStatus==='Completed').length;
    const inProgActs = allActs.filter(a=>a.executionStatus==='In Progress').length;
    const acFactor = totalActs > 0 ? 1 + (inProgActs * 0.15 / totalActs) : 1;
    const ac = ev * acFactor;

    // Metrics
    const cv = ev - ac;          // Cost Variance
    const sv = ev - pv;          // Schedule Variance
    const cpi = ac > 0 ? ev/ac : 1; // Cost Performance Index
    const spi = pv > 0 ? ev/pv : 1; // Schedule Performance Index
    const etc = cpi > 0 ? (bac - ev) / cpi : (bac - ev); // Estimate to Complete
    const eac = ac + etc;         // Estimate at Completion
    const vac = bac - eac;        // Variance at Completion
    const tcpi = (bac - ev) > 0 ? (bac - ev) / (bac - ac) : 1; // To Complete PI

    return { bac, pv, ev, ac, cv, sv, cpi, spi, etc, eac, vac, tcpi, elapsed, pvPct, allActs };
  }, [scopeItems, project]);

  // Group data
  const groups = useMemo(() => {
    if (groupBy === 'all') return [];
    const keys = groupBy === 'discipline'
      ? [...new Set(scopeItems.map(i => i.discipline || 'Overig'))]
      : ['PRE-TA','UITBEDRIJF','TA','INBEDRIJF','POST-TA'];

    return keys.map(key => {
      const items = groupBy === 'discipline'
        ? scopeItems.filter(i => (i.discipline||'Overig') === key)
        : scopeItems;

      const acts = groupBy === 'discipline'
        ? evm.allActs.filter(a => a._discipline === key)
        : evm.allActs.filter(a => a.phase === key);

      const bac = items.reduce((s, item) => {
        if (groupBy === 'phase') return s;
        const sub = (item.costRules||[]).reduce((ss,r)=>ss+(r.totaal||0),0);
        return s + sub * (1+((item.contingency?.percentage||0)/100));
      }, groupBy === 'phase' ? acts.reduce((s,a)=>s+a._cost,0) : 0);

      const ev = acts.reduce((s,a) => s + ((a.progress||0)/100) * a._cost, 0);
      const cpi = acts.length > 0 ? Math.min(2, Math.max(0.1, 0.9 + (ev/Math.max(bac,1)) * 0.2)) : 1;
      const spi = acts.length > 0 ? Math.min(2, Math.max(0.1, (acts.filter(a=>a.executionStatus==='Completed').length / Math.max(acts.length,1)) / Math.max(evm.pvPct,0.01))) : 1;

      return { key, bac, ev, cpi, spi, acts: acts.length, completed: acts.filter(a=>a.executionStatus==='Completed').length };
    }).filter(g => g.bac > 0 || g.acts > 0);
  }, [scopeItems, evm, groupBy]);

  const fmt = (v) => v > 1000 ? `€${(v/1000).toFixed(0)}k` : `€${v.toFixed(0)}`;
  const pctFmt = (v) => `${(v*100).toFixed(0)}%`;
  const indexColor = (v) => v >= 1.0 ? 'text-green-600' : v >= 0.9 ? 'text-amber-600' : 'text-red-600';
  const indexBg = (v) => v >= 1.0 ? 'bg-green-50 border-green-200' : v >= 0.9 ? 'bg-amber-50 border-amber-200' : 'bg-red-50 border-red-200';

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Earned Value Management</h2>
          <p className="text-slate-500 text-sm mt-1">Project dag {evm.elapsed} · BAC: {fmt(evm.bac)}</p>
        </div>
        <div className="flex rounded-lg border border-slate-200 overflow-hidden text-xs">
          {[['discipline','Discipline'],['phase','Fase'],['all','Totaal']].map(([v,l]) => (
            <button key={v} onClick={() => setGroupBy(v)}
              className={`px-3 py-2 font-medium transition-colors ${groupBy===v?'bg-blue-600 text-white':'bg-white text-slate-600 hover:bg-slate-50'}`}>{l}</button>
          ))}
        </div>
      </div>

      {/* Big metric row */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label:'BAC (Budget)', value: fmt(evm.bac), sub:'Budget at Completion', color:'text-slate-700', bg:'bg-slate-50 border-slate-200' },
          { label:'PV (Gepland)', value: fmt(evm.pv), sub:`${pctFmt(evm.pvPct)} van BAC`, color:'text-blue-700', bg:'bg-blue-50 border-blue-200' },
          { label:'EV (Verdiend)', value: fmt(evm.ev), sub:'Earned Value', color:'text-emerald-700', bg:'bg-emerald-50 border-emerald-200' },
          { label:'AC (Actueel)', value: fmt(evm.ac), sub:'Actual Cost (geschat)', color:'text-amber-700', bg:'bg-amber-50 border-amber-200' },
        ].map(k => (
          <div key={k.label} className={`rounded-xl border p-4 ${k.bg}`}>
            <p className="text-xs font-bold text-slate-400 mb-1">{k.label}</p>
            <p className={`text-2xl font-bold ${k.color}`}>{k.value}</p>
            <p className="text-xs text-slate-400 mt-0.5">{k.sub}</p>
          </div>
        ))}
      </div>

      {/* Indices */}
      <div className="grid grid-cols-2 gap-4">
        <div className="grid grid-cols-2 gap-3">
          {[
            { label:'CPI', value: evm.cpi, desc:'Cost Performance Index', detail: evm.cpi >= 1 ? 'Onder budget' : 'Boven budget' },
            { label:'SPI', value: evm.spi, desc:'Schedule Performance Index', detail: evm.spi >= 1 ? 'Voor op schema' : 'Achter op schema' },
            { label:'TCPI', value: evm.tcpi, desc:'To Complete PI', detail: evm.tcpi > 1.1 ? 'Moeilijk haalbaar' : 'Haalbaar' },
          ].map(m => (
            <div key={m.label} className={`rounded-xl border p-4 ${indexBg(m.value)}`}>
              <p className="text-xs font-bold text-slate-400">{m.label}</p>
              <p className={`text-4xl font-black mt-1 ${indexColor(m.value)}`}>{m.value.toFixed(2)}</p>
              <p className="text-xs text-slate-500 mt-1">{m.desc}</p>
              <p className={`text-xs font-semibold mt-0.5 ${indexColor(m.value)}`}>{m.detail}</p>
            </div>
          ))}
          <div className={`rounded-xl border p-4 ${evm.vac >= 0 ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
            <p className="text-xs font-bold text-slate-400">VAC</p>
            <p className={`text-4xl font-black mt-1 ${evm.vac >= 0 ? 'text-green-600' : 'text-red-600'}`}>{fmt(Math.abs(evm.vac))}</p>
            <p className="text-xs text-slate-500 mt-1">Variance at Completion</p>
            <p className={`text-xs font-semibold mt-0.5 ${evm.vac >= 0 ? 'text-green-600' : 'text-red-600'}`}>{evm.vac >= 0 ? 'Naar verwachting onder budget' : 'Naar verwachting boven budget'}</p>
          </div>
        </div>

        {/* Forecast summary */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <h3 className="font-bold text-slate-900 mb-4">Prognose</h3>
          <div className="space-y-3 text-sm">
            {[
              { label:'BAC (origineel budget)', value: fmt(evm.bac), bold:false },
              { label:'EV (al verdiend)', value: fmt(evm.ev), bold:false },
              { label:'ETC (resterend, bij CPI)', value: fmt(evm.etc), bold:false, border:true },
              { label:'EAC (eindprognose)', value: fmt(evm.eac), bold:true },
              { label:'VAC (variantie)', value: (evm.vac>=0?'+':'')+fmt(evm.vac), bold:false, color: evm.vac>=0?'text-green-600':'text-red-600' },
            ].map(row => (
              <div key={row.label} className={`flex justify-between py-1.5 ${row.border?'border-t border-slate-200 pt-2 mt-1':''}`}>
                <span className={`${row.bold?'font-bold text-slate-900':'text-slate-600'}`}>{row.label}</span>
                <span className={`font-semibold ${row.color || (row.bold?'text-slate-900':'text-slate-700')}`}>{row.value}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 rounded-lg bg-blue-50 border border-blue-100 text-xs text-blue-700">
            <strong>Let op:</strong> AC is een schatting op basis van voortgang. Voor nauwkeurige EVM koppel met werkelijk geboekte uren.
          </div>
        </div>
      </div>

      {/* Group breakdown */}
      {groups.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-5 py-3 border-b border-slate-100 bg-slate-50">
            <h3 className="font-bold text-slate-900">EVM per {groupBy === 'discipline' ? 'Discipline' : 'Fase'}</h3>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase">{groupBy === 'discipline' ? 'Discipline' : 'Fase'}</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase">BAC</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase">EV</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-slate-500 uppercase">EV%</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-slate-500 uppercase">CPI</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-slate-500 uppercase">SPI</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Activiteiten</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {groups.map(g => {
                const evPct = g.bac > 0 ? Math.round((g.ev/g.bac)*100) : 0;
                return (
                  <tr key={g.key} className="hover:bg-slate-50">
                    <td className="px-5 py-3 font-semibold text-slate-800">{g.key}</td>
                    <td className="px-4 py-3 text-right text-slate-600 text-xs">{fmt(g.bac)}</td>
                    <td className="px-4 py-3 text-right text-emerald-700 font-semibold text-xs">{fmt(g.ev)}</td>
                    <td className="px-4 py-3 text-center text-xs">{evPct}%</td>
                    <td className={`px-4 py-3 text-center font-bold ${indexColor(g.cpi)}`}>{g.cpi.toFixed(2)}</td>
                    <td className={`px-4 py-3 text-center font-bold ${indexColor(g.spi)}`}>{g.spi.toFixed(2)}</td>
                    <td className="px-4 py-3 text-center text-xs text-slate-500">{g.completed}/{g.acts}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};


// ===== NOTIFICATION SYSTEM =====
const useNotifications = (scopeItems, project) => {
  return useMemo(() => {
    const alerts = [];
    const today = new Date();

    scopeItems.forEach(item => {
      const acts = item.plannedActivities || [];

      // Open hold points
      acts.filter(a => a.holdPoint && a.executionStatus !== 'Completed').forEach(a => {
        alerts.push({ id:`hp-${a.id}`, type:'hold', severity:'high',
          title: `Open Hold Point: ${a.activityId}`, detail: `${item.tagNumber} — ${a.overrideDescription}`, item: item.tagNumber });
      });

      // TRA's niet goedgekeurd + activiteit is gepland/bezig
      acts.filter(a => a.executionStatus !== 'Planned' && (a.tra?.risks||[]).length > 0 && !a.tra?.approved).forEach(a => {
        alerts.push({ id:`tra-${a.id}`, type:'tra', severity:'high',
          title: `TRA niet goedgekeurd: ${a.activityId}`, detail: `${item.tagNumber} — activiteit is ${a.executionStatus}`, item: item.tagNumber });
      });

      // Kritieke risico's zonder maatregel
      acts.forEach(a => {
        (a.tra?.risks||[]).filter(r => (r.probability||1)*(r.severity||1)>=15 && !r.measure).forEach((r,i) => {
          alerts.push({ id:`risk-${a.id}-${i}`, type:'risk', severity:'critical',
            title: `Kritiek risico zonder maatregel`, detail: `${item.tagNumber} · ${a.activityId} — ${r.hazard||'Onbekend gevaar'}`, item: item.tagNumber });
        });
      });

      // Geen kostenbewaking op In Scope items
      if (item.status === 'In Scope' && (item.costRules||[]).length === 0) {
        alerts.push({ id:`cost-${item.id}`, type:'cost', severity:'low',
          title: `Geen kosten opgevoerd`, detail: `${item.tagNumber} — ${item.description}`, item: item.tagNumber });
      }

      // In Progress activiteiten zonder voortgang > 0
      acts.filter(a => a.executionStatus === 'In Progress' && (a.progress||0) === 0).forEach(a => {
        alerts.push({ id:`prog-${a.id}`, type:'progress', severity:'medium',
          title: `Activiteit bezig maar 0% voortgang`, detail: `${item.tagNumber} · ${a.activityId}`, item: item.tagNumber });
      });

      // Documenten in Concept of Ter Review
      (item.documents||[]).filter(d => d.status === 'Concept').forEach(d => {
        alerts.push({ id:`doc-${d.id}`, type:'document', severity:'low',
          title: `Document nog in Concept`, detail: `${item.tagNumber} — ${d.title}`, item: item.tagNumber });
      });
    });

    // Sort: critical first
    const severityOrder = { critical:0, high:1, medium:2, low:3 };
    alerts.sort((a,b) => severityOrder[a.severity] - severityOrder[b.severity]);
    return alerts;
  }, [scopeItems, project]);
};

const NotificationsPage = ({ scopeItems, project }) => {
  const [filter, setFilter] = useState('all');
  const [dismissed, setDismissed] = useState(new Set());
  const alerts = useNotifications(scopeItems, project);

  const filtered = alerts.filter(a => {
    if (dismissed.has(a.id)) return false;
    if (filter === 'all') return true;
    return a.severity === filter || a.type === filter;
  });

  const dismiss = (id) => setDismissed(prev => new Set([...prev, id]));
  const dismissAll = () => setDismissed(new Set(filtered.map(a => a.id)));

  const sevStyle = {
    critical: { bg:'bg-red-50 border-red-200',    dot:'bg-red-500',    badge:'bg-red-100 text-red-700',    label:'Kritiek' },
    high:     { bg:'bg-orange-50 border-orange-200', dot:'bg-orange-500', badge:'bg-orange-100 text-orange-700', label:'Hoog' },
    medium:   { bg:'bg-yellow-50 border-yellow-200', dot:'bg-yellow-400', badge:'bg-yellow-100 text-yellow-700', label:'Medium' },
    low:      { bg:'bg-blue-50 border-blue-200',   dot:'bg-blue-400',   badge:'bg-blue-100 text-blue-700',   label:'Laag' },
  };
  const typeIcon = { hold:'🔴', tra:'🛡️', risk:'⚠️', cost:'💰', progress:'📊', document:'📄' };

  const counts = { critical: alerts.filter(a=>a.severity==='critical'&&!dismissed.has(a.id)).length, high: alerts.filter(a=>a.severity==='high'&&!dismissed.has(a.id)).length, medium: alerts.filter(a=>a.severity==='medium'&&!dismissed.has(a.id)).length, low: alerts.filter(a=>a.severity==='low'&&!dismissed.has(a.id)).length };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Notificaties & Alerts</h2>
          <p className="text-slate-500 text-sm mt-1">{filtered.length} actieve meldingen · {dismissed.size} genegeerd</p>
        </div>
        {filtered.length > 0 && (
          <button onClick={dismissAll} className="px-3 py-2 border border-slate-200 text-slate-600 rounded-lg text-sm hover:bg-slate-50">
            Alles negeren
          </button>
        )}
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-4 gap-3">
        {[['critical','Kritiek'],['high','Hoog'],['medium','Medium'],['low','Laag']].map(([sev,label]) => {
          const s = sevStyle[sev];
          return (
            <button key={sev} onClick={() => setFilter(filter===sev?'all':sev)}
              className={`rounded-xl border p-4 text-left transition-all ${filter===sev?'ring-2 ring-offset-1 ring-blue-500':''} ${s.bg}`}>
              <div className={`w-2.5 h-2.5 rounded-full ${s.dot} mb-2`} />
              <p className="text-2xl font-black text-slate-900">{counts[sev]}</p>
              <p className="text-xs font-semibold text-slate-500 mt-0.5">{label}</p>
            </button>
          );
        })}
      </div>

      {/* Filter row */}
      <div className="flex gap-2 flex-wrap">
        {[['all','Alle'], ['hold','Hold Points'], ['tra','TRA'], ['risk','Risico'], ['cost','Kosten'], ['progress','Voortgang'], ['document','Documenten']].map(([v,l]) => (
          <button key={v} onClick={() => setFilter(filter===v?'all':v)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${filter===v?'bg-slate-800 text-white border-slate-800':'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}>{l}</button>
        ))}
      </div>

      {/* Alert list */}
      {filtered.length === 0 ? (
        <div className="bg-green-50 border border-green-200 rounded-xl p-12 text-center">
          <p className="text-4xl mb-3">✅</p>
          <p className="font-bold text-green-800">Geen actieve meldingen</p>
          <p className="text-green-600 text-sm mt-1">Alles ziet er goed uit!</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(alert => {
            const s = sevStyle[alert.severity];
            return (
              <div key={alert.id} className={`flex items-start gap-3 p-3.5 rounded-xl border ${s.bg} hover:opacity-90 transition-opacity`}>
                <span className="text-xl shrink-0 mt-0.5">{typeIcon[alert.type]}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${s.badge}`}>{s.label}</span>
                    <p className="font-semibold text-slate-900 text-sm">{alert.title}</p>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5 font-mono">{alert.detail}</p>
                </div>
                <button onClick={() => dismiss(alert.id)} className="shrink-0 p-1 hover:bg-black/10 rounded text-slate-400 hover:text-slate-600">
                  <X className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};


// ===== PREDECESSORS & CRITICAL PATH =====
const CriticalPathPage = ({ scopeItems, setScopeItems }) => {
  const toast = useToast();
  const [selectedAct, setSelectedAct] = useState(null);
  const [showLinkModal, setShowLinkModal] = useState(false);

  // Flatten all activities
  const allActs = useMemo(() =>
    scopeItems.flatMap(item =>
      (item.plannedActivities||[]).map(a => ({
        ...a, _itemId: item.id, _itemTag: item.tagNumber, _itemDesc: item.description
      }))
    ), [scopeItems]);

  // CPM calculation
  const cpm = useMemo(() => {
    if (allActs.length === 0) return { acts: [], criticalPath: [], totalDuration: 0 };

    const actMap = {};
    allActs.forEach(a => actMap[a.activityId] = { ...a, es:0, ef:0, ls:0, lf:0, float:0 });

    // Forward pass
    allActs.forEach(a => {
      const preds = (a.predecessors||[]);
      const act = actMap[a.activityId];
      if (preds.length === 0) {
        act.es = 0;
      } else {
        act.es = Math.max(...preds.map(pid => (actMap[pid]?.ef) || 0));
      }
      act.ef = act.es + (a.duration||1);
    });

    const projectEnd = Math.max(...Object.values(actMap).map(a => a.ef), 0);

    // Backward pass
    Object.values(actMap).forEach(a => { a.lf = projectEnd; a.ls = projectEnd - (a.duration||1); });
    // Simple backward pass
    [...allActs].reverse().forEach(a => {
      const act = actMap[a.activityId];
      const successors = allActs.filter(s => (s.predecessors||[]).includes(a.activityId));
      if (successors.length === 0) {
        act.lf = projectEnd;
      } else {
        act.lf = Math.min(...successors.map(s => actMap[s.activityId]?.ls ?? projectEnd));
      }
      act.ls = act.lf - (a.duration||1);
      act.float = act.ls - act.es;
    });

    const criticalPath = Object.values(actMap).filter(a => a.float === 0).map(a => a.activityId);
    return { acts: Object.values(actMap), criticalPath, totalDuration: projectEnd };
  }, [allActs]);

  const addLink = (fromId, toId) => {
    const toAct = allActs.find(a => a.activityId === toId);
    if (!toAct) return;
    if ((toAct.predecessors||[]).includes(fromId)) { toast.info('Afhankelijkheid bestaat al'); return; }
    if (fromId === toId) { toast.error('Activiteit kan geen voorganger van zichzelf zijn'); return; }

    setScopeItems(prev => prev.map(item => {
      if (item.id !== toAct._itemId) return item;
      return { ...item, plannedActivities: (item.plannedActivities||[]).map(a => {
        if (a.activityId !== toId) return a;
        return { ...a, predecessors: [...(a.predecessors||[]), fromId] };
      })};
    }));
    toast.success(`Koppeling: ${fromId} → ${toId}`);
    setShowLinkModal(false);
  };

  const removeLink = (actId, predId) => {
    const act = allActs.find(a => a.activityId === actId);
    if (!act) return;
    setScopeItems(prev => prev.map(item => {
      if (item.id !== act._itemId) return item;
      return { ...item, plannedActivities: (item.plannedActivities||[]).map(a => {
        if (a.activityId !== actId) return a;
        return { ...a, predecessors: (a.predecessors||[]).filter(p => p !== predId) };
      })};
    }));
  };

  const isCritical = (id) => cpm.criticalPath.includes(id);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Predecessors & Kritisch Pad</h2>
          <p className="text-slate-500 text-sm mt-1">Projectduur: <strong>{cpm.totalDuration} dagen</strong> · {cpm.criticalPath.length} activiteiten op kritisch pad</p>
        </div>
        {selectedAct && (
          <button onClick={() => setShowLinkModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
            <Plus className="w-4 h-4" /> Koppeling toevoegen
          </button>
        )}
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-xs font-bold text-red-400 mb-1">KRITISCH PAD</p>
          <p className="text-3xl font-black text-red-600">{cpm.criticalPath.length}</p>
          <p className="text-xs text-red-400 mt-0.5">activiteiten (0 float)</p>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <p className="text-xs font-bold text-blue-400 mb-1">PROJECTDUUR</p>
          <p className="text-3xl font-black text-blue-600">{cpm.totalDuration}d</p>
          <p className="text-xs text-blue-400 mt-0.5">{Math.ceil(cpm.totalDuration/7)} weken</p>
        </div>
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
          <p className="text-xs font-bold text-slate-400 mb-1">KOPPELINGEN</p>
          <p className="text-3xl font-black text-slate-700">{allActs.reduce((s,a)=>s+(a.predecessors||[]).length,0)}</p>
          <p className="text-xs text-slate-400 mt-0.5">FS-relaties totaal</p>
        </div>
      </div>

      {/* Kritisch pad banner */}
      {cpm.criticalPath.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <h3 className="font-bold text-red-800 mb-2 text-sm flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-red-500" />Kritisch Pad</h3>
          <div className="flex flex-wrap gap-2">
            {cpm.criticalPath.map((id,i) => (
              <span key={id} className="flex items-center gap-1 text-xs">
                <span className="px-2 py-1 bg-red-200 text-red-800 rounded font-mono font-bold">{id}</span>
                {i < cpm.criticalPath.length-1 && <span className="text-red-400">→</span>}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Activities table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-100 bg-slate-50">
          <p className="text-xs text-slate-400">Klik op een activiteit om koppelingen te beheren</p>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase w-28">ID</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Omschrijving</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase w-20">Scope</th>
              <th className="text-center px-4 py-3 text-xs font-semibold text-slate-500 uppercase w-12">Dur</th>
              <th className="text-center px-4 py-3 text-xs font-semibold text-slate-500 uppercase w-12">ES</th>
              <th className="text-center px-4 py-3 text-xs font-semibold text-slate-500 uppercase w-12">EF</th>
              <th className="text-center px-4 py-3 text-xs font-semibold text-slate-500 uppercase w-16">Float</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Voorgangers</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {cpm.acts.map(act => {
              const crit = isCritical(act.activityId);
              const isSelected = selectedAct === act.activityId;
              return (
                <tr key={act.activityId}
                  onClick={() => setSelectedAct(isSelected ? null : act.activityId)}
                  className={`cursor-pointer transition-colors ${isSelected?'bg-blue-50':crit?'bg-red-50/50 hover:bg-red-50':'hover:bg-slate-50'}`}>
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-1.5">
                      {crit && <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />}
                      <span className={`font-mono text-xs font-bold ${crit?'text-red-600':'text-blue-600'}`}>{act.activityId}</span>
                    </div>
                  </td>
                  <td className="px-4 py-2.5 text-slate-700 truncate max-w-xs">{act.overrideDescription}</td>
                  <td className="px-4 py-2.5 font-mono text-xs text-slate-400">{act._itemTag}</td>
                  <td className="px-4 py-2.5 text-center text-xs text-slate-500">{act.duration||1}d</td>
                  <td className="px-4 py-2.5 text-center text-xs text-slate-500">{act.es}</td>
                  <td className="px-4 py-2.5 text-center text-xs text-slate-500">{act.ef}</td>
                  <td className={`px-4 py-2.5 text-center text-xs font-bold ${act.float===0?'text-red-600':act.float<=2?'text-orange-500':'text-slate-400'}`}>{act.float}d</td>
                  <td className="px-4 py-2.5">
                    <div className="flex flex-wrap gap-1">
                      {(act.predecessors||[]).map(pid => (
                        <span key={pid} className="flex items-center gap-1 bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded text-xs font-mono">
                          {pid}
                          {isSelected && <button onClick={e=>{e.stopPropagation();removeLink(act.activityId,pid);}} className="text-red-400 hover:text-red-600"><X className="w-3 h-3" /></button>}
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Link modal */}
      {showLinkModal && selectedAct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-900">Voorganger toevoegen aan <span className="text-blue-600 font-mono">{selectedAct}</span></h3>
              <button onClick={() => setShowLinkModal(false)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <p className="text-xs text-slate-500 mb-3">Klik op een activiteit om deze als voorganger in te stellen (Finish-to-Start):</p>
            <div className="max-h-80 overflow-y-auto space-y-1">
              {cpm.acts.filter(a => a.activityId !== selectedAct && !(allActs.find(x=>x.activityId===selectedAct)?.predecessors||[]).includes(a.activityId)).map(a => (
                <button key={a.activityId} onClick={() => addLink(a.activityId, selectedAct)}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-blue-50 border border-transparent hover:border-blue-200 flex items-center gap-2 transition-colors">
                  <span className={`font-mono text-xs font-bold ${isCritical(a.activityId)?'text-red-600':'text-blue-600'}`}>{a.activityId}</span>
                  <span className="text-sm text-slate-600 truncate">{a.overrideDescription}</span>
                  <span className="ml-auto text-xs text-slate-400">{a.duration||1}d</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


// ===== BACKUP & RESTORE =====
const BackupRestore = ({ projects, scopeItems, resources, templates, setProjects, setScopeItems, setResources }) => {
  const toast = useToast();
  const [restorePreview, setRestorePreview] = useState(null);
  const [dragOver, setDragOver] = useState(false);

  const exportBackup = () => {
    const backup = {
      version: '5.0',
      exportedAt: new Date().toISOString(),
      appName: 'ChemPrep',
      data: {
        projects,
        scopeItems,
        resources,
        templates,
        users: (() => { try { return JSON.parse(localStorage.getItem('chemprep_users')||'[]'); } catch { return []; } })(),
        changelog: (() => { try { return JSON.parse(localStorage.getItem('chemprep_changelog')||'[]').slice(0,100); } catch { return []; } })(),
      }
    };
    const json = JSON.stringify(backup, null, 2);
    const blob = new Blob([json], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ChemPrep_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a); a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Backup gedownload', `${projects.length} projecten · ${scopeItems.length} scope items`);
  };

  const handleFile = (file) => {
    if (!file || !file.name.endsWith('.json')) { toast.error('Selecteer een .json bestand'); return; }
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target.result);
        if (!parsed.data || !parsed.version) throw new Error('Ongeldig formaat');
        setRestorePreview(parsed);
      } catch(err) {
        toast.error('Ongeldig bestand: ' + err.message);
      }
    };
    reader.readAsText(file);
  };

  const confirmRestore = () => {
    if (!restorePreview) return;
    const d = restorePreview.data;
    if (d.projects) setProjects(d.projects);
    if (d.scopeItems) setScopeItems(d.scopeItems);
    if (d.resources) setResources(d.resources);
    if (d.users) localStorage.setItem('chemprep_users', JSON.stringify(d.users));
    if (d.changelog) localStorage.setItem('chemprep_changelog', JSON.stringify(d.changelog));
    toast.success('Backup hersteld!', `${(d.projects||[]).length} projecten · ${(d.scopeItems||[]).length} scope items`);
    setRestorePreview(null);
  };

  const autoBackups = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('chemprep_autobackups')||'[]');
    } catch { return []; }
  }, []);

  const createAutoBackup = () => {
    const backup = { ts: new Date().toISOString(), projects: projects.length, scopeItems: scopeItems.length };
    const prev = (() => { try { return JSON.parse(localStorage.getItem('chemprep_autobackups')||'[]'); } catch { return []; } })();
    const updated = [backup, ...prev].slice(0,5);
    localStorage.setItem('chemprep_autobackups', JSON.stringify(updated));
    toast.success('Auto-backup aangemaakt', new Date().toLocaleString('nl-NL'));
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Backup & Restore</h2>
        <p className="text-slate-500 text-sm mt-1">Exporteer en herstel alle projectdata als JSON</p>
      </div>

      {/* Current data stats */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label:'Projecten', value: projects.length, color:'text-blue-600', bg:'bg-blue-50 border-blue-200' },
          { label:'Scope items', value: scopeItems.length, color:'text-emerald-600', bg:'bg-emerald-50 border-emerald-200' },
          { label:'Activiteiten', value: scopeItems.reduce((s,i)=>s+(i.plannedActivities||[]).length,0), color:'text-purple-600', bg:'bg-purple-50 border-purple-200' },
          { label:'Resources', value: resources.length, color:'text-amber-600', bg:'bg-amber-50 border-amber-200' },
        ].map(k => (
          <div key={k.label} className={`rounded-xl border p-4 ${k.bg}`}>
            <p className="text-xs font-medium text-slate-400 mb-1">{k.label}</p>
            <p className={`text-2xl font-bold ${k.color}`}>{k.value}</p>
          </div>
        ))}
      </div>

      {/* Export */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
        <h3 className="font-bold text-slate-900 mb-1">Backup exporteren</h3>
        <p className="text-sm text-slate-500 mb-4">Download een volledig JSON-backup van alle projecten, scope items, activiteiten, kosten, TRA's, documenten en gebruikers.</p>
        <div className="flex gap-3">
          <button onClick={exportBackup}
            className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700">
            <Download className="w-4 h-4" /> Download backup (.json)
          </button>
          <button onClick={createAutoBackup}
            className="flex items-center gap-2 px-4 py-2.5 border border-slate-200 text-slate-600 rounded-lg text-sm hover:bg-slate-50">
            <Clock className="w-4 h-4" /> Markeer als auto-backup
          </button>
        </div>
      </div>

      {/* Import */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
        <h3 className="font-bold text-slate-900 mb-1">Backup herstellen</h3>
        <p className="text-sm text-slate-500 mb-4">Laad een eerder gedownload .json backup bestand. <strong className="text-red-600">Let op: dit overschrijft alle huidige data!</strong></p>

        <div
          onDragOver={e=>{e.preventDefault();setDragOver(true);}}
          onDragLeave={()=>setDragOver(false)}
          onDrop={e=>{e.preventDefault();setDragOver(false);handleFile(e.dataTransfer.files[0]);}}
          className={`border-2 border-dashed rounded-xl p-10 text-center transition-colors ${dragOver?'border-blue-400 bg-blue-50':'border-slate-200 hover:border-slate-300'}`}>
          <p className="text-slate-400 mb-3">Sleep een .json bestand hierheen of</p>
          <label className="cursor-pointer px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
            Kies bestand
            <input type="file" accept=".json" className="hidden" onChange={e=>handleFile(e.target.files[0])} />
          </label>
        </div>
      </div>

      {/* Restore preview modal */}
      {restorePreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <h3 className="font-bold text-slate-900 mb-4">Backup herstellen?</h3>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4 space-y-1 text-sm">
              <p><strong>Versie:</strong> {restorePreview.version}</p>
              <p><strong>Geëxporteerd:</strong> {new Date(restorePreview.exportedAt).toLocaleString('nl-NL')}</p>
              <p><strong>Projecten:</strong> {(restorePreview.data.projects||[]).length}</p>
              <p><strong>Scope items:</strong> {(restorePreview.data.scopeItems||[]).length}</p>
              <p><strong>Activiteiten:</strong> {(restorePreview.data.scopeItems||[]).reduce((s,i)=>s+(i.plannedActivities||[]).length,0)}</p>
            </div>
            <p className="text-sm text-red-600 font-semibold mb-4">⚠️ Huidige data wordt overschreven. Dit kan niet ongedaan worden gemaakt.</p>
            <div className="flex gap-3">
              <button onClick={() => setRestorePreview(null)} className="flex-1 px-4 py-2.5 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50">Annuleren</button>
              <button onClick={confirmRestore} className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700">Herstellen</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


// ===== MOBILE SIDEBAR TOGGLE =====
// This hook detects mobile width and exposes sidebar collapsed state
const useMobileLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  useEffect(() => {
    const check = () => {
      if (window.innerWidth < 768) setSidebarOpen(false);
      else setSidebarOpen(true);
    };
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);
  return { sidebarOpen, setSidebarOpen };
};


// ===== MATERIAL MANAGEMENT =====
const MATERIAL_STATUSES = [
  { id: 'not_ordered',  label: 'Niet besteld',   color: 'text-slate-600',  bg: 'bg-slate-100',  border: 'border-slate-200' },
  { id: 'requested',   label: 'Aangevraagd',     color: 'text-blue-700',   bg: 'bg-blue-100',   border: 'border-blue-200'  },
  { id: 'ordered',     label: 'Besteld',         color: 'text-amber-700',  bg: 'bg-amber-100',  border: 'border-amber-200' },
  { id: 'delivered',   label: 'Geleverd',        color: 'text-emerald-700',bg: 'bg-emerald-100',border: 'border-emerald-200'},
  { id: 'installed',   label: 'Gemonteerd',      color: 'text-purple-700', bg: 'bg-purple-100', border: 'border-purple-200'},
  { id: 'returned',    label: 'Retour',          color: 'text-orange-700', bg: 'bg-orange-100', border: 'border-orange-200'},
];

const MATERIAL_CATEGORIES = ['Pakkingen','Bouten & moeren','Afsluiters','Instrumenten','Flenzen','Leidingwerk','Isolatie','Elektrisch','Gereedschap','Overig'];

const MaterialManagement = ({ scopeItems, materials, setMaterials, setScopeItems }) => {
  const toast = useToast();
  const [view, setView]             = useState('overview');  // overview | catalog | orders
  const [search, setSearch]         = useState('');
  const [catFilter, setCatFilter]   = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAddMat, setShowAddMat] = useState(false);
  const [editMat, setEditMat]       = useState(null);
  const [matForm, setMatForm]       = useState({ description:'', articleNumber:'', supplier:'', category:'Overig', unit:'st', price:'', minStock:'', notes:'' });

  // ── Flatten all material assignments across all scope items / activities ──
  const allAssignments = useMemo(() => {
    const list = [];
    scopeItems.forEach(item => {
      (item.plannedActivities || []).forEach(act => {
        (act.materials || []).forEach(ma => {
          const mat = materials.find(m => m.id === ma.materialId);
          if (!mat) return;
          list.push({
            ...ma,
            _matId: mat.id,
            _matDesc: mat.description,
            _matArticle: mat.articleNumber,
            _matSupplier: mat.supplier,
            _matUnit: mat.unit,
            _matPrice: mat.price || 0,
            _matCategory: mat.category || 'Overig',
            _actId: act.activityId,
            _actDesc: act.overrideDescription,
            _itemId: item.id,
            _itemTag: item.tagNumber,
            _itemDesc: item.description,
            _phase: act.phase,
            status: ma.status || 'not_ordered',
            orderRef: ma.orderRef || '',
            expectedDate: ma.expectedDate || '',
            deliveredQty: ma.deliveredQty || 0,
          });
        });
      });
    });
    return list;
  }, [scopeItems, materials]);

  const updateAssignment = (assignmentId, itemId, actId, updates) => {
    setScopeItems(prev => prev.map(item => {
      if (item.id !== itemId) return item;
      return { ...item, plannedActivities: (item.plannedActivities||[]).map(act => {
        if (act.activityId !== actId) return act;
        return { ...act, materials: (act.materials||[]).map(ma =>
          ma.id === assignmentId ? { ...ma, ...updates } : ma
        )};
      })};
    }));
  };

  const saveMatForm = () => {
    if (!matForm.description) { toast.error('Omschrijving is verplicht'); return; }
    if (editMat) {
      setMaterials(prev => prev.map(m => m.id === editMat.id ? { ...m, ...matForm, price: parseFloat(matForm.price)||0 } : m));
      toast.success('Materiaal bijgewerkt', matForm.description);
    } else {
      const newMat = { id: 'mat-' + Date.now(), ...matForm, price: parseFloat(matForm.price)||0 };
      setMaterials(prev => [...prev, newMat]);
      toast.success('Materiaal toegevoegd', matForm.description);
    }
    setShowAddMat(false); setEditMat(null);
    setMatForm({ description:'', articleNumber:'', supplier:'', category:'Overig', unit:'st', price:'', minStock:'', notes:'' });
  };

  const openEdit = (m) => {
    setMatForm({ description:m.description, articleNumber:m.articleNumber||'', supplier:m.supplier||'', category:m.category||'Overig', unit:m.unit||'st', price:m.price||'', minStock:m.minStock||'', notes:m.notes||'' });
    setEditMat(m); setShowAddMat(true);
  };

  // Stats
  const stats = useMemo(() => {
    const byStatus = {};
    MATERIAL_STATUSES.forEach(s => { byStatus[s.id] = allAssignments.filter(a => a.status === s.id).length; });
    const totalValue = allAssignments.reduce((s,a) => s + (a._matPrice * (a.quantity||1)), 0);
    const deliveredValue = allAssignments.filter(a=>['delivered','installed'].includes(a.status)).reduce((s,a)=>s+(a._matPrice*(a.quantity||1)),0);
    return { ...byStatus, total: allAssignments.length, totalValue, deliveredValue };
  }, [allAssignments]);

  const filteredAssignments = allAssignments.filter(a => {
    if (statusFilter !== 'all' && a.status !== statusFilter) return false;
    if (search && !a._matDesc.toLowerCase().includes(search.toLowerCase()) &&
        !a._itemTag.toLowerCase().includes(search.toLowerCase()) &&
        !a._matArticle.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const filteredMaterials = materials.filter(m => {
    if (catFilter !== 'all' && (m.category||'Overig') !== catFilter) return false;
    if (search && !m.description.toLowerCase().includes(search.toLowerCase()) &&
        !(m.articleNumber||'').toLowerCase().includes(search.toLowerCase()) &&
        !(m.supplier||'').toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const statStyle = (id) => MATERIAL_STATUSES.find(s=>s.id===id) || MATERIAL_STATUSES[0];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Material Management</h2>
          <p className="text-slate-500 text-sm mt-1">{allAssignments.length} materiaalregels · {materials.length} artikelen in catalogus</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-lg border border-slate-200 overflow-hidden text-xs">
            {[['overview','Overzicht'],['catalog','Catalogus'],['orders','Bestellingen']].map(([v,l]) => (
              <button key={v} onClick={() => setView(v)}
                className={`px-3 py-2 font-medium transition-colors ${view===v?'bg-blue-600 text-white':'bg-white text-slate-600 hover:bg-slate-50'}`}>{l}</button>
            ))}
          </div>
          {view === 'catalog' && (
            <button onClick={() => { setEditMat(null); setMatForm({ description:'',articleNumber:'',supplier:'',category:'Overig',unit:'st',price:'',minStock:'',notes:'' }); setShowAddMat(true); }}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
              <Plus className="w-4 h-4" /> Artikel toevoegen
            </button>
          )}
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-6 gap-3">
        {[
          { label:'Totaal', value: stats.total, color:'text-slate-700', bg:'bg-slate-50 border-slate-200' },
          ...MATERIAL_STATUSES.map(s => ({ label: s.label, value: stats[s.id]||0, color: s.color, bg: `${s.bg} ${s.border} border` }))
        ].map(k => (
          <button key={k.label} onClick={() => setStatusFilter(prev => prev === k.label ? 'all' : (MATERIAL_STATUSES.find(s=>s.label===k.label)?.id||'all'))}
            className={`rounded-xl border p-3 text-left ${k.bg}`}>
            <p className="text-xs font-medium text-slate-400 leading-tight">{k.label}</p>
            <p className={`text-2xl font-black mt-1 ${k.color}`}>{k.value}</p>
          </button>
        ))}
      </div>

      {/* Value summary */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label:'Totale materiaalwaarde', value:`€${stats.totalValue.toLocaleString('nl-NL',{maximumFractionDigits:0})}`, sub:'alle regels incl. qty', color:'text-slate-700', bg:'bg-slate-50 border-slate-200' },
          { label:'Waarde geleverd', value:`€${stats.deliveredValue.toLocaleString('nl-NL',{maximumFractionDigits:0})}`, sub:`${stats.totalValue>0?Math.round((stats.deliveredValue/stats.totalValue)*100):0}% van totaal`, color:'text-emerald-600', bg:'bg-emerald-50 border-emerald-200' },
          { label:'Nog te leveren', value:`€${(stats.totalValue-stats.deliveredValue).toLocaleString('nl-NL',{maximumFractionDigits:0})}`, sub:'open orders + niet besteld', color:'text-amber-600', bg:'bg-amber-50 border-amber-200' },
        ].map(k => (
          <div key={k.label} className={`rounded-xl border p-4 ${k.bg}`}>
            <p className="text-xs font-medium text-slate-400 mb-1">{k.label}</p>
            <p className={`text-2xl font-bold ${k.color}`}>{k.value}</p>
            <p className="text-xs text-slate-400 mt-0.5">{k.sub}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input type="text" placeholder="Zoeken op omschrijving, artikelnummer, tag..." value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm bg-white" />
        </div>
        {view === 'catalog' && (
          <select value={catFilter} onChange={e => setCatFilter(e.target.value)} className="px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white">
            <option value="all">Alle categorieën</option>
            {MATERIAL_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        )}
        {view !== 'catalog' && (
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white">
            <option value="all">Alle statussen</option>
            {MATERIAL_STATUSES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
          </select>
        )}
      </div>

      {/* ── OVERVIEW VIEW ─────────────────────────────────────────────────── */}
      {view === 'overview' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Materiaal</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Scope / Activiteit</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Fase</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Qty</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Waarde</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Status</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Bestelnr.</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Verwacht</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredAssignments.length === 0 ? (
                <tr><td colSpan="8" className="px-4 py-12 text-center text-slate-400">Geen materialen gevonden</td></tr>
              ) : filteredAssignments.map(a => {
                const ss = statStyle(a.status);
                return (
                  <tr key={`${a._itemId}-${a._actId}-${a.id}`} className="hover:bg-slate-50">
                    <td className="px-4 py-2.5">
                      <p className="font-medium text-slate-800 text-xs">{a._matDesc}</p>
                      <p className="text-xs text-slate-400 font-mono">{a._matArticle} · {a._matSupplier}</p>
                    </td>
                    <td className="px-4 py-2.5">
                      <p className="font-mono text-xs font-bold text-blue-600">{a._itemTag}</p>
                      <p className="text-xs text-slate-400 truncate max-w-32">{a._actId}</p>
                    </td>
                    <td className="px-4 py-2.5 text-xs text-slate-500">{a._phase}</td>
                    <td className="px-4 py-2.5 text-center">
                      <input type="number" min="1" value={a.quantity||1}
                        onChange={e => updateAssignment(a.id, a._itemId, a._actId, { quantity: parseInt(e.target.value)||1 })}
                        className="w-14 text-center border border-slate-200 rounded px-1 py-0.5 text-xs" />
                      <span className="text-xs text-slate-400 ml-1">{a._matUnit}</span>
                    </td>
                    <td className="px-4 py-2.5 text-right text-xs font-semibold text-emerald-700">
                      €{(a._matPrice * (a.quantity||1)).toFixed(0)}
                    </td>
                    <td className="px-4 py-2.5 text-center">
                      <select value={a.status}
                        onChange={e => updateAssignment(a.id, a._itemId, a._actId, { status: e.target.value })}
                        className={`px-2 py-1 rounded-full text-xs font-bold border ${ss.bg} ${ss.color} ${ss.border} cursor-pointer`}>
                        {MATERIAL_STATUSES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                      </select>
                    </td>
                    <td className="px-4 py-2.5">
                      <input type="text" placeholder="PO-nr..." value={a.orderRef}
                        onChange={e => updateAssignment(a.id, a._itemId, a._actId, { orderRef: e.target.value })}
                        className="w-28 border border-slate-200 rounded px-2 py-0.5 text-xs" />
                    </td>
                    <td className="px-4 py-2.5 text-center">
                      <input type="date" value={a.expectedDate}
                        onChange={e => updateAssignment(a.id, a._itemId, a._actId, { expectedDate: e.target.value })}
                        className="border border-slate-200 rounded px-1 py-0.5 text-xs" />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* ── CATALOG VIEW ──────────────────────────────────────────────────── */}
      {view === 'catalog' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Omschrijving</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Artikelnr.</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Leverancier</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Categorie</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Eenheid</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Prijs</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Gebruikt</th>
                <th className="px-4 py-3 w-16"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredMaterials.map(m => {
                const usages = allAssignments.filter(a => a._matId === m.id);
                return (
                  <tr key={m.id} className="hover:bg-slate-50">
                    <td className="px-4 py-2.5 font-medium text-slate-800">{m.description}</td>
                    <td className="px-4 py-2.5 font-mono text-xs text-slate-500">{m.articleNumber||'—'}</td>
                    <td className="px-4 py-2.5 text-xs text-slate-500">{m.supplier||'—'}</td>
                    <td className="px-4 py-2.5"><span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full text-xs">{m.category||'Overig'}</span></td>
                    <td className="px-4 py-2.5 text-center text-xs text-slate-500">{m.unit||'st'}</td>
                    <td className="px-4 py-2.5 text-right font-semibold text-emerald-700">€{(m.price||0).toFixed(2)}</td>
                    <td className="px-4 py-2.5 text-center">
                      {usages.length > 0
                        ? <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">{usages.length}×</span>
                        : <span className="text-slate-300 text-xs">—</span>}
                    </td>
                    <td className="px-4 py-2.5 text-right">
                      <button onClick={() => openEdit(m)} className="p-1.5 hover:bg-blue-50 rounded text-blue-500"><Edit2 className="w-3.5 h-3.5" /></button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* ── ORDERS VIEW ───────────────────────────────────────────────────── */}
      {view === 'orders' && (
        <div className="space-y-4">
          {/* Group by supplier */}
          {(() => {
            const bySupplier = {};
            filteredAssignments.filter(a => ['requested','ordered'].includes(a.status)).forEach(a => {
              const sup = a._matSupplier || 'Onbekend';
              if (!bySupplier[sup]) bySupplier[sup] = [];
              bySupplier[sup].push(a);
            });
            const entries = Object.entries(bySupplier);
            if (entries.length === 0) return (
              <div className="bg-green-50 border border-green-200 rounded-xl p-12 text-center">
                <p className="text-3xl mb-2">✅</p>
                <p className="font-bold text-green-800">Geen openstaande bestellingen</p>
              </div>
            );
            return entries.map(([supplier, items]) => {
              const total = items.reduce((s,a)=>s+(a._matPrice*(a.quantity||1)),0);
              return (
                <div key={supplier} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                  <div className="px-5 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                    <h3 className="font-bold text-slate-900">{supplier}</h3>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-slate-400">{items.length} regels</span>
                      <span className="font-bold text-emerald-700">€{total.toFixed(0)}</span>
                    </div>
                  </div>
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-slate-100">
                        <th className="text-left px-4 py-2 font-semibold text-slate-400 uppercase">Materiaal</th>
                        <th className="text-center px-4 py-2 font-semibold text-slate-400 uppercase">Qty</th>
                        <th className="text-right px-4 py-2 font-semibold text-slate-400 uppercase">Waarde</th>
                        <th className="text-center px-4 py-2 font-semibold text-slate-400 uppercase">Status</th>
                        <th className="text-left px-4 py-2 font-semibold text-slate-400 uppercase">Bestelnr.</th>
                        <th className="text-center px-4 py-2 font-semibold text-slate-400 uppercase">Verwacht</th>
                        <th className="text-left px-4 py-2 font-semibold text-slate-400 uppercase">Scope</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {items.map(a => {
                        const ss = statStyle(a.status);
                        return (
                          <tr key={`${a._itemId}-${a._actId}-${a.id}`} className="hover:bg-slate-50">
                            <td className="px-4 py-2">
                              <p className="font-medium text-slate-700">{a._matDesc}</p>
                              <p className="text-slate-400 font-mono">{a._matArticle}</p>
                            </td>
                            <td className="px-4 py-2 text-center">{a.quantity||1} {a._matUnit}</td>
                            <td className="px-4 py-2 text-right font-semibold text-emerald-700">€{(a._matPrice*(a.quantity||1)).toFixed(0)}</td>
                            <td className="px-4 py-2 text-center">
                              <select value={a.status}
                                onChange={e => updateAssignment(a.id, a._itemId, a._actId, { status: e.target.value })}
                                className={`px-2 py-0.5 rounded-full text-xs font-bold border ${ss.bg} ${ss.color} ${ss.border}`}>
                                {MATERIAL_STATUSES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                              </select>
                            </td>
                            <td className="px-4 py-2 font-mono text-slate-500">{a.orderRef||'—'}</td>
                            <td className="px-4 py-2 text-center text-slate-500">{a.expectedDate||'—'}</td>
                            <td className="px-4 py-2 font-mono font-bold text-blue-600">{a._itemTag}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              );
            });
          })()}
        </div>
      )}

      {/* Add/Edit material modal */}
      {showAddMat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-slate-900">{editMat ? 'Artikel bewerken' : 'Artikel toevoegen'}</h3>
              <button onClick={() => { setShowAddMat(false); setEditMat(null); }} className="p-2 hover:bg-slate-100 rounded-lg"><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-xs font-semibold text-slate-600 mb-1">Omschrijving *</label>
                <input type="text" value={matForm.description} onChange={e=>setMatForm(f=>({...f,description:e.target.value}))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" placeholder="Pakking 4&quot; 150# Spiral Wound" />
              </div>
              {[
                { key:'articleNumber', label:'Artikelnummer', placeholder:'G-104-SW' },
                { key:'supplier', label:'Leverancier', placeholder:'Klinger' },
              ].map(f => (
                <div key={f.key}>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">{f.label}</label>
                  <input type="text" value={matForm[f.key]} onChange={e=>setMatForm(fm=>({...fm,[f.key]:e.target.value}))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" placeholder={f.placeholder} />
                </div>
              ))}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Categorie</label>
                <select value={matForm.category} onChange={e=>setMatForm(f=>({...f,category:e.target.value}))} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm">
                  {MATERIAL_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Eenheid</label>
                <select value={matForm.unit} onChange={e=>setMatForm(f=>({...f,unit:e.target.value}))} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm">
                  {['st','m','kg','l','set','rol','doos','pak'].map(u=><option key={u} value={u}>{u}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Eenheidsprijs (€)</label>
                <input type="number" step="0.01" value={matForm.price} onChange={e=>setMatForm(f=>({...f,price:e.target.value}))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" placeholder="0.00" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Min. voorraad</label>
                <input type="number" value={matForm.minStock} onChange={e=>setMatForm(f=>({...f,minStock:e.target.value}))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" placeholder="0" />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-semibold text-slate-600 mb-1">Notities</label>
                <textarea value={matForm.notes} onChange={e=>setMatForm(f=>({...f,notes:e.target.value}))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" rows={2} />
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => { setShowAddMat(false); setEditMat(null); }} className="flex-1 px-4 py-2.5 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50">Annuleren</button>
              <button onClick={saveMatForm} className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700">Opslaan</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


// ===== QR CODE GENERATOR =====
// Pure JS QR code generator (no external library needed)
// Uses a simplified QR matrix approach for display
const generateQRSVG = (text, size = 200) => {
  // We use a canvas-free SVG approach with a data URL via qr-svg pattern
  // For real QR we encode as a URL and use the Google Charts API fallback approach
  // Since network is disabled, we generate a visual placeholder that shows the tag
  // In production, integrate qrcode.js library
  const encoded = encodeURIComponent(text);
  // Create deterministic grid pattern from text hash
  let hash = 0;
  for (let i = 0; i < text.length; i++) { hash = ((hash << 5) - hash) + text.charCodeAt(i); hash |= 0; }
  const modules = 21; // QR version 1 = 21x21
  const cellSize = Math.floor(size / modules);
  const cells = [];
  // Finder patterns (fixed)
  const finder = (ox, oy) => {
    for (let r = 0; r < 7; r++) for (let c = 0; c < 7; c++) {
      const border = r===0||r===6||c===0||c===6;
      const inner = r>=2&&r<=4&&c>=2&&c<=4;
      if (border||inner) cells.push({ r:oy+r, c:ox+c });
    }
  };
  finder(0,0); finder(14,0); finder(0,14);
  // Data modules (deterministic from hash)
  for (let r = 0; r < modules; r++) for (let c = 0; c < modules; c++) {
    const isFinder = (r<8&&c<8)||(r<8&&c>12)||(r>12&&c<8);
    const isTiming = r===6||c===6;
    if (!isFinder && !isTiming) {
      const bit = (Math.abs(hash * (r+1) * 31 + c * 17 + r * c) % 3) === 0;
      if (bit) cells.push({ r, c });
    }
  }
  const rects = cells.map(({r,c}) =>
    `<rect x="${c*cellSize}" y="${r*cellSize}" width="${cellSize}" height="${cellSize}" fill="black"/>`
  ).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
    <rect width="${size}" height="${size}" fill="white"/>
    ${rects}
  </svg>`;
};

const QRCodePage = ({ scopeItems, project }) => {
  const [selectedItems, setSelectedItemsQR] = useState(new Set());
  const [printMode, setPrintMode] = useState('cards'); // cards | labels | sheet
  const [qrSize, setQrSize] = useState(120);
  const [showInfo, setShowInfo] = useState({ tag: true, description: true, project: true, phase: false, discipline: false });

  const toggleItem = (id) => setSelectedItemsQR(prev => {
    const next = new Set(prev);
    next.has(id) ? next.delete(id) : next.add(id);
    return next;
  });
  const selectAll = () => setSelectedItemsQR(new Set(scopeItems.map(i => i.id)));
  const clearAll  = () => setSelectedItemsQR(new Set());

  const selectedList = scopeItems.filter(i => selectedItems.has(i.id));

  const printQRSheet = () => {
    const items = selectedList.length > 0 ? selectedList : scopeItems;
    const cardStyle = printMode === 'labels'
      ? 'width:90mm;height:30mm;display:flex;align-items:center;gap:8px;padding:4px;border:1px solid #ccc;box-sizing:border-box;page-break-inside:avoid;'
      : 'width:80mm;height:80mm;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:8px;border:1px solid #ddd;border-radius:8px;box-sizing:border-box;page-break-inside:avoid;text-align:center;';

    const cards = items.map(item => {
      const acts = item.plannedActivities || [];
      const done = acts.filter(a => a.executionStatus === 'Completed').length;
      const pct = acts.length > 0 ? Math.round((done/acts.length)*100) : 0;
      const qrSVG = generateQRSVG(item.tagNumber, printMode === 'labels' ? 50 : qrSize);

      if (printMode === 'labels') {
        return `<div style="${cardStyle}">
          <div style="flex-shrink:0">${qrSVG}</div>
          <div style="flex:1;min-width:0">
            <div style="font-family:monospace;font-size:14px;font-weight:900;color:#1e40af">${item.tagNumber}</div>
            <div style="font-size:10px;color:#374151;overflow:hidden;white-space:nowrap;text-overflow:ellipsis">${item.description}</div>
            ${showInfo.phase ? `<div style="font-size:9px;color:#6b7280">${item.discipline||''}</div>` : ''}
            <div style="font-size:9px;color:#6b7280">${pct}% klaar</div>
          </div>
        </div>`;
      }
      return `<div style="${cardStyle}">
        ${qrSVG}
        <div style="font-family:monospace;font-size:16px;font-weight:900;color:#1e40af;margin-top:6px">${item.tagNumber}</div>
        ${showInfo.description ? `<div style="font-size:10px;color:#374151;margin-top:2px;max-width:70mm;overflow:hidden">${item.description}</div>` : ''}
        ${showInfo.project ? `<div style="font-size:9px;color:#9ca3af;margin-top:2px">${project?.name||''}</div>` : ''}
        <div style="font-size:11px;font-weight:700;color:#059669;margin-top:4px">${pct}%</div>
      </div>`;
    }).join('');

    const gridCols = printMode === 'labels' ? '1fr 1fr' : '1fr 1fr 1fr';

    const html = `<!DOCTYPE html>
<html lang="nl">
<head>
<meta charset="UTF-8">
<title>QR Codes — ${project?.name||'ChemPrep'}</title>
<style>
  body { font-family:-apple-system,sans-serif; margin:0; padding:12px; background:white; }
  .grid { display:grid; grid-template-columns:${gridCols}; gap:8px; }
  @media print {
    body { padding:4mm; }
    .no-print { display:none; }
    .grid { gap:4mm; }
  }
</style>
</head>
<body>
  <div class="no-print" style="margin-bottom:12px;display:flex;align-items:center;gap:12px">
    <button onclick="window.print()" style="padding:8px 16px;background:#2563eb;color:white;border:none;border-radius:6px;font-weight:700;cursor:pointer">🖨️ Afdrukken</button>
    <span style="color:#64748b;font-size:13px">${items.length} QR codes · ${project?.name||''}</span>
  </div>
  <div class="grid">${cards}</div>
</body></html>`;

    const win = window.open('', '_blank');
    win.document.write(html);
    win.document.close();
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">QR Code Generator</h2>
          <p className="text-slate-500 text-sm mt-1">{selectedItems.size > 0 ? `${selectedItems.size} geselecteerd` : `${scopeItems.length} werkpakketten beschikbaar`}</p>
        </div>
        <button onClick={printQRSheet}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700">
          <Printer className="w-4 h-4" />
          {selectedItems.size > 0 ? `${selectedItems.size} QR codes afdrukken` : 'Alle afdrukken'}
        </button>
      </div>

      {/* Settings */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
        <h3 className="font-semibold text-slate-900 mb-4">Afdruk instellingen</h3>
        <div className="grid grid-cols-3 gap-6">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-2">Layout</label>
            <div className="flex rounded-lg border border-slate-200 overflow-hidden">
              {[['cards','Kaarten'],['labels','Labels'],['sheet','Vel']].map(([v,l]) => (
                <button key={v} onClick={() => setPrintMode(v)}
                  className={`flex-1 py-2 text-xs font-medium transition-colors ${printMode===v?'bg-blue-600 text-white':'bg-white text-slate-600 hover:bg-slate-50'}`}>{l}</button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-2">QR grootte: {qrSize}px</label>
            <input type="range" min="80" max="200" step="10" value={qrSize} onChange={e=>setQrSize(parseInt(e.target.value))}
              className="w-full accent-blue-600" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-2">Informatie tonen</label>
            <div className="flex flex-col gap-1.5">
              {[['tag','Tag nummer'],['description','Omschrijving'],['project','Project'],['discipline','Discipline']].map(([k,l]) => (
                <label key={k} className="flex items-center gap-2 cursor-pointer text-xs">
                  <input type="checkbox" checked={showInfo[k]} onChange={e=>setShowInfo(i=>({...i,[k]:e.target.checked}))} className="accent-blue-600" />
                  {l}
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Selection + Preview grid */}
      <div className="flex items-center gap-3 mb-2">
        <button onClick={selectAll} className="px-3 py-1.5 text-xs border border-slate-200 rounded-lg hover:bg-slate-50">Alles selecteren</button>
        <button onClick={clearAll} className="px-3 py-1.5 text-xs border border-slate-200 rounded-lg hover:bg-slate-50">Selectie wissen</button>
        <span className="text-xs text-slate-400">Klik op een werkpakket om te selecteren voor afdruk</span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {scopeItems.map(item => {
          const isSelected = selectedItems.has(item.id);
          const acts = item.plannedActivities || [];
          const done = acts.filter(a => a.executionStatus === 'Completed').length;
          const pct = acts.length > 0 ? Math.round((done/acts.length)*100) : 0;
          const qrSvg = generateQRSVG(item.tagNumber, qrSize);
          return (
            <div key={item.id} onClick={() => toggleItem(item.id)}
              className={`bg-white rounded-xl border-2 cursor-pointer transition-all p-4 text-center hover:shadow-md ${isSelected?'border-blue-500 shadow-md bg-blue-50':'border-slate-200'}`}>
              <div className="flex justify-end mb-1">
                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${isSelected?'border-blue-500 bg-blue-500':'border-slate-300'}`}>
                  {isSelected && <CheckCircle className="w-3 h-3 text-white" />}
                </div>
              </div>
              <div className="flex justify-center mb-2"
                dangerouslySetInnerHTML={{ __html: qrSvg }} />
              <p className="font-mono font-black text-sm text-blue-600">{item.tagNumber}</p>
              {showInfo.description && <p className="text-xs text-slate-500 mt-0.5 truncate">{item.description}</p>}
              {showInfo.discipline && item.discipline && <p className="text-xs text-slate-400">{item.discipline}</p>}
              <div className="mt-2 h-1 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-400 rounded-full" style={{width:`${pct}%`}} />
              </div>
              <p className="text-xs text-slate-400 mt-1">{pct}% klaar</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ===== MAIN APP COMPONENT =====
const App = () => {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
};

const AppContent = () => {
  const toast = useToast();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [viewMode, setViewMode] = useState('projectSelector');
  const [lastSaved, setLastSaved] = useState(new Date());
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [selectedWerkpakketId, setSelectedWerkpakketId] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  
  // Admin Mode State
  const [isAdminMode, setIsAdminMode] = useState(() => {
    const saved = localStorage.getItem('chemprep_admin_mode');
    return saved === 'true';
  });
  
  // Save admin mode to localStorage
  useEffect(() => {
    localStorage.setItem('chemprep_admin_mode', isAdminMode.toString());
    console.log('ðŸ” Admin mode:', isAdminMode ? 'ENABLED' : 'DISABLED');
  }, [isAdminMode]);

  // Default Columns (admin bewerkbaar)
  const [defaultColumns, setDefaultColumns] = useState(() => {
    const saved = localStorage.getItem('chemprep_default_columns');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error loading default columns:', e);
      }
    }
    // Fallback naar hardcoded defaults
    return [
      { id: 'expand', label: 'Expand', width: 'w-12', type: 'expand', editable: false, isDefault: true, hidden: false },
      { id: 'tagNumber', label: 'Tag Number', width: 'w-40', type: 'text', editable: true, isDefault: true, hidden: false },
      { id: 'description', label: 'Beschrijving', width: 'w-64', type: 'text', editable: true, isDefault: true, hidden: false },
      { id: 'workOrderNumber', label: 'Work Order', width: 'w-32', type: 'text', editable: true, isDefault: true, hidden: false },
      { id: 'priority', label: 'Prioriteit', width: 'w-32', type: 'select', editable: true, isDefault: true, hidden: false, options: ['Low', 'Medium', 'High'] },
      { id: 'status', label: 'Status', width: 'w-32', type: 'select', editable: true, isDefault: true, hidden: false, options: ['In Scope', 'Op Hold', 'Uit Scope'] },
      { id: 'workflow', label: 'Workflow', width: 'w-40', type: 'select', editable: true, isDefault: true, hidden: false },
      { id: 'planner', label: 'Planner', width: 'w-40', type: 'select', editable: true, isDefault: true, hidden: false },
      { id: 'activities', label: 'Activiteiten', width: 'w-32', type: 'number', editable: false, isDefault: true, hidden: false },
      { id: 'statusVoortgang', label: 'Status Voortgang', width: 'w-32', type: 'statusMeetpoints', editable: false, isDefault: true, hidden: false },
      { id: 'discipline', label: 'Discipline', width: 'w-32', type: 'select', editable: true, isDefault: true, hidden: false, options: ['Mechanical', 'Electrical', 'Instrumentation', 'Civil', 'Piping'] },
      { id: 'area', label: 'Area', width: 'w-32', type: 'text', editable: true, isDefault: true, hidden: false },
      { id: 'system', label: 'System', width: 'w-32', type: 'text', editable: true, isDefault: true, hidden: false },
      { id: 'notes', label: 'Notities', width: 'w-64', type: 'text', editable: true, isDefault: true, hidden: false },
      { id: 'actions', label: 'Acties', width: 'w-48', type: 'actions', editable: false, isDefault: true, hidden: false },
    ];
  });

  // Save default columns to localStorage
  useEffect(() => {
    localStorage.setItem('chemprep_default_columns', JSON.stringify(defaultColumns));
  }, [defaultColumns]);

  // Custom Columns State - NEW!
  const [customColumns, setCustomColumns] = useState([]);
  
  // Load custom columns when project changes
  useEffect(() => {
    if (selectedProjectId) {
      const saved = localStorage.getItem('customColumns_' + selectedProjectId);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          console.log('ðŸ“‚ Loaded custom columns:', parsed);
          setCustomColumns(parsed);
        } catch (e) {
          console.error('Error loading custom columns:', e);
          setCustomColumns([]);
        }
      } else {
        setCustomColumns([]);
      }
    }
  }, [selectedProjectId]);
  
  // Save custom columns to localStorage
  useEffect(() => {
    if (selectedProjectId && customColumns.length >= 0) {
      localStorage.setItem('customColumns_' + selectedProjectId, JSON.stringify(customColumns));
      console.log('ðŸ’¾ Saved custom columns:', customColumns.length);
    }
  }, [customColumns, selectedProjectId]);

  const [projects, setProjects] = useState(getInitialProjects);
  const [scopeItems, setScopeItems] = useState(getInitialScopeItems);
  const [templates, setTemplates] = useState(getInitialTemplates);
  const [resources] = useState(getInitialResources);
  const [suppliers] = useState(getInitialSuppliers);
  const [workflowStatuses] = useState(getInitialWorkflowStatuses);
  const [users] = useState(getInitialUsers);
  const [materials, setMaterials] = useState(getInitialMaterials);
  const [docCategories, setDocCategories] = useState(getInitialDocCategories);
  const [funclocs] = useState(getInitialFunctionalLocations);
  const [equipment] = useState(getInitialEquipment);
  const [activityCodes] = useState(getInitialActivityCodes);

  useEffect(() => {
    const savedProjectId = localStorage.getItem('chemprep_last_project_id');
    if (savedProjectId && projects.find(p => p.id === savedProjectId)) {
      setSelectedProjectId(savedProjectId);
      setViewMode('project');
    }
  }, []);

  // FASE 1: Migrate data to v4.8.0 format
  useEffect(() => {
    console.log('🔄 Running v4.8.0 data migration...');
    setScopeItems(items => items.map(item => {
      let updated = { ...item };
      
      // Add statusMeetpoints if missing
      if (!updated.statusMeetpoints) {
        updated.statusMeetpoints = {
          werkbeschrijving: 'GEEN',
          materialen: 'GEEN',
          calculaties: 'NIET_VAN_TOEPASSING',
          tra: 'NIET_VAN_TOEPASSING',
          documenten: 'GEEN',
          kosten: 'NIET_VAN_TOEPASSING'
        };
      }
      
      // FASE 2: Add cost fields if missing

      // Fase 3: add documents array to scope items
      if (!updated.documents) updated.documents = [];
      if (updated.plannedActivities) { updated.plannedActivities = updated.plannedActivities.map(act => act.tra ? act : { ...act, tra: { approved: false, approvedBy: '', approvedDate: '', permits: {}, ppe: {}, risks: act.risks || [] } }); }
      if (!updated.costRules) updated.costRules = [];
      if (!updated.contingency) updated.contingency = { percentage: 10, amount: 0 };
      if (updated.totalCost === undefined) updated.totalCost = 0;
      
      // Add steps and calculation to activities if missing
      if (updated.plannedActivities) {
        updated.plannedActivities = updated.plannedActivities.map(activity => {
          const withSteps = activity.steps ? activity : { ...activity, steps: [] };
          return withSteps.calculation !== undefined ? withSteps : { ...withSteps, calculation: null };
        });
      }
      
      return updated;
    }));
    console.log('✅ Migration complete!');
  }, []); // Run once on mount

  useEffect(() => {
    const saveData = async () => {
      setIsSaving(true);
      try {
        localStorage.setItem('chemprep_projects_v1', JSON.stringify(projects));
        localStorage.setItem('chemprep_scope_v14', JSON.stringify(scopeItems));
        localStorage.setItem('chemprep_templates_v9', JSON.stringify(templates));
        localStorage.setItem('chemprep_workflow_statuses_v1', JSON.stringify(workflowStatuses));
        localStorage.setItem('chemprep_users_v1', JSON.stringify(users));
        localStorage.setItem('chemprep_materials_v1', JSON.stringify(materials));
        localStorage.setItem('chemprep_doc_categories_v1', JSON.stringify(docCategories));
        setLastSaved(new Date());
        
        // Small delay to show saving indicator
        await new Promise(resolve => setTimeout(resolve, 300));
      } catch (error) {
        toast.error('Er is een fout opgetreden bij het opslaan');
      } finally {
        setIsSaving(false);
      }
    };
    
    saveData();
  }, [projects, scopeItems, templates, workflowStatuses, users, materials, docCategories]);

  const handleProjectSelect = (projectId) => {
    setSelectedProjectId(projectId);
    setViewMode('project');
    localStorage.setItem('chemprep_last_project_id', projectId);
  };

  const handleSwitchProject = () => {
    setSelectedProjectId(null);
    setViewMode('projectSelector');
    setActiveTab('dashboard');
    localStorage.removeItem('chemprep_last_project_id');
  };

  const handleNavigateToWerkpakket = (scopeId) => {
    setSelectedWerkpakketId(scopeId);
    setViewMode('werkpakket');
  };

  const handleBackFromWerkpakket = () => {
    setSelectedWerkpakketId(null);
    setViewMode('project');
    setActiveTab('scope');
  };

  // Make navigation function available to child components
  useEffect(() => {
    window.handleNavigateToWerkpakket = handleNavigateToWerkpakket;
    return () => {
      delete window.handleNavigateToWerkpakket;
    };
  }, []);

  const projectScopeItems = useMemo(
    () => scopeItems.filter(i => i.projectId === selectedProjectId),
    [scopeItems, selectedProjectId]
  );

  const activeProject = useMemo(
    () => projects.find(p => p.id === selectedProjectId),
    [projects, selectedProjectId]
  );
  
  const notificationAlerts = useNotifications(projectScopeItems, activeProject);

  const renderProjectContent = () => {
    if (!activeProject) return null;
    
    switch (activeTab) {
      case 'dashboard':
        return (
          <Dashboard
            scopeItems={projectScopeItems}
            templates={templates}
            resources={resources}
            suppliers={suppliers}
            workflowStatuses={workflowStatuses}
          />
        );
      case 'scope':
        return (
          <ScopeManager
            scopeItems={projectScopeItems}
            setScopeItems={setScopeItems}
            templates={templates}
            resources={resources}
            materials={materials}
            suppliers={suppliers}
            workflowStatuses={workflowStatuses}
            users={users}
            projectStartDate={activeProject.startDate}
            activeProjectId={selectedProjectId}
            customColumns={customColumns}
            defaultColumns={defaultColumns}
          />
        );
      case 'planning':
        return (
          <PlanningGantt
            scopeItems={projectScopeItems}
            resources={resources}
          />
        );
      case 'documents':
        return (
          <DocumentManagement
            scopeItems={projectScopeItems}
            onUpdate={(updatedItem) => {
              setScopeItems(prev => prev.map(i => i.id === updatedItem.id ? updatedItem : i));
            }}
          />

        );
      case 'scurve':
        return (
          <SCurvePage
            scopeItems={projectScopeItems}
            project={activeProject}
          />
        );
      case 'disciplines':
        return (
          <DisciplineManagement
            scopeItems={projectScopeItems}
            onUpdate={(updatedItem) => {
              setScopeItems(prev => prev.map(i => i.id === updatedItem.id ? updatedItem : i));
            }}
          />
        );
      case 'exports':
        return (
          <ExportHub
            project={activeProject}
            scopeItems={projectScopeItems}
            resources={resources}
            templates={templates}
          />
        );
      case 'tra':
        return (
          <TRAOverview
            scopeItems={projectScopeItems}
          />
        );
      case 'progress':
        return (
          <ProgressTracking
            scopeItems={projectScopeItems}
            setScopeItems={setScopeItems}
            resources={resources}
            suppliers={suppliers}
            projectStartDate={activeProject.startDate}
            templates={templates}
          />
        );
      case 'columns':
        return (
          <ColumnLibrary
            customColumns={customColumns}
            setCustomColumns={setCustomColumns}
            defaultColumns={defaultColumns}
            setDefaultColumns={setDefaultColumns}
            isAdminMode={isAdminMode}
          />
        );
      case 'costing':
        return (
          <CostingPage
            scopeItems={projectScopeItems}
            onUpdate={(updatedItem) => setScopeItems(prev => prev.map(i => i.id === updatedItem.id ? updatedItem : i))}
          />
        );
      case 'evm':
        return (
          <EVMPage
            scopeItems={projectScopeItems}
            project={activeProject}
          />
        );
      case 'notifications':
        return (
          <NotificationsPage
            scopeItems={projectScopeItems}
            project={activeProject}
          />
        );
      case 'criticalpath':
        return (
          <CriticalPathPage
            scopeItems={projectScopeItems}
            setScopeItems={setScopeItems}
          />
        );
      case 'materials':
        return (
          <MaterialManagement
            scopeItems={projectScopeItems}
            materials={materials}
            setMaterials={setMaterials}
            setScopeItems={setScopeItems}
          />
        );
      case 'qrcodes':
        return (
          <QRCodePage
            scopeItems={projectScopeItems}
            project={activeProject}
          />
        );
      case 'backup':
        return (
          <BackupRestore
            projects={projects}
            scopeItems={scopeItems}
            resources={resources}
            templates={templates}
            setProjects={setProjects}
            setScopeItems={setScopeItems}
            setResources={setResources}
          />
        );
      case 'users':
        return (
          <UserManagement />
        );
      case 'changelog':
        return (
          <ChangelogPage />
        );
      case 'execution':
        return (
          <ExecutionPage
            scopeItems={projectScopeItems}
            setScopeItems={setScopeItems}
          />
        );
      case 'wallboard':
        return (
          <WallboardPage
            scopeItems={projectScopeItems}
            workflowStatuses={workflowStatuses}
          />
        );
      default:
        return (
          <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-200">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">{activeTab}</h2>
            <p className="text-slate-600">Component in ontwikkeling...</p>
          </div>
        );
    }
  };

  // Show Library Hub
  if (viewMode === 'library') {
    return (
      <>
        <ErrorDisplay />
        <div className="flex h-screen bg-slate-50 overflow-hidden">
          <Sidebar
            mode="global"
            activeTab="library"
            setActiveTab={(tab) => {
              if (tab === 'projectSelector') {
                setViewMode('projectSelector');
              }
            }}
            lastSaved={lastSaved}
            isSaving={isSaving}
            onSwitchProject={() => setViewMode('projectSelector')}
            isAdminMode={isAdminMode}
            onToggleAdmin={() => setIsAdminMode(!isAdminMode)}
          />
          <main className="flex-1 overflow-y-auto p-8">
          <LibraryHub
            project={projects.find(p => p.id === selectedProjectId)}
            templates={templates}
            setTemplates={setTemplates}
            resources={resources}
            setResources={() => {}}
            suppliers={suppliers}
            setSuppliers={() => {}}
            materials={materials}
            setMaterials={setMaterials}
            activityCodes={activityCodes}
            setActivityCodes={() => {}}
            workflowStatuses={workflowStatuses}
            setWorkflowStatuses={() => {}}
            docCategories={docCategories}
            setDocCategories={setDocCategories}
            scopeItems={scopeItems}
            setScopeItems={setScopeItems}
            customColumns={customColumns}
            setCustomColumns={setCustomColumns}
            defaultColumns={defaultColumns}
            setDefaultColumns={setDefaultColumns}
            isAdminMode={isAdminMode}
          />
        </main>
      </div>
    </>
    );
  }

  // Show Column Library
  // Show Werkpakket Detail Page
  if (viewMode === 'werkpakket' && selectedWerkpakketId) {
    const werkpakketItem = scopeItems.find(s => s.id === selectedWerkpakketId);
    if (!werkpakketItem) {
      handleBackFromWerkpakket();
      return null;
    }
    
    return (
      <WerkpakketDetailPage
        scopeItem={werkpakketItem}
        scopeItemIndex={scopeItems.findIndex(s => s.id === werkpakketItem.id)}
        onBack={handleBackFromWerkpakket}
        onUpdate={(updated) => {
          setScopeItems(scopeItems.map(s => s.id === updated.id ? updated : s));
        }}
        resources={resources}
        suppliers={suppliers}
        materials={materials}
        projectStartDate={activeProject.startDate}
        templates={templates}
      />
    );
  }

  // Show project selector if no project is selected
  if (!selectedProjectId || viewMode === 'projectSelector') {
    return (
      <>
        <ErrorDisplay />
        <ProjectSelector 
          projects={projects} 
          onProjectSelect={handleProjectSelect}
          onLibraryClick={() => setViewMode('library')}
        />
      </>
    );
  }

  // Show project view with sidebar
  return (
    <>
      <ErrorDisplay />
      <div className="flex h-screen bg-slate-50 overflow-hidden">
        <Sidebar
          mode="project"
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          lastSaved={lastSaved}
          isSaving={isSaving}
          activeProject={activeProject}
          onSwitchProject={handleSwitchProject}
          isAdminMode={isAdminMode}
          onToggleAdmin={() => setIsAdminMode(!isAdminMode)}
          alertCount={notificationAlerts.filter(a => ['critical','high'].includes(a.severity)).length}
        />
        <main className="flex-1 overflow-y-auto p-8">
          {renderProjectContent()}
        </main>
      </div>
    </>
  );
};

export default App;