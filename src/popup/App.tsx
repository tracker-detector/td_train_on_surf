import { Nav } from "./components/Nav";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import useStore from "./store/store";
import { Home } from "./pages/Home";
import { Stats } from "./pages/Stats";
import { Tracker } from "./pages/Tracker";
import { Requests } from "./pages/Requests";
import { Settings } from "./pages/Settings";
import { Stack } from "@mui/material";


const darkTheme = createTheme({
  // palette: {
  //   mode: 'dark',
  // },
});
type Navigation = {
  [index: number]: JSX.Element
}
const pages : Navigation= {
  0: <Home />,
  1: <Stats />,
  2: <Tracker />,
  3: <Requests />,
  4: <Settings />
}

function App() {
  const currentPage = useStore((state) => state.currentPage)
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Stack className="frame" spacing={0} direction="column" alignItems="stretch" justifyContent="space-between">
        
        {pages[currentPage]}
        <Nav />
      </Stack>
    </ThemeProvider>
  )
}

export default App
