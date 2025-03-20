import type { FC } from 'react'
import React from 'react'
import type { IWelcomeProps } from '../welcome'
import Welcome from '../welcome'

interface ConfigScenceProps extends IWelcomeProps {
  className?: string
}

const ConfigSence: FC<ConfigScenceProps> = (props) => {
  const { className } = props
  return (
    <div className={`mb-5 antialiased font-sans overflow-hidden shrink-0 ${className || ''}`}>
      <Welcome {...props} />
    </div>
  )
}
export default React.memo(ConfigSence)
