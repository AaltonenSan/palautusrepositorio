import { useState } from 'react'

const Filter = (props) => {
  return (
    <div>
      filter shown with <input type="text" value={props.filter} onChange={props.onChange} />
    </div>
  )
}
const PersonForm = (props) => {
  return (
    <form>
      <div>
        name: <input type="text" name="name" value={props.name} onChange={props.onChange} />
      </div>
      <div>
        number: <input type="text" name="number" value={props.number} onChange={props.onChange} />
      </div>
      <div>
        <button type="submit" onClick={props.handleSubmit}>add</button>
      </div>
    </form>
  )
}
const OnePerson = (props) => {
  return (
    <p>{props.name} {props.number}</p>
  )
}
const Persons = ({persons}) => {
  return (
    <div>
      {persons.map(person => <OnePerson key={person.name} name={person.name} number={person.number} />)}
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456' },
    { name: 'Ada Lovelace', number: '39-44-5323523' },
    { name: 'Dan Abramov', number: '12-43-234345' },
    { name: 'Mary Poppendieck', number: '39-23-6423122' }
  ]) 
  const [newPerson, setNewPerson] = useState(
    {
      name: '',
      number: ''
    }
  )
  const [filter, setFilter] = useState('')

  const handleChangePerson = (e) => {
    setNewPerson({ ...newPerson, [e.target.name]: e.target.value })
  }
  const handleChangeFilter = (e) => {
    setFilter(e.target.value)
  }

  const filterPhonebook = (phonebook) => {
    return phonebook.filter(
      person =>
        person.name.toLowerCase().includes(filter.toLowerCase())
    )
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (persons.some(person => person.name === newPerson.name)) {
      alert(`${newPerson.name} is already added to phonebook`)
      return;
    }
    setPersons(
      [...persons, { name: newPerson.name, number: newPerson.number }]
    )
    setNewPerson(
      {
        name: '',
        number: ''
      }
    )
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter filter={filter} onChange={(e) => handleChangeFilter(e)} />
      <h2>add a new</h2>
      <PersonForm name={newPerson.name} number={newPerson.number} onChange={(e) => handleChangePerson(e)} handleSubmit={handleSubmit} />
      <h2>Numbers</h2>
      <Persons persons={filterPhonebook(persons)} />
    </div>
  )

}

export default App