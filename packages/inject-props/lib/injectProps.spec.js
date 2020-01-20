import { act, create as createTestRenderer } from 'react-test-renderer'
import { createElement } from 'react'
import { stub } from 'sinon'
import test from 'ava'
import { injectProps } from './injectProps.js'

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

test('adds the props to the component', t => {
  const Wrapper = injectProps({ a: 1 })(Component)
  const testInstance = render(t, Wrapper, { b: 2 })

  t.deepEqual(getWrappedElement(testInstance).props, { a: 1, b: 2 })
})

test('if given a function, invokes with the given props', t => {
  const getProps = stub().callsFake(props => ({ a: props.b + 1 }))
  const Wrapper = injectProps(getProps)(Component)
  const testInstance = render(t, Wrapper, { b: 2 })

  t.true(getProps.called)
  t.deepEqual(getProps.lastCall.args, [{ b: 2 }])

  t.deepEqual(getWrappedElement(testInstance).props, { a: 3, b: 2 })
})

test('uses custom mergeProps', t => {
  const Wrapper = injectProps(
    { a: 1 },
    injectedProps => injectedProps,
  )(Component)

  const testInstance = render(t, Wrapper, { b: 2 })

  t.deepEqual(getWrappedElement(testInstance).props, { a: 1 })
})

test('sets the name and displayName of the wrapper', t => {
  const Wrapper = injectProps({ a: 1 })(Component)

  const displayName = 'injectProps(Component)'
  t.is(Wrapper.name, displayName)
  t.is(Wrapper.displayName, displayName)
})
