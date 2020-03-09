import { spy } from 'sinon'
import test from 'ava'
import { createStore } from './store.js'

test('sets the initial state', t => {
  const store = createStore(1)

  t.is(store.getState(), 1)
})

test('setState updates the state', t => {
  const store = createStore(1)
  store.setState(2)

  t.is(store.getState(), 2)
})

test('executes attached listeners when the state is changed', t => {
  const listener1 = spy()
  const listener2 = spy()
  const store = createStore(1)

  store.subscribe(listener1)
  store.subscribe(listener2)

  t.false(listener1.called)
  t.false(listener2.called)

  store.setState(2)

  t.is(listener1.callCount, 1)
  t.is(listener2.callCount, 1)

  t.deepEqual(listener1.lastCall.args, [2])
  t.deepEqual(listener2.lastCall.args, [2])

  store.setState(3)

  t.is(listener1.callCount, 2)
  t.is(listener2.callCount, 2)

  t.deepEqual(listener1.lastCall.args, [3])
  t.deepEqual(listener2.lastCall.args, [3])
})

test('does not execute listeners if state is set to the same value', t => {
  const listener = spy()
  const store = createStore(1)

  store.subscribe(listener)

  store.setState(1)

  t.false(listener.called)
})

test('subscribe returns unsubscribe function', t => {
  const listener1 = spy()
  const listener2 = spy()
  const store = createStore(1)

  store.subscribe(listener1)
  const unsubscribe2 = store.subscribe(listener2)
  unsubscribe2()

  store.setState(2)

  t.true(listener1.called)
  t.false(listener2.called)
})
