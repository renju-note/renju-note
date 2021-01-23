import { Checkbox, HStack, Tag, TagCloseButton, TagLabel } from '@chakra-ui/react'
import React, { FC, useContext, useEffect, useMemo, useState } from 'react'
import { RIFDatabase, RIFPlayer } from '../../../../database'
import { AdvancedStateContext, SystemContext } from '../../../contexts'

const Default: FC = () => {
  const system = useContext(SystemContext)
  const { advancedState, setAdvancedState } = useContext(AdvancedStateContext)
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
    <HStack width={system.W} alignItems="center" spacing="2rem" px="2rem">
      <Checkbox
        isChecked={advancedState.searchWithMoves}
        onChange={e => setAdvancedState(advancedState.setSearchWithMoves(e.target.checked))}
      >
        Current moves
      </Checkbox>
      {player && (
        <Tag borderRadius="full" variant="solid">
          <TagLabel>{`${player.name.trim()} ${player.surname.trim()}`}</TagLabel>
          <TagCloseButton onClick={() => setAdvancedState(advancedState.unsetSearchPlayerId())} />
        </Tag>
      )}
    </HStack>
  )
}

export default Default
