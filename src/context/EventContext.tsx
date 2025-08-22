
'use client';

import type { Event, User } from '@/types';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { db } from '@/lib/firebase';
import { collection, doc, getDoc, getDocs, onSnapshot, setDoc, query, where } from 'firebase/firestore';

// A simple, consistent unique ID generator
const getUniqueId = () => `id_${new Date().getTime()}_${Math.random().toString(36).substring(2, 9)}`;


interface EventContextType {
  events: Event[];
  addEvent: (eventName: string) => Promise<Event>;
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
  const [hydrated, setHydrated] = useState(false);


  useEffect(() => {
    // Load current user from localStorage only on the client
    try {
        const storedUser = localStorage.getItem('albumace_currentUser');
        if (storedUser) {
            setCurrentUser(JSON.parse(storedUser));
        }
    } catch (error) {
        console.error('Failed to parse user from localStorage', error);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;

    const unsubscribe = onSnapshot(collection(db, 'events'), (snapshot) => {
      const eventsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Event));
      setEventsState(eventsData);
      setLoading(false);
    }, (error) => {
        console.error("Error fetching events from Firestore:", error);
        setLoading(false);
    });

    return () => unsubscribe();
  }, [hydrated]);

  useEffect(() => {
    // Save current user to localStorage
    if (hydrated && currentUser) {
        try {
            localStorage.setItem('albumace_currentUser', JSON.stringify(currentUser));
        } catch (error) {
            console.error('Failed to save user to localStorage', error);
        }
    }
  }, [currentUser, hydrated]);

  const addEvent = async (eventName: string): Promise<Event> => {
    const generateCode = () => getUniqueId().substring(0, 6).toUpperCase();

    const newEvent: Event = {
      id: getUniqueId(),
      name: eventName,
      code: generateCode(),
      members: [],
      photos: [],
      tripStory: '',
      highlights: [],
    };

    await setDoc(doc(db, "events", newEvent.id), newEvent);
    return newEvent;
  };

  const updateEvent = async (eventId: string, eventData: Partial<Event>) => {
    const eventRef = doc(db, 'events', eventId);
    try {
      // Get the latest document before updating to avoid overwriting with stale data
      const docSnap = await getDoc(eventRef);
      if (docSnap.exists()) {
        const existingData = docSnap.data();
        await setDoc(eventRef, { ...existingData, ...eventData });
      } else {
         await setDoc(eventRef, eventData, { merge: true });
      }
    } catch (error) {
      console.error('Failed to update event in Firestore', error);
    }
  };
  
  const getEventByCode = async (code: string): Promise<Event | null> => {
    const q = query(collection(db, "events"), where("code", "==", code.toUpperCase()));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return null;
    }

    const eventDoc = querySnapshot.docs[0];
    return { id: eventDoc.id, ...eventDoc.data() } as Event;
  }

  if (!hydrated) {
      return null;
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
