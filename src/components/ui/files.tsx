import * as React from "react";
import { createContext, useContext, useState } from "react";
import { File as FileIconLucide, Folder, FolderOpen } from "lucide-react";

import { cn } from "@/lib/utils";

type GitStatus = "untracked" | "modified" | "deleted";

interface FilesContextValue {
  openSet: Set<string>;
  toggle: (value: string) => void;
}
const FilesContext = createContext<FilesContextValue | null>(null);
const FolderValueContext = createContext<string>("");

function statusColor(status?: GitStatus) {
  return cn(
    status === "untracked" && "text-emerald-400",
    status === "modified" && "text-amber-400",
    status === "deleted" && "text-red-400",
  );
}
function statusDot(status?: GitStatus) {
  return cn(
    status === "untracked" && "bg-emerald-400",
    status === "modified" && "bg-amber-400",
    status === "deleted" && "bg-red-400",
  );
}

export interface FilesProps {
  children: React.ReactNode;
  defaultOpen?: string[];
  className?: string;
}
export function Files({ children, defaultOpen = [], className }: FilesProps) {
  const [openSet, setOpenSet] = useState<Set<string>>(new Set(defaultOpen));
  function toggle(value: string) {
    setOpenSet((prev) => {
      const next = new Set(prev);
      if (next.has(value)) next.delete(value);
      else next.add(value);
      return next;
    });
  }
  return (
    <FilesContext.Provider value={{ openSet, toggle }}>
      <div className={cn("flex flex-col gap-0.5", className)}>{children}</div>
    </FilesContext.Provider>
  );
}
export const SubFiles = Files;

export function FolderItem({ value, children }: { value: string; children: React.ReactNode }) {
  return <FolderValueContext.Provider value={value}>{children}</FolderValueContext.Provider>;
}

export interface FolderTriggerProps {
  children: React.ReactNode;
  gitStatus?: GitStatus;
  className?: string;
  onClick?: () => void;
}
export function FolderTrigger({ children, gitStatus, className, onClick }: FolderTriggerProps) {
  const ctx = useContext(FilesContext);
  const value = useContext(FolderValueContext);
  const isOpen = ctx?.openSet.has(value) ?? false;
  return (
    <button
      type="button"
      onClick={() => {
        ctx?.toggle(value);
        onClick?.();
      }}
      className={cn(
        "flex w-full items-center justify-between gap-2 rounded-lg p-2 text-sm hover:bg-foreground/5",
        className,
      )}
    >
      <span className={cn("flex min-w-0 items-center gap-2", statusColor(gitStatus))}>
        {isOpen ? <FolderOpen size={16} className="shrink-0" /> : <Folder size={16} className="shrink-0" />}
        <span className="line-clamp-2 break-words text-left">{children}</span>
      </span>
      {gitStatus && <span className={cn("size-2 shrink-0 rounded-full", statusDot(gitStatus))} />}
    </button>
  );
}

export function FolderPanel({ children }: { children: React.ReactNode }) {
  const ctx = useContext(FilesContext);
  const value = useContext(FolderValueContext);
  if (!ctx?.openSet.has(value)) return null;
  return (
    <div className="relative ml-5 before:absolute before:inset-y-0 before:-left-2 before:w-px before:bg-border">
      {children}
    </div>
  );
}

export interface FileItemProps {
  icon?: React.ElementType;
  gitStatus?: GitStatus;
  children: React.ReactNode;
  onClick?: () => void;
}
export function FileItem({ icon: Icon = FileIconLucide, gitStatus, children, onClick }: FileItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-2 rounded-lg p-2 text-left text-sm hover:bg-foreground/5",
        statusColor(gitStatus),
      )}
    >
      <Icon className="size-4 shrink-0" />
      <span className="line-clamp-2 break-words">{children}</span>
    </button>
  );
}
