// ReadingListFilter
// .tsx
import {
  Box,
  MenuItem,
  Stack,
  Typography,
  Chip,
  SelectChangeEvent,
} from "@mui/material";
import { FaRegCalendarAlt } from "react-icons/fa";
import { Dayjs } from "dayjs";
import { ReadingTiming } from "../types";
import { colors } from "../constants";
import CustomDatePicker from "./CustomDatePicker";
import CustomMultiSelect from "./CustomMultiSelect";
import { readingTimingLabels } from "../utils";
import Button from "./CustomButton";

type Props = {
  filters: string[];
  selectedFilter: string;
  setSelectedFilter: (value: string) => void;
  selectedFilterRef: React.MutableRefObject<string>;
  fromDate: Dayjs | null;
  toDate: Dayjs | null;
  setFromDate: (date: Dayjs | null) => void;
  setToDate: (date: Dayjs | null) => void;
  readingTimes?: ReadingTiming[];
  setReadingTimes?: (value: ReadingTiming[]) => void;
  handleApplyFilter: () => void;
  handleResetFilters: () => void;
  showReadingTimesFilter?: boolean;
};

const ReadingListFilter = ({
  filters,
  selectedFilter,
  setSelectedFilter,
  selectedFilterRef,
  fromDate,
  toDate,
  setFromDate,
  setToDate,
  readingTimes,
  setReadingTimes = () => {},
  handleApplyFilter,
  handleResetFilters,
  showReadingTimesFilter = true,
}: Props) => {
  const allMealTimes = Object.values(ReadingTiming);

  const handleMealTimeChange = (event: SelectChangeEvent<string[]>) => {
    const selected = event.target.value as ReadingTiming[];
    setReadingTimes(selected);
  };

  return (
    <Stack
      gap={2}
      bgcolor={colors.white}
      padding={2}
      borderBottom={`1px solid ${colors.grey2}`}
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between">
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

      {/* Filter Buttons */}
      <Box sx={{ overflowX: "auto", whiteSpace: "nowrap", display: "flex" }}>
        <Box sx={{ display: "flex", gap: 1, pb: 1.5, pl: 0.5 }}>
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

      {/* Custom Date Range */}
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
              onChange={setFromDate}
              disableFuture
              maxDate={toDate || undefined}
            />
            <CustomDatePicker
              label="To date"
              value={toDate}
              onChange={setToDate}
              disableFuture
              minDate={fromDate || undefined}
            />
          </Stack>
        </Stack>
      )}

      {/* Meal Time Selector */}
      {showReadingTimesFilter && (
        <Stack gap={1}>
          <Typography fontSize={16} fontWeight={500} pl={0.5}>
            Meal time
          </Typography>
          <CustomMultiSelect
            placeholder="Select meal time(s)"
            value={readingTimes}
            onChange={handleMealTimeChange}
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
      )}

      <Button
        buttonText="Apply filters"
        onClick={handleApplyFilter}
        styles={{ mt: 1 }}
      />
    </Stack>
  );
};

export default ReadingListFilter;
