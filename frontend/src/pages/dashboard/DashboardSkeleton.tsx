import { Stack } from "@mui/material";
import React from "react";
import CommonSkeleton from "../../components/CommonSkeleton";

type Props = {};

const DashboardSkeleton = (props: Props) => {
  return (
    <Stack gap={3}>
      <CommonSkeleton />

      <Stack gap={2}>
        {Array.from({ length: 3 }).map((_, index) => (
          <CommonSkeleton height={200} key={index} />
        ))}
      </Stack>
    </Stack>
  );
};

export default DashboardSkeleton;
