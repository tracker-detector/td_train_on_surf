import { IconButton, InputBase, Paper, SxProps, Theme } from "@mui/material"
import SearchIcon from '@mui/icons-material/Search';
type Props = {
    sx: SxProps<Theme> | undefined,
    searchPlaceholder: string,
    onChange: (value: string) => void
}

export const Search = ({ sx, onChange, searchPlaceholder }: Props) => {
    return <Paper
        sx={{...sx, display: 'flex', alignItems: 'center'}}
    >
        <InputBase
            sx={{ ml: 1, flex: 1 }}
            placeholder={searchPlaceholder}
            onChange={(e) => {
                onChange(e.target.value)
            }}
        />
        <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
            <SearchIcon />
        </IconButton>
    </Paper>
}