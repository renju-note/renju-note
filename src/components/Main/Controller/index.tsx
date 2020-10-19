import {
  Button, ButtonProps, Flex, IconButton,
  Popover, PopoverArrow, PopoverContent, PopoverTrigger
} from '@chakra-ui/core'
import React, { FC, useContext } from 'react'
import {
  FiChevronLeft, FiChevronRight, FiChevronsLeft, FiChevronsRight,
  FiLoader, FiX
} from 'react-icons/fi'
import { AppStateContext } from '../../appState'
import { SystemContext } from '../../system'
import DownloadButton from './DownloadButton'
import PreferencePopover from './PreferencePopover'

const Default: FC = () => {
  const system = useContext(SystemContext)
  const [appState, setAppState] = useContext(AppStateContext)
  return <Flex width={system.W} justifyContent="space-around" alignItems="center">
    <PreferencePopover
      buttonSize={system.buttonSize}
    />
    <ResetPopover
      buttonSize={system.buttonSize}
    />
    <Flex justifyContent="center" alignItems="center">
      <IconButton
        onClick={() => setAppState(appState.toStart())}
        icon={FiChevronsLeft} aria-label="to start"
        size={system.buttonSize}
        variant="ghost"
        isDisabled={appState.isStart}
      />
      <IconButton
        onClick={() => setAppState(appState.backward())}
        icon={FiChevronLeft} aria-label="backward"
        size={system.buttonSize}
        variant="ghost"
        isDisabled={appState.isStart}
      />
      <Button
        width={6} // do not resize according to text
        size={system.buttonSize}
        variant="ghost" fontFamily="Noto Serif" fontWeight="normal"
        isDisabled={true}
      >
        {appState.cursor}
      </Button>
      <IconButton
        onClick={() => setAppState(appState.forward())}
        icon={FiChevronRight} aria-label="forward"
        size={system.buttonSize}
        variant="ghost"
        isDisabled={appState.isLast}
      />
      <IconButton
        onClick={() => setAppState(appState.toLast())}
        icon={FiChevronsRight} aria-label="to last"
        size={system.buttonSize}
        variant="ghost"
        isDisabled={appState.isLast}
      />
    </Flex>
    <IconButton
      onClick={() => setAppState(appState.undo())}
      icon={FiX} aria-label="undo"
      size={system.buttonSize}
      variant="ghost"
      isDisabled={!appState.canUndo}
    />
    <DownloadButton
      buttonSize={system.buttonSize}
    />
  </Flex>
}

type ResetPopoverProps = {
  buttonSize: ButtonProps['size']
}

const ResetPopover: FC<ResetPopoverProps> = ({
  buttonSize,
}) => {
  const [appState, setAppState] = useContext(AppStateContext)
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
                isDisabled={!appState.canReset}
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
                  setAppState(appState.reset())
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
