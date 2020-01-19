import { createElement } from 'react'
import { act, create as createTestRenderer } from 'react-test-renderer'
import test from 'ava'
import { createDynamicHoc } from './dynamicHoc.js'

const render = (Component, props) => {
  let testInstance

  act(() => {
    testInstance = createTestRenderer(createElement(Component, props))
  })

  return testInstance.root
}

const getWrappedElement = testInstance => testInstance.children[0].children[0]

const hocFactory = (arg1, arg2) => Component => props =>
  createElement(Component, { ...props, arg1, arg2 })

const anonymousHocFactory = (arg1, arg2) => hocFactory(arg1, arg2)
Object.defineProperty(anonymousHocFactory, 'name', { value: '' })

const argNames = ['arg1', 'arg2']
const arity = 2
const hocName = 'hoc'

const Component = () => null

const ComponentWithDisplayName = props => Component(props)
ComponentWithDisplayName.displayName = 'ComponentDisplayName'

const AnonymousComponent = props => Component(props)
Object.defineProperty(AnonymousComponent, 'name', { value: '' })

const dynamicHocWithArgNames = hocFactory =>
  createDynamicHoc(hocFactory, argNames)

const dynamicHocWithArity = hocFactory => createDynamicHoc(hocFactory, arity)

const dynamicHocWithName = hocFactory =>
  createDynamicHoc(hocFactory, argNames, hocName)

test('names the wrapping component using the HOC factory name and component name', t => {
  const Wrapper = dynamicHocWithArgNames(hocFactory)('foo', 'bar')(Component)
  const testInstance = render(Wrapper, {})

  t.is(testInstance.type.name, 'dynamicHoc(hocFactory)(Component)')
})

test('names the wrapping component using the given HOC factory name and component name', t => {
  const Wrapper = dynamicHocWithName(hocFactory)('foo', 'bar')(Component)
  const testInstance = render(Wrapper, { x: 'y' })

  t.is(testInstance.type.name, 'dynamicHoc(hoc)(Component)')
})

test('names the wrapping component using the HOC factory name and component displayName', t => {
  const Wrapper = dynamicHocWithArgNames(hocFactory)('foo', 'bar')(ComponentWithDisplayName)
  const testInstance = render(Wrapper, {})

  t.is(testInstance.type.name, 'dynamicHoc(hocFactory)(ComponentDisplayName)')
})

test('names the wrapping component using an empty factory name and component name', t => {
  const Wrapper = dynamicHocWithArgNames(anonymousHocFactory)('foo', 'bar')(Component)
  const testInstance = render(Wrapper, {})

  t.is(testInstance.type.name, 'dynamicHoc()(Component)')
})

test('names the wrapping component using the HOC factory name and empty component name', t => {
  const Wrapper = dynamicHocWithArgNames(hocFactory)('foo', 'bar')(AnonymousComponent)
  const testInstance = render(Wrapper, {})

  t.is(testInstance.type.name, 'dynamicHoc(hocFactory)()')
})

test('executes the HOC with original args and renders', t => {
  const Wrapper = dynamicHocWithArgNames(hocFactory)('foo', 'bar')(Component)
  const testInstance = render(Wrapper, { x: 'y' })

  t.deepEqual(getWrappedElement(testInstance).props, { x: 'y', arg1: 'foo', arg2: 'bar' })
})

test('mutates named args', t => {
  const Wrapper = dynamicHocWithArgNames(hocFactory)('foo', 'bar')(Component)
  const testInstance = render(Wrapper, { x: 'y' })

  act(() => {
    Wrapper.args.arg1 = 'baz'
  })

  t.deepEqual(getWrappedElement(testInstance).props, { x: 'y', arg1: 'baz', arg2: 'bar' })
})

test('does not allow redefining args with named args', t => {
  const Wrapper = dynamicHocWithArgNames(hocFactory)('foo', 'bar')(Component)

  t.throws(() => {
    Wrapper.args = { arg1: '1', arg2: '2' }
  })

  t.deepEqual(Wrapper.args, { arg1: 'foo', arg2: 'bar' })
})

test('mutates indexed args', t => {
  const Wrapper = dynamicHocWithArity(hocFactory)('foo', 'bar')(Component)
  const testInstance = render(Wrapper, { x: 'y' })

  act(() => {
    Wrapper.args[1] = 'baz'
  })

  t.deepEqual(getWrappedElement(testInstance).props, { x: 'y', arg1: 'foo', arg2: 'baz' })
})

test('does not allow redefining args with indexed args', t => {
  const Wrapper = dynamicHocWithArity(hocFactory)('foo', 'bar')(Component)

  t.throws(() => {
    Wrapper.args = ['1', '2']
  })

  t.deepEqual(Wrapper.args, { 0: 'foo', 1: 'bar' })
})

test('mutates without arg info', t => {
  const Wrapper = createDynamicHoc(hocFactory)('foo', 'bar')(Component)
  const testInstance = render(Wrapper, { x: 'y' })

  act(() => {
    Wrapper.args = ['baz', 'quux']
  })

  t.deepEqual(getWrappedElement(testInstance).props, { x: 'y', arg1: 'baz', arg2: 'quux' })
})

test('restores original arguments', t => {
  const Wrapper = dynamicHocWithArity(hocFactory)('foo', 'bar')(Component)
  const testInstance = render(Wrapper, { x: 'y' })

  act(() => {
    Wrapper.args[1] = 'baz'
  })

  act(() => {
    Wrapper.restoreArgs()
  })

  t.deepEqual(getWrappedElement(testInstance).props, { x: 'y', arg1: 'foo', arg2: 'bar' })
})

test('does not affect more than one wrapped component', t => {
  const factory = dynamicHocWithArgNames(hocFactory)('foo', 'bar')
  const Wrapper1 = factory(Component)
  const Wrapper2 = factory(Component)

  const testInstance1 = render(Wrapper1, { x: 'y' })
  const testInstance2 = render(Wrapper2, { x: 'z' })

  act(() => {
    Wrapper1.args.arg1 = 'baz'
  })

  t.deepEqual(getWrappedElement(testInstance1).props, { x: 'y', arg1: 'baz', arg2: 'bar' })
  t.deepEqual(getWrappedElement(testInstance2).props, { x: 'z', arg1: 'foo', arg2: 'bar' })
})
