"use client";

import { useEffect, useRef, type RefObject } from "react";
import { mountResidentRig } from "./resident-rig";
import styles from "./ResidentRobot.module.css";

type Point = { x: number; y: number };
type Action = "idle" | "walk" | "run" | "wave" | "inspect" | "point-left" | "point-right" | "curious" | "sleep" | "wake";
type Props = {
  target: string | null;
  enabled: boolean;
  onToggle: () => void;
  runningToCard: RefObject<boolean>;
};

const stopWait = 5;
const cardRunCooldown = 20;
const wakeDuration = 4.72;
const greetingWave = 2;
const greetingWait = 3;
const sessionKey = "pixel-lab-resident-tour-v1";
const projectVisitKey = "pixel-lab-resident-project-visit";

export function markRobotProjectVisit() {
  try { sessionStorage.setItem(projectVisitKey, "true"); } catch {}
}
const sections = [
  { duration: 120, stops: ["hero-name", "cv", "city-right", "projects-heading", "city-left", "city-bottom"] },
  { duration: 60, stops: ["experience", "learning", "refabric", "huawei", "odeabank", "experience-end"] },
  { duration: 60, stops: ["about", "skills-left", "skills-center", "skills-right", "mail", "contact-top", "contact-end"] },
] as const;
const stopActions: Partial<Record<string, Action>> = {
  cv: "point-left", "city-right": "curious", "projects-heading": "inspect", "city-left": "wave",
  experience: "wave", learning: "curious", refabric: "point-left",
  about: "curious", "skills-left": "point-right", mail: "point-left", "contact-end": "curious",
  "hero-name": "wave", "city-bottom": "curious", "experience-end": "wave",
  "skills-center": "inspect", "contact-top": "wave",
};

type Destination = { id: string; point: Point; triggeredByCard: boolean };
type TourResume = {
  position: Point;
  destination: Destination | null;
  action: Action;
  actionElapsed: number;
  waitLeft: number;
};
const clamp = (value: number, low: number, high: number) =>
  Math.max(low, Math.min(high, value));
const distance = (a: Point, b: Point) => Math.hypot(b.x - a.x, b.y - a.y);
const smooth = (a: number, b: number, dt: number, rate = 5.5) =>
  a + (b - a) * (1 - Math.exp(-rate * dt));

