import { useEffect, useState } from 'react';
import contactService from './services/contacts';

const Filter = (props) => {
  return (
    <div>
      filter shown with <input type="text" value={props.filter} onChange={props.onChange} />
    </div>
  )
};
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
};
const Persons = ({ persons, setPersons, setMessage }) => {
  const deleteContact = removePerson => {
    if (window.confirm(`Delete ${removePerson.name} ?`)) {
      contactService
        .deleteContact(removePerson.id)
        .then(() => {
          setPersons(persons.filter(person => person.name !== removePerson.name))
          setMessage(`Deleted ${removePerson.name}`)
          setTimeout(() => {
            setMessage(null)
          }, 5000)
        })
        .catch(error => {
          console.log(error)
        })
    }
  };
  return (
    <div>
      {persons.map(person =>
        <div key={person.name} style={{ display: 'flex', alignItems: 'center' }}>
          <p>{person.name} {person.number}</p>
          <button onClick={() => deleteContact(person)}>delete</button>
        </div>
      )}
    </div>
  )
};

const Notification = ({ message, error }) => {
  const notificationStyle = {
    color: message ? 'green' : 'red',
    background: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10
  }

  if (message === null && error === null) {
    return null
  }
  return (
    <div style={notificationStyle}>
      {message || error}
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [filter, setFilter] = useState('')
  const [newPerson, setNewPerson] = useState({ name: '', number: '' })
  const [message, setMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    contactService
      .getAll()
      .then(initialContacts => {
        setPersons(initialContacts)
      })
      .catch(error => {
        console.log(error)
        setErrorMessage("Can't get contacts from server")
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
      })
  }, []);

  const handleChangePerson = e => {
    setNewPerson({ ...newPerson, [e.target.name]: e.target.value })
  };

  const filterPhonebook = phonebook => {
    return phonebook.filter(person =>
      person.name.toLowerCase().includes(filter.toLowerCase())
    )
  };

  const updatePerson = () => {
    if (window.confirm(`${newPerson.name} is already added to phonebook, replace the old number with a new one?`)) {
      const person = persons.find(p => p.name === newPerson.name);
      const changedPerson = { ...person, number: newPerson.number };
      contactService
        .updateContact(person.id, changedPerson)
        .then(returnedPerson => {
          setPersons(persons.map(person => person.id !== returnedPerson.id ? person : returnedPerson))
          setMessage(`Updated ${newPerson.name}`)
          setTimeout(() => {
            setMessage(null)
          }, 5000)
        })
        .catch(error => {
          console.log(error)
          setErrorMessage(`Information of ${newPerson.name} has already been removed from server`)
          setTimeout(() => {
            setErrorMessage(null)
          }, 5000)
          setPersons(persons.filter(person => person.name !== newPerson.name))
        })
      setNewPerson({name: '', number: ''})
    }
  }

  const handleSubmit = e => {
    e.preventDefault()
    if (persons.some(person => person.name === newPerson.name)) {
      updatePerson();
      return;
    }
    contactService
      .createContact(newPerson)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))
        setMessage(`Added ${newPerson.name}`)
        setTimeout(() => {
          setMessage(null)
        }, 5000)
      })
      .catch(error => {
        console.log(error)
      })
    setNewPerson({name: '', number: ''})
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} error={errorMessage} />
      <Filter filter={filter} onChange={e => setFilter(e.target.value)} />
      <h3>add a new</h3>
      <PersonForm
        name={newPerson.name}
        number={newPerson.number}
        onChange={e => handleChangePerson(e)}
        handleSubmit={handleSubmit}
      />
      <h3>Numbers</h3>
      <Persons
        persons={filterPhonebook(persons)}
        setPersons={setPersons}
        setMessage={setMessage}
      />
    </div>
  )

}

export default App