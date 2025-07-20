import {
  Stack,
  Card,
  Typography,
  Box,
  Grid,
  useMediaQuery,
  Checkbox,
} from "@mui/material";
import { BiSolidInjection } from "react-icons/bi";
import { GiMedicines } from "react-icons/gi";
import { Medication, MedicationType, MedicationViewType } from "../types";
import { chipBgColorMap, chipColorMap, readingTimingLabels } from "../utils";
import DotSeparator from "./DotSeparator";
import { colors, screenSize } from "../constants";
import { useReadingIcons } from "../hooks/useReadingIcons";

type Props = {
  medications: Medication[];
  viewType?: MedicationViewType;
  onSelectionChange?: (selectedIds: string[]) => void;
  selectedIds?: string[];
};

const MedicationListView = ({
  medications,
  viewType,
  onSelectionChange,
  selectedIds,
}: Props) => {
  const isTablet = useMediaQuery(`(max-width:${screenSize.tablet})`);
  const { getReadingIcon } = useReadingIcons();

  const toggleSelection = (id: string) => {
    if (!onSelectionChange || !selectedIds) return;

    const updated = selectedIds.includes(id)
      ? selectedIds.filter((mid) => mid !== id)
      : [...selectedIds, id];

    onSelectionChange(updated);
  };

  return (
    <Stack gap={2}>
      {medications.map((medication: Medication) => {
        const isMedicationTypeTablet =
          medication.type === MedicationType.tablet;
        const readingTimeLength = medication.readingTime.length;

        return (
          <Card
            key={medication._id}
            sx={{ borderRadius: 3, p: 2 }}
            onClick={
              viewType === MedicationViewType.ADD_READING
                ? () => toggleSelection(medication._id)
                : undefined
            }
          >
            <Stack gap={1}>
              <Stack
                direction={"row"}
                justifyContent="space-between"
                alignItems={"center"}
              >
                <Stack direction={"row"} gap={1} alignItems={"center"}>
                  {isMedicationTypeTablet ? (
                    <GiMedicines
                      style={{ fontSize: "16px", color: colors.blue }}
                    />
                  ) : (
                    <BiSolidInjection
                      style={{ fontSize: "16px", color: colors.blue }}
                    />
                  )}
                  <Typography fontWeight={600}>{medication.name}</Typography>
                </Stack>
                {viewType === MedicationViewType.ADD_READING && (
                  <Checkbox
                    checked={selectedIds?.includes(medication._id) ?? false}
                    onChange={() => toggleSelection(medication._id)}
                    color="primary"
                  />
                )}
              </Stack>

              <Stack direction="row" gap={1.25} alignItems="center" mb={1}>
                <Box
                  sx={{
                    color: colors.blue,
                    bgcolor: colors.blueBg,
                    px: 2,
                    py: 0.5,
                    borderRadius: 10,
                    textAlign: "center",
                    width: "fit-content",
                  }}
                >
                  <Typography fontSize={isTablet ? 12 : 14} fontWeight={"500"}>
                    {isMedicationTypeTablet ? "Tablet" : "Insulin"}
                  </Typography>
                </Box>

                {isMedicationTypeTablet && (
                  <>
                    <Typography
                      fontSize={isTablet ? 12 : 14}
                      fontWeight={"500"}
                      color={colors.contentSecondary}
                    >{`${medication.dosage} ${medication.dosageType}`}</Typography>
                    <DotSeparator sx={{ mx: 0.5 }} />
                  </>
                )}
                <Typography fontSize={isTablet ? 12 : 14}>
                  {readingTimeLength} {readingTimeLength > 1 ? "times" : "time"}{" "}
                  daily
                </Typography>
              </Stack>

              <Grid container spacing={2}>
                {medication.readingTime.map((time) => {
                  const isTablet = medication.type === MedicationType.tablet;
                  const dosage = isTablet
                    ? `1 ${
                        medication.dosageType === "mg"
                          ? "tablet"
                          : medication.dosageType
                      }`
                    : `${medication.dosagePerReadingTime?.[time] || "-"} ${
                        medication.dosageType
                      }`;

                  return (
                    <Grid
                      item
                      xs={readingTimeLength > 1 ? 6 : 12}
                      md={6}
                      lg={4}
                      key={time}
                    >
                      <Box
                        sx={{
                          backgroundColor: chipBgColorMap[time],
                          p: 1.5,
                          borderRadius: 2,
                        }}
                      >
                        <Stack gap={0.75}>
                          <Stack
                            direction="row"
                            alignItems="center"
                            spacing={1}
                          >
                            {getReadingIcon(time)}
                            <Typography
                              fontSize={13}
                              fontWeight={600}
                              color={chipColorMap[time]}
                            >
                              {readingTimingLabels[time]}
                            </Typography>
                          </Stack>
                          <Typography
                            fontSize={14}
                            fontWeight={700}
                            color={colors.contentSecondary}
                          >
                            {dosage}
                          </Typography>
                        </Stack>
                      </Box>
                    </Grid>
                  );
                })}
              </Grid>
            </Stack>
          </Card>
        );
      })}
    </Stack>
  );
};

export default MedicationListView;
