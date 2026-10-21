## Integrate the <GradualBlur /> component from React Bits

You are helping integrate an open-source React component into an existing application.

### Component: GradualBlur
### Variant: JavaScript + CSS


---

### Usage Example
```jsx
// Component added by Ansh - github.com/ansh-dhanani

import GradualBlur from './GradualBlur';

<section style={{ position: 'relative', height: 500, overflow: 'hidden' }}>
  <div style={{ height: '100%', overflowY: 'auto' }}>
    {/* Scrolling content */}
  </div>

  <GradualBlur
    position="bottom"
    height="6rem"
    strength={2}
    layers={8}
    curve="linear"
    exponential
    tint="rgba(18, 15, 23, 0.6)"
    autoHide
  />
</section>
```

### Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| position | 'top' | 'bottom' | 'left' | 'right' | 'bottom' | Edge the blur grows toward. |
| target | 'parent' | 'page' | 'parent' | Sit inside the nearest positioned parent, or stay fixed to the edge of the viewport. |
| height | string | number | '6rem' | How far the blur reaches in from the edge. For left and right this is its width. Numbers are px. |
| width | string | number | - | For top and bottom, a narrower centered band. For left and right, overrides height. |
| strength | number | 2 | How blurry the very edge gets. Each step adds about 12px of blur. |
| layers | number | 8 | Blur layers stacked across the ramp. More layers give a smoother falloff, fewer show visible steps. |
| curve | 'linear' | 'bezier' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'linear' | How the blur builds across the ramp. bezier is a smooth S-curve. |
| exponential | boolean | true | Doubles the blur toward the edge so it starts gently. Turn off for an even ramp. |
| opacity | number | 1 | Opacity of the blur layers. Lower values let the sharp content show through. |
| saturation | number | 1 | Color boost of the blurred content, building toward the edge, for a glassy look. |
| tint | string | 'transparent' | Color the content fades into at the edge, such as your page background. Use rgba for a lighter wash. |
| autoHide | boolean | false | Fades the blur out when the scroll container reaches this edge, so it only shows while there is more to scroll. |
| container | string | HTMLElement | RefObject | - | Scroll container watched by autoHide. Defaults to a scrollable sibling or the parent, or the page when target is page. |
| hoverIntensity | number | 1 | Multiplies the blur while the cursor is over it. 0 clears it on hover, 2 doubles it. |
| duration | number | string | 0.3 | Length of the hover and autoHide transitions, in seconds or as a CSS time. |
| easing | string | 'ease-out' | CSS easing of those transitions. |
| zIndex | number | 1000 | Stacking order of the overlay. |
| className | string | '' | Extra class names for the overlay. |
| style | CSSProperties | - | Inline styles for the overlay. |

