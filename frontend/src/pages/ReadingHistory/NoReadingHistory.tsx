import { InsightsOutlined } from "@mui/icons-material";
import { Box, Stack, Typography } from "@mui/material";
import { FaPlus } from "react-icons/fa";
import Button from "../../components/CustomButton";
import { colors, ROUTES } from "../../constants";
import { useNavigate } from "react-router-dom";
import { FaFilterCircleXmark } from "react-icons/fa6";

type Props = {
  handleFilter: () => void;
};

const NoReadingHistory = ({ handleFilter }: Props) => {
  const navigate = useNavigate();
  return (
    <Box>
      <Stack
        gap={3}
        alignItems="center"
        justifyContent="center"
        sx={{
          border: `1px solid ${colors.grey2}`,
          borderRadius: 2,
          px: 3,
          py: 4,
          bgcolor: colors.white,
        }}
      >
        <Box
          sx={{
            bgcolor: "#F3F4F6",
            borderRadius: "50%",
            p: 2.5,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <InsightsOutlined sx={{ color: "#94A3B8", fontSize: 32 }} />
        </Box>

        <Stack spacing={1} textAlign="center">
          <Typography fontWeight={600} fontSize={18}>
            No Data Available
          </Typography>
          <Typography fontSize={14} color="text.secondary">
            We couldn't find any glucose readings for the selected date range.
            Start logging your daily glucose levels to see your health trends
            and insights.
          </Typography>
        </Stack>

        <Stack gap={2} width={"100%"}>
          <Button
            startIcon={<FaPlus />}
            buttonText="Log your reading"
            styles={{ width: "100%" }}
            onClick={() => navigate(ROUTES.ADD_READING)}
          />

          <Button
            buttonText="Reset filter"
            startIcon={<FaFilterCircleXmark style={{ color: colors.black }} />}
            styles={{
              textTransform: "none",
              fontWeight: 500,
              borderRadius: 2,
              color: "text.primary",
              borderColor: "#E5E7EB",
              bgcolor: "#F3F4F6",
              width: "100%",
              "&:hover": {
                bgcolor: "#F3F4F6",
                outline: "none",
                boxShadow: "none",
              },
            }}
            onClick={handleFilter}
          />
        </Stack>
      </Stack>
    </Box>
  );
};

export default NoReadingHistory;
