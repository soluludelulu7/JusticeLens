"use client";

import type { AnalysisState } from "@/app/dashboard/actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Gavel, FileText, UserCheck, Activity, Share2, Download, FileType, FileUp } from "lucide-react";
import { BiasScoreCard } from "./BiasScoreCard";
import { DisparityChart } from "./DisparityChart";
import { AppealAdviceCard } from "./AppealAdviceCard";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ShieldX } from "lucide-react";
import { Button } from "../ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import jsPDF from "jspdf";
import "jspdf-autotable";

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

function ActionsCard({ analysisState }: { analysisState: AnalysisState }) {
  const { extractedData, biasAnalysis } = analysisState;

  const handleExportCSV = () => {
    if (!extractedData || !biasAnalysis) return;
    const headers = ["category", "value"];
    const rows = [
      ["Defendant Demographics", extractedData.defendantDemographics],
      ["Charges", extractedData.charges],
      ["Sentence Length", extractedData.sentenceLength],
      ["Outcome", extractedData.outcome],
      ["Bias Detected", biasAnalysis.biasDetected],
      ["Bias Summary", biasAnalysis.biasSummary],
    ];
    let csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n"
      + rows.map(e => e.map(v => `"${v}"`).join(",")).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "justicelens_analysis.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportPDF = () => {
    if (!extractedData || !biasAnalysis) return;
    const doc = new jsPDF();
    doc.text("JusticeLens Analysis Report", 14, 16);
    
    const tableData = [
        ["Defendant Demographics", extractedData.defendantDemographics],
        ["Charges", extractedData.charges],
        ["Sentence Length", extractedData.sentenceLength],
        ["Outcome", extractedData.outcome],
    ];

    (doc as any).autoTable({
        startY: 22,
        head: [['Extracted Case Details', '']],
        body: tableData,
        theme: 'striped',
        headStyles: { fillColor: [70, 132, 153] }
    });

    const finalY = (doc as any).lastAutoTable.finalY;

    (doc as any).autoTable({
        startY: finalY + 10,
        head: [['Bias Detection Summary', '']],
        body: [
            ['Bias Detected', String(biasAnalysis.biasDetected)],
            ['Analyst\'s Summary', biasAnalysis.biasSummary],
        ],
        theme: 'striped',
        headStyles: { fillColor: biasAnalysis.biasDetected ? [220, 53, 69] : [70, 132, 153] }
    });

    doc.save("justicelens_analysis.pdf");
  };

  const handleShareEmail = () => {
    if (!extractedData || !biasAnalysis) return;
    const subject = "JusticeLens Analysis Results";
    const body = `
      Here is the summary of the JusticeLens analysis:

      Extracted Data:
      - Demographics: ${extractedData.defendantDemographics}
      - Charges: ${extractedData.charges}
      - Sentence: ${extractedData.sentenceLength}
      - Outcome: ${extractedData.outcome}

      Bias Analysis:
      - Bias Detected: ${biasAnalysis.biasDetected}
      - Summary: ${biasAnalysis.biasSummary}
    `;
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle>Actions</CardTitle>
        <CardDescription>Export or share your analysis results.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-4">
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button variant="outline" onClick={handleExportCSV}><FileType className="mr-2" /> Export CSV</Button>
                </TooltipTrigger>
                <TooltipContent>
                    <p>Download the results as a CSV file.</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button variant="outline" onClick={handleExportPDF}><FileUp className="mr-2" /> Export PDF</Button>
                </TooltipTrigger>
                <TooltipContent>
                    <p>Download the results as a PDF document.</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button variant="outline" onClick={handleShareEmail}><Share2 className="mr-2" /> Share via Email</Button>
                </TooltipTrigger>
                <TooltipContent>
                    <p>Share the summary via your default email client.</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
      </CardContent>
    </Card>
  )
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
                 <ActionsCard analysisState={analysisState} />
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
