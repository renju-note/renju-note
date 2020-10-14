import {
  Button, ButtonProps, Flex, IconButton,
  Popover, PopoverArrow, PopoverContent, PopoverTrigger
} from '@chakra-ui/core'
import React, { FC, useContext } from 'react'
import {
  FiChevronLeft, FiChevronRight, FiChevronsLeft, FiChevronsRight,
  FiLoader, FiShare, FiX
} from 'react-icons/fi'
import { AppState } from '../appState'
import { SystemContext } from '../system'
import PreferencePopover from './PreferencePopover'

type DefaultProps = {
  state: AppState
  setAppState: (s: AppState) => void
}

const Default: FC<DefaultProps> = ({
  state,
  setAppState,
}) => {
  const system = useContext(SystemContext)
  return <Flex width={system.W} justifyContent="space-around" alignItems="center">
    <PreferencePopover
      buttonSize={system.buttonSize}
    />
    <ResetPopover
      state={state}
      setAppState={setAppState}
      buttonSize={system.buttonSize}
    />
    <Flex justifyContent="center" alignItems="center">
      <IconButton
        onClick={() => setAppState(state.toStart())}
        icon={FiChevronsLeft} aria-label="to start"
        size={system.buttonSize}
        variant="ghost"
        isDisabled={state.isStart}
      />
      <IconButton
        onClick={() => setAppState(state.backward())}
        icon={FiChevronLeft} aria-label="backward"
        size={system.buttonSize}
        variant="ghost"
        isDisabled={state.isStart}
      />
      <Button
        width={6} // do not resize according to text
        size={system.buttonSize}
        variant="ghost" fontFamily="Noto Serif" fontWeight="normal"
        isDisabled={true}
      >
        {state.cursor}
      </Button>
      <IconButton
        onClick={() => setAppState(state.forward())}
        icon={FiChevronRight} aria-label="forward"
        size={system.buttonSize}
        variant="ghost"
        isDisabled={state.isLast}
      />
      <IconButton
        onClick={() => setAppState(state.toLast())}
        icon={FiChevronsRight} aria-label="to last"
        size={system.buttonSize}
        variant="ghost"
        isDisabled={state.isLast}
      />
    </Flex>
    <IconButton
      onClick={() => setAppState(state.undo())}
      icon={FiX} aria-label="undo"
      size={system.buttonSize}
      variant="ghost"
      isDisabled={!state.canUndo}
    />
    <IconButton
      icon={FiShare} aria-label="share"
      size={system.buttonSize}
      variant="ghost"
      isDisabled={true}
    />
  </Flex>
}

type ResetPopoverProps = {
  state: AppState
  setAppState: (s: AppState) => void
  buttonSize: ButtonProps['size']
}

const ResetPopover: FC<ResetPopoverProps> = ({
  state,
  setAppState,
  buttonSize,
}) => {
  return (
    <Popover
      placement="bottom"
    >
      {
        ({ onClose }) => (
          <>
            <PopoverTrigger>
              <IconButton
                icon={FiLoader} aria-label="reset"
                size={buttonSize}
                variant="ghost"
                isDisabled={!state.canReset}
              />
            </PopoverTrigger>
            <PopoverContent
              zIndex={4}
              width={16}
            >
              <PopoverArrow />
              <Button
                as="button"
                size="sm"
                variant="ghost"
                variantColor="red"
                fontFamily="Noto Sans" fontWeight="normal"
                onClick={() => {
                  setAppState(state.reset())
                  if (onClose) onClose()
                }}
              >
                RESET
              </Button>
            </PopoverContent>
          </>
        )
      }
    </Popover>
  )
}

export default Default
