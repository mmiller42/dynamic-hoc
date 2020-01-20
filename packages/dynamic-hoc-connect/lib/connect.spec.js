import { createStore } from 'redux'
import { create as createTestRenderer } from 'react-test-renderer'
import { Provider } from 'react-redux'
import React from 'react'
import { spy } from 'sinon'
import test from 'ava'
import { TodoContainer, TodoListContainer } from './connect.spec.app.js'

test('TodoListContainer', t => {
  const store = createStore(state => state, {})

  const testTodos = [
    { creator: '1', id: '42', text: 'foo' },
    { creator: '2', id: '43', text: 'bar' },
  ]

  const testCreators = {
    '1': { id: '1', name: 'Mary' },
    '2': { id: '2', name: 'Steve' },
  }

  const onComplete = spy()

  TodoListContainer.args.mapStateToProps = () => ({
    todos: testTodos,
  })

  TodoContainer.args.mapStateToProps = (_, props) => ({
    creator: testCreators[props.todo.creator],
  })

  TodoContainer.args.mapDispatchToProps = () => ({
    onComplete,
  })

  const wrapperElement = createTestRenderer(
    <Provider store={store}>
      <TodoListContainer />
    </Provider>,
  )

  const todoListElement =
    wrapperElement.root.children[0].children[0].children[0]

  t.deepEqual(todoListElement.props, { todos: testTodos })

  const todoElements = todoListElement.children[0].children.map(
    li => li.children[0].children[0].children[0],
  )

  t.is(todoElements.length, 2)

  t.deepEqual(todoElements[0].props, {
    creator: testCreators['1'],
    onComplete,
    todo: testTodos[0],
  })

  todoElements[0].props.onComplete()

  t.true(onComplete.calledOnce)
  t.deepEqual(onComplete.lastCall.args, [])

  t.deepEqual(todoElements[1].props, {
    creator: testCreators['2'],
    onComplete,
    todo: testTodos[1],
  })

  todoElements[1].props.onComplete()

  t.true(onComplete.calledTwice)
  t.deepEqual(onComplete.lastCall.args, [])
})
