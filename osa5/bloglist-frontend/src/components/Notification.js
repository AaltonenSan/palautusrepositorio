import PropTypes from 'prop-types'

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

Notification.propTypes = {
  message: PropTypes.string,
  error: PropTypes.string
}

export default Notification