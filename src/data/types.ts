export interface Choice {
  text: string;
  nextId: number;
}

export interface Passage {
  id: number;
  paragraphs: string[];
  choices: Choice[];
}

export interface IntroductionContent {
  title: string;
  paragraphs: string[];
  buttonText: string;
}
