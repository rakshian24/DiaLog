import React from "react";
import { Box, LinearProgress, Typography, Stack } from "@mui/material";

interface SetupProgressBarProps {
  progress: Record<string, boolean>; // e.g., { trackingPreferences: false, medications: true }
}

const SetupProgressBar: React.FC<SetupProgressBarProps> = ({ progress }) => {
  const steps = Object.keys(progress);
  const totalSteps = steps.length;
  const completedSteps = steps.filter((step) => progress[step]).length;

  const percentage = Math.round((completedSteps / totalSteps) * 100);

  return (
    <Box>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={1}
      >
        <Typography fontWeight={500}>
          Step {completedSteps + 1} of {totalSteps}
        </Typography>
        <Typography fontWeight={500}>{percentage}%</Typography>
      </Stack>

      <LinearProgress
        variant="determinate"
        value={percentage}
        sx={{
          height: 10,
          borderRadius: 5,
          "& .MuiLinearProgress-bar": {
            borderRadius: 5,
            backgroundColor: "#1976D2", // same blue as your screenshot
          },
          backgroundColor: "#E0E0E0",
        }}
      />
    </Box>
  );
};

export default SetupProgressBar;
