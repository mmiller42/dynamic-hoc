import { act, create as createTestRenderer } from 'react-test-renderer'
import { createElement } from 'react'
import { spy } from 'sinon'
import test from 'ava'
import { exposeState } from './exposeState.js'

const render = (t, Component, props) => {
  let testInstance

  act(() => {
    testInstance = createTestRenderer(createElement(Component, props))
  })

  t.context.testInstances.push(testInstance)

  return testInstance.root
}

const getWrappedElement = testInstance => testInstance.children[0]

test.beforeEach(t => {
  t.context.testInstances = []
})

test.afterEach(t => {
  t.context.testInstances.forEach(testInstance => {
    testInstance.unmount()
  })
})

const Component = () => null
const addStateProp = (state, props) =>
  createElement(Component, { state, ...props })

test('renders with initial state', t => {
  const [Wrapper] = exposeState(addStateProp)(1)
  const testInstance = render(t, Wrapper, { b: 2 })

  t.deepEqual(getWrappedElement(testInstance).props, { state: 1, b: 2 })
})

test('re-renders when state changes', t => {
  const [Wrapper, store] = exposeState(addStateProp)(1)
  const testInstance = render(t, Wrapper, { b: 2 })

  act(() => {
    store.setState(2)
  })

  t.deepEqual(getWrappedElement(testInstance).props, { state: 2, b: 2 })
})

test('cleans up when unmounted', t => {
  const [Wrapper, store] = exposeState(addStateProp)(1)

  const unsubscribeSpy = spy(store, 'subscribe')

  render(t, Wrapper, {})

  const [testInstance] = t.context.testInstances
  testInstance.unmount()

  t.true(unsubscribeSpy.called)
})
