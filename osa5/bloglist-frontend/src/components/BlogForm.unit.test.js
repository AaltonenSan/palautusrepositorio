import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import BlogForm from './BlogForm'
import userEvent from '@testing-library/user-event'

describe('<BlogForm />', () => {
  test('calls createForm onSubmit', async () => {
    const user = userEvent.setup()
    const mockHandler = jest.fn()

    render(<BlogForm createBlog={mockHandler} />)

    const titleInput = screen.getByRole('textbox', { name: 'title' })
    const authorInput = screen.getByRole('textbox', { name: 'author' })
    const urlInput = screen.getByRole('textbox', { name: 'url' })

    const button = screen.getByText('Create')

    await user.type(titleInput, 'I am testing a form')
    await user.type(authorInput, 'Full Stacker')
    await user.type(urlInput, 'https://myblog.io/testing')
    await user.click(button)

    expect(mockHandler.mock.calls).toHaveLength(1)
    expect(mockHandler).toHaveBeenCalledWith({
      title: 'I am testing a form',
      author: 'Full Stacker',
      url: 'https://myblog.io/testing'
    })
  })
})