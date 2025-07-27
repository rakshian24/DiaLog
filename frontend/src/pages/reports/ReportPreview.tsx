import { Stack, Typography } from "@mui/material";
import { ReportDateEntry, User } from "../../types";
import { colors } from "../../constants";
import dayjs from "dayjs";
import Report from "./Report";

type Props = {
  reports: ReportDateEntry[];
  fromDate?: dayjs.Dayjs | null;
  toDate?: dayjs.Dayjs | null;
  user: User;
};

const ReportPreview = ({ reports, fromDate, toDate, user }: Props) => {
  return (
    <Stack px={2} bgcolor={colors.white} gap={2}>
      <Stack
        direction={"row"}
        alignItems={"center"}
        justifyContent={"space-between"}
      >
        <Typography
          fontSize={14}
          fontWeight={500}
          color={colors.contentSecondary}
        >
          Report preview
        </Typography>
        {fromDate && toDate && (
          <Typography
            fontSize={14}
            fontWeight={500}
            color={colors.contentSecondary}
          >{`${fromDate.format("MMM D")} - ${toDate.format(
            "MMM D, YYYY"
          )}`}</Typography>
        )}
      </Stack>
      <Report
        reports={reports}
        user={user}
        fromDate={fromDate}
        toDate={toDate}
      />
    </Stack>
  );
};

export default ReportPreview;


