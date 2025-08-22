'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CreateEventForm } from '@/components/CreateEventForm';
import { JoinEventForm } from '@/components/JoinEventForm';
import { Separator } from '@/components/ui/separator';

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-16">
      <div className="text-center mb-12">
        <h1 className="text-5xl md:text-7xl font-headline text-primary mb-2">
          AlbumAce
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          Your shared memories, reimagined. Create an event or join one to start
          building your AI-powered photo album.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 max-w-4xl mx-auto">
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="font-headline text-2xl text-center">
              Create New Event
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-muted-foreground mb-6">
              Organizing a trip, party, or get-together? Start here to create a
              shared album for your group.
            </p>
            <CreateEventForm />
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="font-headline text-2xl text-center">
              Join Existing Event
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-muted-foreground mb-6">
              Have an event code? Enter it below to join the album and start
              sharing your photos.
            </p>
            <JoinEventForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
