// hooks/useReadingIcons.tsx
import { FaCloudSun, FaSun, FaMoon } from "react-icons/fa";
import { GiCoffeeCup, GiForkKnifeSpoon } from "react-icons/gi";
import { DinnerDining } from "@mui/icons-material";
import { ReadingTiming } from "../types"; // adjust import path as needed
import { chipColorMap } from "../utils";

const iconSize = "18px";

export const useReadingIcons = () => {
  const iconMap: Record<ReadingTiming, JSX.Element> = {
    BEFORE_BREAKFAST: (
      <FaCloudSun
        style={{ fontSize: iconSize, color: chipColorMap.BEFORE_BREAKFAST }}
      />
    ),
    AFTER_BREAKFAST: (
      <GiCoffeeCup
        style={{ fontSize: iconSize, color: chipColorMap.AFTER_BREAKFAST }}
      />
    ),
    BEFORE_LUNCH: (
      <FaSun style={{ fontSize: iconSize, color: chipColorMap.BEFORE_LUNCH }} />
    ),
    AFTER_LUNCH: (
      <GiForkKnifeSpoon
        style={{ fontSize: iconSize, color: chipColorMap.AFTER_LUNCH }}
      />
    ),
    BEFORE_DINNER: (
      <FaMoon
        style={{ fontSize: iconSize, color: chipColorMap.BEFORE_DINNER }}
      />
    ),
    AFTER_DINNER: (
      <DinnerDining
        style={{ fontSize: iconSize, color: chipColorMap.AFTER_DINNER }}
      />
    ),
  };

  const getReadingIcon = (
    readingTime: ReadingTiming
  ): JSX.Element | undefined => iconMap[readingTime];

  return { getReadingIcon };
};
