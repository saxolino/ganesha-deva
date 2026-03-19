# Ganesha Experience — Redesign Spec

## Overview
Redesign completo di ganeshaexperience.it: da WordPress/Elementor a HTML/CSS/JS statico. Estetica wellness premium, animazioni cinematografiche GSAP, micro-sistema JSON per eventi/viaggi.

**Stessi contenuti e testi esatti. Stessa palette. Stesse immagini. Esecuzione da Awwwards nella categoria wellness.**

Riferimenti estetici: Aman Resorts, Rituals, Six Senses, retreat yoga di lusso. Spazio, respiro, organicita, immersione. Ogni sezione deve sentirsi come un'inspirazione lenta.

## Tech Stack
- HTML5 + CSS3 (custom properties, grid, clamp)
- GSAP 3 + ScrollTrigger + SplitText
- Zero framework, zero backend, zero database
- Hosting: Vercel/Netlify (static)
- Immagini: scaricate dal sito attuale, ottimizzate WebP

## Design System

### Palette
| Token | Valore | Uso |
|-------|--------|-----|
| `--magenta` | `#A90A7C` | Headings, accenti, CTA hover |
| `--teal` | `#8AC6D0` | Bottoni primari, eyebrow label |
| `--cream` | `#F8F2EB` | Sfondo principale sezioni chiare |
| `--dark` | `#1a1a1a` | Testo corpo |
| `--white` | `#FFFFFF` | Testo su sfondi scuri/immagini |
| `--cream-dark` | `#EDE5DB` | Sfondo alternativo piu caldo |

### Tipografia
| Elemento | Font | Size Desktop | Size Mobile | Weight |
|----------|------|-------------|-------------|--------|
| H1 Hero | Marcellus | clamp(44px, 5vw, 76px) | 38px | 400 |
| H2 Sezione | Marcellus | clamp(32px, 3.5vw, 50px) | 28px | 400 |
| H3 Card | Marcellus | clamp(20px, 2vw, 26px) | 18px | 400 |
| Body | Marcellus | 18px | 16px | 400 |
| Eyebrow | Tenor Sans | 11px, tracking 4px | 10px | 400 |
| Button | Tenor Sans | 13px, tracking 1px | 12px | 400 |

### Bottoni
- Primario: bg `--teal`, color white, border-radius `0 40px 40px 0` (forma organica asimmetrica, identita Ganesha)
- Hover: magnetic effect desktop, scale 1.05, transizione a `--magenta`
- SVG freccia inline dove serve, mai emoji

### Forme Organiche
- Wave SVG tra ogni sezione, tutte con forma diversa (non ripetute)
- Animate con GSAP morph al passaggio
- Decorazioni: cerchi semitrasparenti, foglie stilizzate SVG (come nel sito attuale)

## Struttura Homepage — index.html

L'homepage scorre come un respiro. Sezioni generose, centratura, immagini immersive.

### 1. Header/Nav (sticky)
- Trasparente su hero (testo bianco), diventa `--cream` + backdrop-blur(20px) on scroll
- Logo "g" centrato
- Nav split: [Lezioni, Percorsi, Eventi] | logo | [Viaggi, Blog, Contatti]
- Voce attiva: linea sottile `--magenta` sotto
- Mobile: hamburger, menu fullscreen `--cream` con voci centrate, font 28px

### 2. Hero (100vh)
- Immagine full-viewport (Cala Rossa, Favignana), parallax 0.3x
- Gradient overlay: `linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.5) 100%)`
- In alto centro: eyebrow "Experience Yoga" (Tenor Sans, tracking 6px, `--teal`)
- H1 centrato in basso: "Yoga, movimento e meditazione in Sicilia"
  - Split text reveal parola per parola, timing sfalsato
- CTA sotto: "Scopri di piu" con bordo-radius Ganesha
- Wave SVG animata transizione a `--cream`
- Scrollando, il testo sale con parallax piu veloce dell'immagine (depth effect)

### 3. Intro Dayana
- Sfondo `--cream`, padding verticale generoso (120px desktop, 80px mobile)
- Layout centrato, max-width 1000px
- Immagine Dayana: border-radius organico (`0 80px 0 80px`), ombra morbida
  - Border decorativo `--magenta` 2px con offset 12px (doppio contorno)
  - Clip-path reveal sullo scroll (si svela da centro verso bordi)
- H2 "Ciao mi chiamo Dayana!" in `--magenta`, centrato sopra l'immagine o affiancato
- Testo bio: stagger reveal riga per riga, `--dark`, line-height 1.9
- Layout desktop: immagine sinistra (45%), testo destra (55%), allineamento centro verticale
- Spazio che respira tra immagine e testo (gap 60px)

