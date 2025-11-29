import { SquarePlus } from "lucide-react";
import {
  AdventureCardNew,
  AdventureCardTitle,
} from "./NewAdventureCard.styles";

interface NewAdventureCardProps {
  onClick: () => void;
}

export const NewAdventureCard = ({ onClick }: NewAdventureCardProps) => {
  return (
    <AdventureCardNew onClick={onClick}>
      <SquarePlus size={48} strokeWidth={1.25} />
      <AdventureCardTitle>Create a new adventure</AdventureCardTitle>
    </AdventureCardNew>
  );
};
