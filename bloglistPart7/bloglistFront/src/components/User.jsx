const User = ({ name, blogs }) => {
  if (!name) {
    return null
  }
  return (
    <div>
      <h2>{name}</h2>
      <h4> added blogs</h4>
      <ul>
        {blogs.map((blog, index) => {
          return (
            <li key={index}>{blog.title}</li>
          )
        })}
      </ul>
    </div>
  )
}

export default User