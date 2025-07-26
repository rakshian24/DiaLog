import { useState } from "react";
import {
  Stack,
  Typography,
  Grid,
  Chip as MuiChip,
  Collapse,
  IconButton,
} from "@mui/material";
import { styled } from "@mui/system";
import { PiWarningFill } from "react-icons/pi";

import { colors, medicationColors } from "../../constants";
import { getDayLabel, getMealTime } from "../../utils";
import { Reading, ReadingTiming } from "../../types";
import DashboardReadingBlock from "./DashboardReadingBlock";
import SectionLabel from "./SectionLabel";
import MedicationChip from "./MedicationChip";
import MealIcon from "./MealIcon";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

type Props = {
  meal: "Breakfast" | "Lunch" | "Dinner";
  readings: Reading[];
  readingDate: string;
};

const ExpandMore = styled(IconButton, {
  shouldForwardProp: (prop) => prop !== "expand",
})<{ expand: boolean }>(({ expand }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  transition: "transform 0.2s ease-in-out",
}));

const DashboardReadingCard = ({ meal, readings, readingDate }: Props) => {
  const [medsExpanded, setMedsExpanded] = useState(false);

  const before = readings.find((r) => r.readingTime.includes("BEFORE"));
  const after = readings.find((r) => r.readingTime.includes("AFTER"));

  const beforeRequiredMeds = before?.requiredMedications || [];
  const afterRequiredMeds = after?.requiredMedications || [];

  const allFoods = Array.from(
    new Set(readings.flatMap((r) => r.foods?.map((f) => f.name) || []))
  );

  const missedMeds = [
    ...(before?.missedMedications?.map((med) => ({
      med,
      time: "before " + meal,
    })) || []),
    ...(after?.missedMedications?.map((med) => ({
      med,
      time: "after " + meal,
    })) || []),
  ];

  const readingTime = before?.readingTime ?? after?.readingTime;

  const renderMedicationChips = (
    required: any[] = [],
    taken: any[] = [],
    missed: any[] = [],
    label: string,
    readingTime?: ReadingTiming
  ) =>
    required.length > 0 && (
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

  const getDosage = (med: any) =>
    med.dosagePerReadingTime?.[readingTime!] ?? med.dosage;

  const renderMissedInfo = () => {
    if (!readingTime || missedMeds.length === 0) return null;

    return (
      <Stack
        bgcolor={medicationColors.missed.bg}
        borderRadius={2}
        border={`1px solid ${medicationColors.missed.border}`}
        p={2}
        gap={1}
      >
        <Stack direction="row" alignItems="center" gap={1}>
          <PiWarningFill
            style={{ color: medicationColors.missed.text, fontSize: 18 }}
          />
          <Typography
            fontSize={14}
            color={medicationColors.missed.text}
            fontWeight="600"
          >
            {missedMeds.length === 1
              ? "Missed medication"
              : "Multiple missed medications"}
          </Typography>
        </Stack>

        {missedMeds.length === 1 ? (
          <Typography fontSize={14} color={medicationColors.missed.text}>
            {`${missedMeds[0].med.name} ${getDosage(missedMeds[0].med)} ${
              missedMeds[0].med.dosageType
            } not taken ${missedMeds[0].time.toLowerCase()}.`}
          </Typography>
        ) : (
          <Stack pl={3} gap={0.5}>
            {missedMeds.map(({ med, time }) => (
              <Typography
                key={med._id}
                fontSize={13}
                color={medicationColors.missed.text}
                component="li"
              >
                {`${med.name} ${getDosage(med)} ${
                  med.dosageType
                } (${time.toLowerCase()}).`}
              </Typography>
            ))}
          </Stack>
        )}
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
      {/* Header */}
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Stack direction="row" gap={1.25} alignItems="center">
          <MealIcon meal={meal} />
          <Stack>
            <Stack direction="row" alignItems="center" gap={0.75}>
              <Typography fontWeight={600}>{meal}</Typography>
              {getDayLabel(readingDate) && (
                <Typography variant="body2" color={colors.contentSecondary}>
                  ({getDayLabel(readingDate)})
                </Typography>
              )}
            </Stack>
            <Typography variant="body2" color="text.secondary">
              {getMealTime(after?.dateTime, before?.dateTime)}
            </Typography>
          </Stack>
        </Stack>
      </Stack>

      {/* Readings */}
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

      {/* Food */}
      {allFoods.length > 0 && (
        <Stack gap={1}>
          <Typography
            color={colors.contentSecondary}
            fontSize={14}
            fontWeight={500}
          >
            Food consumed
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap">
            {allFoods.map((food) => (
              <MuiChip
                key={food}
                label={food}
                sx={{ bgcolor: "#e0f2fe", color: "#0284c7" }}
              />
            ))}
          </Stack>
        </Stack>
      )}

      {/* Medications Section */}
      {(beforeRequiredMeds.length > 0 || afterRequiredMeds.length > 0) && (
        <Stack gap={0.75}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            onClick={() => setMedsExpanded((prev) => !prev)}
            sx={{ cursor: "pointer" }}
          >
            <Typography
              color={colors.contentSecondary}
              fontSize={14}
              fontWeight={500}
            >
              Medications
            </Typography>
            <Stack direction="row" alignItems="center" gap={1}>
              <MuiChip
                label={
                  missedMeds.length > 0
                    ? `${missedMeds.length} missed`
                    : "No missed"
                }
                size="small"
                sx={{
                  fontSize: 11,
                  bgcolor:
                    missedMeds.length > 0
                      ? medicationColors.missed.bg
                      : medicationColors.taken.bg,
                  color:
                    missedMeds.length > 0
                      ? medicationColors.missed.text
                      : medicationColors.taken.text,
                  borderRadius: 1,
                  height: 22,
                  px: 1,
                }}
              />
              <ExpandMore expand={medsExpanded}>
                <ExpandMoreIcon fontSize="small" />
              </ExpandMore>
            </Stack>
          </Stack>

          <Collapse in={medsExpanded} timeout="auto" unmountOnExit>
            <Stack gap={1.25} mt={0.5}>
              {renderMedicationChips(
                beforeRequiredMeds,
                before?.medications,
                before?.missedMedications,
                `Before ${meal}`,
                before?.readingTime
              )}
              {renderMedicationChips(
                afterRequiredMeds,
                after?.medications,
                after?.missedMedications,
                `After ${meal}`,
                after?.readingTime
              )}
              {renderMissedInfo()}
            </Stack>
          </Collapse>
        </Stack>
      )}
    </Stack>
  );
};

export default DashboardReadingCard;
