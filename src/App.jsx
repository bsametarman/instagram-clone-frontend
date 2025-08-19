import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {
  Box,
  Flex,
} from '@chakra-ui/react';
import HomePage from './pages/HomePage';
import Navbar from './components/common/Navbar';
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
            </Routes>
          </main>
        </Box>
      </Flex>
    </Router>
  )
}

export default App
