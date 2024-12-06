import React from 'react';
import Navbar from './components/Navbar';
import{ BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Home from './components/pages/Home';
import Content from './components/ContentSection';

function App() {
  return (
    <>
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
    <Content />
    </>
  );
}

export default App;
