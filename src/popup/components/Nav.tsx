import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import EqualizerIcon from '@mui/icons-material/Equalizer';
import BugReportIcon from '@mui/icons-material/BugReport';
import HomeIcon from '@mui/icons-material/Home';
import HttpIcon from '@mui/icons-material/Http';
import SettingsIcon from '@mui/icons-material/Settings';
import Paper from '@mui/material/Paper';
import useStore from '../store/store';
export const Nav = () => {
  const currentPage = useStore((state) => state.currentPage)
  const setCurrentPage = useStore((state) => state.setCurrentPage)
    return (
    <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
       <BottomNavigation
        showLabels
        value={currentPage}
        onChange={(_event, newValue) => {
          setCurrentPage(newValue);
        }}
      >
        <BottomNavigationAction label="Home" icon={<HomeIcon />} />
        <BottomNavigationAction label="Stats" icon={<EqualizerIcon />} />
          <BottomNavigationAction label="Trackers" icon={<BugReportIcon />} />
          <BottomNavigationAction label="Requests" icon={<HttpIcon />} />
          <BottomNavigationAction label="Train" icon={<SettingsIcon />} />
      </BottomNavigation>
    </Paper>
  );
}