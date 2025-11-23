import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/common";
import { TOP_BAR_TEST_IDS } from "@/constants/testIds";
import { ROUTES } from "@/constants/routes";

export const BackButton = () => {
  const navigate = useNavigate();

  const handleBackClick = useCallback(() => {
    navigate(ROUTES.ROOT);
  }, [navigate]);

  return (
    <Button
      onClick={handleBackClick}
      icon={ArrowLeft}
      aria-label="Back to document manager"
      data-testid={TOP_BAR_TEST_IDS.BACK_BUTTON}
      size="small"
    />
  );
};
