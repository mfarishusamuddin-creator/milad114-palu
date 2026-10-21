    ## Integrate the <RotatingText /> component from React Bits

You are helping integrate an open-source React component into an existing application.

### Component: RotatingText
### Variant: JavaScript + CSS
### Dependencies: motion

---

### Usage Example
```jsx
import RotatingText from './RotatingText';

<RotatingText
  texts={['React', 'Bits', 'Is', 'Cool!']}
  effect="slide"
  direction="up"
  highlight={true}
  highlightColor="#a855f7"
  staggerFrom="last"
  staggerDuration={0.025}
  splitLevelClassName="overflow-hidden pb-0.5 sm:pb-1 md:pb-1"
  rotationInterval={2000}
/>
```

### Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| texts | string[] | [] | The texts to rotate through. |
| effect | 'slide' | 'flip' | 'blur' | 'scale' | 'drop' | "slide" | How letters swap. Flip rolls them over like a drum, blur dissolves them, scale zooms through and drop lets them fall in with a small bounce. |
| direction | 'up' | 'down' | "up" | Which way letters travel. Drop always falls from above. |
| highlight | boolean | false | Puts the rotating text on a colored block that smoothly resizes to fit each new text, with a text color picked for contrast. |
| highlightColor | string | "#a855f7" | Color of the highlight block. Hex or rgb colors also set a readable text color automatically. |
| rotationInterval | number | 2000 | Time each text stays on screen, in milliseconds. |
| blur | number | 0 | Blurs letters as they come and go, in px. The blur effect uses 10 when this is 0. |
| staggerDuration | number | 0 | Delay between letters, in seconds. |
| staggerFrom | 'first' | 'last' | 'center' | 'random' | number | "first" | Which letter moves first. A number starts from that letter, random shuffles the order. |
| splitBy | 'characters' | 'words' | 'lines' | string | "characters" | How each text is split into moving pieces. Any other string is used as the separator. |
| loop | boolean | true | Goes back to the first text after the last one. |
| auto | boolean | true | Rotates on its own. Turn off to drive it with the ref methods. |
| pauseOnHover | boolean | false | Holds the current text while the pointer is over it. |
| initial | object | - | Overrides the state each letter enters from. Leave unset to use the effect. |
| animate | object | - | Overrides the state each letter settles into. |
| exit | object | - | Overrides the state each letter leaves to. |
| transition | object | - | Overrides the Motion transition used for every letter. Each effect brings its own by default. |
| animatePresenceMode | 'wait' | 'sync' | "wait" | 'wait' lets the old text leave before the new one enters, 'sync' runs both at once. |
| animatePresenceInitial | boolean | false | Animates the first text in on mount. |
| onNext | (index: number) => void | undefined | Called with the new index whenever the text changes. |
| mainClassName | string | '' | Extra class names for the outer element. |
| splitLevelClassName | string | '' | Extra class names for each group of letters. Add overflow hidden here for a masked slide. |
| elementLevelClassName | string | '' | Extra class names for each moving letter. |