### 4. Le 4 Aree — Cards con Hover
- Sfondo `--cream` (continuazione)
- Titolo H2 centrato: "Un insieme di esperienze dedicate al benessere e alla crescita personale"
- Sottotitolo descrittivo centrato
- Grid 2x2 desktop, 1 colonna mobile
- Ogni card:
  - Sfondo bianco, border-radius 20px, padding 40px
  - Icona SVG minimale in alto (linea, non filled)
  - H3 in `--magenta`
  - Descrizione breve in `--dark`
  - Hover: translateY(-8px) + ombra morbida `rgba(169,10,124,0.08)`
- Stagger reveal sullo scroll (0.15s delay tra card)

### 5. Lezioni
- Wave morph ingresso da `--cream` a `--magenta`
- Sfondo `--magenta`, padding generoso (100px)
- Decorazione: cerchio semitrasparente grande (rgba white 0.04) in alto a destra
- Eyebrow "Lezioni" (Tenor Sans, white 50%)
- H2 centrato bianco: "Esperienze emozionali dedicate al benessere"
- Sottotitolo centrato white 80%
- Grid 3 colonne desktop, 1 colonna mobile
  - 5 card totali: prima riga 3, seconda riga 2 centrate
- Card lezione:
  - Border-radius 16px, overflow hidden
  - Immagine full cover, height 300px desktop
  - Overlay gradient bottom: `transparent → rgba(0,0,0,0.65)`
  - H3 bianco in basso-sinistra con padding 24px
  - Hover: image scale 1.08 (transition 0.8s ease), freccia SVG appare top-right
  - Freccia: cerchio glass (white 15% + backdrop-blur), SVG arrow bianco

### 6. Percorsi
- Wave morph da `--magenta` a `--cream`
- Sfondo `--cream`, padding generoso
- H2 centrato `--magenta`: "Un Percorso Che Amplifica Le Tue Conoscenze"
- Sottotitolo centrato
- Grid 2 colonne desktop, 1 mobile
  - 4 card: Theta Healing, I 7 Chakra, Il Viaggio dell'Eroe, Bagno di Gong
- Card percorso:
  - Immagine grande (aspect 16:10), border-radius 16px
  - H3 `--magenta`, descrizione `--dark`, CTA "Scopri"
  - Hover: image zoom 1.05, CTA slide-up

### 7. Eventi
- Wave morph da `--cream` a `--teal`
- Sfondo `--teal`, padding generoso
- H2 bianco centrato: "Esperienze Esclusive: Eventi Speciali per il Benessere"
- Sottotitolo centrato
- Contenuto da `events.json` (renderizzato con JS)
- Layout lista:
  - Ogni evento = riga con bordo inferiore sottile (white 10%)
  - Sinistra: data prominente (giorno 32px `--magenta`, mese 11px white)
  - Centro: luogo (Tenor Sans, `--magenta` su teal), titolo (22px white), descrizione
  - Destra: freccia SVG (appare on hover)
  - Hover: padding-left +16px (slide effect)
- CTA "Contattaci su WhatsApp" centrato in fondo

### 8. Viaggi — Sezione Immersiva
- Sfondo `--cream` con immagine full-width dentro la sezione
- H2 `--magenta` centrato: heading viaggi
- Sottotitolo
- Immagine panoramica Sicilia, parallax 0.2x, border-radius 24px
- CTA "Scopri i nostri Viaggi" centrato
- Contenuto da `viaggi.json`

### 9. Blog/Notizie
- Wave morph verso `--cream-dark`
- H2 `--magenta`: "Notizie Dal Mondo Ganesha"
- Sottotitolo
- 1-2 card articolo con immagine, titolo, estratto
- CTA "Vedi Gli Articoli"

### 10. Contatti
- Sfondo `--cream`
- Layout centrato: form a destra (nome, email, messaggio, submit)
- Immagine/mappa a sinistra
- Input: sfondo `--cream-dark`, bordo sottile, focus border `--magenta`

### 11. Newsletter + Footer
- Sfondo `--magenta`
- H2 bianco: "Iscriviti alla Newsletter"
- Testo: "Riceverai gratuitamente pillole di formazione, lezioni e molto altro."
- Form: cognome, nome, email, checkbox privacy, "Iscriviti"
- Sotto: logo centrato, nav links, copyright, social SVG icons

## Pagine Interne

Tutte seguono lo stesso pattern:
1. Hero `--teal` con wave ingresso, titolo pagina + descrizione
2. Contenuto specifico
3. Sezione CTA/correlati
4. Newsletter `--magenta`
5. Footer

### lezioni.html
- Hero + descrizione
- Grid completa 5 lezioni (stesse card della homepage ma con descrizione estesa)

