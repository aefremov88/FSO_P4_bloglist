const assert = require('node:assert')
const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const User = require('../models/user')

const api = supertest(app)

beforeEach(async () => {
  await User.deleteMany({})
})

describe('POST', () => {
    test('username must exist', async () => {
        let newUser = {
            "name": "Uncle Cobb",
            "password": "1111"
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
    })

    test('password must exist', async () => {
        let newUser = {
            "username": "Usr2",
            "name": "Uncle Cobb",
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
    })

    test('username must be longer than 3 characters', async () => {
        let newUser = {
            "username": "U",
            "name": "Uncle Cobb",
            "password": "1111"
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
    })

    test('password must be longer than 3 characters', async () => {
        let newUser = {
            "username": "Usr2",
            "name": "Uncle Cobb",
            "password": "11"
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
    })
})

after(async () => {
    await mongoose.connection.close()
})
