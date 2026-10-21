## Integrate the <AnimatedContent /> component from React Bits

You are helping integrate an open-source React component into an existing application.

### Component: AnimatedContent
### Variant: JavaScript + CSS
### Dependencies: gsap

---

### Usage Example
```jsx
import AnimatedContent from './AnimatedContent'

<AnimatedContent
  distance={100}
  direction="vertical"
  duration={0.8}
  ease="power3.out"
  blur={0}
  stagger={0.08}
  threshold={0.1}
>
  <h2>Ship it before lunch</h2>
  <p>Every child animates in turn.</p>
</AnimatedContent>
```

### Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| children | ReactNode | - | The content to animate. |
| container | string | HTMLElement | window | Scroll container that drives the animation, as a selector or an element. Defaults to the page. |
| distance | number | 100 | How far the content travels into place, in px. |
| direction | 'vertical' | 'horizontal' | 'vertical' | Axis the content travels along. |
| reverse | boolean | false | Comes in from the opposite side: from above, or from the left. |
| duration | number | 0.8 | Length of the animation, in seconds. |
| ease | string | 'power3.out' | Any GSAP ease, such as 'expo.out', 'back.out(1.6)' or 'elastic.out(1, 0.5)'. |
| initialOpacity | number | 0 | Opacity the content starts from. |
| animateOpacity | boolean | true | Fades the content in. Turn off to keep it fully opaque while it moves. |
| scale | number | 1 | Scale the content starts from. |
| blur | number | 0 | Blur the content starts from, in px. It comes into focus as it lands. |
| rotate | number | 0 | Rotation the content starts from, in degrees. |
| tilt | number | 0 | Tips the content back in 3D, in degrees, so it flips up into place. |
| wipe | 'none' | 'up' | 'down' | 'left' | 'right' | 'center' | 'none' | Reveals the content behind a soft moving edge instead of all at once. |
| threshold | number | 0.1 | How far into the viewport the top of the content must be before it animates, from 0 to 1. |
| delay | number | 0 | Wait before the animation starts, in seconds. |
| stagger | number | 0 | Animates each direct child in turn, this many seconds apart. Great for lists and grids. |
| staggerFrom | 'start' | 'end' | 'center' | 'edges' | 'random' | 'start' | Which child goes first when staggering. |
| trigger | 'scroll' | 'mount' | 'scroll' | Animate when the content scrolls into view, or right away. |
| once | boolean | true | Plays once. Turn off to replay every time the content scrolls in, and reverse when it scrolls back out. |
| scrub | boolean | number | false | Ties the animation to the scroll position. A number smooths it, in seconds. |
| disappearAfter | number | 0 | Hides the content again this many seconds after it appears. 0 keeps it shown. |
| disappearDuration | number | 0.5 | Length of the hide animation, in seconds. |
| disappearEase | string | 'power3.in' | GSAP ease of the hide animation. |
| onStart | () => void | - | Called when the animation starts. |
| onComplete | () => void | - | Called when the animation finishes. |
| onDisappearanceComplete | () => void | - | Called when the hide animation finishes. |
| className | string | '' | Extra class names for the wrapper. |
| style | CSSProperties | - | Inline styles for the wrapper. |

