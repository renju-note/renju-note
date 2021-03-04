import {
  Checkbox,
  CloseButton,
  Input,
  InputGroup,
  InputLeftAddon,
  InputRightElement,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  SimpleGrid,
  Table,
  Tbody,
  Td,
  Tr,
  useDisclosure,
} from '@chakra-ui/react'
import React, { FC, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { RiRadioButtonLine, RiUser3Fill } from 'react-icons/ri'
import { RIFDatabase, RIFPlayer } from '../../../../database'
import { AdvancedStateContext, BoardStateContext } from '../../../contexts'

const Default: FC = () => {
  return (
    <SimpleGrid width="100%" columns={2} spacing={1} minChildWidth="240px">
      <MovesInput />
      <PlayerInput />
    </SimpleGrid>
  )
}

const MovesInput: FC = () => {
  const { advancedState, setAdvancedState } = useContext(AdvancedStateContext)
  const { gameState } = useContext(BoardStateContext)
  return (
    <InputGroup size="sm">
      <InputLeftAddon>
        <RiRadioButtonLine />
      </InputLeftAddon>
      <Input
        type="string"
        placeholder="put moves on board"
        isReadOnly
        value={gameState.current.encode(',')}
      />
      <InputRightElement>
        <Checkbox
          isChecked={advancedState.searchWithMoves}
          onChange={e => setAdvancedState(advancedState.setSearchWithMoves(e.target.checked))}
        />
      </InputRightElement>
    </InputGroup>
  )
}

const PlayerInput: FC = () => {
  const { advancedState, setAdvancedState } = useContext(AdvancedStateContext)
  const rifDB = useMemo(() => new RIFDatabase(), [])

  const [value, setValue] = useState<string>('')
  const [players, setPlayers] = useState<RIFPlayer[]>([])
  const popoverDisclosure = useDisclosure()
  const onChange = (value: string) => {
    setValue(value)
    ;(async () => {
      const keywords = value.trim().split(/\s+/)
      setPlayers(await rifDB.searchPlayers(keywords))
    })()
  }
  const onSetPlayer = (player: RIFPlayer) => {
    setAdvancedState(advancedState.setSearchPlayerId(player.id))
    popoverDisclosure.onClose()
  }
  const onUnsetPlayer = () => {
    setAdvancedState(advancedState.setSearchPlayerId(undefined))
    setValue('')
    popoverDisclosure.onClose()
  }

  const playerId = advancedState.searchPlayerId
  useEffect(() => {
    if (typeof playerId !== 'number') return
    ;(async () => {
      const player = await rifDB.getPlayer(playerId)
      const playerName = player ? `${player.name.trim()} ${player.surname.trim()}` : ''
      setValue(playerName)
    })()
  }, [playerId])

  const playerInputRef = useRef(null)
  return (
    <Popover initialFocusRef={playerInputRef} isOpen={popoverDisclosure.isOpen}>
      <PopoverTrigger>
        <InputGroup size="sm">
          <InputLeftAddon>
            <RiUser3Fill />
          </InputLeftAddon>
          <Input
            ref={playerInputRef}
            type="string"
            placeholder="select player"
            value={value}
            onClick={popoverDisclosure.onOpen}
            onChange={e => onChange(e.target.value)}
          />
          <InputRightElement>
            <CloseButton
              size="sm"
              onClick={onUnsetPlayer}
              disabled={advancedState.searchPlayerId === undefined && !popoverDisclosure.isOpen}
            />
          </InputRightElement>
        </InputGroup>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverArrow />
        <PopoverBody>
          <Table variant="unstyled" size="sm">
            <Tbody>
              {players.map((p, i) => (
                <Tr key={i} onClick={() => onSetPlayer(p)} _hover={{ bg: 'gray.100' }}>
                  <Td>{`${p.name.trim()} ${p.surname.trim()}`}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  )
}

export default Default
