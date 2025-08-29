import { Box, Paper, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import LoginForm from "./components/LoginForm";


function Login() {
   const navigate = useNavigate()

   const handleLoginSuccess = () => {
      navigate('/app');
   }  

   return (
      <Box
         display="flex"
         justifyContent="center"
         alignItems="center"
         sx={{
            minHeight: '100vh',
            width: '100vw',
            bgcolor: 'primary.main',
            padding: 2,
            overflow: 'hidden',
            position: 'fixed',
            top: 0,
            left: 0,
         }}
      >
         <Paper
            elevation={8}
            sx={{
               width: '100%',
               maxWidth: 400,
               padding: { xs: 2, sm: 4 },
               borderRadius: 3,
               margin: 2
            }}
         >
            <Box textAlign="center" mb={3}>
               <Box
                  sx={{
                     width: 120,
                     height: 120,
                     borderRadius: '50%',
                     backgroundColor: 'white',
                     border: '3px solid #f0f0f0',
                     display: 'flex',
                     alignItems: 'center',
                     justifyContent: 'center',
                     mx: 'auto',
                     mb: 3,
                     boxShadow: 2,
                  }}
               >
                  <Box
                     component="img"
                     src="/src/assets/logo1.png"
                     alt="SearchVault Logo"
                     sx={{
                        height: 90,
                        width: 90,
                        objectFit: 'contain'
                     }}
                  />
               </Box>

               <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
                  Welcome
               </Typography>
               <Typography variant="body1" color="text.secondary">
                  Please sign in to SearchVault
               </Typography>
            </Box>

            <LoginForm onSuccess={handleLoginSuccess} />
         </Paper>
      </Box>
   )
}

export default Login;