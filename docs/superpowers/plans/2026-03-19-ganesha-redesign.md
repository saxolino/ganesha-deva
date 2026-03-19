# Ganesha Experience Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ricostruire ganeshaexperience.it come sito statico HTML/CSS/JS con animazioni GSAP cinematografiche, estetica wellness premium, e micro-sistema JSON per eventi/viaggi.

**Architecture:** Sito multi-pagina statico puro (6 pagine + componenti condivisi). CSS custom con design tokens. GSAP 3 per tutte le animazioni. JavaScript vanilla per rendering dinamico da JSON. Nessun framework, nessun build step.

**Tech Stack:** HTML5, CSS3 (custom properties, grid, clamp), GSAP 3 + ScrollTrigger, Vanilla JS

**Spec:** `docs/superpowers/specs/2026-03-19-ganesha-redesign-design.md`

---

## File Structure

```
ganesha-experience/
  index.html              — Homepage (12 sezioni)
  lezioni.html            — Pagina lezioni yoga
  percorsi.html           — Pagina percorsi
  eventi.html             — Pagina eventi (da JSON)
  viaggi.html             — Pagina viaggi (da JSON)
  contatti.html           — Pagina contatti
  css/
    style.css             — Design system + layout + responsive (unico file)
  js/
    main.js               — Nav, GSAP animations, scroll, shared logic
    events-loader.js      — Fetch + render events.json e viaggi.json
  data/
    events.json           — Dati eventi
    viaggi.json           — Dati viaggi
  img/                    — Immagini organizzate in sottocartelle
    logo.svg
    hero/
    lezioni/
    percorsi/
    eventi/
    viaggi/
    dayana/
    decorations/          — SVG wave, foglie, cerchi
```

---

## Task 1: Progetto base, asset, design system CSS

**Files:**
- Create: `css/style.css`
- Create: `img/logo.svg`
- Create: `img/decorations/wave-1.svg` through `wave-5.svg`
- Create: `img/decorations/leaf.svg`

- [ ] **Step 1: Inizializza git repo**

```bash
cd /Users/torresi.studio/ganesha-experience
git init
echo "node_modules/\n.DS_Store\n.superpowers/" > .gitignore
git add .gitignore && git commit -m "init: project scaffold"
```

- [ ] **Step 2: Scarica tutte le immagini dal sito attuale**

