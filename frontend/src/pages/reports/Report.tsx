import {
  Box,
  Chip,
  Divider,
  Grid,
  IconButton,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import PrintIcon from "@mui/icons-material/Print";
import DownloadIcon from "@mui/icons-material/Download";
import ReportTable from "./ReportTable";
import { ReportDateEntry, User } from "../../types";
import dayjs from "dayjs";
import { colors, screenSize } from "../../constants";
import { capitalizeFirstLetter } from "../../utils";
import { FaRegCalendarAlt } from "react-icons/fa";

type Props = {
  reports: ReportDateEntry[];
  user: User;
  fromDate?: dayjs.Dayjs | null;
  toDate?: dayjs.Dayjs | null;
};

const Report = ({ reports, user, fromDate, toDate }: Props) => {
  const age = dayjs().year() - parseInt(user.birthYear, 10);
  const isMobile = useMediaQuery(`(max-width:${screenSize.tablet})`);

  console.log("fromDate = ", fromDate);

  const fromDateStr = fromDate ? fromDate.format("MMMM DD, YYYY") : "";
  const toDateStr = toDate ? toDate.format("MMMM DD, YYYY") : "";

  return (
    <Box borderRadius={2} overflow="hidden" border="1px solid #e0e0e0">
      <Stack
        sx={{
          backgroundColor: colors.primary,
          color: "white",
          px: 2,
          py: 1.5,
        }}
        direction={"row"}
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        <Stack gap={1}>
          <Typography fontWeight={600} fontSize={18}>
            Blood Glucose Report
          </Typography>
          <Stack
            gap={isMobile ? 1 : 2}
            direction={isMobile ? "column" : "row"}
            alignItems={isMobile ? "flex-start" : "center"}
          >
            <Typography fontSize={14} fontWeight={"500"}>
              Generated on {dayjs().format("MMMM DD, YYYY")}
            </Typography>
            <Chip
              sx={{
                pl: 1,
                color: colors.white,
                bgcolor: "#60A5FA",
                fontWeight: "500",
              }}
              icon={
                <FaRegCalendarAlt
                  style={{ fontSize: 16, color: colors.white }}
                />
              }
              label={`From: ${fromDateStr} - To: ${toDateStr}`}
            />
          </Stack>
        </Stack>
        <Stack direction="row" gap={1}>
          {!isMobile && (
            <IconButton size="small" sx={{ color: "white" }}>
              <PrintIcon />
            </IconButton>
          )}
          <IconButton size="small" sx={{ color: "white" }}>
            <DownloadIcon />
          </IconButton>
        </Stack>
      </Stack>

      {/* Patient Info */}
      <Box px={2} py={1.5}>
        <Typography fontWeight={600} mb={1}>
          Patient Information
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography fontSize={14}>
              <strong>Name:</strong> {capitalizeFirstLetter(user.username)}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography fontSize={14}>
              <strong>Age:</strong> {age} years, {user.gender}
            </Typography>
          </Grid>
        </Grid>
      </Box>

      <Divider sx={{ my: 1 }} />
      <Stack gap={2}>
        <Typography fontWeight={600} fontSize={18} px={2} mt={1}>
          Detailed Glucose Log with Timing
        </Typography>
        <ReportTable reports={reports} />
      </Stack>
    </Box>
  );
};

export default Report;
