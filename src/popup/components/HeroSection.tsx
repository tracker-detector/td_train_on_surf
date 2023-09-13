import { Box, Paper, Typography } from "@mui/material";
import useStore from "../store/store"
import Grid from '@mui/material/Unstable_Grid2';
export const HeroSection = () => {
    const currentTab = useStore((state) => state.currentTab);
    const metrics = useStore((state) => state.stats);
    return (
        <Box className="gradient" >
            <Box className="white-layer" sx={{ px: 2, py: 2 }}>
                <Grid container spacing={2}>
                    {currentTab && currentTab.favIconUrl ? <Grid xs={2}>
                        <img
                            src={currentTab?.favIconUrl}
                            height="40px"
                        />
                    </Grid> : <></>}
                    <Grid xs={10}>
                        <Typography variant="h5" component="h5">
                            {currentTab && currentTab.url ? (new URL(currentTab.url)).hostname : "unknown"}
                        </Typography>
                    </Grid>
                    <Grid xs={6}>
                        <Paper className="translucent" sx={{ px: 1, py: 1 }} elevation={0}>
                            <Typography variant="subtitle1" component="p" align="right" fontSize={18}>
                                <Typography variant="caption" fontWeight="bold" fontSize={8}>MSE:</Typography> {metrics?.mse.toFixed(6)}
                            </Typography>
                        </Paper>
                    </Grid>
                    <Grid xs={6}>
                        <Paper className="translucent" sx={{ px: 1, py: 1 }} elevation={0}>
                            <Typography variant="subtitle1" component="p" align="right" fontSize={18}>
                                <Typography variant="caption" fontWeight="bold" fontSize={8}>Requests:</Typography> {metrics ? metrics.totalNonTracker + metrics.totalTracker: 0}
                            </Typography>
                        </Paper>
                    </Grid>
                    <Grid xs={6}>
                        <Paper className="translucent" sx={{ px: 1, py: 1 }} elevation={0}>
                            <Typography variant="subtitle1" component="p" align="right" fontSize={18}>
                                 <Typography variant="caption" fontWeight="bold" fontSize={8}>No-Tracker:</Typography> {metrics?.totalNonTracker}
                            </Typography>
                        </Paper>
                    </Grid>
                    <Grid xs={6}>
                        <Paper className="translucent" sx={{ px: 1, py: 1 }} elevation={0}>
                            <Typography variant="subtitle1" component="p" align="right" fontSize={18}>
                                <Typography variant="caption" fontWeight="bold" fontSize={8}>Tracker:</Typography> {metrics?.totalTracker}
                            </Typography>
                        </Paper>
                    </Grid>
                    <Grid xs={6}>
                        <Paper className="translucent" sx={{ px: 1, py: 1 }} elevation={0}>
                            <Typography variant="subtitle1" component="p" align="right" fontSize={18}>
                                <Typography variant="caption" fontWeight="bold" fontSize={8}>Ident-No-Tracker:</Typography> {metrics?.identifiedNonTracker}
                            </Typography>
                        </Paper>
                    </Grid>
                    <Grid xs={6}>
                        <Paper className="translucent" sx={{ px: 1, py: 1 }} elevation={0}>
                            <Typography variant="subtitle1" component="p" align="right" fontSize={18}>
                                <Typography variant="caption" fontWeight="bold" fontSize={8}>Ident-Tracker:</Typography> {metrics?.identifiedTracker}
                            </Typography>
                        </Paper>
                    </Grid>
                </Grid>
            </Box>

        </Box>
    )
}