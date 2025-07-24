import { Stack, Box, Typography, Chip, Grid } from "@mui/material";
import { Reading } from "../../types";
import { LunchDining, NightsStay, WbSunny } from "@mui/icons-material";
import DashboardReadingBlock from "./DashboardReadingBlock";
import { colors } from "../../constants";
import { getDayLabel, getMealTime } from "../../utils";

type Props = {
  meal: "Breakfast" | "Lunch" | "Dinner";
  readings: Reading[];
  readingDate: string;
};

const getIcon = (meal: string) => {
  switch (meal) {
    case "Breakfast":
      return <WbSunny sx={{ color: "#f59e0b" }} />;
    case "Lunch":
      return <LunchDining sx={{ color: "#3b82f6" }} />;
    case "Dinner":
      return <NightsStay sx={{ color: "#6366f1" }} />;
  }
};

const DashboardReadingCard = ({ meal, readings, readingDate }: Props) => {
  const before = readings.find((r) => r.readingTime.includes("BEFORE"));
  const after = readings.find((r) => r.readingTime.includes("AFTER"));

  const allFoods = Array.from(
    new Set(readings.flatMap((r) => r.foods?.map((f) => f.name) || []))
  );

  return (
    <Stack
      key={meal}
      p={2}
      borderRadius={3}
      bgcolor={colors.white}
      border={`1.5px solid ${colors.lightGrey3}`}
      gap={2}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Stack direction="row" alignItems="center" spacing={1}>
          {getIcon(meal)}
          <Typography fontWeight={600}>{meal}</Typography>
          <Typography variant="body2" color={colors.contentSecondary}>
            ({getDayLabel(readingDate)})
          </Typography>
        </Stack>
        <Typography variant="body2" color="text.secondary">
          {getMealTime(after?.dateTime, before?.dateTime)}
        </Typography>
      </Box>

      <Grid container columnSpacing={2}>
        <Grid item xs={6} sx={{ pt: 0 }}>
          <DashboardReadingBlock
            label="Before"
            value={before?.glucoseLevel}
            time={before?.dateTime}
          />
        </Grid>
        <Grid item xs={6} sx={{ pt: 0 }}>
          <DashboardReadingBlock
            label="2hr After"
            value={after?.glucoseLevel}
            time={after?.dateTime}
          />
        </Grid>
      </Grid>

      {allFoods.length > 0 && (
        <Stack direction="row" spacing={1} flexWrap="wrap">
          {allFoods.map((food) => (
            <Chip
              key={food}
              label={food}
              sx={{ bgcolor: "#e0f2fe", color: "#0284c7" }}
            />
          ))}
        </Stack>
      )}
    </Stack>
  );
};

export default DashboardReadingCard;
