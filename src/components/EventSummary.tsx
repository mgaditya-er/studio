
'use client';

import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { summarizeAlbum } from '@/ai/flows/summarize-album';
import type { Event } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { Sparkles, Loader2 } from 'lucide-react';
import { useEventContext } from '@/context/EventContext';

interface EventSummaryProps {
  event: Event;
}

export function EventSummary({ event }: EventSummaryProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { updateEvent } = useEventContext();

  const handleGenerateSummary = async () => {
    if (event.photos.filter(p => !p.processing).length < 3) {
      toast({
        title: 'Not enough photos',
        description: 'Please upload and wait for at least 3 photos to be processed before generating a summary.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      const photoDescriptions = event.photos.map(p => p.caption).filter(c => c !== 'Processing...');
      const result = await summarizeAlbum({ photoDescriptions });

      await updateEvent(event.id, { tripStory: result.tripStory, highlights: result.highlights });

      toast({
        title: 'Summary Generated!',
        description: 'The AI-powered trip story and highlights are ready.',
      });
    } catch (error) {
      console.error('Failed to generate summary:', error);
      toast({
        title: 'Error',
        description: 'Could not generate the event summary.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const hasSummary = event.tripStory && event.highlights?.length > 0;

  return (
    <Card className="mb-8 bg-card/50">
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <CardTitle className="font-headline text-2xl">Event Summary</CardTitle>
            {!hasSummary && (
                <Button onClick={handleGenerateSummary} disabled={loading} className="mt-4 md:mt-0">
                {loading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                    <Sparkles className="mr-2 h-4 w-4" />
                )}
                Generate with AI
                </Button>
            )}
        </div>
      </CardHeader>
      <CardContent>
        {!hasSummary ? (
          <p className="text-muted-foreground text-center md:text-left">
            Once you've uploaded some photos, generate a unique story and highlights for your event!
          </p>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
                <h3 className="font-semibold text-lg mb-2">Trip Story</h3>
                <p className="text-muted-foreground italic">"{event.tripStory}"</p>
            </div>
            <div>
                <h3 className="font-semibold text-lg mb-2">Highlights</h3>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    {event.highlights.map((highlight, index) => (
                        <li key={index}>{highlight}</li>
                    ))}
                </ul>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
