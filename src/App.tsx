
import { MobileBottomNavBar } from "./components/common/MobileBottomNavBar";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";

const App = () => {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <MobileBottomNavBar />
    </LocalizationProvider>
  );
};

export default App;
