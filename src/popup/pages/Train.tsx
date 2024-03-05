import { Box, Button, Card, CardActions, CardContent, Input, ListSubheader, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material"
import useStore from "../store/store"
import * as tf from "@tensorflow/tfjs";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import browser from "webextension-polyfill";

export const Train = () => {
    const seenRequests = useStore((state) => state.seenRequests);
    const trainingRuns = useStore((state) => state.trainingRuns);
    const latestLoss = useStore((state) => state.latestLoss);
    const trainingList = useStore((state) => state.trainingList);
    const outputUrl = useStore((state) => state.outputUrl);
    const setOutputUrl = useStore((state) => state.setOutputUrl);
    const startDownload = async () => {
        const model = await tf.loadLayersModel("indexeddb://td");
        return await model.save(outputUrl); 
    };
    
    startDownload().then(() => {
        console.log('Download started successfully');
    }).catch((err) => {
        console.error('Error starting download:', err);
    });
    
    return <Box sx={{ px: 2, overflow: "scroll" }}>
        <ListSubheader sx={{ mb: 1 }}>Model</ListSubheader>
        <Card sx={{width: '100%'}}>
            <CardContent>
                <Typography gutterBottom variant="h6" component="div">
                    Current Model
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Metrics: <br />
                    Total Requests: {seenRequests} <br />
                    Total Training Runs: {trainingRuns} <br />
                    Latest Loss: {latestLoss}
                </Typography>    
                <Input sx={{minWidth: '80%', mt: 2}} type="text" value={outputUrl} onChange={(e) => setOutputUrl(e.target.value)}/>
            </CardContent>
            
            <CardActions>
                <Button size="small">Reset</Button>
                <Button size="small" onClick={startDownload}>Download</Button>

            </CardActions>
        </Card>
        <ListSubheader sx={{ my: 1 }}>Train</ListSubheader>
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>URL</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {trainingList.map((url) => (
                        <TableRow
                            key={url}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell component="th" scope="row">
                                {url}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
        <Button variant="contained" endIcon={<PlayArrowIcon />} sx={{ my: 1 }} onClick={() => {
            browser.runtime.sendMessage(undefined, {
                type: "startCrawl"
            })
        }}>
            Start
        </Button>

        <br />
        <br />
        <br />
        <br />
    </Box>
}