import {
  Stack,
  Typography,
  Box,
  MenuItem,
  SelectChangeEvent,
  Chip,
  useMediaQuery,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { colors, ISO_DATE_FORMAT2, screenSize } from "../../constants";
import { FaRegCalendarAlt } from "react-icons/fa";
import CustomDatePicker from "../../components/CustomDatePicker";
import dayjs, { Dayjs } from "dayjs";
import { ReadingsByFilterResponse, ReadingTiming } from "../../types";
import CustomMultiSelect from "../../components/CustomMultiSelect";
import {
  getDateRangeFromFilter,
  readingTimingLabels,
  stripTypename,
} from "../../utils";
import Button from "../../components/CustomButton";
import { GET_READINGS_BY_FILTER } from "../../graphql/queries";
import { useLazyQuery } from "@apollo/client";
import Skeleton from "./Skeleton";
import ReadingHistoryBody from "./ReadingHistoryBody";
import NoReadingHistory from "./NoReadingHistory";

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

  const handleChange = (event: SelectChangeEvent<string[]>) => {
    const selected = event.target.value as ReadingTiming[];
    setReadingTimes(selected);
  };

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
      <Stack
        gap={2}
        bgcolor={colors.white}
        padding={2}
        borderBottom={`1px solid ${colors.grey2}`}
      >
        <Stack
          direction={"row"}
          alignItems={"center"}
          justifyContent={"space-between"}
        >
          <Typography fontWeight={500}>Filters</Typography>
          <Typography
            fontWeight={500}
            color={colors.primary}
            sx={{ cursor: "pointer" }}
            onClick={handleResetFilters}
          >
            Reset
          </Typography>
        </Stack>

        <Box
          sx={{
            overflowX: "auto",
            whiteSpace: "nowrap",
            display: "flex",
            pb: 0,
          }}
        >
          <Box
            sx={{
              display: "flex",
              gap: 1,
              pb: 1.5,
              pl: 0.5,
            }}
          >
            {filters.map((label) => {
              const isSelected = selectedFilter === label;
              return (
                <Box
                  key={label}
                  onClick={() => {
                    setSelectedFilter(label);
                    selectedFilterRef.current = label;
                  }}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.75,
                    px: 2,
                    py: 1,
                    borderRadius: 6,
                    bgcolor: isSelected ? colors.primary : colors.lightGrey4,
                    color: isSelected ? colors.white : colors.grey1,
                    fontWeight: 500,
                    fontSize: 14,
                    cursor: "pointer",
                    minWidth: "fit-content",
                  }}
                >
                  <FaRegCalendarAlt size={14} />
                  {label}
                </Box>
              );
            })}
          </Box>
        </Box>

        {selectedFilter === "Custom date" && (
          <Stack gap={1}>
            <Stack direction="row" alignItems="center" gap={1}>
              <FaRegCalendarAlt size={18} color={colors.primary} />
              <Typography fontWeight={500}>Custom Date Range</Typography>
            </Stack>
            <Stack direction="row" gap={2}>
              <CustomDatePicker
                label="From date"
                value={fromDate}
                onChange={(date) => setFromDate(date)}
                disableFuture
                maxDate={toDate || undefined}
              />
              <CustomDatePicker
                label="To date"
                value={toDate}
                onChange={(date) => setToDate(date)}
                disableFuture
                minDate={fromDate || undefined}
              />
            </Stack>
          </Stack>
        )}

        <Stack gap={1}>
          <Typography fontSize={16} fontWeight={500} pl={0.5}>
            Meal time
          </Typography>
          <CustomMultiSelect
            placeholder="Select meal time(s)"
            value={readingTimes}
            onChange={handleChange}
            styles={{ width: "100%" }}
            labelMap={readingTimingLabels}
            renderValue={(selected) => {
              if (!selected || selected.length === 0) {
                return (
                  <Typography sx={{ color: colors.contentTertiary, pl: 1 }}>
                    Select meal time(s)
                  </Typography>
                );
              }
              if (selected.length === allMealTimes.length) {
                return (
                  <Typography
                    sx={{
                      color: colors.contentSecondary,
                      pl: 1,
                      fontWeight: 500,
                    }}
                  >
                    All meal type
                  </Typography>
                );
              }

              return (
                <Box
                  sx={{
                    display: "flex",
                    gap: 1,
                    flexWrap: "wrap",
                    alignItems: "center",
                    pl: 0.5,
                  }}
                >
                  {(selected as string[]).map((val) => (
                    <Chip
                      key={val}
                      label={readingTimingLabels[val]}
                      size="small"
                      sx={{ backgroundColor: colors.grey2 }}
                    />
                  ))}
                </Box>
              );
            }}
          >
            {allMealTimes.map((time) => (
              <MenuItem key={time} value={time}>
                {readingTimingLabels[time]}
              </MenuItem>
            ))}
          </CustomMultiSelect>
        </Stack>
        <Button buttonText="Apply filters" onClick={handleApplyFilter} />
      </Stack>
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
