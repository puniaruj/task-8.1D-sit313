// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import FindQuestionPage from './components/FindQuestionPage';
import PostPage from './components/PostPage';
import Navigation from './components/Navigation';
import HomePage  from './components/HomePage';

const App = () => {
  return (
    <Router>
     
      <Navigation />
      <Routes>
        <Route path='/' element={<HomePage/>}/>
        <Route path="/find-question" element={<FindQuestionPage />} />
        <Route path="/new-post" element={<PostPage />} />
       
      </Routes>
    </Router>
  );
};

export default App;