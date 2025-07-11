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
import UserMenu from '../UserMenu/UserMenu';

const drawerWidth = 240;

const PROJECT_NAME = 'SearchVault';

const navItems = [
   { text: 'Home', icon: <HomeIcon />, path: '/app' },
   { text: 'Chat', icon: <InfoIcon />, path: '/app/chat' },
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
      <Box sx={{ textAlign: 'center' }}>
         <Box my={7.2} />

         <Divider />

         <List sx={{ flexGrow: 1 }}>
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
         <AppBar
            component="nav"
            position="fixed"
            sx={{
               zIndex: theme.zIndex.drawer + 1,
               backgroundColor: 'primary.main'
            }}
         >
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

               <Box display="flex" alignItems="center" sx={{ flexGrow: 1 }}>
                  <Box
                     sx={{
                        width: 50,
                        height: 50,
                        borderRadius: '50%',
                        backgroundColor: 'white',
                        border: '2px solid #f0f0f0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mr: 1.5,
                        boxShadow: 1
                     }}
                  >
                     <Box
                        component="img"
                        src="/src/assets/logo1.png"
                        alt="SearchVault Logo"
                        sx={{
                           height: 38,
                           width: 38,
                           objectFit: 'contain'
                        }}
                     />
                  </Box>
                  <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 600 }}>
                     {PROJECT_NAME}
                  </Typography>
               </Box>

               <UserMenu />
            </Toolbar>
         </AppBar>

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
               height: 'calc(100vh - 64px)',
               overflow: 'hidden',
            }}
         >
            <Outlet />
         </Box>
      </Box>
   );
}

export default SidebarLayout;