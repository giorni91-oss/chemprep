# ✅ ChemPrep v5.1 Deployment Checklist

## 📋 Pre-Deployment

- [ ] Alle 20 bestanden gedownload
- [ ] GitHub account aangemaakt (giorni91-oss)
- [ ] Repository aangemaakt: `chemprep`
- [ ] Repository is PUBLIC (voor gratis GitHub Pages)

---

## 📤 Upload Volgorde

### **STAP 1: Core Files (EERST!)**
Zonder deze werkt niets:

- [ ] `shared.js` (7KB) - Database layer
- [ ] `index.html` (8KB) - Homepage

**Test:** Open `https://[username].github.io/chemprep/`  
**Verwacht:** Project selector laadt

---

### **STAP 2: Main Modules**
De belangrijkste functionaliteit:

- [ ] `dashboard.html` (6KB)
- [ ] `scope.html` (12KB) ← BELANGRIJK!
- [ ] `planning.html` (7KB)
- [ ] `materials.html` (9KB) ← NIEUW!
- [ ] `qrcodes.html` (7KB) ← NIEUW!
- [ ] `documents.html` (5KB)
- [ ] `tra.html` (6KB)
- [ ] `evm.html` (7KB)
- [ ] `criticalpath.html` (6KB)
- [ ] `costing.html` (6KB)

**Test:** Navigeer naar elke module via menu  
**Verwacht:** Alle modules laden zonder errors

---

### **STAP 3: Support Modules**
Extra functionaliteit:

- [ ] `disciplines.html` (8KB)
- [ ] `execution.html` (10KB) ← NIEUW!
- [ ] `wallboard.html` (9KB)
- [ ] `exports.html` (8KB)

**Test:** Check exports, wallboard dark mode  
**Verwacht:** Alle features werken

---

### **STAP 4: Admin Modules**
Beheer & instellingen:

- [ ] `admin.html` (8KB)
- [ ] `changelog.html` (7KB)

**Test:** Gebruiker toevoegen, backup maken  
**Verwacht:** Admin functies werken

---

### **STAP 5: Test Suite**
Voor testen & bug tracking:

- [ ] `test-panel.html` (12KB)

**Test:** Open test panel, open een module  
**Verwacht:** Test interface werkt

---

### **STAP 6: Documentatie (Optioneel)**
Niet nodig voor functionaliteit, maar handig als referentie:

- [ ] `README.md`
- [ ] `FINAL-DEPLOYMENT.md`
- [ ] `TEST-PANEL-GUIDE.md`
- [ ] `DEPLOYMENT-CHECKLIST.md` (dit bestand)

---

## 🔍 Verification Checklist

### **Browser Test (Desktop)**

- [ ] Open: `https://[username].github.io/chemprep/`
- [ ] Project aanmaken werkt
- [ ] Navigatie menu zichtbaar (18 modules)
- [ ] Dashboard opent
- [ ] Scope Manager opent
- [ ] Data wordt opgeslagen (refresh → data blijft)
- [ ] Geen console errors (F12)

### **Tablet Test (Android)**

- [ ] Open URL op Android tablet
- [ ] Pagina laadt snel (1-3 seconden)
- [ ] Touch navigatie werkt
- [ ] Geen crashes
- [ ] Data persisteert na sluiten browser

### **Module Test (Essentials)**

- [ ] **index.html** - Project aanmaken ✅
- [ ] **scope.html** - Werkpakket toevoegen ✅
- [ ] **materials.html** - Materiaal toevoegen ✅
- [ ] **qrcodes.html** - QR code genereren ✅
- [ ] **admin.html** - Backup maken ✅

### **Navigation Test**

- [ ] Klik op project naam → terug naar index
- [ ] Navigeer tussen modules → smooth
- [ ] Menu bar op alle pagina's zichtbaar
- [ ] Active page highlighted

---

## 🐛 Common Issues & Fixes

### ❌ **Probleem: Wit scherm**
**Diagnose:**
```
F12 → Console → Check errors
```

**Mogelijk:**
- `shared.js` niet geüpload → Upload shared.js EERST
- Bestandsnaam fout → Check hoofdletters (case-sensitive)
- Verkeerd pad → Alle bestanden in root folder

