const blogsRouter = require('express').Router()
const { request } = require('../app')
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
  })

blogsRouter.get('/:id', async (request, response) => {
  try {
    const result = await Blog.findById(request.params.id)
    if (result) response.json(result)
        else response.status(404).end() 
    } catch (error) {
        response.status(400).json({error: 'malformed id'})
    }
  })

blogsRouter.post('/', async (request, response) => {
  const blog = new Blog(request.body)

  if (blog.likes === undefined) {
    blog.likes = 0;
  }

  if (blog.title === undefined || blog.url === undefined) {
    response.status(401).json({error: 'title or url missing'})

  } else {

    const result = await blog.save()
    response.status(201).json(result)
  }
})

blogsRouter.delete('/:id', async (request, response) => {
    const result = await Blog.findByIdAndDelete(request.params.id)
    response.status(204).end()
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
