import { createStore } from './store.js'
import { useEffect, useState } from 'react'

export const exposeState = render => initialState => {
  const store = createStore(initialState)

  const Wrapper = props => {
    const [state, setState] = useState({ current: store.getState() })

    useEffect(() => store.subscribe(state => setState({ current: state })), [
      setState,
    ])

    return render(state.current, props)
  }

  return [Wrapper, store]
}
