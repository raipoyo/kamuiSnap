export interface DevCat {
  id: string;
  name: string;
  role: 'main' | 'developer' | 'bug' | 'mentor';
  skills: string[];
  favoriteFood: string[];
  personality: string;
  specialAbility: string;
  avatarUrl?: string;
  experience: 'junior' | 'senior' | 'lead' | 'architect';
}

export interface DevCatEpisode {
  id: string;
  title: string;
  description: string;
  characters: string[]; // DevCat IDs
  scenarios: DevScenario[];
  hungerLevel: 1 | 2 | 3 | 4 | 5; // 1 = not hungry, 5 = very hungry
  techStack: string[];
  relatedRecipes: string[]; // Recipe IDs
  episodeType: 'daily' | 'adventure' | 'debugging' | 'teamwork' | 'learning';
  createdAt: string;
  illustration?: string;
}

export interface DevScenario {
  id: string;
  title: string;
  situation: string;
  challenge: string;
  solution: string;
  codeExample?: string;
  lesson: string;
  funnyMoment: string;
}

export interface DevCatStory {
  id: string;
  episodeId: string;
  content: string;
  format: 'comic' | 'short_story' | 'illustration';
  panels?: StoryPanel[];
  createdAt: string;
}

export interface StoryPanel {
  id: string;
  order: number;
  image?: string;
  text: string;
  characterAction: string;
  backdrop: 'office' | 'home' | 'cafe' | 'secret_base';
}