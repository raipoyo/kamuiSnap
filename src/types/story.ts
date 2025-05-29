export interface Character {
  id: string;
  name: string;
  nameJa: string;
  description: string;
  skills: string[];
  personality: string[];
  specialMove: string;
}

export interface StoryEpisode {
  id: string;
  title: string;
  titleJa: string;
  content: string;
  contentJa: string;
  characterId: string;
  tags: string[];
  technicalElements: string[];
  publishedAt: string;
  episodeNumber: number;
}

export interface StorySettings {
  location: string;
  time: string;
  mood: string;
  technicalContext: string;
}