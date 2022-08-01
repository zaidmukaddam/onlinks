import { createIcon } from '@chakra-ui/react'
import React from 'react'

export const MoonIcon = createIcon({
  defaultProps: {
    width: '16px',
    height: '16px',
    stroke: 'currentColor',
    strokeWidth: '2px',
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    fill: 'none',
    'aria-hidden': true,
  },
  viewBox: '0 0 24 24',
  path: <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />,
})
