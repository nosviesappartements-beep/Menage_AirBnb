import express from "express";
import ical from "node-ical";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;

// --- Vos logements et leurs liens iCal Airbnb ---
// Renseignez-les soit ici directement, soit via les variables
// d'environnement ICAL_URL_1 / ICAL_URL_2 (recommandé sur Render,
// pour ne pas mettre vos liens dans le code).
const LOGEMENTS = [
  { id: "l0", nom: "Logement 1", ical: process.env.ICAL_URL_1 || "" },
  { id: "l1", nom: "Logement 2", ical: process.env.ICAL_URL_2 || "" }
];

const TTL_MS = 15 * 60 * 1000; // on ne relit les flux qu'au maximum toutes les 15 minutes
let cache = { at: 0, data: null };

async function fetchReservations() {
  const reservations = [];
  for (const l of LOGEMENTS) {
    if (!l.ical) continue;
    try {
      const events = await ical.async.fromURL(l.ical);
      for (const key in events) {
        const ev = events[key];
        if (ev.type !== "VEVENT" || !ev.start || !ev.end) continue;
        reservations.push({
          logement: l.id,
          debut: ev.start.toISOString(),
          fin: ev.end.toISOString(),
          uid: ev.uid || key
        });
      }
    } catch (err) {
      console.error(`Erreur de lecture du flux iCal pour ${l.nom} :`, err.message);
    }
  }
  reservations.sort((a, b) => new Date(a.fin) - new Date(b.fin));
  return {
    logements: LOGEMENTS.map(({ id, nom }) => ({ id, nom })),
    reservations,
    misAJour: new Date().toISOString()
  };
}

app.get("/api/reservations", async (req, res) => {
  const now = Date.now();
  const force = req.query.force === "1";
  if (force || !cache.data || now - cache.at > TTL_MS) {
    cache.data = await fetchReservations();
    cache.at = now;
  }
  res.json(cache.data);
});

app.use(express.static(path.join(__dirname, "public")));

app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
