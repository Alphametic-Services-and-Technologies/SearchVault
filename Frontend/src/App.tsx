import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SidebarLayout from './components/SidebarLayout/SidebarLayout';
import Home from './pages/Home/Home';
import AboutUs from './pages/AboutUs/AboutUs';
import Posts from './pages/Posts/Posts';
import Chat from './pages/Chat/Chat';

function App() {
   return (
      <Router>
         <Routes>
            <Route path="/" element={<SidebarLayout />}>
               <Route index element={<Home />} />
               <Route path="about" element={<AboutUs />} />
               <Route path="posts" element={<Posts />} />
               <Route path="chat" element={<Chat />} />
            </Route>
         </Routes>
      </Router>
   );
}

export default App;
