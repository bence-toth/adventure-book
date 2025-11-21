import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SquarePlus, EllipsisVertical } from "lucide-react";
import {
  listStories,
  deleteStory,
  createStory,
  type StoredStory,
} from "../data/storyDatabase";
import { Button } from "./common/Button";
import { ContextMenu, ContextMenuItem } from "./common/ContextMenu";
import { ConfirmationModal } from "./common/ConfirmationModal";
import storyTemplate from "../data/story.yaml?raw";
import { getStoryTestRoute, getPassageRoute } from "../constants/routes";
import { getCurrentPassageId } from "../utils/localStorage";
import "./DocumentManager.css";

export const DocumentManager = () => {
  const [stories, setStories] = useState<StoredStory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [storyToDelete, setStoryToDelete] = useState<{
    id: string;
    title: string;
  } | null>(null);
  const [contextMenuOpen, setContextMenuOpen] = useState(false);
  const [contextMenuTrigger, setContextMenuTrigger] =
    useState<HTMLElement | null>(null);
  const [contextMenuStory, setContextMenuStory] = useState<{
    id: string;
    title: string;
  } | null>(null);
  const navigate = useNavigate();

  const loadStories = async () => {
    try {
      setLoading(true);
      setError(null);
      const loadedStories = await listStories();
      setStories(loadedStories);
    } catch (err) {
      setError("Failed to load stories");
      console.error("Error loading stories:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStories();
  }, []);

  const handleOpenStory = (id: string) => {
    // Check if there's a saved passage for this story
    const savedPassageId = getCurrentPassageId(id);

    if (savedPassageId !== null) {
      // Navigate directly to the saved passage
      navigate(getPassageRoute(id, savedPassageId));
    } else {
      // Navigate to the introduction if no saved progress
      navigate(getStoryTestRoute(id));
    }
  };

  const handleMenuClick = (
    e: React.MouseEvent,
    id: string,
    title: string,
    buttonRef: HTMLButtonElement
  ) => {
    e.stopPropagation();
    setContextMenuStory({ id, title });
    setContextMenuTrigger(buttonRef);
    setContextMenuOpen(true);
  };

  const handleDeleteClick = () => {
    if (contextMenuStory) {
      setStoryToDelete({
        id: contextMenuStory.id,
        title: contextMenuStory.title,
      });
      setContextMenuOpen(false);
    }
  };

  const confirmDelete = async () => {
    if (!storyToDelete) return;

    try {
      await deleteStory(storyToDelete.id);
      await loadStories();
    } catch (err) {
      setError("Failed to delete story");
      console.error("Error deleting story:", err);
    } finally {
      setStoryToDelete(null);
    }
  };

  const cancelDelete = () => {
    setStoryToDelete(null);
  };

  const handleCreateStory = async () => {
    const title = "Untitled adventure";

    try {
      // Use the story.yaml template and replace the title
      const contentWithNewTitle = storyTemplate.replace(
        /title:\s*"[^"]*"/,
        `title: "${title}"`
      );

      const id = await createStory(title, contentWithNewTitle);
      navigate(getStoryTestRoute(id));
    } catch (err) {
      setError("Failed to create story");
      console.error("Error creating story:", err);
    }
  };

  const formatDate = (date: Date): string => {
    const dateObj = new Date(date);
    const now = new Date();
    const diffMs = now.getTime() - dateObj.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60)
      return `${diffMins} minute${diffMins > 1 ? "s" : ""} ago`;
    if (diffHours < 24)
      return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;

    return dateObj.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="document-manager">
        <div className="document-manager-loading">Loading stories...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="document-manager">
        <div className="document-manager-error">
          {error}
          <Button onClick={loadStories}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="document-manager">
      <div className="document-manager-list">
        {/* New Story Card */}
        <button
          className="story-card story-card-new"
          onClick={handleCreateStory}
        >
          <SquarePlus size={48} strokeWidth={1.5} />
          <p>Create a new adventure</p>
        </button>

        {/* Existing Stories */}
        {stories.map((story) => (
          <div key={story.id} className="story-card">
            <button
              className="story-card-clickable"
              onClick={() => handleOpenStory(story.id)}
              aria-label={`Open ${story.title}`}
            >
              <div className="story-card-content">
                <h2 className="story-card-title">{story.title}</h2>
              </div>
            </button>
            <div className="story-card-footer">
              <p className="story-card-date">
                Last edited {formatDate(story.lastEdited)}
              </p>
              <button
                className="story-card-menu"
                onClick={(e) =>
                  handleMenuClick(
                    e,
                    story.id,
                    story.title,
                    e.currentTarget as HTMLButtonElement
                  )
                }
                aria-label={`Open menu for ${story.title}`}
              >
                <EllipsisVertical size={20} strokeWidth={2} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <ContextMenu
        open={contextMenuOpen}
        onOpenChange={setContextMenuOpen}
        triggerRef={contextMenuTrigger}
      >
        <ContextMenuItem onClick={handleDeleteClick}>Delete</ContextMenuItem>
      </ContextMenu>

      <ConfirmationModal
        open={!!storyToDelete}
        onOpenChange={(open) => {
          if (!open) cancelDelete();
        }}
        title="Delete Story"
        message={
          <p>
            Are you sure you want to delete "{storyToDelete?.title}"? This
            action cannot be undone.
          </p>
        }
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        variant="danger"
      />
    </div>
  );
};
