import { Stack } from "@mui/material";
import CommonSkeleton from "../../components/CommonSkeleton";

const Skeleton = () => {
  return (
    <Stack gap={4}>
      <CommonSkeleton height={40} />
      <Stack gap={2.5}>
        {Array.from({ length: 2 }).map((_, index) => (
          <Stack gap={1} key={index}>
            <CommonSkeleton height={24} width={160} />
            <CommonSkeleton height={48} />
          </Stack>
        ))}
      </Stack>
      <Stack gap={3}>
        {Array.from({ length: 2 }).map((_, index) => (
          <Stack gap={1} key={index}>
            <CommonSkeleton height={200} />
          </Stack>
        ))}
      </Stack>
    </Stack>
  );
};

export default Skeleton;
