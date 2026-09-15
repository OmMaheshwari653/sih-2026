"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

// Registered once, in the browser only — every motion component imports from here.
if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText, DrawSVGPlugin);
  gsap.defaults({ ease: "power3.out", duration: 0.9 });
}

export const EASE_GLASS = "expo.out";

export { DrawSVGPlugin, gsap, ScrollTrigger, SplitText, useGSAP };
