import React, { FC } from 'react'
import {
  Flex,
  Button,
  IconButton,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
} from '@chakra-ui/core'
import {
  FiChevronLeft,
  FiChevronRight,
  FiChevronsLeft,
  FiChevronsRight,
  FiX,
  FiShare,
  FiLoader,
} from 'react-icons/fi'

import { State } from '../../state'
import { Preference } from '../preference'
import PreferencePopover from './PreferencePopover'

type DefaultProps = {
  state: State
  setState: (s: State) => void
  preference: Preference,
  setPreference: (p: Preference) => void,
}

const Default: FC<DefaultProps> = ({
  state,
  setState,
  preference,
  setPreference,
}) => {
  return <Flex width={640} justifyContent="space-around" alignItems="center">
    <PreferencePopover
      preference={preference}
      setPreference={setPreference}
    />
    <ResetPopover
      state={state}
      setState={setState}
    />
    <Flex justifyContent="center" alignItems="center">
      <IconButton
        onClick={() => setState(state.toStart())}
        icon={FiChevronsLeft} aria-label="to start"
        variant="ghost"
        isDisabled={state.isStart}
      />
      <IconButton
        onClick={() => setState(state.backward())}
        icon={FiChevronLeft} aria-label="backward"
        variant="ghost"
        isDisabled={state.isStart}
      />
      <Button width={6}
        variant="ghost" fontFamily="Noto Serif" fontWeight="normal"
        isDisabled={true}
      >
        {state.cursor}
      </Button>
      <IconButton
        onClick={() => setState(state.forward())}
        icon={FiChevronRight} aria-label="forward"
        variant="ghost"
        isDisabled={state.isLast}
      />
      <IconButton
        onClick={() => setState(state.toLast())}
        icon={FiChevronsRight} aria-label="to last"
        variant="ghost"
        isDisabled={state.isLast}
      />
    </Flex>
    <IconButton
      onClick={() => setState(state.undo())}
      icon={FiX} aria-label="undo"
      variant="ghost"
      isDisabled={!state.canUndo}
    />
    <IconButton
      icon={FiShare} aria-label="share"
      variant="ghost"
    />
  </Flex>
}

type ResetPopoverProps = {
  state: State
  setState: (s: State) => void
}

const ResetPopover: FC<ResetPopoverProps> = ({
  state,
  setState,
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
                  setState(state.reset())
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
