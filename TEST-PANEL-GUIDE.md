# 🧪 ChemPrep Test Panel - Gebruikershandleiding

## 📋 Wat is het Test Panel?

Een **interactieve test suite** waar je:
- ✅ Alle 18 modules kan testen
- ✅ Per module een checklist afvinkt
- ✅ Status kan aangeven (werkt/bug/gedeeltelijk)
- ✅ Bugs en opmerkingen kan rapporteren
- ✅ Prioriteit kan aangeven
- ✅ Test resultaten kan exporteren

---

## 🚀 Hoe Te Gebruiken

### **Stap 1: Open Test Panel**

Upload `test-panel.html` naar je GitHub Pages:
```
chemprep/
├── test-panel.html  ← Upload dit bestand
├── shared.js
├── index.html
├── ... (andere modules)
```

Open: `https://giorni91-oss.github.io/chemprep/test-panel.html`

---

### **Stap 2: Test een Module**

1. **Klik op een module card** (bijv. "Scope Manager")
2. Modal opent met:
   - ✓ Checklist van test items
   - 📊 Status keuze (werkt/bug/gedeeltelijk)
   - 📝 Notitieveld voor opmerkingen
   - 🎯 Prioriteit (laag/gemiddeld/hoog/kritiek)
   - 🚀 "Open Module" knop (opent in nieuw tab)

3. **Test de module:**
   - Klik "🚀 Open Module"
   - Test alle functies
   - Vink checklist items af
   - Rapporteer bugs in notitieveld

4. **Sla op:**
   - Kies status (✅ werkt / ❌ bug / ⚠️ gedeeltelijk)
   - Kies prioriteit als er bugs zijn
   - Klik "💾 Opslaan & Sluiten"

---

### **Stap 3: Notities & Feedback**

**Per Module Notities:**
Gebruik het notitieveld om te beschrijven:
```
Bug gevonden:
- Knop "Materiaal toevoegen" werkt niet op tablet
- Foutmelding: undefined error in console

Feature request:
- Zoekfunctie toevoegen voor grote catalogi

Opmerking:
- Tabel past niet op klein scherm
```

**Algemene Opmerkingen:**
Scroll naar beneden naar "📝 Algemene Opmerkingen":
- Systeem-brede issues
- Performance problemen
- UI/UX suggesties
- Feature requests

---

## 📊 Status Codes

| Status | Betekenis | Wanneer Gebruiken |
|--------|-----------|-------------------|
| ○ Niet getest | Default | Module nog niet getest |
| ✅ Werkt Perfect | Alles werkt | Alle checks ✓, geen bugs |
| ❌ Bug Gevonden | Niet werkend | Kritieke bugs, werkt niet |
| ⚠️ Gedeeltelijk | Meeste werkt | Klein bugje, niet kritiek |

---

## 🎯 Prioriteit Levels

| Prioriteit | Wanneer | Voorbeeld |
|-----------|---------|-----------|
| 🟢 Laag | Nice-to-have | UI verbeteringen, kleur aanpassingen |
| 🟡 Gemiddeld | Belangrijk | Feature mist, niet optimaal |
| 🟠 Hoog | Moet opgelost | Belangrijke functie werkt niet goed |
| 🔴 Kritiek | Blocker | App crasht, data verlies |

---

## 💾 Data Beheer

### **Auto-Save:**
- Test resultaten worden **automatisch opgeslagen** in localStorage
- Je kan de browser sluiten en later verder gaan
- Data blijft staan tot je reset doet

### **Export Resultaten:**
Klik "📥 Export Resultaten" voor:
```json
{
  "generated": "2026-02-18T...",
  "version": "ChemPrep v5.1 Modular",
  "summary": {
    "totalModules": 18,
    "tested": 12,
    "passed": 10,
    "failed": 2
  },
  "modules": [...],
  "generalNotes": "..."
}
```

Stuur dit JSON bestand naar mij voor analyse!

### **Bewaar Voortgang:**
Klik "💾 Bewaar Voortgang" om:
- Test progress als .json te downloaden
- Later te importeren met "📤 Laad Voortgang"
- Backup van je test werk

### **Reset Alles:**
Klik "🔄 Reset Alles" om:
- ALLE test data te wissen
- Opnieuw te beginnen
- ⚠️ Kan niet ongedaan worden!

---

## 📝 Test Workflow Voorbeeld

### **Module: Scope Manager**

1. **Open test modal**
   - Klik op "Scope Manager" card

2. **Open module in nieuw tab**
   - Klik "🚀 Open Module"
   - Tab opent met scope.html

3. **Test systematisch:**
   ```
   ✓ Werkpakket toevoegen werkt
   ✓ Werkpakket bewerken werkt
   ✓ Werkpakket verwijderen werkt
   ✓ Lijst view werkt
   ✓ Grid view werkt
   ✗ Filters werken (status/discipline)  ← BUG!
   ✓ Zoekfunctie werkt
   ✓ Data wordt opgeslagen
   ```

