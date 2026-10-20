"use client";

import { useId } from "react";
import { treeBranches, treeLeaves, type TreeLobe } from "@/data/tree";
import { cn } from "@/lib/cn";

const LOBES = ["left", "center", "right"] as const;

type Props = {
  activeLobe?: TreeLobe | null;
  dimInactive?: boolean;
  showGround?: boolean;
  className?: string;
};

export function SpaceTree({
  activeLobe = null,
  dimInactive = false,
  showGround = true,
  className,
}: Props) {
  const rawId = useId();
  const uid = rawId.replace(/:/g, "");
  const branchGradient = `tree-branch-${uid}`;
  const leafGradient = `tree-leaf-${uid}`;
  const glowGradient = `tree-glow-${uid}`;

  const opacityFor = (lobe: TreeLobe) =>
    activeLobe && dimInactive && lobe !== activeLobe ? 0.16 : 1;

  return (
    <svg
      viewBox="0 0 900 720"
      className={cn("space-tree h-auto w-full", className)}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id={branchGradient} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8FD35A" />
          <stop offset="42%" stopColor="#2F9C66" />
          <stop offset="78%" stopColor="#0B8170" />
          <stop offset="100%" stopColor="#1C469E" />
        </linearGradient>
        <linearGradient id={leafGradient} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#B5E36D" />
          <stop offset="52%" stopColor="#6DBD25" />
          <stop offset="100%" stopColor="#0B8170" />
        </linearGradient>
        <radialGradient id={glowGradient} cx="50%" cy="38%" r="62%">
          <stop offset="0%" stopColor="#6DBD25" stopOpacity="0.22" />
          <stop offset="60%" stopColor="#0B8170" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#0B8170" stopOpacity="0" />
        </radialGradient>
      </defs>

      <ellipse cx="450" cy="300" rx="370" ry="290" fill={`url(#${glowGradient})`} />

      {showGround ? (
        <>
          <path
            d="M210 651 C310 640 590 640 690 651"
            fill="none"
            stroke="#EAB749"
            strokeWidth="2.4"
            strokeLinecap="round"
            opacity="0.55"
          />
          <path
            d="M245 657 C340 649 560 649 655 657"
            fill="none"
            stroke="#6DBD25"
            strokeWidth="1.4"
            strokeLinecap="round"
            opacity="0.35"
          />
        </>
      ) : null}

      <g
        className="space-tree-branches"
        fill="none"
        stroke={`url(#${branchGradient})`}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {treeBranches.map((branch, index) => {
          const [x1, y1, x2, y2, width, lobeIndex] = branch;
          const lobe = LOBES[lobeIndex];
          return (
            <line
              key={`b-${index}`}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              strokeWidth={width}
              data-lobe={lobe}
              style={{
                opacity: opacityFor(lobe),
                transition: "opacity 320ms ease",
              }}
            />
          );
        })}
      </g>

      <g className="space-tree-leaves" fill={`url(#${leafGradient})`}>
        {treeLeaves.map((leaf, index) => {
          const [x, y, rx, ry, angle, lobeIndex] = leaf;
          const lobe = LOBES[lobeIndex];
          return (
            <ellipse
              key={`l-${index}`}
              cx={x}
              cy={y}
              rx={rx}
              ry={ry}
              transform={`rotate(${angle} ${x} ${y})`}
              data-lobe={lobe}
              className="space-leaf"
              style={{
                opacity: opacityFor(lobe),
                transitionDelay: `${Math.min(index * 2, 900)}ms`,
              }}
            />
          );
        })}
      </g>
    </svg>
  );
}
