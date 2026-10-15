# NavQriti

A single-page React website built with Vite, Three.js, GSAP, Framer Motion and Lenis. Company copy is adapted from the three supplied corporate profiles in `../docuemnts`; the logo is extracted from the executive profile and displayed in monochrome with CSS.

## Run locally

```sh
npm install
npm run dev
```

Open the local URL printed by Vite. Node.js 22.12+ or 24+ is recommended.

```sh
npm run lint
npm run build
npm run preview
```

## Structure

The implementation follows `../docuemnts/folder_architecture`: `components/layout`, `hero`, `sections`, `cards`, `ui`, `forms`; `animations/gsap` and `framer`; `three/scenes` and `objects`; `hooks`, `data`, `pages`, and the supplied public/asset directories. Only the requested Home page is implemented. Unused future page, case-study and animation files are intentionally not populated with placeholders. Empty reserved asset directories are kept for the next phase.

## Interactions

- The homepage opens directly without an introductory overlay. The Vision & Mission video carousel follows Frontiers, replacing the former Discover/Create/Deploy section.
- A procedural Three.js orbital sculpture connects the three forms of institutional intelligence. Discover/Create/Deploy automatically rearrange its nodes every three seconds. Manual selection resets the interval. Cycling pauses offscreen, in hidden tabs, or with the motion control. Pointer movement anywhere in the hero tilts the sculpture.
- A second Three.js scene provides a soft monochrome particle field, spaced 24px apart (27px on mobile). Dots drift gently, brighten across a 330px area and react to the mouse within 235px, then spring smoothly back. The normal system cursor stays visible. Clicking empty hero space creates a ripple. Touch input never blocks scrolling, and a subtle CSS dot field provides the no-WebGL fallback.
- Scroll position drives the Three.js cameras and sculpture rotation, with layered title parallax, perspective changes on the frontier frame and stage panels, and staggered movement through the collaboration rows and closing sections. The choreography reverses on upward scrolling. One shared scroll clock caches section geometry, updates only nearby sections, and sleeps when motion settles. Mobile uses reduced travel; the global motion toggle disables the choreography.
- Visibility-triggered compositor entrance fades replay in both scroll directions, independently of the continuous scroll transforms. Typewriter headings continuously type, hold and clear while visible, without shifting layout or repeatedly announcing text to screen readers. Readable HTML never waits for WebGL or a scroll refresh. The hero sculpture becomes ready after its first rendered frame. Framer Motion animates the purpose carousel. Lenis provides smooth scrolling and anchor navigation.
- The frontier observatory is one wide Three.js frame. On desktop its frame stays pinned while scrolling transforms its 648-node metallic sculpture between a neural network, intertwined quantum paths and a precision lattice. Mobile retains the two-second automatic sequence. Visitors can select any frontier, pause motion or open the collaboration dialog. Static selection and a CSS visual are available with reduced motion or unavailable WebGL.
- Research-to-impact uses an expanding image accordion adapted from the supplied Framer image-animation component. The six local Three.js-rendered illustrations open in sequence as the desktop chapter is scrolled, and reverse when scrolling upward. Click, arrow keys, Home/End and optional three-second autoplay remain available. Mobile and reduced-motion layouts use a vertical accordion in normal flow. Captions preserve the source component's blur-to-clear entrance and the panels its 0.3-second easing.
- The name explanation opens with a drifting cloud of dots when its visual enters view. The dots gather into the full NavQriti wordmark, hold, then decompose into Nav / new thinking, Q / future intelligence, and Kriti / purposeful creation before rejoining as NavQriti. The cycle starts only after the opening has completed. It disperses and reforms in depth, with pointer and scroll response. All meanings remain available through accessible buttons, with pause and a readable no-WebGL fallback.
- A global motion toggle and system reduced-motion preference control animation. Rendering pauses outside the viewport or in a hidden tab. Responsive transparent posters captured from the actual hero sculpture appear during loading and when WebGL is unavailable. The finished canvas stays hidden until its first frame renders, then crossfades in over one second; the old ring-and-diamond placeholder is removed.
- Fonts and logo are served locally. No remote images, analytics, client logos, invented results or unverified company contact details are included.

## Contact configuration

Set the verified public email in `.env`:

```dotenv
VITE_CONTACT_EMAIL=your-verified-address@example.com
```

Restart Vite after changes. With a configured address, the validated form opens an email draft in the visitor’s mail client. Without an address, it downloads a text project brief and clearly states that nothing was submitted. There is no backend or server-side message storage in this homepage phase. Never put secrets in `VITE_` variables.

