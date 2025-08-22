export type Photo = {
  id: string;
  url: string;
  uploaderId: string;
  caption: string;
  themes: string[];
  isLowQuality: boolean;
  isDuplicate: boolean;
  faces: string[];
  processing: boolean;
};

export type User = {
  id: string;
  name: string;
};

export type Event = {
  id: string;
  name: string;
  code: string;
  members: User[];
  photos: Photo[];
  tripStory: string;
  highlights: string[];
};
