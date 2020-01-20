export const createSetWrapperDisplayName = hocName => (Wrapper, Component) => {
  const componentDisplayName = Component.displayName || Component.name || ''
  const wrapperDisplayName = `${hocName}(${componentDisplayName})`

  Object.defineProperty(Wrapper, 'name', { value: wrapperDisplayName })
  Wrapper.displayName = wrapperDisplayName
}