Scaricare da ganeshaexperience.it:
- `img/hero/cala-rossa.jpg` — hero homepage (dalla URL dell'immagine Favignana)
- `img/hero/saline-tramonto.jpg` — secondo hero (slider)
- `img/dayana/dayana-studio.jpg` — foto Dayana sezione intro
- `img/lezioni/yoga-in-volo.jpg`
- `img/lezioni/acro-yoga.jpg`
- `img/lezioni/yoga-integrale.jpg`
- `img/lezioni/yoga-anukalana.jpg`
- `img/lezioni/yoga-sciamanico.jpg`
- `img/percorsi/theta-healing.jpg`
- `img/percorsi/7-chakra.jpg`
- `img/percorsi/viaggio-eroe.jpg`
- `img/percorsi/bagno-gong.jpg` (se disponibile)
- `img/eventi/yoga-al-mare.jpg`
- `img/eventi/summer-vibes.jpg`
- `img/eventi/solstizio.jpg`
- `img/eventi/corpo-e-voce.jpg`
- `img/viaggi/sicily-experience.jpg`
- `img/logo.png` — logo originale

Usare `curl -o` per ogni URL immagine trovata nel sito.

- [ ] **Step 3: Crea il logo SVG**

Ricreare il logo "g" con punto rosa come SVG pulito. Il logo originale e PNG — tracciarlo in SVG per nitidezza su retina.

- [ ] **Step 4: Crea le wave SVG decorative (5 forme diverse)**

Creare 5 file SVG wave con path organiche diverse:
- `wave-1.svg` — cream to magenta (usata sotto hero)
- `wave-2.svg` — magenta to cream (usata dopo lezioni)
- `wave-3.svg` — cream to teal (usata prima eventi)
- `wave-4.svg` — teal to cream (usata dopo eventi)
- `wave-5.svg` — cream to magenta (usata prima newsletter)

Ogni wave: viewBox `0 0 1440 100`, path curva diversa, fill del colore di destinazione.

- [ ] **Step 5: Crea icona foglia SVG decorativa**

`img/decorations/leaf.svg` — foglia stilizzata simile a quelle nel sito originale, stroke 1.5px, no fill.

- [ ] **Step 6: Scrivi il design system CSS completo**

`css/style.css` deve contenere:

1. **Reset + custom properties**: tutti i colori token, font sizes come clamp(), spacing scale
2. **Typography**: Marcellus per headings/body, Tenor Sans per UI. Google Fonts import.
3. **Buttons**: classe `.btn-primary` (teal, shape Ganesha) e `.btn-secondary` (magenta)
4. **Utilities**: `.eyebrow`, `.section-padding`, `.container`, `.sr-only`
5. **Layout grid**: sistema a container centrato max-width 1200px con padding laterale
6. **Wave transitions**: `.wave-transition` posizionamento
7. **Responsive**: breakpoints a 768px e 1024px

Includere il `@media (prefers-reduced-motion: reduce)` con animazioni disabilitate.
Includere `@media (hover: hover)` per hover effects solo su desktop.

- [ ] **Step 7: Commit**

```bash
git add -A && git commit -m "feat: design system CSS, assets, wave decorations"
```

---

## Task 2: Header/Nav + Footer componenti condivisi

**Files:**
- Create: `js/main.js`
- Questi saranno inclusi inline in ogni pagina HTML (no JS include system — copia/incolla per semplicita statica, oppure JS `fetch` + `insertAdjacentHTML`)

- [ ] **Step 1: Scrivi la struttura HTML header**

Header con:
- `<header class="site-header">` trasparente, position fixed, z-index 100
- Nav split: sinistra [Lezioni, Percorsi, Eventi], centro logo SVG, destra [Viaggi, Blog, Contatti]
- Hamburger button (hidden desktop, visible mobile)
- Menu overlay fullscreen (hidden default)

- [ ] **Step 2: Scrivi gli stili header in style.css**

- Header trasparente: `background: transparent`, diventa `--cream` + `backdrop-filter: blur(20px)` con classe `.header--scrolled`
- Logo centrato con dimensioni responsive
- Nav links: Marcellus 14px, colore white su hero / dark altrove
- Active underline `--magenta` animata
- Hamburger: 2 linee, transizione a X quando aperto
- Overlay mobile: fullscreen `--cream`, voci centrate 28px, fade-in

- [ ] **Step 3: Scrivi la logica JS header**

In `js/main.js`:
- `IntersectionObserver` o `scroll` listener per toggle `.header--scrolled` (after hero)
- Toggle menu mobile: click hamburger, toggle class `.menu--open` su body
- Chiudi menu su click link
- Chiudi menu su ESC

- [ ] **Step 4: Scrivi la struttura HTML footer**

Footer con:
- Sfondo `--magenta`
- Logo centrato (SVG bianco)
- Nav links orizzontali (stessi della header)
- Copyright: "2024 Ganesha Deva. All Right Reserved"
- Social icons SVG: Facebook, Instagram, WhatsApp

- [ ] **Step 5: Scrivi gli stili footer in style.css**

- Sfondo `--magenta`, padding generoso
- Logo filter brightness/invert per renderlo bianco
- Links bianchi, hover underline
- Social icons 24px, bianche, hover opacity
- Mobile: nav verticale, social centrate

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "feat: header/nav sticky + footer + mobile menu"
```

---

## Task 3: Homepage — Hero + Intro Dayana

**Files:**
- Create: `index.html`
- Modify: `css/style.css` — aggiungere stili hero + intro
- Modify: `js/main.js` — aggiungere GSAP hero animations

- [ ] **Step 1: Scrivi l'HTML della homepage con Hero section**

`index.html` completo con:
- `<head>`: meta, Google Fonts (Marcellus + Tenor Sans), GSAP CDN (gsap, ScrollTrigger), link CSS
- Hero: `<section class="hero">` con immagine background, overlay gradient, eyebrow, H1, CTA, wave SVG in basso
- Testo esatto: "Experience Yoga" eyebrow, "Yoga, movimento e meditazione in Sicilia" H1, "Scopri di piu" CTA

- [ ] **Step 2: Scrivi l'HTML della sezione Intro Dayana**

Nella stessa `index.html`:
- `<section class="intro">` sfondo cream
- Layout flex: immagine sinistra (con border-radius organico + offset border), testo destra
- Testo esatto: "Ciao mi chiamo Dayana!" H2, bio paragraph completa dal sito

- [ ] **Step 3: Stili CSS hero**

In `style.css`:
- `.hero`: height 100vh, position relative, overflow hidden
- `.hero__bg`: immagine cover, position absolute
- `.hero__overlay`: gradient
- `.hero__content`: position absolute bottom, padding, z-index
- `.hero h1`: font Marcellus, clamp size, white
- `.hero__eyebrow`: Tenor Sans, tracking, `--teal`
- `.hero__cta`: btn-primary
- Wave positioning absolute bottom

- [ ] **Step 4: Stili CSS intro Dayana**

- `.intro`: sfondo cream, padding 120px vertical
- `.intro__inner`: max-width 1100px, display flex, gap 60px, align center
- `.intro__image`: width 45%, border-radius `0 80px 0 80px`, position relative
- `.intro__image::after`: offset border decorativo magenta
- `.intro__text h2`: magenta, font-size H2
- `.intro__text p`: dark, line-height 1.9
- Mobile: stack verticale, immagine full-width con border-radius semplificato

- [ ] **Step 5: GSAP animazioni hero**

In `main.js`:
- Registra ScrollTrigger
- Hero text split: `gsap.from('.hero h1', { y: 40, opacity: 0, duration: 1.2, ease: 'power3.out' })`
- Eyebrow fade: `gsap.from('.hero__eyebrow', { y: 20, opacity: 0, delay: 0.3 })`
- CTA fade: `gsap.from('.hero__cta', { y: 20, opacity: 0, delay: 0.6 })`
- Hero parallax: `gsap.to('.hero__bg', { y: '20%', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }})`

- [ ] **Step 6: GSAP animazioni intro Dayana**

- Clip-path reveal immagine: `gsap.from('.intro__image', { clipPath: 'inset(50% 50% 50% 50%)', duration: 1.2, scrollTrigger: { trigger: '.intro', start: 'top 75%' }})`
- Text stagger: `gsap.from('.intro__text > *', { y: 30, opacity: 0, stagger: 0.2, scrollTrigger: { trigger: '.intro__text', start: 'top 80%' }})`

- [ ] **Step 7: Test in browser e commit**

Aprire `index.html` con live server. Verificare:
- Hero full-viewport con immagine, testo leggibile, CTA funzionante
- Scroll: header diventa solid, parallax attivo
- Intro Dayana: clip-path reveal, text stagger
- Mobile: stack verticale, menu hamburger funziona

```bash
git add -A && git commit -m "feat: homepage hero + intro Dayana with GSAP animations"
```

---

## Task 4: Homepage — Sezioni Categorie + Lezioni + Percorsi

**Files:**
- Modify: `index.html`
- Modify: `css/style.css`
- Modify: `js/main.js`

- [ ] **Step 1: HTML sezione 4 Aree**

Aggiungere a `index.html`:
- `<section class="areas">` su sfondo cream
- H2 centrato + sottotitolo
- Grid 2x2 con 4 card (Lezioni, Percorsi, Eventi, Viaggi Esperienziali)
- Ogni card: icona SVG inline, H3, paragrafo, link
- Testi esatti dal sito originale

- [ ] **Step 2: HTML sezione Lezioni**

- Wave SVG cream → magenta
- `<section class="lezioni">` sfondo magenta
- Decorazione cerchio semitrasparente
- Eyebrow + H2 + sottotitolo
- Grid 5 card (Yoga In Volo, Acro Yoga, Yoga Integrale, Yoga Anukalana, Yoga Sciamanico)
- Ogni card: immagine, overlay gradient, H3, freccia SVG nascosta

- [ ] **Step 3: HTML sezione Percorsi**

- Wave SVG magenta → cream
- `<section class="percorsi">` sfondo cream
- H2 + sottotitolo centrati
- Grid 2 colonne, 4 card (Theta Healing, I 7 Chakra, Il Viaggio dell'Eroe, Bagno di Gong)
- Card: immagine sopra, titolo magenta, descrizione, CTA
- Testi esatti dal sito

- [ ] **Step 4: CSS per tutte e 3 le sezioni**

- `.areas`: grid 2x2, card bianche, hover lift + shadow
- `.lezioni`: sfondo magenta, grid 3col + 2 centrate, card immagine con overlay
- `.lezioni .card:hover img`: scale 1.08
- `.lezioni .card__arrow`: opacity 0 → 1 on hover
- `.percorsi`: grid 2 col, card con immagine aspect 16:10
- Responsive mobile per tutte: 1 colonna

- [ ] **Step 5: GSAP per le 3 sezioni**

- Aree card stagger: `stagger: 0.15`
- Lezioni card stagger: `stagger: 0.1`
- Percorsi card stagger: `stagger: 0.15`
- Tutti con ScrollTrigger `start: 'top 80%'`
- Wave SVG: `gsap.from('.wave-X path', { d: 'flat path', duration: 1.2, scrollTrigger })`

- [ ] **Step 6: Test e commit**

Verificare:
- Grid 4 aree con hover lift
- Lezioni su sfondo magenta, hover zoom immagine
- Percorsi grid 2 col
- Wave transitions animate
- Mobile: tutto stacked

```bash
git add -A && git commit -m "feat: homepage areas, lezioni, percorsi sections"
```

---

## Task 5: Homepage — Eventi (JSON) + Viaggi + Blog + Contatti + Newsletter

**Files:**
- Modify: `index.html`
- Modify: `css/style.css`
- Modify: `js/main.js`
- Create: `js/events-loader.js`
- Create: `data/events.json`
- Create: `data/viaggi.json`

- [ ] **Step 1: Crea i file JSON con dati reali dal sito**

`data/events.json`:
```json
[
  {
    "id": "corpo-voce-laboratori",
    "titolo": "Viaggio nel Corpo e nella Voce - Laboratori Esperenziali",
    "data": "2026-04-01",
    "periodo": "Due giovedi al mese",
    "luogo": "Montecosaro",
    "descrizione": "Laboratori esperienziali dedicati al corpo e alla voce",
    "immagine": "img/eventi/corpo-e-voce.jpg",
    "attivo": true
  },
  {
    "id": "yoga-al-mare",
    "titolo": "Yoga al Mare",
    "data": "2026-06-01",
    "periodo": "Giugno - Luglio",
    "luogo": "Civitanova Marche",
    "descrizione": "Sessioni di yoga sulla spiaggia all'alba",
    "immagine": "img/eventi/yoga-al-mare.jpg",
    "attivo": true
  },
  {
    "id": "yoga-summer-vibes",
    "titolo": "Yoga Summer Vibes",
    "data": "2026-07-01",
    "periodo": "Luglio - Agosto - Settembre",
    "luogo": "Speciale Sicilia",
    "descrizione": "Retreat estivo di yoga e benessere in Sicilia",
    "immagine": "img/eventi/summer-vibes.jpg",
    "attivo": true
  },
  {
    "id": "solstizio-estate",
    "titolo": "Solstizio d'estate",
    "data": "2026-06-21",
    "periodo": "21 Giugno",
    "luogo": "Civitanova Marche",
    "descrizione": "Celebrazione del solstizio con pratica yoga al tramonto",
    "immagine": "img/eventi/solstizio.jpg",
    "attivo": true
  }
]
```

`data/viaggi.json`:
```json
[
  {
    "id": "sicily-experience",
    "titolo": "Sicily Experience",
    "dataInizio": "2026-07-15",
    "dataFine": "2026-07-22",
    "periodo": "Luglio 2026",
    "luogo": "Sicilia",
    "descrizione": "Esplora il mondo Ganesha con i retreat e viaggi esperienziali, integrando yoga, arte, sport in natura, benessere, luoghi magici e storici",
    "immagine": "img/viaggi/sicily-experience.jpg",
    "attivo": true
  }
]
```

- [ ] **Step 2: Scrivi events-loader.js**

`js/events-loader.js`:
- Funzione `loadEvents(containerId, jsonPath, template)` che:
  1. `fetch(jsonPath)` il JSON
  2. Filtra `attivo: true`
  3. Ordina per data
  4. Per ogni item genera HTML con template literal
  5. Inserisce nel container DOM
- Funzione `formatDate(dateStr)` che restituisce `{ day: '21', month: 'Giu' }`
- Esportata come funzione globale (no modules — sito statico)
- Template eventi homepage: riga con data, info, freccia
- Template eventi pagina: card con immagine
- Template viaggi: card immersiva

- [ ] **Step 3: HTML sezioni Eventi + Viaggi + Blog + Contatti + Newsletter**

Aggiungere a `index.html`:
- **Eventi**: wave cream→teal, sezione teal, container per lista eventi (`id="eventi-list"`), CTA WhatsApp
- **Viaggi**: wave teal→cream, sezione cream, immagine parallax, heading, CTA
- **Blog**: sezione cream-dark, heading, 1-2 card blog statiche, CTA
- **Contatti**: sezione cream, layout split (mappa placeholder + form)
- **Newsletter**: sezione magenta, form completo (cognome, nome, email, privacy, submit)
- **Footer**: logo, nav, copyright, social

- [ ] **Step 4: CSS per tutte le sezioni rimanenti**

- `.eventi`: sfondo teal, lista con bordi, hover slide
- `.viaggi`: immagine full-width, border-radius 24px, parallax
- `.blog`: card articolo con immagine
- `.contatti`: split layout, form styling
- `.newsletter`: sfondo magenta, form bianco
- Responsive per tutte

- [ ] **Step 5: GSAP per sezioni rimanenti**

- Eventi lista: stagger rows
- Viaggi immagine: parallax ScrollTrigger
- Contatti form: fade-in fields stagger
- Newsletter: fade-in

- [ ] **Step 6: Inizializzazione events-loader nella homepage**

In fondo a `index.html`, script:
```html
<script src="js/events-loader.js"></script>
<script>
  loadEvents('eventi-list', 'data/events.json', 'homepage-list');
