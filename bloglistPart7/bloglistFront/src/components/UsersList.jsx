import { useEffect, useState } from 'react'
import User from './User'
import { Link } from "react-router-dom"

const UsersList = ({ users }) => {
  return (
    <div>
      <h2>Users</h2>
      <table>
        <thead>
          <tr>
            <th></th>
            <th>blogs created</th>
          </tr>
        </thead>
        <tbody>
        {users.map((user, index) => {
          return (
            <tr key={index}>
              <td>
                <Link to={`/users/${user.id}`}>{user.name}</Link>
              </td>
              <td>{user.blogs.length}</td>
            </tr>
          )
        })}
        </tbody>
      </table>
    </div>
  )
}

export default UsersList