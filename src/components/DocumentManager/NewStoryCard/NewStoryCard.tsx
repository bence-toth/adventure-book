import { SquarePlus } from "lucide-react";
import { StoryCardNew, StoryCardTitle } from "./NewStoryCard.styles";

interface NewStoryCardProps {
  onClick: () => void;
}

export const NewStoryCard = ({ onClick }: NewStoryCardProps) => {
  return (
    <StoryCardNew onClick={onClick}>
      <SquarePlus size={48} strokeWidth={1.5} />
      <StoryCardTitle>Create a new adventure</StoryCardTitle>
    </StoryCardNew>
  );
};
