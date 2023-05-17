import { render, screen } from '@testing-library/react'
import Todo from "./Todo"

const testTodo = { text: "implement tests" }

describe('<Todo />', () => {
  test('Displays the todo text', () => {
    const deleteMock = jest.fn()
    const completeMock = jest.fn()

    render(<Todo todo={testTodo} deleteTodo={deleteMock} completeTodo={completeMock} />)

    const text = screen.getByText("implement tests")
    expect(text).toBeDefined()
  })
  test('Todo has incomplete status as default', () => {
    const deleteMock = jest.fn()
    const completeMock = jest.fn()

    render(<Todo todo={testTodo} deleteTodo={deleteMock} completeTodo={completeMock} />)

    const text = screen.getByText("This todo is not done")
    expect(text).toBeDefined()
  })
})