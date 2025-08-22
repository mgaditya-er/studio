
'use client';

import { useRef, useState } from 'react';
import { Button } from './ui/button';
import { Upload } from 'lucide-react';
import { useEventContext } from '@/context/EventContext';
import { useToast } from '@/hooks/use-toast';
import type { Photo } from '@/types';
import { generatePhotoCaption } from '@/ai/flows/generate-photo-caption';
import { categorizePhoto } from '@/ai/flows/categorize-photo';
import { Progress } from './ui/progress';

interface PhotoUploaderProps {
  eventCode: string;
  onProgressUpdate: (progress: number | null) => void;
}

export function PhotoUploader({ eventCode, onProgressUpdate }: PhotoUploaderProps) {
  const { events, updateEvent, currentUser, getUniqueId } = useEventContext();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || !currentUser) return;
    
    const event = events.find(e => e.code === eventCode);
    if (!event) return;

    const totalFiles = files.length;
    if (totalFiles === 0) return;

    onProgressUpdate(0);

    toast({
      title: 'Uploading...',
      description: `${totalFiles} photo(s) selected. AI processing will begin shortly.`,
    });

    let newPhotos: Photo[] = [];
    
    // Step 1: Read all files and create placeholder photos
    for (const file of Array.from(files)) {
      const readPromise = new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const photoDataUri = await readPromise;
      const photoId = getUniqueId();
      
      const newPhoto: Photo = {
        id: photoId,
        url: photoDataUri,
        uploaderId: currentUser.id,
        caption: 'Processing...',
        themes: [],
        isLowQuality: false,
        isDuplicate: false,
        faces: [],
        processing: true,
      };
      newPhotos.push(newPhoto);
    }
    
    // Step 2: Batch update event with all new photos at once to make them appear instantly
    const updatedPhotos = [...event.photos, ...newPhotos];
    await updateEvent(event.id, { photos: updatedPhotos });

    // Step 3: Process each new photo and update progress
    let processedCount = 0;

    const processingPromises = newPhotos.map(photo => (async () => {
      try {
        // AI captioning
        const captionResult = await generatePhotoCaption({
          photoId: photo.id,
          photoDataUri: photo.url,
          faces: [], // Face detection can be added here in the future
          activity: event.name 
        });

        // AI Theming
        const categoryResult = await categorizePhoto({
          photoDataUri: photo.url,
          description: captionResult.caption,
        });

        // Fetch the latest event data before updating to avoid race conditions
        const currentEvent = events.find(e => e.id === event.id);
        if (currentEvent) {
           const finalPhotos = currentEvent.photos.map((p) =>
            p.id === photo.id
              ? {
                  ...p,
                  caption: captionResult.caption,
                  themes: categoryResult.themes,
                  processing: false,
                }
              : p
          );
           await updateEvent(event.id, { photos: finalPhotos });
        }
      } catch(err) {
        console.error("AI processing failed", err);
        const currentEvent = events.find(e => e.id === event.id);
         if (currentEvent) {
          const finalPhotos = currentEvent.photos.map((p) =>
            p.id === photo.id
              ? {
                  ...p,
                  caption: "AI processing failed.",
                  processing: false,
                }
              : p
          );
          await updateEvent(event.id, { photos: finalPhotos });
        }
      } finally {
        processedCount++;
        const progress = (processedCount / totalFiles) * 100;
        onProgressUpdate(progress);
      }
    })());
    
    await Promise.all(processingPromises);

    // Reset progress when done
    setTimeout(() => onProgressUpdate(null), 2000);
  };

  return (
    <div className="flex-shrink-0">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/*"
        multiple
      />
      <Button onClick={() => fileInputRef.current?.click()} className="mt-4 md:mt-0">
        <Upload className="mr-2 h-4 w-4" />
        Upload Photos
      </Button>
    </div>
  );
}
