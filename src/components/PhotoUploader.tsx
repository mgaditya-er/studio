
'use client';

import { useRef } from 'react';
import { Button } from './ui/button';
import { Upload } from 'lucide-react';
import { useEventContext } from '@/context/EventContext';
import { useToast } from '@/hooks/use-toast';
import type { Photo } from '@/types';
import { generatePhotoCaption } from '@/ai/flows/generate-photo-caption';
import { categorizePhoto } from '@/ai/flows/categorize-photo';

interface PhotoUploaderProps {
  eventCode: string;
}

export function PhotoUploader({ eventCode }: PhotoUploaderProps) {
  const { events, updateEvent, currentUser, getUniqueId } = useEventContext();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || !currentUser) return;
    
    const event = events.find(e => e.code === eventCode);
    if (!event) return;

    toast({
      title: 'Uploading...',
      description: `${files.length} photo(s) selected. AI processing will begin shortly.`,
    });

    let newPhotos: Photo[] = [];

    for (const file of Array.from(files)) {
      const reader = new FileReader();
      
      const readPromise = new Promise<string>((resolve, reject) => {
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
    
    // Batch update event with all new photos
    const updatedPhotos = [...event.photos, ...newPhotos];
    await updateEvent(event.id, { photos: updatedPhotos });


    // Process each new photo
    newPhotos.forEach(photo => {
      // No need for setTimeout, just run the async processing
      (async () => {
        try {
          const captionResult = await generatePhotoCaption({
            photoId: photo.id,
            photoDataUri: photo.url,
            faces: ["Person A"], // Placeholder
            activity: "event" // Placeholder
          });

          const categoryResult = await categorizePhoto({
            photoDataUri: photo.url,
            description: captionResult.caption,
          });

          // Fetch the latest event data before updating
          const currentEvent = events.find(e => e.id === event.id);
          if (currentEvent) {
             const finalPhotos = currentEvent.photos.map((p) =>
              p.id === photo.id
                ? {
                    ...p,
                    caption: captionResult.caption,
                    themes: categoryResult.themes,
                    faces: ["Person A"], // Placeholder
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
        }
      })();
    });
  };

  return (
    <div>
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
