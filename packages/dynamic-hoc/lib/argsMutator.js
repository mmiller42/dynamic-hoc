import { replaceElementAtIndex } from './arrayReplace.js'

export const createArgsMutator = (argNames, argsObserver) =>
  Object.seal(
    Object.defineProperties(
      {},
      argNames.reduce((definitions, argName, argIndex) => {
        definitions[argName] = {
          configurable: false,
          enumerable: true,
          get: () => argsObserver.value[argIndex],
          set: nextArgValue => {
            argsObserver.value = replaceElementAtIndex(
              argsObserver.value,
              argIndex,
              nextArgValue,
            )
          },
        }

        return definitions
      }, {}),
    ),
  )
