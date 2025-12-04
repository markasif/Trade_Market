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
    "A photo of the tax ID document (e.g., GST certificate), as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
  ),
});
export type AISupplierVettingInput = z.infer<typeof AISupplierVettingInputSchema>;

const AISupplierVettingOutputSchema = z.object({
  isApproved: z.boolean().describe('Whether the supplier is approved or not.'),
  reason: z.string().describe('The reason for the approval or rejection. If approved, state that documents look valid. If rejected, provide a specific reason like "GST number does not match" or "Document is blurry".'),
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
  prompt: `You are an AI compliance officer for a B2B marketplace. Your task is to review and vet new supplier applications by analyzing the provided documents.

Review the following information and determine if the supplier should be approved.

**Business Name from form:** {{{businessName}}}
**Business License Document:** {{media url=businessLicenseDataUri}}
**Tax ID / GST Document:** {{media url=taxIdDocumentDataUri}}

**Your Vetting Criteria:**
1.  **Clarity:** Are the documents clear and legible?
2.  **Consistency:** Does the business name and/or GST number on the documents match the business name provided in the form?
3.  **Authenticity:** Do the documents appear to be authentic government-issued documents? Look for signs of tampering or forgery.

**Decision:**
-   If all criteria are met, set **isApproved** to **true** and provide a brief, positive reason.
-   If any criterion is not met, set **isApproved** to **false** and provide a specific, actionable reason for the rejection (e.g., "The business name on the license does not match the application.", "The GST document is too blurry to read.").

Respond with a valid JSON object representing your decision.
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
