const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
// using agent to store authorization in header
const agent = supertest.agent(app)

describe('when there is initially some blogs saved', () => {
  beforeAll(async () => {
    const user = {
      username: 'root',
      password: 'sekret'
    }
    const response = await api.post('/api/login').send(user)
    agent.auth(response.body.token, { type: 'bearer' })
  })

  beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
  })

  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')

    expect(response.body).toHaveLength(helper.initialBlogs.length)
  })

  test('returned blogs have id field', async () => {
    const response = await api.get('/api/blogs')

    const blogs = response.body
    blogs.forEach(blog => expect(blog.id).toBeDefined())
  })

  describe('additiong of a new blog', () => {
    test('succeeds with valid data', async () => {
      const newBlog = {
        title: "Bloglist testing",
        author: "Full Stacker",
        url: "http://blog.fullstackopen.com/jesttest",
        likes: 1,
      }

      await agent
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()
      expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

      const titles = blogsAtEnd.map(b => b.title)
      expect(titles).toContain(
        'Bloglist testing'
      )
    })

    test('succeeds when the blog has no likes field', async () => {
      const newBlog = {
        title: "No one likes me",
        author: "Full Stacker",
        url: "http://blog.fullstackopen.com/jesttest",
      }

      const response = await agent
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()
      expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

      const addedBlog = blogsAtEnd.find(b => b.id === response.body.id)
      expect(addedBlog.likes).toBe(0)
      expect(addedBlog.title).toContain('No one likes me')
    })

    test("fails with status code 400 if title is missing", async () => {
      const newBlog = {
        author: "Full Stacker",
        url: "http://blog.whatismytitle.com/jesttest",
      }

      await agent
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)

      const blogsAtEnd = await helper.blogsInDb()
      expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
    })

    test("fails with status code 400 if url is missing", async () => {
      const newBlog = {
        title: "I have no url",
        author: "Full Stacker",
      }

      await agent
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)

      const blogsAtEnd = await helper.blogsInDb()
      expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
    })

    test('fails with status code 401 if jwt invalid or not provided', async () => {
      const newBlog = {
        title: "Bloglist testing",
        author: "Full Stacker",
        url: "http://blog.fullstackopen.com/jesttest",
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(401)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()
      expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
    })
  })

  describe('deletion of a blog', () => {
    test('succeeds with status code 204 if id is valid', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToDelete = blogsAtStart.find(b => b.title === 'To be removed')

      await agent
        .delete(`/api/blogs/${blogToDelete.id}`)
        .expect(204)

      const blogsAtEnd = await helper.blogsInDb()
      expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1)

      const titles = blogsAtEnd.map(b => b.title)
      expect(titles).not.toContain(blogToDelete.title)
    })

    test('fails with status code 404 if id is invalid', async () => {
      await agent
        .delete('/api/blogs/invalidId')
        .expect(400)
    })

    test('fails with status code 401 if jwt invalid or not provided', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToDelete = blogsAtStart[0]

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .expect(401)

      const blogsAtEnd = await helper.blogsInDb()
      expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
    })
  })

  describe('updating an existing blog', () => {
    test('succeeds with status code 200', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToUpdate = blogsAtStart[0]
      const updatedBlogData = {
        title: 'Updated title',
        likes: 20
      }

      await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(updatedBlogData)
        .expect(200)

      const blogsAtEnd = await helper.blogsInDb()
      expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)

      const titles = blogsAtEnd.map(b => b.title)
      expect(titles).toContain('Updated title')

      const updatedBlog = blogsAtEnd.find(b => b.id === blogToUpdate.id)
      expect(updatedBlog.likes).toBe(20)
    })
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})