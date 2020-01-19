import test from 'ava'
import { createRange } from './range.js'

test('creates a range', t => {
  t.deepEqual(createRange(1, 5), [1, 2, 3, 4, 5])
})
