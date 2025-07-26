import { Stack } from "@mui/material";
import { WbSunny, LunchDining, NightsStay } from "@mui/icons-material";

const iconMap: Record<string, JSX.Element> = {
  Breakfast: <WbSunny sx={{ color: "#CA8A04", fontSize: 18 }} />,
  Lunch: <LunchDining sx={{ color: "#2563EB", fontSize: 18 }} />,
  Dinner: <NightsStay sx={{ color: "#4E46E5", fontSize: 18 }} />,
};

const bgMap: Record<string, string> = {
  Breakfast: "#FEF9C3",
  Lunch: "#DBEAFE",
  Dinner: "#E0E7FF",
};

const MealIcon = ({ meal }: { meal: string }) => (
  <Stack
    display="flex"
    alignItems="center"
    justifyContent="center"
    p={1.65}
    bgcolor={bgMap[meal]}
    borderRadius={2}
  >
    {iconMap[meal]}
  </Stack>
);

export default MealIcon;
