import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('<Blog />', () => {
  test('renders only the title of the blog by default', () => {
    const blog = {
      title: 'I am testing React now',
      author: 'Full Stacker',
      url: 'https://myblog.io/testing',
      likes: 5,
      user: {
        name: 'Test User'
      }
    }

    render(<Blog blog={blog} />)

    const element = screen.getByText('I am testing React now')

    expect(element).toBeDefined()
    expect(element).not.toHaveTextContent('Full Stacker')
    expect(element).not.toHaveTextContent('https://myblog.io/testing')
    expect(element).not.toHaveTextContent('likes')
    expect(element).not.toHaveTextContent('Test User')
  })

  test('after clicking the view button renders author, url, likes and user', async () => {
    const blog = {
      title: 'I am testing React now',
      author: 'Full Stacker',
      url: 'https://myblog.io/testing',
      likes: 5,
      user: {
        name: 'Test User'
      }
    }

    render(<Blog blog={blog} />)

    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)

    const element = screen.getByText('I am testing React now', { exact: false })

    expect(element).toBeDefined()
    expect(element).toHaveTextContent('Full Stacker')
    expect(element).toHaveTextContent('https://myblog.io/testing')
    expect(element).toHaveTextContent('likes')
    expect(element).toHaveTextContent('Test User')
  })

  test('clicking the like button twice also calls the handler twice', async () => {
    const blog = {
      title: 'I am testing React now',
      author: 'Full Stacker',
      url: 'https://myblog.io/testing',
      likes: 5,
      user: {
        name: 'Test User'
      }
    }

    const mockHandler = jest.fn()
    render(<Blog blog={blog} updateBlog={mockHandler} />)

    const user = userEvent.setup()
    const viewButton = screen.getByText('view')
    await user.click(viewButton)

    const likeButton = screen.getByText('like')
    await user.click(likeButton)
    await user.click(likeButton)

    expect(mockHandler.mock.calls).toHaveLength(2)
  })
})