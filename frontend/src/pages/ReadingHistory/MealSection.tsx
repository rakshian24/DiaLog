import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Reading } from "../../types";
import FoodDetails from "./FoodDetails";
import {
  AccordionStyles,
  AccordionSummaryStyles,
  colors,
  screenSize,
} from "../../constants";
import dayjs from "dayjs";
import { getStyleBasedOnGlucoseLevel, readingTimingLabels } from "../../utils";
import { renderMedicationChips } from "../dashboard/DashboardReadingCard";

type Props = {
  title: string;
  readings: Reading[];
};

const formatReadingTime = (readingTime: string) =>
  readingTime
    .replace("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());

const MealSection = ({ title, readings }: Props) => {
  const isMobile = useMediaQuery(`(max-width:${screenSize.mobile})`);

  const hasRequiredMeds = readings.some(
    (reading) =>
      reading.requiredMedications && reading.requiredMedications.length > 0
  );

  return (
    <Accordion
      disableGutters
      elevation={0}
      square={false}
      sx={{ bgcolor: "#FFFAF0", ...AccordionStyles }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        sx={AccordionSummaryStyles}
      >
        <Stack gap={1} width={"100%"} paddingRight={isMobile ? 0.5 : 2}>
          <Typography fontWeight={600} fontSize={isMobile ? 14 : 16}>
            {title}
          </Typography>
          <Stack gap={1}>
            {readings.map((r) => (
              <Stack
                key={r._id}
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Stack
                  direction="row"
                  gap={isMobile ? 1 : 1.25}
                  alignItems={"center"}
                >
                  <Typography
                    fontWeight={500}
                    color={colors.contentSecondary}
                    fontSize={isMobile ? 13 : 14}
                  >
                    {formatReadingTime(r.readingTime)}
                  </Typography>
                  <Typography
                    fontSize={isMobile ? 12 : 14}
                    color="text.disabled"
                    mt={isMobile ? 0.18 : 0}
                  >
                    {dayjs(r.dateTime).format("h:mm A")}
                  </Typography>
                </Stack>
                <Stack direction="row" gap={0.75} alignItems="center">
                  <Typography fontWeight={600} fontSize={isMobile ? 13 : 14}>
                    {r.glucoseLevel} mg/dL
                  </Typography>
                  <span
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      backgroundColor: getStyleBasedOnGlucoseLevel(
                        true,
                        r.glucoseLevel
                      ).textColor,
                    }}
                  />
                </Stack>
              </Stack>
            ))}
          </Stack>
        </Stack>
      </AccordionSummary>
      <AccordionDetails>
        <Stack gap={1}>
          {hasRequiredMeds && (
            <Stack gap={1}>
              <Typography
                fontSize={14}
                fontWeight={500}
                color={colors.contentSecondary}
              >
                Medication details:
              </Typography>
              {readings.map((r) => {
                return (
                  <Stack key={r._id} gap={1}>
                    {r.requiredMedications?.length > 0 &&
                      renderMedicationChips(
                        r.requiredMedications,
                        r.medications,
                        r.missedMedications,
                        readingTimingLabels[r.readingTime],
                        r.readingTime
                      )}
                  </Stack>
                );
              })}
            </Stack>
          )}
          {readings.map((r) => {
            return (
              <Box key={r._id}>
                {r.foods?.length > 0 && <FoodDetails foods={r.foods} />}
              </Box>
            );
          })}
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
};

export default MealSection;
