import { Box, SxProps } from "@mui/material";
import { colors } from "../constants";

type Props = {
  sx?: SxProps;
};

const DotSeparator = ({ sx }: Props) => {
  return (
    <Box
      sx={{
        bgcolor: colors.contentSecondary,
        width: "6px",
        height: "6px",
        borderRadius: "50%",
        mx: 0.5,
        ...sx,
      }}
    />
  );
};

export default DotSeparator;
