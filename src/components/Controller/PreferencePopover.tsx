import React, { FC } from 'react'
import {
  Flex,
  IconButton,
  Switch,
  FormLabel,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverBody,
  ButtonProps,
} from '@chakra-ui/core'
import { FiToggleRight } from 'react-icons/fi'

import { Preference } from '../preference'

type DefaultProps = {
  preference: Preference,
  setPreference: (p: Preference) => void,
  buttonSize: ButtonProps['size']
}

const Default: FC<DefaultProps> = ({
  preference,
  setPreference,
  buttonSize,
}) => {
  const isAllChecked = (
    preference.showIndices &&
    preference.showOrders &&
    preference.emphasizeLastMove &&
    preference.showForbiddens &&
    preference.showPropertyRows &&
    preference.showPropertyEyes
  )
  return (
    <Popover
      placement="bottom"
    >
      <PopoverTrigger>
        <IconButton
          size={buttonSize}
          icon={FiToggleRight} aria-label="preference"
          variant="ghost"
        />
      </PopoverTrigger>
      <PopoverContent
        zIndex={4}
      >
        <PopoverArrow />
        <PopoverBody fontFamily="Noto Sans" fontWeight="normal">
          <Flex justify="space-between" align="center">
            <FormLabel htmlFor="controller-preference-all">All</FormLabel>
            <Switch
              id="controller-preference-all"
              isChecked={isAllChecked}
              onChange={() => {
                if (isAllChecked) {
                  setPreference({
                    showIndices: false,
                    showOrders: false,
                    emphasizeLastMove: false,
                    showForbiddens: false,
                    showPropertyRows: false,
                    showPropertyEyes: false,
                  })
                } else {
                  setPreference({
                    showIndices: true,
                    showOrders: true,
                    emphasizeLastMove: true,
                    showForbiddens: true,
                    showPropertyRows: true,
                    showPropertyEyes: true,
                  })
                }
              }}
            />
          </Flex>
          <Flex justify="space-between" align="center">
            <FormLabel htmlFor="controller-preference-show-indices">Line indices</FormLabel>
            <Switch
              id="controller-preference-show-indices"
              isChecked={preference.showIndices}
              onChange={() => setPreference({ ...preference, showIndices: !preference.showIndices })}
            />
          </Flex>
          <Flex justify="space-between" align="center">
            <FormLabel htmlFor="controller-preference-show-orders">Move orders</FormLabel>
            <Switch
              id="controller-preference-show-orders"
              isChecked={preference.showOrders}
              onChange={() => setPreference({ ...preference, showOrders: !preference.showOrders })}
            />
          </Flex>
          <Flex justify="space-between" align="center">
            <FormLabel htmlFor="controller-preference-emphasize-last-move">Last move</FormLabel>
            <Switch
              id="controller-preference-emphasize-last-move"
              isChecked={preference.emphasizeLastMove}
              onChange={() => setPreference({ ...preference, emphasizeLastMove: !preference.emphasizeLastMove })}
            />
          </Flex>
          <Flex justify="space-between" align="center">
            <FormLabel htmlFor="controller-preference-show-forbiddens">Forbiddens</FormLabel>
            <Switch
              id="controller-preference-show-forbiddens"
              isChecked={preference.showForbiddens}
              onChange={() => setPreference({ ...preference, showForbiddens: !preference.showForbiddens })}
            />
          </Flex>
          <Flex justify="space-between" align="center">
            <FormLabel htmlFor="controller-preference-show-property-eyes">Row eyes</FormLabel>
            <Switch id="controller-preference-show-property-eyes"
              isChecked={preference.showPropertyEyes}
              onChange={() => setPreference({ ...preference, showPropertyEyes: !preference.showPropertyEyes })}
            />
          </Flex>
          <Flex justify="space-between" align="center">
            <FormLabel htmlFor="controller-preference-show-property-rows">Row lines</FormLabel>
            <Switch
              id="controller-preference-show-property-rows"
              isChecked={preference.showPropertyRows}
              onChange={() => setPreference({ ...preference, showPropertyRows: !preference.showPropertyRows })}
            />
          </Flex>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  )
}

export default Default
