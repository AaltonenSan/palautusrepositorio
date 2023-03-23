import { useState } from 'react'
import PropTypes from 'prop-types'

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()

    createBlog({
      title: title,
      author: author,
      url: url
    })

    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <div>
      <h2>Create new blog</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor='title'>Title: </label>
          <input
            type='text'
            name='title'
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          <label htmlFor='author'>Author: </label>
          <input
            type='text'
            name='author'
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          <label htmlFor='url'>Url: </label>
          <input
            type='text'
            name='url'
            value={url}
            onChange={({ target }) => setUrl(target.value)}
          />
        </div>
        <button type='submit'>Create</button>
      </form>
    </div>
  )
}

BlogForm.propTypes = {
  createBlog: PropTypes.func
}

export default BlogForm