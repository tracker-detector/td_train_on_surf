import { Typography } from "@mui/material";
import useStore from "../store/store"
import Grid from '@mui/material/Unstable_Grid2';
export const HeroSection = () => {
    const currentTab = useStore((state) => state.currentTab);
    const metrics = useStore((state) => state.stats);
    return (
        <div className="gradient">
            <Grid container spacing={2} sx={{ px: 2, pt: 2 }}>
                <Grid xs={2}>
                    <img
                        src={currentTab?.favIconUrl}
                        alt="logo"
                        height="40px"
                    />
                </Grid>
                <Grid xs={10}>
                    <Typography variant="h5" component="h5">
                        {currentTab && currentTab.url ? (new URL(currentTab.url)).hostname: "unknown" }
                    </Typography>
                </Grid>
                </Grid>
          <Typography variant="h6" component="h5">
                     Mse   {metrics?.mse }
            </Typography>
            <Typography variant="h6" component="h5">
                    Trackers {metrics?.totalTracker }
        </Typography>

            <Typography variant="h6" component="h5">
                       Identified Trackers {metrics?.identifiedTracker }
            </Typography>
            <Typography variant="h6" component="h5">
                    Non-Trackers {metrics?.totalNonTracker }
        </Typography>

            <Typography variant="h6" component="h5">
                       Identified Non-Trackers {metrics?.identifiedNonTracker }
        </Typography>

        </div>
    )
}