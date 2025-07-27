import { SxProps } from "@mui/material";
import CommonSkeleton from "../../components/CommonSkeleton";

type Props = {
  sx?: SxProps;
};

const Skeleton = ({ sx }: Props) => {
  return <CommonSkeleton height={400} sx={sx} />;
};

export default Skeleton;
