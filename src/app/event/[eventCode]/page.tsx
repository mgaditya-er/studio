'use client';

import { useParams } from 'next/navigation';
import { useEventContext } from '@/context/EventContext';
import { useEffect, useState } from 'react';
import type { Event } from '@/types';
import { PhotoUploader } from '@/components/PhotoUploader';
import { PhotoGrid } from '@/components/PhotoGrid';
import { EventSummary } from '@/components/EventSummary';
import { Skeleton } from '@/components/ui/skeleton';

export default function EventPage() {
  const params = useParams();
  const { events, loading, setEvents } = useEventContext();
  const [currentEvent, setCurrentEvent] = useState<Event | null>(null);
  
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
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-4xl md:text-5xl font-headline text-primary">
            {currentEvent.name}
          </h1>
          <p className="text-muted-foreground mt-1">
            Event Code: <span className="font-mono text-accent">{currentEvent.code}</span>
          </p>
        </div>
        <PhotoUploader eventCode={eventCode} />
      </div>

      <EventSummary event={currentEvent} setEvents={setEvents} />
      <PhotoGrid event={currentEvent} />
    </div>
  );
}
