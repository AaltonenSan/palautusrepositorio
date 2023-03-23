import { useState, useEffect, useRef } from 'react'
import jwt_decode from 'jwt-decode'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import blogService from './services/blogs'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [errorMessage, setErrorMessage] = useState(null)
  const [message, setMessage] = useState(null)
  const [user, setUser] = useState(null)

  const loginFormRef = useRef()
  const blogFormRef = useRef()

  useEffect(() => {
    (async () => {
      try {
        const blogs = await blogService.getAll()
        setBlogs(blogs)
      } catch (exception) {
        setErrorMessage(exception.response.data.error)
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
      }
    })()
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      const decodedToken = jwt_decode(user.token)

      if (decodedToken.exp * 1000 < Date.now()) {
        window.localStorage.removeItem('loggedUser')
      } else {
        setUser(user)
        blogService.setToken(user.token)
      }
    }
  }, [])

  const createBlog = async (newBlog) => {
    try {
      blogFormRef.current.toggleVisibility()

      // Temporarily set user from localStorage to blog to display it after submit
      let addedBlog = await blogService.create(newBlog)
      const loggedUserJSON = window.localStorage.getItem('loggedUser')
      const user = JSON.parse(loggedUserJSON)
      addedBlog.user = user
      setBlogs(blogs.concat(addedBlog))

      setMessage(`A new blog ${newBlog.title} by ${newBlog.author} added`)
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    } catch (exception) {
      setErrorMessage(exception.response.data.error)
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const updateBlog = async (id, blog) => {
    try {
      let updatedBlog = await blogService.update(id, blog)
      updatedBlog.user = blog.user
      setBlogs(blogs.map(b => b.id === updatedBlog.id ? updatedBlog : b))
    } catch (exception) {
      setErrorMessage(exception.response.data.error)
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const removeBlog = async (blog) => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`))
      try {
        console.log('deleting', blog.id)
        await blogService.remove(blog.id)
        setBlogs(blogs.filter(b => b.id !== blog.id))
      } catch (exception) {
        setErrorMessage(exception.response.data.error)
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
      }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedUser')
    blogService.setToken(null)
    setUser(null)
    setMessage('You have been logged out')
    setTimeout(() => {
      setMessage(null)
    }, 5000)
  }

  return (
    <div>
      <h2>Blogs</h2>
      <Notification message={message} error={errorMessage} />
      {!user ? (
        <Togglable buttonLabel="Login" ref={loginFormRef}>
          <LoginForm
            setUser={setUser}
            setErrorMessage={setErrorMessage}
          />
        </Togglable>
      ) : (
        <div>
          <button onClick={handleLogout}>Logout</button>
          <p>{user.name} logged in</p>
          <Togglable buttonLabel="Add blog" ref={blogFormRef}>
            <BlogForm
              createBlog={createBlog}
            />
          </Togglable>
        </div>
      )}
      {blogs.sort((a, b) => b.likes - a.likes).map(blog => (
        <Blog
          key={blog.id}
          blog={blog}
          updateBlog={updateBlog}
          removeBlog={removeBlog}
        />
      ))}
    </div>
  )
}

export default App