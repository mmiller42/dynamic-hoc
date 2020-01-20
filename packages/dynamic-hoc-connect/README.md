# dynamic-hoc-connect

> A wrapper for [`react-redux#connect`](https://react-redux.js.org/api/connect) HOC that allows mutation of its arguments.

This module provides the ability to change the arguments to `connect` at runtime, triggering the connected component to re-render.

The primary purpose of this function is to provide the ability to write unit tests for React components in isolation from the Redux store. While the developer can export both the original component and the connected component, this technique does not apply if any of the component's descendants are connected to the store. With `dynamicConnect`, each wrapped component can have its arguments (such as `mapStateToProps` and `mapDispatchToProps`) replaced with mock functions in the test suite.

## Example

### Components

```jsx
import React from 'react'
import { dynamicConnect } from 'dynamic-hoc-connect'

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
```

### Tests

```jsx
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import React from 'react'
import { render } from '@testing-library/react'
import { spy } from 'sinon'
import test from 'ava'

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

  // Replace `mapStateToProps` with a method that returns
  // the expected props. To test the logic of the actual
  // `mapStateToProps` function, export and test it
  // separately or use selectors from the `reselect`
  // library.
  TodoListContainer.args.mapStateToProps = () => ({
    todos: testTodos,
  })

  TodoContainer.args.mapStateToProps = (_, props) => ({
    creator: testCreators[props.todo.creator],
  })

  TodoContainer.args.mapDispatchToProps = () => ({
    onComplete,
  })

  // Because it wraps the original `connect` function,
  // we must render a `Provider` or `react-redux` will
  // throw an error.
  const { getByText } = render(
    <Provider store={store}>
      <TodoListContainer />
    </Provider>,
  )

  getByText('foo')
  getByText('Created by Mary')
  getByText('bar')
  getByText('Created by Steve')

  TodoListContainer.args.mapStateToProps = () => ({
    todos: [testTodos[0]],
  })

  t.throws(() => {
    getByText('foo')
  })

  TodoListContainer.restoreArgs()
  TodoList.restoreArgs()
})

```

## API

### `dynamicConnect(mapStateToProps[, mapDispatchToProps[, mergeProps[, options]]])`

#### Arguments

See [`react-redux#connect` docs](https://react-redux.js.org/api/connect#connect-parameters).

#### Return value

```js
Component => WrappedComponent
```

The `WrappedComponent` has additional properties for mutating the `connect` arguments at runtime, which will re-render any component instances:

* `args.mapStateToProps`
* `args.mapDispatchToProps`
* `args.mergeProps`
* `args.options`

The arguments can be restored to their originally provided values with the `restoreArgs` method.
