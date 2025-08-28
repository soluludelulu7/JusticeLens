"use server";

import { extractCourtData, ExtractCourtDataOutput } from "@/ai/flows/extract-court-data";
import { detectBias, DetectBiasOutput, DetectBiasInput } from "@/ai/flows/detect-bias";
import { generateAppealAdvice, GenerateAppealAdviceInput, GenerateAppealAdviceOutput } from "@/ai/flows/generate-appeal-advice";
import { z } from "zod";

const FormSchema = z.object({
  statisticalTest: z.enum(["chi-squared", "t-test", "mann-whitney-u"]),
  significanceLevel: z.coerce.number().min(0.01).max(0.1),
  courtRecord: z.instanceof(File),
});

export type AnalysisState = {
  extractedData?: ExtractCourtDataOutput;
  biasAnalysis?: DetectBiasOutput;
  error?: string;
  formErrors?: z.ZodError<typeof FormSchema>["formErrors"]["fieldErrors"];
};

export async function analyzeDocumentAction(
  prevState: AnalysisState,
  formData: FormData
): Promise<AnalysisState> {
  
  const validatedFields = FormSchema.safeParse({
    statisticalTest: formData.get("statisticalTest"),
    significanceLevel: formData.get("significanceLevel"),
    courtRecord: formData.get("courtRecord"),
  });
  
  if (!validatedFields.success) {
    return {
      error: "Invalid form data.",
      formErrors: validatedFields.error.flatten().fieldErrors,
    };
  }
  
  const { courtRecord, statisticalTest, significanceLevel } = validatedFields.data;

  if (!courtRecord || courtRecord.size === 0) {
    return { error: "Court record file is required." };
  }

  try {
    const bytes = await courtRecord.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const dataURI = `data:${courtRecord.type};base64,${buffer.toString("base64")}`;

    const extractedData = await extractCourtData({ courtRecord: dataURI });

    const csvData = `demographics,charges,sentence,outcome\n"${extractedData.defendantDemographics}","${extractedData.charges}","${extractedData.sentenceLength}","${extractedData.outcome}"`;

    const biasInput: DetectBiasInput = {
      demographicData: csvData,
      statisticalTest,
      significanceLevel,
    };
    
    const biasAnalysis = await detectBias(biasInput);

    return { extractedData, biasAnalysis };
  } catch (e: any) {
    console.error(e);
    return { error: e.message || "An unexpected error occurred." };
  }
}

export type AppealAdviceState = {
    appealAdvice?: GenerateAppealAdviceOutput['appealAdvice'];
    error?: string;
}

export async function getAppealAdviceAction(
    input: GenerateAppealAdviceInput
): Promise<AppealAdviceState> {
    try {
        const result = await generateAppealAdvice(input);
        return { appealAdvice: result.appealAdvice };
    } catch (e: any) {
        console.error(e);
        return { error: e.message || "Failed to generate appeal advice." };
    }
}
