import React, { FC } from 'react'
import { ThemeProvider, CSSReset } from '@chakra-ui/core'

import Main from './Main'

const App: FC = () => {
  const width = window.innerWidth >= 640 ? 640 : 320
  return <ThemeProvider>
    <CSSReset />
    <Main width={width} />
  </ThemeProvider>
}

export default App
