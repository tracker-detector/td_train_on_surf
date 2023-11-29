import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import useStore from '../store/store';
import { Box, ListSubheader, Paper, Typography } from '@mui/material';
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

export const Stats = () => {
    const history = useStore((state) => state.history);
    const mseHist = history.map(x => x.mse);
    const totalTracker = history.map(x => x.totalTracker);
    const identifiedTracker = history.map(x => x.identifiedTracker);
    const totalNonTracker = history.map(x => x.totalNonTracker);
    const identifiedNonTracker = history.map(x => x.identifiedNonTracker);
    if (history == null || history.length == 0) {
        return <Box sx={{ height: '100%', px: 2, }}>
            <ListSubheader>Statistic</ListSubheader>
            <Typography variant="subtitle2" sx={{ position: "absolute", top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
               No statistic data found for tab.
            </Typography>
        </Box>
    }
    const mseData = {
        labels: mseHist.map((_x, i) => `Visit-${i}`),
        datasets: [
            {
                label: "Mse per Visit",
                data: mseHist,
                fill: false,
                borderColor: "black"
            }
        ]
    }
    const trackerData = {
        labels: totalTracker.map((_x, i) => `Visit-${i}`),
        datasets: [
            {
                label: "Identified/Total Tracker",
                data: totalTracker.map((x, i) => identifiedTracker[i] / x),
                fill: false,
                borderColor: "black"
            }
        ]
    }
    const nonTrackerData = {
        labels: totalNonTracker.map((_x, i) => `Visit-${i}`),
        datasets: [
            {
                label: "Identified/Total NonTracker",
                data: totalNonTracker.map((x, i) => identifiedNonTracker[i] / x),
                fill: false,
                borderColor: "black"
            }
        ]
    }
    return <Box sx={{ overflow: 'scroll' }}>
        <ListSubheader>
            Statistic
        </ListSubheader>
        <Paper sx={{ mx: 1, px: 2, mb: 2 }}>
            <Typography>Mse per Visit</Typography>
            <Line data={mseData} />
        </Paper>
        <Paper sx={{ mx: 1, px: 2, mb: 2 }}>
            <Typography>Total/Identified Tracker per Visit</Typography>
            <Line data={trackerData} />
        </Paper>
        <Paper sx={{ mx: 1, px: 2, mb: 2 }}>
            <Typography>Total/Identified NonTracker per Visit</Typography>
            <Line data={nonTrackerData} />
        </Paper>
        <br />
        <br />
        <br />
    </Box>
}