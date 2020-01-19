import { spy } from 'sinon'
import test from 'ava'
import { createArgsMutator } from './argsMutator.js'
import { createObserver } from './observer.js'

const argNames = ['a', 'b']

const createSetSpy = observer => spy(observer, 'value', ['set']).set

test('creates a property for each arg', t => {
  const argsObserver = createObserver([1, 2])
  const argsMutator = createArgsMutator(argNames, argsObserver)

  t.deepEqual(argsMutator, { a: 1, b: 2 })
})

test('gets arg value from observer', t => {
  const argsObserver = createObserver([1, 2])
  const argsMutator = createArgsMutator(argNames, argsObserver)

  t.is(argsMutator.a, 1)
  t.is(argsMutator.b, 2)
})

test('calls observer setter when setting an arg value', t => {
  const initialValues = [1, 2]

  const argsObserver = createObserver(initialValues)
  const argsMutator = createArgsMutator(argNames, argsObserver)
  const setSpy = createSetSpy(argsObserver)

  argsMutator.a = 3

  t.true(setSpy.calledOnce)
  t.deepEqual(setSpy.lastCall.args, [[3, 2]])
  t.not(setSpy.lastCall.args[0], initialValues)

  argsMutator.b = 4

  t.true(setSpy.calledTwice)
  t.deepEqual(setSpy.lastCall.args, [[3, 4]])

  const [previousValues] = setSpy.lastCall.args

  argsMutator.a = 3

  t.true(setSpy.calledThrice)
  t.is(setSpy.lastCall.args[0], previousValues)
})

test('does not allow assignment of other properties', t => {
  const argsObserver = createObserver([1, 2])
  const argsMutator = createArgsMutator(argNames, argsObserver)
  const setSpy = createSetSpy(argsObserver)

  t.throws(() => {
    argsMutator.z = 1
  })

  t.false(setSpy.called)
  t.is(argsMutator.z, undefined)
})
