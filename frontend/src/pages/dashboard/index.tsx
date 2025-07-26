import { Stack, Typography } from "@mui/material";
import { GET_TODAYS_OR_LATEST_READINGS } from "../../graphql/queries";
import { useQuery } from "@apollo/client";
import NoReadings from "./NoReadings";
import { colors } from "../../constants";
import dayjs from "dayjs";
import { DashboardGroupedReadings } from "../../types";
import {
  calculateAverageGlucoseLevel,
  getAverageGlucoseStyle,
  isToday,
  stripTypename,
} from "../../utils";
import DashbordReading from "./DashbordReading";
import DashboardSkeleton from "./DashboardSkeleton";
import ReadingColorGuide from "../../components/ReadingColorGuide";

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

  const averageGlucoseLevel = calculateAverageGlucoseLevel(
    cleanedReadingData.readings
  );

  const { bgColor, textColor, label, borderColor } = getAverageGlucoseStyle(
    isTodaysReading,
    averageGlucoseLevel
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
          <Typography color={colors.black} fontWeight={"500"} fontSize={14}>
            {dayjs().format("MMMM D, YYYY")}
          </Typography>
        </Stack>
        <Stack
          bgcolor={bgColor}
          py={1}
          px={2}
          borderRadius={2}
          fontSize={14}
          fontWeight={"600"}
          color={textColor}
        >
          {label}
        </Stack>
      </Stack>
      {hasReadings && <ReadingColorGuide />}
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
