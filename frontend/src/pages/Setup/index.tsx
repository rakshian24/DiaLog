import { Stack } from "@mui/material";
import TrackingPreferences from "./TrackingPreference";
import { GET_USER_SETUP_PROGRESS } from "../../graphql/queries";
import { useQuery } from "@apollo/client";
import SetupProgressBar from "../../components/SetupProgressBar";
import { SetupSteps } from "../../types";
import MedicationOnboarding from "../../components/MedicationOnboarding";

type Props = {};

const InitSetup = (props: Props) => {
  const { data, loading } = useQuery(GET_USER_SETUP_PROGRESS);

  if (loading) {
    return <p>Loading...</p>;
  }

  const progress = data?.getUserSetupProgress?.progress;

  const isTrackingPreferenceStepCompleted =
    progress?.[SetupSteps.TRACKING_PREFERENCES];

  const isMedicationStepCompleted = progress?.[SetupSteps.MEDICATIONS];

  return (
    <Stack gap={3}>
      <SetupProgressBar progress={progress} />
      {!isTrackingPreferenceStepCompleted && <TrackingPreferences />}
      {isTrackingPreferenceStepCompleted && !isMedicationStepCompleted && (
        <MedicationOnboarding />
      )}
    </Stack>
  );
};

export default InitSetup;
