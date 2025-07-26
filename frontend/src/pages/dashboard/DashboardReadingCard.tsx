import { Stack, Typography, Grid, Chip } from "@mui/material";
import { colors } from "../../constants";
import { getDayLabel, getMealTime } from "../../utils";
import { Reading, ReadingTiming } from "../../types";
import DashboardReadingBlock from "./DashboardReadingBlock";
import SectionLabel from "./SectionLabel";
import MedicationChip from "./MedicationChip";
import MealIcon from "./MealIcon";

type Props = {
  meal: "Breakfast" | "Lunch" | "Dinner";
  readings: Reading[];
  readingDate: string;
};

const DashboardReadingCard = ({ meal, readings, readingDate }: Props) => {
  const before = readings.find((r) => r.readingTime.includes("BEFORE"));
  const after = readings.find((r) => r.readingTime.includes("AFTER"));

  const beforeRequiredMeds = before?.requiredMedications || [];
  const afterRequiredMeds = after?.requiredMedications || [];

  const allFoods = Array.from(
    new Set(readings.flatMap((r) => r.foods?.map((f) => f.name) || []))
  );

  const getChips = (
    required: any[] = [],
    taken: any[] = [],
    missed: any[] = [],
    label: string,
    readingTime?: ReadingTiming
  ) => {
    if (!required.length) return null;

    return (
      <Stack gap={1}>
        <SectionLabel label={label} />
        <Stack gap={1}>
          {taken.map((med) => (
            <MedicationChip
              key={med._id}
              med={med}
              type="taken"
              readingTime={readingTime}
            />
          ))}
          {missed.map((med) => (
            <MedicationChip
              key={med._id}
              med={med}
              type="missed"
              readingTime={readingTime}
            />
          ))}
        </Stack>
      </Stack>
    );
  };

  return (
    <Stack
      key={meal}
      p={2}
      borderRadius={3}
      bgcolor={colors.white}
      border={`1.5px solid ${colors.lightGrey3}`}
      gap={2}
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Stack gap={1.25} direction="row" alignItems="center">
          <MealIcon meal={meal} />
          <Stack>
            <Stack direction="row" alignItems="center" gap={0.75}>
              <Typography fontWeight={600}>{meal}</Typography>
              <Typography variant="body2" color={colors.contentSecondary}>
                {getDayLabel(readingDate)
                  ? `(${getDayLabel(readingDate)})`
                  : ""}
              </Typography>
            </Stack>
            <Typography variant="body2" color="text.secondary">
              {getMealTime(after?.dateTime, before?.dateTime)}
            </Typography>
          </Stack>
        </Stack>
      </Stack>

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
        <Stack gap={1}>
          <Typography
            color={colors.contentSecondary}
            fontSize={14}
            fontWeight={"500"}
          >
            Food consumed
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap">
            {allFoods.map((food) => (
              <Chip
                key={food}
                label={food}
                sx={{ bgcolor: "#e0f2fe", color: "#0284c7" }}
              />
            ))}
          </Stack>
        </Stack>
      )}

      {(beforeRequiredMeds?.length > 0 || afterRequiredMeds?.length > 0) && (
        <Stack gap={1.25} mt={0.25}>
          <Typography
            color={colors.contentSecondary}
            fontSize={14}
            fontWeight={"500"}
          >
            Medications
          </Typography>

          {getChips(
            beforeRequiredMeds,
            before?.medications,
            before?.missedMedications,
            `Before ${meal}`,
            before?.readingTime
          )}
          {getChips(
            afterRequiredMeds,
            after?.medications,
            after?.missedMedications,
            `After ${meal}`,
            after?.readingTime
          )}
        </Stack>
      )}
    </Stack>
  );
};

export default DashboardReadingCard;
