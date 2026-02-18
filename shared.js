// ============================================================================
// ChemPrep Shared Database Layer
// ============================================================================
// All modules use these functions to read/write to localStorage
// This ensures data consistency across all pages

const ChemPrepDB = {
  // ── Projects ──────────────────────────────────────────────────────────────
  getProjects: () => {
    try {
      return JSON.parse(localStorage.getItem('chemprep_projects_v1') || '[]');
    } catch {
      return [];
    }
  },
  
  saveProjects: (data) => {
    localStorage.setItem('chemprep_projects_v1', JSON.stringify(data));
  },
  
  getActiveProjectId: () => {
    return localStorage.getItem('chemprep_active_project_id');
  },
  
  setActiveProjectId: (id) => {
    localStorage.setItem('chemprep_active_project_id', id);
  },
  
  getActiveProject: () => {
    const id = ChemPrepDB.getActiveProjectId();
    const projects = ChemPrepDB.getProjects();
    return projects.find(p => p.id === id) || null;
  },
  
  // ── Scope Items ───────────────────────────────────────────────────────────
  getScopeItems: () => {
    try {
      return JSON.parse(localStorage.getItem('chemprep_scope_v14') || '[]');
    } catch {
      return [];
    }
  },
  
  saveScopeItems: (data) => {
    localStorage.setItem('chemprep_scope_v14', JSON.stringify(data));
  },
  
  getProjectScopeItems: (projectId) => {
    return ChemPrepDB.getScopeItems().filter(item => item.projectId === projectId);
  },
  
  // ── Materials ─────────────────────────────────────────────────────────────
  getMaterials: () => {
    try {
      return JSON.parse(localStorage.getItem('chemprep_materials_v1') || '[]');
    } catch {
      return [];
    }
  },
  
  saveMaterials: (data) => {
    localStorage.setItem('chemprep_materials_v1', JSON.stringify(data));
  },
  
  // ── Templates ─────────────────────────────────────────────────────────────
  getTemplates: () => {
    try {
      return JSON.parse(localStorage.getItem('chemprep_templates_v9') || '[]');
    } catch {
      return [];
    }
  },
  
  saveTemplates: (data) => {
    localStorage.setItem('chemprep_templates_v9', JSON.stringify(data));
  },
  
  // ── Resources ─────────────────────────────────────────────────────────────
  getResources: () => {
    try {
      return JSON.parse(localStorage.getItem('chemprep_resources_v1') || '[]');
    } catch {
      return [];
    }
  },
  
  // ── Users ─────────────────────────────────────────────────────────────────
  getUsers: () => {
    try {
      return JSON.parse(localStorage.getItem('chemprep_users_v1') || '[]');
    } catch {
      return [];
    }
  },
  
  saveUsers: (data) => {
    localStorage.setItem('chemprep_users_v1', JSON.stringify(data));
  },
  
  // ── Workflow Statuses ─────────────────────────────────────────────────────
  getWorkflowStatuses: () => {
    try {
      return JSON.parse(localStorage.getItem('chemprep_workflow_statuses_v1') || '[]');
    } catch {
      return [];
    }
  },
  
  // ── Document Categories ───────────────────────────────────────────────────
  getDocCategories: () => {
    try {
      return JSON.parse(localStorage.getItem('chemprep_doc_categories_v1') || '[]');
    } catch {
      return [];
    }
  },
  
  // ── Activity Codes ────────────────────────────────────────────────────────
  getActivityCodes: () => {
    try {
      return JSON.parse(localStorage.getItem('chemprep_activity_codes_v1') || '[]');
    } catch {
      return [];
    }
  },
  
  // ── Changelog ─────────────────────────────────────────────────────────────
  addChangelogEntry: (entry) => {
    try {
      const log = JSON.parse(localStorage.getItem('chemprep_changelog') || '[]');
      log.unshift({
        id: Date.now(),
        timestamp: new Date().toISOString(),
        ...entry
      });
      localStorage.setItem('chemprep_changelog', JSON.stringify(log.slice(0, 100)));
    } catch {}
  },
  
  // ── Helpers ───────────────────────────────────────────────────────────────
  exportAll: () => {
    return {
      version: '5.1-modular',
      exportedAt: new Date().toISOString(),
      data: {
        projects: ChemPrepDB.getProjects(),
        scopeItems: ChemPrepDB.getScopeItems(),
        materials: ChemPrepDB.getMaterials(),
        templates: ChemPrepDB.getTemplates(),
        users: ChemPrepDB.getUsers(),
      }
    };
  },
  
  importAll: (backup) => {
    if (!backup.data) throw new Error('Invalid backup format');
    if (backup.data.projects) ChemPrepDB.saveProjects(backup.data.projects);
    if (backup.data.scopeItems) ChemPrepDB.saveScopeItems(backup.data.scopeItems);
    if (backup.data.materials) ChemPrepDB.saveMaterials(backup.data.materials);
    if (backup.data.templates) ChemPrepDB.saveTemplates(backup.data.templates);
    if (backup.data.users) ChemPrepDB.saveUsers(backup.data.users);
  },
  
  clearAll: () => {
    const keys = Object.keys(localStorage).filter(k => k.startsWith('chemprep_'));
    keys.forEach(k => localStorage.removeItem(k));
  }
};

