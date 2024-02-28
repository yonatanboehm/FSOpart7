import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useField } from '../hooks/index'

const CreateNew = ({ addNew, setNotification }) => {
  const navigate = useNavigate()

  const [content, resetContent] = useField('text')
  const [author, resetAuthor] = useField('text')
  const [info, resetInfo] = useField('text')


  const handleSubmit = (e) => {
    e.preventDefault()
    addNew({
      content: content.value,
      author: author.value,
      info: info.value,
      votes: 0
    })
    setNotification(`a new anecdote "${content.value}" created!`)
    setTimeout(() => {
      setNotification('')
    }, 5000)
    resetAuthor()
    resetContent()
    resetInfo()
    navigate('/anecdotes')
  }

  return (
    <div>
      <h2>create a new anecdote</h2>
      <form onSubmit={handleSubmit}>
        <div>
          content
          <input value={content.value} onChange={content.onChange} />
        </div>
        <div>
          author
          <input value={author.value} onChange={author.onChange} />
        </div>
        <div>
          url for more info
          <input value={info.value} onChange={info.onChange} />
        </div>
        <button tyoe="submit">create</button><button type="button" onClick={() => {
          resetAuthor()
          resetContent()
          resetInfo()
        }}>reset</button>
      </form>
    </div>
  )

}

export default CreateNew
