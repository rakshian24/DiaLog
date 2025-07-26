import { Box, Stack } from "@mui/material";
import CommonSkeleton from "../CommonSkeleton";

const Skeleton = () => {
  return (
    <Stack gap={3}>
      <CommonSkeleton height={60} />
      <Box alignSelf={"flex-end"}>
        <CommonSkeleton width={128} />
      </Box>
      <CommonSkeleton height={250} />
    </Stack>
  );
};

export default Skeleton;
