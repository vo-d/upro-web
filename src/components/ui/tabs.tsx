"use client";

import { ReactNode } from "react";

interface TabsProps {
  children: ReactNode;
  defaultValue: string;
  className?: string;
}

interface TabsListProps {
  children: ReactNode;
  className?: string;
}

interface TabsTriggerProps {
  children: ReactNode;
  value: string;
  isActive: boolean;
  onClick: (value: string) => void;
  className?: string;
}

interface TabsContentProps {
  children: ReactNode;
  value: string;
  activeValue: string;
  className?: string;
}

export function Tabs({ children, className = "" }: TabsProps) {
  return <div className={className}>{children}</div>;
}

export function TabsList({ children, className = "" }: TabsListProps) {
  return (
    <div
      className={`inline-flex h-12 items-center justify-center rounded-lg bg-gray-100 p-1 text-gray-600 w-full ${className}`}
    >
      {children}
    </div>
  );
}

export function TabsTrigger({
  children,
  value,
  isActive,
  onClick,
  className = "",
}: TabsTriggerProps) {
  return (
    <button
      className={`inline-flex items-center justify-center whitespace-nowrap rounded-md px-4 py-2.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 w-full ${
        isActive
          ? "bg-white text-gray-900 shadow-sm border border-gray-200"
          : "hover:bg-gray-200/50 text-gray-600 hover:text-gray-900"
      } ${className}`}
      onClick={() => onClick(value)}
      type="button"
    >
      {children}
    </button>
  );
}

export function TabsContent({
  children,
  value,
  activeValue,
  className = "",
}: TabsContentProps) {
  if (value !== activeValue) return null;

  return (
    <div
      className={`mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${className}`}
    >
      {children}
    </div>
  );
}
