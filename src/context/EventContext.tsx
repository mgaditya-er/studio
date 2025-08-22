'use client';

import type { Event, User } from '@/types';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface EventContextType {
  events: Event[];
  setEvents: React.Dispatch<React.SetStateAction<Event[]>>;
  currentUser: User | null;
  setCurrentUser: React.Dispatch<React.SetStateAction<User | null>>;
  loading: boolean;
}

const EventContext = createContext<EventContextType | undefined>(undefined);

export const EventProvider = ({ children }: { children: ReactNode }) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedEvents = localStorage.getItem('albumace_events');
      if (storedEvents) {
        setEvents(JSON.parse(storedEvents));
      }
      const storedUser = localStorage.getItem('albumace_currentUser');
      if (storedUser) {
        setCurrentUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Failed to parse from localStorage', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!loading) {
      try {
        localStorage.setItem('albumace_events', JSON.stringify(events));
      } catch (error) {
        console.error('Failed to save events to localStorage', error);
      }
    }
  }, [events, loading]);

  useEffect(() => {
    if (!loading) {
      try {
        localStorage.setItem('albumace_currentUser', JSON.stringify(currentUser));
      } catch (error) {
        console.error('Failed to save user to localStorage', error);
      }
    }
  }, [currentUser, loading]);

  return (
    <EventContext.Provider value={{ events, setEvents, currentUser, setCurrentUser, loading }}>
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
