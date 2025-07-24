import { Box, Typography } from "@mui/material";
import dayjs from "dayjs";
import { useReadingStyles } from "../../hooks/useReadingStyles";

type Props = {
  label: string;
  value?: number;
  time?: string;
};

const DashboardReadingBlock = ({ label, value, time }: Props) => {
  const { bgcolor, color } = useReadingStyles(label, value);
  return (
    <Box
      textAlign="center"
      flex={1}
      bgcolor={bgcolor}
      borderRadius={2}
      py={1}
      px={2}
    >
      <Typography
        color={value ? color : "text.secondary"}
        fontWeight={"500"}
        fontSize={13}
      >
        {label}
      </Typography>
      <Typography fontWeight={600} fontSize="18px" color={color}>
        {value ?? "--"}{" "}
        <Typography
          component="span"
          fontWeight={"500"}
          fontSize={13}
          color={color}
        >
          mg/dL
        </Typography>
      </Typography>
      <Typography
        color={value ? color : "text.secondary"}
        fontWeight={"500"}
        fontSize={13}
      >
        {time ? dayjs(time).format("h:mm A") : "--"}
      </Typography>
    </Box>
  );
};

export default DashboardReadingBlock;
