import { Chip, Stack, Typography, Paper } from "@mui/material";
import { colors } from "../../constants";

type FoodItem = {
  name: string;
};

type Props = {
  foods: FoodItem[];
};

const FoodDetails = ({ foods }: Props) => {
  return (
    <Paper
      variant="outlined"
      sx={{ p: 1, bgcolor: "#FFF7E7", borderRadius: 2 }}
    >
      <Typography
        fontWeight={500}
        mb={1}
        fontSize={14}
        color={colors.contentSecondary}
      >
        Food consumed
      </Typography>

      <Stack direction="row" gap={1} flexWrap="wrap">
        {foods.map((food, idx) => (
          <Chip
            key={idx}
            label={food.name}
            sx={{
              bgcolor: "#E0F2F1",
              fontWeight: 500,
              color: "#00695C",
            }}
          />
        ))}
      </Stack>
    </Paper>
  );
};

export default FoodDetails;
