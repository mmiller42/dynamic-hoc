import test from 'ava'
import { replaceElementAtIndex } from './arrayReplace.js'

test('returns a clone of the array, replacing the value at the given index', t => {
  const array = [1, 2, 3]
  const result = replaceElementAtIndex(array, 1, 4)

  t.deepEqual(result, [1, 4, 3])
  t.deepEqual(array, [1, 2, 3])
})

test('returns the original array if the element to replace is the same value', t => {
  const array = [1, 2, 3]
  const result = replaceElementAtIndex(array, 1, 2)

  t.is(result, array)
  t.deepEqual(array, [1, 2, 3])
})
