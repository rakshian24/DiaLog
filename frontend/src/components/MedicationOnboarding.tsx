import {
  Avatar,
  Backdrop,
  Box,
  Card,
  CircularProgress,
  Grid,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { GiCoffeeCup, GiForkKnifeSpoon, GiMedicines } from "react-icons/gi";
import { colors, ROUTES, screenSize } from "../constants";
import Button from "./CustomButton";
import { AddOutlined, ChevronRight, DinnerDining } from "@mui/icons-material";

import AddMedicationMobile from "../pages/AddMedication/AddMedicationMobile";
import { useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import {
  GET_ALL_MEDICATIONS,
  GET_ALL_MEDICATIONS_BY_MEAL_TYPE,
  GET_USER_SETUP_PROGRESS,
} from "../graphql/queries";
import {
  Medication,
  MedicationType,
  MedicationViewType,
  ReadingTiming,
  SetupSteps,
} from "../types";
import { UPDATE_SETUP_PROGRESS } from "../graphql/mutations";
import { useNavigate } from "react-router-dom";
import { readingTimingLabels } from "../utils";
import { BiSolidInjection } from "react-icons/bi";
import { FaCloudSun, FaMoon, FaSun } from "react-icons/fa";
import DotSeparator from "./DotSeparator";
import CustomSegmentedToggle, {
  CustomSegmentedToggleOption,
} from "./CustomSegmentedToggle";

type Props = {};

const MedicationOnboarding = (props: Props) => {
  const [viewType, setViewType] = useState<MedicationViewType>(
    MedicationViewType.LIST_VIEW
  );
  const navigate = useNavigate();
  const isTablet = useMediaQuery(`(max-width:${screenSize.tablet})`);

  const [openAddMedicationDialog, setOpenAddMedicationDialog] =
    useState<boolean>(false);

  const { data: medicationsData, loading: isMedicationsDataLoading } =
    useQuery(GET_ALL_MEDICATIONS);

  const {
    data: medicationsByMealTypeData,
    loading: isMedicationsByMealTypeDataLoading,
  } = useQuery(GET_ALL_MEDICATIONS_BY_MEAL_TYPE);

  const [updateSetupProgress, { loading: isUpdateSetupProgressLoading }] =
    useMutation(UPDATE_SETUP_PROGRESS);

  if (isMedicationsDataLoading || isMedicationsByMealTypeDataLoading) {
    return <p>Loading...</p>;
  }

  const medications = medicationsData?.getAllMedications || [];
  const hasAddedMedications = medications.length > 0;

  const medicationByMealTypeData =
    medicationsByMealTypeData?.getAllMedicationsByMealType || {};

  const { __typename, ...medicationDataWithoutTypename } =
    medicationByMealTypeData;

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

  const handleMedOnboardingCompletion = async () => {
    const { data } = await updateSetupProgress({
      variables: {
        input: {
          step: SetupSteps.MEDICATIONS,
          isProgressComplete: true,
        },
      },
      refetchQueries: [
        {
          query: GET_USER_SETUP_PROGRESS,
        },
      ],
    });

    if (data?.updateUserSetupProgress?.userId) {
      navigate(ROUTES.DASHBOARD);
    }
  };

  const chipBgColorMap: Record<string, string> = {
    BEFORE_BREAKFAST: "#FEFBEB",
    AFTER_BREAKFAST: "#FFF7ED",
    BEFORE_LUNCH: "#FEFCE8",
    AFTER_LUNCH: "#F6FEE7",
    BEFORE_DINNER: "#FAF5FF",
    AFTER_DINNER: "#EEF2FF",
  };

  const chipColorMap: Record<string, string> = {
    BEFORE_BREAKFAST: "#B4530A",
    AFTER_BREAKFAST: "#EA580B",
    BEFORE_LUNCH: "#CA8A03",
    AFTER_LUNCH: "#65A20C",
    BEFORE_DINNER: "#9333E9",
    AFTER_DINNER: "#4F45E4",
  };

  const iconMap: Record<string, JSX.Element> = {
    BEFORE_BREAKFAST: (
      <FaCloudSun
        style={{
          fontSize: "18px",
          color: chipColorMap.BEFORE_BREAKFAST,
        }}
      />
    ),
    AFTER_BREAKFAST: (
      <GiCoffeeCup
        style={{
          fontSize: "18px",
          color: chipColorMap.AFTER_BREAKFAST,
        }}
      />
    ),
    BEFORE_LUNCH: (
      <FaSun
        style={{
          fontSize: "18px",
          color: chipColorMap.BEFORE_LUNCH,
        }}
      />
    ),
    AFTER_LUNCH: (
      <GiForkKnifeSpoon
        style={{
          fontSize: "18px",
          color: chipColorMap.AFTER_LUNCH,
        }}
      />
    ),
    BEFORE_DINNER: (
      <FaMoon
        style={{
          fontSize: "18px",
          color: chipColorMap.BEFORE_DINNER,
        }}
      />
    ),
    AFTER_DINNER: (
      <DinnerDining
        style={{
          fontSize: "18px",
          color: chipColorMap.AFTER_DINNER,
        }}
      />
    ),
  };

  return (
    <Stack gap={3} mb={isTablet ? 10 : 3}>
      <AddMedicationMobile
        open={openAddMedicationDialog}
        handleClose={() => setOpenAddMedicationDialog(false)}
      />
      <Backdrop
        sx={{ color: "#fff", zIndex: 9999 }}
        open={isUpdateSetupProgressLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Card
        sx={{
          borderRadius: 3,
          p: 3,
          textAlign: "center",
        }}
      >
        <Stack
          gap={hasAddedMedications ? 2 : 1}
          direction={hasAddedMedications ? "row" : "column"}
          display={"flex"}
          alignItems={"center"}
        >
          <Avatar
            sx={{
              backgroundColor: "#E3F2FD",
              color: "#1976D2",
              p: hasAddedMedications ? 0.5 : 1.5,
            }}
          >
            <GiMedicines />
          </Avatar>
          <Stack gap={1}>
            <Typography variant="h6" fontWeight={600}>
              Medication Information
            </Typography>
            <Typography
              variant="body2"
              color={colors.contentSecondary}
              sx={{ mb: hasAddedMedications ? 0 : 2 }}
            >
              Tell us about your current medications
            </Typography>
          </Stack>
        </Stack>
      </Card>
      <Box sx={{ alignSelf: "flex-end" }}>
        <Button
          onClick={() => setOpenAddMedicationDialog(true)}
          buttonText="Add medication"
          startIcon={<AddOutlined />}
        />
      </Box>

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

      {viewType === MedicationViewType.LIST_VIEW ? (
        <Stack gap={2}>
          {medications.map((medication: Medication) => {
            const isMedicationTypeTablet =
              medication.type === MedicationType.tablet;

            const readingTimeLength = medication.readingTime.length;
            return (
              <Card
                key={medication._id}
                sx={{
                  borderRadius: 3,
                  p: 2,
                }}
              >
                <Stack gap={1}>
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
                  <Stack
                    direction={"row"}
                    gap={1.25}
                    alignItems={"center"}
                    mb={1}
                  >
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
                      <Typography
                        fontSize={isTablet ? 12 : 14}
                        fontWeight={"500"}
                      >
                        {isMedicationTypeTablet ? "Tablet" : "Insulin"}
                      </Typography>
                    </Box>

                    {isMedicationTypeTablet && (
                      <Typography
                        fontSize={isTablet ? 12 : 14}
                        fontWeight={"500"}
                        color={colors.contentSecondary}
                      >{`${medication.dosage} ${medication.dosageType}`}</Typography>
                    )}
                    {isMedicationTypeTablet && (
                      <DotSeparator sx={{ mx: 0.5 }} />
                    )}
                    <Typography fontSize={isTablet ? 12 : 14}>
                      {readingTimeLength}{" "}
                      {readingTimeLength > 1 ? "times" : "time"} daily
                    </Typography>
                  </Stack>
                  <Grid container spacing={2}>
                    {medication.readingTime.map((time) => {
                      const isTablet =
                        medication.type === MedicationType.tablet;
                      const dosage = isTablet
                        ? `1 ${
                            medication.dosageType === "mg"
                              ? "tablet"
                              : medication.dosageType
                          }`
                        : `${medication.dosagePerReadingTime?.[time] || "-"} ${
                            medication.dosageType
                          }`;

                      const label = readingTimingLabels[time];

                      return (
                        <Grid
                          item
                          xs={readingTimeLength > 1 ? 6 : 12}
                          sm={readingTimeLength > 1 ? 6 : 12}
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
                                {iconMap[time]}
                                <Typography
                                  fontSize={13}
                                  fontWeight={600}
                                  color={chipColorMap[time]}
                                >
                                  {label}
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
      ) : (
        <Stack>
          {Object.entries(
            medicationDataWithoutTypename as Record<ReadingTiming, Medication[]>
          ).map(([timingKey, meds]) => {
            const timing = timingKey as ReadingTiming;

            const label = readingTimingLabels[timing];
            const icon = iconMap[timing];
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
                  {icon}
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
      )}

      {hasAddedMedications && (
        <Button
          onClick={handleMedOnboardingCompletion}
          buttonText="Continue to Dashboard"
          endIcon={<ChevronRight />}
          priority="success"
        />
      )}
    </Stack>
  );
};

export default MedicationOnboarding;
