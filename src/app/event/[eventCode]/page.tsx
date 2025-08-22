
'use client';

import { useParams } from 'next/navigation';
import { useEventContext } from '@/context/EventContext';
import { useEffect, useState } from 'react';
import type { Event } from '@/types';
import { PhotoUploader } from '@/components/PhotoUploader';
import { PhotoGrid } from '@/components/PhotoGrid';
import { EventSummary } from '@/components/EventSummary';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';

export default function EventPage() {
  const params = useParams();
  const { events, loading } = useEventContext();
  const [currentEvent, setCurrentEvent] = useState<Event | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  
  const eventCode = params.eventCode as string;

  useEffect(() => {
    if (!loading) {
      const foundEvent = events.find((e) => e.code === eventCode);
      if (foundEvent) {
        setCurrentEvent(foundEvent);
      }
    }
  }, [eventCode, events, loading]);

  if (loading || !currentEvent) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-12 w-1/2 mb-4" />
        <Skeleton className="h-8 w-3/4 mb-8" />
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {[...Array(10)].map((_, i) => (
            <Skeleton key={i} className="aspect-square w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
        <div className="mb-4 md:mb-0">
          <h1 className="text-4xl md:text-5xl font-headline text-primary">
            {currentEvent.name}
          </h1>
          <p className="text-muted-foreground mt-1">
            Event Code: <span className="font-mono text-accent">{currentEvent.code}</span>
          </p>
        </div>
        <PhotoUploader eventCode={eventCode} onProgressUpdate={setUploadProgress} />
      </div>

       {uploadProgress !== null && (
        <div className="mb-8 space-y-2">
            <p className="text-sm text-muted-foreground">Processing photos... {Math.round(uploadProgress)}%</p>
            <Progress value={uploadProgress} className="w-full" />
        </div>
      )}

      <EventSummary event={currentEvent} />
      <PhotoGrid event={currentEvent} />
    </div>
  );
}
