import { useEffect, useState } from 'react';
import './App.css';

import {BrowserRouter, Routes, Route } from "react-router-dom";

import Home from './pages/Home';
import Article from './pages/Article';
import ArticleEdit from './pages/ArticleEdit';
import NewArticle from './pages/NewArticle';

import Header from './components/Header';
import Login from './components/Login';

import { getCurrentUser } from './services/auth-services';


const sections = [
  { title: 'Javascript', url: '/category/javascript' },
  { title: 'React', url: '/category/react' },
  { title: 'Node', url: '/category/node' },
  { title: 'Express', url: '/category/express' },
  { title: 'MongoDB', url: '/category/mongodb' },
  
]

function App() {
  const path = window.location.pathname
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const user = getCurrentUser()
    if (user?.accessToken){
      setIsLoggedIn(true);
    }

  },[])

  return (
    <BrowserRouter>
      { path !== '/login' &&  <Header title="Swiss Cheese's Notes" sections={sections} />}
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/articles/:id" element={<Article/>} />
        <Route path="/articles/:id/edit" element={<ArticleEdit/>} />
        <Route path="/new-article" element={<NewArticle/>} />
        { !isLoggedIn && <Route path="/login" element={<Login/>} />}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
