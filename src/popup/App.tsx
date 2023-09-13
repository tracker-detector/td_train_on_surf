import { Nav } from "./components/Nav";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import useStore from "./store/store";
import { Home } from "./pages/Home";
import { Stats } from "./pages/Stats";
import { Tracker } from "./pages/Tracker";


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
  2: <Tracker/>
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
