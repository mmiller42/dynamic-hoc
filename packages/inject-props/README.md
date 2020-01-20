# inject-props

> A helper React HOC to pass any props to a component.

## Installation

```sh
# npm
npm install inject-props

# yarn
yarn add inject-props
```

## Example

```jsx
import { injectProps } from 'inject-props'
import React from 'react'

const Message = ({ className, text }) => (
  <div className={className}>
    {text}
  </div>
)

const ErrorMessage = injectProps({
  className: 'errorMessage',
})(Message)

<ErrorMessage text="Error!" />
// → <MyComponent className="errorMessage" text="Error!" />

const MessageByType = injectProps(
  props => ({
    className: props.type === 'error' ? 'errorMessage' : '',
  }),
)(Message)

<MessageByType type="error" text="Error!" />
// → <MyComponent className="errorMessage" text="Error!" />

<MessageByType type="generic" text="Error!" />
// → <MyComponent className="" text="Error!" />
```

## API

### `injectProps(props[, mergeProps]): Component => WrapperComponent`

A helper HOC to pass any props to a component.

|Argument|Type|Description|
|:---|:---|:---|
|`props`|`object` \| `props => object`|A set of props to forward to the component; or, a function which receives the props passed to the component and returns a set of props to forward to the component.|
|`mergeProps`|`(injectedProps, ownProps) => object`|A function used to merge the props provided by the HOC with the props passed to the wrapped component. Defaults to `{ ...ownProps, ...injectedProps }`.|
|`Component`|`ReactComponent`|The component to wrap.|

```jsx
const MyConnectedComponent = injectProps({ foo: 'bar' })(MyComponent)

<MyConnectedComponent x={1} y={2} />
// → <MyComponent x={1} y={2} foo="bar" />
```

```jsx
const MyConnectedComponent = injectProps(
  props => ({ foo: props.x + props.y }),
)(MyComponent)

<MyConnectedComponent x={1} y={2} />
// → <MyComponent x={1} y={2} foo={3} />
```

```jsx
const MyConnectedComponent = injectProps(
  props => ({ foo: props.x + props.y }),
  (injectedProps, ownProps) => injectedProps,
)(MyComponent)

<MyConnectedComponent x={1} y={2} />
// → <MyComponent foo={3} />
```

## License

[MIT](../../LICENSE)
