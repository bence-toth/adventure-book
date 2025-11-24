// IndexedDB utility for storing and managing adventure YAML files

export interface StoredAdventure {
  id: string;
  title: string;
  content: string; // Raw YAML content
  lastEdited: Date;
  createdAt: Date;
}

const DB_NAME = "AdventureBookDB";
const DB_VERSION = 1;
const STORE_NAME = "stories";

// Opens the IndexedDB database and ensures the object store exists
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

// Saves an adventure to IndexedDB
export const saveAdventure = async (
  adventure: StoredAdventure
): Promise<void> => {
  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.put(adventure);

    request.onsuccess = () => {
      resolve();
    };

    request.onerror = () => {
      reject(new Error("Failed to save adventure"));
    };

    transaction.oncomplete = () => {
      db.close();
    };
  });
};

// Retrieves an adventure from IndexedDB by ID
export const getAdventure = async (
  id: string
): Promise<StoredAdventure | undefined> => {
  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], "readonly");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(id);

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(new Error("Failed to retrieve adventure"));
    };

    transaction.oncomplete = () => {
      db.close();
    };
  });
};

// Lists all stories in IndexedDB, sorted by last edited date (most recent first)
export const listStories = async (): Promise<StoredAdventure[]> => {
  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], "readonly");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();

    request.onsuccess = () => {
      const stories = request.result as StoredAdventure[];
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

// Deletes an adventure from IndexedDB
export const deleteAdventure = async (id: string): Promise<void> => {
  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.delete(id);

    request.onsuccess = () => {
      resolve();
    };

    request.onerror = () => {
      reject(new Error("Failed to delete adventure"));
    };

    transaction.oncomplete = () => {
      db.close();
    };
  });
};

// Updates the content and lastEdited timestamp of an existing adventure
export const updateAdventureContent = async (
  id: string,
  content: string
): Promise<void> => {
  const adventure = await getAdventure(id);

  if (!adventure) {
    throw new Error(`Adventure with id ${id} not found`);
  }

  const updatedAdventure: StoredAdventure = {
    ...adventure,
    content,
    lastEdited: new Date(),
  };

  await saveAdventure(updatedAdventure);
};

// Updates the title and lastEdited timestamp of an existing adventure
export const updateAdventureTitle = async (
  id: string,
  title: string
): Promise<void> => {
  const adventure = await getAdventure(id);

  if (!adventure) {
    throw new Error(`Adventure with id ${id} not found`);
  }

  const updatedAdventure: StoredAdventure = {
    ...adventure,
    title,
    lastEdited: new Date(),
  };

  await saveAdventure(updatedAdventure);
};

// Creates a new adventure with a unique ID
export const createAdventure = async (
  title: string,
  content: string
): Promise<string> => {
  const id = crypto.randomUUID();
  const now = new Date();

  const adventure: StoredAdventure = {
    id,
    title,
    content,
    lastEdited: now,
    createdAt: now,
  };

  await saveAdventure(adventure);
  return id;
};