### Full Component Source
```jsx
'use client';

import { useEffect, useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

const WIPES = {
  up: 'linear-gradient(to top, #000 calc(var(--ac-wipe) * 140% - 40%), transparent calc(var(--ac-wipe) * 140%))',
  down: 'linear-gradient(to bottom, #000 calc(var(--ac-wipe) * 140% - 40%), transparent calc(var(--ac-wipe) * 140%))',
  left: 'linear-gradient(to left, #000 calc(var(--ac-wipe) * 140% - 40%), transparent calc(var(--ac-wipe) * 140%))',
  right: 'linear-gradient(to right, #000 calc(var(--ac-wipe) * 140% - 40%), transparent calc(var(--ac-wipe) * 140%))',
  center:
    'radial-gradient(farthest-corner at 50% 50%, #000 calc(var(--ac-wipe) * 140% - 40%), transparent calc(var(--ac-wipe) * 140%))'
};

const AnimatedContent = ({
  children,
  container,
  distance = 100,
  direction = 'vertical',
  reverse = false,
  duration = 0.8,
  ease = 'power3.out',
  initialOpacity = 0,
  animateOpacity = true,
  scale = 1,
  blur = 0,
  rotate = 0,
  tilt = 0,
  wipe = 'none',
  threshold = 0.1,
  delay = 0,
  stagger = 0,
  staggerFrom = 'start',
  trigger = 'scroll',
  once = true,
  scrub = false,
  disappearAfter = 0,
  disappearDuration = 0.5,
  disappearEase = 'power3.in',
  onStart,
  onComplete,
  onDisappearanceComplete,
  className = '',
  style,
  ...props
}) => {
  const ref = useRef(null);
  const callbacksRef = useRef({ onStart, onComplete, onDisappearanceComplete });
  callbacksRef.current = { onStart, onComplete, onDisappearanceComplete };

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    let scroller = container || document.getElementById('snap-main-container') || null;
    if (typeof scroller === 'string') scroller = document.querySelector(scroller);

    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;

    const ctx = gsap.context(() => {
      const targets = stagger > 0 && el.children.length ? Array.from(el.children) : [el];
      const horizontal = direction === 'horizontal';
      const axis = horizontal ? 'x' : 'y';
      const sign = reverse ? -1 : 1;
      const mask = WIPES[wipe];

      gsap.set(el, { visibility: 'visible' });

      if (reduce) {
        callbacksRef.current.onComplete?.();
        return;
      }

      const from = {
        [axis]: distance * sign,
        scale,
        opacity: animateOpacity ? initialOpacity : 1
      };
      const to = {
        [axis]: 0,
        scale: 1,
        opacity: 1,
        duration,
        ease
      };

      if (blur > 0) {
        from.filter = `blur(${blur}px)`;
        to.filter = 'blur(0px)';
      }
      if (rotate) {
        from.rotation = rotate * sign;
        to.rotation = 0;
      }
      if (tilt) {
        const tiltAxis = horizontal ? 'rotationY' : 'rotationX';
        from[tiltAxis] = horizontal ? -tilt * sign : tilt * sign;
        to[tiltAxis] = 0;
        from.transformPerspective = 900;
        to.transformPerspective = 900;
      }
      if (mask) {
        gsap.set(targets, { maskImage: mask, webkitMaskImage: mask });
        from['--ac-wipe'] = 0;
        to['--ac-wipe'] = 1;
      }
      if (stagger > 0) to.stagger = { each: stagger, from: staggerFrom };

      const settle = () => {
        if (scrub) return;
        gsap.set(targets, { clearProps: mask ? 'filter,transform,maskImage,webkitMaskImage' : 'filter,transform' });
      };

      const disappear = () => {
        if (disappearAfter <= 0) return;
        const out = {
          [axis]: -distance * sign,
          scale: 0.8,
          opacity: animateOpacity ? initialOpacity : 0,
          delay: disappearAfter,
          duration: disappearDuration,
          ease: disappearEase,
          onComplete: () => callbacksRef.current.onDisappearanceComplete?.()
        };
        if (blur > 0) out.filter = `blur(${blur}px)`;
        if (stagger > 0) out.stagger = { each: stagger, from: staggerFrom };
        gsap.to(targets, out);
      };

      const tl = gsap.timeline({
        paused: true,
        onStart: () => callbacksRef.current.onStart?.(),
        onComplete: () => {
          callbacksRef.current.onComplete?.();
          settle();
          if (once && !scrub) disappear();
        }
      });
      tl.fromTo(targets, from, to, scrub ? 0 : Math.max(delay, 0));

      if (trigger === 'mount') {
        tl.play();
        return;
      }

      const start = `top ${(1 - threshold) * 100}%`;

      if (scrub) {
        ScrollTrigger.create({
          trigger: el,
          scroller,
          start,
          end: `top ${Math.max((1 - threshold) * 100 - 45, 5)}%`,
          scrub: scrub === true ? true : Math.max(Number(scrub) || 0, 0.01),
          animation: tl
        });
        return;
      }

      ScrollTrigger.create({
        trigger: el,
        scroller,
        start,
        once,
        onEnter: () => tl.play(),
        onLeaveBack: once
          ? undefined
          : () => {
              if (mask) gsap.set(targets, { maskImage: mask, webkitMaskImage: mask });
              tl.reverse();
            }
      });
    }, el);

    return () => ctx.revert();
  }, [
    container,
    distance,
    direction,
    reverse,
    duration,
    ease,
    initialOpacity,
    animateOpacity,
    scale,
    blur,
    rotate,
    tilt,
    wipe,
    threshold,
    delay,
    stagger,
    staggerFrom,
    trigger,
    once,
    scrub,
    disappearAfter,
    disappearDuration,
    disappearEase
  ]);

  return (
    <div ref={ref} className={className} style={{ visibility: 'hidden', ...style }} {...props}>
      {children}
    </div>
  );
};

export default AnimatedContent;

```

