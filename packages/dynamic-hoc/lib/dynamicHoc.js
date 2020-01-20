import { createElement, useEffect, useMemo, useState } from 'react'
import { createObserver } from './observer.js'
import { createSetWrapperDisplayName } from 'set-wrapper-display-name'

const setWrapperDisplayName = createSetWrapperDisplayName('dynamicHoc()')

export const dynamicHoc = initialHoc => Component => {
  const hocObserver = createObserver(initialHoc)

  const Wrapper = props => {
    const [hocState, setHocState] = useState({ hoc: initialHoc })

    useEffect(() => {
      const handleHocChange = hoc => setHocState({ hoc })
      hocObserver.addListener(handleHocChange)

      return () => hocObserver.removeListener(handleHocChange)
    }, [setHocState])

    return createElement(
      useMemo(() => hocState.hoc(Component), [hocState.hoc]),
      props,
    )
  }

  Wrapper.replaceHoc = hoc => {
    hocObserver.value = hoc
  }

  Wrapper.resetHoc = () => Wrapper.replaceHoc(initialHoc)

  setWrapperDisplayName(Wrapper, Component)

  return Wrapper
}
