import React from 'react';
import {
   AppBar,
   Box,
   CssBaseline,
   Divider,
   Drawer,
   IconButton,
   List,
   ListItem,
   ListItemButton,
   ListItemIcon,
   ListItemText,
   Toolbar,
   Typography,
   useTheme,
} from '@mui/material';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import InfoIcon from '@mui/icons-material/Info';

const drawerWidth = 240;

const PROJECT_NAME = 'Template project';

const navItems = [
   { text: 'Home', icon: <HomeIcon />, path: '/' },
   // { text: 'About', icon: <InfoIcon />, path: '/about' },
   // { text: 'Posts', icon: <InfoIcon />, path: '/posts' },
   { text: 'Chat', icon: <InfoIcon />, path: '/chat' },
];

function SidebarLayout() {
   const [mobileOpen, setMobileOpen] = React.useState(false);
   const theme = useTheme();

   const location = useLocation();
   const navigate = useNavigate();

   const handleDrawerToggle = () => {
      setMobileOpen(!mobileOpen);
   };

   const drawer = (
      <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
         <Box my={7.2} />

         <Divider />

         <List>
            {navItems.map(({ text, icon, path }) => {
               const isActive = location.pathname === path;

               return (
                  <ListItem key={text} disablePadding>
                     <ListItemButton
                        onClick={() => navigate(path)}
                        sx={{
                           textAlign: 'left',
                           backgroundColor: isActive
                              ? theme.palette.action.selected
                              : 'transparent',
                        }}
                     >
                        <ListItemIcon>{icon}</ListItemIcon>
                        <ListItemText primary={text} />
                     </ListItemButton>
                  </ListItem>
               );
            })}
         </List>
      </Box>
   );

   return (
      <Box sx={{ display: 'flex' }}>
         <CssBaseline />
         <AppBar component="nav" position="fixed" sx={{ zIndex: theme.zIndex.drawer + 1 }}>
            <Toolbar>
               <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  edge="start"
                  onClick={handleDrawerToggle}
                  sx={{ mr: 2, display: { sm: 'none' } }}
               >
                  <MenuIcon />
               </IconButton>
               <Typography variant="h6" noWrap component="div">
                  {PROJECT_NAME}
               </Typography>
            </Toolbar>
         </AppBar>

         {/* Drawer for desktop */}
         <Drawer
            variant="permanent"
            sx={{
               display: { xs: 'none', sm: 'block' },
               width: drawerWidth,
               flexShrink: 0,
               [`& .MuiDrawer-paper`]: {
                  width: drawerWidth,
                  boxSizing: 'border-box',
               },
            }}
            open
         >
            {drawer}
         </Drawer>

         {/* Drawer for mobile */}
         <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{ keepMounted: true }}
            sx={{
               display: { xs: 'block', sm: 'none' },
               [`& .MuiDrawer-paper`]: {
                  width: drawerWidth,
                  boxSizing: 'border-box',
               },
            }}
         >
            {drawer}
         </Drawer>

         <Box
            component="main"
            sx={{
               flexGrow: 1,
               p: 3,
               width: { sm: `calc(100% - ${drawerWidth}px)` },
               mt: 8,
            }}
         >
            <Outlet />
         </Box>
      </Box>
   );
}

export default SidebarLayout;
