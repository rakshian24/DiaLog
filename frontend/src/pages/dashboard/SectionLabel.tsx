import { Typography } from "@mui/material";
import { colors } from "../../constants";

const SectionLabel = ({
  label,
  color = colors.contentTertiary,
}: {
  label: string;
  color?: string;
}) => (
  <Typography fontSize={13} color={color} fontWeight={"500"}>
    {label}
  </Typography>
);

export default SectionLabel;
