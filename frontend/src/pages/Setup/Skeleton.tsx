import { Stack, SxProps } from "@mui/material";
import CommonSkeleton from "../../components/CommonSkeleton";

type Props = {
  sx?: SxProps;
};

const Skeleton = ({ sx }: Props) => {
  return (
    <Stack gap={3} p={2}>
      <CommonSkeleton height={80} sx={{ ...sx }} />
      <CommonSkeleton height={400} sx={{ ...sx }} />
    </Stack>
  );
};

export default Skeleton;
