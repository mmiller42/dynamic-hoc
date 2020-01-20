# dynamic-hoc

> A utility that wraps a React HOC and produces a HOC with additional methods to swap out the given HOC at runtime.

This module provides the ability to wrap any React HOC (such as [`react-redux#connect`](https://react-redux.js.org/api/connect)) to produce a new HOC. The resultant HOC function has properties that allow you to change the HOC at runtime and re-render the wrapped component.

The primary purpose of this function is to provide the ability to write unit tests for React components in isolation from data injected by a HOC, which often requires extensive mocking. While the developer can export both the original component and the wrapped component, this technique does not apply if the component's descendants are wrapped by the HOC. With `dynamicHoc`, each wrapped component can have its HOC replaced with mock data or functions in the test suite.

This module was created specifically for the [`react-redux#connect`](https://react-redux.js.org/api/connect) HOC factory, but should work with any HOC. The intention was to test React components as units without the store and export and test `mapStateToProps` and `mapDispatchToProps` to test as their own units, in combination with selector composition techniques like [`reselect`](https://github.com/reduxjs/reselect).

## Installation

```sh
# npm
npm install dynamic-hoc

# yarn
yarn add dynamic-hoc
```

## Example

### Components

```jsx
import { connect } from 'react-redux'
import React from 'react'
import { dynamicHoc } from 'dynamic-hoc'

const TodoList = ({ todos }) => (
  <ul>
    {todos.map(todo => (
      <li key={todo.id}>
        <TodoContainer todo={todo} />
      </li>
    ))}
  </ul>
)

export const TodoListContainer = dynamicHoc(
  connect(
    state => ({ todos: state.todos }),
    () => ({}),
  ),
)(TodoList)

const Todo = ({ creator, onComplete, todo }) => (
  <div>
    <span>{todo.text}</span>
    <span>Created by {creator.name}</span>
    <button onClick={onComplete}>Complete</button>
  </div>
)

export const TodoContainer = dynamicHoc(
  connect(
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
  ),
)(Todo)
```

### Tests

```jsx
import React from 'react'
import { render } from '@testing-library/react'
import test from 'ava'
import { withProps } from 'dynamic-hoc'

test.afterEach(() => {
  TodoListContainer.resetHoc()
  TodoContainer.resetHoc()
})

test('TodoListContainer', t => {
  const testTodos = [
    { creator: '1', id: '42', text: 'foo' },
    { creator: '2', id: '43', text: 'bar' },
  ]

  const testCreators = {
    '1': { id: '1', name: 'Mary' },
    '2': { id: '2', name: 'Steve' },
  }

  TodoListContainer.replaceHoc(withProps({ todos: testTodos }))

  TodoContainer.replaceHoc(
    withProps(props => ({
      creator: testCreators[props.todo.creator],
      onComplete: () => {},
    })),
  )

  const { getByText } = render(<TodoListContainer />)

  getByText('foo')
  getByText('Created by Mary')
  getByText('bar')
  getByText('Created by Steve')
})

```

## API

### `dynamicHoc(initialHoc): Component => WrappedComponent`

|Argument|Type|Description|
|:---|:---|:---|
|`hoc`|`Component => WrappedComponent`|Any higher order component factory.|

The returned wrapped component has additional methods:

#### `WrappedComponent.replaceHoc(hoc): void`

Replaces the current HOC, triggering any component instances to re-render.

|Argument|Type|Description|
|:---|:---|:---|
|`hoc`|`Component => WrappedComponent`|Any higher order component factory.|

#### `WrappedComponent.resetHoc(): void`

Replaces the current HOC with `initialHoc`, triggering any component instances to re-render.

---

### `withProps(props): Component => WrappedComponent`

A helper HOC to pass any props to a component. Useful HOC to replace with in tests.

|Argument|Type|Description|
|:---|:---|:---|
|`props`|`object` \| `props => object`|A set of props to forward to the component; or, a function which receives the props passed to the component and returns a set of props to forward to the component.|

## License

[MIT](./LICENSE)
