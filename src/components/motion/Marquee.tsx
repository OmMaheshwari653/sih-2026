"use client";

import { type ReactNode, useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";

/**
 * Infinite ticker. Content is rendered twice and slid by half its width; the
 * speed kicks up with scroll velocity and eases off on hover.
 */
export const Marquee = ({
  children,
  speed = 40,
  reverse = false,
  className = "",
}: {
  children: ReactNode;
  speed?: number;
  reverse?: boolean;
  className?: string;
}) => {
  const root = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        if (!track.current || !root.current) {
          return;
        }
        const width = track.current.scrollWidth / 2;
        const loop = gsap.fromTo(
          track.current,
          { x: reverse ? -width : 0 },
          {
            x: reverse ? 0 : -width,
            duration: width / speed,
            ease: "none",
            repeat: -1,
          },
        );

        const boost = ScrollTrigger.create({
          onUpdate: (self) => {
            const velocity = Math.min(Math.abs(self.getVelocity()) / 300, 6);
            gsap.to(loop, {
              timeScale: 1 + velocity,
              duration: 0.2,
              overwrite: true,
              onComplete: () => {
                gsap.to(loop, { timeScale: 1, duration: 0.8 });
              },
            });
          },
        });

        const slow = () => gsap.to(loop, { timeScale: 0.2, duration: 0.5 });
        const resume = () => gsap.to(loop, { timeScale: 1, duration: 0.5 });
        root.current.addEventListener("pointerenter", slow);
        root.current.addEventListener("pointerleave", resume);
        const element = root.current;

        return () => {
          boost.kill();
          element.removeEventListener("pointerenter", slow);
          element.removeEventListener("pointerleave", resume);
        };
      });
    },
    { scope: root },
  );

  return (
    <div
      className={`overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_8%,black_92%,transparent)] ${className}`}
      ref={root}
    >
      <div className="flex w-max" ref={track}>
        <div className="flex shrink-0 items-center">{children}</div>
        <div aria-hidden className="flex shrink-0 items-center">
          {children}
        </div>
      </div>
    </div>
  );
};
