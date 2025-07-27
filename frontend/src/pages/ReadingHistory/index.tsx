import { Stack, useMediaQuery } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { ISO_DATE_FORMAT2, screenSize } from "../../constants";
import dayjs, { Dayjs } from "dayjs";
import { ReadingsByFilterResponse, ReadingTiming } from "../../types";
import { getDateRangeFromFilter, stripTypename } from "../../utils";
import { GET_READINGS_BY_FILTER } from "../../graphql/queries";
import { useLazyQuery } from "@apollo/client";
import Skeleton from "./Skeleton";
import ReadingHistoryBody from "./ReadingHistoryBody";
import NoReadingHistory from "./NoReadingHistory";
import ReadingListFilter from "../../components/ReadingListFilter";

const ReadingHistory = () => {
  const isTablet = useMediaQuery(`(max-width:${screenSize.tablet})`);

  const allMealTimes = Object.values(ReadingTiming);
  const [isLoading, setIsLoading] = useState(false);
  const selectedFilterRef = useRef("Last 7 days");
  const [selectedFilter, setSelectedFilter] = useState(
    selectedFilterRef.current
  );
  const [fromDate, setFromDate] = useState<Dayjs | null>(dayjs());
  const [toDate, setToDate] = useState<Dayjs | null>(dayjs());
  const [readingTimes, setReadingTimes] =
    useState<ReadingTiming[]>(allMealTimes);

  const [
    triggerFilterQuery,
    { data: readingsByFilterData, loading: isReadingsByFilterDataLoading },
  ] = useLazyQuery(GET_READINGS_BY_FILTER);

  const readingsData: ReadingsByFilterResponse =
    readingsByFilterData?.getReadingsByFilter || {};

  const readings = stripTypename(readingsData);

  const hasReadings = readings?.readings?.length > 0;

  useEffect(() => {
    const defaultFrom = dayjs().subtract(6, "day");
    const defaultTo = dayjs();

    setFromDate(defaultFrom);
    setToDate(defaultTo);

    setIsLoading(true);
    triggerFilterQuery({
      variables: {
        fromDate: defaultFrom.format(ISO_DATE_FORMAT2),
        toDate: defaultTo.format(ISO_DATE_FORMAT2),
        readingTimes: allMealTimes,
      },
    }).finally(() => setIsLoading(false));
  }, []);

  const filters = ["Last 7 days", "Last month", "This month", "Custom date"];

  const handleApplyFilter = () => {
    const currentFilter = selectedFilterRef.current;

    let finalFromDate = fromDate;
    let finalToDate = toDate;

    if (currentFilter !== "Custom date") {
      const { fromDate: newFrom, toDate: newTo } =
        getDateRangeFromFilter(currentFilter);
      setFromDate(newFrom);
      setToDate(newTo);
      finalFromDate = newFrom;
      finalToDate = newTo;
    }

    if (finalFromDate && finalToDate) {
      setIsLoading(true);
      triggerFilterQuery({
        variables: {
          fromDate: finalFromDate.format(ISO_DATE_FORMAT2),
          toDate: finalToDate.format(ISO_DATE_FORMAT2),
          readingTimes,
        },
      }).finally(() => setIsLoading(false));
    }
  };

  const handleResetFilters = () => {
    const defaultFrom = dayjs().subtract(6, "day");
    const defaultTo = dayjs();

    setSelectedFilter("Last 7 days");
    selectedFilterRef.current = "Last 7 days";

    setFromDate(defaultFrom);
    setToDate(defaultTo);
    setReadingTimes(allMealTimes);

    setIsLoading(true);
    triggerFilterQuery({
      variables: {
        fromDate: defaultFrom.format(ISO_DATE_FORMAT2),
        toDate: defaultTo.format(ISO_DATE_FORMAT2),
        readingTimes: allMealTimes,
      },
    }).finally(() => setIsLoading(false));
  };

  const shouldShowSkeleton =
    Object.keys(readings).length === 0 ||
    isLoading ||
    isReadingsByFilterDataLoading;

  return (
    <Stack bgcolor={"#FEF9EF"} pb={isTablet ? 6 : 0}>
      <ReadingListFilter
        filters={filters}
        selectedFilter={selectedFilter}
        setSelectedFilter={setSelectedFilter}
        selectedFilterRef={selectedFilterRef}
        fromDate={fromDate}
        toDate={toDate}
        setFromDate={setFromDate}
        setToDate={setToDate}
        readingTimes={readingTimes}
        setReadingTimes={setReadingTimes}
        handleApplyFilter={handleApplyFilter}
        handleResetFilters={handleResetFilters}
      />

      <Stack p={2} height={"100%"}>
        {shouldShowSkeleton ? (
          <Skeleton sx={{ bgcolor: "#F5EFE1" }} />
        ) : (
          <>
            {hasReadings ? (
              <ReadingHistoryBody readings={readings} />
            ) : (
              <NoReadingHistory handleFilter={handleResetFilters} />
            )}
          </>
        )}
      </Stack>
    </Stack>
  );
};

export default ReadingHistory;
