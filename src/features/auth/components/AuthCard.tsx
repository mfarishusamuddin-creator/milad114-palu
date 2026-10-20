import type { ReactNode } from "react";
import { Link } from "react-router-dom";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface AuthCardProps {
  kicker: string;
  title: string;
  description: string;
  children: ReactNode;
  footer?: ReactNode;
}

export function AuthCard({ kicker, title, description, children, footer }: AuthCardProps) {
  return (
    <div className="relative grid min-h-screen place-items-center overflow-hidden bg-background px-5 pb-[60px] pt-[82px]">
      <Link
        to="/"
        aria-label="Kembali ke halaman utama"
        className="fixed left-7 top-6 z-10 inline-flex items-center gap-2 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-[rgba(238,248,245,0.68)] no-underline"
      >
        <span className="h-1.5 w-1.5 rounded-full bg-[#bffff5] shadow-[0_0_9px_#bffff5]" />
        Return
      </Link>

      <Card className="relative w-full max-w-[410px]">
        <CardHeader>
          <p className="m-0 mb-2.5 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-kicker">
            {kicker}
          </p>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-1">
          {children}
          {footer}
        </CardContent>
      </Card>

      <p className="fixed bottom-[22px] font-mono text-[9px] font-medium uppercase tracking-[0.11em] text-[rgba(181,212,207,0.43)]">
        Protected by Husam authentication service
      </p>
    </div>
  );
}
