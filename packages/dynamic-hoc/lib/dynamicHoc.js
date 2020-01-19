import { createElement, useEffect, useMemo, useState } from 'react'
import { createArgsMutator } from './argsMutator.js'
import { createObserver } from './observer.js'
import { getArgNames } from './argNames.js'

export const createDynamicHoc = (
  hocFactory,
  argNamesOrArity = null,
  hocName = '',
) => (...initialArgs) => {
  const argNames = argNamesOrArity ? getArgNames(argNamesOrArity) : null

  return Component => {
    const argsObserver = createObserver(initialArgs)

    const Wrapper = props => {
      const [args, setArgs] = useState(argsObserver.value)

      useEffect(() => {
        const handleArgsChange = currentArgs => setArgs(currentArgs)
        argsObserver.addListener(handleArgsChange)

        return () => argsObserver.removeListener(handleArgsChange)
      }, [setArgs])

      const hoc = useMemo(() => hocFactory(...args), [args])
      const EnhancedComponent = hoc(Component)

      return createElement(EnhancedComponent, props)
    }

    if (argNames) {
      Object.defineProperty(Wrapper, 'args', {
        configurable: false,
        enumerable: true,
        value: createArgsMutator(argNames, argsObserver),
        writable: false,
      })
    } else {
      Object.defineProperty(Wrapper, 'args', {
        configurable: false,
        enumerable: true,
        get: () => argsObserver.value,
        set: args => {
          argsObserver.value = args
        },
      })
    }

    Wrapper.restoreArgs = () => {
      argsObserver.value = initialArgs
    }

    const hocDisplayName = hocName || hocFactory.name
    const componentDisplayName = Component.displayName || Component.name || ''
    const displayName = `dynamicHoc(${hocDisplayName})(${componentDisplayName})`

    Object.defineProperty(Wrapper, 'name', { value: displayName })
    Wrapper.displayName = displayName

    return Wrapper
  }
}
