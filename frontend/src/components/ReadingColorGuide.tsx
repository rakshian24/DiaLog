import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Stack,
  Box,
  Divider,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { LuPalette } from "react-icons/lu";
import { colors } from "../constants";

const rangeData = {
  before: [
    { label: "Low", color: colors.primary, value: "< 80 mg/dL" },
    { label: "Good", color: colors.success, value: "80-110 mg/dL" },
    { label: "Warning", color: colors.warning, value: "111-130 mg/dL" },
    { label: "High Risk", color: colors.danger, value: "> 130 mg/dL" },
  ],
  after: [
    { label: "Low", color: colors.primary, value: "< 100 mg/dL" },
    { label: "Good", color: colors.success, value: "100-150 mg/dL" },
    { label: "Warning", color: colors.warning, value: "151-180 mg/dL" },
    { label: "High Risk", color: colors.danger, value: "> 180 mg/dL" },
  ],
};

const RangeSection = ({
  title,
  data,
}: {
  title: string;
  data: typeof rangeData.before;
}) => (
  <Stack gap={0.75}>
    <Typography fontSize={14} fontWeight={600}>
      {title}
    </Typography>
    {data.map(({ label, color, value }) => (
      <Stack
        key={label}
        direction="row"
        alignItems="center"
        justifyContent="space-between"
      >
        <Stack direction="row" alignItems="center" gap={1}>
          <Box
            sx={{
              width: 12,
              height: 12,
              borderRadius: 2,
              bgcolor: color,
              border: `1px solid ${colors.lightGrey2}`,
            }}
          />
          <Typography fontSize={14} sx={{ minWidth: 90 }}>
            {label}
          </Typography>
        </Stack>
        <Typography fontSize={14} color={color}>
          {value}
        </Typography>
      </Stack>
    ))}
  </Stack>
);

const ReadingColorGuide = () => {
  return (
    <Accordion
      sx={{
        borderRadius: 2,
        bgcolor: colors.white,
        border: `1.5px solid ${colors.lightGrey3}`,
        boxShadow: "none",
        "&:before": { display: "none" },
      }}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Stack direction="row" alignItems="center" gap={1}>
          <LuPalette size={18} color={colors.primary} />
          <Typography fontWeight={500} fontSize={15}>
            Reading color guide
          </Typography>
        </Stack>
      </AccordionSummary>

      <AccordionDetails>
        <Stack gap={2}>
          <RangeSection title="Before meals" data={rangeData.before} />
          <Divider />
          <RangeSection title="After meals" data={rangeData.after} />
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
};

export default ReadingColorGuide;
