import { Scale } from 'lucide-react';
import * as React from 'react';

export function Logo() {
  return (
    <div className="flex items-center gap-2" aria-label="JusticeLens logo">
      <Scale className="h-7 w-7 text-primary" />
      <span className="text-xl font-bold tracking-tight text-foreground">
        JusticeLens
      </span>
    </div>
  );
}
