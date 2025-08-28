"use client";

import React from "react";
import { useFormState } from "react-dom";
import { DataUploadForm } from "@/components/justicelens/DataUploadForm";
import { ResultsDisplay } from "@/components/justicelens/ResultsDisplay";
import type { AnalysisState } from "./actions";
import { analyzeDocumentAction } from "./actions";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const initialState: AnalysisState = {};

export default function DashboardPage() {
  const [state, formAction] = useFormState(analyzeDocumentAction, initialState);

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          JusticeLens Dashboard
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Upload court records to uncover patterns of bias and inequality.
        </p>
      </div>

      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Analyze Court Record</CardTitle>
          <CardDescription>
            Select a document and the analysis parameters to start. Our AI will extract key data and detect potential sentencing disparities.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataUploadForm formAction={formAction} state={state} />
        </CardContent>
      </Card>
      
      {state && <ResultsDisplay analysisState={state} />}
    </div>
  );
}
