import { Box, Divider, Link, List, ListItem, ListItemText, ListSubheader, Typography } from "@mui/material"
import useStore from "../store/store"
import React from "react"

export const Requests = () => {
    const requests = useStore(state => state.requests)
    if (requests.length == 0) {
        return <Box sx={{ height: '100%', px: 2, }}>
            <ListSubheader>Requests</ListSubheader>
            <Typography variant="subtitle2" sx={{ position: "absolute", top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                No requests found.
            </Typography>
        </Box>
    }
    return <Box sx={{ px: 2, overflow: "scroll" }}>
        <List subheader={<ListSubheader>Requests</ListSubheader>}>
            {requests.sort((a, b) => b.predictValue - a.predictValue).map((value) => (
                <>
                    <ListItem
                        key={value.requestId}
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
                                        Initiator: {value.initiator} <br />
                                        Method: {value.method} <br />
                                        Tpl-Label: {JSON.stringify(value.tplLabel)} <br />
                                        Predict: {value.predictValue.toFixed(4)}


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