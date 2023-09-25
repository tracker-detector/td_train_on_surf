import { Box, Button, Card, CardActions, CardContent, ListSubheader, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material"
import useStore from "../store/store"
import * as tf from "@tensorflow/tfjs";
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import browser from "webextension-polyfill";

export const Train = () => {
    const seenRequests = useStore((state) => state.seenRequests);
    const trainingRuns = useStore((state) => state.trainingRuns);
    const latestLoss = useStore((state) => state.latestLoss);
    const trainingList = useStore((state) => state.trainingList);
    const startDownload = async () => {
        const model = await tf.loadLayersModel("indexeddb://td");
        model.summary();

        const zip = new JSZip();

        await model.save(tf.io.withSaveHandler(async (artifacts) => {
            let buffers: ArrayBuffer[];

            // Check if weightData is an array or a single ArrayBuffer
            if (Array.isArray(artifacts.weightData)) {
                buffers = artifacts.weightData;
            } else {
                buffers = [artifacts.weightData as ArrayBuffer];
            }

            // Loop through each ArrayBuffer and save it as a shard
            buffers.forEach((buffer, idx) => {
                const shardFileName = `group1-shard${idx + 1}of${buffers.length}.bin`;
                zip.file(shardFileName, buffer);
            });

            // Add model JSON to zip
            zip.file("model.json", JSON.stringify(artifacts));

            return { modelArtifactsInfo: { dateSaved: new Date(), modelTopologyType: 'JSON' } };
        }));

        // Generate the zip file and trigger the download
        zip.generateAsync({ type: "blob" }).then(content => {
            saveAs(content, "model.zip");
        });
    }
    return <Box sx={{ px: 2, overflow: "scroll" }}>
        <ListSubheader sx={{ mb: 1 }}>Model</ListSubheader>
        <Card>
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