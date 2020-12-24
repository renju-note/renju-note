import { Checkbox, HStack, Tag, TagCloseButton, TagLabel } from '@chakra-ui/react'
import React, { FC, useContext } from 'react'
import { AdvancedStateContext, SystemContext } from '../../../contexts'

const Default: FC = () => {
  const system = useContext(SystemContext)
  const { advancedState, setAdvancedState } = useContext(AdvancedStateContext)
  return (
    <HStack width={system.W} alignItems="center" spacing="2rem" px="2rem">
      <Checkbox defaultIsChecked>Current moves</Checkbox>
      {advancedState.playerId && (
        <Tag borderRadius="full" variant="solid">
          <TagLabel>{advancedState.playerId}</TagLabel>
          <TagCloseButton onClick={() => setAdvancedState(advancedState.unsetPlayerId())} />
        </Tag>
      )}
    </HStack>
  )
}

export default Default
