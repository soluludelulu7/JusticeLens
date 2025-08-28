// This file uses server-side code, and must be imported using the `'use server'` directive at the top of the file.
'use server';

/**
 * @fileOverview An AI agent that detects bias in sentencing patterns across different demographic groups.
 *
 * - detectBias - A function that handles the bias detection process.
 * - DetectBiasInput - The input type for the detectBias function.
 * - DetectBiasOutput - The return type for the detectBias function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DetectBiasInputSchema = z.object({
  demographicData: z.string().describe("A CSV containing demographic data, including race, gender, income and sentencing data."),
  statisticalTest: z.enum(["chi-squared", "t-test", "mann-whitney-u"]).describe("The statistical test to use to determine bias."),
  significanceLevel: z.number().min(0.01).max(0.1).default(0.05).describe("The statistical significance level to use when determining bias.  Must be between 0.01 and 0.1."),
});
export type DetectBiasInput = z.infer<typeof DetectBiasInputSchema>;

const DetectBiasOutputSchema = z.object({
  biasDetected: z.boolean().describe("Whether or not bias was detected."),
  biasSummary: z.string().describe("A summary of the bias detected, including the demographic groups affected and the magnitude of the disparity."),
  suggestedAppealArguments: z.string().optional().describe("Suggested arguments for an unfairly sentenced defendant to appeal their case, acting as a tool for legal aid organizations."),
});
export type DetectBiasOutput = z.infer<typeof DetectBiasOutputSchema>;

export async function detectBias(input: DetectBiasInput): Promise<DetectBiasOutput> {
  return detectBiasFlow(input);
}

const prompt = ai.definePrompt({
  name: 'detectBiasPrompt',
  input: {schema: DetectBiasInputSchema},
  output: {schema: DetectBiasOutputSchema},
  prompt: `You are an expert data analyst specializing in detecting bias in sentencing data.

  You will use the following information to detect bias in the data, and any disparities it has. You will make a determination as to whether bias is present or not, and what is wrong with it, and set the biasDetected output field appropriately.

  You will use the provided statistical test ({{{statisticalTest}}}) with significance level {{{significanceLevel}}} to determine if bias is statistically significant. If bias is detected, you will use your legal expertise to provide potential appeal arguments for unfairly sentenced defendants to assist legal aid organizations.

  Data: {{{demographicData}}}
  Statistical Test: {{{statisticalTest}}}
  Significance Level: {{{significanceLevel}}}

  Output your findings in JSON format. The biasSummary should be a detailed explanation of the detected bias.
  `,
});

const detectBiasFlow = ai.defineFlow(
  {
    name: 'detectBiasFlow',
    inputSchema: DetectBiasInputSchema,
    outputSchema: DetectBiasOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
