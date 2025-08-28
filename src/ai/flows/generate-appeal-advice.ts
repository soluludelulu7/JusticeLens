'use server';

/**
 * @fileOverview This flow generates advice on how an unfairly sentenced defendant might appeal their case.
 *
 * - generateAppealAdvice - A function that generates appeal advice.
 * - GenerateAppealAdviceInput - The input type for the generateAppealAdvice function.
 * - GenerateAppealAdviceOutput - The return type for the generateAppealAdvice function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateAppealAdviceInputSchema = z.object({
  defendantDemographics: z
    .string()
    .describe('Demographic information of the defendant (e.g., race, gender, age, income).'),
  charges: z.string().describe('The charges against the defendant.'),
  sentenceLength: z.string().describe('The length of the sentence.'),
  outcome: z.string().describe('The outcome of the trial.'),
  jurisdiction: z.string().describe('The jurisdiction where the trial took place.'),
  disparityDetails: z
    .string()
    .describe(
      'Details about the sentencing disparities observed, including the demographic groups affected and the statistical significance of the disparities.'
    ),
});
export type GenerateAppealAdviceInput = z.infer<typeof GenerateAppealAdviceInputSchema>;

const GenerateAppealAdviceOutputSchema = z.object({
  appealAdvice: z
    .string()
    .describe(
      'Advice on how an unfairly sentenced defendant might appeal their case, including potential legal arguments and relevant precedents.'
    ),
});
export type GenerateAppealAdviceOutput = z.infer<typeof GenerateAppealAdviceOutputSchema>;

export async function generateAppealAdvice(input: GenerateAppealAdviceInput): Promise<GenerateAppealAdviceOutput> {
  return generateAppealAdviceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateAppealAdvicePrompt',
  input: {schema: GenerateAppealAdviceInputSchema},
  output: {schema: GenerateAppealAdviceOutputSchema},
  prompt: `You are an AI legal expert specializing in identifying and advising on unfair sentencing. Given the details of a defendant's case and detected sentencing disparities, provide advice on how the defendant might appeal their case.

Defendant Demographics: {{{defendantDemographics}}}
Charges: {{{charges}}}
Sentence Length: {{{sentenceLength}}}
Outcome: {{{outcome}}}
Jurisdiction: {{{jurisdiction}}}
Disparity Details: {{{disparityDetails}}}

Based on this information, provide specific and actionable advice on potential legal arguments for appeal, including relevant precedents and legal strategies. Focus on arguments related to sentencing disparities and potential biases.
`,}
);

const generateAppealAdviceFlow = ai.defineFlow(
  {
    name: 'generateAppealAdviceFlow',
    inputSchema: GenerateAppealAdviceInputSchema,
    outputSchema: GenerateAppealAdviceOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
