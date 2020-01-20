import test from 'ava'
import { createSetWrapperDisplayName } from './displayName.js'

const setWrapperDisplayName = createSetWrapperDisplayName('hoc')

test('sets name and displayName when component has displayName', t => {
  const Component = () => null
  Component.displayName = 'Foo'
  const Wrapper = () => null

  setWrapperDisplayName(Wrapper, Component)

  const displayName = 'hoc(Foo)'
  t.is(Wrapper.name, displayName)
  t.is(Wrapper.displayName, displayName)
})

test('sets name and displayName when component has name', t => {
  const Component = () => null
  Object.defineProperty(Component, 'name', { value: 'Foo' })
  const Wrapper = () => null

  setWrapperDisplayName(Wrapper, Component)

  const displayName = 'hoc(Foo)'
  t.is(Wrapper.name, displayName)
  t.is(Wrapper.displayName, displayName)
})

test('sets name and displayName when component has no name', t => {
  const Component = () => null
  Object.defineProperty(Component, 'name', { value: null })
  const Wrapper = () => null

  setWrapperDisplayName(Wrapper, Component)

  const displayName = 'hoc()'
  t.is(Wrapper.name, displayName)
  t.is(Wrapper.displayName, displayName)
})
