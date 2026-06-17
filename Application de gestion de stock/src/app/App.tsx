import { useState, useEffect } from "react";
import axios from "axios";
import {
  LayoutDashboard,
  Package,
  TrendingUp,
  TrendingDown,
  Bell,
  Moon,
  Sun,
  Search,
  Plus,
  Download,
  ChevronDown,
  Filter,
  Box,
  Truck,
  BarChart2,
  TriangleAlert,
  Calendar,
  X,
  Pencil,
  Trash2,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

// ── Types ─────────────────────────────────────────────────────────────────────

type Page = "dashboard" | "articles" | "mouvements" | "fournisseurs" | "notifications";
type MovementType = "ENTREE" | "SORTIE";
type StockStatus = "EN_STOCK" | "STOCK_BAS" | "RUPTURE";

interface Movement {
  id: string;
  date: string;
  article: string;
  type: MovementType;
  quantite: number;
  operateur: string;
}

interface Article {
  ref: string;
  designation: string;
  categorie: string;
  stock: number;
  seuil: number;
  fournisseur: string;
  statut: StockStatus;
}

interface Fournisseur {
  idFournisseur: number;
  nom: string;
  contact: string;
}

interface Notification {
  id: string;
  severity: "critical" | "warning" | "info";
  title: string;
  description: string;
  timestamp: string;
  unread: boolean;
}

interface PageProps {
  refreshKey: number;
  onDataChange: () => void;
}

// ── Data ──────────────────────────────────────────────────────────────────────

export let MOVEMENTS: Movement[] = [
  { id: "MVT-2458", date: "25 mai 2025", article: "Vis M6×12 inox", type: "ENTREE", quantite: 500, operateur: "Jean Dupont" },
  { id: "MVT-2457", date: "25 mai 2025", article: "Roulement 6205-2RS", type: "SORTIE", quantite: 50, operateur: "Marie Curie" },
  { id: "MVT-2456", date: "24 mai 2025", article: "Joint silicone 15mm", type: "ENTREE", quantite: 200, operateur: "Pierre Martin" },
  { id: "MVT-2455", date: "24 mai 2025", article: "Câble cuivre 6mm²", type: "SORTIE", quantite: 75, operateur: "Jean Dupont" },
  { id: "MVT-2454", date: "23 mai 2025", article: "Filtre à air G4", type: "ENTREE", quantite: 30, operateur: "Sophie Laurent" },
];

export let ARTICLES: Article[] = [
  { ref: "VIS-M6-12", designation: "Vis M6×12 inox", categorie: "Visserie", stock: 8420, seuil: 1000, fournisseur: "Boulonnerie Lefranc", statut: "EN_STOCK" },
  { ref: "ROD-ALU-40", designation: "Tige filetée alu Ø40", categorie: "Profilés", stock: 145, seuil: 200, fournisseur: "Métaux Guilbert", statut: "STOCK_BAS" },
  { ref: "JNT-SIL-15", designation: "Joint silicone 15mm", categorie: "Étanchéité", stock: 0, seuil: 500, fournisseur: "SealPro", statut: "RUPTURE" },
  { ref: "CAB-CU-6", designation: "Câble cuivre 6mm²", categorie: "Câblage", stock: 320, seuil: 400, fournisseur: "Fil & Câble SA", statut: "STOCK_BAS" },
  { ref: "RLT-6205", designation: "Roulement 6205-2RS", categorie: "Roulements", stock: 1840, seuil: 300, fournisseur: "NSK France", statut: "EN_STOCK" },
  { ref: "FLT-AIR-G4", designation: "Filtre à air G4 600×600", categorie: "Filtration", stock: 28, seuil: 40, fournisseur: "Camfil", statut: "STOCK_BAS" },
  { ref: "GNT-NITR-L", designation: "Gants nitrile T.L (boîte)", categorie: "EPI", stock: 2160, seuil: 500, fournisseur: "Uvex Safety", statut: "EN_STOCK" },
];

export let FOURNISSEURS: Fournisseur[] = [
  { idFournisseur: 1, nom: "Boulonnerie Lefranc", contact: "lefranc@boulonnerie.fr" },
  { idFournisseur: 2, nom: "Métaux Guilbert", contact: "commandes@guilbert-metaux.com" },
  { idFournisseur: 3, nom: "SealPro", contact: "+33 4 72 11 34 56" },
  { idFournisseur: 4, nom: "Fil & Câble SA", contact: "filcable@fcsa.fr" },
  { idFournisseur: 5, nom: "NSK France", contact: "nsk.fr@nsk.com" },
  { idFournisseur: 6, nom: "TotalEnergies Pro", contact: "pro@totalenergies.fr" },
  { idFournisseur: 7, nom: "Uvex Safety", contact: "uvex@uvex.fr" },
  { idFournisseur: 8, nom: "Camfil", contact: "camfil.fr@camfil.com" },
];

export let NOTIFICATIONS: Notification[] = [
  { id: "N1", severity: "critical", title: "Rupture de stock critique", description: "Joint silicone 15mm — stock à 0", timestamp: "Il y a 12 min", unread: true },
  { id: "N2", severity: "critical", title: "Stock sous le seuil minimum", description: "Câble cuivre 6mm² — 320 unités (seuil: 400)", timestamp: "Il y a 2h", unread: true },
  { id: "N3", severity: "warning", title: "Commande en attente", description: "En attente de livraison — Métaux Guilbert", timestamp: "Il y a 5h", unread: true },
  { id: "N4", severity: "info", title: "Nouvel article ajouté", description: "Disjoncteur 63A courbe C — par Sophie Laurent", timestamp: "Hier à 14:32", unread: false },
];

const CHART_DATA = [
  { jour: "Lun", entrees: 450, sorties: 320 },
  { jour: "Mar", entrees: 380, sorties: 290 },
  { jour: "Mer", entrees: 520, sorties: 410 },
  { jour: "Jeu", entrees: 290, sorties: 180 },
  { jour: "Ven", entrees: 610, sorties: 490 },
];

// ── Components ────────────────────────────────────────────────────────────────

function Sidebar({ page, setPage, darkMode, toggleDark }: { page: Page; setPage: (p: Page) => void; darkMode: boolean; toggleDark: () => void }) {
  const unreadCount = NOTIFICATIONS.filter(n => n.unread).length;

  return (
    <aside className="w-[260px] h-screen bg-card border-r border-border fixed left-0 top-0 flex flex-col">
      {/* App identity — 17px/500 primary, 12px/400 tertiary */}
      <div className="px-6 py-5 border-b border-border flex items-start justify-between">
        <div>
          <div className="text-[17px] font-medium text-foreground tracking-tight">StockFlow Pro</div>
          <div className="text-[12px] font-normal text-text-muted mt-0.5">Logistics Suite</div>
        </div>
        <button onClick={toggleDark} className="p-1.5 hover:bg-secondary rounded-lg transition-colors text-muted-foreground">
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>

      {/* Nav items — /Body 14px inactive muted, /Body-Strong 14px active brand green */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {[
          { id: "dashboard" as Page, label: "Tableau de Bord", icon: LayoutDashboard },
          { id: "articles" as Page, label: "Articles", icon: Package },
          { id: "mouvements" as Page, label: "Mouvements", icon: TrendingUp },
          { id: "fournisseurs" as Page, label: "Fournisseurs", icon: Truck },
          { id: "notifications" as Page, label: "Notifications", icon: Bell, badge: unreadCount },
        ].map(item => (
          <button
            key={item.id}
            onClick={() => setPage(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-[14px] transition-all relative ${
              page === item.id
                ? "bg-primary-light text-primary font-medium"
                : "text-muted-foreground font-normal hover:bg-secondary hover:text-foreground"
            }`}
          >
            {page === item.id && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 bg-primary rounded-r" />}
            <item.icon size={20} strokeWidth={1.5} />
            <span>{item.label}</span>
            {/* Nav badge — /Caption 11px white on red */}
            {item.badge !== undefined && item.badge > 0 && (
              <span className="ml-auto min-w-[20px] h-5 px-1 flex items-center justify-center rounded-full bg-destructive text-white text-[11px] font-medium">
                {item.badge}
              </span>
            )}
          </button>
        ))}
      </nav>

      {/* User — 13px/500 primary name, 11px/400 tertiary role */}
      <div className="px-3 pb-4">
        <div className="bg-secondary rounded-xl px-4 py-3 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-medium text-[13px] shrink-0">
            JD
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[13px] font-medium text-foreground truncate">Jean Dupont</div>
            <div className="text-[11px] font-normal text-text-muted truncate">Responsable Logistique</div>
          </div>
        </div>
      </div>
    </aside>
  );
}

/* /Display page title with 2px brand-green underline */
function PageHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  const today = new Date().toLocaleDateString("fr-FR", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
  return (
    <div className="flex items-start justify-between mb-8">
      <div>
        <h1 className="text-[32px] font-medium tracking-[-0.02em] text-foreground mb-1 relative inline-block leading-[1.2]">
          {title}
          <div className="absolute -bottom-1 left-0 w-10 h-[2px] bg-primary rounded" />
        </h1>
        {subtitle && <p className="text-[13px] font-normal text-muted-foreground mt-3">{subtitle}</p>}
      </div>
      <div className="text-[13px] font-normal text-text-muted">{today}</div>
    </div>
  );
}

/* KPI card — /Label label, 38px/500 value, /Body-Small subtitle */
function KPICard({ icon: Icon, label, value, subtitle, subtitleColor, isAlert }: {
  icon: React.ElementType;
  label: string;
  value: string;
  subtitle: string;
  subtitleColor?: string;
  isAlert?: boolean;
}) {
  return (
    <div className={`${isAlert ? "bg-destructive-light border-destructive/20" : "bg-card border-border"} border-[0.5px] rounded-xl p-5 shadow-sm`}>
      <div className="flex items-start gap-4">
        <div className={`w-12 h-12 rounded-lg ${isAlert ? "bg-destructive/10" : "bg-primary-light"} flex items-center justify-center shrink-0`}>
          <Icon size={22} strokeWidth={1.5} className={isAlert ? "text-destructive" : "text-primary"} />
        </div>
        <div className="flex-1">
          {/* /Label — 12px 500 uppercase 0.05em */}
          <div className="text-[12px] font-medium text-muted-foreground uppercase tracking-[0.05em] mb-2">{label}</div>
          {/* KPI value — 38px 500 -0.02em tabular */}
          <div className={`text-[38px] font-medium tracking-[-0.02em] leading-none mb-2 tabular-nums ${isAlert ? "text-destructive" : "text-foreground"}`}>{value}</div>
          {/* /Body-Small — 13px 400 */}
          <div className={`text-[13px] font-normal ${subtitleColor || "text-muted-foreground"}`}>{subtitle}</div>
        </div>
      </div>
    </div>
  );
}

/* /Caption badge — 11px 500 0.07em uppercase */
function MovementBadge({ type }: { type: MovementType }) {
  if (type === "ENTREE") {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-success-light text-success text-[11px] font-medium tracking-[0.07em] uppercase">
        <TrendingUp size={11} strokeWidth={2} />
        Entrée
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-destructive-light text-destructive-text text-[11px] font-medium tracking-[0.07em] uppercase">
      <TrendingDown size={11} strokeWidth={2} />
      Sortie
    </span>
  );
}

/* /Caption badge */
function StatusBadge({ status }: { status: StockStatus }) {
  const config = {
    EN_STOCK: { bg: "bg-success-light", text: "text-success", label: "En stock" },
    STOCK_BAS: { bg: "bg-warning-light", text: "text-warning", label: "Stock bas" },
    RUPTURE: { bg: "bg-destructive-light", text: "text-destructive-text", label: "Rupture" },
  };
  const { bg, text, label } = config[status];
  return (
    <span className={`inline-flex px-3 py-1 rounded-full text-[11px] font-medium tracking-[0.07em] uppercase ${bg} ${text}`}>
      {label}
    </span>
  );
}

// ── Modal ─────────────────────────────────────────────────────────────────────

/* Modal title — /H2 20px 500 */
function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-xl shadow-2xl w-full max-w-md">
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <h3 className="text-[20px] font-medium text-foreground leading-[1.25]">{title}</h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function checkAndNotifyStock(article: Article) {
  const toKeep = NOTIFICATIONS.filter(n => !n.description.startsWith(`${article.designation} — `));
  NOTIFICATIONS.splice(0, NOTIFICATIONS.length, ...toKeep);

  if (article.stock <= 0) {
    NOTIFICATIONS.unshift({
      id: "N" + Math.random().toString(36).substring(2, 8).toUpperCase(),
      severity: "critical",
      title: "Rupture de stock",
      description: `${article.designation} — stock à 0`,
      timestamp: "À l'instant",
      unread: true
    });
  } else if (article.stock <= article.seuil) {
    NOTIFICATIONS.unshift({
      id: "N" + Math.random().toString(36).substring(2, 8).toUpperCase(),
      severity: "warning",
      title: "Stock sous le seuil",
      description: `${article.designation} — ${article.stock} unités restantes`,
      timestamp: "À l'instant",
      unread: true
    });
  }
}

// ── Pages ─────────────────────────────────────────────────────────────────────

function DashboardPage() {
  const alertCount = ARTICLES.filter(a => a.statut === "RUPTURE" || a.statut === "STOCK_BAS").length;
  const criticalCount = ARTICLES.filter(a => a.statut === "RUPTURE").length;

  return (
    <div>
      <PageHeader title="Tableau de Bord" />

      <div className="grid grid-cols-3 gap-4 mb-8">
        <KPICard icon={Box} label="Total Articles" value={String(ARTICLES.length)} subtitle="+12% ce mois" subtitleColor="text-success" />
        <KPICard icon={Truck} label="Total Fournisseurs" value={String(FOURNISSEURS.length)} subtitle="Actifs et vérifiés" />
        <KPICard icon={TriangleAlert} label="Alertes de Stock" value={String(alertCount)} subtitle={`${criticalCount} articles critiques`} isAlert />
      </div>

      <div className="bg-card border-[0.5px] border-border rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-border-light flex items-center gap-2">
          <BarChart2 size={18} strokeWidth={1.5} className="text-primary" />
          {/* /H3 — 18px 500 */}
          <h2 className="text-[18px] font-medium text-foreground">Mouvements Récents</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border-light">
                {["ID", "DATE", "ARTICLE", "TYPE", "QUANTITÉ", "OPÉRATEUR"].map(h => (
                  <th key={h} className="px-6 py-3 text-left text-[11px] font-medium text-muted-foreground uppercase tracking-[0.07em]">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MOVEMENTS.map((m, i) => (
                <tr key={m.id} className={`border-b border-border-light hover:bg-secondary transition-colors ${i % 2 === 0 ? "" : "bg-secondary/30"}`} style={{ minHeight: 48 }}>
                  {/* /Mono — movement ID */}
                  <td className="px-6 py-[14px] font-mono text-[13px] font-medium text-foreground tabular-nums">{m.id}</td>
                  {/* /Body — secondary color */}
                  <td className="px-6 py-[14px] text-[14px] font-normal text-muted-foreground">{m.date}</td>
                  {/* /Body-Strong — article name */}
                  <td className="px-6 py-[14px] text-[14px] font-medium text-foreground">{m.article}</td>
                  <td className="px-6 py-[14px]"><MovementBadge type={m.type} /></td>
                  {/* /Body-Strong — quantity */}
                  <td className="px-6 py-[14px] text-[14px] font-medium text-foreground tabular-nums">{m.quantite}</td>
                  {/* /Body — secondary color */}
                  <td className="px-6 py-[14px] text-[14px] font-normal text-muted-foreground">{m.operateur}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function ArticlesPage({ refreshKey, onDataChange }: PageProps) {
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState<StockStatus | "TOUS">("TOUS");
  const [editing, setEditing] = useState<Article | null>(null);
  const [articles, setArticles] = useState<Article[]>([...ARTICLES]);

  useEffect(() => {
    setArticles([...(ARTICLES || [])]);
  }, [refreshKey]);

  const deleteArticle = async (ref: string) => {
    try {
      await axios.delete(`http://localhost:8080/api/articles/${ref}`);
    } catch (e) { console.error(e); }
    
    const articleToDelete = ARTICLES.find(a => a.ref === ref);
    if (articleToDelete) {
      const toKeep = NOTIFICATIONS.filter(n => !n.description.startsWith(`${articleToDelete.designation} — `));
      NOTIFICATIONS.splice(0, NOTIFICATIONS.length, ...toKeep);
    }

    const remaining = ARTICLES.filter(a => a.ref !== ref);
    ARTICLES.splice(0, ARTICLES.length, ...remaining);
    setArticles(prev => prev.filter(a => a.ref !== ref));

    const remainingMvts = MOVEMENTS.filter(m => m.article !== ref);
    MOVEMENTS.splice(0, MOVEMENTS.length, ...remainingMvts);
    onDataChange();
  };

  const exportCSV = (rows: Article[]) => {
    const headers = ["ref","designation","categorie","stock","seuil","fournisseur","statut"];
    const csv = [headers.join(",")].concat(rows.map(r => headers.map(h => `"${(r as any)[h] ?? ""}"`).join(","))).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'articles.csv'; document.body.appendChild(a); a.click(); URL.revokeObjectURL(url); a.remove();
  };

  const filteredArticles = articles.filter(a => {
    const matchesSearch = search === "" || a.designation.toLowerCase().includes(search.toLowerCase()) || a.ref.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "TOUS" || a.statut === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div>
      <PageHeader title="Articles" subtitle="Gestion du catalogue produits" />

      <div className="flex items-center gap-3 mb-6">
        <div className="flex-1 relative">
          <Search size={18} strokeWidth={1.5} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Rechercher un article…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full h-10 pl-11 pr-4 bg-card border border-border rounded-lg text-[14px] font-normal text-foreground placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>
          <button
            onClick={() => setShowFilters(prev => !prev)}
            className="h-10 px-4 bg-card border border-border rounded-lg text-[14px] font-medium text-foreground hover:bg-secondary transition-colors flex items-center gap-2"
          >
            <Filter size={16} strokeWidth={1.5} />
            Filtres
            <ChevronDown size={14} strokeWidth={1.5} />
          </button>
          <button
            onClick={() => exportCSV(filteredArticles)}
            className="h-10 px-4 bg-card border border-border rounded-lg text-[14px] font-medium text-foreground hover:bg-secondary transition-colors flex items-center gap-2"
          >
            <Download size={16} strokeWidth={1.5} />
            Exporter
          </button>
          <button
            onClick={() => { setShowModal(true); setEditing(null); }}
            className="h-9 px-4 bg-primary text-primary-foreground rounded-lg text-[14px] font-medium hover:bg-primary/90 transition-colors flex items-center gap-2"
          >
            <Plus size={16} strokeWidth={2} />
            Ajouter un article
          </button>
        </div>
        {showFilters && (
          <div className="mb-6 bg-card border border-border rounded-xl p-4 grid grid-cols-3 gap-4">
            <div>
              <div className="text-[12px] font-medium text-muted-foreground uppercase tracking-[0.05em] mb-2">Statut</div>
              <div className="flex flex-wrap gap-2">
                {(["TOUS", "EN_STOCK", "STOCK_BAS", "RUPTURE"] as const).map(status => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`px-3 py-1.5 rounded-full text-[12px] font-medium transition-colors ${statusFilter === status ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:bg-secondary/90"}`}
                  >
                    {status === "TOUS" ? "Tous" : status === "EN_STOCK" ? "En stock" : status === "STOCK_BAS" ? "Stock bas" : "Rupture"}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

      <div className="bg-card border-[0.5px] border-border rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border-light">
                {[
                  "REF",
                  "DÉSIGNATION",
                  "CATÉGORIE",
                  "STOCK",
                  "SEUIL",
                  "FOURNISSEUR",
                  "STATUT",
                  "ACTIONS",
                ].map(h => (
                  <th key={h} className="px-6 py-3 text-left text-[11px] font-medium text-muted-foreground uppercase tracking-[0.07em]">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredArticles.map((a, i) => (
                <tr key={a.ref} className={`border-b border-border-light hover:bg-secondary transition-colors ${i % 2 === 0 ? "" : "bg-secondary/30"}`} style={{ minHeight: 48 }}>
                  {/* /Mono — article ref */}
                  <td className="px-6 py-[14px] font-mono text-[13px] font-medium text-muted-foreground tabular-nums">{a.ref}</td>
                  {/* /Body-Strong — designation */}
                  <td className="px-6 py-[14px] text-[14px] font-medium text-foreground">{a.designation}</td>
                  <td className="px-6 py-[14px] text-[14px] font-normal text-muted-foreground">{a.categorie}</td>
                  {/* Stock — colored semantic */}
                  <td className={`px-6 py-[14px] text-[14px] font-medium tabular-nums ${a.statut === "EN_STOCK" ? "text-success" : "text-destructive-text"}`}>
                    {a.stock.toLocaleString()}
                  </td>
                  <td className="px-6 py-[14px] text-[14px] font-normal text-muted-foreground tabular-nums">{a.seuil.toLocaleString()}</td>
                  <td className="px-6 py-[14px] text-[14px] font-normal text-muted-foreground">{a.fournisseur}</td>
                  <td className="px-6 py-[14px]"><StatusBadge status={a.statut} /></td>
                  <td className="px-6 py-[14px]">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => { setEditing(a); setShowModal(true); }}
                        className="p-1.5 hover:bg-secondary rounded transition-colors text-muted-foreground hover:text-foreground"
                      >
                        <Pencil size={14} strokeWidth={1.5} />
                      </button>
                      <button onClick={() => deleteArticle(a.ref)} className="p-1.5 hover:bg-destructive-light rounded transition-colors text-muted-foreground hover:text-destructive">
                        <Trash2 size={14} strokeWidth={1.5} />
                      </button>
                      <button onClick={() => exportCSV([a])} className="p-1.5 hover:bg-secondary rounded transition-colors text-muted-foreground hover:text-foreground">
                        <Download size={14} strokeWidth={1.5} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))} 
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <Modal title={editing ? "Modifier l'article" : "Nouvel article"} onClose={() => { setShowModal(false); setEditing(null); }}>
          <form onSubmit={async (e) => {
            e.preventDefault();
            try {
              const newA: any = {
                ref: (document.getElementById('a-ref') as HTMLInputElement).value,
                designation: (document.getElementById('a-designation') as HTMLInputElement).value,
                categorie: (document.getElementById('a-categorie') as HTMLInputElement).value,
                stock: parseInt((document.getElementById('a-stock') as HTMLInputElement).value || '0', 10),
                seuil: parseInt((document.getElementById('a-seuil') as HTMLInputElement).value || '0', 10),
                fournisseur: (document.getElementById('a-fournisseur') as HTMLSelectElement).value,
              };
              if (!newA.ref || newA.ref.trim() === '') {
                newA.ref = 'REF-' + Math.random().toString(36).substring(2, 8).toUpperCase();
              }
              if (!newA.designation.trim() || !newA.categorie.trim() || !newA.fournisseur.trim() || newA.stock < 0 || newA.seuil < 0) {
                alert("Tous les champs doivent être valides.");
                return;
              }
              if (!editing && ARTICLES.some(a => a.ref === newA.ref)) {
                alert("Une référence d'article existe déjà.");
                return;
              }
              let savedArticle = newA;
              try {
                const response = await axios.post('http://localhost:8080/api/articles', newA);
                savedArticle = response.data ?? newA;
              } catch (err) {
                console.error("API non disponible, sauvegarde locale.");
              }
              if (savedArticle.stock <= 0) savedArticle.statut = "RUPTURE";
              else if (savedArticle.stock <= savedArticle.seuil) savedArticle.statut = "STOCK_BAS";
              else savedArticle.statut = "EN_STOCK";

              if (editing) {
                const updated = articles.map(a => a.ref === editing.ref ? savedArticle : a);
                ARTICLES.splice(0, ARTICLES.length, ...updated);
                setArticles(updated);
                checkAndNotifyStock(savedArticle);
              } else {
                ARTICLES.unshift(savedArticle);
                setArticles(prev => [savedArticle, ...prev]);
                checkAndNotifyStock(savedArticle);
              }
              if (onDataChange) onDataChange();
            } catch (err) {
              console.error(err);
            }
            setShowModal(false); setEditing(null);
          }}>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-[12px] font-medium text-muted-foreground uppercase tracking-[0.05em] mb-[6px]">Référence (ref)</label>
                <input
                  id="a-ref"
                  type="text"
                  required
                  defaultValue={editing?.ref}
                  placeholder="ex: REF-001"
                  className="w-full h-9 px-3 bg-secondary border border-border rounded-lg text-[14px] font-normal text-foreground placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-[12px] font-medium text-muted-foreground uppercase tracking-[0.05em] mb-[6px]">Désignation</label>
                <input
                  id="a-designation"
                  type="text"
                  required
                  defaultValue={editing?.designation}
                  placeholder="ex: Vis M6×12 inox"
                  className="w-full h-9 px-3 bg-secondary border border-border rounded-lg text-[14px] font-normal text-foreground placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-[12px] font-medium text-muted-foreground uppercase tracking-[0.05em] mb-[6px]">Catégorie</label>
                <input
                  id="a-categorie"
                  type="text"
                  required
                  defaultValue={editing?.categorie}
                  placeholder="ex: Visserie"
                  className="w-full h-9 px-3 bg-secondary border border-border rounded-lg text-[14px] font-normal text-foreground placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[12px] font-medium text-muted-foreground uppercase tracking-[0.05em] mb-[6px]">Stock</label>
                  <input
                    id="a-stock"
                    type="number"
                    required
                    min="0"
                    defaultValue={editing?.stock ?? 0}
                    className="w-full h-9 px-3 bg-secondary border border-border rounded-lg text-[14px] font-normal text-foreground placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-medium text-muted-foreground uppercase tracking-[0.05em] mb-[6px]">Seuil</label>
                  <input
                    id="a-seuil"
                    type="number"
                    required
                    min="0"
                    defaultValue={editing?.seuil ?? 0}
                    className="w-full h-9 px-3 bg-secondary border border-border rounded-lg text-[14px] font-normal text-foreground placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[12px] font-medium text-muted-foreground uppercase tracking-[0.05em] mb-[6px]">Fournisseur</label>
                <select
                  id="a-fournisseur"
                  required
                  defaultValue={editing?.fournisseur ?? ""}
                  className="w-full h-9 px-3 bg-secondary border border-border rounded-lg text-[14px] font-normal text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                >
                  <option value="" disabled>Sélectionnez un fournisseur</option>
                  {FOURNISSEURS.map(f => (
                    <option key={f.idFournisseur} value={f.nom}>{f.nom}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-border flex justify-end gap-3">
              <button
                type="button"
                onClick={() => { setShowModal(false); setEditing(null); }}
                className="h-9 px-4 bg-secondary border border-border rounded-lg text-[14px] font-medium text-foreground hover:bg-secondary/80 transition-colors"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="h-9 px-4 bg-primary text-primary-foreground rounded-lg text-[14px] font-medium hover:bg-primary/90 transition-colors"
              >
                {editing ? "Mettre à jour" : "Enregistrer"}
              </button> 
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

function MouvementsPage({ refreshKey, onDataChange }: PageProps) {
  const [filter, setFilter] = useState<"TOUS" | MovementType>("TOUS");
  const [showFilters, setShowFilters] = useState(false);
  const [periodFilter, setPeriodFilter] = useState<"TOUS" | "AUJOURDHUI" | "7_JOURS" | "30_JOURS">("TOUS");
  const [showModal, setShowModal] = useState(false);
  const [mouvements, setMouvements] = useState<Movement[]>([...MOVEMENTS]);

  useEffect(() => { setMouvements([...(MOVEMENTS || [])]); }, [refreshKey]);

  const parseFrenchDate = (dateStr: string) => {
    if (!dateStr) return new Date();
    const months = { "janvier": 0, "février": 1, "mars": 2, "avril": 3, "mai": 4, "juin": 5, "juillet": 6, "août": 7, "septembre": 8, "octobre": 9, "novembre": 10, "décembre": 11, "janv.": 0, "févr.": 1, "avr.": 3, "juil.": 6, "sept.": 8, "oct.": 9, "nov.": 10, "déc.": 11 };
    const parts = dateStr.toLowerCase().split(' ');
    if (parts.length >= 3) {
      const day = parseInt(parts[0], 10);
      const monthStr = parts[1] as keyof typeof months;
      const month = months[monthStr] !== undefined ? months[monthStr] : 0;
      const year = parseInt(parts[2], 10);
      return new Date(year, month, day);
    }
    return new Date();
  };

  const filteredMovements = mouvements.filter(m => {
    const typeMatch = filter === "TOUS" || m.type === filter;
    let periodMatch = true;
    if (periodFilter !== "TOUS") {
      const mDate = parseFrenchDate(m.date);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - mDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (periodFilter === "AUJOURDHUI") periodMatch = diffDays <= 1;
      if (periodFilter === "7_JOURS") periodMatch = diffDays <= 7;
      if (periodFilter === "30_JOURS") periodMatch = diffDays <= 30;
    }
    return typeMatch && periodMatch;
  });

  const exportMovementsCSV = (rows: Movement[]) => {
    const headers = ["id","date","article","type","quantite","operateur"];
    const csv = [headers.join(",")].concat(rows.map(r => headers.map(h => `"${(r as any)[h] ?? ""}"`).join(","))).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'mouvements.csv'; document.body.appendChild(a); a.click(); URL.revokeObjectURL(url); a.remove();
  };

  return (
    <div>
      <PageHeader title="Mouvements" subtitle="Historique des entrées et sorties" />

      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => setShowFilters(prev => !prev)} className="h-10 px-4 bg-card border border-border rounded-lg text-[14px] font-medium text-foreground hover:bg-secondary transition-colors flex items-center gap-2">
          <Calendar size={16} strokeWidth={1.5} />
          Période
          <ChevronDown size={14} strokeWidth={1.5} />
        </button>
        {/* /Label filter tabs */}
        <div className="flex items-center gap-2 bg-card border border-border rounded-lg p-1">
          {(["TOUS", "ENTREE", "SORTIE"] as const).map(t => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`px-3 py-1.5 rounded text-[11px] font-medium uppercase tracking-[0.05em] transition-colors ${
                filter === t ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t === "TOUS" ? "Tous" : t === "ENTREE" ? "Entrées" : "Sorties"}
            </button>
          ))}
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="ml-auto h-9 px-4 bg-primary text-primary-foreground rounded-lg text-[14px] font-medium hover:bg-primary/90 transition-colors flex items-center gap-2"
        >
          <Plus size={16} strokeWidth={2} />
          Ajouter un mouvement
        </button>
        <button onClick={() => exportMovementsCSV(filteredMovements)} className="h-9 px-4 bg-card border border-border rounded-lg text-[14px] font-medium text-foreground hover:bg-secondary transition-colors flex items-center gap-2">
          <Download size={16} strokeWidth={1.5} />
          Exporter
        </button>
      </div>

      {showFilters && (
        <div className="mb-6 bg-card border border-border rounded-xl p-4 grid grid-cols-3 gap-4">
          <div>
            <div className="text-[12px] font-medium text-muted-foreground uppercase tracking-[0.05em] mb-2">Période</div>
            <div className="flex flex-wrap gap-2">
              {(["TOUS", "AUJOURDHUI", "7_JOURS", "30_JOURS"] as const).map(p => (
                <button
                  key={p}
                  onClick={() => setPeriodFilter(p)}
                  className={`px-3 py-1.5 rounded-full text-[12px] font-medium transition-colors ${periodFilter === p ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:bg-secondary/90"}`}
                >
                  {p === "TOUS" ? "Toutes les dates" : p === "AUJOURDHUI" ? "Aujourd'hui" : p === "7_JOURS" ? "7 derniers jours" : "30 derniers jours"}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-3 gap-6 mb-6">
        <div className="col-span-2 bg-card border-[0.5px] border-border rounded-xl shadow-sm p-6">
          {/* /H3 */}
          <h3 className="text-[18px] font-medium text-foreground mb-4">Entrées vs Sorties (7 derniers jours)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={CHART_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.08)" />
              <XAxis dataKey="jour" tick={{ fontSize: 12, fill: "#6B7280" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "#6B7280" }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: "#fff", border: "1px solid rgba(0,0,0,0.12)", borderRadius: 8, fontSize: 12 }}
                cursor={{ fill: "rgba(45,122,79,0.05)" }}
              />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="entrees" fill="#2D7A4F" name="Entrées" radius={[4, 4, 0, 0]} />
              <Bar dataKey="sorties" fill="#E24B4A" name="Sorties" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-card border-[0.5px] border-border rounded-xl shadow-sm p-6 flex flex-col justify-center">
          {/* /Label */}
          <div className="text-[12px] font-medium text-muted-foreground uppercase tracking-[0.05em] mb-3">Total cette semaine</div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[14px] font-normal text-muted-foreground">Entrées</span>
              <span className="text-[24px] font-medium text-success tracking-[-0.02em] tabular-nums">2,250</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[14px] font-normal text-muted-foreground">Sorties</span>
              <span className="text-[24px] font-medium text-destructive-text tracking-[-0.02em] tabular-nums">1,690</span>
            </div>
            <div className="pt-3 border-t border-border-light flex items-center justify-between">
              <span className="text-[14px] font-medium text-foreground">Solde</span>
              <span className="text-[24px] font-medium text-primary tracking-[-0.02em] tabular-nums">+560</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-card border-[0.5px] border-border rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border-light">
                {["ID", "DATE", "ARTICLE", "TYPE", "QUANTITÉ", "OPÉRATEUR"].map(h => (
                  <th key={h} className="px-6 py-3 text-left text-[11px] font-medium text-muted-foreground uppercase tracking-[0.07em]">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredMovements.map((m, i) => (
                <tr key={m.id} className={`border-b border-border-light hover:bg-secondary transition-colors ${i % 2 === 0 ? "" : "bg-secondary/30"}`} style={{ minHeight: 48 }}>
                  <td className="px-6 py-[14px] font-mono text-[13px] font-medium text-foreground tabular-nums">{m.id}</td>
                  <td className="px-6 py-[14px] text-[14px] font-normal text-muted-foreground">{m.date}</td>
                  <td className="px-6 py-[14px] text-[14px] font-medium text-foreground">{m.article}</td>
                  <td className="px-6 py-[14px]"><MovementBadge type={m.type} /></td>
                  <td className="px-6 py-[14px] text-[14px] font-medium text-foreground tabular-nums">{m.quantite}</td>
                  <td className="px-6 py-[14px] text-[14px] font-normal text-muted-foreground">{m.operateur}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <Modal title="Nouveau mouvement" onClose={() => setShowModal(false)}>
          <form onSubmit={async (e) => {
            e.preventDefault();
            try {
              const type = (document.getElementById('m-type') as HTMLSelectElement).value;
              const article = (document.getElementById('m-article') as HTMLSelectElement).value;
              const quantiteStr = (document.getElementById('m-quantite') as HTMLInputElement).value;
              const operateur = (document.getElementById('m-operateur') as HTMLInputElement).value;

              const mvt: any = {
                type,
                article,
                quantite: parseInt(quantiteStr || '1', 10),
                operateur,
                date: new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
              };
              if (!article || !operateur.trim() || mvt.quantite < 1) {
                alert("Tous les champs du mouvement doivent être valides.");
                return;
              }
              let saved = mvt;
              try {
                const response = await axios.post('http://localhost:8080/api/mouvements', mvt);
                saved = response.data ?? mvt;
              } catch (err) {
                console.error("API non disponible, sauvegarde locale.");
              }
              MOVEMENTS.unshift(saved);
              setMouvements(prev => [saved, ...prev]);

              const targetArticle = ARTICLES.find(a => a.ref === article);
              if (targetArticle) {
                const oldStock = targetArticle.stock;
                if (type === 'ENTREE') targetArticle.stock += mvt.quantite;
                if (type === 'SORTIE') targetArticle.stock -= mvt.quantite;
                
                if (targetArticle.stock <= 0) targetArticle.statut = "RUPTURE";
                else if (targetArticle.stock <= targetArticle.seuil) targetArticle.statut = "STOCK_BAS";
                else targetArticle.statut = "EN_STOCK";
                
                checkAndNotifyStock(targetArticle);
              }

              if (onDataChange) onDataChange();
            } catch (err) { console.error(err); }
            setShowModal(false);
          }}>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-[12px] font-medium text-muted-foreground uppercase tracking-[0.05em] mb-[6px]">Type de mouvement</label>
                <select id="m-type" required className="w-full h-9 px-3 bg-secondary border border-border rounded-lg text-[14px] font-normal text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary">
                  <option value="ENTREE">Entrée</option>
                  <option value="SORTIE">Sortie</option>
                </select>
              </div>
              <div>
                <label className="block text-[12px] font-medium text-muted-foreground uppercase tracking-[0.05em] mb-[6px]">Article (Réf)</label>
                <select id="m-article" required className="w-full h-9 px-3 bg-secondary border border-border rounded-lg text-[14px] font-normal text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary">
                  <option value="" disabled selected>Sélectionnez un article</option>
                  {ARTICLES.map(a => (
                    <option key={a.ref} value={a.ref}>{a.designation} ({a.ref})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[12px] font-medium text-muted-foreground uppercase tracking-[0.05em] mb-[6px]">Quantité</label>
                <input id="m-quantite" type="number" required min="1" defaultValue="1" className="w-full h-9 px-3 bg-secondary border border-border rounded-lg text-[14px] font-normal text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
              </div>
              <div>
                <label className="block text-[12px] font-medium text-muted-foreground uppercase tracking-[0.05em] mb-[6px]">Opérateur</label>
                <input id="m-operateur" type="text" required placeholder="ex: Jean Dupont" className="w-full h-9 px-3 bg-secondary border border-border rounded-lg text-[14px] font-normal text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
              </div>
            </div>
            <div className="px-6 py-4 border-t border-border flex justify-end gap-3">
              <button type="button" onClick={() => setShowModal(false)} className="h-9 px-4 bg-secondary border border-border rounded-lg text-[14px] font-medium text-foreground hover:bg-secondary/80 transition-colors">
                Annuler
              </button>
              <button
                type="submit"
                className="h-9 px-4 bg-primary text-primary-foreground rounded-lg text-[14px] font-medium hover:bg-primary/90 transition-colors"
              >
                Enregistrer
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

function FournisseursPage({ refreshKey, onDataChange }: PageProps) {
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Fournisseur | null>(null);
  const [fournisseurs, setFournisseurs] = useState<Fournisseur[]>([...FOURNISSEURS]);

  useEffect(() => { setFournisseurs([...(FOURNISSEURS || [])]); }, [refreshKey]);

  const deleteFournisseur = async (id: number) => {
    const fToDelete = fournisseurs.find(f => f.idFournisseur === id);
    try {
      await axios.delete(`http://localhost:8080/api/fournisseurs/${id}`);
    } catch (e) { console.error(e); }

    if (fToDelete) {
      const deletedArticles = ARTICLES.filter(a => a.fournisseur === fToDelete.nom);
      if (deletedArticles.length > 0) {
        deletedArticles.forEach(art => {
          const toKeep = NOTIFICATIONS.filter(n => !n.description.startsWith(`${art.designation} — `));
          NOTIFICATIONS.splice(0, NOTIFICATIONS.length, ...toKeep);
        });
        const deletedRefs = new Set(deletedArticles.map(a => a.ref));
        
        const remainingArticles = ARTICLES.filter(a => a.fournisseur !== fToDelete.nom);
        ARTICLES.splice(0, ARTICLES.length, ...remainingArticles);

        const remainingMovements = MOVEMENTS.filter(m => !deletedRefs.has(m.article));
        MOVEMENTS.splice(0, MOVEMENTS.length, ...remainingMovements);
      }
    }

    const remaining = FOURNISSEURS.filter(f => f.idFournisseur !== id);
    FOURNISSEURS.splice(0, FOURNISSEURS.length, ...remaining);
    setFournisseurs(prev => prev.filter(f => f.idFournisseur !== id));
    onDataChange();
  };

  const saveFournisseur = async () => {
    try {
      const nom = (document.getElementById('f-nom') as HTMLInputElement).value.trim();
      const contact = (document.getElementById('f-contact') as HTMLInputElement).value.trim();

      if (!nom || !contact) {
        alert("Les champs nom et contact ne doivent pas être vides.");
        return;
      }

      const newF: any = {
        nom,
        contact,
      };
      if (editing) {
        newF.idFournisseur = editing.idFournisseur;
      } else {
        newF.idFournisseur = Math.max(0, ...fournisseurs.map(f => f.idFournisseur)) + 1;
      }

      let saved = newF;
      try {
        const response = await axios.post('http://localhost:8080/api/fournisseurs', newF);
        saved = response.data ?? newF;
      } catch (e) {
        console.error("API non disponible, sauvegarde locale.");
      }

      if (editing) {
        const updated = fournisseurs.map(f => f.idFournisseur === editing.idFournisseur ? saved : f);
        FOURNISSEURS.splice(0, FOURNISSEURS.length, ...updated);
        setFournisseurs(updated);
      } else {
        FOURNISSEURS.unshift(saved);
        setFournisseurs(prev => [saved, ...prev]);
      }
      setShowModal(false); setEditing(null);
      onDataChange();
    } catch (e) {
      console.error(e);
    }
  };

  const filtered = fournisseurs.filter(f =>
    search === "" ||
    f.nom.toLowerCase().includes(search.toLowerCase()) ||
    f.contact.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <PageHeader title="Fournisseurs" subtitle="Gestion des fournisseurs" />

      <div className="flex items-center gap-3 mb-6">
        <div className="flex-1 relative">
          <Search size={18} strokeWidth={1.5} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Rechercher un fournisseur…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full h-10 pl-11 pr-4 bg-card border border-border rounded-lg text-[14px] font-normal text-foreground placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>
        <button
          onClick={() => { setShowModal(true); setEditing(null); }}
          className="h-9 px-4 bg-primary text-primary-foreground rounded-lg text-[14px] font-medium hover:bg-primary/90 transition-colors flex items-center gap-2"
        >
          <Plus size={16} strokeWidth={2} />
          Ajouter un fournisseur
        </button>
      </div>

      <div className="bg-card border-[0.5px] border-border rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border-light bg-secondary/30">
                {["ID", "NOM", "CONTACT", "ACTIONS"].map(h => (
                  <th key={h} className="px-6 py-3 text-left text-[11px] font-medium text-muted-foreground uppercase tracking-[0.07em]">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((f, i) => (
                <tr key={f.idFournisseur} className={`border-b border-border-light hover:bg-secondary transition-colors ${i % 2 === 0 ? "" : "bg-secondary/30"}`} style={{ minHeight: 48 }}>
                  {/* /Mono — supplier ID */}
                  <td className="px-6 py-[14px] font-mono text-[13px] font-medium text-muted-foreground tabular-nums">{f.idFournisseur}</td>
                  {/* /H3 in table — supplier name */}
                  <td className="px-6 py-[14px] text-[14px] font-medium text-foreground">{f.nom}</td>
                  {/* /Body — contact secondary */}
                  <td className="px-6 py-[14px] text-[14px] font-normal text-muted-foreground">{f.contact}</td>
                  <td className="px-6 py-[14px]">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => { setEditing(f); setShowModal(true); }}
                        className="p-1.5 hover:bg-secondary rounded transition-colors text-muted-foreground hover:text-foreground"
                      >
                        <Pencil size={14} strokeWidth={1.5} />
                      </button>
                      <button onClick={() => deleteFournisseur(f.idFournisseur)} className="p-1.5 hover:bg-destructive-light rounded transition-colors text-muted-foreground hover:text-destructive">
                        <Trash2 size={14} strokeWidth={1.5} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <Modal title={editing ? "Modifier le fournisseur" : "Nouveau fournisseur"} onClose={() => { setShowModal(false); setEditing(null); }}>
          <form onSubmit={async (e) => {
            e.preventDefault();
            try {
              const nom = (document.getElementById('f-nom') as HTMLInputElement).value;
              const contact = (document.getElementById('f-contact') as HTMLInputElement).value;
              const articlesInput = (document.getElementById('f-articles') as HTMLInputElement).value;

              const newF: any = {
                nom,
                contact,
                articles: articlesInput,
              };
              if (editing) {
                newF.idFournisseur = editing.idFournisseur;
              } else {
                newF.idFournisseur = Math.max(0, ...fournisseurs.map(f => f.idFournisseur)) + 1;
              }

              let saved = newF;
              try {
                const response = await axios.post('http://localhost:8080/api/fournisseurs', newF);
                saved = response.data ?? newF;
              } catch (err) {
                console.error("API non disponible, sauvegarde locale.");
              }

              if (editing) {
                const updated = fournisseurs.map(f => f.idFournisseur === editing.idFournisseur ? saved : f);
                FOURNISSEURS.splice(0, FOURNISSEURS.length, ...updated);
                setFournisseurs(updated);
              } else {
                FOURNISSEURS.unshift(saved);
                setFournisseurs(prev => [saved, ...prev]);
              }
              setShowModal(false); setEditing(null);
            } catch (err) {
              console.error(err);
            }
          }}>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-[12px] font-medium text-muted-foreground uppercase tracking-[0.05em] mb-[6px]">Nom</label>
                <input
                  id="f-nom"
                  type="text"
                  required
                  defaultValue={editing?.nom}
                  placeholder="ex: Boulonnerie Lefranc"
                  className="w-full h-9 px-3 bg-secondary border border-border rounded-lg text-[14px] font-normal text-foreground placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-[12px] font-medium text-muted-foreground uppercase tracking-[0.05em] mb-[6px]">Contact</label>
                <input
                  id="f-contact"
                  type="text"
                  required
                  pattern="^([a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}|\+?[0-9\s.\-]{8,20})$"
                  title="Veuillez entrer une adresse e-mail valide ou un numéro de téléphone"
                  defaultValue={editing?.contact}
                  placeholder="ex: contact@fournisseur.fr ou 0601020304"
                  className="w-full h-9 px-3 bg-secondary border border-border rounded-lg text-[14px] font-normal text-foreground placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
            </div>
            <div className="px-6 py-4 border-t border-border flex justify-end gap-3">
              <button
                type="button"
                onClick={() => { setShowModal(false); setEditing(null); }}
                className="h-9 px-4 bg-secondary border border-border rounded-lg text-[14px] font-medium text-foreground hover:bg-secondary/80 transition-colors"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="h-9 px-4 bg-primary text-primary-foreground rounded-lg text-[14px] font-medium hover:bg-primary/90 transition-colors"
              >
                {editing ? "Mettre à jour" : "Enregistrer"}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([...NOTIFICATIONS]);

  useEffect(() => { setNotifications([...(NOTIFICATIONS || [])]); }, []);

  const markAllRead = () => {
    const updated = notifications.map(n => ({ ...n, unread: false }));
    NOTIFICATIONS.splice(0, NOTIFICATIONS.length, ...updated);
    setNotifications(updated);
  };

  const deleteNotification = (id: string) => {
    const remaining = notifications.filter(n => n.id !== id);
    NOTIFICATIONS.splice(0, NOTIFICATIONS.length, ...remaining);
    setNotifications(remaining);
  };

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <div>
      <div className="flex items-start justify-between mb-8">
        <div>
          {/* /Display */}
          <h1 className="text-[32px] font-medium tracking-[-0.02em] text-foreground mb-1 relative inline-block leading-[1.2]">
            Notifications
            <div className="absolute -bottom-1 left-0 w-10 h-[2px] bg-primary rounded" />
          </h1>
          {/* /Body-Small secondary */}
          <p className="text-[13px] font-normal text-muted-foreground mt-3">{unreadCount} non lue{unreadCount > 1 ? "s" : ""}</p>
        </div>
        <button onClick={markAllRead} className="text-[14px] font-medium text-primary hover:text-primary/80 transition-colors">
          Tout marquer comme lu
        </button>
      </div>

      <div className="space-y-3">
        {notifications.map(n => {
          const severityConfig = {
            critical: { border: "border-l-destructive", bg: "bg-destructive-light/30", icon: TriangleAlert, iconColor: "text-destructive" },
            warning: { border: "border-l-warning", bg: "bg-warning-light/30", icon: TriangleAlert, iconColor: "text-warning" },
            info: { border: "border-l-info", bg: "bg-info-light/30", icon: Bell, iconColor: "text-info" },
          };
          const config = severityConfig[n.severity];
          const Icon = config.icon;

          return (
            <div
              key={n.id}
              className={`bg-card border-[0.5px] border-border border-l-[3px] ${config.border} rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow relative`}
            >
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-lg ${config.bg} flex items-center justify-center shrink-0`}>
                  <Icon size={20} strokeWidth={1.5} className={config.iconColor} />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-4 mb-1">
                    {/* /Body-Strong — notification title */}
                    <h3 className="text-[14px] font-medium text-foreground leading-[1.6]">{n.title}</h3>
                    {/* /Caption — timestamp tertiary */}
                    <span className="text-[11px] font-medium text-text-muted uppercase tracking-[0.07em] whitespace-nowrap">{n.timestamp}</span>
                  </div>
                  {/* /Body — description secondary */}
                  <p className="text-[14px] font-normal text-muted-foreground leading-[1.6]">{n.description}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <button onClick={() => deleteNotification(n.id)} className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive-light transition-colors rounded">
                    <Trash2 size={14} strokeWidth={1.5} />
                  </button>
                  {n.unread && (
                    <div className="w-2 h-2 rounded-full bg-primary" />
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Root App ──────────────────────────────────────────────────────────────────

export default function App() {
  const [page, setPage] = useState<Page>("dashboard");
  const [darkMode, setDarkMode] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [dataRefreshKey, setDataRefreshKey] = useState(0);
  const refreshGlobalData = () => setDataRefreshKey(prev => prev + 1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [artRes, movRes, fouRes, notRes] = await Promise.all([
          axios.get("http://localhost:8080/api/articles"),
          axios.get("http://localhost:8080/api/mouvements"),
          axios.get("http://localhost:8080/api/fournisseurs"),
          axios.get("http://localhost:8080/api/notifications")
        ]);
        ARTICLES.length = 0; ARTICLES.push(...artRes.data);
        MOVEMENTS.length = 0; MOVEMENTS.push(...movRes.data);
        FOURNISSEURS.length = 0; FOURNISSEURS.push(...fouRes.data);
        NOTIFICATIONS.length = 0; NOTIFICATIONS.push(...notRes.data);
      } catch (e) {
        console.error("API non disponible, utilisation des fausses données.");
      }
      setDataLoaded(true);
    };
    fetchData();
  }, []);

  if (!dataLoaded) return <div className="min-h-screen bg-background flex items-center justify-center">Chargement...</div>;


  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="min-h-screen bg-background" style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}>
        <Sidebar page={page} setPage={setPage} darkMode={darkMode} toggleDark={() => setDarkMode(!darkMode)} />
        <main className="ml-[260px] p-8">
          {page === "dashboard" && <DashboardPage />}
          {page === "articles" && <ArticlesPage refreshKey={dataRefreshKey} onDataChange={refreshGlobalData} />}
          {page === "mouvements" && <MouvementsPage refreshKey={dataRefreshKey} onDataChange={refreshGlobalData} />}
          {page === "fournisseurs" && <FournisseursPage refreshKey={dataRefreshKey} onDataChange={refreshGlobalData} />}
          {page === "notifications" && <NotificationsPage />}
        </main>
      </div>
    </div>
  );
}

