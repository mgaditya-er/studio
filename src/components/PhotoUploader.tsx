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
  const { setEvents, currentUser } = useEventContext();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || !currentUser) return;

    toast({
      title: 'Uploading...',
      description: `${files.length} photo(s) selected. AI processing will begin shortly.`,
    });

    for (const file of Array.from(files)) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const photoDataUri = reader.result as string;
        const photoId = `${new Date().getTime()}_${Math.random()}`;
        
        const newPhoto: Photo = {
          id: photoId,
          url: photoDataUri,
          uploaderId: currentUser.id,
          caption: 'Processing...',
          themes: [],
          isLowQuality: false, // AI feature placeholder
          isDuplicate: false, // AI feature placeholder
          faces: [], // AI feature placeholder
          processing: true,
        };

        setEvents((prev) =>
          prev.map((event) =>
            event.code === eventCode
              ? { ...event, photos: [...event.photos, newPhoto] }
              : event
          )
        );

        // Simulate AI processing
        setTimeout(async () => {
          try {
            const captionResult = await generatePhotoCaption({
              photoId: photoId,
              photoDataUri,
              faces: ["Person A"], // Placeholder
              activity: "event" // Placeholder
            });

            const categoryResult = await categorizePhoto({
              photoDataUri,
              description: captionResult.caption,
            });

            setEvents((prev) =>
              prev.map((event) => {
                if (event.code === eventCode) {
                  return {
                    ...event,
                    photos: event.photos.map((p) =>
                      p.id === photoId
                        ? {
                            ...p,
                            caption: captionResult.caption,
                            themes: categoryResult.themes,
                            faces: ["Person A"], // Placeholder
                            processing: false,
                          }
                        : p
                    ),
                  };
                }
                return event;
              })
            );
          } catch(err) {
            console.error("AI processing failed", err);
             setEvents((prev) =>
              prev.map((event) => {
                if (event.code === eventCode) {
                  return {
                    ...event,
                    photos: event.photos.map((p) =>
                      p.id === photoId
                        ? {
                            ...p,
                            caption: "AI processing failed.",
                            processing: false,
                          }
                        : p
                    ),
                  };
                }
                return event;
              })
            );
          }
        }, 2000);
      };
    }
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
