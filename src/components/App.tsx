import { Center, ChakraProvider, Wrap, WrapItem } from '@chakra-ui/react'
import { FC, useContext } from 'react'
import Advanced from './Advanced'
import './App.css'
import Basic from './Basic'
import {
  AdvancedContextProvider,
  BasicContextProvider,
  PreferenceContext,
  PreferenceContextProvider,
  PreferenceOption,
  SystemContext,
  SystemContextProvider,
} from './contexts'
import theme from './theme'

const Default: FC = () => {
  return (
    <ChakraProvider theme={theme}>
      <SystemContextProvider>
        <PreferenceContextProvider>
          <Main />
        </PreferenceContextProvider>
      </SystemContextProvider>
    </ChakraProvider>
  )
}

const Main: FC = () => {
  const system = useContext(SystemContext)
  const { preference } = useContext(PreferenceContext)
  return (
    <BasicContextProvider>
      <Center my="0.5rem">
        <Wrap justify="center" spacing="0.5rem">
          <WrapItem w={system.W}>
            <Basic />
          </WrapItem>
          {preference.has(PreferenceOption.advancedMode) && (
            <WrapItem w={system.W}>
              <AdvancedContextProvider>
                <Advanced />
              </AdvancedContextProvider>
            </WrapItem>
          )}
        </Wrap>
      </Center>
    </BasicContextProvider>
  )
}

export default Default
