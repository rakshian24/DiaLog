import { Grid } from "@mui/material";
import GlucoseCard from "./GlucoseCard";
import { ReadingsByFilterResponse } from "../../types";

type Props = {
  readings: ReadingsByFilterResponse;
};

const ReadingHistoryBody = ({ readings }: Props) => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={4}>
        <GlucoseCard label="Average" value={readings.averageGlucoseLevel} />
      </Grid>
      <Grid item xs={4}>
        <GlucoseCard label="Highest" value={readings.highestGlucoseLevel} />
      </Grid>
      <Grid item xs={4}>
        <GlucoseCard label="Lowest" value={readings.lowestGlucoseLevel} />
      </Grid>
    </Grid>
  );
};

export default ReadingHistoryBody;
