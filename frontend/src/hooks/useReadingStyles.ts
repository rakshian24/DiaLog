import { useMemo } from "react";
import { colors } from "../constants";

type ReadingStyle = {
  bgcolor: string;
  color: string;
};

export const useReadingStyles = (
  label: string,
  value?: number
): ReadingStyle => {
  return useMemo(() => {
    const defaultStyle = {
      bgcolor: colors.contentSecondaryBg,
      color: colors.black,
    };

    if (value == null) {
      return defaultStyle;
    }

    const lowerLabel = label.toLowerCase();
    const isBefore = lowerLabel.includes("before");
    const isAfter = lowerLabel.includes("after");

    if (isBefore) {
      if (value < 80)
        return { bgcolor: colors.primaryBg, color: colors.primary };
      if (value <= 110)
        return { bgcolor: colors.successBg, color: colors.success };
      if (value <= 130)
        return { bgcolor: colors.warningBg, color: colors.warning };
      return { bgcolor: colors.dangerBg, color: colors.danger };
    }

    if (isAfter) {
      if (value < 100)
        return { bgcolor: colors.primaryBg, color: colors.primary };
      if (value <= 150)
        return { bgcolor: colors.successBg, color: colors.success };
      if (value <= 180)
        return { bgcolor: colors.warningBg, color: colors.warning };
      return { bgcolor: colors.dangerBg, color: colors.danger };
    }

    return defaultStyle;
  }, [label, value]);
};
