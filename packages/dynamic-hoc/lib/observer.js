export const createObserver = initialValue => {
  let currentValue = initialValue
  let listeners = []

  return {
    addListener: listener => {
      listeners.push(listener)
    },
    removeListener: listener => {
      listeners = listeners.filter(l => l !== listener)
    },
    get value() {
      return currentValue
    },
    set value(nextValue) {
      if (nextValue !== currentValue) {
        currentValue = nextValue

        listeners.forEach(listener => listener(nextValue))
      }
    },
  }
}
