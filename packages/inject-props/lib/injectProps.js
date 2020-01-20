import { createElement } from 'react'
import { createSetWrapperDisplayName } from 'set-wrapper-display-name'

const setWrapperDisplayName = createSetWrapperDisplayName('injectProps')

const defaultMergeProps = (injectedProps, ownProps) => ({
  ...ownProps,
  ...injectedProps,
})

export const injectProps = (props, mergeProps = defaultMergeProps) => {
  const getProps = typeof props === 'function' ? props : () => props

  return Component => {
    const Wrapper = componentProps =>
      createElement(
        Component,
        mergeProps(getProps(componentProps), componentProps),
      )

    setWrapperDisplayName(Wrapper, Component)

    return Wrapper
  }
}
