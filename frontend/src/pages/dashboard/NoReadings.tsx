import { Avatar, Stack, Typography } from "@mui/material";
import { BsHeartFill } from "react-icons/bs";
import { GoGraph } from "react-icons/go";
import useResponsiveFontSizes from "../../hooks/useResponsiveFontSizes";
import { colors, ROUTES } from "../../constants";
import Button from "../../components/CustomButton";
import { useNavigate } from "react-router-dom";
import { AddOutlined } from "@mui/icons-material";

type Props = {};

const NoReadings = (props: Props) => {
  const { sectionTitle, pageHeading } = useResponsiveFontSizes();
  const navigate = useNavigate();

  return (
    <Stack gap={2} justifyContent={"center"}>
      <Avatar
        sx={{
          backgroundColor: "#E3F2FD",
          color: "#1976D2",
          p: 1.5,
          alignSelf: "center",
        }}
      >
        <BsHeartFill />
      </Avatar>
      <Stack gap={1} textAlign={"center"} mb={2}>
        <Typography fontSize={pageHeading} fontWeight={"500"}>
          Welcome to DiaLog!
        </Typography>
        <Typography color={colors.contentSecondary} fontSize={14}>
          Start tracking your glucose levels, meals, <br />
          and medications to better manage <br />
          your health journey.
        </Typography>
      </Stack>

      <Stack
        bgcolor={colors.white}
        borderRadius={3}
        p={3}
        justifyContent={"center"}
        alignItems={"center"}
        gap={2}
        border={`1px solid ${colors.grey3}`}
      >
        <Avatar
          sx={{
            backgroundColor: "#E3F2FD",
            color: "#1976D2",
            p: 1.5,
          }}
        >
          <GoGraph />
        </Avatar>
        <Stack gap={1} textAlign={"center"}>
          <Typography fontSize={sectionTitle} fontWeight={"500"}>
            Track Your Glucose
          </Typography>
          <Typography color={colors.contentSecondary} fontSize={14} mb={2}>
            Record your blood glucose readings before
            <br /> and after meals to see patterns.
          </Typography>
          <Button
            buttonText="Add first reading"
            onClick={() => navigate(ROUTES.ADD_READING)}
            startIcon={<AddOutlined />}
          />
        </Stack>
      </Stack>
    </Stack>
  );
};

export default NoReadings;
