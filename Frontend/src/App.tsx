import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SidebarLayout from './components/SidebarLayout/SidebarLayout';
import Home from './pages/Home/Home';
import Chat from './pages/Chat/Chat';
import Docs from './pages/Docs/Docs';
import Login from './pages/Login/login';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import NoAuthRoute from './components/NoAuthRoute/NoAuthRoute';
import { ThemeProvider } from '@mui/material/styles';
import theme from './Theme/theme';

function App() {
   return (
      <ThemeProvider theme={theme}>
         <Router>
            <Routes>
               <Route path="/" element={
                  <NoAuthRoute>
                     <Login />
                  </NoAuthRoute>
               } />
               <Route path="/login" element={
                  <NoAuthRoute>
                     <Login />
                  </NoAuthRoute>
               } />

               <Route path="/app" element={
                  <ProtectedRoute>
                     <SidebarLayout />
                  </ProtectedRoute>
               }>
                  <Route index element={<Home />} />
                  <Route path="chat" element={<Chat />} />
                  <Route path="docs" element={<Docs />} />
               </Route>
            </Routes>
         </Router>
      </ThemeProvider>
   );
}

export default App;