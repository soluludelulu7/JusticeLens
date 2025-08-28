'use server';

/**
 * @fileOverview This file defines a Genkit flow for extracting court data from uploaded documents.
 *
 * It uses NLP to extract key details such as defendant demographics, charges, and sentence lengths.
 *
 * @exports {
 *   extractCourtData: function
 *   ExtractCourtDataInput: type
 *   ExtractCourtDataOutput: type
 * }
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import wav from 'wav';

const ExtractCourtDataInputSchema = z.object({
  courtRecord: z
    .string()
    .describe(
      'The court record document as a data URI that must include a MIME type and use Base64 encoding. Expected format: data:<mimetype>;base64,<encoded_data>.'
    ),
});
export type ExtractCourtDataInput = z.infer<typeof ExtractCourtDataInputSchema>;

const ExtractCourtDataOutputSchema = z.object({
  defendantDemographics: z.string().describe('Demographic information of the defendant.'),
  charges: z.string().describe('The charges against the defendant.'),
  sentenceLength: z.string().describe('The length of the sentence given to the defendant.'),
  outcome: z.string().describe('The outcome of the court case.'),
});
export type ExtractCourtDataOutput = z.infer<typeof ExtractCourtDataOutputSchema>;

export async function extractCourtData(input: ExtractCourtDataInput): Promise<ExtractCourtDataOutput> {
  return extractCourtDataFlow(input);
}

const extractCourtDataPrompt = ai.definePrompt({
  name: 'extractCourtDataPrompt',
  input: {schema: ExtractCourtDataInputSchema},
  output: {schema: ExtractCourtDataOutputSchema},
  prompt: `You are an AI assistant specialized in legal data extraction. Your task is to analyze the provided court record and extract key details.  You must return all output fields.

  Analyze the following court record:
  {{media url=courtRecord}}
  
  Extract the following information:
  - Defendant Demographics: Extract and summarize the demographic information of the defendant, including but not limited to race, gender, age, and socioeconomic background.
  - Charges: List the charges brought against the defendant as listed in the court record.
  - Sentence Length: Extract the sentence length given to the defendant.
  - Outcome: Summarize the final outcome of the court case.
  `,
});

const extractCourtDataFlow = ai.defineFlow(
  {
    name: 'extractCourtDataFlow',
    inputSchema: ExtractCourtDataInputSchema,
    outputSchema: ExtractCourtDataOutputSchema,
  },
  async input => {
    const {output} = await extractCourtDataPrompt(input);
    return output!;
  }
);
