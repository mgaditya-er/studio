
'use client';

import { useEventContext } from '@/context/EventContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { QrCode } from '@/components/QrCode';
import { Users, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function AdminPage() {
  const { events, loading } = useEventContext();

  if (loading) {
    return <p className="text-center py-10">Loading events...</p>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-headline text-primary mb-2">Admin Dashboard</h1>
      <p className="text-lg text-muted-foreground mb-8">
        Manage all created events.
      </p>

      {events.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed rounded-lg">
            <h2 className="text-2xl font-semibold">No Events Found</h2>
            <p className="text-muted-foreground mt-2">Create your first event from the homepage.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <Link href={`/event/${event.code}`} key={event.id} className="flex">
                <Card  className="flex flex-col w-full hover:shadow-lg transition-shadow">
                <CardHeader>
                    <CardTitle className="font-headline">{event.name}</CardTitle>
                    <CardDescription>
                    Code: <span className="font-mono text-accent font-bold">{event.code}</span>
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow flex flex-col justify-between">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex-grow">
                            <div className="flex items-center gap-2 text-muted-foreground mb-2">
                                <Users className="w-4 h-4" />
                                <span>{event.members.length} Member(s)</span>
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <ImageIcon className="w-4 h-4" />
                                <span>{event.photos.length} Photo(s)</span>
                            </div>
                        </div>
                        <div className="p-1 border rounded-md bg-white">
                            <QrCode value={event.code} size={80} />
                        </div>
                    </div>
                    {event.members.length > 0 && (
                    <div className="mt-4 pt-4 border-t">
                        <h4 className="font-semibold mb-2 text-sm">Members</h4>
                        <div className="flex flex-wrap gap-2">
                        {event.members.map((member) => (
                            <div key={member.id} className="bg-muted text-muted-foreground text-xs px-2 py-1 rounded-full">
                            {member.name}
                            </div>
                        ))}
                        </div>
                    </div>
                    )}
                </CardContent>
                </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
