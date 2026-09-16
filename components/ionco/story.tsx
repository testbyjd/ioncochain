"use client";

import { useEffect, useRef, useState } from "react";
import type { StageHandle } from "./stage";

const CHAPTER_LABELS = [
  "IONCO",
  "The chain",
  "INC",
  "The app",
  "The journey",
  "Next chapter",
];

/**
 * The WebGL stage behind the homepage plus the scroll plumbing that drives
 * it: chapter progress, chapter activation, the fixed counter, the header
 * state, and the active nav link. Everything degrades to the server-rendered
 * page if WebGL or JavaScript is unavailable.
 */
export function StoryStage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [chapter, setChapter] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const root = document.querySelector<HTMLElement>(".story");
    if (!canvas || !root) return;
    let handle: StageHandle | undefined;
    let cancelled = false;
    const cleanups: Array<() => void> = [];
    const chapters = Array.from(
      root.querySelectorAll<HTMLElement>("[data-chapter]"),
    );
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

    /* --- Scroll: header state, progress bar, stage progress -------------- */
    const progressBar = root.querySelector<HTMLElement>(".scroll-progress");
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        const y = window.scrollY;
        root.dataset.scrolled = String(y > 24);
        if (progressBar) {
          const travel =
            document.documentElement.scrollHeight - window.innerHeight;
          progressBar.style.setProperty(
            "--progress",
            String(travel > 0 ? Math.min(1, y / travel) : 0),
          );
        }
        if (handle && chapters.length) {
          const tops = chapters.map(
            (el) => el.getBoundingClientRect().top + y,
          );
          let p = chapters.length - 1;
          for (let k = 0; k < chapters.length - 1; k++) {
            if (y < tops[k + 1]) {
              const span = Math.max(1, tops[k + 1] - tops[k]);
              p = k + Math.max(0, (y - tops[k]) / span);
              break;
            }
          }
          handle.setProgress(p);
        }
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    cleanups.push(() => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    });
    onScroll();

    /* --- Chapter activation and counter ---------------------------------- */
    if ("IntersectionObserver" in window) {
      const ratios = new Map<Element, number>();
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            ratios.set(entry.target, entry.intersectionRatio);
            (entry.target as HTMLElement).dataset.active = String(
              entry.intersectionRatio >= 0.3,
            );
          });
          let best = 0;
          let bestRatio = -1;
          chapters.forEach((el, i) => {
            const ratio = ratios.get(el) ?? 0;
            if (ratio > bestRatio) {
              bestRatio = ratio;
              best = i;
            }
          });
          setChapter(best);
        },
        { threshold: [0, 0.3, 0.5, 0.7, 1] },
      );
      chapters.forEach((el) => observer.observe(el));
      cleanups.push(() => observer.disconnect());
    } else {
      chapters.forEach((el) => (el.dataset.active = "true"));
    }

    /* --- Active nav link -------------------------------------------------- */
    const links = Array.from(
      root.querySelectorAll<HTMLAnchorElement>(".site-nav a[href*='#']"),
    );
    const targets = links
      .map((link) => {
        const id = link.getAttribute("href")?.split("#")[1];
        const section = id ? document.getElementById(id) : null;
        return section ? { link, section } : null;
      })
      .filter(
        (pair): pair is { link: HTMLAnchorElement; section: HTMLElement } =>
          Boolean(pair),
      );
    const markActive = () => {
      const line = window.innerHeight * 0.45;
      const current = targets.find(({ section }) => {
        const box = section.getBoundingClientRect();
        return line >= box.top && line < box.bottom;
      });
      targets.forEach(({ link }) => delete link.dataset.active);
      if (current) current.link.dataset.active = "true";
    };
    if (targets.length) {
      markActive();
      window.addEventListener("scroll", markActive, { passive: true });
      cleanups.push(() => window.removeEventListener("scroll", markActive));
    }

    /* --- The stage itself ------------------------------------------------- */
    import("./stage")
      .then(({ createStage }) => {
        if (cancelled) return;
        try {
          handle = createStage(canvas, { reducedMotion: reduced.matches });
        } catch {
          return;
        }
        setReady(true);
        onScroll();
        const onPreference = () => handle?.setReducedMotion(reduced.matches);
        reduced.addEventListener("change", onPreference);
        cleanups.push(() =>
          reduced.removeEventListener("change", onPreference),
        );
        if (window.matchMedia("(pointer: fine)").matches) {
          const onMove = (event: PointerEvent) =>
            handle?.setPointer(
              (event.clientX / window.innerWidth) * 2 - 1,
              -((event.clientY / window.innerHeight) * 2 - 1),
            );
          window.addEventListener("pointermove", onMove, { passive: true });
          cleanups.push(() => window.removeEventListener("pointermove", onMove));
        }
      })
      .catch(() => {});

    return () => {
      cancelled = true;
      cleanups.forEach((fn) => fn());
      handle?.dispose();
    };
  }, []);

  const total = CHAPTER_LABELS.length;
  return (
    <>
      <canvas
        ref={canvasRef}
        className="story-stage"
        data-ready={ready}
        aria-hidden="true"
      />
      <div
        className="chapter-counter"
        aria-hidden="true"
        style={{ "--chapter-progress": (chapter + 1) / total } as React.CSSProperties}
      >
        <b>{String(chapter + 1).padStart(2, "0")}</b>
        <span>/ {String(total).padStart(2, "0")}</span>
        <i />
        <span>{CHAPTER_LABELS[chapter]}</span>
      </div>
    </>
  );
}
