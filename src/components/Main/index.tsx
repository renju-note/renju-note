import { Center, Stack, Wrap, WrapItem } from '@chakra-ui/react'
import { FC, useContext } from 'react'
import { EditMode } from '../../state'
import {
  AdvancedStateProvider,
  BoardStateContext,
  PreferenceContext,
  PreferenceOption,
  SystemContext,
} from '../contexts'
import Board from './Board'
import Controller from './Controller'
import PreviewingController from './PreviewingController'
import Tabs from './Tabs'

const Default: FC = () => {
  const system = useContext(SystemContext)
  const { preference } = useContext(PreferenceContext)
  const { boardState } = useContext(BoardStateContext)
  return (
    <AdvancedStateProvider>
      <Center my="0.5rem">
        <Wrap justify="center" spacing="0.5rem">
          <WrapItem w={system.W}>
            <Stack spacing="1rem">
              <Board />
              {boardState.mode === EditMode.preview ? <PreviewingController /> : <Controller />}
            </Stack>
          </WrapItem>
          {preference.has(PreferenceOption.advancedMode) && (
            <WrapItem w={system.W}>
              <Tabs />
            </WrapItem>
          )}
        </Wrap>
      </Center>
    </AdvancedStateProvider>
  )
}

export default Default
