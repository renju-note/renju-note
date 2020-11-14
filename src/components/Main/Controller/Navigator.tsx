import {
  Button,
  Flex,
  IconButton
} from '@chakra-ui/core'
import React, { FC, useContext } from 'react'
import { FiChevronLeft, FiChevronRight, FiChevronsLeft, FiChevronsRight } from 'react-icons/fi'
import { BoardStateContext, SystemContext } from '../../contexts'

const Default: FC = () => {
  const system = useContext(SystemContext)
  const {boardState, setBoardState} = useContext(BoardStateContext)
  return <Flex justifyContent="center" alignItems="center">
    <IconButton
      onClick={() => setBoardState(boardState.toStart())}
      icon={FiChevronsLeft} aria-label="to start"
      size={system.buttonSize}
      variant="ghost"
      isDisabled={boardState.isStart}
    />
    <IconButton
      onClick={() => setBoardState(boardState.backward())}
      icon={FiChevronLeft} aria-label="backward"
      size={system.buttonSize}
      variant="ghost"
      isDisabled={boardState.isStart}
    />
    <Button
      width={6} // do not resize according to text
      size={system.buttonSize}
      variant="ghost" fontFamily="Noto Serif" fontWeight="normal"
      isDisabled={true}
    >
      {boardState.cursor}
    </Button>
    <IconButton
      onClick={() => setBoardState(boardState.forward())}
      icon={FiChevronRight} aria-label="forward"
      size={system.buttonSize}
      variant="ghost"
      isDisabled={boardState.isLast}
    />
    <IconButton
      onClick={() => setBoardState(boardState.toLast())}
      icon={FiChevronsRight} aria-label="to last"
      size={system.buttonSize}
      variant="ghost"
      isDisabled={boardState.isLast}
    />
  </Flex>
}

export default Default
