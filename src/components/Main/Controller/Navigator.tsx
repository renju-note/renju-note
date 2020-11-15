import { Button, ButtonGroup, IconButton } from '@chakra-ui/react'
import React, { FC, useContext } from 'react'
import { FiChevronLeft, FiChevronRight, FiChevronsLeft, FiChevronsRight } from 'react-icons/fi'
import { BoardStateContext, SystemContext } from '../../contexts'

const Default: FC = () => {
  const system = useContext(SystemContext)
  const { boardState, setBoardState } = useContext(BoardStateContext)
  return (
    <ButtonGroup spacing={1} variant="ghost" size={system.buttonSize}>
      <IconButton
        onClick={() => setBoardState(boardState.toStart())}
        icon={<FiChevronsLeft />}
        aria-label="to start"
        isDisabled={boardState.isStart}
      />
      <IconButton
        onClick={() => setBoardState(boardState.backward())}
        icon={<FiChevronLeft />}
        aria-label="backward"
        isDisabled={boardState.isStart}
      />
      <Button
        width={6} // do not resize according to text
        fontFamily="Noto Serif"
        fontWeight="normal"
        isDisabled={true}
      >
        {boardState.cursor}
      </Button>
      <IconButton
        onClick={() => setBoardState(boardState.forward())}
        icon={<FiChevronRight />}
        aria-label="forward"
        isDisabled={boardState.isLast}
      />
      <IconButton
        onClick={() => setBoardState(boardState.toLast())}
        icon={<FiChevronsRight />}
        aria-label="to last"
        isDisabled={boardState.isLast}
      />
    </ButtonGroup>
  )
}

export default Default
