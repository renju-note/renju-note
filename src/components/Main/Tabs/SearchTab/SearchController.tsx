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
  const { advancedState, setAdvancedState } = useContext(AdvancedStateContext)
  const { gameState } = useContext(BoardStateContext)
  const rifDB = useMemo(() => new RIFDatabase(), [])

  const playerId = advancedState.searchPlayerId
  useEffect(() => {
    if (playerId) {
      ;(async () => {
        const player = await rifDB.getPlayer(playerId)
        setSearchText(player ? `${player.name.trim()} ${player.surname.trim()}` : '')
      })()
    } else {
      setSearchText('')
    }
  }, [playerId])

  const [searchText, setSearchText] = useState<string>('')
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [players, setPlayers] = useState<RIFPlayer[]>([])
  const onClick = (player: RIFPlayer) => {
    setAdvancedState(advancedState.setSearchPlayerId(player.id))
    onClose()
  }
  useEffect(() => {
    ;(async () => {
      setPlayers(await rifDB.searchPlayers(searchText.trim().split(/\s+/)))
    })()
  }, [searchText])

  const playerInputRef = useRef(null)
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
        <Popover initialFocusRef={playerInputRef} isOpen={isOpen}>
          <PopoverTrigger>
            <InputGroup size="sm">
              <InputLeftAddon>
                <RiUser3Fill />
              </InputLeftAddon>
              <Input
                ref={playerInputRef}
                type="string"
                placeholder="select player"
                value={searchText}
                onClick={onOpen}
                onChange={e => setSearchText(e.target.value)}
              />
              <InputRightElement>
                <CloseButton
                  size="sm"
                  onClick={() => {
                    setAdvancedState(advancedState.unsetSearchPlayerId())
                    onClose()
                  }}
                />
              </InputRightElement>
            </InputGroup>
          </PopoverTrigger>
          <PopoverContent>
            <PopoverArrow />
            <PopoverBody>
              <table className="search-result">
                {players.map((p, i) => (
                  <tr key={i} onClick={() => onClick(p)}>
                    <td>{`${p.name.trim()} ${p.surname.trim()}`}</td>
                  </tr>
                ))}
              </table>
            </PopoverBody>
          </PopoverContent>
        </Popover>
      </Box>
    </SimpleGrid>
  )
}

export default Default
