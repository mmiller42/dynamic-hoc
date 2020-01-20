# dynamic-hoc

> A utility that wraps a React HOC and produces a HOC with additional methods to swap out the given HOC at runtime.

This module provides the ability to wrap any React HOC (such as [`react-redux.connect`](https://react-redux.js.org/api/connect) or [`react-router.withRouter`](https://reacttraining.com/react-router/core/api/withRouter)) to produce a new HOC. The resultant HOC function has properties that allow you to change the HOC at runtime and re-render the wrapped component.

## Why?

The primary purpose of this function is to provide the ability to write unit tests for React components in isolation from data injected by a HOC, which often requires extensive mocking. While the developer can export both the original component and the wrapped component, this technique does not apply if the component’s descendants are wrapped by the HOC. With `dynamicHoc`, each wrapped component can have its HOC replaced with mock data or functions in the test suite.

This enables developers to test React components as units. This is normally possible by exporting the unwrapped component and testing it in isolation, but the component cannot be fully rendered in a test if it contains child components that are wrapped in HOCs. If the HOC has logic of its own, such as functions `mapStateToProps`, they can be tested independently with dedicated unit tests, or composed with a utility like [`reselect`](https://github.com/reduxjs/reselect), where the selectors have their own dedicated unit tests. See the [Example section](#example) for an illustration of a typical scenario where a “pure” component’s children are components wrapped in a HOC.

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
import { injectProps } from 'inject-props'

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

  TodoListContainer.replaceHoc(injectProps({ todos: testTodos }))

  TodoContainer.replaceHoc(
    injectProps(props => ({
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

### `dynamicHoc(initialHoc): Component => WrapperComponent`

|Argument|Type|Description|
|:---|:---|:---|
|`hoc`|`Component => WrapperComponent`|Any higher order component factory.|
|`Component`|`ReactComponent`|The component to wrap.|

The returned wrapper component has additional methods:

#### `WrappedComponent.replaceHoc(hoc): void`

Replaces the current HOC, triggering any component instances to re-render.

|Argument|Type|Description|
|:---|:---|:---|
|`hoc`|`Component => WrapperComponent`|Any higher order component factory.|

```jsx
const MyConnectedComponent = dynamicHoc(withRouter)(MyComponent)

MyConnectedComponent.replaceHoc(
  injectProps({ location: { pathname: '/foo' } }),
)

<MyConnectedComponent x={1} y={2} />
// → <MyComponent x={1} y={2} location={{ pathname: '/foo' }} />
```

#### `WrappedComponent.resetHoc(): void`

Replaces the current HOC with `initialHoc`, triggering any component instances to re-render.

```jsx
MyConnectedComponent.resetHoc()
```

## License

[MIT](../../LICENSE)
