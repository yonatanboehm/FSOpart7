const Anecdote = ({ anecdote }) => {
  if (anecdote === undefined) {
    return null
  }
  return (
    <div>
      <h3>{anecdote.content}</h3>
      <p>has {anecdote.votes} votes</p>
      <p>for more info see <a href={`//${anecdote.info}`}>{anecdote.info}</a></p>
    </div>
  )
}

export default Anecdote