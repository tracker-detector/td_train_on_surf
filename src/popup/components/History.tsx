import { LineChart } from '@mui/x-charts/LineChart';
import useStore from '../store/store';
export function History() {
    const history = useStore((state) => state.history);
    const mseHist = history.map(x => x.mse);
    const tracker = history.map(x => x.totalTracker);
    const nonTracker = history.map(x => x.totalNonTracker);
    const identTracker = history.map(x => x.identifiedTracker);
    const identNonTracker = history.map(x => x.identifiedNonTracker);
    return <LineChart
  xAxis={[{ data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] }]}
        series={[
            { label: "MSE", data: mseHist },
            { label: "Tracker", data: tracker },
            { label: "Non-Tracker", data: nonTracker },
            { label: "Identified Tracker", data: identTracker },
            {label: "Identified Non-Tracker", data: identNonTracker}
        ]}
        width={350}
  height={400}
/>
}