export default function ResidentRobot(props: Props) {
  const host = useRef<HTMLDivElement>(null);
  const rig = useRef<HTMLDivElement>(null);
  const greet = useRef<() => void>(() => {});
  const controls = useRef(props);
  useEffect(() => { controls.current = props; }, [props]);

  useEffect(() => {
    const robot = host.current;
    if (!robot || !rig.current) return;
    const draw = mountResidentRig(rig.current);
    const reduce = matchMedia("(prefers-reduced-motion: reduce)");
    const touch = matchMedia("(pointer: coarse)");
    let home: Point = { x: 0, y: 0 };
    let positions = new Map<string, Point>();
    let width = 150;
    let height = 187.5;
    let pageWidth = 0;
    let pageHeight = 0;
    let dirty = true;
    let position: Point | null = null;
    let velocity: Point = { x: 0, y: 0 };
    let destination: Destination | null = null;
    let action: Action = "sleep";
    let actionStart = 0;
    let waitUntil = 0;
    let time = 0;
    let lastFrame = performance.now();
    let frameId = 0;
    let heading = 0;
    let phase = 0;
    let walk = 0;
    let run = 0;
    let tripLength = 0;
    let intro: "sleep" | "wake" | "pause" | "wave" | "done" = "sleep";
    let sectionIndex = 0;
    let sectionElapsed = 0;
    let cardVisit: string | null = null;
    let handledCard: string | null = null;
    let cardRunAvailableAt = 0;
    let resume: TourResume | null = null;
    const recentStops: string[] = [];
    let wakeSeatedPose = 1;
    let greetingStart: number | null = null;
    greet.current = () => {
      const stationary = touch.matches || pageWidth < 641;
      if (!position || !controls.current.enabled || reduce.matches ||
          (!stationary && (action === "sleep" || action === "wake" || destination?.id === "home")) ||
          greetingStart !== null) return;
      greetingStart = time;
      velocity = { x: 0, y: 0 };
      walk = 0;
      run = 0;
      controls.current.runningToCard.current = false;
    };

    let lastSaved = 0;
    let restoreProjectVisit = false;
    let hasTicked = false;
    function snapshot() {
      return { position, velocity, destination, action, actionStart, waitUntil, time,
        heading, phase, walk, run, tripLength, intro, sectionIndex, sectionElapsed,
        cardVisit, handledCard, cardRunAvailableAt, resume, recentStops, wakeSeatedPose,
        greetingStart, savedAt: Date.now() };
    }
    function save() {
      try { sessionStorage.setItem(sessionKey, JSON.stringify(snapshot())); } catch {}
    }
    try {
      const raw = sessionStorage.getItem(sessionKey);
      if (raw) {
        const previous = JSON.parse(raw) as ReturnType<typeof snapshot>;
        ({ position, velocity, destination, action, actionStart, waitUntil, time,
          heading, phase, walk, run, tripLength, intro, sectionIndex, sectionElapsed,
          cardVisit, handledCard, resume, wakeSeatedPose } = previous);
        cardRunAvailableAt = previous.cardRunAvailableAt ?? 0;
        greetingStart = previous.greetingStart ?? null;
        recentStops.push(...previous.recentStops);
        restoreProjectVisit = sessionStorage.getItem(projectVisitKey) === "true";
        if (restoreProjectVisit && Number.isFinite(previous.savedAt)) {
          lastFrame -= Math.max(0, Date.now() - previous.savedAt);
        }
      }
    } catch {}
    window.addEventListener("pagehide", save);

    const observer = new ResizeObserver(() => { dirty = true; });
    for (const element of document.querySelectorAll("header, main, [data-robot-stop], [data-project]")) {
      observer.observe(element);
    }
    const markDirty = () => { dirty = true; };
    window.addEventListener("resize", markDirty);
    document.fonts.addEventListener("loadingdone", markDirty);

    function clampPoint(point: Point): Point {
      return {
        x: clamp(point.x, 0, Math.max(0, pageWidth - width)),
        y: clamp(point.y, 0, Math.max(0, pageHeight - height)),
      };
    }

    function boundsOf(element: Element) {
      const r = element.getBoundingClientRect();
      return {
        left: r.left + scrollX, right: r.right + scrollX,
        top: r.top + scrollY, bottom: r.bottom + scrollY,
        width: r.width, height: r.height,
      };
    }

    function cardPoint(id: string): Point | null {
      const element = document.getElementById(id);
      if (!element?.matches("[data-project]")) return null;
      const r = boundsOf(element);
      // Feet align with the top edge while the figure stays clear of the card content.
      return clampPoint({ x: r.right + 8 - width / 2, y: r.top - height * .93 });
    }

    function measure() {
      width = robot!.offsetWidth;
      height = robot!.offsetHeight;
      pageWidth = document.documentElement.clientWidth;
      pageHeight = Math.max((document.querySelector("main")?.getBoundingClientRect().bottom ?? 0) + scrollY,
        document.documentElement.clientHeight);
      const house = document.getElementById("robot-home");
      if (house) {
        const r = boundsOf(house);
        home = clampPoint({ x: r.right - width - 8, y: r.bottom - height * .93 - 23 });
      }
      const obstacles = Array.from(
        document.querySelectorAll("h1,h2,h3,a,button,[data-project],.about-copy p,.skill-group .tags li"),
      ).filter(element => !robot!.contains(element)).flatMap(element => {
        if (!element.matches("h1,h2,h3")) return [boundsOf(element)];
        const text = document.createRange();
        text.selectNodeContents(element);
        return Array.from(text.getClientRects(), rect => ({
          left: rect.left + scrollX, right: rect.right + scrollX,
          top: rect.top + scrollY, bottom: rect.bottom + scrollY,
        }));
      });
      positions = new Map();
      const anchors: Record<string, string> = {
        "city-right": "city", "city-left": "city", "city-bottom": "city",
        "skills-left": "skills", "skills-center": "skills", "skills-right": "skills",
        "contact-top": "contact-end",
      };
      for (const id of sections.flatMap(group => [...group.stops] as string[])) {
        const key = anchors[id] ?? id;
        const anchor = document.querySelector(`[data-robot-stop="${key}"]`);
        if (!anchor) continue;
        const anchorBounds = boundsOf(anchor);
        const r = id === "learning" && !anchorBounds.width && anchor.parentElement
          ? boundsOf(anchor.parentElement)
          : anchorBounds;
        const besideY = (r.top + r.bottom - height) / 2;
        const right = { x: r.right + 10, y: besideY };
        const left = { x: r.left - width - 10, y: besideY };
        const below = { x: (r.left + r.right - width) / 2, y: r.bottom + 3 };
        const insideRight = { x: r.right - width - 12, y: r.top + 8 };
        const heading = id === "refabric" ? anchor.querySelector("h3") : null;
        const plus = id === "huawei" || id === "odeabank"
          ? anchor.querySelector(".experience-mark") : null;
        const headingBounds = heading && boundsOf(heading);
        const plusBounds = plus && boundsOf(plus);
        const beforePlus = plusBounds
          ? [{ x: plusBounds.left - width * .83 - 10, y: r.bottom - height * .91 - 8 }]
          : [];
        const candidates: Record<string, Point[]> = {
          "hero-name": [
            { x: r.right - width * .65, y: r.bottom - height * .93 },
            { ...right, x: r.right + 4 },
          ],
          cv: [
            { x: right.x + 14, y: r.bottom - height * .91 },
            { x: r.right + width * .8, y: r.bottom - height * .91 },
            { x: r.right - width * .45, y: r.bottom + 6 },
            below,
          ],
          "city-right": [insideRight],
          "projects-heading": [{ x: r.left + Math.min(305, r.width * .55), y: r.top - height * .68 }],
          "city-left": [left, { x: r.left + 8, y: r.top + 12 }],
          "city-bottom": [{ x: r.left + r.width * .42 - width / 2, y: r.bottom - height - 23 }],
          experience: [
            { x: r.left + Math.min(220, r.width * .35), y: r.top - height * .65 },
            { ...below, x: r.left + r.width * .32 },
          ],
          learning: [
            { ...below, x: r.right - width },
            below,
            { x: r.right - width, y: r.bottom - height * .7 },
          ],
          refabric: headingBounds
            ? [{ x: headingBounds.right + 10 - width * .17, y: headingBounds.bottom - height * .91 }]
            : [],
          huawei: beforePlus,
          odeabank: beforePlus,
          "experience-end": [
            { x: r.left + 15, y: r.bottom - height * .72 },
            { x: r.left + 15, y: r.bottom + 8 },
          ],
          about: [{ ...below, x: r.left + 12 }, below, { x: r.left, y: r.top - height * .7 }],
          "skills-left": [{ x: r.left, y: r.bottom + 6 }],
          "skills-center": [{ ...below, y: r.bottom + 10 }],
          "skills-right": [{ x: r.right - width, y: r.bottom + 6 }],
          mail: [{ ...right, y: r.bottom - height * .76 }, right, { ...right, y: r.top + 10 }],
          "contact-top": [{ x: r.right - width - 10, y: r.top + 8 }],
          "contact-end": [{ x: r.right - width - 10, y: r.bottom - height }],
        };
        const available = candidates[id].map(clampPoint).find((point) => {
          const left = point.x + width * .17;
          const right = point.x + width * .83;
          const top = point.y + height * .11;
          const bottom = point.y + height * .93;
          return !obstacles.some((box) =>
            left < box.right && right > box.left && top < box.bottom && bottom > box.top);
        });
        if (available) positions.set(id, available);
      }
      if (position) position = clampPoint(position);
      if (destination) {
        const updated = destination.id === "home" ? home :
          destination.id === "resume" ? resume && clampPoint(resume.position) :
          positions.get(destination.id) ?? cardPoint(destination.id);
        if (updated) destination.point = updated;
        else { destination = null; velocity = { x: 0, y: 0 }; setAction("idle"); }
      }
      if (!destination && (action === "sleep" || action === "wake")) position = home;
      dirty = false;
    }

    function setAction(next: Action) {
      action = next;
      actionStart = time;
      if (next !== "walk" && next !== "run") heading = 0;
    }

    function travel(id: string, point: Point, running = false) {
      destination = { id, point, triggeredByCard: running && id.startsWith("card-") };
      tripLength = distance(position!, point);
      if (tripLength > 4) {
        const dx = point.x - position!.x;
        const dy = point.y - position!.y;
        heading = Math.abs(dy) > Math.abs(dx) * 1.25 ? (dy < 0 ? 4 : 0) : (dx < 0 ? 7 : 1);
      }
      setAction(running ? "run" : "walk");
    }

    function rememberTour() {
      if (resume || !position) return;
      resume = { position, destination, action,
        actionElapsed: time - actionStart, waitLeft: Math.max(0, waitUntil - time) };
    }

    function resumeTour() {
      cardVisit = null;
      if (!resume) return;
      const previous = resume;
      resume = null;
      const previousTarget = previous.destination && positions.get(previous.destination.id);
      if (previous.destination && previousTarget) {
        travel(previous.destination.id, previousTarget);
      } else {
        setAction(previous.destination ? "idle" : previous.action);
        actionStart = time - previous.actionElapsed;
        waitUntil = time + previous.waitLeft;
      }
    }

    function arrive(id: string) {
      if (id === "home") { setAction("sleep"); return; }
      if (id === "resume") { resumeTour(); return; }
      if (id.startsWith("card-")) {
        handledCard = id;
        cardRunAvailableAt = time + cardRunCooldown;
        setAction("inspect");
      } else {
        recentStops.unshift(id);
        if (recentStops.length > 3) recentStops.pop();
        setAction(stopActions[id] ?? "idle");
      }
      waitUntil = time + stopWait;
    }

    function plan(dt: number) {
      const { enabled, target } = controls.current;
      const elapsed = time - actionStart;
      if (!enabled) {
        if (destination?.id !== "home" && action !== "sleep") {
          if (intro === "done" && action !== "wake") rememberTour();
          cardVisit = null;
          travel("home", home, true);
        }
        return;
      }
      if (destination?.id === "home") {
        destination = null;
        velocity = { x: 0, y: 0 };
        walk = 0;
        run = 0;
        setAction("idle");
        waitUntil = time;
        if (resume) resumeTour();
        if (intro === "wake" || intro === "wave") {
          intro = "pause";
          waitUntil = time + 2;
        }
        return;
      }
      if (action === "sleep") {
        if (intro === "sleep" && elapsed < .65) return;
        wakeSeatedPose = clamp(elapsed / .23, 0, 1) ** 2;
        if (intro !== "done") intro = "wake";
        setAction("wake");
        return;
      }
      if (action === "wake") {
        if (elapsed < wakeDuration) return;
        setAction("idle");
        if (intro !== "done") {
          intro = "pause";
          waitUntil = time + 2;
        }
      }
      if (intro === "pause") {
        if (time < waitUntil) return;
        intro = "wave";
        setAction("wave");
        return;
      }
      if (intro === "wave") {
        if (elapsed < 2) return;
        intro = "done";
        setAction("idle");
        waitUntil = time;
      }

      if (resume && !cardVisit) {
        if (destination?.id !== "resume") travel("resume", clampPoint(resume.position));
        return;
      }

      if (time < cardRunAvailableAt && target) handledCard = target;
      if (time >= cardRunAvailableAt && target && target !== handledCard) {
        handledCard = null;
        if (destination?.id !== target || !destination.triggeredByCard) {
          const point = cardPoint(target);
          if (point) {
            rememberTour();
            cardVisit = target;
            travel(target, point, true);
            return;
          }
        }
      }
      if (!target) handledCard = null;
      if (destination && cardVisit) return;

      if (action === "inspect" && elapsed >= 2.9 && cardVisit) {
        setAction("point-left");
        return;
      }
      const duration = action === "inspect" ? 2.9 : action === "curious" ? 2.7 :
        action === "point-left" || action === "point-right" ? 2.4 : action === "wave" ? 2 : 0;
      if (cardVisit) {
        if (duration && elapsed < duration) return;
        if (action !== "idle") {
          setAction("idle");
          waitUntil = time + stopWait;
        }
        if (time < waitUntil) return;
        if (resume) travel("resume", clampPoint(resume.position));
        else resumeTour();
        return;
      }

      sectionElapsed += dt;
      if (sectionElapsed >= sections[sectionIndex].duration) {
        sectionElapsed -= sections[sectionIndex].duration;
        sectionIndex = (sectionIndex + 1) % sections.length;
        destination = null;
        setAction("idle");
        waitUntil = time;
      } else {
        if (destination || (duration && elapsed < duration)) return;
        if (action !== "idle") {
          setAction("idle");
          waitUntil = time + stopWait;
        }
        if (time < waitUntil) return;
      }

      const available = sections[sectionIndex].stops.filter(id => positions.has(id));
      const different = available.filter(id => id !== recentStops[0]);
      const fresh = different.filter(id => !recentStops.includes(id));
      const pool = fresh.length ? fresh : different.length ? different : available;
      if (pool.length) {
        const id = pool[Math.floor(Math.random() * pool.length)];
        travel(id, positions.get(id)!);
      }
    }

    function advance(dt: number, still: boolean) {
      if (!position) position = home;
      if (still && greetingStart === null) return;
      time += dt;
      if (greetingStart !== null) {
        if (controls.current.enabled && !reduce.matches &&
            time - greetingStart < greetingWave + greetingWait) {
          actionStart += dt;
          waitUntil += dt;
          return;
        }
        greetingStart = null;
      }
      if (!still) {
        plan(dt);
        if (destination) {
          const dtMotion = dt * 1.2;
          const gap = distance(position, destination.point);
          const running = action === "run";
          const progress = tripLength > 0 ? clamp(1 - gap / tripLength, 0, 1) : 0;
          const boost = running ? 1 + .08 * Math.sin(Math.PI * progress) ** 2 : 1;
          const desired = Math.min(running ? 176.22 : 89.7, Math.sqrt(230 * gap), gap * 5) * boost;
          const dx = destination.point.x - position.x;
          const dy = destination.point.y - position.y;
          velocity.x = smooth(velocity.x, gap ? desired * dx / gap : 0, dtMotion);
          velocity.y = smooth(velocity.y, gap ? desired * dy / gap : 0, dtMotion);
          const speed = Math.hypot(velocity.x, velocity.y);
          run = smooth(run, running ? clamp((speed - 45) / 65, 0, 1) : 0, dtMotion, 9);
          walk = smooth(walk, Math.min(1, speed / 65), dtMotion, 10);
          phase += speed * dtMotion / ((58 + 17 * run) * width / 160) * Math.PI * 2;
          if ((gap < 1.2 && speed < 16) ||
              (gap <= speed * dtMotion && velocity.x * dx + velocity.y * dy > 0)) {
            const { id } = destination;
            position = destination.point;
            destination = null;
            velocity = { x: 0, y: 0 };
            walk = 0; run = 0;
            arrive(id);
          } else {
            position = clampPoint({ x: position.x + velocity.x * dtMotion, y: position.y + velocity.y * dtMotion });
          }
        }
      }

    }

    function tick(now: number) {
      let remaining = Math.max(0, (now - lastFrame) / 1000);
      lastFrame = Math.max(lastFrame, now);
      if (dirty) measure();
      const still = reduce.matches || touch.matches || pageWidth < 641;
      const renderDt = Math.min(remaining, .04);

      // Timers and frames can be throttled in background tabs. Replay the
      // elapsed time in small steps so card visits and route clocks stay in sync.
      while (remaining > .04) {
        advance(.04, still);
        remaining -= .04;
      }
      advance(remaining, still);
      hasTicked = true;
      if (restoreProjectVisit) {
        restoreProjectVisit = false;
        try { sessionStorage.removeItem(projectVisitKey); } catch {}
        save();
      }
      if (time - lastSaved >= .5) { lastSaved = time; save(); }

      controls.current.runningToCard.current = !still && greetingStart === null && destination?.triggeredByCard === true;
      if (document.hidden || !position) return;
      const asleep = still ? reduce.matches || !controls.current.enabled : action === "sleep";
      let elapsed = time - actionStart;
      if (still && asleep) elapsed = .5;
      const greeting = greetingStart !== null;
      const greetingElapsed = greetingStart === null ? 0 : time - greetingStart;
      const pose = greeting ? (greetingElapsed < greetingWave ? "wave" : "idle") :
        still || (action === "inspect" && elapsed < .2) ? "idle" : action;
      const renderedPosition = still ? home : position;
      robot!.style.transform = `translate3d(${renderedPosition.x}px,${renderedPosition.y}px,0)`;
      draw({
        time, dt: renderDt, still: still && !greeting, sleeping: asleep,
        waking: !still && action === "wake", moving: !still && !greeting && !!destination,
        action: pose, elapsed: greeting ? greetingElapsed : pose === "inspect" ? elapsed - .2 : elapsed,
        heading: still || greeting ? 0 : heading,
        direction: Math.sign(velocity.x), stepPhase: phase,
        walk: still ? 0 : walk, run: still ? 0 : run, wakeSeatedPose,
      });
    }

    function frame(now: number) {
      tick(now);
      frameId = requestAnimationFrame(frame);
    }

    function onVisibilityChange() {
      tick(performance.now());
      save();
    }

    function onPageShow(event: PageTransitionEvent) {
      if (!event.persisted) return;
      try { sessionStorage.removeItem(projectVisitKey); } catch {}
      tick(performance.now());
      save();
    }

    const backgroundTimer = window.setInterval(() => {
      if (document.hidden) tick(performance.now());
    }, 1000);
    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("pageshow", onPageShow);
    frameId = requestAnimationFrame(frame);
    return () => {
      if (hasTicked) save();
      window.removeEventListener("pagehide", save);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("pageshow", onPageShow);
      window.clearInterval(backgroundTimer);
      cancelAnimationFrame(frameId);
      greet.current = () => {};
      controls.current.runningToCard.current = false;
      observer.disconnect();
      window.removeEventListener("resize", markDirty);
      document.fonts.removeEventListener("loadingdone", markDirty);
    };
  }, []);

  const powerLabel = props.enabled ? "Put robot to sleep" : "Wake robot";
  return (
    <div ref={host} className={styles.resident}>
      <div ref={rig} className={styles.rig} aria-hidden="true" />
      <button type="button" className={styles.greet} aria-label="Say hello to the robot"
        disabled={!props.enabled} onClick={() => greet.current()} />
      <button type="button" className={styles.power} aria-label={powerLabel}
        title={powerLabel} onClick={props.onToggle}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
          strokeLinecap="round" aria-hidden="true">
          <path d="M12 3v8m-4.5-5a7.5 7.5 0 1 0 9 0" />
        </svg>
      </button>
    </div>
  );
}
