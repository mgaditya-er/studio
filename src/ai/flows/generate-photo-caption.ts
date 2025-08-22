'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating captions for photos.
 *
 * - generatePhotoCaption - An async function that takes a photo and its detected faces and generates a caption.
 * - GeneratePhotoCaptionInput - The input type for the generatePhotoCaption function.
 * - GeneratePhotoCaptionOutput - The return type for the generatePhotoCaption function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeneratePhotoCaptionInputSchema = z.object({
  photoId: z.string().describe('The ID of the photo.'),
  photoDataUri: z
    .string()
    .describe(
      "A photo, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  faces: z.array(z.string()).describe('An array of detected faces in the photo (e.g., Person A, Person B).'),
  activity: z.string().optional().describe('The activity or event in the photo.'),
});
export type GeneratePhotoCaptionInput = z.infer<typeof GeneratePhotoCaptionInputSchema>;

const GeneratePhotoCaptionOutputSchema = z.object({
  caption: z.string().describe('A short, natural language caption describing the photo.'),
});
export type GeneratePhotoCaptionOutput = z.infer<typeof GeneratePhotoCaptionOutputSchema>;

export async function generatePhotoCaption(input: GeneratePhotoCaptionInput): Promise<GeneratePhotoCaptionOutput> {
  return generatePhotoCaptionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generatePhotoCaptionPrompt',
  input: {schema: GeneratePhotoCaptionInputSchema},
  output: {schema: GeneratePhotoCaptionOutputSchema},
  prompt: `You are an AI assistant helping to caption photos in a shared album.

  Generate a short, natural language caption (max 1 sentence) describing the photo.  Mention people (using the provided face labels like "Person A", "Person B", etc.) and the activity in the photo.

  Photo: {{media url=photoDataUri}}
  People: {{#each faces}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
  Activity: {{activity}}

  Caption: `,
});

const generatePhotoCaptionFlow = ai.defineFlow(
  {
    name: 'generatePhotoCaptionFlow',
    inputSchema: GeneratePhotoCaptionInputSchema,
    outputSchema: GeneratePhotoCaptionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
