export interface Choice {
  text: string;
  goto: number;
  requirements?: Record<string, unknown>;
}

export interface Passage {
  text: string;
  paragraphs?: string[];
  choices?: Choice[];
  ending?: boolean;
  type?: "victory" | "defeat" | "neutral";
}

export interface Story {
  metadata: {
    title: string;
    author: string;
    version: string;
  };
  intro: {
    text: string;
    paragraphs?: string[];
  };
  passages: Record<number, Passage>;
}

export interface IntroductionContent {
  title: string;
  paragraphs: string[];
  buttonText: string;
}
