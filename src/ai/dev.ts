import { config } from 'dotenv';
config();

import '@/ai/flows/suggest-highlights.ts';
import '@/ai/flows/categorize-photo.ts';
import '@/ai/flows/summarize-album.ts';
import '@/ai/flows/generate-photo-caption.ts';