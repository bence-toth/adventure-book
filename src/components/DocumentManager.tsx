import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SquarePlus, EllipsisVertical } from "lucide-react";
import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  shift,
  useClick,
  useDismiss,
  useRole,
  useInteractions,
  FloatingFocusManager,
} from "@floating-ui/react";
import {
  listStories,
  deleteStory,
  createStory,
  type StoredStory,
} from "../data/storyDatabase";
import { Button } from "./Button";
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
  const [contextMenuStory, setContextMenuStory] = useState<{
    id: string;
    title: string;
  } | null>(null);
  const navigate = useNavigate();

  // Floating UI setup for context menu
  const { refs, floatingStyles, context } = useFloating({
    open: contextMenuOpen,
    onOpenChange: setContextMenuOpen,
    middleware: [offset(4), flip(), shift({ padding: 8 })],
    whileElementsMounted: autoUpdate,
    placement: "top-end",
  });

  const click = useClick(context);
  const dismiss = useDismiss(context);
  const role = useRole(context);

  const { getFloatingProps } = useInteractions([click, dismiss, role]);

  // Floating UI setup for delete confirmation modal
  const { refs: modalRefs, context: modalContext } = useFloating({
    open: !!storyToDelete,
    onOpenChange: (open) => {
      if (!open) {
        cancelDelete();
      }
    },
  });

  const modalDismiss = useDismiss(modalContext, {
    escapeKey: true,
    outsidePress: true,
  });
  const modalRole = useRole(modalContext);

  const { getFloatingProps: getModalFloatingProps } = useInteractions([
    modalDismiss,
    modalRole,
  ]);

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

  // Lock scroll when modal is open
  useEffect(() => {
    if (storyToDelete) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [storyToDelete]);

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
    refs.setReference(buttonRef);
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

      {/* Context Menu */}
      {contextMenuOpen && (
        <FloatingFocusManager context={context} modal={false}>
          <div
            ref={refs.setFloating}
            className="context-menu"
            style={floatingStyles}
            {...getFloatingProps()}
          >
            <button
              className="context-menu-item context-menu-item-danger"
              onClick={handleDeleteClick}
            >
              Delete
            </button>
          </div>
        </FloatingFocusManager>
      )}

      {/* Modal Overlay */}
      {storyToDelete && (
        <FloatingFocusManager context={modalContext} modal initialFocus={0}>
          <div className="modal-overlay" onClick={cancelDelete}>
            <dialog
              ref={modalRefs.setFloating}
              open
              className="delete-dialog"
              onClick={(e) => e.stopPropagation()}
              {...getModalFloatingProps()}
            >
              <div className="delete-dialog-content">
                <h2>Delete Story</h2>
                <p>
                  Are you sure you want to delete "{storyToDelete.title}"? This
                  action cannot be undone.
                </p>
                <div className="delete-dialog-actions">
                  <Button onClick={cancelDelete}>Cancel</Button>
                  <Button variant="danger" onClick={confirmDelete}>
                    Delete
                  </Button>
                </div>
              </div>
            </dialog>
          </div>
        </FloatingFocusManager>
      )}
    </div>
  );
};
