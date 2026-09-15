"use client";

import { createScope, type Scope } from "animejs";
import { type RefObject, useEffect, useRef } from "react";

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Runs anime.js animations scoped to a root element and reverts them on
 * unmount. Ambient loops are skipped for users who asked for reduced motion.
 */
export const useAnimeScope = <T extends HTMLElement | SVGElement>(
  setup: (scope: Scope, root: T) => void,
): RefObject<T | null> => {
  const root = useRef<T>(null);
  // Latest setup without re-running the scope on every render.
  const setupRef = useRef(setup);
  setupRef.current = setup;

  useEffect(() => {
    if (!root.current || prefersReducedMotion()) {
      return;
    }
    const element = root.current;
    const scope = createScope({ root: element }).add((self) => {
      if (self) {
        setupRef.current(self, element);
      }
    });
    return () => {
      scope.revert();
    };
  }, []);

  return root;
};
