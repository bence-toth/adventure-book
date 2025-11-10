export interface Choice {
  text: string;
  goto: number;
}

export interface InventoryItem {
  id: string;
  name: string;
}

export type Effect =
  | {
      type: "add_item";
      item: string;
    }
  | {
      type: "remove_item";
      item: string;
    };

export type RawPassage =
  | {
      text: string;
      ending: true;
      type?: "victory" | "defeat" | "neutral";
      choices?: never;
      effects?: Effect[];
    }
  | {
      text: string;
      choices: Choice[];
      ending?: never;
      type?: never;
      effects?: Effect[];
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
  items?: InventoryItem[];
}

export type Passage =
  | {
      paragraphs: string[];
      ending: true;
      type?: "victory" | "defeat" | "neutral";
      choices?: never;
      effects?: never;
    }
  | {
      paragraphs: string[];
      choices: Choice[];
      ending?: never;
      type?: never;
      effects?: Effect[];
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
  items: InventoryItem[];
}

export interface IntroductionContent {
  title: string;
  paragraphs: string[];
  action: string;
}
