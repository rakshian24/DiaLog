import {
  Avatar,
  Backdrop,
  Box,
  Card,
  CircularProgress,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { GiMedicines } from "react-icons/gi";
import { colors, ROUTES, screenSize } from "../../constants";
import Button from "../CustomButton";
import { AddOutlined, ChevronRight } from "@mui/icons-material";

import AddMedicationMobile from "../../pages/AddMedication/AddMedicationMobile";
import { useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import {
  GET_ALL_MEDICATIONS,
  GET_USER_SETUP_PROGRESS,
} from "../../graphql/queries";
import { SetupSteps } from "../../types";
import { UPDATE_SETUP_PROGRESS } from "../../graphql/mutations";
import { useNavigate } from "react-router-dom";
import MedicationList from "../MedicationList";
import Skeleton from "./Skeleton";

type Props = {};

const MedicationOnboarding = (props: Props) => {
  const navigate = useNavigate();
  const isTablet = useMediaQuery(`(max-width:${screenSize.tablet})`);

  const [openAddMedicationDialog, setOpenAddMedicationDialog] =
    useState<boolean>(false);

  const { data: medicationsData, loading: isMedicationsDataLoading } =
    useQuery(GET_ALL_MEDICATIONS);

  const [updateSetupProgress, { loading: isUpdateSetupProgressLoading }] =
    useMutation(UPDATE_SETUP_PROGRESS);

  if (isMedicationsDataLoading) {
    return <Skeleton />;
  }

  const medications = medicationsData?.getAllMedications || [];
  const hasAddedMedications = medications.length > 0;

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

      {hasAddedMedications && <MedicationList />}

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
