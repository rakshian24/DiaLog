import { Stack } from "@mui/material";
import { ReadingsByFilterResponse } from "../../types";
import MealSection from "./MealSection";

type Props = {
  day: ReadingsByFilterResponse["readings"][0];
};

const DailyRecordItem = ({ day }: Props) => {
  const { readings } = day;

  return (
    <Stack spacing={2}>
      {Object.entries(readings).map(([section, sectionReadings]) => {
        if (sectionReadings.length === 0) return null;
        return (
          <MealSection
            key={section}
            title={section}
            readings={sectionReadings}
          />
        );
      })}
    </Stack>
  );
};

export default DailyRecordItem;
