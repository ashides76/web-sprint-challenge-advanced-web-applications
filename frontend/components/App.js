import React, { useState } from 'react'
import { NavLink, Routes, Route, useNavigate } from 'react-router-dom'
import Articles from './Articles'
import LoginForm from './LoginForm'
import Message from './Message'
import ArticleForm from './ArticleForm'
import Spinner from './Spinner'
import axios from 'axios'

const articlesUrl = 'http://localhost:9000/api/articles'
const loginUrl = 'http://localhost:9000/api/login'

export default function App() {
  // ✨ MVP can be achieved with these states
  const [message, setMessage] = useState('')
  const [articles, setArticles] = useState([])
  const [currentArticleId, setCurrentArticleId] = useState()
  const [spinnerOn, setSpinnerOn] = useState(false)

  // ✨ Research `useNavigate` in React Router v.6
  const navigate = useNavigate()
  const redirectToLogin = () => { /* ✨ implement */ }
  const redirectToArticles = () => { /* ✨ implement */ }
  
  const token = localStorage.getItem('token')


  const logout = () => {
    // ✨ implement
    // If a token is in local storage it should be removed,
    if (token) {
      localStorage.removeItem('token')
      setMessage("Goodbye!")
      navigate('/')
    }
    // and a message saying "Goodbye!" should be set in its proper state.
    // In any case, we should redirect the browser back to the login screen,
    // using the helper above.
  }

  const login = ({ username, password }) => {
    // ✨ implement
    // We should flush the message state, turn on the spinner
    setSpinnerOn(true)
    // and launch a request to the proper endpoint.
    const postLogin = {
      username: username,
      password: password
    }
    axios.post(loginUrl, postLogin)
      .then(res => {
        // On success, we should set the token to local storage in a 'token' key,
        localStorage.setItem('token', res.data.token)
        // put the server success message in its proper state, and redirect
        // to the Articles screen. Don't forget to turn off the spinner!
        setMessage(res.data.message)
        navigate('/articles')
        setSpinnerOn(false);
      })
      .catch(err => {
        setMessage(err.response.message)
        setSpinnerOn(false);
      })
  }

  const getArticles = () => {
    // ✨ implement
    // We should flush the message state, turn on the spinner
    setSpinnerOn(true)
    
    // and launch an authenticated request to the proper endpoint.
    // const token = localStorage.getItem('token')
    axios.get(articlesUrl, {headers: {Authorization: token}})
      .then(res => {
        // On success, we should set the articles in their proper state and
        // put the server success message in its proper state.
        setArticles(res.data.articles)
        setMessage(res.data.message)
        setSpinnerOn(false)
      })
      .catch(err => {
        // If something goes wrong, check the status of the response:
        setMessage(err?.response?.data?.message) 
        // if it's a 401 the token might have gone bad, and we should redirect to login.
        if(err?.response?.state === 401) logout()
        // Don't forget to turn off the spinner!
        setSpinnerOn(false)
      })
  }

  const postArticle = article => {
    // ✨ implement
    // The flow is very similar to the `getArticles` function.
    // You'll know what to do! Use log statements or breakpoints
    // to inspect the response from the server.
    setSpinnerOn(true)
    axios.post(articlesUrl, article, {headers: {Authorization: token}})
      .then(res => {
        console.log(res)
        setArticles(prevArry => [...prevArry, res.data.article])
        setMessage(res?.data?.message)
        setSpinnerOn(false)
      })
      .catch(err => {
        setMessage(err?.request?.response)
        setSpinnerOn(false)
      })
  }

  // const updateArticle = ({ article_id, article }) => {
  //   console.log('article_id:', article_id)
  //   console.log('article:', article)
  //   // ✨ implement
  //   // You got this!
  //   axios.put(`${articlesUrl}/${article_id}`, article, {headers: {Authorization: token}})
  //     .then(res => {
  //       console.log(res)
  //     })
  //     .catch(err => {
  //       console.error(err)
  //     })
  // }
    const updateArticle = ({ article_id, article }) => {
      console.log('Updating article:', article_id, article);
      axios.put(`${articlesUrl}/${article_id}`, article, { headers: { Authorization: token } })
        .then(res => {
          console.log('Update successful:', res);
          // Optionally, update state or display a message
        })
        .catch(err => {
          console.error('Update failed:', err);
          // Handle errors if necessary
        });
    }
  
  const deleteArticle = article_id => {
    // ✨ implement
    axios.delete(`${articlesUrl}/${article_id}`, {headers: {Authorization: token}})
    .then(res => {
      setArticles(articles.filter(article => article.article_id !== article_id))
      setMessage(res?.data?.message)
    })
    .catch(err => {
      console.message(err?.request?.response)
    })
  }

  return (
    // ✨ fix the JSX: `Spinner`, `Message`, `LoginForm`, `ArticleForm` and `Articles` expect props ❗
    <>
      <Spinner on={spinnerOn}/>
      <Message message={message}/>
      <button id="logout" onClick={logout}>Logout from app</button>
      <div id="wrapper" style={{ opacity: spinnerOn ? "0.25" : "1" }}> {/* <-- do not change this line */}
        <h1>Advanced Web Applications</h1>
        <nav>
          <NavLink id="loginScreen" to="/">Login</NavLink>
          <NavLink id="articlesScreen" to="/articles">Articles</NavLink>
        </nav>
        <Routes>
          <Route path="/" element={<LoginForm login={login}/>} />
          <Route path="articles" element={
            <>
              <ArticleForm postArticle={postArticle} currentArticle={currentArticleId} updateArticle={updateArticle}/>
              <Articles getArticles={getArticles} articles={articles} setCurrentArticleId={setCurrentArticleId} deleteArticle={deleteArticle}/>
            </>
          } />
        </Routes>
        <footer>Bloom Institute of Technology 2024</footer>
      </div>
    </>
  )
}