</script>
```

- [ ] **Step 7: Test e commit**

Verificare:
- Eventi caricati da JSON, lista funzionante
- Viaggi sezione immersiva
- Form contatto con styling
- Newsletter form
- Footer completo
- Tutte le wave animate
- Mobile completo

```bash
git add -A && git commit -m "feat: homepage complete - eventi JSON, viaggi, blog, contatti, newsletter, footer"
```

---

## Task 6: Pagine interne — Lezioni + Percorsi

**Files:**
- Create: `lezioni.html`
- Create: `percorsi.html`
- Modify: `css/style.css`

- [ ] **Step 1: lezioni.html**

Struttura:
- Head identica a index.html
- Header (copia da index, link attivo su Lezioni)
- Hero `--teal` con wave, H1 "Lezioni", sottotitolo
- Sezione principale: grid 5 card lezione con descrizione estesa
  - Ogni card: immagine, titolo, testo completo dal sito originale
- Newsletter + Footer

- [ ] **Step 2: percorsi.html**

Struttura:
- Header (link attivo su Percorsi)
- Hero teal, H1 "Percorsi", sottotitolo
- 4 percorsi con layout alternato:
  - Percorso 1: immagine sx, testo dx
  - Percorso 2: testo sx, immagine dx
  - Alternati
- Testi completi dal sito originale per ogni percorso
- Newsletter + Footer

- [ ] **Step 3: CSS pagine interne**

- `.page-hero`: sfondo teal, height 40vh, centrato, wave bottom
- `.page-content`: padding generoso, stili per grid e layout alternato
- `.alternating-layout`: flex con direction alternate `:nth-child(even)`
- Responsive: stack su mobile

- [ ] **Step 4: GSAP pagine interne**

Stesse animazioni: scroll reveal, stagger, wave. Il `main.js` gia gestisce con classi.

- [ ] **Step 5: Test e commit**

```bash
git add -A && git commit -m "feat: lezioni + percorsi inner pages"
```

---

## Task 7: Pagine interne — Eventi + Viaggi + Contatti

**Files:**
- Create: `eventi.html`
- Create: `viaggi.html`
- Create: `contatti.html`
- Modify: `css/style.css`

- [ ] **Step 1: eventi.html**

- Header, Hero teal
- Sezione "Prossimi Eventi": grid card da `events.json` (usa events-loader con template card)
- Ogni card: immagine, badge data in alto, titolo, luogo, periodo, CTA
- CTA WhatsApp prominente
- Sezione correlati in fondo
- Newsletter + Footer

- [ ] **Step 2: viaggi.html**

- Header, Hero teal con descrizione immersiva
- Card viaggi da `viaggi.json`
- Layout: immagine grande, info dettagliate
- Newsletter + Footer

- [ ] **Step 3: contatti.html**

- Header, Hero teal
- Split layout: form a destra, info contatto a sinistra
- Info: indirizzo, email, telefono, social links
- Form: nome, email, messaggio, submit (action mailto o form service)
- Newsletter + Footer

- [ ] **Step 4: CSS pagine interne aggiuntive**

- `.eventi-grid`: grid card con badge data
- `.eventi-card__date`: posizione assoluta top-left, sfondo magenta
- `.viaggi-detail`: layout immersivo
- `.contatti-split`: grid 2 col, form styling
- Responsive tutte

- [ ] **Step 5: Test e commit**

```bash
git add -A && git commit -m "feat: eventi, viaggi, contatti inner pages with JSON rendering"
```

---

## Task 8: Micro-interazioni avanzate + Polish finale

**Files:**
- Modify: `js/main.js`
- Modify: `css/style.css`

- [ ] **Step 1: Magnetic cursor sui CTA**

In `main.js`, solo se `matchMedia('(hover: hover)')`:
- Seleziona tutti `.btn-primary, .btn-secondary`
- On `mousemove` nel raggio 80px: `gsap.quickTo` che sposta il bottone verso il cursore
- On `mouseleave`: torna a posizione originale

- [ ] **Step 2: Nav link underline animata**

CSS: `.nav-link::after` linea bottom, `transform: scaleX(0)`, transition. Hover: `scaleX(1)`, origin left.

- [ ] **Step 3: Smooth scroll ai link ancora**

```js
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(a.getAttribute('href'));
    if (target) gsap.to(window, { scrollTo: target, duration: 1, ease: 'power2.inOut' });
  });
});
```

Nota: richiede GSAP ScrollToPlugin. Aggiungere CDN.

- [ ] **Step 4: prefers-reduced-motion**

Verificare che in `style.css` ci sia:
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
}
```

