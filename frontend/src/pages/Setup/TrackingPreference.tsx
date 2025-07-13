import React, { useState } from "react";
import {
  Box,
  Card,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  Avatar,
  Stack,
  Backdrop,
  CircularProgress,
} from "@mui/material";
import { AccessTimeFilled, ChevronRightOutlined } from "@mui/icons-material";
import { colors, ROUTES } from "../../constants";
import Button from "../../components/CustomButton";
import {
  ADD_POST_MEAL_TIME_MUTATION,
  UPDATE_SETUP_PROGRESS,
} from "../../graphql/mutations";
import { useMutation } from "@apollo/client";
import { createPmtMutationPayload, pmtTrackingOptions } from "../../utils";
import { useNavigate } from "react-router-dom";
import { SetupSteps } from "../../types";
import { GET_USER_SETUP_PROGRESS } from "../../graphql/queries";

const TrackingPreferences = () => {
  const [trackingPreference, setTrackingPreference] = useState("");
  const navigate = useNavigate();

  const [addPostMealTime, { loading: isAddPmtLoading }] = useMutation(
    ADD_POST_MEAL_TIME_MUTATION
  );

  const [updateSetupProgress, { loading: isUpdateSetupProgressLoading }] =
    useMutation(UPDATE_SETUP_PROGRESS);

  const handleOnSave = async () => {
    const payload = await createPmtMutationPayload(
      trackingPreference,
      pmtTrackingOptions
    );

    const { data } = await addPostMealTime({
      variables: { input: payload },
    });

    if (data?.addPostMealTime?.length > 0) {
      const { data } = await updateSetupProgress({
        variables: {
          input: {
            step: SetupSteps.TRACKING_PREFERENCES,
            isProgressComplete: true,
          },
        },
        refetchQueries: [
          {
            query: GET_USER_SETUP_PROGRESS,
          },
        ],
      });
      if (data?.updateUserSetupProgress?._id) {
        navigate(ROUTES.DASHBOARD);
      }
    }
  };

  return (
    <Stack gap={3}>
      <Backdrop
        sx={{ color: "#fff", zIndex: 9999 }}
        open={isAddPmtLoading || isUpdateSetupProgressLoading}
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
          <AccessTimeFilled sx={{ fontSize: "28px", color: colors.primary }} />
        </Avatar>

        <Typography variant="h6" fontWeight={600}>
          Tracking Preferences
        </Typography>

        <Typography
          variant="body2"
          color={colors.contentSecondary}
          sx={{ mt: 1, mb: 3 }}
        >
          When would you like to track your glucose readings after meals?
        </Typography>

        <RadioGroup
          value={trackingPreference}
          onChange={(e) => setTrackingPreference(e.target.value)}
        >
          {pmtTrackingOptions.map((option) => (
            <FormControlLabel
              key={option.value}
              value={option.value}
              control={<Radio />}
              label={
                <Box sx={{ textAlign: "left" }}>
                  <Typography fontWeight={600}>{option.label}</Typography>
                  <Typography variant="body2" color={colors.contentSecondary}>
                    {option.description}
                  </Typography>
                </Box>
              }
              sx={{
                border: `2px solid ${colors.lightGrey3}`,
                borderRadius: 2,
                mr: 0,
                ml: 0.25,
                p: 2,
                mb: 2,
                alignItems: "flex-start",
                "&.Mui-checked": {
                  borderColor: colors.lightGrey3,
                },
              }}
            />
          ))}
        </RadioGroup>
      </Card>
      <Box sx={{ alignSelf: "flex-end" }}>
        <Button
          onClick={handleOnSave}
          buttonText="Save & Continue"
          endIcon={<ChevronRightOutlined />}
          disabled={!trackingPreference}
        />
      </Box>
    </Stack>
  );
};

export default TrackingPreferences;
