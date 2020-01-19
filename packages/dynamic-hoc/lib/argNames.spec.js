import test from 'ava'
import { getArgNames } from './argNames.js'

test('returns the given arg names', t => {
  const argNames = ['a', 'b']
  t.is(getArgNames(argNames), argNames)
})

test('returns a range if given a number', t => {
  t.deepEqual(getArgNames(3), [0, 1, 2])
})
