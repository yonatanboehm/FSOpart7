import Blog from "./Blog";

const Bloglist = ({blogs, handleRemove, handleUpdate, user}) => {
  return (
    <div>
      {blogs.map((blog) => (
        <Blog
          key={blog.id}
          title={blog.title}
          url={blog.url}
          author={blog.author} 
          likes={blog.likes}
          user={blog?.user?.name}
          usernameBlog={blog?.user?.username} // question mark because no creating user in test ENV
          usernameUser={user.username}
          id={blog.id}
          handleUpdate={handleUpdate}
          handleRemove={handleRemove}
        />
      ))}
    </div>
  )
}

export default Bloglist