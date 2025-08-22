'use server';

/**
 * @fileOverview Suggests engaging "Event Highlight" captions for a slideshow after photo uploads.
 *
 * - suggestHighlights - A function to generate highlight captions.
 * - SuggestHighlightsInput - Input type for the suggestHighlights function.
 * - SuggestHighlightsOutput - Return type for the suggestHighlights function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestHighlightsInputSchema = z.object({
  tripStory: z.string().describe('A summary of the trip story.'),
});
export type SuggestHighlightsInput = z.infer<typeof SuggestHighlightsInputSchema>;

const SuggestHighlightsOutputSchema = z.object({
  highlights: z.array(z.string()).describe('Three suggested event highlight captions.'),
});
export type SuggestHighlightsOutput = z.infer<typeof SuggestHighlightsOutputSchema>;

export async function suggestHighlights(input: SuggestHighlightsInput): Promise<SuggestHighlightsOutput> {
  return suggestHighlightsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestHighlightsPrompt',
  input: {schema: SuggestHighlightsInputSchema},
  output: {schema: SuggestHighlightsOutputSchema},
  prompt: `You are an AI assistant that suggests engaging event highlight captions for slideshows.

  Given the following trip story, generate three possible event highlight captions that would be suitable for a slideshow.

  Trip Story: {{{tripStory}}}
  `,
});

const suggestHighlightsFlow = ai.defineFlow(
  {
    name: 'suggestHighlightsFlow',
    inputSchema: SuggestHighlightsInputSchema,
    outputSchema: SuggestHighlightsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
