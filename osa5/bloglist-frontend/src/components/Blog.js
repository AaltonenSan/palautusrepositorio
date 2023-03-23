import { useState } from 'react'
import PropsTypes from 'prop-types'

const Blog = ({ blog, updateBlog, removeBlog }) => {
  const [showFull, setShowFull] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const RemoveButton = () => {
    const loggedUserJSON = window.localStorage.getItem('loggedUser')
    const user = JSON.parse(loggedUserJSON)
    if (loggedUserJSON && blog.user.username === user.username) {
      return (
        <button onClick={() => removeBlog(blog)}>Remove</button>
      )
    }
  }

  const addLike = () => {
    const updatedBlog = {
      user: blog.user,
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes + 1
    }
    updateBlog(blog.id, updatedBlog)
  }

  if (!showFull) {
    return (
      <div style={blogStyle}>
        {blog.title} <button onClick={() => setShowFull(true)}>view</button>
      </div>
    )
  }

  return (
    <div style={blogStyle}>
      {blog.title} {blog.author} <button onClick={() => setShowFull(false)}>hide</button><br />
      {blog.url}<br />
      likes {blog.likes} <button onClick={addLike} >like</button><br />
      {blog.user.name}<br />
      <RemoveButton />
    </div>
  )
}

Blog.propTypes = {
  blog: PropsTypes.object.isRequired,
  updateBlog: PropsTypes.func,
  removeBlog: PropsTypes.func
}

export default Blog