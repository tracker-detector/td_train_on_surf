import { Nav } from "./components/Nav";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import useStore from "./store/store";
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});
function App() {
  const currentPage = useStore((state) => state.currentPage)

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <main className="frame">
        <h1 >
          Simple React Typescript Tailwind Sample
         
        </h1>
         {currentPage}
        <Nav />
      </main>
    </ThemeProvider>
  )
}

export default App
