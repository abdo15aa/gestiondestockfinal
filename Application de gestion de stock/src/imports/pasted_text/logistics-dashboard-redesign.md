You are a senior UI/UX designer. Redesign a logistics dashboard 
application called "StockFlow Pro — Logistics Suite" with the 
following exact design system:

━━━━━━━━━━━━━━━━━━━━━━━━
TYPOGRAPHY
━━━━━━━━━━━━━━━━━━━━━━━━
Font family: Plus Jakarta Sans (all elements)
- Page titles: 22px / weight 600
- Section headers: 16px / weight 500
- Table column labels: 11px / weight 500 / uppercase / 
  letter-spacing 0.06em
- Table body data: 14px / weight 500
- Stat numbers (KPI cards): 28px / weight 600
- Sub-labels / captions: 12px / weight 400 / muted color
- Sidebar nav items: 14px / weight 500

━━━━━━━━━━━━━━━━━━━━━━━━
COLOR PALETTE — Teal & Slate
━━━━━━━━━━━━━━━━━━━━━━━━
Primary action / accent:     #0F6E56 (deep teal)
Primary light (hover/bg):    #E1F5EE
Info / links:                #185FA5 (blue)
Info light bg:               #E6F1FB
Success badge bg:            #EAF3DE
Success badge text:          #3B6D11
Danger / alert:              #E24B4A
Danger light bg:             #FCEBEB
Danger text:                 #A32D2D
Warning:                     #BA7517
Warning light bg:            #FAEEDA
Page background:             #F5F4F0
Card background:             #FFFFFF
Sidebar background:          #FFFFFF
Border color (default):      rgba(0,0,0,0.12)
Text primary:                #1A1A18
Text secondary:              #6B6A64
Text muted:                  #9B9A94

━━━━━━━━━━━━━━━━━━━━━━━━
LAYOUT & SPACING
━━━━━━━━━━━━━━━━━━━━━━━━
Border radius cards:         12px
Border radius buttons:       8px
Border radius badges:        999px (full pill)
Card border:                 0.5px solid rgba(0,0,0,0.12)
Card padding:                20px 24px
Sidebar width:               260px
Top bar height:              64px
Content padding:             32px
Grid gap (KPI cards):        16px
Table row height:            52px
Table row separator:         0.5px solid rgba(0,0,0,0.08)

━━━━━━━━━━━━━━━━━━━━━━━━
COMPONENTS TO DESIGN
━━━━━━━━━━━━━━━━━━━━━━━━

1. SIDEBAR (left, fixed, 260px wide)
   - Logo "StockFlow Pro" bold 16px + subtitle 
     "Logistics Suite" muted 12px
   - Dark mode toggle icon (top right of sidebar)
   - Nav items with Lucide outline icons:
     * Tableau de Bord (active state: teal bg #E1F5EE, 
       teal text #0F6E56, left border 3px solid #0F6E56)
     * Articles
     * Mouvements
     * Notifications (red dot badge showing count "4")
   - User profile card at bottom: avatar circle initials 
     "JD", name "Jean Dupont", role 
     "Responsable Logistique"

2. DASHBOARD PAGE — "Tableau de Bord"
   - Page title 22px/600 with teal underline accent (3px, 
     width 40px)
   - Current date top right, muted 13px
   - KPI CARDS ROW (3 cards, equal width):
     * Card 1 — Total Articles: icon box outline teal, 
       number 1,240 in 28px/600, subtitle "+12% ce mois" 
       in green #3B6D11 with up arrow icon
     * Card 2 — Total Fournisseurs: icon truck outline teal,
       number 8, subtitle "Actifs et vérifiés" muted
     * Card 3 — Alertes de Stock: red bg #FCEBEB, 
       icon triangle-alert in #E24B4A, number 4 in 
       #E24B4A 28px/600, subtitle "2 articles critiques" 
       in #A32D2D
   - RECENT MOVEMENTS TABLE CARD:
     * Card with white bg, 12px radius, 0.5px border
     * Section title "Mouvements Récents" 16px/500 
       with bar-chart icon left
     * Columns: ID / DATE / ARTICLE / TYPE / QUANTITÉ / 
       OPÉRATEUR
     * Column headers: 11px uppercase muted, 
       letter-spacing 0.06em
     * TYPE column uses pill badges:
       - ENTRÉE: bg #EAF3DE, text #3B6D11, 
         with trend-up icon
       - SORTIE: bg #FCEBEB, text #A32D2D, 
         with trend-down icon
     * QUANTITÉ: 14px/600 dark
     * Alternating row hover state: bg #F5F4F0
     * 5 rows of sample data

3. ARTICLES PAGE
   - Search bar (full width, 40px height, 8px radius, 
     search icon left)
   - Filter row: dropdown buttons for Catégorie, 
     Fournisseur, Stock status
   - "+ Ajouter un article" button: bg #0F6E56, 
     text white, 8px radius, 36px height
   - Data table same style as dashboard with columns:
     REF / DÉSIGNATION / CATÉGORIE / STOCK / SEUIL / 
     FOURNISSEUR / STATUT
   - STATUT badges: 
     * "En stock" → green pill
     * "Stock bas" → amber pill  
     * "Rupture" → red pill
   - Pagination component at bottom

4. MOUVEMENTS PAGE
   - Date range picker (start — end)
   - Type filter toggle: Tous / Entrées / Sorties
   - Export button (outline style, download icon)
   - Full movement history table (same style)
   - Small bar chart showing entries vs exits per day 
     (teal bars for entrées, red for sorties)

5. NOTIFICATIONS PAGE
   - List of notification cards, each with:
     * Left colored border (3px): red for critical, 
       amber for warning, teal for info
     * Icon matching severity
     * Title 14px/500 + description 13px muted
     * Timestamp right-aligned muted
     * Unread dot indicator (teal #0F6E56, 8px circle)
   - "Tout marquer comme lu" link top right

━━━━━━━━━━━━━━━━━━━━━━━━
GENERAL RULES
━━━━━━━━━━━━━━━━━━━━━━━━
- No gradients, no shadows (except subtle 
  box-shadow: 0 1px 3px rgba(0,0,0,0.06) on cards)
- All icons: Lucide outline style, 20px, stroke 1.5px
- Sentence case everywhere (never ALL CAPS except 
  table column headers)
- Consistent 8px grid spacing system
- All interactive elements have hover + focus states
- Design for 1440px desktop, responsive down to 1280px