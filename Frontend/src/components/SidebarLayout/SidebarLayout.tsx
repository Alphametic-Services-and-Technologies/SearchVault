import React from 'react';
import {
   AppBar,
   Avatar,
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
   Menu,
   MenuItem,
   Toolbar,
   Typography,
   useTheme,
} from '@mui/material';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import HomeIcon from '@mui/icons-material/Home';
import InfoIcon from '@mui/icons-material/Info';
import { useAppDispatch, useAppSelector } from '../../hooks/redux/redux';
import { logout } from '../../slices/auth.slice';

const drawerWidth = 240;

const PROJECT_NAME = 'SearchVault';

const navItems = [
   { text: 'Home', icon: <HomeIcon />, path: '/app' },
   { text: 'Chat', icon: <InfoIcon />, path: '/app/chat' },
];

function SidebarLayout() {
   const [mobileOpen, setMobileOpen] = React.useState(false);
   const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
   const theme = useTheme();

   const location = useLocation();
   const navigate = useNavigate();
   const dispatch = useAppDispatch();
   const { user } = useAppSelector(state => state.auth);

   const handleAvatarClick = (event: React.MouseEvent<HTMLElement>) => {
      setAnchorEl(event.currentTarget)
   }

   const handleMenuClose = () => {
      setAnchorEl(null);
   }

   const handleLogout = () => {
      dispatch(logout())
      navigate('/')
      handleMenuClose()
   }

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
               <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body2" color="inherit" sx={{ display: { xs: 'none', sm: 'block' } }}>
                     {user?.username}
                  </Typography>
                  <IconButton
                     onClick={handleAvatarClick}
                     sx={{ p: 0 }}
                  >
                     <Avatar
                        sx={{
                           bgcolor: 'white',
                           color: theme.palette.primary.main,
                           width: 32,
                           height: 32
                        }}
                     >
                        {user?.username?.charAt(0).toUpperCase() || 'U'}
                     </Avatar>
                  </IconButton>
               </Box>
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

         <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            anchorOrigin={{
               vertical: 'bottom',
               horizontal: 'right'
            }}
            transformOrigin={{
               vertical: 'top',
               horizontal: 'left'
            }}
         >
            <MenuItem onClick={() => { handleMenuClose(); }}>
               <ListItemIcon>
                  <PersonIcon fontSize="small" />
               </ListItemIcon>
               Profile
            </MenuItem>
            <MenuItem onClick={handleLogout}>
               <ListItemIcon>
                  <LogoutIcon fontSize="small" />
               </ListItemIcon>
               Logout
            </MenuItem>
         </Menu>

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