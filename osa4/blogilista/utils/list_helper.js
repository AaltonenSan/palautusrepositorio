const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, obj) => sum + obj.likes, 0)
}

const favoriteBlog = (blogs) => {
  // Sorts the blogs by likes in desc order and returns the 1st from that array
  return blogs.sort((a, b) => (a.likes < b.likes) ? 1 : -1)[0]
}

const mostBlogs = (blogs) => {
  /* 
    First reduce function creates an object with authors as keys and sum of occurances as values 
    Second reduce function then iterates over array of key value pairs 
    created with Object.entries and returns the author with highest value
  */
  const [author, count] = Object.entries(blogs.reduce((acc, { author }) => {
    acc[author] = (acc[author] || 0) + 1
    return acc
  }, {})).reduce(([author, count], [currentAuthor, currentCount]) => {
    return currentCount > count ? [currentAuthor, currentCount] : [author, count]
  })

  const result = {
    author: author,
    blogs: count
  }
  return result
}

const mostLikes = (blogs) => {
  /* 
    First reduce function creates an object with authors as keys and sum of likes as value 
    Second reduce function then iterates over array of key value pairs created with 
    Object.entries and returns the author with highest amount of likes
  */
  const [author, likes] = Object.entries(blogs.reduce((acc, { author, likes }) => {
    acc[author] = (acc[author] || 0) + likes
    return acc
  }, {})).reduce(([author, likes], [currentAuthor, currentLikes]) => {
    return currentLikes > likes ? [currentAuthor, currentLikes] : [author, likes];
  }, ['', 0]);

  const result = {
    author: author,
    likes: likes
  }
  return result
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}