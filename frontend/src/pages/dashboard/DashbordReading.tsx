import { Stack, Typography } from "@mui/material";
import DashboardReadingCard from "./DashboardReadingCard";
import { DashboardGroupedReadings } from "../../types";
import NoTodayReadings from "./NoTodayReadings";

type Props = {
  readingsData: DashboardGroupedReadings;
  isTodaysReading: boolean;
};

const DashboardReading = ({ readingsData, isTodaysReading }: Props) => {
  const { readingDate, readings } = readingsData;
  return (
    <Stack gap={2}>
      {!isTodaysReading && <NoTodayReadings />}
      <Stack
        display="flex"
        justifyContent="space-between"
        direction={"row"}
        alignItems={"center"}
      >
        <Typography variant="h6">
          {isTodaysReading ? "Today's Meals" : "Last Readings"}
        </Typography>
        {!isTodaysReading && (
          <Typography variant="body2" color="text.secondary" fontWeight={"500"}>
            {readingDate}
          </Typography>
        )}
      </Stack>

      <DashboardReadingCard
        meal="Breakfast"
        readings={readings.Breakfast}
        readingDate={readingDate}
      />
      <DashboardReadingCard
        meal="Lunch"
        readings={readings.Lunch}
        readingDate={readingDate}
      />
      <DashboardReadingCard
        meal="Dinner"
        readings={readings.Dinner}
        readingDate={readingDate}
      />
    </Stack>
  );
};

export default DashboardReading;
