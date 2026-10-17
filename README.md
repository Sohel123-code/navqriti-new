# NavQriti

React website built with Vite, Three.js, GSAP, Framer Motion and Lenis. This is the original `navqriti-website` project; the alternative `nav 2` site is separate.

## Run and validate

```sh
npm install
npm run dev
npm run lint
npm run build
npm run preview
```

Deploy the generated `dist/` directory. Vite emits HTML entries for the detail routes so direct visits and refreshes work on static hosts. The host must serve directory indexes for `/ai`, `/quantum` and `/contact`.

## Pages

| URL | Component | Purpose |
| --- | --- | --- |
| `/` | `src/pages/Home.jsx` | Company introduction, frontiers, company film and collaboration; one partnership link in the footer |
| `/ai` | `src/pages/ArtificialIntelligence.jsx` | AI offering, interactive learning demo and workflow |
| `/quantum` | `src/pages/Quantum.jsx` | Quantum research, interactive field and campus infrastructure |
| `/contact` | `src/pages/Contact.jsx` | Partnership information and enquiry form |

## Folder structure

The source follows `../docuemnts/folder_architecture`. Only implemented pages are routed; reserved components and asset folders do not create additional pages.

```text
public/                  Assets served by URL: fonts, images, logos, videos, models
src/
  assets/                Reserved for assets imported through the build
  components/
    layout/              Shared navigation, footer, mobile menu, route transitions
    hero/                Hero copy and visuals
    sections/            Homepage sections, including CompanyFilm
    cards/               Reusable cards and stage panels
    ui/                  Buttons, demos, cursor, text and visual components
    forms/               ContactForm
  animations/
    gsap/                Hero, reveal and scroll choreography
    framer/              Motion presets
  three/
    scenes/              WebGL scene lifecycles
    objects/             Reusable geometry helpers
    shaders/             Shader code
  hooks/                 Shared lifecycle, viewport, scroll and animation hooks
  data/                  Company content, navigation and public contact address
  pages/                 Route composition and lazy page loaders
  App.jsx                Route state, shared layout and motion preferences
  main.jsx               Entry point
  index.css              Base styles and shared homepage components
  mobile.css             Shared phone/tablet refinements
  *.css                  Scoped page and feature styles
```

Keep reusable UI in `components/ui`, content in `data`, and WebGL implementation in `three`. Compose these in sections and pages. Page styles (`ai.css`, `quantum.css`, `contact.css`) remain route-specific. Feature styles such as `company-film.css` are imported by their component; preserve stylesheet order when moving them. `mobile.css` uses scoped overrides to coexist with lazy-loaded page styles.

`VisionMission`, `Impact`, `CTA`, and other earlier section implementations remain available as unused components. The current homepage renders `CompanyFilm` in the Vision and Mission position. The former What's next section and AI tools strip are removed. Each page has one closing partnership action; the shared navbar also provides Partner with us. Navigation contains Home, AI and Quantum, plus that partnership action. Do not restore an old section by editing its unused component; check `pages/Home.jsx` first.

Generated `dist/`, dependencies, package cache and environment files are ignored by Git. Local QA scripts, reference captures and video-generation work are outside this application in `../tmp` and `../output`; they are not deployment inputs.

## Contact

The official public email is **info@nyeras.com**, defined once in `src/data/contact.js`. The Partners page and enquiry form use this value. Submitting a valid enquiry prepares a `mailto:` draft in the visitor's email application; the visitor sends it. There is no message-submission backend. Do not put secrets in frontend configuration.

## Motion and mobile behavior

- Phones use native momentum scrolling; Lenis handles desktop wheel scrolling.
- All pages share the main navigation, with a native dialog menu at smaller widths.
- AI and Quantum cards use `components/ui/ScrollReveal.jsx`: scroll-linked entry/exit fades and subtle depth, reversible in both directions. Focused controls remain readable without changing their position; reduced motion renders content fully visible.
- The homepage company film expands with scroll and reverses on return. It loops at 2× while visible, with one pause/play control. Its surrounding section is white.
- Cursor trails are enabled for mouse pointers on AI, Quantum and Partners. They are hidden over enquiry fields and absent on the homepage.
- Motion controls and system reduced-motion preferences disable animated choreography. Explicit media playback remains available.
- WebGL visuals include loading/failure fallbacks. Important copy and navigation remain HTML.
- Dialogs track the visual viewport, and form inputs use 16px text to avoid focus zoom on phones. Menus and forms scroll independently while the document is locked.
- The AI workspace and Quantum field are illustrative interactive demos, not a live LMS or a scientific quantum simulator.

## Source references

Company material comes from the provided profiles in `../docuemnts`. Component source links and adaptation notes are also retained in the corresponding implementation files:

- AI/Quantum design reference: https://final-neptune-351336-18ed4de04.framer.app/
- Cursor trail: https://framer.com/m/CursorDotTrail-ZDqFAE.js@iLyzK205nNCuHNDP5Nsc
- Quantum liquid background: https://framer.com/m/AnimatedLiquidBackground-Prod-vIhm.js@ghH1aHLmGZ0iE7qXDFVk
- Particle text: https://framer.com/m/ParticleText-2NZQ.js@otOSwmqP2acS2BjTve4l
- Liquid image: https://framer.com/m/LiquidImage-DMcO.js@leTg7a7qKyDtXCpjPzIv
- Earlier image accordion: https://framer.com/m/image-animation-HJJB.js@ga1htqyg5UFN9eq91lZh
- Earlier purpose carousel: https://framer.com/m/VideoCarousel-3ACghD.js@gN3OxtTWepzM2Kd4SUcE

## Mobile verification

The October 17, 2026 browser-emulation audit covered all four routes at 320×740, 390×844, 768×1024 and 844×390: 80 section checks, with no horizontal overflow or page errors. Touch interaction checks also covered reduced motion at 390×844, video play/pause and 2× looping configuration, AI tabs, Quantum mode/phase controls, menu navigation, same-page links, browser Back, and form entry with a shortened viewport.

Check every route directly and through the mobile menu. Verify portrait and landscape layouts, reverse scrolling, touch targets, AI demo tabs, Quantum controls, video playback, form focus and menu dismissal. Also test reduced motion and browser Back. Browser emulation does not replace final testing on physical iOS and Android devices.
