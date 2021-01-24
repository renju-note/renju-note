import {
  Box,
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
  useDisclosure,
} from '@chakra-ui/react'
import React, { FC, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { RiRadioButtonLine, RiUser3Fill } from 'react-icons/ri'
import { RIFDatabase, RIFPlayer } from '../../../../database'
import { AdvancedStateContext, BoardStateContext, SystemContext } from '../../../contexts'

const Default: FC = () => {
  const system = useContext(SystemContext)
  return (
    <SimpleGrid width={system.W} px="1rem" columns={2} spacing={1}>
      <Box>
        <MovesInput />
      </Box>
      <Box>
        <PlayerInput />
      </Box>
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
        value={gameState.current.encode()}
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
  useEffect(() => {
    const playerId = advancedState.searchPlayerId
    if (playerId) {
      ;(async () => {
        const player = await rifDB.getPlayer(playerId)
        const playerName = player ? `${player.name.trim()} ${player.surname.trim()}` : ''
        setValue(playerName)
      })()
    } else {
      setValue('')
    }
  }, [advancedState.searchPlayerId])

  const popoverDisclosure = useDisclosure()
  const [players, setPlayers] = useState<RIFPlayer[]>([])
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
    setAdvancedState(advancedState.unsetSearchPlayerId())
    popoverDisclosure.onClose()
  }

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
              disabled={advancedState.searchPlayerId === undefined}
            />
          </InputRightElement>
        </InputGroup>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverArrow />
        <PopoverBody>
          <table className="search-result">
            <tbody>
              {players.map((p, i) => (
                <tr key={i} onClick={() => onSetPlayer(p)}>
                  <td>{`${p.name.trim()} ${p.surname.trim()}`}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  )
}

export default Default
