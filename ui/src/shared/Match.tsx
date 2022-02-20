import React from 'react'
import { State } from 'xstate'

interface MatchProps {
  on: string | string[]
  state: State<any, any>
}

const Match: React.FC<MatchProps> = ({ children, on, state }) => {
  const expected = Array.isArray(on) ? on : [on]

  const showWhileCancelling =
    state.matches('cancelling') &&
    state.history &&
    expected.some((value) => state.history!.matches(value))

  return expected.some((value) => state.matches(value)) || showWhileCancelling ? (
    <> {children} </>
  ) : null
}

export default Match
