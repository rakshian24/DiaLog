import React, { useRef } from "react";
import html2pdf from "html2pdf.js";
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
import { FaRegCalendarAlt } from "react-icons/fa";
import dayjs from "dayjs";
import DownloadIcon from "@mui/icons-material/Download";
import PrintIcon from "@mui/icons-material/Print";
import ReportTable from "./ReportTable";
import { ReportDateEntry, User } from "../../types";
import { colors, screenSize } from "../../constants";
import { capitalizeFirstLetter } from "../../utils";

type Props = {
  reports: ReportDateEntry[];
  user: User;
  fromDate?: dayjs.Dayjs | null;
  toDate?: dayjs.Dayjs | null;
};

const Report = ({ reports, user, fromDate, toDate }: Props) => {
  const reportRef = useRef<HTMLDivElement>(null);
  const age = dayjs().year() - parseInt(user.birthYear, 10);
  const isMobile = useMediaQuery(`(max-width:${screenSize.tablet})`);

  const fromDateStr = fromDate ? fromDate.format("MMMM DD, YYYY") : "";
  const toDateStr = toDate ? toDate.format("MMMM DD, YYYY") : "";

  const handleDownload = () => {
    if (!reportRef.current) return;

    const element = reportRef.current;

    const clone = element.cloneNode(true) as HTMLElement;
    clone.style.backgroundColor = "white";

    clone.style.width = "1800px";
    clone.style.padding = "20px";

    const wrapper = document.createElement("div");
    wrapper.appendChild(clone);

    html2pdf()
      .set({
        margin: 10,
        filename: `DiaLog_${dayjs().format("DD_MMM_YYYY")}.pdf`,
        image: { type: "jpeg", quality: 1 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          scrollX: 0,
        },
        jsPDF: {
          unit: "px",
          format: [1800, 1000],
          orientation: "landscape",
        },
      })
      .from(wrapper)
      .save();
  };

  return (
    <Box borderRadius={2} overflow="hidden" border="1px solid #e0e0e0">
      <Stack
        direction="row"
        justifyContent="flex-end"
        alignItems="center"
        gap={2}
        px={2}
        py={1}
      >
        <IconButton
          sx={{
            color: colors.primary,
            bgcolor: colors.lightGrey4,
            p: 1,
          }}
        >
          <PrintIcon style={{ fontSize: isMobile ? 20 : 24 }} />
        </IconButton>
        <IconButton
          onClick={handleDownload}
          sx={{
            color: colors.primary,
            bgcolor: colors.lightGrey4,
            p: 1,
          }}
        >
          <DownloadIcon style={{ fontSize: isMobile ? 20 : 24 }} />
        </IconButton>
      </Stack>
      <Box ref={reportRef}>
        <Stack
          sx={{
            backgroundColor: colors.primary,
            color: "white",
            px: 2,
            py: 1.5,
          }}
          direction="row"
          justifyContent="space-between"
          alignItems="center"
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
              <Typography fontSize={14} fontWeight={500}>
                Generated on {dayjs().format("MMMM DD, YYYY")}
              </Typography>
              <Chip
                sx={{
                  pl: 1,
                  color: colors.white,
                  bgcolor: "#60A5FA",
                  fontWeight: 500,
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
        </Stack>

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
            Detailed glucose log with timing
          </Typography>
          <ReportTable reports={reports} />
        </Stack>
      </Box>
    </Box>
  );
};

export default Report;
