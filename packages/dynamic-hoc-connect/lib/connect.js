import { connect } from 'react-redux'
import { createDynamicHoc } from 'dynamic-hoc'

export const dynamicConnect = createDynamicHoc(
  connect,
  ['mapStateToProps', 'mapDispatchToProps', 'mergeProps', 'options'],
  'connect',
)
