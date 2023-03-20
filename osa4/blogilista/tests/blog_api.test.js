const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')

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

test('a valid blog can be added', async () => {
  const newBlog = {
    _id: "5a422bc61b54a676234d17fe",
    title: "Bloglist testing",
    author: "Full Stacker",
    url: "http://blog.fullstackopen.com/jesttest",
    likes: 1,
  }

  await api
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

test('a blog without likes can be added', async () => {
  const newBlog = {
    _id: "5a422bc61b54a676234d17ff",
    title: "No one likes me",
    author: "Full Stacker",
    url: "http://blog.fullstackopen.com/jesttest",
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

  const addedBlog = blogsAtEnd.find(b => b.id === newBlog._id)
  expect(addedBlog.likes).toBe(0)
})

test("a blog without title can't be added", async () => {
  const newBlog = {
    _id: "5a422bc61b54a676234d17ff",
    author: "Full Stacker",
    url: "http://blog.whatismytitle.com/jesttest",
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)

  const blogsAtEnd = await helper.blogsInDb()
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
})

test("a blog without url can't be added", async () => {
  const newBlog = {
    _id: "5a422bc61b54a676234d17ff",
    title: "I have no url",
    author: "Full Stacker",
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)

  const blogsAtEnd = await helper.blogsInDb()
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
})

afterAll(async () => {
  await mongoose.connection.close()
})