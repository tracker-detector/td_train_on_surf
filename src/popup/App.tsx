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
function App() {
  const currentPage = useStore((state) => state.currentPage)
  let page = <Home />
  
  switch (currentPage) {
    case 1: page = <Stats />; break;
    case 2: page = <Tracker />; break;
  }

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <main className="frame">
        {page}
        <Nav />
      </main>
    </ThemeProvider>
  )
}

export default App
