"use client";

import { useState } from "react";
import type { ExtractCourtDataOutput } from "@/ai/flows/extract-court-data";
import type { DetectBiasOutput } from "@/ai/flows/detect-bias";
import { getAppealAdviceAction, AppealAdviceState } from "@/app/dashboard/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Sparkles } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "../ui/skeleton";

export function AppealAdviceCard({
  extractedData,
  biasAnalysis,
}: {
  extractedData: ExtractCourtDataOutput;
  biasAnalysis: DetectBiasOutput;
}) {
  const [state, setState] = useState<AppealAdviceState>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleGetAdvice = async () => {
    setIsLoading(true);
    const result = await getAppealAdviceAction({
      defendantDemographics: extractedData.defendantDemographics,
      charges: extractedData.charges,
      sentenceLength: extractedData.sentenceLength,
      outcome: extractedData.outcome,
      jurisdiction: "Default Jurisdiction", // This could be an input field
      disparityDetails: biasAnalysis.biasSummary,
    });
    setState(result);
    setIsLoading(false);
  };

  return (
    <Card className="bg-accent/10 border-accent shadow-md">
      <CardHeader>
        <CardTitle>Generate Appeal Strategy</CardTitle>
        <CardDescription>
          Based on the detected disparities, the AI can suggest potential legal arguments for an appeal.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!state.appealAdvice && !isLoading && (
          <Button onClick={handleGetAdvice} disabled={isLoading} variant="outline" className="border-accent text-accent hover:bg-accent hover:text-accent-foreground">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate Appeal Advice
              </>
            )}
          </Button>
        )}
        
        {isLoading && (
            <div className="space-y-2 pt-2">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
            </div>
        )}

        {state.error && (
            <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{state.error}</AlertDescription>
            </Alert>
        )}

        {state.appealAdvice && (
          <div>
            <h4 className="font-semibold text-foreground mb-2">Suggested Appeal Arguments:</h4>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">{state.appealAdvice}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
