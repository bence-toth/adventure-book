interface Choice {
  text: string;
  goto: number;
}

export interface InventoryItem {
  id: string;
  name: string;
}

type Effect =
  | {
      type: "add_item";
      item: string;
    }
  | {
      type: "remove_item";
      item: string;
    };

type RawPassage =
  | {
      text: string;
      notes?: string;
      ending: true;
      type?: "victory" | "defeat" | "neutral";
      choices?: never;
      effects?: never;
    }
  | {
      text: string;
      notes?: string;
      choices: Choice[];
      ending?: never;
      type?: never;
      effects?: Effect[];
    };

interface RawIntro {
  text: string;
  action: string;
}

export interface RawAdventure {
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
      notes?: string;
      ending: true;
      type?: "victory" | "defeat" | "neutral";
      choices?: never;
      effects?: never;
    }
  | {
      paragraphs: string[];
      notes?: string;
      choices: Choice[];
      ending?: never;
      type?: never;
      effects?: Effect[];
    };

interface Intro {
  paragraphs: string[];
  action: string;
}

export interface Adventure {
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
