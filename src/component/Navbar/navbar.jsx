import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

export default function Navbar() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
            <img height={50} width={50} src="./logo.png" alt="logo" />
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 , ml: 2}}>
                PhotoFolio
            </Typography>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