**Fix:**
```
1. Verwijder ALLE bestanden
2. Upload shared.js + index.html eerst
3. Test of die werken
4. Upload rest
```

---

### ❌ **Probleem: Navigatie werkt niet**
**Symptoom:** Menu bar toont niet alle modules

**Diagnose:**
```javascript
// Open console (F12)
ChemPrepNav.pages
// Zou 18 items moeten tonen
```

**Fix:**
- shared.js niet geupdate → Download nieuwe shared.js
- Cache probleem → Hard refresh (Ctrl+Shift+R)

---

### ❌ **Probleem: Data verdwijnt**
**Symptoom:** Na refresh is data weg

**Diagnose:**
```javascript
// Console (F12)
localStorage.getItem('chemprep_projects_v1')
// Zou JSON moeten tonen, of null
```

**Fix:**
- Incognito mode gebruikt → Gebruik normale browser
- localStorage vol → Clear andere sites
- Browser privacy settings → Cookies/storage toestaan

---

### ❌ **Probleem: Module 404**
**Symptoom:** "Page not found" bij klikken module

**Fix:**
```
1. Check bestandsnaam: scope.html (niet Scope.html!)
2. Check in repository: bestand echt geüpload?
3. Wacht 60 seconden voor GitHub Pages deploy
4. Hard refresh
```

---

## 📊 Post-Deployment Checklist

### **Dag 1: Initial Setup**
- [ ] Maak test project aan
- [ ] Voeg 5 werkpakketten toe
- [ ] Voeg materialen toe
- [ ] Genereer QR codes
- [ ] Maak backup (Admin → Export)

### **Week 1: Full Test**
- [ ] Open test-panel.html
- [ ] Test alle 18 modules
- [ ] Rapporteer bugs
- [ ] Export test resultaten
- [ ] Deel feedback

### **Ongoing**
- [ ] Wekelijks backup maken
- [ ] Maandelijks browser cache legen
- [ ] Check for updates in changelog

---

## 🎯 Success Criteria

### ✅ **Deployment Succesvol Als:**

1. **URL werkt:** `https://[username].github.io/chemprep/`
2. **Homepage laadt:** Project selector zichtbaar
3. **Navigatie werkt:** Alle 18 modules in menu
4. **Data persisteert:** Na refresh blijft data
5. **Tablet werkt:** Snel en stabiel op Android
6. **Geen errors:** Console (F12) clean
7. **Test panel werkt:** Test interface toegankelijk

### ✅ **Ready for Production Als:**

1. Alle 18 modules werken ✅
2. Data opslaan/laden werkt ✅
3. Backup/restore werkt ✅
4. Geen kritieke bugs ✅
5. Tablet performance goed ✅
6. Test resultaten positief ✅

---

## 🚀 Quick Reference

### **Repository URL:**
```
https://github.com/giorni91-oss/chemprep
```

### **Live Site:**
```
https://giorni91-oss.github.io/chemprep/
```

### **Test Panel:**
```
https://giorni91-oss.github.io/chemprep/test-panel.html
```

### **Files to Upload (20 total):**
```
Core:          shared.js, index.html
Main (10):     dashboard, scope, planning, materials, qrcodes, 
               documents, tra, evm, criticalpath, costing
Support (4):   disciplines, execution, wallboard, exports
Admin (2):     admin, changelog
Test (1):      test-panel
Docs (3):      README, guides (optional)
```

---

## 📞 Support

**Issues?**
1. Check this checklist ✅
2. Check FINAL-DEPLOYMENT.md 📖
3. Open test-panel.html 🧪
4. Export test results 📥
5. Share in Claude chat 💬

---

## ✅ Final Checklist

Before marking deployment DONE:

- [ ] All 19 .html + .js files uploaded
- [ ] GitHub Pages activated
- [ ] URL opens without errors
- [ ] Created test project successfully
- [ ] Navigation between modules works
- [ ] Data persists after refresh
- [ ] Tested on Android tablet
- [ ] No console errors
- [ ] Made first backup
- [ ] Test panel accessible

**If all checked ✅ → DEPLOYMENT SUCCESSFUL! 🎉**

---

**Last Updated:** February 2026  
**Version:** ChemPrep v5.1 Modular Complete
