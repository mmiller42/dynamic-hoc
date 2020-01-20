# set-wrapper-display-name

> A utility to set the name and display name of a HOC-wrapped component.

Sets the `name` and `displayName` properties of a wrapper component based on the name of the HOC and the name of the wrapped component.

## Installation

```sh
# npm
npm install set-wrapper-display-name

# yarn
yarn add set-wrapper-display-name
```

## Example

```jsx
import { createSetWrapperDisplayName } from 'set-wrapper-display-name'

const setWrapperDisplayName = createSetWrapperDisplayName('withFoo')

const withFoo = Component => {
  const Wrapper = props => (
    <Component {...props} foo="foo" />
  )

  setWrapperDisplayName(Wrapper, Component)

  return Wrapper
}

const Message = ({ foo, text }) => (
  <div>
    {foo}: {text}
  </ul>
)

const MessageWithFoo = withFoo(Message)

<MessageWithFoo text="bar" />
// → <withFoo(Message) text="bar">
//     <Message text="bar" foo="foo" />
//   </withFoo(Message)>
```

## API

### `createSetWrapperDisplayName(hocName): (Wrapper, Component) => void`

Sets the `name` and `displayName` of `Wrapper` to `hocName(inferredComponentName)`, where `inferredComponentName` is `Component.displayName || Component.name || ''`.

|Argument|Type|Description|
|:---|:---|:---|
|`hocName`|`string`|The display name of the HOC.|
|`Wrapper`|`ReactComponent`|The wrapper component.|
|`Component`|`ReactComponent`|The component to wrap.|

```jsx
Component.displayName = 'MyComponent'

createSetDisplayName('foo')(Wrapper, Component)

Wrapper.displayName
Wrapper.name
// → 'foo(MyComponent)'
```

```jsx
createSetDisplayName('foo')(Wrapper, Component)

Wrapper.displayName
Wrapper.name
// → 'foo(Component)'
```

```jsx
createSetDisplayName('foo')(Wrapper, () => <div />)

Wrapper.displayName
Wrapper.name
// → 'foo()'
```

## License

[MIT](./LICENSE)
