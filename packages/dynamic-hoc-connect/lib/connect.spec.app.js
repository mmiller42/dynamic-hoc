import React from 'react'
import { dynamicConnect } from './index.js'

const TodoList = ({ todos }) => (
  <ul>
    {todos.map(todo => (
      <li key={todo.id}>
        <TodoContainer todo={todo} />
      </li>
    ))}
  </ul>
)

export const TodoListContainer = dynamicConnect(
  state => ({ todos: state.todos }),
  () => ({}),
)(TodoList)

const Todo = ({ creator, onComplete, todo }) => (
  <>
    <span>{todo.text}</span>
    <span>Created by {creator.name}</span>
    <button onClick={onComplete}>Complete</button>
  </>
)

export const TodoContainer = dynamicConnect(
  (state, props) => ({
    creator: state.users.find(user => user.id === props.todo.creatorId),
  }),
  (dispatch, props) => ({
    onComplete: () =>
      dispatch({
        type: 'COMPLETE_TODO',
        todo: props.todo,
      }),
  }),
)(Todo)
