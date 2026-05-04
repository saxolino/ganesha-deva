# Admin CMS — Ganesha Deva

Pannello di scrittura articoli basato su [Sveltia CMS](https://github.com/sveltia/sveltia-cms).

## URL
- Produzione: `https://www.ganeshaexperience.it/admin/`
- Locale (con `npm run dev`): `http://localhost:8080/admin/`

## Setup OAuth GitHub (una volta sola)

Per permettere il login senza Personal Access Token serve registrare una **GitHub OAuth App** e collegare un proxy di autenticazione.

### 1. Crea la GitHub OAuth App

1. Vai su https://github.com/settings/developers → **New OAuth App**.
2. Compila:
   - **Application name**: `Ganesha Deva CMS`
   - **Homepage URL**: `https://www.ganeshaexperience.it`
   - **Authorization callback URL**: `https://sveltia-cms-auth.<TUO-WORKER>.workers.dev/callback`
     (sostituisci dopo aver creato il worker, vedi punto 2)
3. Salva e prendi nota di **Client ID** e **Client Secret**.

### 2. Deploya un OAuth proxy gratuito (Cloudflare Workers)

Sveltia fornisce un OAuth helper open source: https://github.com/sveltia/sveltia-cms-auth.

```bash
git clone https://github.com/sveltia/sveltia-cms-auth.git
cd sveltia-cms-auth
npm install
npx wrangler secret put GITHUB_CLIENT_ID      # incolla Client ID
npx wrangler secret put GITHUB_CLIENT_SECRET  # incolla Client Secret
npx wrangler deploy
```

Otterrai un URL del tipo `https://sveltia-cms-auth.<account>.workers.dev`.

### 3. Aggiorna il callback nella OAuth App

Torna su GitHub e aggiorna **Authorization callback URL** con il URL reale del worker + `/callback`.

### 4. Aggiungi `base_url` in `admin/config.yml`

```yaml
backend:
  name: github
  repo: saxolino/ganesha-deva
  branch: main
  base_url: https://sveltia-cms-auth.<account>.workers.dev
```

## Login alternativo: Personal Access Token

Se preferisci non configurare OAuth, Sveltia permette il login con un Personal Access Token GitHub:

1. Vai su https://github.com/settings/tokens/new
2. Scope minimi: `repo`
3. Copia il token
4. Apri `/admin/`, clicca "Login with PAT", incolla il token.

## Cosa puoi gestire

Tre collection editabili:
- **Eventi** → `content/eventi/*.md`
- **Viaggi Esperienziali** → `content/viaggi/*.md`
- **Percorsi** → `content/percorsi/*.md`

Ogni articolo supporta: titolo, descrizione, hero image, galleria, schedule (orari), locations (tappe), instructors (insegnanti), sezioni descrittive, body markdown libero. Le immagini caricate dal CMS vanno automaticamente in `img/<slug>/`.

Al salvataggio Sveltia esegue un commit GitHub → Vercel rideploya → articolo online in ~30s, propagato anche nei caroselli (homepage, pagina indice).