4. **Rapporteer bug:**
   ```
   Bug: Filter op discipline werkt niet
   
   Stappen:
   1. Open Scope Manager
   2. Selecteer discipline "Piping" in filter
   3. Geen effect - alle items blijven zichtbaar
   
   Verwacht: Alleen Piping items tonen
   Werkelijk: Alle items blijven zichtbaar
   
   Browser: Chrome Android
   Device: Samsung Galaxy Tab
   ```

5. **Stel status in:**
   - Kies "⚠️ Gedeeltelijk" (meeste werkt, 1 bug)
   - Kies prioriteit "🟡 Gemiddeld"

6. **Sla op**
   - Klik "💾 Opslaan & Sluiten"
   - Card wordt oranje (gedeeltelijk status)

---

## 🎨 Visual Feedback

**Card Kleuren:**
- **Wit** = Niet getest
- **Groen** = ✅ Werkt perfect
- **Rood** = ❌ Bug gevonden
- **Oranje** = ⚠️ Gedeeltelijk

**Stats Dashboard:**
- **Getest** = Aantal geteste modules
- **Werkt** = Aantal ✅ modules
- **Bugs** = Aantal ❌ modules
- **Opmerkingen** = Modules met notities

---

## 📤 Resultaten Delen

### **Optie 1: JSON Export**
1. Klik "📥 Export Resultaten"
2. Download JSON bestand
3. Stuur naar mij via chat/email

### **Optie 2: Print Report**
1. Klik "🖨️ Print Report"
2. Kies "Save as PDF"
3. Deel PDF

### **Optie 3: Screenshots**
- Maak screenshot van dashboard
- Maak screenshots van bugs
- Stuur via chat

---

## ✅ Complete Test Checklist

### **Must Test (Prioriteit Hoog):**
- [ ] index.html - Project aanmaken/openen
- [ ] scope.html - Werkpakket CRUD
- [ ] materials.html - Material management
- [ ] qrcodes.html - QR codes genereren
- [ ] execution.html - Status updates
- [ ] admin.html - Backup/restore

### **Should Test (Prioriteit Gemiddeld):**
- [ ] dashboard.html - KPI's tonen
- [ ] planning.html - Timeline
- [ ] tra.html - Risico matrix
- [ ] evm.html - EVM metrics
- [ ] exports.html - CSV/HTML export
- [ ] wallboard.html - Groot scherm

### **Nice to Test (Prioriteit Laag):**
- [ ] documents.html - Document lijst
- [ ] criticalpath.html - CPM
- [ ] costing.html - Kosten
- [ ] disciplines.html - Norm tables
- [ ] changelog.html - Versies

---

## 🐛 Bug Report Template

Gebruik dit format in notities:

```
Bug: [Korte titel]

Stappen om te reproduceren:
1. [Stap 1]
2. [Stap 2]
3. [Stap 3]

Verwacht gedrag:
[Wat er zou moeten gebeuren]

Werkelijk gedrag:
[Wat er gebeurt]

Context:
- Browser: [Chrome/Firefox/Safari]
- Device: [Desktop/Tablet/Phone]
- OS: [Windows/Mac/Android/iOS]

Screenshot: [Optioneel]
```

---

## 💡 Tips

### **Efficiënt Testen:**
1. Start met Core modules (index.html, shared.js)
2. Test daarna Main modules (scope, materials, etc.)
3. Support modules als laatste

### **Tablet Testing:**
1. Test op je Android tablet
2. Let op responsiveness
3. Test touch interacties
4. Check laadtijden

### **Data Veiligheid:**
1. Export resultaten regelmatig
2. Bewaar voortgang voor lange test sessies
3. Maak screenshots van bugs

---

## 🆘 Troubleshooting

**Q: Mijn test data is verdwenen**
A: Browser cache gewist? Import laatste "Bewaar Voortgang" backup

**Q: Test panel laadt niet**
A: Controleer of het geüpload is naar GitHub Pages

**Q: Module opent niet**
A: Controleer of de module (bijv. scope.html) geüpload is

**Q: Kan geen voortgang opslaan**
A: Browser storage vol? Reset en export eerst

---

## 📞 Support

**Bugs gevonden?** Perfect! Dat is waar dit voor is.

**Rapporteer via:**
1. Export test resultaten (JSON)
2. Stuur naar mij in Claude chat
3. Ik fix de bugs en update modules

**Feature requests?**
Schrijf in "Algemene Opmerkingen" wat je wilt!

---

## 🎉 Klaar!

Je bent nu klaar om ChemPrep v5.1 Modular te testen!

**Workflow:**
1. Open test-panel.html
2. Test alle modules systematisch
3. Rapporteer bugs & feedback
4. Export resultaten
5. Stuur naar mij
6. Ik fix → nieuwe versie
7. Repeat!

Veel plezier met testen! 🚀

