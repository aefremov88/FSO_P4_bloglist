const dummy = (blogs) => 1

const totalLikes = (blogs) => {
    const reducer = (sum, item) => {
        return sum + item.likes
    }

    return blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
    const reducer = (fav, blog) => {
        return (!fav || fav.likes < blog.likes) ? blog : fav
    }

    return blogs.reduce(reducer, null)
}

const mostBlogs = (blogs) => {

    if (blogs.length === 0) return null

    let authors = new Map
    for (const blog of blogs) {
        authors.set(blog.author, (authors.get(blog.author) || 0) + 1)
    }

    const reducer = (champ, author) => {
        return (!champ || authors.get(champ) < authors.get(author)) ? author : champ
    }
    const author = [...authors.keys()].reduce(reducer, null)
    const count = authors.get(author)

    return {author: author, blogs: count}
}

const mostLikes = (blogs) => {

    if (blogs.length === 0) return null

    let authors = new Map
    for (const blog of blogs) {
        authors.set(blog.author, (authors.get(blog.author) || 0) + blog.likes)
    }

    const reducer = (champ, author) => {
        return (!champ || authors.get(champ) < authors.get(author)) ? author : champ
    }
    const author = [...authors.keys()].reduce(reducer, null)
    const count = authors.get(author)

    return {author: author, blogs: count}
}

module.exports = {
  dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes
}
