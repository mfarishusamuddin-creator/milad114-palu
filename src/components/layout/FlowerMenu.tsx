import * as React from "react";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { Link } from "react-router-dom";
import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

export interface FlowerMenuItem {
  icon: LucideIcon;
  /** Navigation target. Omit and use onSelect for an action item instead (e.g. "Tambah File"). */
  href?: string;
  label: string;
  key?: string;
  internal?: boolean;
  /** Fires on click for action items that don't navigate anywhere. */
  onSelect?: () => void;
}

interface FlowerMenuProps extends React.HTMLAttributes<HTMLElement> {
  menuItems: FlowerMenuItem[];
  iconColor?: string;
  backgroundColor?: string;
  animationDuration?: number;
  togglerSize?: number;
  petalGap?: number;
  triggerLabel?: string;
  menuLabel?: string;
}

function MenuToggler({
  isOpen,
  onToggle,
  backgroundColor,
  iconColor,
  animationDuration,
  togglerSize,
  iconSize,
  controlsId,
  triggerLabel,
  buttonRef,
}: {
  isOpen: boolean;
  onToggle: () => void;
  backgroundColor: string;
  iconColor: string;
  animationDuration: number;
  togglerSize: number;
  iconSize: number;
  controlsId: string;
  triggerLabel: string;
  buttonRef: React.RefObject<HTMLButtonElement | null>;
}) {
  const lineHeight = Math.max(2, iconSize * 0.1);
  const lineWidth = iconSize * 0.8;
  const lineSpacing = iconSize * 0.25;

  return (
    <button
      ref={buttonRef}
      type="button"
      className="absolute inset-0 z-20 m-auto flex touch-manipulation cursor-pointer items-center justify-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      style={{ backgroundColor, color: iconColor, width: togglerSize, height: togglerSize }}
      aria-expanded={isOpen}
      aria-haspopup="menu"
      aria-controls={controlsId}
      aria-label={isOpen ? "Tutup menu" : triggerLabel}
      onClick={onToggle}
    >
      <span
        aria-hidden="true"
        className="relative flex flex-col items-center justify-center"
        style={{ width: iconSize, height: iconSize }}
      >
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className={cn(
              "absolute bg-current transition-[transform,opacity] ease-out",
              isOpen && i === 0 && "opacity-0",
              isOpen && i === 1 && "rotate-45",
              isOpen && i === 2 && "-rotate-45",
            )}
            style={{
              transitionDuration: `${Math.min(animationDuration, 180)}ms`,
              width: lineWidth,
              height: lineHeight,
              top: isOpen
                ? `calc(50% - ${lineHeight / 2}px)`
                : `calc(50% + ${(i - 1) * lineSpacing}px - ${lineHeight / 2}px)`,
            }}
          />
        ))}
      </span>
    </button>
  );
}

// CUSTOMIZE per-page: each panel that uses this picks its own menuItems —
// FlowerMenu config is intentionally per-page, not a global setting (per
// roadmap 12.11).
export function FlowerMenu({
  menuItems,
  iconColor = "var(--primary-foreground)",
  backgroundColor = "var(--foreground)",
  animationDuration = 220,
  togglerSize = 44,
  petalGap = 28,
  triggerLabel = "Buka menu aksi",
  menuLabel = "Menu",
  className,
  ...props
}: FlowerMenuProps) {
  const menuId = useId();
  const rootRef = useRef<HTMLElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const itemRefs = useRef<Array<HTMLAnchorElement | HTMLButtonElement | null>>([]);
  const [isOpen, setIsOpen] = useState(false);

  const itemCount = menuItems.length;
  const safeTogglerSize = Math.max(44, togglerSize);
  const itemSize = safeTogglerSize;
  const iconSize = Math.max(20, Math.floor(safeTogglerSize * 0.45));
  const orbitRadius = itemSize + petalGap;
  const containerSize = (orbitRadius + itemSize / 2) * 2 + 8;

  const close = useCallback(() => {
    setIsOpen(false);
    triggerRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const onPointerDown = (event: PointerEvent) => {
      if (rootRef.current?.contains(event.target as Node)) return;
      setIsOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [isOpen]);

  const onMenuKeyDown = (event: React.KeyboardEvent<HTMLUListElement>) => {
    if (event.key === "Escape") {
      event.preventDefault();
      close();
    }
  };

  return (
    <nav
      ref={rootRef}
      aria-label={menuLabel}
      className={cn("relative", className)}
      style={{ width: containerSize, height: containerSize, minHeight: containerSize }}
      {...props}
    >
      <MenuToggler
        isOpen={isOpen}
        onToggle={() => setIsOpen((v) => !v)}
        backgroundColor={backgroundColor}
        iconColor={iconColor}
        animationDuration={animationDuration}
        togglerSize={safeTogglerSize}
        iconSize={iconSize}
        controlsId={menuId}
        triggerLabel={triggerLabel}
        buttonRef={triggerRef}
      />

      <ul
        id={menuId}
        role="menu"
        onKeyDown={onMenuKeyDown}
        className="absolute inset-0 m-0 list-none p-0"
      >
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          const angle = (360 / itemCount) * index;
          const openDelay = 10 + index * 20;
          const closeDelay = (itemCount - 1 - index) * 14;
          const commonProps = {
            role: "menuitem" as const,
            "aria-label": item.label,
            tabIndex: isOpen ? 0 : -1,
            className: cn(
              "flex size-full touch-manipulation items-center justify-center rounded-full transition-all duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring active:scale-95 hover:scale-110",
              isOpen ? "opacity-100" : "opacity-0",
            ),
            style: { backgroundColor, color: iconColor, transform: `rotate(-${angle}deg)` },
          };

          return (
            <li
              key={item.key ?? item.href ?? item.label}
              role="none"
              className={cn(
                "flower-petal pointer-events-none absolute inset-0 m-auto opacity-0 transition-[transform,opacity] ease-[cubic-bezier(0.2,0,0,1)]",
                isOpen && "pointer-events-auto opacity-100",
              )}
              style={{
                width: itemSize,
                height: itemSize,
                transitionDuration: `${animationDuration}ms`,
                transitionDelay: isOpen ? `${openDelay}ms` : `${closeDelay}ms`,
                transform: isOpen
                  ? `rotate(${angle}deg) translateX(-${orbitRadius}px) scale(1)`
                  : "rotate(0deg) translateX(0) scale(0.72)",
              }}
            >
              {item.onSelect ? (
                <button
                  type="button"
                  ref={(node) => {
                    itemRefs.current[index] = node;
                  }}
                  onClick={() => {
                    setIsOpen(false);
                    item.onSelect?.();
                  }}
                  {...commonProps}
                >
                  <span className="sr-only">{item.label}</span>
                  <Icon aria-hidden="true" style={{ width: iconSize, height: iconSize }} />
                </button>
              ) : item.internal ? (
                <Link
                  ref={(node) => {
                    itemRefs.current[index] = node;
                  }}
                  to={item.href ?? "#"}
                  onClick={() => setIsOpen(false)}
                  {...commonProps}
                >
                  <span className="sr-only">{item.label}</span>
                  <Icon aria-hidden="true" style={{ width: iconSize, height: iconSize }} />
                </Link>
              ) : (
                <a
                  ref={(node) => {
                    itemRefs.current[index] = node;
                  }}
                  href={item.href ?? "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setIsOpen(false)}
                  {...commonProps}
                >
                  <span className="sr-only">{item.label}</span>
                  <Icon aria-hidden="true" style={{ width: iconSize, height: iconSize }} />
                </a>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
