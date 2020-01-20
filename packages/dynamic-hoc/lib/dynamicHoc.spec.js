import { act, create as createTestRenderer } from 'react-test-renderer'
import { createElement } from 'react'
import test from 'ava'
import { dynamicHoc } from './dynamicHoc.js'
import { injectProps } from 'inject-props'

const render = (t, Component, props) => {
  let testInstance

  act(() => {
    testInstance = createTestRenderer(createElement(Component, props))
  })

  t.context.testInstances.push(testInstance)

  return testInstance.root
}

const getWrappedElement = testInstance => testInstance.children[0].children[0]

test.beforeEach(t => {
  t.context.testInstances = []
})

test.afterEach(t => {
  t.context.testInstances.forEach(testInstance => {
    testInstance.unmount()
  })
})

const Component = () => null

test('renders with the original HOC', t => {
  const Wrapper = dynamicHoc(injectProps({ a: 1 }))(Component)
  const testInstance = render(t, Wrapper, { b: 2 })

  t.deepEqual(getWrappedElement(testInstance).props, { a: 1, b: 2 })
})

test('re-renders when the HOC is changed', t => {
  const Wrapper = dynamicHoc(injectProps({ a: 1 }))(Component)
  const testInstance = render(t, Wrapper, { b: 2 })

  act(() => {
    Wrapper.replaceHoc(injectProps({ a: 2 }))
  })

  t.deepEqual(getWrappedElement(testInstance).props, { a: 2, b: 2 })
})

test('resets the original HOC', t => {
  const Wrapper = dynamicHoc(injectProps({ a: 1 }))(Component)
  const testInstance = render(t, Wrapper, { b: 2 })

  act(() => {
    Wrapper.replaceHoc(injectProps({ a: 2 }))
  })

  act(() => {
    Wrapper.resetHoc()
  })

  t.deepEqual(getWrappedElement(testInstance).props, { a: 1, b: 2 })
})

test('sets the name and displayName of the wrapper', t => {
  const Wrapper = dynamicHoc(injectProps({ a: 1 }))(Component)

  const displayName = 'dynamicHoc()(Component)'
  t.is(Wrapper.name, displayName)
  t.is(Wrapper.displayName, displayName)
})

test('does not affect more than one wrapped component', t => {
  const hoc = injectProps({ a: 1 })

  const Wrapper1 = dynamicHoc(hoc)(Component)
  const Wrapper2 = dynamicHoc(hoc)(Component)

  const testInstance1 = render(t, Wrapper1, { b: 2 })
  const testInstance2 = render(t, Wrapper2, { b: 3 })

  act(() => {
    Wrapper1.replaceHoc(injectProps({ a: 2 }))
  })

  t.deepEqual(getWrappedElement(testInstance1).props, { a: 2, b: 2 })
  t.deepEqual(getWrappedElement(testInstance2).props, { a: 1, b: 3 })
})
