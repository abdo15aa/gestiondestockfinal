You are a senior UI/UX designer. Apply a consistent, readable and 
refined typography system across ALL screens and interfaces of the 
StockFlow Pro logistics application (Dashboard, Articles, Mouvements, 
Fournisseurs, Notifications, Forms, Modals, Empty states, Login).

═══════════════════════════════════════
GLOBAL TEXT STYLES — APPLY EVERYWHERE
═══════════════════════════════════════

Create and apply these Figma Text Styles across every frame:

  /Display        → 32px | weight 500 | tracking -0.02em
  /H1             → 26px | weight 500 | tracking -0.01em
  /H2             → 20px | weight 500 | tracking 0
  /H3             → 18px | weight 500 | tracking 0
  /Body-Strong    → 14px | weight 500 | line-height 1.6
  /Body           → 14px | weight 400 | line-height 1.6
  /Body-Small     → 13px | weight 400 | line-height 1.5
  /Label          → 12px | weight 500 | tracking 0.05em | UPPERCASE
  /Caption        → 11px | weight 500 | tracking 0.07em | UPPERCASE
  /Mono           → 13px | monospace  | tabular-nums (for IDs, codes, numbers)

Never use font sizes below 11px on any interface.
Never use font weight 700 or bold — maximum is 500 (medium).

═══════════════════════════════════════
COLOR RULES FOR TEXT — ALL INTERFACES
═══════════════════════════════════════

  Primary text    → #1A1A2E  (titles, important data)
  Secondary text  → #6B7280  (dates, operators, subtitles)
  Tertiary text   → #9CA3AF  (hints, placeholders, captions)
  Success text    → #065F46  (positive values, ENTRÉE badges)
  Danger text     → #991B1B  (alerts, SORTIE badges, errors)
  Brand accent    → #2D7A4F  (active nav, links, highlights)

Never use pure black (#000000) for any text.

═══════════════════════════════════════
INTERFACE 1 — TABLEAU DE BORD
═══════════════════════════════════════

- Page title "Tableau de Bord": /Display, underline 2px #2D7A4F
- KPI numbers (1,240 / 8 / 4): 38px, weight 500, tracking -0.02em
- KPI labels: /Label (uppercase, muted)
- KPI subtitles: /Body-Small with semantic color
- Section title "Mouvements Récents": /H3
- Table headers: /Caption (uppercase, tertiary color)
- Table article names: /Body-Strong
- Table IDs (MVT-XXXX): /Mono
- Table dates & operators: /Body, secondary color
- Table quantities: /Body-Strong
- Badge ENTRÉE/SORTIE: /Caption, pill shape, semantic colors

═══════════════════════════════════════
INTERFACE 2 — ARTICLES (list/detail)
═══════════════════════════════════════

- Page title "Articles": /Display
- Search bar placeholder: /Body, tertiary color
- Filter labels: /Label
- Article name in list: /Body-Strong, primary color
- Article reference/code: /Mono, secondary color
- Stock quantity: /Body-Strong, large — color green if OK, red if low
- Category tag: /Caption, pill style
- Article detail panel title: /H2
- Detail field labels: /Label (uppercase, tertiary)
- Detail field values: /Body-Strong, primary

═══════════════════════════════════════
INTERFACE 3 — MOUVEMENTS
═══════════════════════════════════════

- Page title "Mouvements": /Display
- Date group headers (e.g. "25 mai 2025"): /H3, brand green
- Movement ID: /Mono
- Movement type badge: /Caption, pill, semantic color
- Article name: /Body-Strong
- Quantity: /Body-Strong, large, semantic color
- Operator name: /Body, secondary
- Filters/tabs: /Label, uppercase

═══════════════════════════════════════
INTERFACE 4 — FOURNISSEURS
═══════════════════════════════════════

- Page title "Fournisseurs": /Display
- Supplier name (card/list): /H3, primary
- Supplier ID/code: /Mono
- Status badge (Actif/Inactif): /Caption, pill
- Contact info (email, phone): /Body, secondary
- Field labels: /Label
- Stats (nb articles, orders): /Body-Strong with /Label below

═══════════════════════════════════════
INTERFACE 5 — NOTIFICATIONS
═══════════════════════════════════════

- Page title "Notifications": /Display
- Notification counter badge: 11px, white on red, bold pill
- Notification title: /Body-Strong, primary
- Notification body text: /Body, secondary, line-height 1.6
- Timestamp: /Caption, tertiary
- Unread indicator: left 3px border in #2D7A4F
- Category label: /Caption, uppercase, colored pill

═══════════════════════════════════════
INTERFACE 6 — FORMS & MODALS
═══════════════════════════════════════

- Modal title: /H2, primary
- Form section title: /H3, primary
- Input label: /Label, secondary color, margin-bottom 6px
- Input value (typed text): /Body, primary
- Input placeholder: /Body, tertiary
- Helper text below input: /Body-Small, tertiary
- Error message: /Body-Small, danger color (#991B1B)
- Success message: /Body-Small, success color (#065F46)
- Primary button text: /Body-Strong, white
- Secondary button text: /Body-Strong, brand color
- Cancel link: /Body, secondary, underline on hover

═══════════════════════════════════════
INTERFACE 7 — EMPTY STATES & ERRORS
═══════════════════════════════════════

- Empty state title: /H2, primary, centered
- Empty state description: /Body, secondary, centered, max-width 320px
- CTA button label: /Body-Strong
- Error code (404, 500): 64px, weight 500, brand color
- Error title: /H1
- Error description: /Body, secondary

═══════════════════════════════════════
SIDEBAR — ALL INTERFACES
═══════════════════════════════════════

- App name "StockFlow Pro": 17px, weight 500, primary
- App subtitle "Logistics Suite": 12px, weight 400, tertiary
- Nav item (inactive): /Body, 14px, secondary color
- Nav item (active): /Body-Strong, 14px, brand green #2D7A4F
- Nav badge (notification count): 11px, white on #E24B4A, pill
- User name (bottom): 13px, weight 500, primary
- User role: 11px, weight 400, tertiary

═══════════════════════════════════════
SPACING & READABILITY — ALL INTERFACES
═══════════════════════════════════════

- Minimum row/item height: 48px
- Card padding: 20px 22px
- Section spacing between blocks: 28px
- Label to value vertical gap: 6px
- Table cell vertical padding: 14px
- Line height for all body text: 1.6
- Line height for all headings: 1.2

═══════════════════════════════════════
OUTPUT REQUESTED
═══════════════════════════════════════

1. Create all Text Styles in the Figma Styles panel with the exact 
   names listed above (/Display, /H1, /H2 ... /Caption, /Mono)

2. Apply each style to every matching text layer across ALL frames

3. Generate a Typography Specimen page showing all styles in context
   with sample content from StockFlow Pro

4. Show a before/after comparison for each interface

5. Flag any text element that was too small (below 11px) or 
   inconsistent and show the fix applied