# expose-state

> A helper React HOC to return a component that will re-render when a value is changed.

## Installation

```sh
# npm
npm install expose-state

# yarn
yarn add expose-state
```

## Example

```jsx
import { exposeState } from 'expose-state'
import React from 'react'
import { render } from 'react-dom'

const [GlobalError, globalErrorState] = exposeState(
  (errorMessage, props) =>
    errorMessage && <Message text={errorMessage} {...props} />,
)(null)

const Message = ({ text }) => <div>{text}</div>

render(
  <div>
    <GlobalError />
    <h1>Welcome!</h1>
  </div>,
  document.querySelector('#root'),
)

window.addEventListener(
  'error',
  event => globalErrorState.setState(event.message),
)
```

## API

### `exposeState(render): initialState => [WrapperComponent, Store]`

A helper React HOC to return a component that will re-render when a value is changed.

|Argument|Type|Description|
|:---|:---|:---|
|`render`|`(state, props) => Node`|Passed the current state value and the props passed to the wrapped component. Returns a React node.|
|`initialState`|`*`|Initial state value.|

Returns a tuple. The first item is the wrapped component subscribed to the store, and the second item is the store.

|Property|Type|Description|
|:---|:---|:---|
|`store.getState`|`(): *`|Returns the current state value.|
|`store.setState`|`(nextState): void`|Sets the state to the given value and executes listeners.|
|`store.subscribe`|`(state => *): () => void`|Subscribe the given listener function to updates; it will be invoked with the next state. Returns a function that can be called to unsubscribe.|

```jsx
const [ShowCount, store] = exposeState(
  count => <Count value={count} />,
)(0)

const unsubscribe = store.subscribe(count => {
  console.log(`count: ${count}`)
})

const currentCount = store.getState()
store.setState(currentCount + 1)

unsubscribe()
```

## License

[MIT](../../LICENSE)
