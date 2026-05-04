/* Vercel Serverless Function: POST /api/contact
   Riceve { name, email, message }, valida, inoltra a Brevo (Sendinblue).
   Se BREVO_API_KEY non è configurata, restituisce mock 200 e logga il messaggio.
   ENV richieste:
   - BREVO_API_KEY      (https://account.brevo.com/security/api_keys)
   - CONTACT_TO         (es. info@ganeshaexperience.it)
   - CONTACT_FROM       (mittente verificato in Brevo, es. no-reply@ganeshaexperience.it)
   - SITE_ORIGIN        (opzionale, default https://www.ganeshaexperience.it)
*/

const { applyCors, rateLimited, isBot, escapeHtml } = require("./_helpers");

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
    return res.status(200).json({ message: "Grazie!" });
  }

  const name = String(body.name || "").trim();
  const email = String(body.email || "").trim();
  const message = String(body.message || "").trim();

  if (!name || !email || !message) {
    return res.status(400).json({ error: "Tutti i campi sono obbligatori." });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: "Email non valida." });
  }
  if (message.length > 5000) {
    return res.status(400).json({ error: "Messaggio troppo lungo." });
  }

  const apiKey = process.env.BREVO_API_KEY;
  const to = process.env.CONTACT_TO || "info@ganeshaexperience.it";
  const from = process.env.CONTACT_FROM || to;

  if (!apiKey) {
    console.log("[contact] BREVO_API_KEY non configurata, mock send:", { name, email, message });
    return res.status(200).json({ message: "Grazie! Ti risponderemo a breve." });
  }

  try {
    const resp = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "api-key": apiKey,
        "content-type": "application/json",
        accept: "application/json"
      },
      body: JSON.stringify({
        sender: { name: "Sito Ganesha Deva", email: from },
        replyTo: { email, name },
        to: [{ email: to }],
        subject: `Nuovo messaggio da ${name}`,
        htmlContent: `<p><strong>Da:</strong> ${escapeHtml(name)} &lt;${escapeHtml(email)}&gt;</p><p>${escapeHtml(message).replace(/\n/g, "<br>")}</p>`
      })
    });

    if (!resp.ok) {
      const err = await resp.text().catch(() => "");
      console.error("[contact] Brevo error:", resp.status, err);
      return res.status(502).json({ error: "Servizio email temporaneamente non disponibile." });
    }

    return res.status(200).json({ message: "Messaggio inviato. Ti risponderemo a breve." });
  } catch (e) {
    console.error("[contact] fetch error:", e);
    return res.status(500).json({ error: "Errore interno. Riprova più tardi." });
  }
};
