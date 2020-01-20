# dynamic-hoc

> A utility that wraps a React HOC factory and produces a HOC with an API to mutate the factory's arguments.

This module provides the ability to wrap any React HOC factory (such as [`react-redux#connect`](https://react-redux.js.org/api/connect)) to produce a new HOC factory. The factory accepts the same arguments as the given HOC factory, but the resultant HOC function has properties that allow you to change the arguments at runtime and re-render the wrapped component.

The primary purpose of this function is to provide the ability to write unit tests for React components in isolation from data injected by a HOC, which often requires extensive mocking. While the developer can export both the original component and the wrapped component, this technique does not apply if the component's descendants are wrapped by the HOC. With `createDynamicHoc`, each wrapped component can have its HOC arguments replaced with mock data or functions in the test suite.

This module was created specifically for the [`react-redux#connect`](https://react-redux.js.org/api/connect) HOC factory, and the package [`dynamic-hoc-connect`](../dynamic-hoc-connect) provides this factory.

## Example

```jsx
import { createDynamicHoc } from 'dynamic-hoc'
import React from 'react'
import { render } from 'react-dom'

const addFoo = fooValue =>
  Component =>
    props =>
      <Component foo={fooValue} {...props} />

const dynamicAddFoo = createDynamicHoc(addFoo, [
  'fooValue',
])

const Component = dynamicAddFoo('bar')(
  props => (
    <div>{props.foo}</div>
  )
)

render(
  <Component />
)
// <div>bar</div>

Component.args.foo = 'baz'

// Component re-renders
// <div>baz</div>
```

## API

### `createtDynamicHoc(hocFactory[, argNamesOrArity[, hocName]])`

#### Arguments

|Argument|Type|Description|Default value|
|:---|:---|:---|:---|
|`hocFactory`|`(...args) => Component => WrappedComponent`|A function which receives arguments and returns a HOC.|*None*|
|`argNamesOrArity`|`string[]` \| `number`|The names of the arguments to `hocFactory`, or the number of arguments it receives.|`null`|
|`hocName`|`string`|A display name for the HOC factory. If omitted, it defaults to `hocFactory.name` or `''`.|`null`|

#### Return value

```js
(...args) => Component => WrappedComponent
```

Returns a HOC factory which accepts the same arguments as the given `hocFactory`.

This factory returns a HOC which accepts a React component and returns a wrapped component. The wrapped component has two additional properties:

|Property|Type|Description|
|:---|:---|:---|
|`args`|`object` \| `array`|An object with the `hocFactory`'s arguments. Arguments can be reassigned at runtime. If an arity was provided to `createDynamicHoc`, `args` will be an array and arguments can be assigned by index. If neither argument names nor arity is provided, `args` can be reassigned to a new array.|
|`restoreArgs`|`() => void`|A function which will restore the originally provided arguments to the HOC.|
