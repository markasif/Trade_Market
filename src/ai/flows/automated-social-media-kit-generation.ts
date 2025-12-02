'use server';
/**
 * @fileOverview A Genkit flow for generating social media kits for products.
 *
 * - generateSocialMediaKit - A function that generates a social media kit for a given product.
 * - SocialMediaKitInput - The input type for the generateSocialMediaKit function.
 * - SocialMediaKitOutput - The output type for the generateSocialMediaKit function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

const SocialMediaKitInputSchema = z.object({
  productName: z.string().describe('The name of the product.'),
  productDescription: z.string().describe('A brief description of the product.'),
  productImageUrl: z.string().describe("The URL of the product's image."),
  companyName: z.string().describe('The name of the company selling the product.'),
  primaryColor: z.string().default('#137fec').describe('The primary color of the company.'),
});
export type SocialMediaKitInput = z.infer<typeof SocialMediaKitInputSchema>;

const SocialMediaKitOutputSchema = z.object({
  instagramPost: z.object({
    imageUrl: z.string().describe('URL of the generated Instagram post image.'),
    prompt: z.string().describe('The prompt used to generate the instagram image'),
  }).describe('Details for the generated Instagram post.'),
  facebookCover: z.object({
    imageUrl: z.string().describe('URL of the generated Facebook cover image.'),
    prompt: z.string().describe('The prompt used to generate the facebook image'),
  }).describe('Details for the generated Facebook cover.'),
  twitterHeader: z.object({
    imageUrl: z.string().describe('URL of the generated Twitter header image.'),
    prompt: z.string().describe('The prompt used to generate the twitter image'),
  }).describe('Details for the generated Twitter header.'),
});
export type SocialMediaKitOutput = z.infer<typeof SocialMediaKitOutputSchema>;

export async function generateSocialMediaKit(
  input: SocialMediaKitInput
): Promise<SocialMediaKitOutput> {
  return generateSocialMediaKitFlow(input);
}

const socialMediaKitPrompt = ai.definePrompt({
  name: 'socialMediaKitPrompt',
  input: {schema: SocialMediaKitInputSchema},
  output: {schema: SocialMediaKitOutputSchema},
  prompt: `You are a social media marketing expert.
  Generate engaging social media posts for the following product:

  Product Name: {{{productName}}}
  Product Description: {{{productDescription}}}
  Company Name: {{{companyName}}}

  Create an instagram post, facebook cover, and twitter header, all tailored to promote this product.
  For each social media post, generate image url, and the prompt that created that image. Focus on image generation.
  Do not actually generate the images, instead provide the prompt that should be used with an image generation model.
  Consider the primary color to be {{{primaryColor}}}.
  Each image should be professional looking and appropriate for the platform.
  The image should incorporate an image of the product at "{{{productImageUrl}}}".
  `,
});

const generateSocialMediaKitFlow = ai.defineFlow(
  {
    name: 'generateSocialMediaKitFlow',
    inputSchema: SocialMediaKitInputSchema,
    outputSchema: SocialMediaKitOutputSchema,
  },
  async input => {
    const kit = await socialMediaKitPrompt(input);
    return kit.output!;
  }
);
