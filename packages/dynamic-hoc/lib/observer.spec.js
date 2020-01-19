import { spy } from 'sinon'
import test from 'ava'
import { createObserver } from './observer.js'

test('sets the initial value on the value property', t => {
  const observer = createObserver(1)
  t.is(observer.value, 1)
})

test('freezes the value', t => {
  const value = { a: 1 }
  const observer = createObserver(value)

  t.throws(() => {
    observer.value.a = 2
  })

  t.is(observer.value, value)
  t.is(observer.value.a, 1)
})

test('updates the value when the value property is set', t => {
  const observer = createObserver(1)
  observer.value = 2
  t.is(observer.value, 2)
})

test('executes attached listeners when the value is changed', t => {
  const listener1 = spy()
  const listener2 = spy()
  const observer = createObserver(1)

  observer.addListener(listener1)
  observer.addListener(listener2)

  t.false(listener1.called)
  t.false(listener2.called)

  observer.value = 2

  t.true(listener1.calledOnce)
  t.true(listener2.calledOnce)

  t.deepEqual(listener1.lastCall.args, [2])
  t.deepEqual(listener2.lastCall.args, [2])

  observer.value = 3

  t.true(listener1.calledTwice)
  t.true(listener2.calledTwice)

  t.deepEqual(listener1.lastCall.args, [3])
  t.deepEqual(listener2.lastCall.args, [3])
})

test('removes an attached listener', t => {
  const listener1 = spy()
  const listener2 = spy()
  const observer = createObserver(1)

  observer.addListener(listener1)
  observer.addListener(listener2)
  observer.removeListener(listener2)

  observer.value = 2

  t.true(listener1.calledOnce)
  t.false(listener2.called)
})

test('does not execute listeners if value is set to the same value', t => {
  const listener = spy()
  const observer = createObserver(1)

  observer.addListener(listener)

  observer.value = 1

  t.false(listener.called)
})