### Full Component Source
```jsx
'use client';

import { useEffect, useLayoutEffect, useMemo, useRef } from 'react';

import './GradualBlur.css';

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

const CURVES = {
  linear: t => t,
  bezier: t => t * t * (3 - 2 * t),
  'ease-in': t => t * t,
  'ease-out': t => 1 - (1 - t) * (1 - t),
  'ease-in-out': t => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2)
};

const DIRECTIONS = { top: 'to top', bottom: 'to bottom', left: 'to left', right: 'to right' };

const clamp01 = value => Math.min(Math.max(value, 0), 1);

const toLength = value => (typeof value === 'number' ? `${value}px` : value);

const toTime = value => (typeof value === 'number' ? `${value}s` : value);

const findScroller = (container, root, target, vertical) => {
  if (container) {
    if (typeof container === 'string') return document.querySelector(container);
    return 'current' in container ? container.current : container;
  }
  if (target === 'page') return window;
  const parent = root.parentElement;
  if (!parent) return null;
  const scrolls = node => {
    const style = getComputedStyle(node);
    return /(auto|scroll|overlay)/.test(vertical ? style.overflowY : style.overflowX);
  };
  const sibling = Array.from(parent.children).find(child => child !== root && scrolls(child));
  return sibling || (scrolls(parent) ? parent : null);
};

const GradualBlur = ({
  position = 'bottom',
  target = 'parent',
  height = '6rem',
  width,
  strength = 2,
  layers = 8,
  curve = 'linear',
  exponential = true,
  opacity = 1,
  saturation = 1,
  tint = 'transparent',
  autoHide = false,
  container,
  hoverIntensity = 1,
  duration = 0.3,
  easing = 'ease-out',
  zIndex = 1000,
  className = '',
  style
}) => {
  const rootRef = useRef(null);
  const edge = DIRECTIONS[position] ? position : 'bottom';
  const vertical = edge === 'top' || edge === 'bottom';

  const stack = useMemo(() => {
    const count = Math.min(Math.max(Math.round(layers) || 1, 1), 16);
    const shape = CURVES[curve] || CURVES.linear;
    const maxBlur = Math.max(strength, 0) * 12;
    const level = u => {
      const t = shape(clamp01(u));
      return maxBlur * (exponential ? (Math.pow(2, 4 * t) - 1) / 15 : t);
    };
    const boost = Math.pow(Math.max(saturation, 0), 1 / count);
    const fade = `${toTime(duration)} ${easing}`;
    const direction = DIRECTIONS[edge];
    const steps = [];
    for (let i = 0; i < count; i++) {
      const from = level(i / count);
      const to = level((i + 1) / count);
      const radius = Math.sqrt(Math.max(to * to - from * from, 0));
      const filter = [
        `blur(calc(${radius.toFixed(3)}px * var(--gradual-blur-reveal, 1) * var(--gradual-blur-hover, 1)))`,
        boost !== 1 ? `saturate(calc(1 + ${(boost - 1).toFixed(4)} * var(--gradual-blur-reveal, 1)))` : ''
      ]
        .filter(Boolean)
        .join(' ');
      const mask = `linear-gradient(${direction}, transparent ${((i / count) * 100).toFixed(2)}%, #000 ${(((i + 1) / count) * 100).toFixed(2)}%)`;
      steps.push({
        position: 'absolute',
        inset: 0,
        borderRadius: 'inherit',
        backdropFilter: filter,
        WebkitBackdropFilter: filter,
        maskImage: mask,
        WebkitMaskImage: mask,
        opacity,
        transition: `backdrop-filter ${fade}, -webkit-backdrop-filter ${fade}`
      });
    }
    const stops = Array.from({ length: 9 }, (_, k) => {
      const u = k / 8;
      const t = shape(u);
      const alpha = t * t * t * (t * (t * 6 - 15) + 10);
      return `rgba(0, 0, 0, ${alpha.toFixed(3)}) ${(u * 100).toFixed(1)}%`;
    }).join(', ');
    const tintMask = `linear-gradient(${direction}, ${stops})`;
    const wash =
      tint && tint !== 'transparent'
        ? {
            position: 'absolute',
            inset: 0,
            borderRadius: 'inherit',
            background: tint,
            maskImage: tintMask,
            WebkitMaskImage: tintMask,
            opacity: 'calc(var(--gradual-blur-reveal, 1) * min(var(--gradual-blur-hover, 1), 1))',
            transition: `opacity ${fade}`
          }
        : null;
    return { steps, wash };
  }, [layers, curve, strength, exponential, saturation, duration, easing, edge, opacity, tint]);

  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;
    if (!autoHide) {
      root.style.removeProperty('--gradual-blur-reveal');
      return undefined;
    }
    const scroller = findScroller(container, root, target, vertical);
    if (!scroller) return undefined;
    const element = scroller instanceof Element ? scroller : null;
    const start = edge === 'top' || edge === 'left';

    const update = () => {
      const page = document.documentElement;
      const offset = element
        ? vertical
          ? element.scrollTop
          : element.scrollLeft
        : vertical
          ? window.scrollY
          : window.scrollX;
      const limit = element
        ? vertical
          ? element.scrollHeight - element.clientHeight
          : element.scrollWidth - element.clientWidth
        : vertical
          ? page.scrollHeight - window.innerHeight
          : page.scrollWidth - window.innerWidth;
      const box = root.getBoundingClientRect();
      const reach = Math.max(vertical ? box.height : box.width, 1);
      const room = start ? offset : limit - offset;
      root.style.setProperty('--gradual-blur-reveal', clamp01(room / reach).toFixed(3));
    };

    update();
    const source = element ?? window;
    source.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    const observer = element && typeof ResizeObserver !== 'undefined' ? new ResizeObserver(update) : null;
    if (observer && element) {
      observer.observe(element);
      if (element.firstElementChild) observer.observe(element.firstElementChild);
    }
    return () => {
      source.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
      observer?.disconnect();
    };
  }, [autoHide, container, target, edge, vertical]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || hoverIntensity === 1) return undefined;
    let frame = 0;
    let inside = false;
    let point = null;

    const check = () => {
      frame = 0;
      if (!point) return;
      const box = root.getBoundingClientRect();
      const now = point.x >= box.left && point.x <= box.right && point.y >= box.top && point.y <= box.bottom;
      if (now === inside) return;
      inside = now;
      root.style.setProperty('--gradual-blur-hover', inside ? String(Math.max(hoverIntensity, 0)) : '1');
    };

    const onMove = event => {
      point = { x: event.clientX, y: event.clientY };
      if (!frame) frame = requestAnimationFrame(check);
    };

    const onLeave = () => {
      point = null;
      inside = false;
      root.style.setProperty('--gradual-blur-hover', '1');
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    document.documentElement.addEventListener('pointerleave', onLeave);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('pointermove', onMove);
      document.documentElement.removeEventListener('pointerleave', onLeave);
      root.style.removeProperty('--gradual-blur-hover');
    };
  }, [hoverIntensity]);

  const depth = toLength(vertical ? height : (width ?? height));
  const span = vertical && width != null ? toLength(width) : null;

  const rounded = target !== 'page' && !span;
  const corner = (a, b) => (rounded && (edge === a || edge === b) ? 'inherit' : undefined);

  const rootStyle = {
    position: target === 'page' ? 'fixed' : 'absolute',
    zIndex,
    borderTopLeftRadius: corner('top', 'left'),
    borderTopRightRadius: corner('top', 'right'),
    borderBottomLeftRadius: corner('bottom', 'left'),
    borderBottomRightRadius: corner('bottom', 'right'),
    top: edge === 'bottom' ? undefined : 0,
    bottom: edge === 'top' ? undefined : 0,
    left: edge === 'right' ? undefined : 0,
    right: edge === 'left' ? undefined : 0,
    height: vertical ? depth : undefined,
    width: vertical ? (span ?? undefined) : depth,
    marginInline: span ? 'auto' : undefined,
    ...style
  };

  return (
    <div ref={rootRef} className={`gradual-blur ${className}`.trim()} style={rootStyle} aria-hidden="true">
      {stack.steps.map((layer, index) => (
        <div key={index} style={layer} />
      ))}
      {stack.wash && <div style={stack.wash} />}
    </div>
  );
};

export default GradualBlur;

```

### Component CSS
```css
.gradual-blur {
  pointer-events: none;
}

```

### Integration Instructions
1. Install any listed dependencies.
2. Copy the component source into the appropriate directory in the project.
3. Import the CSS file alongside the component.
4. Import and render the component using the usage example above as a starting point.
5. Adjust props as needed for the specific use case — refer to the props table for all available options.

### More from React Bits
The full library index, including everything reactbits.dev offers, is at https://reactbits.dev/llms.txt — fetch it if this component is not the right fit or the project needs more pieces.
