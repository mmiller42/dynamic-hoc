export const createStore = initialState => {
  let currentState = initialState
  const listeners = new Set()

  return {
    subscribe: listener => {
      listeners.add(listener)

      return () => {
        listeners.delete(listener)
      }
    },
    getState: () => currentState,
    setState: nextState => {
      if (nextState !== currentState) {
        currentState = nextState

        listeners.forEach(listener => listener(nextState))
      }
    },
  }
}
