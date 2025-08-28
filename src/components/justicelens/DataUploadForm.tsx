"use client";

import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import type { AnalysisState } from "@/app/dashboard/actions";
import { Loader2 } from "lucide-react";
import { useState, useEffect } from "react";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
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
    <form action={formAction} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="courtRecord">Court Record File</Label>
        <Input id="courtRecord" name="courtRecord" type="file" accept=".pdf,.csv,.txt" required />
        {state.formErrors?.courtRecord && (
          <p className="text-sm font-medium text-destructive">{state.formErrors.courtRecord[0]}</p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="statisticalTest">Statistical Test</Label>
          {isClient ? (
            <Select name="statisticalTest" defaultValue="chi-squared">
              <SelectTrigger id="statisticalTest">
                <SelectValue placeholder="Select a test" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="chi-squared">Chi-Squared Test</SelectItem>
                <SelectItem value="t-test">T-Test</SelectItem>
                <SelectItem value="mann-whitney-u">Mann-Whitney U Test</SelectItem>
              </SelectContent>
            </Select>
          ) : (
            <div className="h-10 w-full rounded-md border border-input bg-background animate-pulse" />
          )}
           {state.formErrors?.statisticalTest && (
            <p className="text-sm font-medium text-destructive">{state.formErrors.statisticalTest[0]}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="significanceLevel">Significance Level: {significance.toFixed(2)}</Label>
          <Slider
            id="significanceLevel"
            name="significanceLevel"
            min={0.01}
            max={0.1}
            step={0.01}
            value={[significance]}
            onValueChange={(value) => setSignificance(value[0])}
          />
           {state.formErrors?.significanceLevel && (
            <p className="text-sm font-medium text-destructive">{state.formErrors.significanceLevel[0]}</p>
          )}
        </div>
      </div>
      
      {state.error && !state.formErrors && (
        <p className="text-sm font-medium text-destructive">{state.error}</p>
      )}

      <div className="flex justify-end">
        <SubmitButton />
      </div>
    </form>
  );
}
