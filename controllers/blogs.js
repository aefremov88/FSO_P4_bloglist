const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const { userExtractor } = require('../utils/middleware')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({}).populate('user', { username: 1, name: 1, id: 1} )
  response.json(blogs)
  })

blogsRouter.get('/:id', async (request, response) => {
  try {
    const result = await Blog
      .findById(request.params.id).populate('user', { username: 1, name: 1, id: 1} )
    if (result) response.json(result)
        else response.status(404).end() 
    } catch (error) {
        response.status(400).json({error: 'malformed id'})
    }
  })

blogsRouter.post('/', userExtractor, async (request, response) => {
  const blog = new Blog(request.body)

  const user = request.user

  blog.user = user._id

  if (blog.likes === undefined) {
    blog.likes = 0;
  }

  if (blog.title === undefined || blog.url === undefined) {
    response.status(401).json({error: 'title or url missing'})

  } else {

    const result = await blog.save()
    user.blogs = user.blogs.concat(result._id)
    await user.save()

    response.status(201).json(result)
  }
})

blogsRouter.delete('/:id', userExtractor, async (request, response) => {

  const user = request.user

  const blog = await Blog.findById(request.params.id)

  if (blog.user.toString() === user._id.toString()) {
    await Blog.deleteOne(blog)
    response.status(204).end()
  } else {
    response.status(403).json({ error: 'no permission to delete blog'})
  }
  
})

blogsRouter.put('/:id', async (request, response) => {
    
    try {
        const { likes } = request.body
        const blog = await Blog.findById(request.params.id)
        
        if (!blog) return response.status(404).end()
        blog.likes = likes
        const result = await blog.save()
        response.status(200).json(result)
    } catch(error) {
        response.status(400).json({error: 'malformed id'})
    }
    
})

module.exports = blogsRouter
