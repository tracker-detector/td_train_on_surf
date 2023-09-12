import { Nav } from "./components/Nav";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { LineChart } from '@mui/x-charts/LineChart';
import Paper from '@mui/material/Paper';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});
function App() {

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <main className="frame">
        <h1 >
          Simple React Typescript Tailwind Sample
         
        </h1>
         <Paper elevation={2}>
        <LineChart
      xAxis={[{ data: [1, 2, 3, 5, 8, 10] }]}
      series={[
        {
          data: [2, 5.5, 2, 8.5, 1.5, 5],
        },
      ]}

      height={300}
          />
          </Paper>
        <Nav />
      </main>
    </ThemeProvider>
  )
}

export default App
