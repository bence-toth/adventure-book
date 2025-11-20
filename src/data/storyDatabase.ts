/**
 * IndexedDB utility for storing and managing story YAML files
 */

export interface StoredStory {
  id: string;
  title: string;
  content: string; // Raw YAML content
  lastEdited: Date;
  createdAt: Date;
}

const DB_NAME = "AdventureBookDB";
const DB_VERSION = 1;
const STORE_NAME = "stories";

/**
 * Opens the IndexedDB database and ensures the object store exists
 */
const openDatabase = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      reject(new Error("Failed to open database"));
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const objectStore = db.createObjectStore(STORE_NAME, { keyPath: "id" });
        objectStore.createIndex("title", "title", { unique: false });
        objectStore.createIndex("lastEdited", "lastEdited", { unique: false });
      }
    };
  });
};

/**
 * Saves a story to IndexedDB
 */
export const saveStory = async (story: StoredStory): Promise<void> => {
  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.put(story);

    request.onsuccess = () => {
      resolve();
    };

    request.onerror = () => {
      reject(new Error("Failed to save story"));
    };

    transaction.oncomplete = () => {
      db.close();
    };
  });
};

/**
 * Retrieves a story from IndexedDB by ID
 */
export const getStory = async (
  id: string
): Promise<StoredStory | undefined> => {
  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], "readonly");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(id);

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(new Error("Failed to retrieve story"));
    };

    transaction.oncomplete = () => {
      db.close();
    };
  });
};

/**
 * Lists all stories in IndexedDB, sorted by last edited date (most recent first)
 */
export const listStories = async (): Promise<StoredStory[]> => {
  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], "readonly");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();

    request.onsuccess = () => {
      const stories = request.result as StoredStory[];
      // Sort by lastEdited in descending order
      stories.sort((a, b) => {
        return (
          new Date(b.lastEdited).getTime() - new Date(a.lastEdited).getTime()
        );
      });
      resolve(stories);
    };

    request.onerror = () => {
      reject(new Error("Failed to list stories"));
    };

    transaction.oncomplete = () => {
      db.close();
    };
  });
};

/**
 * Deletes a story from IndexedDB
 */
export const deleteStory = async (id: string): Promise<void> => {
  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.delete(id);

    request.onsuccess = () => {
      resolve();
    };

    request.onerror = () => {
      reject(new Error("Failed to delete story"));
    };

    transaction.oncomplete = () => {
      db.close();
    };
  });
};

/**
 * Updates the content and lastEdited timestamp of an existing story
 */
export const updateStoryContent = async (
  id: string,
  content: string
): Promise<void> => {
  const story = await getStory(id);

  if (!story) {
    throw new Error(`Story with id ${id} not found`);
  }

  const updatedStory: StoredStory = {
    ...story,
    content,
    lastEdited: new Date(),
  };

  await saveStory(updatedStory);
};

/**
 * Updates the title and lastEdited timestamp of an existing story
 */
export const updateStoryTitle = async (
  id: string,
  title: string
): Promise<void> => {
  const story = await getStory(id);

  if (!story) {
    throw new Error(`Story with id ${id} not found`);
  }

  const updatedStory: StoredStory = {
    ...story,
    title,
    lastEdited: new Date(),
  };

  await saveStory(updatedStory);
};

/**
 * Creates a new story with a unique ID
 */
export const createStory = async (
  title: string,
  content: string
): Promise<string> => {
  const id = crypto.randomUUID();
  const now = new Date();

  const story: StoredStory = {
    id,
    title,
    content,
    lastEdited: now,
    createdAt: now,
  };

  await saveStory(story);
  return id;
};
