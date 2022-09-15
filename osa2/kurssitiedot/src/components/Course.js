const Course = ({ course }) => {
    return (
        <>
            <Header course={course.name} />
            <Content course={course} />
        </>
    )
}
const Header = ({ course }) => <h2>{course}</h2>
const Part = ({ name, exercises }) => <p>{name} {exercises}</p>
const Content = ({ course }) => {
    return (
        <>
            {course.parts.map(part =>
                <Part key={part.id} name={part.name} exercises={part.exercises} />
            )}
            <Total parts={course.parts} />
        </>
    )
}
// Each course has an array of parts
const Total = ({ parts }) => {
    const total = parts.reduce((prev, curr) => prev + curr.exercises, 0)
    return (
        <p><b>Total of {total} exercises</b></p>
    )
  }
  
export default Course