// Navigation helper
const ChemPrepNav = {
  pages: [
    { id: 'home', label: 'Projects', icon: '🏢', file: 'index.html' },
    { id: 'dashboard', label: 'Dashboard', icon: '📊', file: 'dashboard.html' },
    { id: 'scope', label: 'Scope', icon: '📦', file: 'scope.html' },
    { id: 'planning', label: 'Planning', icon: '📅', file: 'planning.html' },
    { id: 'execution', label: 'Uitvoering', icon: '🔧', file: 'execution.html' },
    { id: 'materials', label: 'Materialen', icon: '🔩', file: 'materials.html' },
    { id: 'qrcodes', label: 'QR Codes', icon: '🔳', file: 'qrcodes.html' },
    { id: 'documents', label: 'Documenten', icon: '📄', file: 'documents.html' },
    { id: 'disciplines', label: 'Disciplines', icon: '📋', file: 'disciplines.html' },
    { id: 'tra', label: 'T.R.A.', icon: '⚠️', file: 'tra.html' },
    { id: 'evm', label: 'EVM', icon: '📈', file: 'evm.html' },
    { id: 'criticalpath', label: 'Kritisch Pad', icon: '🔀', file: 'criticalpath.html' },
    { id: 'costing', label: 'Kosten', icon: '💰', file: 'costing.html' },
    { id: 'wallboard', label: 'Wallboard', icon: '📺', file: 'wallboard.html' },
    { id: 'exports', label: 'Export', icon: '📤', file: 'exports.html' },
    { id: 'admin', label: 'Admin', icon: '⚙️', file: 'admin.html' },
    { id: 'changelog', label: 'Changelog', icon: '📜', file: 'changelog.html' },
    { id: 'test', label: 'Test Panel', icon: '🧪', file: 'test-panel.html' },
  ],
  
  goTo: (pageId) => {
    const page = ChemPrepNav.pages.find(p => p.id === pageId);
    if (page) window.location.href = page.file;
  },
  
  renderMenu: (currentPageId) => {
    const project = ChemPrepDB.getActiveProject();
    if (!project && currentPageId !== 'home') {
      window.location.href = 'index.html';
      return '';
    }
    
    return `
      <div class="bg-slate-800 text-white p-4 flex items-center gap-4 flex-wrap">
        <div class="font-bold text-lg">ChemPrep v5.1</div>
        ${project ? `<div class="px-3 py-1 bg-blue-600 rounded-full text-sm">${project.name}</div>` : ''}
        <div class="flex-1"></div>
        <div class="flex gap-2 flex-wrap">
          ${ChemPrepNav.pages.map(p => `
            <a href="${p.file}" class="px-3 py-1.5 rounded text-sm ${p.id === currentPageId ? 'bg-blue-600' : 'bg-slate-700 hover:bg-slate-600'}">${p.icon} ${p.label}</a>
          `).join('')}
        </div>
      </div>
    `;
  }
};

console.log('✅ ChemPrep Shared DB loaded');
