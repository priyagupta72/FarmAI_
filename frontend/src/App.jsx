

import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

import Home from './pages/Home';
import UploadDetection from './pages/UploadPage';
import DiseaseInfo from './pages/DiseaseInfo';
import Forum from './pages/Forum';
import CropPage from './pages/CropPage';
import FertilizerPage from './pages/FertilizerPage';
import CropResult from './pages/CropResult';
import FertilizerResult from './pages/FertilizerResult';
// import Start from './pages/Start'; // Uncomment if you want Start page

import Navbar from './components/Navbar';
import Footer from './components/Footer';

import './App.css';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import HomeBeforeLogIn from './pages/HomeBeforeLogIn';

const Layout = ({ children }) => {
  const location = useLocation();

  // Hide Navbar/Footer only for Start page (if you use it)
  const hideNavbarFooter = location.pathname === "/start";

  return (
    <div className="bg-gray-100 font-roboto min-h-screen">
      {!hideNavbarFooter && <Navbar />}
      {children}
      {!hideNavbarFooter && <Footer />}
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          {/* Default route opens Home */}
          <Route path="/home" element={<Home />} />

          {/* Optional Start page */}
          {/* <Route path="/start" element={<Start />} /> */}

          <Route path="/upload" element={<UploadDetection />} />
          <Route path="/diseases" element={<DiseaseInfo />} />
          <Route path="/forum" element={<Forum />} />
          <Route path="/crop" element={<CropPage />} />
          <Route path="/fertilizer" element={<FertilizerPage />} />
          <Route path="/crop-result" element={<CropResult />} />
          <Route path="/fertilizer-result" element={<FertilizerResult />} />
          <Route path="/login" element={<SignIn/>} />
          <Route path="/register" element={<SignUp />} />
          <Route path="/" element={<HomeBeforeLogIn />} />

        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
