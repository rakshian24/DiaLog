import { Box, Stack, useMediaQuery } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { colors, ISO_DATE_FORMAT2, screenSize } from "../../constants";
import ReadingListFilter from "../../components/ReadingListFilter";
import dayjs, { Dayjs } from "dayjs";
import { getDateRangeFromFilter, stripTypename } from "../../utils";
import { GET_ME, GET_READINGS_FOR_REPORT } from "../../graphql/queries";
import { useLazyQuery, useQuery } from "@apollo/client";
import { ReportDateEntry } from "../../types";
import Skeleton from "./Skeleton";
import NoReadingHistory from "../ReadingHistory/NoReadingHistory";
import ReportPreview from "./ReportPreview";

const Reports = () => {
  const isTablet = useMediaQuery(`(max-width:${screenSize.tablet})`);
  const [isLoading, setIsLoading] = useState(false);
  const selectedFilterRef = useRef("Last 7 days");
  const [selectedFilter, setSelectedFilter] = useState(
    selectedFilterRef.current
  );
  const [fromDate, setFromDate] = useState<Dayjs | null>(dayjs());
  const [toDate, setToDate] = useState<Dayjs | null>(dayjs());

  const filters = ["Last 7 days", "Last month", "This month", "Custom date"];

  const [
    triggerFilterQuery,
    { data: readingReportsData, loading: isReportsDataLoading },
  ] = useLazyQuery(GET_READINGS_FOR_REPORT);

  const { data: userData, loading: isUserDataLoading } = useQuery(GET_ME);

  const user = userData?.me || {};

  const reportsData: ReportDateEntry[] =
    readingReportsData?.getReadingsForReport || [];

  const reports = stripTypename(reportsData);

  const hasReadings = reports?.length > 0;

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
      },
    }).finally(() => setIsLoading(false));
  }, []);

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

    setIsLoading(true);
    triggerFilterQuery({
      variables: {
        fromDate: defaultFrom.format(ISO_DATE_FORMAT2),
        toDate: defaultTo.format(ISO_DATE_FORMAT2),
      },
    }).finally(() => setIsLoading(false));
  };

  const shouldShowSkeleton =
    isLoading || isReportsDataLoading || isUserDataLoading;

  return (
    <Stack pb={isTablet ? 6 : 0} gap={3} bgcolor={colors.white}>
      <ReadingListFilter
        filters={filters}
        selectedFilter={selectedFilter}
        setSelectedFilter={setSelectedFilter}
        selectedFilterRef={selectedFilterRef}
        fromDate={fromDate}
        toDate={toDate}
        setFromDate={setFromDate}
        setToDate={setToDate}
        showReadingTimesFilter={false}
        handleApplyFilter={handleApplyFilter}
        handleResetFilters={handleResetFilters}
      />
      {shouldShowSkeleton ? (
        <Box px={2}>
          <Skeleton />
        </Box>
      ) : (
        <>
          {hasReadings ? (
            <ReportPreview
              reports={reports}
              fromDate={fromDate}
              toDate={toDate}
              user={user}
            />
          ) : (
            <Box px={2}>
              <NoReadingHistory handleFilter={handleResetFilters} />
            </Box>
          )}
        </>
      )}
    </Stack>
  );
};

export default Reports;
