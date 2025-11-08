export interface Choice {
  text: string;
  goto: number;
}

export type RawPassage =
  | {
      text: string;
      ending: true;
      type?: "victory" | "defeat" | "neutral";
      choices?: never;
    }
  | {
      text: string;
      choices: Choice[];
      ending?: never;
      type?: never;
    };

export interface RawIntro {
  text: string;
  action: string;
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

export type Passage =
  | {
      paragraphs: string[];
      ending: true;
      type?: "victory" | "defeat" | "neutral";
      choices?: never;
    }
  | {
      paragraphs: string[];
      choices: Choice[];
      ending?: never;
      type?: never;
    };

export interface Intro {
  paragraphs: string[];
  action: string;
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
  action: string;
}
