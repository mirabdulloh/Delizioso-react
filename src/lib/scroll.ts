const SECTION_SCROLL_OFFSET = 96;

export function scrollToSectionTop(
  element: HTMLElement | null,
  behavior: ScrollBehavior = "smooth",
  offset: number = SECTION_SCROLL_OFFSET,
) {
  if (!element || typeof window === "undefined") return;

  const top = window.scrollY + element.getBoundingClientRect().top - offset;

  window.scrollTo({
    top: Math.max(0, top),
    left: 0,
    behavior,
  });
}

export function scrollWindowTop(behavior: ScrollBehavior = "smooth") {
  if (typeof window === "undefined") return;

  window.scrollTo({
    top: 0,
    left: 0,
    behavior,
  });
}
