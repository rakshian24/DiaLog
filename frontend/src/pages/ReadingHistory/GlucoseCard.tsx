import { Stack, Typography } from "@mui/material";
import { colors } from "../../constants";
import { getStyleBasedOnGlucoseLevel } from "../../utils";

type Props = {
  label: string;
  value: number;
};

const GlucoseCard = ({ label, value }: Props) => {
  const { textColor } = getStyleBasedOnGlucoseLevel(true, value);
  return (
    <Stack
      bgcolor={colors.white}
      border={`1px solid ${colors.grey2}`}
      p={2}
      borderRadius={3}
      alignItems="center"
      justifyContent="center"
    >
      <Typography
        color={colors.contentSecondary}
        fontWeight={500}
        fontSize={14}
      >
        {label}
      </Typography>
      <Typography fontSize={26} fontWeight={600} color={textColor}>
        {value}
      </Typography>
      <Typography fontSize={16} fontWeight={600} color={textColor}>
        mg/dL
      </Typography>
    </Stack>
  );
};

export default GlucoseCard;
