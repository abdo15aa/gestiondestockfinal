import os

app_file = "d:/Documents/projetLogiciel/Application de gestion de stock/src/app/App.tsx"

with open(app_file, "r", encoding="utf-8") as f:
    content = f.read()

# Replace const with let for data arrays
content = content.replace("const MOVEMENTS: Movement[] =", "export let MOVEMENTS: Movement[] =")
content = content.replace("const ARTICLES: Article[] =", "export let ARTICLES: Article[] =")
content = content.replace("const FOURNISSEURS: Fournisseur[] =", "export let FOURNISSEURS: Fournisseur[] =")
content = content.replace("const NOTIFICATIONS: Notification[] =", "export let NOTIFICATIONS: Notification[] =")

# Add fetch logic inside App
app_start = """export default function App() {
  const [page, setPage] = useState<Page>("dashboard");
  const [darkMode, setDarkMode] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);

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
"""

content = content.replace("""export default function App() {
  const [page, setPage] = useState<Page>("dashboard");
  const [darkMode, setDarkMode] = useState(false);""", app_start)


# Update the add fournisseur logic to call the API
fournisseur_save_btn_original = """<button
              onClick={() => { setShowModal(false); setEditing(null); }}
              className="h-9 px-4 bg-primary text-primary-foreground rounded-lg text-[14px] font-medium hover:bg-primary/90 transition-colors"
            >
              {editing ? "Mettre à jour" : "Enregistrer"}
            </button>"""

fournisseur_save_btn_new = """<button
              onClick={async () => { 
                try {
                  const newF = { nom: (document.getElementById('f-nom') as HTMLInputElement).value, contact: (document.getElementById('f-contact') as HTMLInputElement).value, articles: (document.getElementById('f-articles') as HTMLInputElement).value };
                  if (editing) {
                    newF['idFournisseur'] = editing.idFournisseur;
                  }
                  await axios.post('http://localhost:8080/api/fournisseurs', newF);
                  // Refresh window for simplicity
                  window.location.reload();
                } catch(e) { console.error(e); }
                setShowModal(false); setEditing(null); 
              }}
              className="h-9 px-4 bg-primary text-primary-foreground rounded-lg text-[14px] font-medium hover:bg-primary/90 transition-colors"
            >
              {editing ? "Mettre à jour" : "Enregistrer"}
            </button>"""

content = content.replace(fournisseur_save_btn_original, fournisseur_save_btn_new)

# Add IDs to the modal inputs
content = content.replace("""<input
                type="text"
                defaultValue={editing?.nom}""", """<input
                id="f-nom"
                type="text"
                defaultValue={editing?.nom}""")

content = content.replace("""<input
                type="text"
                defaultValue={editing?.contact}""", """<input
                id="f-contact"
                type="text"
                defaultValue={editing?.contact}""")

content = content.replace("""<input
                type="text"
                defaultValue={editing?.articles}""", """<input
                id="f-articles"
                type="text"
                defaultValue={editing?.articles}""")

with open(app_file, "w", encoding="utf-8") as f:
    f.write(content)
