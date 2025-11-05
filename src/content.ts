import type { IntroductionContent, Passage } from "./data/types";

export const introduction: IntroductionContent = {
  title: "Welcome to the Code Adventure",
  paragraphs: [
    "Welcome, brave adventurer, to a digital realm where code comes alive and algorithms dance through the very fabric of reality. You are about to embark on an interactive journey through the mystical world of programming concepts, where every choice you make will shape your understanding of the computational universe.",
    "In this adventure, you'll encounter wise lambdas sharing ancient functional wisdom, navigate through mazes of data structures, climb towering binary trees, and discover the elegant patterns that govern the world of software. Each path you choose will reveal new insights about the art and science of programming.",
    "Your adventure awaits. Will you step through the digital gateway and discover what lies beyond the screen? The choice is yours, but remember - in the world of code, every decision creates new possibilities.",
  ],
  buttonText: "Begin Your Adventure",
};

export const passages: Passage[] = [
  {
    id: 1,
    text: "In the beginning, there was code. And the code was good. You find yourself standing at the entrance of a mysterious digital realm where algorithms dance and data flows like rivers. What do you choose to do?",
    choices: [
      { text: "Enter the realm of functions", nextId: 2 },
      { text: "Explore the data structures", nextId: 3 },
      { text: "Turn back to safety", nextId: 4 },
    ],
  },
  {
    id: 2,
    text: "You step into the realm of functions, where pure functions gleam like crystals and side effects lurk in the shadows. A wise lambda approaches you with ancient knowledge.",
    choices: [
      { text: "Listen to the lambda's wisdom", nextId: 5 },
      { text: "Continue deeper into functional territory", nextId: 6 },
      { text: "Return to the entrance", nextId: 1 },
    ],
  },
  {
    id: 3,
    text: "You wander into a vast library of data structures. Arrays stretch endlessly in perfect rows, while trees tower above you with their branching networks. Maps and sets organize themselves in mysterious patterns.",
    choices: [
      { text: "Climb the binary tree", nextId: 7 },
      { text: "Navigate through the hash table maze", nextId: 8 },
      { text: "Return to the entrance", nextId: 1 },
    ],
  },
  {
    id: 4,
    text: "You decide to turn back, but the digital realm won't let you leave so easily. The exit portal flickers and shows you a glimpse of what lies beyond.",
    choices: [
      { text: "Step through the flickering portal", nextId: 9 },
      { text: "Stay and face your coding destiny", nextId: 1 },
    ],
  },
  {
    id: 5,
    text: "The lambda whispers secrets of immutability and composition. 'Remember,' it says, 'the power lies not in changing the world, but in creating new realities from the old.'",
    choices: [
      { text: "Ask about higher-order functions", nextId: 10 },
      { text: "Thank the lambda and move on", nextId: 2 },
    ],
  },
  {
    id: 6,
    text: "Deeper in the functional realm, you discover recursive patterns that seem to fold in on themselves infinitely. The beauty is mesmerizing but dangerous.",
    choices: [
      { text: "Embrace the recursion", nextId: 11 },
      { text: "Step back carefully", nextId: 2 },
    ],
  },
  {
    id: 7,
    text: "From the top of the binary tree, you can see the entire data structure kingdom. Balanced and unbalanced trees sway in the algorithmic wind.",
    choices: [
      { text: "Enjoy the view and climb down", nextId: 3 },
      { text: "Jump to the next tree", nextId: 12 },
    ],
  },
  {
    id: 8,
    text: "You navigate through the hash table maze, where collision resolution creates unexpected paths. You emerge wiser about the complexity of constant-time operations.",
    choices: [
      { text: "Explore more data structures", nextId: 3 },
      { text: "Head back to the entrance", nextId: 1 },
    ],
  },
  {
    id: 9,
    text: "You step through the portal and find yourself back in the real world, but with new knowledge burning in your mind. The adventure has changed you forever.",
    choices: [{ text: "Start a new adventure", nextId: 1 }],
  },
  {
    id: 10,
    text: "The lambda's eyes glow with excitement. 'Higher-order functions,' it explains, 'are the composers of the coding symphony. They take functions and return new functions, creating beautiful abstractions.'",
    choices: [
      { text: "Ask for a practical example", nextId: 13 },
      { text: "Thank the lambda", nextId: 5 },
    ],
  },
  {
    id: 11,
    text: "You embrace the recursion and find yourself in an infinite loop of discovery. Each iteration reveals new patterns, but be careful not to lose yourself in the endless descent.",
    choices: [
      { text: "Find the base case and return", nextId: 6 },
      { text: "Continue recursing (dangerous!)", nextId: 11 },
    ],
  },
  {
    id: 12,
    text: "You leap gracefully between trees, learning the art of tree traversal. In-order, pre-order, post-order - each method reveals different secrets of the data.",
    choices: [
      { text: "Master all traversal methods", nextId: 7 },
      { text: "Climb down to solid ground", nextId: 3 },
    ],
  },
  {
    id: 13,
    text: "The lambda conjures a shimmering example: 'Behold, map, filter, and reduce - the trinity of functional transformation. They take functions as arguments and transform entire collections with elegant simplicity.'",
    choices: [
      { text: "Practice with the trinity", nextId: 14 },
      { text: "Ask about more advanced concepts", nextId: 10 },
    ],
  },
  {
    id: 14,
    text: "You practice with map, filter, and reduce, feeling the power of functional programming flow through your code. Arrays transform before your eyes, and you understand the elegance of declarative programming.",
    choices: [
      { text: "Master these concepts completely", nextId: 15 },
      { text: "Explore other functional concepts", nextId: 5 },
    ],
  },
  {
    id: 15,
    text: "Congratulations! You have mastered the fundamental concepts of this digital realm. You stand now as a true code adventurer, ready for whatever challenges await in the vast universe of programming.",
    choices: [
      { text: "Begin a new adventure", nextId: 1 },
      { text: "Exit the realm as a master", nextId: 9 },
    ],
  },
];
