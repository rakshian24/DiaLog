import { Stack } from "@mui/material";
import { GET_ALL_READINGS } from "../../graphql/queries";
import { useQuery } from "@apollo/client";
import NoReadings from "./NoReadings";

const Dashboard = () => {
  const { data: readingsData, loading: isReadingsDataLoading } =
    useQuery(GET_ALL_READINGS);

  if (isReadingsDataLoading) {
    return <p>Loading...</p>;
  }

  const readings = readingsData?.getAllReadings || [];

  return (
    <Stack>
      {readings.length > 0 ? <Stack>Readings found</Stack> : <NoReadings />}
    </Stack>
  );
};

export default Dashboard;
