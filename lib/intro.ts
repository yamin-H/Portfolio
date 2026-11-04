/** Seconds the hero waits while the intro sheet is on screen. */
export const INTRO_LEAD = 0.85;

export const introLead = () =>
  typeof document !== "undefined" &&
  document.documentElement.dataset.intro === "play"
    ? INTRO_LEAD
    : 0;