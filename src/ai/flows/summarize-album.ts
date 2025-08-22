'use server';

/**
 * @fileOverview This file defines the Genkit flow for summarizing an album of photos and generating highlight captions.
 *
 * - summarizeAlbum - A function that takes an array of photo descriptions and returns a trip story and highlight captions.
 * - SummarizeAlbumInput - The input type for the summarizeAlbum function.
 * - SummarizeAlbumOutput - The return type for the summarizeAlbum function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeAlbumInputSchema = z.object({
  photoDescriptions: z.array(
    z.string().describe('A description of a photo in the album.')
  ).describe('An array of descriptions for all photos in the album.'),
});
export type SummarizeAlbumInput = z.infer<typeof SummarizeAlbumInputSchema>;

const SummarizeAlbumOutputSchema = z.object({
  tripStory: z.string().describe('A short summary of the event highlights.'),
  highlights: z.array(z.string().describe('Possible highlight captions for a slideshow.')).length(3).describe('Three possible event highlight captions.'),
  progress: z.string().describe('Progress of the AI operation'),
});
export type SummarizeAlbumOutput = z.infer<typeof SummarizeAlbumOutputSchema>;

export async function summarizeAlbum(input: SummarizeAlbumInput): Promise<SummarizeAlbumOutput> {
  return summarizeAlbumFlow(input);
}

const summarizeAlbumPrompt = ai.definePrompt({
  name: 'summarizeAlbumPrompt',
  input: {schema: SummarizeAlbumInputSchema},
  output: {schema: SummarizeAlbumOutputSchema},
  prompt: `You are an AI assistant for a smart photo album app. You will receive descriptions of photos from an event and generate a short "Trip Story" summarizing the event highlights (max 5 sentences), and suggest 3 possible "Event Highlights" captions that could be used for a slideshow.

Photo Descriptions:
{{#each photoDescriptions}}
- {{{this}}}
{{/each}}
`,
});

const summarizeAlbumFlow = ai.defineFlow(
  {
    name: 'summarizeAlbumFlow',
    inputSchema: SummarizeAlbumInputSchema,
    outputSchema: SummarizeAlbumOutputSchema,
  },
  async input => {
    const {output} = await summarizeAlbumPrompt(input);
    return {
      ...output!,
      progress: 'Generated a short trip story and highlight captions.',
    };
  }
);
