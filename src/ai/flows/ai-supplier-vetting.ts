// This is an AI-powered tool for vetting suppliers.
//
// The flow has one function:
// - aiSupplierVetting: Vets a supplier using AI and allows manual override.
//
// It also exports two types:
// - AISupplierVettingInput: The input type for the aiSupplierVetting function.
// - AISupplierVettingOutput: The return type for the aiSupplierVetting function.
'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AISupplierVettingInputSchema = z.object({
  businessName: z.string().describe('The name of the business applying.'),
  businessLicenseDataUri: z.string().describe(
    "A photo of the business license, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
  ),
  taxIdDocumentDataUri: z.string().describe(
    "A photo of the tax ID document, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
  ),
});
export type AISupplierVettingInput = z.infer<typeof AISupplierVettingInputSchema>;

const AISupplierVettingOutputSchema = z.object({
  isApproved: z.boolean().describe('Whether the supplier is approved or not.'),
  reason: z.string().describe('The reason for the approval or rejection.'),
});
export type AISupplierVettingOutput = z.infer<typeof AISupplierVettingOutputSchema>;

export async function aiSupplierVetting(
  input: AISupplierVettingInput
): Promise<AISupplierVettingOutput> {
  return aiSupplierVettingFlow(input);
}

const aiSupplierVettingPrompt = ai.definePrompt({
  name: 'aiSupplierVettingPrompt',
  input: {schema: AISupplierVettingInputSchema},
  output: {schema: AISupplierVettingOutputSchema},
  prompt: `You are an AI compliance officer.

You are reviewing a supplier application for a B2B marketplace.

Review the following information and determine if the supplier should be approved or not.

Business Name: {{{businessName}}}
Business License: {{media url=businessLicenseDataUri}}
Tax ID Document: {{media url=taxIdDocumentDataUri}}

Respond with JSON that represents your decision.

If the documents are unclear, or do not match the business name, set isApproved to false, and provide a reason. If the documents appear valid, set isApproved to true and provide a short reason.
`,
});

const aiSupplierVettingFlow = ai.defineFlow(
  {
    name: 'aiSupplierVettingFlow',
    inputSchema: AISupplierVettingInputSchema,
    outputSchema: AISupplierVettingOutputSchema,
  },
  async input => {
    const {output} = await aiSupplierVettingPrompt(input);
    return output!;
  }
);
