
'use client';

import type { Event, User } from '@/types';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// A simple, consistent unique ID generator
const getUniqueId = () => `id_${new Date().getTime()}_${Math.random().toString(36).substring(2, 9)}`;

interface EventContextType {
  events: Event[];
  addEvent: (eventName: string, creator: User) => Promise<Event>;
  updateEvent: (eventId: string, eventData: Partial<Event>) => Promise<void>;
  currentUser: User | null;
  setCurrentUser: React.Dispatch<React.SetStateAction<User | null>>;
  loading: boolean;
  getUniqueId: () => string;
  getEventByCode: (code: string) => Promise<Event | null>;
}

const EventContext = createContext<EventContextType | undefined>(undefined);

export const EventProvider = ({ children }: { children: ReactNode }) => {
  const [events, setEventsState] = useState<Event[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Hydration check
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    setHydrated(true);
  }, []);


  useEffect(() => {
    if (!hydrated) return; 
    try {
      const storedEvents = localStorage.getItem('albumace_events');
      if (storedEvents) {
        setEventsState(JSON.parse(storedEvents));
      }
      const storedUser = localStorage.getItem('albumace_currentUser');
      if (storedUser) {
        setCurrentUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Failed to parse from localStorage', error);
    }
    setLoading(false);
  }, [hydrated]);

  useEffect(() => {
    if (!hydrated || loading) return;
    try {
        localStorage.setItem('albumace_events', JSON.stringify(events));
        if (currentUser) {
            localStorage.setItem('albumace_currentUser', JSON.stringify(currentUser));
        } else {
            localStorage.removeItem('albumace_currentUser');
        }
    } catch (error) {
        console.error('Failed to save to localStorage', error);
    }
  }, [events, currentUser, hydrated, loading]);

  const addEvent = async (eventName: string, creator: User): Promise<Event> => {
    const generateCode = () => getUniqueId().substring(0, 6).toUpperCase();
    const newEvent: Event = {
      id: getUniqueId(),
      name: eventName,
      code: generateCode(),
      members: [creator], // Add the creator as the first member
      photos: [],
      tripStory: '',
      highlights: [],
    };
    setEventsState((prevEvents) => [...prevEvents, newEvent]);
    return newEvent;
  };

  const updateEvent = async (eventId: string, eventData: Partial<Event>) => {
    setEventsState((prevEvents) =>
      prevEvents.map((event) =>
        event.id === eventId ? { ...event, ...eventData } : event
      )
    );
  };
  
  const getEventByCode = async (code: string): Promise<Event | null> => {
    const event = events.find(e => e.code.toUpperCase() === code.toUpperCase());
    return event || null;
  }
  
  if (!hydrated) {
    return null; // Don't render on the server
  }

  return (
    <EventContext.Provider value={{ events, addEvent, updateEvent, currentUser, setCurrentUser, loading, getUniqueId, getEventByCode }}>
      {children}
    </EventContext.Provider>
  );
};

export const useEventContext = () => {
  const context = useContext(EventContext);
  if (context === undefined) {
    throw new Error('useEventContext must be used within an EventProvider');
  }
  return context;
};
