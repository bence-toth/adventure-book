export interface Choice {
  text: string;
  goto: number;
}

export interface RawPassage {
  text: string;
  choices?: Choice[];
  ending?: boolean;
  type?: "victory" | "defeat" | "neutral";
}

export interface RawIntro {
  text: string;
}

export interface RawStory {
  metadata: {
    title: string;
    author: string;
    version: string;
  };
  intro: RawIntro;
  passages: Record<number, RawPassage>;
}

export interface Passage {
  paragraphs: string[];
  choices?: Choice[];
  ending?: boolean;
  type?: "victory" | "defeat" | "neutral";
}

export interface Intro {
  paragraphs: string[];
}

export interface Story {
  metadata: {
    title: string;
    author: string;
    version: string;
  };
  intro: Intro;
  passages: Record<number, Passage>;
}

export interface IntroductionContent {
  title: string;
  paragraphs: string[];
  buttonText: string;
}
