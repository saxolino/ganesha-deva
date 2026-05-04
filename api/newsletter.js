/* Vercel Serverless Function: POST /api/newsletter
   Riceve { nome, cognome, email }, valida, iscrive in lista Brevo.
   Se BREVO_API_KEY non è configurata, restituisce mock 200 e logga.
   ENV richieste:
   - BREVO_API_KEY        (stessa di /api/contact)
   - BREVO_LIST_ID        (id numerico della lista Brevo, es. 5)
   - SITE_ORIGIN          (opzionale, default https://www.ganeshaexperience.it)
*/

const { applyCors, rateLimited, isBot } = require("./_helpers");

module.exports = async (req, res) => {
  if (applyCors(req, res)) return;

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST, OPTIONS");
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (rateLimited(req)) {
    return res.status(429).json({ error: "Troppe richieste. Riprova tra un minuto." });
  }

  let body = req.body;
  if (typeof body === "string") {
    try { body = JSON.parse(body); } catch { body = {}; }
  }
  body = body || {};

  if (isBot(body)) {
    return res.status(200).json({ message: "Iscrizione registrata." });
  }

  const nome = String(body.nome || "").trim();
  const cognome = String(body.cognome || "").trim();
  const email = String(body.email || "").trim();

  if (!email) return res.status(400).json({ error: "Email obbligatoria." });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: "Email non valida." });
  }

  const apiKey = process.env.BREVO_API_KEY;
  const listId = parseInt(process.env.BREVO_LIST_ID || "0", 10);

  if (!apiKey || !listId) {
    console.log("[newsletter] Brevo non configurato, mock subscribe:", { nome, cognome, email });
    return res.status(200).json({ message: "Iscrizione registrata. Ti aggiorneremo presto!" });
  }

  try {
    const resp = await fetch("https://api.brevo.com/v3/contacts", {
      method: "POST",
      headers: {
        "api-key": apiKey,
        "content-type": "application/json",
        accept: "application/json"
      },
      body: JSON.stringify({
        email,
        attributes: { FIRSTNAME: nome, LASTNAME: cognome },
        listIds: [listId],
        updateEnabled: true
      })
    });

    if (!resp.ok && resp.status !== 204) {
      const err = await resp.text().catch(() => "");
      console.error("[newsletter] Brevo error:", resp.status, err);
      return res.status(502).json({ error: "Iscrizione non riuscita. Riprova più tardi." });
    }

    return res.status(200).json({ message: "Iscrizione completata. Controlla la tua email." });
  } catch (e) {
    console.error("[newsletter] fetch error:", e);
    return res.status(500).json({ error: "Errore interno. Riprova più tardi." });
  }
};
