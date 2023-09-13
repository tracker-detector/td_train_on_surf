import { Box, Slider, Stack, Switch, Typography } from "@mui/material";



export function SettingsSection() {
    return (
        <Box sx={{ width: '100%', maxWidth: '100%', py: 2, px: 2 }}>
            <Stack spacing={0}>
                <Stack direction="row" spacing={2} justifyContent="space-between" alignItems="center">
                    <Typography variant="subtitle1">Blocking Active</Typography>
                    <Switch defaultChecked />
                </Stack>
                <Stack direction="row" spacing={2} justifyContent="space-between" alignItems="center">
                    <Typography variant="subtitle1">Model Active</Typography>
                    <Switch defaultChecked />
                </Stack>
                <Typography variant="subtitle1" sx={{mt:1, mb: 2}}>Blocking Rate</Typography>
                <Slider
                    size="small"
                    defaultValue={70}
                    aria-label="Small"
                    valueLabelDisplay="auto"
                />
            </Stack>
        </Box>
    );
}