import { Box, Stack, Card, Typography, useMediaQuery } from "@mui/material";
import { BiSolidInjection } from "react-icons/bi";
import { GiMedicines } from "react-icons/gi";
import {
  MedicationViewType,
  Medication,
  MedicationType,
  ReadingTiming,
} from "../types";
import { chipColorMap, readingTimingLabels } from "../utils";
import CustomSegmentedToggle, {
  CustomSegmentedToggleOption,
} from "./CustomSegmentedToggle";
import { useState } from "react";
import { colors, screenSize } from "../constants";
import {
  GET_ALL_MEDICATIONS,
  GET_ALL_MEDICATIONS_BY_MEAL_TYPE,
} from "../graphql/queries";
import { useQuery } from "@apollo/client";
import MedicationListView from "./MedicationListView";
import { useReadingIcons } from "../hooks/useReadingIcons";

type Props = {
  medListViewType?: MedicationViewType;
  selectedReadingType?: ReadingTiming;
  onSelectionChange?: (selectedIds: string[]) => void;
  selectedMedicationIds?: string[];
};

const MedicationList = ({
  medListViewType = MedicationViewType.LIST_VIEW,
  selectedReadingType = ReadingTiming.BEFORE_BREAKFAST,
  selectedMedicationIds,
  onSelectionChange,
}: Props) => {
  const [viewType, setViewType] = useState<MedicationViewType>(medListViewType);
  const isTablet = useMediaQuery(`(max-width:${screenSize.tablet})`);
  const { getReadingIcon } = useReadingIcons();

  const { data: medicationsData, loading: isMedicationsDataLoading } =
    useQuery(GET_ALL_MEDICATIONS);
  const {
    data: medicationsByMealTypeData,
    loading: isMedicationsByMealTypeDataLoading,
  } = useQuery(GET_ALL_MEDICATIONS_BY_MEAL_TYPE);

  const medications = medicationsData?.getAllMedications || [];
  const medicationByMealTypeData =
    medicationsByMealTypeData?.getAllMedicationsByMealType || {};
  const { __typename, ...medicationDataWithoutTypename } =
    medicationByMealTypeData;

  if (isMedicationsDataLoading || isMedicationsByMealTypeDataLoading) {
    return <p>Loading...</p>;
  }

  const toggleOptions: CustomSegmentedToggleOption<
    MedicationViewType.LIST_VIEW | MedicationViewType.BY_MEAL_TYPE
  >[] = [
    {
      label: "List view",
      value: MedicationViewType.LIST_VIEW,
      bgColor: colors.white,
      textColor: colors.black,
    },
    {
      label: "By meal time",
      value: MedicationViewType.BY_MEAL_TYPE,
      bgColor: colors.white,
      textColor: colors.black,
    },
  ];

  return (
    <Stack gap={3}>
      {viewType !== MedicationViewType.ADD_READING && (
        <Box display="flex">
          <CustomSegmentedToggle
            options={toggleOptions}
            selected={viewType}
            onChange={(newValue: MedicationViewType) => {
              if (newValue !== viewType) {
                setViewType(newValue);
              }
            }}
            sx={{ flex: 1 }}
            thumbColor={colors.lightGrey3}
            wrapperSx={{ width: isTablet ? "100%" : "auto" }}
          />
        </Box>
      )}

      {viewType === MedicationViewType.LIST_VIEW ? (
        <MedicationListView medications={medications} />
      ) : viewType === MedicationViewType.BY_MEAL_TYPE ? (
        <Stack>
          {Object.entries(
            medicationDataWithoutTypename as Record<ReadingTiming, Medication[]>
          ).map(([timingKey, meds]) => {
            const timing = timingKey as ReadingTiming;

            const label = readingTimingLabels[timing];
            const color = chipColorMap[timing];

            return (
              <Card
                key={timing}
                sx={{
                  p: 2,
                  borderRadius: 3,
                  mb: 2,
                  borderLeft: `5px solid ${color}`,
                }}
              >
                <Stack direction="row" alignItems="center" gap={1} mb={1}>
                  {getReadingIcon(timing)}
                  <Typography fontWeight={600} color={color}>
                    {label}
                  </Typography>
                </Stack>

                {meds.length === 0 ? (
                  <Stack alignItems="center" py={2}>
                    <Typography fontSize={14} color={colors.contentTertiary}>
                      No medications scheduled
                    </Typography>
                  </Stack>
                ) : (
                  <Stack gap={1}>
                    {meds?.map((med: Medication) => {
                      const isTablet = med.type === MedicationType.tablet;
                      const dosage = isTablet
                        ? `Tablet - ${med.dosage} ${med.dosageType}`
                        : `${med?.dosagePerReadingTime?.[timing] || "-"} ${
                            med.dosageType
                          }`;
                      const frequency = isTablet
                        ? `1 tablet`
                        : `${med?.dosagePerReadingTime?.[timing] || "-"}`;

                      return (
                        <Box
                          key={med._id}
                          sx={{
                            p: 2,
                            borderRadius: 2,
                            border: `1px solid ${colors.lightGrey3}`,
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            background: colors.white,
                          }}
                        >
                          <Stack>
                            <Stack
                              direction={"row"}
                              gap={1}
                              alignItems={"center"}
                            >
                              {isTablet ? (
                                <GiMedicines
                                  style={{
                                    fontSize: "16px",
                                    color: colors.blue,
                                  }}
                                />
                              ) : (
                                <BiSolidInjection
                                  style={{
                                    fontSize: "16px",
                                    color: colors.blue,
                                  }}
                                />
                              )}
                              <Typography fontWeight={600}>
                                {med.name}
                              </Typography>
                            </Stack>
                            <Typography
                              fontSize={13}
                              color={colors.contentSecondary}
                            >
                              {dosage}
                            </Typography>
                          </Stack>
                          {isTablet && (
                            <Stack alignItems="flex-end">
                              <Typography fontSize={13} fontWeight={600}>
                                {frequency}
                              </Typography>
                            </Stack>
                          )}
                        </Box>
                      );
                    })}
                  </Stack>
                )}
              </Card>
            );
          })}
        </Stack>
      ) : (
        <MedicationListView
          medications={medicationDataWithoutTypename[selectedReadingType]}
          viewType={viewType}
          selectedIds={selectedMedicationIds}
          onSelectionChange={onSelectionChange}
        />
      )}
    </Stack>
  );
};

export default MedicationList;
