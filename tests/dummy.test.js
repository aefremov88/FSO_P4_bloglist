const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')
const {blogs} = require('./test_inputs')

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  assert.strictEqual(result, 1)
})

describe('sum of likes', () => {
    test('no blogs gives zero likes', () => {
        assert.strictEqual(listHelper.totalLikes([]), 0)
    })

    test('Sum of one is like itself', () => {
        assert.strictEqual(listHelper.totalLikes([{likes: 5}]), 5)
    })

    test('Sum of many blogs', () => {
        assert.strictEqual(listHelper.totalLikes(blogs), 36)
    })
    
})

describe('favourite blog', () => {
    test('no blogs', () => {
        assert.deepStrictEqual(listHelper.favoriteBlog([]), null)
    })

    test('Favourite in one blog', () => {
        assert.strictEqual(listHelper.favoriteBlog([blogs[0]]), blogs[0])
    })

    test('Favourite amongst many blogs', () => {
        assert.strictEqual(listHelper.favoriteBlog(blogs), blogs[2])
    })
    
})

describe('mostBlogs', () => {
    test('no blogs', () => {
        assert.deepStrictEqual(listHelper.mostBlogs([]), null)
    })

    test('In one blog', () => {
        assert.deepStrictEqual(listHelper.mostBlogs([blogs[0]]), 
            {author: "Michael Chan", blogs: 1})
    })

    test('Amongst many blogs', () => {
        assert.deepStrictEqual(listHelper.mostBlogs(blogs), 
            {author: "Robert C. Martin", blogs: 3})
    })
    
})

describe('mostLikes', () => {
    test('no blogs', () => {
        assert.deepStrictEqual(listHelper.mostLikes([]), null)
    })

    test('In one blog', () => {
        assert.deepStrictEqual(listHelper.mostLikes([blogs[0]]), 
            {author: "Michael Chan", blogs: 7})
    })

    test('Amongst many blogs', () => {
        assert.deepStrictEqual(listHelper.mostLikes(blogs), 
            {author: "Edsger W. Dijkstra", blogs: 17})
    })
    
})
