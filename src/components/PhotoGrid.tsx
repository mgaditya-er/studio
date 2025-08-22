'use client';

import Image from 'next/image';
import { useEventContext } from '@/context/EventContext';
import { Card, CardContent, CardFooter } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import type { Event } from '@/types';
import { Badge } from './ui/badge';
import { Loader2 } from 'lucide-react';

interface PhotoGridProps {
  event: Event;
}

export function PhotoGrid({ event }: PhotoGridProps) {
  const { currentUser } = useEventContext();

  const myPhotos = event.photos.filter((p) => p.uploaderId === currentUser?.id);

  return (
    <div className="mt-8">
      <Tabs defaultValue="group">
        <TabsList className="grid w-full grid-cols-2 md:w-96">
          <TabsTrigger value="group">Group Photos</TabsTrigger>
          <TabsTrigger value="my">My Photos</TabsTrigger>
        </TabsList>
        <TabsContent value="group" className="mt-6">
          {event.photos.length === 0 ? (
            <p className="text-center text-muted-foreground py-10">No photos uploaded yet. Be the first!</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {event.photos.map((photo) => (
                <Card key={photo.id} className="overflow-hidden group">
                  <CardContent className="p-0 relative">
                    <Image
                      src={photo.url}
                      alt={photo.caption || 'Event photo'}
                      width={400}
                      height={400}
                      className="aspect-square object-cover transition-transform duration-300 group-hover:scale-105"
                      data-ai-hint="event photo"
                    />
                    {photo.processing && (
                       <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                         <Loader2 className="h-8 w-8 text-white animate-spin" />
                       </div>
                    )}
                  </CardContent>
                  <CardFooter className="p-3 flex flex-col items-start">
                    <p className="text-sm text-foreground italic">"{photo.caption}"</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                        {photo.themes.map(theme => (
                            <Badge key={theme} variant="secondary">{theme}</Badge>
                        ))}
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        <TabsContent value="my" className="mt-6">
           {myPhotos.length === 0 ? (
            <p className="text-center text-muted-foreground py-10">You haven't uploaded any photos yet.</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {myPhotos.map((photo) => (
                <Card key={photo.id} className="overflow-hidden group">
                  <CardContent className="p-0 relative">
                    <Image
                      src={photo.url}
                      alt={photo.caption || 'Event photo'}
                      width={400}
                      height={400}
                      className="aspect-square object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                     {photo.processing && (
                       <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                         <Loader2 className="h-8 w-8 text-white animate-spin" />
                       </div>
                    )}
                  </CardContent>
                  <CardFooter className="p-3 flex flex-col items-start">
                    <p className="text-sm text-foreground italic">"{photo.caption}"</p>
                     <div className="flex flex-wrap gap-1 mt-2">
                        {photo.themes.map(theme => (
                            <Badge key={theme} variant="secondary">{theme}</Badge>
                        ))}
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
