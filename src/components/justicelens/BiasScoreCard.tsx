"use client";

import type { DetectBiasOutput } from "@/ai/flows/detect-bias";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ShieldAlert, ShieldCheck } from "lucide-react";

export function BiasScoreCard({ biasAnalysis }: { biasAnalysis: DetectBiasOutput }) {
  const { biasDetected, biasSummary } = biasAnalysis;

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle>Bias Detection Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div
          className={cn(
            "flex items-start sm:items-center gap-4 rounded-lg p-4",
            biasDetected
              ? "bg-destructive/10 text-destructive-foreground"
              : "bg-primary/10 text-primary-foreground"
          )}
        >
          {biasDetected ? (
            <ShieldAlert className="h-8 w-8 flex-shrink-0 text-destructive" />
          ) : (
            <ShieldCheck className="h-8 w-8 flex-shrink-0 text-primary" />
          )}
          <div>
            <h3 className="text-lg font-bold text-foreground">
              {biasDetected ? "Potential Bias Detected" : "No Significant Bias Detected"}
            </h3>
            <p className="text-sm text-muted-foreground">
              {biasDetected
                ? "Significant disparities were found in the data."
                : "Sentencing patterns appear within statistical norms."}
            </p>
          </div>
        </div>
        <div>
            <p className="font-semibold text-foreground mb-1">Analyst's Summary:</p>
            <p className="text-sm text-muted-foreground">{biasSummary}</p>
        </div>
      </CardContent>
    </Card>
  );
}
