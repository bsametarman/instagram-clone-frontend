import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {
  Box,
  Flex,
} from '@chakra-ui/react';
import HomePage from './pages/HomePage';
import Navbar from './components/common/Navbar';
import SigninPage from './pages/SignInPage';
import SignupPage from './pages/SignupPage';
import FeedPage from './pages/FeedPage';
import './App.css'

function App() {
  return (
    <Router>
      <Flex direction="column" minH="100vh">
        <Navbar />
        <Box as="main" flex="1" display="flex" flexDirection="column">
          <main>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<SigninPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/feed" element={<FeedPage />} />
            </Routes>
          </main>
        </Box>
      </Flex>
    </Router>
  )
}

export default App
