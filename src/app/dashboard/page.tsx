"use client";

import React, { useActionState } from "react";
import { DataUploadForm } from "@/components/justicelens/DataUploadForm";
import { ResultsDisplay } from "@/components/justicelens/ResultsDisplay";
import type { AnalysisState } from "./actions";
import { analyzeDocumentAction } from "./actions";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const initialState: AnalysisState = {};

export default function DashboardPage() {
  const [state, formAction] = useActionState(analyzeDocumentAction, initialState);

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
          JusticeLens
        </h1>
        <p className="mt-3 max-w-2xl mx-auto text-lg text-muted-foreground sm:text-xl">
          Upload court records to uncover patterns of bias and inequality in the justice system.
        </p>
      </div>

      <Card className="w-full max-w-3xl mx-auto shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Analyze Court Record</CardTitle>
          <CardDescription>
            Select a document and analysis parameters to start.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataUploadForm formAction={formAction} state={state} />
        </CardContent>
      </Card>
      
      {state.extractedData && <ResultsDisplay analysisState={state} />}
    </div>
  );
}
