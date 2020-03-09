import { createElement, useMemo } from 'react'
import { createSetWrapperDisplayName } from 'set-wrapper-display-name'
import { exposeState } from 'expose-state'

const setWrapperDisplayName = (hoc, Wrapper, Component) =>
  createSetWrapperDisplayName(`dynamicHoc(${hoc.name || ''})`)(
    Wrapper,
    Component,
  )

export const dynamicHoc = initialHoc => Component => {
  const [Wrapper, store] = exposeState((hoc, props) =>
    createElement(
      useMemo(() => hoc(Component), [hoc]),
      props,
    ),
  )(initialHoc)

  Wrapper.replaceHoc = hoc => store.setState(hoc)

  Wrapper.resetHoc = () => Wrapper.replaceHoc(initialHoc)

  setWrapperDisplayName(initialHoc, Wrapper, Component)
  store.subscribe(hoc => setWrapperDisplayName(hoc, Wrapper, Component))

  return Wrapper
}
