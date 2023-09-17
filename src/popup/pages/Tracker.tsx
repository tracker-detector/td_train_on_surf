import { Box, List, ListSubheader, ListItem, ListItemText, Link, Typography, Divider, Stack } from "@mui/material"
import React from "react"
import useStore from "../store/store"

export const Tracker = () => {
    const requests = useStore(state => state.requests)
    const trackersRep = requests
        .filter((req) => req.tplLabel)
        .map((x) => {
            const { hostname } = new URL(x.url);
            return {
                url: hostname,
                predict: x.predictValue,
            };
        });
    const trackerHosts = trackersRep
        .map((x) => x.url)
        .filter((value, index, array) => array.indexOf(value) === index);
    const stats = trackerHosts.map((req) => {
        const numberOfRequestToHost = trackersRep.filter(
            (trReq) => trReq.url == req
        ).length;
        const averagePredict =
            trackersRep
                .filter((trReq) => trReq.url == req)
                .map((trReq) => trReq.predict)
                .reduce((pv, cv) => pv + cv, 0) / numberOfRequestToHost;
        return {
            url: req,
            amountOfRequests: numberOfRequestToHost,
            avgPredict: averagePredict,
        };
    })
    if (stats.length == 0) {
        return <Box sx={{ height: '100%', px: 2, }}>
            <ListSubheader>Trackers</ListSubheader>
            <Stack justifyContent="space-around" alignItems="center" direction="column">
                <Typography variant="subtitle2" sx={{position: "absolute", top: '50%', left:'50%', transform: 'translate(-50%, -50%)'}}>
                    No tracker found.
                </Typography>
            </Stack>
        </Box>
    }
    return <Box sx={{ px: 2, overflow: "scroll" }}>
        <List subheader={<ListSubheader>Trackers</ListSubheader>}>
            {stats.map((value) => (
                <>
                    <ListItem
                        key={value.url}
                    >
                        <ListItemText
                            primary={<Link href={value.url} className="url-title">{value.url}</Link>}
                            secondary={
                                <React.Fragment>
                                    <Typography
                                        sx={{ display: 'inline' }}
                                        component="span"
                                        variant="body2"
                                        color="text.primary"
                                    >
                                        Tpl-Label: true <br />
                                        Predict: {value.avgPredict.toFixed(4)}


                                    </Typography>
                                </React.Fragment>
                            }
                        />
                    </ListItem>
                    <Divider />
                </>
            ))}
            <br />
            <br />

        </List>

    </Box>
}