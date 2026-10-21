'use client';

import AnimatedContent from './AnimatedContent';

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
  delay?: number;
  trigger?: 'scroll' | 'mount';
};

export function Reveal({
  children,
  className,
  stagger = 0.08,
  delay = 0,
  trigger = 'scroll',
}: RevealProps) {
  return (
    <AnimatedContent
      distance={48}
      direction="vertical"
      duration={0.8}
      ease="power3.out"
      initialOpacity={0}
      animateOpacity
      threshold={0.12}
      once
      stagger={stagger}
      delay={delay}
      trigger={trigger}
      className={className}
    >
      {children}
    </AnimatedContent>
  );
}
