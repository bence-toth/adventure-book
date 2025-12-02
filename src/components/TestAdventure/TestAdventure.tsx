import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useCallback, useMemo } from "react";
import {
  getAdventureTestPassageRoute,
  SPECIAL_PASSAGES,
  getAdventureTestRoute,
} from "@/constants/routes";
import { useAdventure } from "@/context/useAdventure";
import {
  AdventureLoadError,
  AdventureNotFoundError,
  InvalidPassageIdError,
  PassageNotFoundError,
} from "@/utils/errors";
import { AdventureLayout } from "@/components/layouts/AdventureLayout/AdventureLayout";
import { TestAdventureSidebar } from "./TestAdventureSidebar/TestAdventureSidebar";
import { LoadingState } from "./LoadingState/LoadingState";
import { IntroductionView } from "./IntroductionView/IntroductionView";
import { PassageView } from "./PassageView/PassageView";

export const TestAdventure = () => {
  const { id, adventureId } = useParams<{ id: string; adventureId: string }>();
  const navigate = useNavigate();
  const { adventure, isLoading, error, isDebugModeEnabled } = useAdventure();

  // If no id is provided, we're in introduction mode
  const isIntroduction = !id;
  const passageId = id ? parseInt(id, 10) : null;

  // Manage inventory in component state
  // Key insight: inventory should be reset based on route, not in an effect
  const inventoryKey = useMemo(
    () => (isIntroduction ? "intro" : passageId),
    [isIntroduction, passageId]
  );
  const [inventory, setInventory] = useState<string[]>([]);
  const [lastInventoryKey, setLastInventoryKey] = useState(inventoryKey);

  // Reset inventory when route changes to introduction
  if (inventoryKey !== lastInventoryKey) {
    if (inventoryKey === "intro") {
      setInventory([]);
    }
    setLastInventoryKey(inventoryKey);
  }

  // Execute passage effects when navigating to a passage
  useEffect(() => {
    if (!adventure || isIntroduction || passageId === null || isNaN(passageId))
      return;

    const passage = adventure.passages[passageId];
    if (passage && !passage.ending && passage.effects) {
      passage.effects.forEach((effect) => {
        if (effect.type === "add_item") {
          setInventory((prev) =>
            prev.includes(effect.item) ? prev : [...prev, effect.item]
          );
        } else if (effect.type === "remove_item") {
          setInventory((prev) => prev.filter((id) => id !== effect.item));
        }
      });
    }
  }, [passageId, adventure, isIntroduction]);

  // Inventory management callbacks for debug mode
  const handleAddItem = useCallback((itemId: string) => {
    setInventory((prev) => (prev.includes(itemId) ? prev : [...prev, itemId]));
  }, []);

  const handleRemoveItem = useCallback((itemId: string) => {
    setInventory((prev) => prev.filter((id) => id !== itemId));
  }, []);

  if (isLoading) {
    return (
      <AdventureLayout
        sidebar={
          <TestAdventureSidebar
            inventory={inventory}
            onAddItem={handleAddItem}
            onRemoveItem={handleRemoveItem}
          />
        }
      >
        <LoadingState isIntroduction={isIntroduction} />
      </AdventureLayout>
    );
  }

  if (error) {
    throw new AdventureLoadError(error);
  }

  if (!adventure || !adventureId) {
    throw new AdventureNotFoundError();
  }

  // Handle introduction view
  if (isIntroduction) {
    const handleStartAdventure = () => {
      navigate(
        getAdventureTestPassageRoute(adventureId, SPECIAL_PASSAGES.START)
      );
    };

    return (
      <AdventureLayout
        sidebar={
          <TestAdventureSidebar
            inventory={inventory}
            onAddItem={handleAddItem}
            onRemoveItem={handleRemoveItem}
          />
        }
      >
        <IntroductionView
          adventure={adventure}
          onStart={handleStartAdventure}
        />
      </AdventureLayout>
    );
  }

  // Handle passage view - passageId is guaranteed to be a number here
  if (
    passageId === null ||
    isNaN(passageId) ||
    passageId < 0 ||
    !Number.isInteger(passageId)
  ) {
    throw new InvalidPassageIdError(id || "undefined");
  }

  const currentPassage = adventure.passages[passageId];

  if (!currentPassage) {
    throw new PassageNotFoundError(passageId);
  }

  const handleChoiceClick = (nextId: number) => {
    navigate(getAdventureTestPassageRoute(adventureId, nextId));
  };

  const handleRestartClick = () => {
    navigate(getAdventureTestRoute(adventureId));
  };

  return (
    <AdventureLayout
      sidebar={
        <TestAdventureSidebar
          inventory={inventory}
          onAddItem={handleAddItem}
          onRemoveItem={handleRemoveItem}
        />
      }
    >
      <PassageView
        passage={currentPassage}
        isDebugModeEnabled={isDebugModeEnabled}
        onChoiceClick={handleChoiceClick}
        onRestart={handleRestartClick}
      />
    </AdventureLayout>
  );
};
