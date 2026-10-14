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

- The homepage opens directly without an introductory overlay. The capabilities accordion is the final section immediately above the footer.
- A procedural Three.js orbital sculpture connects the three forms of institutional intelligence. Discover/Create/Deploy automatically rearrange its nodes every three seconds. Manual selection resets the interval. Cycling pauses offscreen, in hidden tabs, or with the motion control. Pointer movement anywhere in the hero tilts the sculpture.
- A second Three.js scene provides a soft monochrome particle field, spaced 24px apart (27px on mobile). Dots drift gently, brighten across a 330px area and react to the mouse within 235px, then spring smoothly back. The normal system cursor stays visible. Clicking empty hero space creates a ripple. Touch input never blocks scrolling, and a subtle CSS dot field provides the no-WebGL fallback.
- Scroll position drives the Three.js cameras and sculpture rotation, with layered title parallax, perspective changes on the frontier frame and stage panels, and staggered movement through the collaboration rows and closing sections. The choreography reverses on upward scrolling. One shared scroll clock caches section geometry, updates only nearby sections, and sleeps when motion settles. Mobile uses reduced travel; the global motion toggle disables the choreography.
- Visibility-triggered compositor entrance fades replay in both scroll directions, independently of the continuous scroll transforms. Typewriter headings continuously type, hold and clear while visible, without shifting layout or repeatedly announcing text to screen readers. Readable HTML never waits for WebGL or a scroll refresh. The hero sculpture becomes ready after its first rendered frame. Framer Motion animates capability accordions. Lenis provides smooth scrolling and anchor navigation.
- The frontier observatory is one wide Three.js frame. A 648-node metallic sculpture transforms between a neural network, intertwined quantum paths and a precision lattice every two seconds while visible. Visitors can select any frontier, pause motion or open the collaboration dialog. Static selection and a CSS visual are available with reduced motion or unavailable WebGL.
- Research-to-impact automatically plays its six stages on entering view: two-second holds with one-second transitions in a continuous loop. Perspective panels, white orbital light paths and WebGL particles share the sequence. It stays in normal document flow with no pinning, scroll seeking or automatic page movement. Pause and stage buttons remain available. Playback sleeps offscreen and in hidden tabs; reduced motion displays all six stages statically.
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
