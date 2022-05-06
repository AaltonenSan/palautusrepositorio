const App = () => {
  const course = {
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10
      },
      {
        name: 'Using props to pass data',
        exercises: 7
      },
      {
        name: 'State of a component',
        exercises: 14
      }
    ]
  }

  return (
    <>
      <Header course={course.name} />
      <Content parts={course.parts} />
      <Total parts={course.parts} />
    </>
  )
}
const Header = (prop) => {
  return (
    <div>
      <h1>{prop.course}</h1>
    </div>
  )
}
const Part = (part) => {
  return (
    <div>
      <p>{part.p.name} {part.p.exercises}</p>
    </div>
  )
}
const Content = (course) => {
  console.log(course.parts)
  return (
    <div>
      <Part p={course.parts[0]} />
      <Part p={course.parts[1]} />
      <Part p={course.parts[2]} />
    </div>
  )
}
const Total = (course) => {
  let sum = 0
  for (let i = 0; i < course.parts.length; i++) {
    sum += course.parts[i].exercises
  }
  return (
    <div>
      <p>Number of exercises {sum}</p>
    </div>
  )
}

export default App
