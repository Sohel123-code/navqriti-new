// Condensed from the vision and mission supplied by NavQriti.
export const purposeSlides = [
  {
    id: "vision",
    label: "OUR VISION",
    title: "Possibility for everyone.",
    text: "One AI and quantum ecosystem connecting students, researchers, institutions and businesses.",
    navigation: "Vision",
  },
  {
    id: "learn",
    label: "OUR MISSION / LEARN",
    title: "Understand. Then create.",
    text: "AI and quantum literacy. Career excellence centers. Skills for responsible use.",
    navigation: "Learn",
  },
  {
    id: "build",
    label: "OUR MISSION / BUILD",
    title: "Access without barriers.",
    text: "AI tools, GPU infrastructure and collaborative research. Open to experimentation.",
    navigation: "Build",
  },
  {
    id: "launch",
    label: "OUR MISSION / LAUNCH",
    title: "Ideas into impact.",
    text: "Industry partnerships and go-to-market support that turn innovation into real-world solutions.",
    navigation: "Launch",
  },
].map((slide) => ({
  ...slide,
  video: `/videos/purpose/${slide.id}.webm`,
  poster: `/videos/purpose/${slide.id}.webp`,
}));
