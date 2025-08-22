
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useEventContext } from '@/context/EventContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import type { User } from '@/types';
import { LogIn, User as UserIcon } from 'lucide-react';

export function JoinEventForm() {
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const { updateEvent, setCurrentUser, getUniqueId, getEventByCode } = useEventContext();
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const eventCode = code.trim().toUpperCase();

    if (!eventCode || !name.trim()) {
      toast({
        title: 'Information Required',
        description: 'Please enter your name and an event code to join.',
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
    
    // Create a new user 
    const newUser: User = {
        id: getUniqueId(),
        name: name.trim(),
    };
    setCurrentUser(newUser);

    // Add user to event members if not already there (by name, for simplicity in this version)
    if (!event.members.some(m => m.name.toLowerCase() === newUser.name.toLowerCase())) {
        const updatedMembers = [...event.members, newUser];
        await updateEvent(event.id, { members: updatedMembers });
    }

    toast({
      title: 'Success!',
      description: `Welcome, ${newUser.name}! You have joined the event: ${event.name}`,
    });

    router.push(`/event/${event.code}`);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="space-y-2">
        <div className="relative">
            <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
            type="text"
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="pl-10"
            />
        </div>
        <Input
            type="text"
            placeholder="Enter event code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="text-center tracking-widest font-mono"
            maxLength={6}
        />
      </div>
      <Button type="submit" className="w-full">
        <LogIn className="mr-2 h-4 w-4" />
        Join Event
      </Button>
    </form>
  );
}
