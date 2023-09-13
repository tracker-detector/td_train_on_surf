import { Box, Slider, Stack, Switch, Typography } from "@mui/material";
import useStore from "../store/store";

export function SettingsSection() {
    const rate = useStore((state) => state.blockingRate);
    const setRate = useStore((state) => state.setBlockingRate);
    const blockingActive = useStore((state) => state.blockingActive);
    const setBlockingActive = useStore((state) => state.setBlockingActive);
    const modelActive = useStore((state) => state.modelActive);
    const setModelActive = useStore((state) => state.setModelActive);
    return (
        <Box sx={{ width: '100%', maxWidth: '100%', py: 2, px: 2 }}>
            <Stack spacing={0}>
                <Stack direction="row" spacing={2} justifyContent="space-between" alignItems="center">
                    <Typography variant="subtitle1">Blocking Active</Typography>
                    <Switch checked={blockingActive} onChange={(_event, checked) => {
                        setBlockingActive(checked);
                    }}/>
                </Stack>
                <Stack direction="row" spacing={2} justifyContent="space-between" alignItems="center">
                    <Typography variant="subtitle1">Model Active</Typography>
                    <Switch checked={modelActive} onChange={(_event, checked) => {
                        setModelActive(checked);
                    }} />
                </Stack>
                <Typography variant="subtitle1" sx={{ mt: 1, mb: 2 }}>Blocking Rate</Typography>
                <Stack direction="row" spacing={2} justifyContent="space-between" alignItems="center">
                   <Slider
                        size="small"
                        min={0}
                        max={1}
                        step={0.01}
                        defaultValue={rate}
                        onChange={(_event, value) => {
                            setRate(value as number);
                        }}
                    aria-label="Small"
                    valueLabelDisplay="off"
                />
                    <Typography variant="caption">{ Math.floor(rate * 100) }%</Typography>
                </Stack>
                
            </Stack>
        </Box>
    );
}