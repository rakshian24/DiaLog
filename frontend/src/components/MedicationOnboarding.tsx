import {
  Avatar,
  Backdrop,
  Box,
  Card,
  CircularProgress,
  Stack,
  Typography,
} from "@mui/material";
import { GiMedicines } from "react-icons/gi";
import { colors, ROUTES } from "../constants";
import Button from "./CustomButton";
import { AddOutlined, ChevronRight } from "@mui/icons-material";

import AddMedicationMobile from "../pages/AddMedication/AddMedicationMobile";
import { useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import {
  GET_ALL_MEDICATIONS,
  GET_USER_SETUP_PROGRESS,
} from "../graphql/queries";
import { Medication, SetupSteps } from "../types";
import { UPDATE_SETUP_PROGRESS } from "../graphql/mutations";
import { useNavigate } from "react-router-dom";
import { readingTimingLabels } from "../utils";
import { ClockIcon } from "@mui/x-date-pickers";

type Props = {};

const MedicationOnboarding = (props: Props) => {
  const navigate = useNavigate();

  const [openAddMedicationDialog, setOpenAddMedicationDialog] =
    useState<boolean>(false);

  const { data: medicationsData, loading: isMedicationsDataLoading } =
    useQuery(GET_ALL_MEDICATIONS);

  const [updateSetupProgress, { loading: isUpdateSetupProgressLoading }] =
    useMutation(UPDATE_SETUP_PROGRESS);

  if (isMedicationsDataLoading) {
    return <p>Loading...</p>;
  }

  const medications = medicationsData?.getAllMedications || [];

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

  return (
    <Stack gap={3}>
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
          maxWidth: 500,

          borderRadius: 3,
          p: 3,
          textAlign: "center",
        }}
      >
        <Avatar
          sx={{
            backgroundColor: "#E3F2FD",
            color: "#1976D2",
            margin: "auto",
            mb: 2,
            p: 1.5,
          }}
        >
          <GiMedicines />
        </Avatar>

        <Typography variant="h6" fontWeight={600}>
          Medication Information
        </Typography>

        <Typography
          variant="body2"
          color={colors.contentSecondary}
          sx={{ mt: 1, mb: 3 }}
        >
          Tell us about your current medications
        </Typography>
      </Card>
      <Box sx={{ alignSelf: "flex-end" }}>
        <Button
          onClick={() => setOpenAddMedicationDialog(true)}
          buttonText="Add medication"
          startIcon={<AddOutlined />}
        />
      </Box>

      {medications.length > 0 && (
        <Button
          onClick={handleMedOnboardingCompletion}
          buttonText="Continue to Dashboard"
          endIcon={<ChevronRight />}
          priority="success"
        />
      )}

      <Stack gap={2}>
        {medications.map((medication: Medication) => {
          return (
            <Card
              key={medication._id}
              sx={{
                maxWidth: 500,
                borderRadius: 3,
                p: 2,
              }}
            >
              <Stack gap={0.5}>
                <Typography fontWeight={600}>{medication.name}</Typography>
                <Typography
                  color={colors.contentSecondary}
                  fontSize={14}
                  fontWeight={500}
                >{`${medication.dosage} ${medication.dosageType}`}</Typography>
                <Stack direction={"row"} alignItems={"center"} gap={0.5} mt={1}>
                  <ClockIcon sx={{ color: colors.primary, fontSize: "17px" }} />
                  <Typography
                    color={colors.contentSecondary}
                    fontSize={13}
                    fontWeight={500}
                  >
                    {medication.readingTime
                      .map((rt) => readingTimingLabels[rt])
                      .reduce((acc, curr, idx, arr) => {
                        if (idx === 0) return curr;
                        if (idx === arr.length - 1) return `${acc} and ${curr}`;
                        return `${acc}, ${curr}`;
                      }, "")}
                  </Typography>
                </Stack>
              </Stack>
            </Card>
          );
        })}
      </Stack>
    </Stack>
  );
};

export default MedicationOnboarding;
