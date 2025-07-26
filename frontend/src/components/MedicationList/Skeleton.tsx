import { Stack } from "@mui/material";
import CommonSkeleton from "../CommonSkeleton";

const Skeleton = () => {
  return (
    <Stack gap={3}>
      <CommonSkeleton />
      <CommonSkeleton height={200} />
    </Stack>
  );
};

export default Skeleton;
