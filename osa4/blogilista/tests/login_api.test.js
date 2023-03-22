const bcrypt = require('bcrypt')
const User = require('../models/user')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

describe('when there is initially one user at db and user tries to login', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })
  test('login fails with status code 401 if password or username wrong', async () => {
    const user = {
      username: 'aaltonensan',
      password: 'väärä',
    }

    await api
      .post('/api/login')
      .send(user)
      .expect(401)
      .expect('Content-Type', /application\/json/)
  })

  test('login succeeds with status code 200 if valid credentials and returns token and username', async () => {
    const user = {
      username: 'root',
      password: 'sekret'
    }
    const response = await api
      .post('/api/login')
      .send(user)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(response.body.username).toEqual('root')
    expect(response.body.token).toBeDefined()
  })
})