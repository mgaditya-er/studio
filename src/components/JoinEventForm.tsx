
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useEventContext } from '@/context/EventContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import type { User } from '@/types';
import { LogIn } from 'lucide-react';

export function JoinEventForm() {
  const [code, setCode] = useState('');
  const { events, updateEvent, currentUser, setCurrentUser, getUniqueId, getEventByCode } = useEventContext();
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const eventCode = code.trim().toUpperCase();

    if (!eventCode) {
      toast({
        title: 'Event Code Required',
        description: 'Please enter an event code to join.',
        variant: 'destructive',
      });
      return;
    }

    const event = await getEventByCode(eventCode);

    if (!event) {
      toast({
        title: 'Invalid Code',
        description: 'The event code does not exist. Please check and try again.',
        variant: 'destructive',
      });
      return;
    }
    
    // For demo purposes, create a new user or find an existing one
    let userToJoin = currentUser;
    if (!userToJoin) {
      userToJoin = {
          id: getUniqueId(),
          name: `User ${getUniqueId().substring(0, 4)}`,
      };
      setCurrentUser(userToJoin);
    }

    // Add user to event members if not already there
    if (userToJoin) {
      if (!event.members.some(m => m.id === userToJoin!.id)) {
        const updatedMembers = [...event.members, userToJoin];
        await updateEvent(event.id, { members: updatedMembers });
      }
    }


    toast({
      title: 'Success!',
      description: `You have joined the event: ${event.name}`,
    });

    router.push(`/event/${event.code}`);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input
        type="text"
        placeholder="Enter event code"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        className="text-center tracking-widest font-mono"
        maxLength={6}
      />
      <Button type="submit" className="w-full">
        <LogIn className="mr-2 h-4 w-4" />
        Join Event
      </Button>
    </form>
  );
}
