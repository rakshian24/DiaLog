import { useMediaQuery } from "@mui/material";

import { screenSize } from "../../constants";
import AddMedicationDesktop from "./AddMedicationDesktop";
import AddMedicationMobile from "./AddMedicationMobile";

const AddMedication = () => {
  const isTablet = useMediaQuery(`(max-width:${screenSize.tablet})`);

  if (isTablet) {
    return <AddMedicationMobile open={false} handleClose={() => {}} />;
  }
  return <AddMedicationDesktop />;
};

export default AddMedication;
