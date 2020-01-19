export const replaceElementAtIndex = (array, index, value) =>
  value === array[index]
    ? array
    : [...array.slice(0, index), value, ...array.slice(index + 1)]
