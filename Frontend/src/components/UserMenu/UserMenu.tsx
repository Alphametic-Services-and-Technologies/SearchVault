import React from 'react';
import {
   Avatar,
   Box,
   IconButton,
   Menu,
   MenuItem,
   Typography,
   ListItemIcon,
   useTheme,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import { useAppDispatch, useAppSelector } from '../../hooks/redux/redux';
import { logout } from '../../slices/auth.slice';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

interface UserMenuProps {
   className?: string;
}

function UserMenu({ className }: UserMenuProps) {
   const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
   const theme = useTheme();
   const navigate = useNavigate();
   const dispatch = useAppDispatch();
   const { tenantId } = useAppSelector((state) => state.auth);

   const handleAvatarClick = (event: React.MouseEvent<HTMLElement>) => {
      setAnchorEl(event.currentTarget);
   };

   const handleMenuClose = () => {
      setAnchorEl(null);
   };

   const handleLogout = () => {
      dispatch(logout());
      navigate('/');
      handleMenuClose();
   };

   const handleProfile = () => {
      handleMenuClose();
   };

   return (
      <Box className={className} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
         {/* <Typography variant="body2" color="inherit" sx={{ display: { xs: 'none', sm: 'block' } }}>
            {tenantId}
         </Typography> */}
         <IconButton onClick={handleAvatarClick} sx={{ p: 0 }}>
            <Avatar
               sx={{
                  bgcolor: 'white',
                  color: theme.palette.primary.main,
                  width: 32,
                  height: 32,
               }}
            >
               {/* {tenantId?.charAt(0).toUpperCase() || 'T'} */}
               <AccountCircleIcon />
            </Avatar>
         </IconButton>

         <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            anchorOrigin={{
               vertical: 'bottom',
               horizontal: 'right',
            }}
            transformOrigin={{
               vertical: 'top',
               horizontal: 'left',
            }}
         >
            <MenuItem onClick={handleProfile}>
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
      </Box>
   );
}

export default UserMenu;
