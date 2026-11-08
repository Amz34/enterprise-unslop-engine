/**
 * Zero-Slop Enterprise Component Library (React / JSX Components)
 * Guarantees zero AI slop, quiet chrome, deliberate spacing, and restrained typography.
 */

import React from 'react';

/**
 * Clean Header & Navigation - Zero emoji clutter, zero purple gradient
 */
export function QuietNavbar({ logoText, links = [], actionText, onAction }) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border-subtle bg-canvas/90 backdrop-blur-md px-6 py-3.5">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-6 w-6 rounded-craft-sm bg-accent flex items-center justify-center text-xs font-bold text-white shadow-craft-sm">
            {logoText.slice(0, 1)}
          </div>
          <span className="text-sm font-semibold tracking-tight text-text-primary">{logoText}</span>
        </div>
        <nav className="flex items-center gap-6 text-sm text-text-secondary">
          {links.map((link, i) => (
            <a key={i} href={link.href} className="hover:text-text-primary transition-colors">
              {link.label}
            </a>
          ))}
        </nav>
        {actionText && (
          <button
            onClick={onAction}
            className="rounded-craft-sm bg-text-primary px-3.5 py-1.5 text-xs font-medium text-canvas hover:bg-white transition-all shadow-craft-sm"
          >
            {actionText}
          </button>
        )}
      </div>
    </header>
  );
}

/**
 * Metric & Telemetry Card - Structured typography, calm background, real information hierarchy
 */
export function CraftMetricCard({ label, value, delta, deltaType = 'positive', subtitle }) {
  const isPositive = deltaType === 'positive';
  return (
    <div className="rounded-craft-md border border-border-subtle bg-canvas-subtle p-5 shadow-craft-sm hover:border-border-strong transition-colors">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-text-muted">{label}</span>
        {delta && (
          <span className={`text-xs font-semibold ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
            {isPositive ? '+' : ''}{delta}
          </span>
        )}
      </div>
      <div className="mt-2 text-2xl font-bold tracking-tight text-text-primary">{value}</div>
      {subtitle && <p className="mt-1 text-xs text-text-secondary">{subtitle}</p>}
    </div>
  );
}

/**
 * Primary CTA Button - Tactile, restrained, no pulsing glow
 */
export function CraftButton({ children, variant = 'primary', size = 'md', ...props }) {
  const base = "inline-flex items-center justify-center font-medium transition-all focus:outline-none focus:ring-2 focus:ring-accent";
  const variants = {
    primary: "bg-text-primary text-canvas hover:bg-white shadow-craft-sm",
    secondary: "border border-border-strong bg-canvas-subtle text-text-primary hover:bg-canvas-muted shadow-craft-sm",
    accent: "bg-accent text-white hover:bg-accent-hover shadow-craft-sm"
  };
  const sizes = {
    sm: "px-3 py-1.5 text-xs rounded-craft-sm",
    md: "px-4 py-2 text-sm rounded-craft-md",
    lg: "px-5 py-2.5 text-base rounded-craft-lg"
  };

  return (
    <button className={`${base} ${variants[variant]} ${sizes[size]}`} {...props}>
      {children}
    </button>
  );
}
