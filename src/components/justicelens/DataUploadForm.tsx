"use client";

import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import type { AnalysisState } from "@/app/dashboard/actions";
import { Loader2, UploadCloud, TestTube, Target } from "lucide-react";
import { useState, useEffect } from "react";
import { Skeleton } from "../ui/skeleton";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full text-lg py-6 sm:py-7">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          Analyzing...
        </>
      ) : (
        "Analyze Document"
      )}
    </Button>
  );
}

export function DataUploadForm({
  formAction,
  state,
}: {
  formAction: (payload: FormData) => void;
  state: AnalysisState;
}) {
  const [significance, setSignificance] = useState(0.05);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <form action={formAction} className="space-y-8">
      <div className="space-y-3">
        <Label htmlFor="courtRecord" className="flex items-center gap-2 text-base font-semibold">
          <UploadCloud className="w-5 h-5" />
          Court Record File
        </Label>
        <Input id="courtRecord" name="courtRecord" type="file" accept=".pdf,.doc,.docx,.txt" required 
          className="file:text-primary file:font-semibold h-12 text-base"
        />
        {state.formErrors?.courtRecord && (
          <p className="text-sm font-medium text-destructive">{state.formErrors.courtRecord[0]}</p>
        )}
      </div>

      <div className="grid sm:grid-cols-2 gap-8">
        <div className="space-y-3">
           <Label htmlFor="statisticalTest" className="flex items-center gap-2 text-base font-semibold">
             <TestTube className="w-5 h-5" />
             Statistical Test
            </Label>
          {isClient ? (
            <Select name="statisticalTest" defaultValue="chi-squared">
              <SelectTrigger id="statisticalTest" className="h-12 text-base">
                <SelectValue placeholder="Select a test" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="chi-squared">Chi-Squared Test</SelectItem>
                <SelectItem value="t-test">T-Test</SelectItem>
                <SelectItem value="mann-whitney-u">Mann-Whitney U Test</SelectItem>
              </SelectContent>
            </Select>
          ) : (
            <Skeleton className="h-12 w-full" />
          )}
           {state.formErrors?.statisticalTest && (
            <p className="text-sm font-medium text-destructive">{state.formErrors.statisticalTest[0]}</p>
          )}
        </div>
        <div className="space-y-4">
          <Label htmlFor="significanceLevel" className="flex items-center gap-2 text-base font-semibold">
            <Target className="w-5 h-5" />
            Significance Level: {significance.toFixed(2)}
          </Label>
          <Slider
            id="significanceLevel"
            name="significanceLevel"
            min={0.01}
            max={0.1}
            step={0.01}
            value={[significance]}
            onValueChange={(value) => setSignificance(value[0])}
            className="py-2"
          />
           {state.formErrors?.significanceLevel && (
            <p className="text-sm font-medium text-destructive">{state.formErrors.significanceLevel[0]}</p>
          )}
        </div>
      </div>
      
      {state.error && !state.formErrors && (
        <p className="text-sm font-medium text-destructive">{state.error}</p>
      )}

      <div className="pt-4">
        {isClient ? (
          <SubmitButton />
        ) : (
          <Skeleton className="h-12 w-full sm:h-14" />
        )}
      </div>
    </form>
  );
}
