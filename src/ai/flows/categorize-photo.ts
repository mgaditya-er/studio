'use server';

/**
 * @fileOverview Photo categorization flow.
 *
 * - categorizePhoto - A function that categorizes a photo based on event themes.
 * - CategorizePhotoInput - The input type for the categorizePhoto function.
 * - CategorizePhotoOutput - The return type for the categorizePhoto function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CategorizePhotoInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  description: z.string().describe('The description of the photo.'),
});
export type CategorizePhotoInput = z.infer<typeof CategorizePhotoInputSchema>;

const CategorizePhotoOutputSchema = z.object({
  themes: z
    .array(z.string())
    .describe("An array of themes that the photo belongs to, chosen from 'Group Selfie', 'Landscape', 'Food', 'Candid', 'Adventure', 'Travel Spot', 'Other'."),
});
export type CategorizePhotoOutput = z.infer<typeof CategorizePhotoOutputSchema>;

export async function categorizePhoto(input: CategorizePhotoInput): Promise<CategorizePhotoOutput> {
  return categorizePhotoFlow(input);
}

const prompt = ai.definePrompt({
  name: 'categorizePhotoPrompt',
  input: {schema: CategorizePhotoInputSchema},
  output: {schema: CategorizePhotoOutputSchema},
  prompt: `You are an AI assistant specializing in categorizing photos based on event themes.

  Given the following photo and its description, determine which themes it belongs to.
  The available themes are: 'Group Selfie', 'Landscape', 'Food', 'Candid', 'Adventure', 'Travel Spot', 'Other'.
  Return an array of themes that best describe the photo.

  Description: {{{description}}}
  Photo: {{media url=photoDataUri}}
  `,
});

const categorizePhotoFlow = ai.defineFlow(
  {
    name: 'categorizePhotoFlow',
    inputSchema: CategorizePhotoInputSchema,
    outputSchema: CategorizePhotoOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
