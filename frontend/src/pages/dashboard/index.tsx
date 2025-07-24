import { Stack, Typography } from "@mui/material";
import { GET_TODAYS_OR_LATEST_READINGS } from "../../graphql/queries";
import { useQuery } from "@apollo/client";
import NoReadings from "./NoReadings";
import { colors } from "../../constants";
import dayjs from "dayjs";
import { DashboardGroupedReadings } from "../../types";
import { isToday, stripTypename } from "../../utils";
import DashbordReading from "./DashbordReading";
import DashboardSkeleton from "./DashboardSkeleton";

const Dashboard = () => {
  const {
    data: todayOrLatestReadingsData,
    loading: isTodayOrLatestReadingsDataLoading,
  } = useQuery(GET_TODAYS_OR_LATEST_READINGS);

  if (isTodayOrLatestReadingsDataLoading) {
    return <DashboardSkeleton />;
  }

  const todaysOrLatestReadings =
    todayOrLatestReadingsData?.getTodaysOrLatestGroupedReadings;
  const readings = todaysOrLatestReadings?.readings || {};
  const hasReadings = ["Breakfast", "Lunch", "Dinner"].some(
    (meal) => readings[meal as keyof typeof readings].length > 0
  );
  const isTodaysReading = isToday(todaysOrLatestReadings?.readingDate);

  const cleanedReadingData: DashboardGroupedReadings = stripTypename(
    todaysOrLatestReadings
  );

  return (
    <Stack gap={3}>
      <Stack
        direction={"row"}
        alignItems={"center"}
        justifyContent={"space-between"}
      >
        <Stack gap={0.25}>
          <Typography
            color={colors.contentSecondary}
            fontSize={13}
            fontWeight={500}
          >
            Today
          </Typography>
          <Typography color={colors.black} fontWeight={"500"}>
            {dayjs().format("MMMM D, YYYY")}
          </Typography>
        </Stack>
        <Stack
          bgcolor={isTodaysReading ? colors.primaryBg : colors.orangeBg1}
          py={1}
          px={2}
          borderRadius={2}
          fontWeight={"600"}
          color={isTodaysReading ? colors.primary : colors.orange}
        >
          {isTodaysReading ? "Average: 110 mg/dL" : "No data today"}
        </Stack>
      </Stack>
      {hasReadings ? (
        <DashbordReading
          readingsData={cleanedReadingData}
          isTodaysReading={isTodaysReading}
        />
      ) : (
        <NoReadings />
      )}
    </Stack>
  );
};

export default Dashboard;