## Validation

Production build and ESLint pass. Isolated headless Chrome checks cover desktop and mobile rendering, 320px/390px overflow, contact-brief download contents, reduced motion and the WebGL fallback. The temporary test harness and screenshots are in `../tmp/website-qa/` and `../tmp/website-smoke.mjs`; its Playwright/axe dependencies are local test tools, not application dependencies.

The additional `../tmp/motion-check.mjs` test verifies rendered particle displacement around the cursor, repeated hero and section typewriting, fade replays on upward scrolling, offscreen rendering suspension, and global pause/resume. All animations respect the motion control and reduced-motion default.

`../tmp/homepage-revision-check.mjs` verifies the removed intro, final section order, frontier transformations, all six automatic stages and looping, unchanged scroll position, pause/manual controls, mobile overflow, reduced motion, and accessibility scans. Reports and screenshots are saved in `../tmp/website-qa/`.

## Technical references

- [Three.js documentation](https://threejs.org/docs/)
- [GSAP ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/)
- [Vite guide](https://vite.dev/guide/)

`../tmp/identity-motion-check.mjs` checks expanded mouse response, the four name states, two-second frontier timing, upward entrance replay, refresh at a restored scroll position, mobile layouts, accessibility and no-WebGL fallback.

Startup is progressive: WebGL scenes mount only near the viewport, the hero scenes start after the first HTML paint, and optional visuals have error boundaries. Offscreen sections keep readable fallbacks. Metallic environment maps use 128px cube faces. `../tmp/refresh-check.mjs` covers repeated CPU-throttled refreshes, deferred offscreen scenes, scrolling, motion controls, restored scroll positions, and delayed scene downloads.

`../tmp/hero-loading-check.mjs` verifies the poster-to-live-scene crossfade on desktop and mobile with blocked scene downloads and page refreshes. The matching posters are in `public/images/hero/`.

`../tmp/cinematic-scroll-check.mjs` verifies the dots-to-name opening, reversible parallax across all eight sections, automatic stage playback without page movement, global pause/resume, motion-enabled layouts at 320/390/768px, and the name fallback without WebGL. Screenshots and the report are in `../tmp/website-qa/`.

## Local cinematic revision

The browser scrollbar is hidden while wheel, touch, keyboard and anchor scrolling remain available. Existing sections have stronger reversible depth, camera travel, title movement and staggered row parallax. The frontier and approach chapters pin only at widths above 900px and viewport heights of at least 650px, with motion enabled. Global pause returns both to normal flow.

The final footer contains the interactive ParticleText wordmark from the separate nav2 project, adapted to Manrope and the original monochrome palette. Pointer movement disperses its dots and spring motion brings them back. A readable text fallback remains available when motion is disabled.

Source component: https://framer.com/m/image-animation-HJJB.js@ga1htqyg5UFN9eq91lZh . Its expanding strips, masked images, transition easing and text reveal are implemented in src/components/ui/ImageAccordion.jsx without Framer editor dependencies. NavQriti's six documented stages replace the five source villa panels. Stage artworks are local procedural Three.js renders, not photos of company facilities. Generation script: ../tmp/render-stage-artwork.mjs. Raw component source is retained in ../tmp/image-animation/.

Validation: ../tmp/original-cinematic-check.mjs and ../tmp/original-cinematic-qa/. Changes are local; no Git commit or push was performed.

## Vision & Mission

Four concise slides cover Vision, Learn, Build and Launch. The carousel appears once, directly after Frontiers, replacing the former Discover/Create/Deploy section. Copy in `src/data/purpose.js` summarizes the supplied vision and mission. Navigation and the About link point to Our purpose.

`src/components/ui/VideoCarousel.jsx` adapts the supplied [Framer VideoCarousel](https://framer.com/m/VideoCarousel-3ACghD.js@gN3OxtTWepzM2Kd4SUcE): perspective stacking, blurred neighboring slides, spring transitions, swipe, keyboard, arrows and dot navigation. It uses local React and Framer Motion without Framer editor dependencies. Slides loop every 3 seconds while visible, including after clicks or keyboard navigation. Dragging temporarily suspends advancement and releasing resumes the loop. The pause control, global motion setting, hidden tabs and reduced-motion preference stop video playback. Only the active, visible video plays. Posters remain available during loading or a media failure.

The four silent, six-second WebM loops and WebP posters in `public/videos/purpose/` are original procedural Three.js renders, not company facility footage. The generation script is `../tmp/render-purpose-films.mjs`; the supplied component source is retained in `../tmp/vision-mission/`.

Build and ESLint pass. `../tmp/vision-mission-check.mjs` verifies autoplay, active-only playback, pause/resume, offscreen pause, arrows, dots, keyboard, swipe, reduced motion, 320/390/768px overflow, section accessibility and runtime errors. Desktop and mobile screenshots are in `../tmp/vision-mission/qa/`. The separate nav2 project is unchanged. No Git commit or push was performed.

## AI detail page

The Intelligence frontier's Explore possibilities link opens `/ai`. This is a second page of the existing React website; simple Back to NavQriti links return to `/#frontiers`. The separate nav2 project is unchanged.

The design follows the supplied [Framer reference](https://final-neptune-351336-18ed4de04.framer.app/) and recording. The AI page uses its black palette, Inter typography, particle sphere, monochrome artwork, rounded panels and stacked workflow. Per the requested simplification, the separate navbar, capabilities (06), audiences (07), literacy carousel (09), pricing cards and FAQ are removed. The remaining copy covers subsidized Claude/GPT access, Naira Navakriti research support, agentic code guidance, Nextmo assessments and guided AI literacy. The workspace is an interactive demonstration, not a live LMS. Enquiry buttons use the existing contact form. The original closing landscape now uses the supplied LiquidImage ripple shader: pointer movement distorts the image itself. The added AI-page wordmark is removed; the homepage wordmark is unchanged.

Implementation: `src/pages/ArtificialIntelligence.jsx`, `src/ai.css`, `src/components/ui/AIDashboard.jsx`, and `src/components/hero/AIParticleHero.jsx`. The template's published Unicorn Studio scene uses its 2.1.12 runtime, with scene/model/texture resources served locally from `public/vendor`, `public/models/ai` and `public/images/ai`; copyright notices are retained. The runtime's model-renderer URL is localized. Source observations and resource-fetch scripts are in `../tmp/ai-template/` and `../tmp/fetch-ai-*.mjs`. The [runtime API reference](https://github.com/hiunicornstudio/unicornstudio.js) documents scene initialization, pause and cleanup. A captured poster remains available while the optional animation loads or fails. Scene playback pauses offscreen, in hidden tabs and with the motion control. The AI page is lazy-loaded and the build emits an `ai/index.html` entry for static hosts.

Validation: `../tmp/ai-page-check.mjs`; desktop/mobile previews in `../tmp/ai-qa/`. Checks cover homepage/detail navigation, direct refresh, removed sections, wordmark interaction, demo tabs, enquiry dialog, narrow layouts, accessibility and a blocked-animation fallback. Changes remain local; no Git commit or push.

The closing image correction is checked by `../tmp/ai-liquid-image-check.mjs`: original artwork, visible pointer-driven distortion, no AI-page wordmark, mobile layout, reduced-motion image fallback and runtime errors. Screenshots are in `../tmp/ai-qa/liquid-*.png`.

## Shared cursor trail

`src/components/ui/CursorDotTrail.jsx` adapts the supplied [CursorDotTrail](https://framer.com/m/CursorDotTrail-ZDqFAE.js@iLyzK205nNCuHNDP5Nsc) on the AI and Quantum pages and their enquiry dialogs (not on the homepage). It retains the 12px spring-following dot, 200ms fading wake and 40px link/button hover ring. White difference blending automatically provides contrast on light and dark surfaces. The normal pointer remains available and the overlay cannot intercept input. `data-cursor-trail="link"` enables the source's optional animated underline; `data-cursor-trail="hide"` suppresses the visual for a region.

Only one trail is active: opening the native modal transfers rendering into its top layer. The trail stays hidden until pointer movement, clears on window exit/blur, sleeps once settled, and is disabled for touch-only devices or when the shared motion preference is off. The original component is retained in `../tmp/cursor-dot-trail/`; browser checks and screenshots use `../tmp/cursor-trail-check.mjs` and `../tmp/cursor-dot-trail/qa/`.


## Quantum detail page and floating navigation

`/quantum` opens from the Quantum frontier and has its own static HTML entry for direct refreshes. It shares the dark monochrome palette with AI, with distinct hero, interactive field, campus infrastructure and outreach/GTM layouts. Copy summarizes the supplied company data: Centers of Excellence, campus GPU access at INR 50-60/hour, equity-free support and research-to-market guidance.

`QuantumLiquidHero.jsx` is a local React/Three.js adaptation of the user-supplied [AnimatedLiquidBackground](https://framer.com/m/AnimatedLiquidBackground-Prod-vIhm.js@ghH1aHLmGZ0iE7qXDFVk). It uses the component's actual warp shader and monochrome Vortex preset; Framer editor dependencies are removed. Sources are retained in `../tmp/quantum-reference/`. `QuantumField.jsx` creates original interference and orbital particle structures with a phase control. This is explicitly an illustrative visualization, not a scientific quantum simulator. Animations respect the motion control and reduced-motion preference; the WebGL scenes skip rendering offscreen and in hidden tabs. Content and controls remain available if WebGL is unavailable.

A shared fixed navigation dock on AI and Quantum returns to the homepage frontier section and links to the other domain. The previous duplicated AI home links were removed. Cursor trails are limited to these two detail pages, including their enquiry dialogs. The homepage and its dialog have no cursor trail.

Validation: `../tmp/quantum-check.mjs` checks direct routes/refresh, phase and structure controls, contact form, floating navigation, cursor scope, reduced motion and 320/390/768px layouts. Screenshots are in `../tmp/quantum-reference/qa/`. All work remains local; no Git commit or push.


## Mobile usability

Shared touch rules in `src/mobile.css` improve all three pages: 44-48px controls, readable phone copy, enlarged sliders, safe-area spacing, visible carousel navigation, a one-column enquiry form with 16px inputs, and a contact sheet sized to the visual viewport. Pinch zoom remains enabled, horizontal carousel swipes coexist with vertical scrolling, and the native touch momentum is retained. Touch tablets use direct frontier controls instead of scroll pinning. No page features or animations are removed for phones.

The mobile menu now offers direct AI/Quantum links, scrolls in short landscape viewports and closes before navigating to homepage anchors. Dialogs lock the background before focus changes and restore the previous scroll position when closed. Desktop Lenis resumes after closing. The AI motion button has its own space above the floating navigation, and graphics reset touch interaction on cancellation/release.

Checks: `../tmp/mobile-check.mjs` covers 320/390/768/1024px widths, portrait/landscape layouts, real emulated touch swipes, navigation anchors, form access and scroll restoration. `../tmp/mobile-accessibility-check.mjs` checks all pages with axe, touch dashboard/slider controls, reduced motion, enquiry downloads at a shortened viewport, and desktop scrolling after dialogs. Captures are in `../tmp/mobile-qa/`. Browser tests use Chrome touch emulation; physical iOS/Android hardware was not available.


## Detail-page entrances and automatic frontiers

AI and Quantum paint dark from the initial HTML (including refresh), preload their shared Inter font and fade the loaded content in over 850ms. The lazy-loading placeholder is a subtle line rather than abrupt page text. Hero artwork has its own soft reveal; content never waits on WebGL. Reduced-motion and paused-motion preferences bypass entrance animations.

The homepage frontier showcase now advances through all three technologies every two seconds while visible on desktop and mobile, without scroll pinning. The lower numbered/text labels are replaced by three accessible visual selectors. Pause/resume and direct selection remain available; content links still open AI/Quantum or the enquiry form. Offscreen/hidden-tab playback is suspended. `../tmp/entrance-check.mjs` verifies a full cycle, pause/resume, links, actual opacity progression on initial load/refresh, and reduced motion; captures are in `../tmp/entrance-qa/`.


## Compact homepage close and domain transitions

The homepage no longer mounts the enquiry form or exposes form triggers. Header/hero exploration links go to Frontiers, DeepTech links to Collaboration, and stakeholder rows are informational. The compact What's next section is approximately 250px tall on the checked desktop/phone layouts, with direct AI and Quantum links. Detail-page enquiries remain available.

`RouteTransition.jsx` gives ordinary same-origin AI/Quantum links a 720ms monochrome iris and orbital-particle transition before navigation. It then hands off to the existing destination fade-in. It closes native mobile menus, preserves real URLs/history and modified-click/new-tab behavior, resets on browser Back, and bypasses animation when motion is off. `../tmp/navigation-check.mjs` verifies desktop/mobile routing, keyboard navigation, menu dismissal, browser Back, reduced motion, the smaller CTA and absence of homepage forms. Screenshots are in `../tmp/navigation-qa/`. Lint/build pass; changes are local only.
