"use client";

import type { AnalysisState } from "@/app/dashboard/actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Gavel, FileText, UserCheck, Activity } from "lucide-react";
import { BiasScoreCard } from "./BiasScoreCard";
import { DisparityChart } from "./DisparityChart";
import { AppealAdviceCard } from "./AppealAdviceCard";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ShieldX } from "lucide-react";

function ExtractedData({ data }: { data: AnalysisState['extractedData'] }) {
    if (!data) return null;

    const items = [
        { icon: UserCheck, label: "Defendant Demographics", value: data.defendantDemographics },
        { icon: FileText, label: "Charges", value: data.charges },
        { icon: Gavel, label: "Sentence Length", value: data.sentenceLength },
        { icon: Activity, label: "Outcome", value: data.outcome },
    ];

    return (
        <Card className="shadow-md">
            <CardHeader>
                <CardTitle>Extracted Case Details</CardTitle>
                <CardDescription>Key information automatically extracted from the document.</CardDescription>
            </CardHeader>
            <CardContent>
                <ul className="space-y-6">
                    {items.map((item, index) => (
                        <li key={index} className="flex items-start gap-4">
                            <item.icon className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                            <div>
                                <p className="font-semibold text-foreground">{item.label}</p>
                                <p className="text-muted-foreground break-words">{item.value}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            </CardContent>
        </Card>
    );
}

export function ResultsDisplay({ analysisState }: { analysisState: AnalysisState }) {
  const { extractedData, biasAnalysis, error } = analysisState;

  if (error && !analysisState.formErrors) {
    return (
        <Alert variant="destructive" className="mt-8 max-w-3xl mx-auto">
            <ShieldX className="h-4 w-4" />
            <AlertTitle>Analysis Failed</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
        </Alert>
    );
  }

  if (!extractedData || !biasAnalysis) {
    return null;
  }

  return (
    <div className="mt-12 space-y-8">
        <Separator />
        <h2 className="text-3xl font-bold text-center">Analysis Results</h2>
        <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-3">
            <div className="lg:col-span-1 space-y-8">
                <BiasScoreCard biasAnalysis={biasAnalysis} />
                <ExtractedData data={extractedData} />
            </div>
            <div className="lg:col-span-2 space-y-8">
                 <DisparityChart />
                 {biasAnalysis.biasDetected && (
                    <AppealAdviceCard 
                        extractedData={extractedData} 
                        biasAnalysis={biasAnalysis}
                    />
                 )}
            </div>
        </div>
    </div>
  );
}
