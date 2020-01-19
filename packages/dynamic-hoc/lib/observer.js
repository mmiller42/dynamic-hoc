export const createObserver = initialValue => {
  let currentValue
  const listeners = []

  const observer = {
    addListener: listener => listeners.push(listener),
    removeListener: listener =>
      listeners.splice(listeners.indexOf(listener), 1),
    get value() {
      return currentValue
    },
    set value(nextValue) {
      if (nextValue !== currentValue) {
        currentValue =
          nextValue !== null && typeof nextValue === 'object'
            ? Object.freeze(nextValue)
            : nextValue
        listeners.forEach(listener => listener(nextValue))
      }
    },
  }

  observer.value = initialValue

  return observer
}
