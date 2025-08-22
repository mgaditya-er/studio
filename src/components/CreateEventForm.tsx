
'use client';

import { useState } from 'react';
import { useEventContext } from '@/context/EventContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import type { Event, User } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { QrCode } from './QrCode';
import { useRouter } from 'next/navigation';
import { PartyPopper, User as UserIcon } from 'lucide-react';

export function CreateEventForm() {
  const [eventName, setEventName] = useState('');
  const [creatorName, setCreatorName] = useState('');
  const { addEvent, setCurrentUser, getUniqueId } = useEventContext();
  const { toast } = useToast();
  const [createdEvent, setCreatedEvent] = useState<Event | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventName.trim() || !creatorName.trim()) {
      toast({
        title: 'Information Required',
        description: 'Please enter your name and an event name.',
        variant: 'destructive',
      });
      return;
    }

    try {
      // Create the new user first
      const newUser: User = {
        id: getUniqueId(),
        name: creatorName.trim(),
      };
      setCurrentUser(newUser);

      // Pass the creator as the first member
      const newEvent = await addEvent(eventName, newUser);
      
      setCreatedEvent(newEvent);
      setEventName('');
      setCreatorName('');

    } catch (error) {
       console.error("Failed to create event:", error);
       toast({
        title: 'Error',
        description: 'Could not create the event.',
        variant: 'destructive',
      });
    }
  };
  
  const goToEvent = () => {
    if(createdEvent) {
      router.push(`/event/${createdEvent.code}`);
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="space-y-2">
            <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                type="text"
                placeholder="Your Name"
                value={creatorName}
                onChange={(e) => setCreatorName(e.target.value)}
                className="pl-10"
                />
            </div>
            <Input
            type="text"
            placeholder="e.g., Summer Vacation 2024"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            className="text-center"
            />
        </div>
        <Button type="submit" className="w-full">
          <PartyPopper className="mr-2 h-4 w-4" />
          Create Event
        </Button>
      </form>

      <Dialog open={!!createdEvent} onOpenChange={() => setCreatedEvent(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-headline text-2xl text-center">
              Event Created!
            </DialogTitle>
            <DialogDescription className="text-center">
              Share this code or QR code with your friends to join the album.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center gap-4 py-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Event Name</p>
              <p className="text-lg font-semibold">{createdEvent?.name}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Join Code</p>
              <p className="font-mono font-bold text-3xl text-primary tracking-widest bg-muted p-2 rounded-md">
                {createdEvent?.code}
              </p>
            </div>
            <div className="p-2 border rounded-md bg-white">
              <QrCode value={createdEvent?.code || ''} />
            </div>
          </div>
          <DialogFooter className="sm:justify-center">
             <Button onClick={goToEvent}>Go to Event Page</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