### Full Component Source
```jsx
'use client';

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import {
  motion,
  AnimatePresence,
  MotionConfig,
  animate as animateValue,
  useMotionValue,
  useReducedMotion
} from 'motion/react';

import './RotatingText.css';

function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

const segmenter =
  typeof Intl !== 'undefined' && Intl.Segmenter ? new Intl.Segmenter('en', { granularity: 'grapheme' }) : null;

const splitIntoCharacters = text =>
  segmenter ? Array.from(segmenter.segment(text), segment => segment.segment) : Array.from(text);

const withFilter = (state, filter) =>
  state && typeof state === 'object' && !Array.isArray(state) ? { ...state, filter } : state;

const LAYOUT_SPRING = { type: 'spring', damping: 25, stiffness: 300 };
const WIDTH_SPRING = { type: 'spring', damping: 34, stiffness: 320 };
const FLIP_STYLE = { transformOrigin: '50% 50% -0.45em', backfaceVisibility: 'hidden' };

const EFFECTS = {
  slide: up => ({
    initial: { y: up ? '100%' : '-100%', opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: up ? '-120%' : '120%', opacity: 0 },
    transition: { type: 'spring', damping: 25, stiffness: 300 }
  }),
  flip: up => ({
    initial: { rotateX: up ? -90 : 90, opacity: 0, transformPerspective: 480 },
    animate: { rotateX: 0, opacity: 1, transformPerspective: 480 },
    exit: { rotateX: up ? 90 : -90, opacity: 0, transformPerspective: 480 },
    transition: { type: 'tween', duration: 0.6, ease: [0.34, 1.4, 0.64, 1] },
    exitTransition: { type: 'tween', duration: 0.32, ease: [0.5, 0, 0.75, 0] }
  }),
  blur: up => ({
    initial: { y: up ? '45%' : '-45%', opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: up ? '-45%' : '45%', opacity: 0 },
    transition: { type: 'tween', duration: 0.55, ease: [0.22, 1, 0.36, 1] }
  }),
  scale: up => ({
    initial: { scale: up ? 0.35 : 1.7, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: up ? 1.7 : 0.35, opacity: 0 },
    transition: { type: 'spring', damping: 17, stiffness: 240 }
  }),
  drop: () => ({
    initial: { y: '-110%', opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: '110%', opacity: 0 },
    transition: { type: 'spring', damping: 18, stiffness: 320, mass: 0.9 },
    exitTransition: { type: 'tween', duration: 0.3, ease: [0.55, 0, 1, 0.45] }
  })
};

const readableText = color => {
  const value = String(color ?? '').trim();
  let rgb = null;
  const hex = value.match(/^#([0-9a-f]{3}|[0-9a-f]{4}|[0-9a-f]{6}|[0-9a-f]{8})$/i);
  if (hex) {
    const digits = hex[1].length < 6 ? [...hex[1].slice(0, 3)].map(c => c + c).join('') : hex[1].slice(0, 6);
    rgb = [0, 2, 4].map(i => parseInt(digits.slice(i, i + 2), 16));
  } else {
    const fn = value.match(/^rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)/i);
    if (fn) rgb = fn.slice(1, 4).map(Number);
  }
  if (!rgb) return undefined;
  const [r, g, b] = rgb.map(channel => {
    const c = Math.min(Math.max(channel / 255, 0), 1);
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b > 0.3 ? '#0b0b0c' : '#ffffff';
};

const RotatingText = forwardRef((props, ref) => {
  const {
    texts,
    transition,
    initial,
    animate,
    exit,
    effect = 'slide',
    direction = 'up',
    highlight = false,
    highlightColor = '#a855f7',
    animatePresenceMode = 'wait',
    animatePresenceInitial = false,
    rotationInterval = 2000,
    staggerDuration = 0,
    staggerFrom = 'first',
    loop = true,
    auto = true,
    pauseOnHover = false,
    blur = 0,
    splitBy = 'characters',
    onNext,
    onMouseEnter,
    onMouseLeave,
    mainClassName,
    splitLevelClassName,
    elementLevelClassName,
    style,
    ...rest
  } = props;

  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [hovered, setHovered] = useState(false);
  const indexRef = useRef(0);
  const onNextRef = useRef(onNext);
  onNextRef.current = onNext;

  const contentRef = useRef(null);
  const width = useMotionValue('auto');
  const reduceMotion = useReducedMotion();

  const lastIndex = Math.max(texts.length - 1, 0);
  const activeIndex = Math.min(currentTextIndex, lastIndex);

  const elements = useMemo(() => {
    const currentText = texts[activeIndex] ?? '';
    if (splitBy === 'characters') {
      const words = currentText.split(' ');
      return words.map((word, i) => ({
        characters: splitIntoCharacters(word),
        needsSpace: i !== words.length - 1
      }));
    }
    if (splitBy === 'words') {
      return currentText.split(' ').map((word, i, arr) => ({
        characters: [word],
        needsSpace: i !== arr.length - 1
      }));
    }
    if (splitBy === 'lines') {
      return currentText.split('\n').map((line, i, arr) => ({
        characters: [line],
        needsSpace: i !== arr.length - 1
      }));
    }

    return currentText.split(splitBy).map((part, i, arr) => ({
      characters: [part],
      needsSpace: i !== arr.length - 1
    }));
  }, [texts, activeIndex, splitBy]);

  const order = useMemo(() => {
    const total = elements.reduce((sum, word) => sum + word.characters.length, 0);
    const shuffled = Array.from({ length: total }, (_, i) => i).sort(() => Math.random() - 0.5);
    return { total, shuffled };
  }, [elements]);

  const getStaggerDelay = index => {
    const { total, shuffled } = order;
    if (staggerFrom === 'first') return index * staggerDuration;
    if (staggerFrom === 'last') return (total - 1 - index) * staggerDuration;
    if (staggerFrom === 'center') return Math.abs(Math.floor(total / 2) - index) * staggerDuration;
    if (staggerFrom === 'random') return shuffled[index] * staggerDuration;
    return Math.abs(staggerFrom - index) * staggerDuration;
  };

  const goTo = useCallback(index => {
    if (index === indexRef.current) return;
    indexRef.current = index;
    setCurrentTextIndex(index);
    onNextRef.current?.(index);
  }, []);

  const next = useCallback(() => {
    const current = Math.min(indexRef.current, lastIndex);
    goTo(current < lastIndex ? current + 1 : loop ? 0 : current);
  }, [lastIndex, loop, goTo]);

  const previous = useCallback(() => {
    const current = Math.min(indexRef.current, lastIndex);
    goTo(current > 0 ? current - 1 : loop ? lastIndex : current);
  }, [lastIndex, loop, goTo]);

  const jumpTo = useCallback(index => goTo(Math.max(0, Math.min(index, lastIndex))), [lastIndex, goTo]);

  const reset = useCallback(() => goTo(0), [goTo]);

  useImperativeHandle(
    ref,
    () => ({
      next,
      previous,
      jumpTo,
      reset
    }),
    [next, previous, jumpTo, reset]
  );

  const paused = pauseOnHover && hovered;

  useEffect(() => {
    if (!auto || paused) return;
    const timeoutId = setTimeout(next, rotationInterval);
    return () => clearTimeout(timeoutId);
  }, [next, rotationInterval, auto, paused, activeIndex]);

  useIsomorphicLayoutEffect(() => {
    const content = contentRef.current;
    if (!highlight || !content) {
      width.set('auto');
      return undefined;
    }
    let controls = null;
    let settled = false;
    const fit = () => {
      const target = content.offsetWidth + 1;
      controls?.stop();
      if (!settled || reduceMotion) {
        settled = true;
        width.set(target);
        return;
      }
      controls = animateValue(width, target, WIDTH_SPRING);
    };
    fit();
    const observer = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(fit) : null;
    observer?.observe(content);
    return () => {
      observer?.disconnect();
      controls?.stop();
    };
  }, [highlight, reduceMotion, width]);

  const handleMouseEnter = event => {
    if (pauseOnHover) setHovered(true);
    onMouseEnter?.(event);
  };

  const handleMouseLeave = event => {
    setHovered(false);
    onMouseLeave?.(event);
  };

  const motionPreset = (EFFECTS[effect] ?? EFFECTS.slide)(direction !== 'down');
  const blurAmount = blur > 0 ? blur : effect === 'blur' ? 10 : 0;
  const enterState = initial ?? motionPreset.initial;
  const restState = animate ?? motionPreset.animate;
  const leaveState = exit ?? motionPreset.exit;
  const charTransition = transition ?? motionPreset.transition;
  const exitTransition = transition || exit ? null : motionPreset.exitTransition;
  const enterFrom = blurAmount > 0 ? withFilter(enterState, `blur(${blurAmount}px)`) : enterState;
  const enterTo = blurAmount > 0 ? withFilter(restState, 'blur(0px)') : restState;
  const leaveTo = blurAmount > 0 ? withFilter(leaveState, `blur(${blurAmount}px)`) : leaveState;
  const charStyle = effect === 'flip' ? FLIP_STYLE : undefined;

  const blockStyle = highlight
    ? { ...style, width, backgroundColor: highlightColor, color: readableText(highlightColor) ?? style?.color }
    : style;

  const presence = (
    <AnimatePresence mode={animatePresenceMode} initial={animatePresenceInitial}>
      <motion.span
        key={activeIndex}
        className={cn(splitBy === 'lines' ? 'text-rotate-lines' : 'text-rotate')}
        layout={!highlight}
        aria-hidden="true"
      >
        {elements.map((wordObj, wordIndex, array) => {
          const previousCharsCount = array.slice(0, wordIndex).reduce((sum, word) => sum + word.characters.length, 0);
          return (
            <span key={wordIndex} className={cn('text-rotate-word', splitLevelClassName)}>
              {wordObj.characters.map((char, charIndex) => {
                const delay = getStaggerDelay(previousCharsCount + charIndex);
                return (
                  <motion.span
                    key={charIndex}
                    initial={enterFrom}
                    animate={enterTo}
                    exit={exitTransition ? { ...leaveTo, transition: { ...exitTransition, delay } } : leaveTo}
                    transition={{ ...charTransition, delay }}
                    className={cn('text-rotate-element', elementLevelClassName)}
                    style={charStyle}
                  >
                    {char}
                  </motion.span>
                );
              })}
              {wordObj.needsSpace && <span className="text-rotate-space"> </span>}
            </span>
          );
        })}
      </motion.span>
    </AnimatePresence>
  );

  return (
    <MotionConfig reducedMotion="user">
      <motion.span
        className={cn('text-rotate', highlight && 'text-rotate-highlight', mainClassName)}
        {...rest}
        style={blockStyle}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        layout={!highlight}
        transition={transition ?? LAYOUT_SPRING}
      >
        <span className="text-rotate-sr-only">{texts[activeIndex]}</span>
        {highlight ? (
          <span ref={contentRef} className="text-rotate-highlight-content">
            {presence}
          </span>
        ) : (
          presence
        )}
      </motion.span>
    </MotionConfig>
  );
});

RotatingText.displayName = 'RotatingText';
export default RotatingText;

```

### Component CSS
```css
.text-rotate {
  display: flex;
  flex-wrap: wrap;
  white-space: pre-wrap;
  position: relative;
}

.text-rotate-sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.text-rotate-word {
  display: inline-flex;
}

.text-rotate-lines {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.text-rotate-element {
  display: inline-block;
}

.text-rotate-space {
  white-space: pre;
}

.text-rotate-highlight {
  box-sizing: content-box;
  flex-wrap: nowrap;
  justify-content: center;
  overflow: hidden;
  padding: 0.1em 0.28em;
  border-radius: 0.16em;
}

.text-rotate-highlight-content {
  display: flex;
  flex-shrink: 0;
  white-space: pre;
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
