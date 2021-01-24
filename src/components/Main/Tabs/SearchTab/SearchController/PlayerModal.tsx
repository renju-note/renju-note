import {
  Box,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
} from '@chakra-ui/react'
import React, { FC, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { RIFDatabase, RIFPlayer } from '../../../../../database'
import { AdvancedStateContext } from '../../../../contexts'

type DefaultProps = {
  isOpen: boolean
  onClose: () => void
}

const Default: FC<DefaultProps> = ({ isOpen, onClose }) => {
  const { advancedState, setAdvancedState } = useContext(AdvancedStateContext)
  const rifDB = useMemo(() => new RIFDatabase(), [])
  const [searchText, setSearchText] = useState<string>('')
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
  const initialRef = useRef<HTMLInputElement>(null)
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered initialFocusRef={initialRef}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader as="h1">Select player</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack>
            <Box>
              <Input
                ref={initialRef}
                size="sm"
                placeholder="Shigeru Nakamura"
                value={searchText}
                onChange={e => setSearchText(e.target.value)}
              />
            </Box>
            <Box>
              <table className="search-result">
                {players.map((p, i) => (
                  <tr key={i} onClick={() => onClick(p)}>
                    <td>{`${p.name.trim()} ${p.surname.trim()}`}</td>
                  </tr>
                ))}
              </table>
            </Box>
          </Stack>
        </ModalBody>
        <ModalFooter></ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default Default
