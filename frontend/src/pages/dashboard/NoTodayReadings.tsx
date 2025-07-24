import {
  Avatar,
  Box,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { PiExclamationMark } from "react-icons/pi";
import Button from "../../components/CustomButton";
import { colors, ROUTES } from "../../constants";
import { useNavigate } from "react-router-dom";

const NoTodayReadings = () => {
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();

  return (
    <Box
      px={3}
      py={2}
      borderRadius={3}
      border={`2px solid ${colors.lightOrange1}`}
      bgcolor={colors.orangeBg1}
      display="flex"
      alignItems={isSmall ? "flex-start" : "center"}
      flexDirection="row"
      gap={2}
      mb={1}
    >
      <Avatar
        sx={{
          backgroundColor: colors.lightOrange2,
          color: colors.orange1,
          p: 0.75,
          mt: isSmall ? "4px" : 0,
        }}
      >
        <PiExclamationMark fontSize={28} fontWeight="600" />
      </Avatar>
      <Stack spacing={2} flex={1}>
        <Box>
          <Typography
            color={colors.orange1}
            fontWeight={600}
            fontSize="17.5px"
            mb={0.5}
          >
            No readings today
          </Typography>
          <Typography
            color={colors.contentSecondary}
            fontSize="14.5px"
            lineHeight={1.5}
          >
            You haven't logged any glucose readings or meals today. Here are
            your last recorded readings from yesterday.
          </Typography>
        </Box>

        <Box>
          <Button
            buttonText="Add Today's Reading"
            styles={{
              bgcolor: colors.orange1,
              color: colors.white,
            }}
            onClick={() => navigate(ROUTES.ADD_READING)}
          />
        </Box>
      </Stack>
    </Box>
  );
};

export default NoTodayReadings;
