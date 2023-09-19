import { Box, Button, Card, CardActions, CardContent, ListSubheader, Typography } from "@mui/material"
import useStore from "../store/store"
import * as tf from "@tensorflow/tfjs";
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

export const Train = () => {
    const seenRequests = useStore((state) => state.seenRequests);
    const trainingRuns = useStore((state) => state.trainingRuns);
    const latestLoss = useStore((state) => state.latestLoss);

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

            return {modelArtifactsInfo: {dateSaved: new Date(), modelTopologyType: 'JSON'}};
        }));

        // Generate the zip file and trigger the download
        zip.generateAsync({type:"blob"}).then(content => {
            saveAs(content, "model.zip");
        });
    }
    return <Box sx={{ px: 2 }}>
        <ListSubheader sx={{ mb: 1 }}>Train</ListSubheader>
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
    </Box>
}