### percorsi.html
- Hero + descrizione
- 4 percorsi con layout alternato (immagine-testo, testo-immagine)

### eventi.html
- Hero + descrizione
- Grid card eventi da `events.json`
- Ogni card: immagine, badge data, titolo, luogo, periodo, CTA
- CTA WhatsApp

### viaggi.html
- Hero + descrizione immersiva
- Card viaggi da `viaggi.json`

### contatti.html
- Hero
- Form + info contatto

## Micro-Sistema Eventi/Viaggi

### events.json
```json
[
  {
    "id": "solstizio-estate-2026",
    "titolo": "Solstizio d'estate",
    "data": "2026-06-21",
    "dataFine": null,
    "periodo": "21 Giugno",
    "luogo": "Civitanova Marche",
    "descrizione": "Celebrazione del solstizio con pratica yoga al tramonto",
    "immagine": "img/eventi/solstizio.jpg",
    "attivo": true
  }
]
```

### viaggi.json
```json
[
  {
    "id": "sicily-experience-2026",
    "titolo": "Sicily Experience",
    "dataInizio": "2026-07-15",
    "dataFine": "2026-07-22",
    "periodo": "Luglio 2026",
    "luogo": "Sicilia",
    "descrizione": "Retreat esperienziale in Sicilia",
    "immagine": "img/viaggi/sicily.jpg",
    "attivo": true
  }
]
```

### Rendering
- `fetch()` vanilla JS, filtra `attivo: true`, ordina per data
- Template HTML generato con template literals
- Pagina singolo evento: `evento.html?id=xxx` legge dal JSON

## Animazioni GSAP

### Per Sezione
- Ogni sezione: fade-up + stagger figli, ScrollTrigger start "top 80%"
- Wave: morph SVG con path diverse, durata 1.2s ease
- Parallax: immagini con `scrollTrigger speed` 0.3-0.5

### Micro-interazioni
- **Magnetic cursor** (solo desktop `hover: hover`): bottoni CTA
- **Text split**: H1 hero, parola per parola
- **Clip-path reveal**: immagine Dayana `inset(50% 50% 50% 50%) → inset(0)`
- **Card hover**: image zoom, overlay darken, freccia appear
- **Nav underline**: linea animata da sinistra su hover
- **Stagger cards**: 0.1-0.15s delay

### Performance
- `will-change` solo durante animazione attiva
- `prefers-reduced-motion`: disabilita tutto tranne fade
- `loading="lazy"` su immagini below fold
- GSAP caricato con `defer`

## Responsive Mobile

### Breakpoints
- Desktop: >= 1024px
- Tablet: 768-1023px
- Mobile: < 768px

### Mobile
- **Nav**: hamburger, fullscreen overlay `--cream`, chiusura X, voci centrate 28px
- **Hero**: H1 38px, immagine `object-position: center`, CTA full-width
- **Intro Dayana**: stack verticale, immagine full-width sopra (border-radius 0 0 40px 0), testo sotto con padding 24px
- **4 Aree**: stack 1 colonna, card full-width
- **Lezioni**: 1 colonna, card height 220px
- **Percorsi**: 1 colonna, card full-width
- **Eventi**: data compatta a sinistra (60px), testo prende il resto, touch target 48px min
- **Viaggi**: immagine full-width
- **Form**: input full-width, padding 16px, gap 12px
- **Footer**: nav verticale centrato
- **Padding sezioni**: 60px top/bottom (vs 100-120px desktop)
- **Animazioni**: durata dimezzata, no magnetic cursor, stagger ridotto
- **Touch**: tap target minimo 44x44px, no hover effects su touch

### Tablet
- Grid 2 colonne dove possibile
- Lezioni: 2 colonne
- Nav: ancora hamburger

## File Structure
```
ganesha-experience/
  index.html
  lezioni.html
  percorsi.html
  eventi.html
  viaggi.html
  contatti.html
  css/
    style.css
  js/
    main.js
    events-loader.js
  data/
    events.json
    viaggi.json
  img/
    logo.png
    hero/
    lezioni/
    percorsi/
    eventi/
    viaggi/
    dayana/
```

## Immagini da Scaricare
Da ganeshaexperience.it, tutte ottimizzate WebP + fallback JPG:
- Hero: cala-rossa, tramonto saline
- Dayana: foto profilo
- Lezioni: yoga-in-volo, acro-yoga, yoga-integrale, yoga-anukalana, yoga-sciamanico
- Percorsi: theta-healing, 7-chakra, viaggio-eroe, bagno-gong
- Eventi: yoga-al-mare, summer-vibes, solstizio, corpo-e-voce
- Viaggi: sicily-experience
- Logo: g con punto rosa (SVG se possibile)
