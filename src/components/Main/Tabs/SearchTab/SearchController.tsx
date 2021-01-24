import {
  Box,
  Checkbox,
  CloseButton,
  Input,
  InputGroup,
  InputLeftAddon,
  InputRightElement,
  SimpleGrid,
} from '@chakra-ui/react'
import React, { FC, useContext, useEffect, useMemo, useState } from 'react'
import { RiRadioButtonLine, RiUser3Fill } from 'react-icons/ri'
import { RIFDatabase, RIFPlayer } from '../../../../database'
import { AdvancedStateContext, BoardStateContext, SystemContext } from '../../../contexts'

const Default: FC = () => {
  const system = useContext(SystemContext)
  const { advancedState, setAdvancedState } = useContext(AdvancedStateContext)
  const { gameState } = useContext(BoardStateContext)
  const rifDB = useMemo(() => new RIFDatabase(), [])

  const playerId = advancedState.searchPlayerId
  const [player, setPlayer] = useState<RIFPlayer>()
  useEffect(() => {
    if (playerId) {
      ;(async () => setPlayer(await rifDB.getPlayer(playerId)))()
    } else {
      setPlayer(undefined)
    }
  }, [playerId])
  return (
    <SimpleGrid width={system.W} px="1rem" columns={2} spacing={1}>
      <Box>
        <InputGroup size="sm">
          <InputLeftAddon>
            <RiRadioButtonLine />
          </InputLeftAddon>
          <Input
            type="string"
            placeholder="put moves on board"
            isReadOnly
            value={gameState.current.encode()}
          />
          <InputRightElement>
            <Checkbox
              isChecked={advancedState.searchWithMoves}
              onChange={e => setAdvancedState(advancedState.setSearchWithMoves(e.target.checked))}
            />
          </InputRightElement>
        </InputGroup>
      </Box>
      <Box>
        <InputGroup size="sm">
          <InputLeftAddon>
            <RiUser3Fill />
          </InputLeftAddon>
          <Input
            type="string"
            placeholder="select player"
            isReadOnly
            value={player ? `${player.name.trim()} ${player.surname.trim()}` : ''}
          />
          <InputRightElement>
            <CloseButton
              size="sm"
              onClick={() => setAdvancedState(advancedState.unsetSearchPlayerId())}
            />
          </InputRightElement>
        </InputGroup>
      </Box>
    </SimpleGrid>
  )
}

export default Default