### Integration Instructions
1. Install any listed dependencies.
2. Copy the component source into the appropriate directory in the project.
3. Import and render the component using the usage example above as a starting point.
4. Adjust props as needed for the specific use case — refer to the props table for all available options.

### More from React Bits
The full library index, including everything reactbits.dev offers, is at https://reactbits.dev/llms.txt — fetch it if this component is not the right fit or the project needs more pieces.







Component Source:
'use client';

import { useEffect, useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

const WIPES = {
  up: 'linear-gradient(to top, #000 calc(var(--ac-wipe) * 140% - 40%), transparent calc(var(--ac-wipe) * 140%))',
  down: 'linear-gradient(to bottom, #000 calc(var(--ac-wipe) * 140% - 40%), transparent calc(var(--ac-wipe) * 140%))',
  left: 'linear-gradient(to left, #000 calc(var(--ac-wipe) * 140% - 40%), transparent calc(var(--ac-wipe) * 140%))',
  right: 'linear-gradient(to right, #000 calc(var(--ac-wipe) * 140% - 40%), transparent calc(var(--ac-wipe) * 140%))',
  center:
    'radial-gradient(farthest-corner at 50% 50%, #000 calc(var(--ac-wipe) * 140% - 40%), transparent calc(var(--ac-wipe) * 140%))'
};

const AnimatedContent = ({
  children,
  container,
  distance = 100,
  direction = 'vertical',
  reverse = false,
  duration = 0.8,
  ease = 'power3.out',
  initialOpacity = 0,
  animateOpacity = true,
  scale = 1,
  blur = 0,
  rotate = 0,
  tilt = 0,
  wipe = 'none',
  threshold = 0.1,
  delay = 0,
  stagger = 0,
  staggerFrom = 'start',
  trigger = 'scroll',
  once = true,
  scrub = false,
  disappearAfter = 0,
  disappearDuration = 0.5,
  disappearEase = 'power3.in',
  onStart,
  onComplete,
  onDisappearanceComplete,
  className = '',
  style,
  ...props
}) => {
  const ref = useRef(null);
  const callbacksRef = useRef({ onStart, onComplete, onDisappearanceComplete });
  callbacksRef.current = { onStart, onComplete, onDisappearanceComplete };

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    let scroller = container || document.getElementById('snap-main-container') || null;
    if (typeof scroller === 'string') scroller = document.querySelector(scroller);

    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;

    const ctx = gsap.context(() => {
      const targets = stagger > 0 && el.children.length ? Array.from(el.children) : [el];
      const horizontal = direction === 'horizontal';
      const axis = horizontal ? 'x' : 'y';
      const sign = reverse ? -1 : 1;
      const mask = WIPES[wipe];

      gsap.set(el, { visibility: 'visible' });

      if (reduce) {
        callbacksRef.current.onComplete?.();
        return;
      }

      const from = {
        [axis]: distance * sign,
        scale,
        opacity: animateOpacity ? initialOpacity : 1
      };
      const to = {
        [axis]: 0,
        scale: 1,
        opacity: 1,
        duration,
        ease
      };

      if (blur > 0) {
        from.filter = `blur(${blur}px)`;
        to.filter = 'blur(0px)';
      }
      if (rotate) {
        from.rotation = rotate * sign;
        to.rotation = 0;
      }
      if (tilt) {
        const tiltAxis = horizontal ? 'rotationY' : 'rotationX';
        from[tiltAxis] = horizontal ? -tilt * sign : tilt * sign;
        to[tiltAxis] = 0;
        from.transformPerspective = 900;
        to.transformPerspective = 900;
      }
      if (mask) {
        gsap.set(targets, { maskImage: mask, webkitMaskImage: mask });
        from['--ac-wipe'] = 0;
        to['--ac-wipe'] = 1;
      }
      if (stagger > 0) to.stagger = { each: stagger, from: staggerFrom };

      const settle = () => {
        if (scrub) return;
        gsap.set(targets, { clearProps: mask ? 'filter,transform,maskImage,webkitMaskImage' : 'filter,transform' });
      };

      const disappear = () => {
        if (disappearAfter <= 0) return;
        const out = {
          [axis]: -distance * sign,
          scale: 0.8,
          opacity: animateOpacity ? initialOpacity : 0,
          delay: disappearAfter,
          duration: disappearDuration,
          ease: disappearEase,
          onComplete: () => callbacksRef.current.onDisappearanceComplete?.()
        };
        if (blur > 0) out.filter = `blur(${blur}px)`;
        if (stagger > 0) out.stagger = { each: stagger, from: staggerFrom };
        gsap.to(targets, out);
      };

      const tl = gsap.timeline({
        paused: true,
        onStart: () => callbacksRef.current.onStart?.(),
        onComplete: () => {
          callbacksRef.current.onComplete?.();
          settle();
          if (once && !scrub) disappear();
        }
      });
      tl.fromTo(targets, from, to, scrub ? 0 : Math.max(delay, 0));

      if (trigger === 'mount') {
        tl.play();
        return;
      }

      const start = `top ${(1 - threshold) * 100}%`;

      if (scrub) {
        ScrollTrigger.create({
          trigger: el,
          scroller,
          start,
          end: `top ${Math.max((1 - threshold) * 100 - 45, 5)}%`,
          scrub: scrub === true ? true : Math.max(Number(scrub) || 0, 0.01),
          animation: tl
        });
        return;
      }

      ScrollTrigger.create({
        trigger: el,
        scroller,
        start,
        once,
        onEnter: () => tl.play(),
        onLeaveBack: once
          ? undefined
          : () => {
              if (mask) gsap.set(targets, { maskImage: mask, webkitMaskImage: mask });
              tl.reverse();
            }
      });
    }, el);

    return () => ctx.revert();
  }, [
    container,
    distance,
    direction,
    reverse,
    duration,
    ease,
    initialOpacity,
    animateOpacity,
    scale,
    blur,
    rotate,
    tilt,
    wipe,
    threshold,
    delay,
    stagger,
    staggerFrom,
    trigger,
    once,
    scrub,
    disappearAfter,
    disappearDuration,
    disappearEase
  ]);

  return (
    <div ref={ref} className={className} style={{ visibility: 'hidden', ...style }} {...props}>
      {children}
    </div>
  );
};

export default AnimatedContent;
