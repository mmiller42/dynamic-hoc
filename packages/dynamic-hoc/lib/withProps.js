import { createElement } from 'react'
import { createSetWrapperDisplayName } from './displayName.js'

const setWrapperDisplayName = createSetWrapperDisplayName('withProps')

export const withProps = props => {
  const getProps = typeof props === 'function' ? props : () => props

  return Component => {
    const Wrapper = componentProps =>
      createElement(Component, {
        ...componentProps,
        ...getProps(componentProps),
      })

    setWrapperDisplayName(Wrapper, Component)

    return Wrapper
  }
}
