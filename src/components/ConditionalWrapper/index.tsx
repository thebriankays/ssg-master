import { ReactNode } from 'react'

interface ConditionalWrapperProps {
  condition: boolean
  wrapper: (children: ReactNode) => ReactNode
  children: ReactNode
}

export const ConditionalWrapper = ({ condition, wrapper, children }: ConditionalWrapperProps) => {
  return condition ? wrapper(children) : <>{children}</>
}

export default ConditionalWrapper