import { Avatar, Card, Typography } from "@mui/material";
import { GiMedicines } from "react-icons/gi";
import { colors } from "../constants";

type Props = {};

const MedicationOnboarding = (props: Props) => {
  return (
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
  );
};

export default MedicationOnboarding;
