import { Stack, SxProps } from "@mui/material";
import CommonSkeleton from "../../components/CommonSkeleton";

type Props = {
  sx?: SxProps;
};

const Skeleton = ({ sx }: Props) => {
  return (
    <Stack gap={2}>
      <Stack direction="row" gap={2}>
        {Array.from({ length: 3 }).map((_, index) => (
          <CommonSkeleton key={index} width="100%" height={80} sx={{ ...sx }} />
        ))}
      </Stack>

      <Stack gap={2}>
        <CommonSkeleton height={90} sx={{ ...sx }} />
        {Array.from({ length: 3 }).map((_, index) => (
          <CommonSkeleton key={index} height={60} sx={{ ...sx }} />
        ))}
      </Stack>
    </Stack>
  );
};

export default Skeleton;
