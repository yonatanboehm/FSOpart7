import { Link } from "react-router-dom"

const Bloglist = ({blogs, handleRemove, handleUpdate, user}) => {
  return (
    <div>
      <ul>
        {blogs.map((blog) => (
          <li key={blog.id}>
            <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Bloglist