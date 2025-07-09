import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SidebarLayout from './components/SidebarLayout/SidebarLayout';
import Home from './pages/Home/Home';
import Chat from './pages/Chat/Chat';
import Login from './pages/Login/login';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import NoAuthorizedRoute from './components/NoAuthorizedRoute/NoAuthorizedRoute';
import { ThemeProvider } from '@mui/material/styles';
import theme from './Theme/theme';

function App() {
   return (
      <ThemeProvider theme={theme}>
         <Router>
            <Routes>
               <Route path="/" element={
                  <NoAuthorizedRoute>
                     <Login />
                  </NoAuthorizedRoute>
               } />
               <Route path="/login" element={
                  <NoAuthorizedRoute>
                     <Login />
                  </NoAuthorizedRoute>
               } />

               <Route path="/app" element={
                  <ProtectedRoute>
                     <SidebarLayout />
                  </ProtectedRoute>
               }>
                  <Route index element={<Home />} />
                  <Route path="chat" element={<Chat />} />
               </Route>
            </Routes>
         </Router>
      </ThemeProvider>
   );
}

export default App;