import { Nav } from "./components/Nav";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import useStore from "./store/store";
import { Home } from "./pages/Home";
import { Stats } from "./pages/Stats";
import { Tracker } from "./pages/Tracker";
import { Requests } from "./pages/Requests";


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
  3: <Requests/>
}

function App() {
  const currentPage = useStore((state) => state.currentPage)
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <main className="frame">
        {pages[currentPage]}
        <Nav />
      </main>
    </ThemeProvider>
  )
}

export default App
