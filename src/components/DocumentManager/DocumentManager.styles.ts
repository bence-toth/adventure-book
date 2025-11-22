import styled from "styled-components";

export const DocumentManagerContainer = styled.div`
  width: 100%;
  height: 100%;
  overflow-y: auto;
  padding: var(--space-4);
`;

export const DocumentManagerHeader = styled.header`
  text-align: center;
`;

export const DocumentManagerLoading = styled.div`
  text-align: center;
`;

export const DocumentManagerError = styled.div`
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
`;

export const DocumentManagerList = styled.div`
  display: grid;
  grid-template-columns: repeat(
    auto-fill,
    minmax(var(--size-document-card), 1fr)
  );
  gap: var(--space-4);
`;

export const StoryCard = styled.div`
  background: var(--color-background-surface);
  border-radius: var(--space-1);
  position: relative;
  display: flex;
  flex-direction: column;
  aspect-ratio: 1 / 1.414;
`;

export const StoryCardClickable = styled.button`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: var(--space-3);
  cursor: pointer;
  text-align: left;
  width: 100%;
  min-height: 0;
  border-radius: var(--space-1);
  background: var(--color-interactive-background-default-neutral);
  color: var(--color-interactive-foreground-default-neutral);
  border: var(--border-width-interactive) solid
    var(--color-interactive-border-default-neutral);

  &:hover {
    background: var(--color-interactive-background-hover-neutral);
    color: var(--color-interactive-foreground-hover-neutral);
    border-color: var(--color-interactive-border-hover-neutral);
  }

  &:active {
    background: var(--color-interactive-background-active-neutral);
    color: var(--color-interactive-foreground-active-neutral);
    border-color: var(--color-interactive-border-active-neutral);
  }

  &:focus-visible {
    background: var(--color-interactive-background-focus-neutral);
    color: var(--color-interactive-foreground-focus-neutral);
    border-color: var(--color-interactive-border-focus-neutral);
    outline-offset: var(--space-1);
  }
`;

export const StoryCardFooter = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-2) var(--space-3);
  background: var(--color-background);
  gap: var(--space-2);
`;

export const StoryCardMenu = styled.button`
  cursor: pointer;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-1);
  flex-shrink: 0;
  border-radius: var(--space-1);
  background: var(--color-interactive-background-default-neutral);
  color: var(--color-interactive-foreground-default-neutral);
  border: var(--border-width-interactive) solid
    var(--color-interactive-border-default-neutral);

  &:hover {
    background: var(--color-interactive-background-hover-neutral);
    color: var(--color-interactive-foreground-hover-neutral);
    border-color: var(--color-interactive-border-hover-neutral);
  }

  &:active {
    background: var(--color-interactive-background-active-neutral);
    color: var(--color-interactive-foreground-active-neutral);
    border-color: var(--color-interactive-border-active-neutral);
  }

  &:focus-visible {
    background: var(--color-interactive-background-focus-neutral);
    color: var(--color-interactive-foreground-focus-neutral);
    border-color: var(--color-interactive-border-focus-neutral);
    outline-offset: var(--space-1);
  }
`;

export const StoryCardContent = styled.div`
  flex: 1;
`;

export const StoryCardTitle = styled.h2`
  font-size: var(--font-size-lg);
  line-height: var(--line-height-normal);
  color: var(--color-foreground);
  overflow-wrap: break-word;
  font-family: var(--font-family-display);
`;

export const StoryCardDate = styled.time`
  font-size: var(--font-size-sm);
  flex: 1;
`;

export const StoryCardActions = styled.div`
  display: flex;
  gap: var(--space-2);
  justify-content: flex-end;
`;

export const StoryCardNew = styled.button`
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--space-3);
  gap: var(--space-2);
  background: var(--color-interactive-background-default-neutral);
  color: var(--color-interactive-foreground-default-neutral);
  border: var(--border-width-interactive) solid
    var(--color-interactive-border-default-neutral);
  cursor: pointer;
  border-radius: var(--space-1);
  width: 100%;
  aspect-ratio: 1 / 1.414;

  &:hover {
    background: var(--color-interactive-background-hover-neutral);
    color: var(--color-interactive-foreground-hover-neutral);
    border-color: var(--color-interactive-border-hover-neutral);
  }

  &:active {
    background: var(--color-interactive-background-active-neutral);
    color: var(--color-interactive-foreground-active-neutral);
    border-color: var(--color-interactive-border-active-neutral);
  }

  &:focus-visible {
    background: var(--color-interactive-background-focus-neutral);
    color: var(--color-interactive-foreground-focus-neutral);
    border-color: var(--color-interactive-border-focus-neutral);
    outline-offset: var(--space-1);
  }
`;
