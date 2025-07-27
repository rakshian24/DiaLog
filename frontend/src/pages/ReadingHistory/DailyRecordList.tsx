import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
  Stack,
  useMediaQuery,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { ReadingsByFilterResponse } from "../../types";
import DailyRecordItem from "./DailyRecordItem";
import dayjs from "dayjs";
import {
  AccordionStyles,
  AccordionSummaryStyles,
  screenSize,
} from "../../constants";

type Props = {
  readings: ReadingsByFilterResponse["readings"];
};

const DailyRecordList = ({ readings }: Props) => {
  const isMobile = useMediaQuery(`(max-width:${screenSize.mobile})`);

  return (
    <Stack spacing={1}>
      {readings.map((day, index) => (
        <Accordion
          key={index}
          sx={AccordionStyles}
          disableGutters
          elevation={0}
          square={false}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            sx={AccordionSummaryStyles}
          >
            <Stack>
              <Typography fontWeight={600} fontSize={isMobile ? 15 : 16}>
                {dayjs(day.date).format("MMM DD, YYYY")}
              </Typography>
              <Typography
                fontSize={isMobile ? 13.5 : 14}
                color="text.secondary"
              >
                {Object.values(day.readings).flat().length} readings • Avg:{" "}
                {Math.round(
                  Object.values(day.readings)
                    .flat()
                    .reduce((sum, r) => sum + r.glucoseLevel, 0) /
                    Object.values(day.readings).flat().length
                ) || "–"}{" "}
                mg/dL
              </Typography>
            </Stack>
          </AccordionSummary>
          <AccordionDetails>
            <DailyRecordItem day={day} />
          </AccordionDetails>
        </Accordion>
      ))}
    </Stack>
  );
};

export default DailyRecordList;
