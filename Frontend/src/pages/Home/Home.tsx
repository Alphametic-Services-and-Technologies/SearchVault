import { useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';

import Logo from '../../assets/logo1.png';

function Home() {
   const theme = useTheme();
   const navigate = useNavigate();
   return (
      <Box
         width={'100%'}
         height={'100%'}
         display={'flex'}
         flexDirection={'column'}
         alignItems={'center'}
      >
         <Box>
            <img src={Logo} alt="Search Vault" title="Search Vault" />
         </Box>
         <Box width={'100%'} display={'flex'} justifyContent={'center'} gap={20}>
            <Box
               width={450}
               height={300}
               bgcolor={theme.palette.primary.main}
               color={'#FFF'}
               borderRadius={2}
               display={'flex'}
               justifyContent={'center'}
               alignItems={'center'}
               fontSize={42}
               sx={{
                  cursor: 'pointer',
                  '&:hover': {
                     bgcolor: theme.palette.primary.light, // darker shade on hover
                     transform: 'scale(1.05)', // slight zoom effect
                  },
               }}
               onClick={() => navigate('/app/chat')}
            >
               Go To Chat
            </Box>
            <Box
               width={450}
               height={300}
               bgcolor={theme.palette.primary.main}
               color={'#FFF'}
               borderRadius={2}
               display={'flex'}
               justifyContent={'center'}
               alignItems={'center'}
               fontSize={42}
               sx={{
                  cursor: 'pointer',
                  '&:hover': {
                     bgcolor: theme.palette.primary.light, // darker shade on hover
                     transform: 'scale(1.05)', // slight zoom effect
                  },
               }}
               onClick={() => navigate('/app/docs')}
            >
               Manage Documents
            </Box>
         </Box>
      </Box>
   );
}

export default Home;