E in `main.js` wrappare tutte le animazioni GSAP in:
```js
if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  // tutte le animazioni GSAP
}
```

- [ ] **Step 5: Lazy loading immagini**

Aggiungere `loading="lazy"` a tutte le `<img>` tranne hero (above fold).
Aggiungere `decoding="async"` a tutte.

- [ ] **Step 6: Final responsive pass**

Testare ogni pagina a:
- 375px (iPhone SE)
- 390px (iPhone 14)
- 768px (iPad)
- 1024px (iPad landscape)
- 1440px (desktop)
- 1920px (wide)

Fix eventuali overflow, testi troncati, touch target.

- [ ] **Step 7: Meta tags + SEO + Open Graph**

Aggiungere a ogni pagina:
- `<title>` appropriato
- `<meta name="description">`
- `<meta property="og:title/description/image">`
- `<link rel="canonical">`
- Favicon

- [ ] **Step 8: Test completo e commit finale**

Verificare:
- Tutte le 6 pagine funzionano
- JSON eventi/viaggi renderizzano
- Animazioni fluide 60fps
- Mobile impeccabile
- Nav funziona ovunque
- Nessun errore console

```bash
git add -A && git commit -m "feat: micro-interactions, responsive polish, SEO, performance"
```

---

## Sequenza Esecuzione

| Task | Dipende da | Output |
|------|-----------|--------|
| 1 | - | Design system CSS, asset, immagini |
| 2 | 1 | Header/nav + footer funzionanti |
| 3 | 2 | Homepage hero + intro (visibile) |
| 4 | 3 | Homepage categorie + lezioni + percorsi |
| 5 | 4 | Homepage completa con JSON |
| 6 | 5 | Pagine lezioni + percorsi |
| 7 | 5 | Pagine eventi + viaggi + contatti |
| 8 | 6, 7 | Polish, micro-interazioni, responsive |

Task 6 e 7 possono eseguire in parallelo.
