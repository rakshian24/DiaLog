import DashboardIcon from "@mui/icons-material/Dashboard";
import AddIcon from "@mui/icons-material/Add";
import HistoryIcon from "@mui/icons-material/History";
import BarChartIcon from "@mui/icons-material/BarChart";
import SettingsIcon from "@mui/icons-material/Settings";
import { ROUTES } from "../constants";

const useMenuItemsList = () => {
  return [
    { text: "Dashboard", icon: <DashboardIcon />, path: ROUTES.DASHBOARD },
    {
      text: "Add Reading",
      icon: <AddIcon />,
      path: ROUTES.ADD_READING,
    },
    {
      text: "Reading History",
      icon: <HistoryIcon />,
      path: ROUTES.READING_HISTORY,
    },
    {
      text: "Reports & Analytics",
      icon: <BarChartIcon />,
      path: ROUTES.REPORTS,
    },
    { text: "Settings", icon: <SettingsIcon />, path: ROUTES.SETTINGS },
  ];
};

export default useMenuItemsList;
