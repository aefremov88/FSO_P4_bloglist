const assert = require('node:assert')
const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')
const helper = require('./test_helper')

const api = supertest(app)

// Clear up and load test data into test db instance
beforeEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({});

  await api
    .post('/api/users')
    .send({ username: 'TestUser', name: 'Test', password: '1111' })
    .expect(201);


  for (let blog of helper.initialBlogs) {
    let blogObject = new Blog(blog)
    await blogObject.save()
  }
})

describe('GET all blogs', () => {

    test('all blogs are returned', async () => {
        const response = await api.get('/api/blogs')

        assert.strictEqual(response.body.length, helper.initialBlogs.length)
    })

    test('unique property is id', async () => {

        const blogs = await helper.blogsInDb()
        let id_exists = true

        for (let blog of blogs) {
            id_exists &&= 'id' in blog
        }
        assert(id_exists)

    })
})

describe('POST', () => {

    test('a valid note can be added ', async () => {

        const user = {
            "username": "TestUser",
            "password": "1111"
        }

        const logResp = await api
            .post('/api/login')
            .send(user)
            .expect(200)
            .expect('Content-Type', /json/)

        const token = logResp.body.token

        const newBlog = {
            title: "Test title",
            author: "Test author",
            url: "http://",
            likes: 2,
        }

        await api
            .post('/api/blogs')
            .set('Authorization', 'Bearer ' + token)
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const response = await api.get('/api/blogs')
    
        assert.strictEqual(response.body.length, helper.initialBlogs.length + 1)
    
        const titles = response.body.map(r => r.title)
        const authors = response.body.map(r => r.author)

        assert(titles.includes('Test title') && authors.includes('Test author'))
    })

    test('a valid blog can be added with NA likes', async () => {

        const user = {
            "username": "TestUser",
            "password": "1111"
        }

        const logResp = await api
            .post('/api/login')
            .send(user)
            .expect(200)
            .expect('Content-Type', /json/)

        const token = logResp.body.token
        const newBlog = {
            title: "Test2 title",
            author: "Test2 author",
            url: "http://",
        }

        const result = await api
            .post('/api/blogs')
            .set('Authorization', 'Bearer ' + token)
            .send(newBlog)

        assert.strictEqual(result.body.likes, 0)
    })

    test('title and url are present', async () => {
        let newBlog = {
            title: "Test3 title",
            author: "Test3 author",
        }

        let result = await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(401)

        newBlog = {
            url: "http://",
            author: "Test3 author",
        }

        result = await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(401)
    })
})

describe('DELETE', () => {
    test('deletion of a note', async () => {

        const user = {
            "username": "TestUser",
            "password": "1111"
        }

        const logResp = await api
            .post('/api/login')
            .send(user)
            .expect(200)
            .expect('Content-Type', /json/)

        const token = logResp.body.token
        const newBlog = {
            title: "Test2 title",
            author: "Test2 author",
            url: "http://",
        }

        const result = await api
            .post('/api/blogs')
            .set('Authorization', 'Bearer ' + token)
            .send(newBlog)

        const idToDelete = result.body.id
        
        const blogsAtStart = await helper.blogsInDb()


        await api
            .delete(`/api/blogs/${idToDelete}`)
            .set('Authorization', 'Bearer ' + token)
            .expect(204)

        const blogsAtEnd = await helper.blogsInDb()

        const titles = blogsAtEnd.map(r => r.title)
        const authors = blogsAtEnd.map(r => r.author)
        assert(!titles.includes(result.body.title) && ! authors.includes(result.body.author))

        assert.strictEqual(blogsAtStart.length, blogsAtEnd.length+1)
    })
})

describe('GET by id', () => {

    test('succeeds with a valid id', async () => {
        const blogsAtStart = await helper.blogsInDb()
        const blogToView = blogsAtStart[0]

        const resultBlog = await api
            .get(`/api/blogs/${blogToView.id}`)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        assert.deepStrictEqual(resultBlog.body, blogToView)
    })

    test('fails with statuscode 404 if blog does not exist', async () => {
        const validNonexistingId = await helper.nonExistingId()

        await api.get(`/api/blogs/${validNonexistingId}`).expect(404)
    })

    test('fails with statuscode 400 if id is invalid', async () => {
        const invalidId = '5a3d5da59070081a82a3445'

        await api.get(`/api/blogs/${invalidId}`).expect(400)
    })
})

describe('PUT by id', () => {

test('succeeds with a valid id', async () => {
        const blogsAtStart = await helper.blogsInDb()
        const blogToUpdate = blogsAtStart[0]
        const updatedBlog = {likes : 10}

        const resultBlog = await api
            .put(`/api/blogs/${blogToUpdate.id}`)
            .send(updatedBlog)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        assert.strictEqual(resultBlog.body.likes, 10)
    })

    test('fails with statuscode 404 if blog does not exist', async () => {
        const validNonexistingId = await helper.nonExistingId()
        const updatedBlog = {likes : 10}

        await api.put(`/api/blogs/${validNonexistingId}`)
            .send(updatedBlog)
            .expect(404)
    })

    test('fails with statuscode 400 if id is invalid', async () => {
        const invalidId = '5a3d5da59070081a82a3445'

        await api.put(`/api/blogs/${invalidId}`).expect(400)
    })

})

after(async () => {
  await mongoose.connection.close()
})
