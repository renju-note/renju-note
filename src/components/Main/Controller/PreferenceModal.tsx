import {
  Flex,
  FormLabel,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Switch,
} from '@chakra-ui/core'
import React, { FC, useContext } from 'react'
import { PreferenceContext } from '../../preference'

type DefaultProps = {
  isOpen: boolean
  onClose: () => void
}

const Default: FC<DefaultProps> = ({
  isOpen,
  onClose,
}) => {
  const [preference, setPreference] = useContext(PreferenceContext)
  const isCheckedAll = (
    preference.showIndices &&
    preference.showOrders &&
    preference.emphasizeLastMove &&
    preference.showForbiddens &&
    preference.showPropertyRows &&
    preference.showPropertyEyes
  )
  const onChangedAll = () => {
    if (isCheckedAll) {
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
  }
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Preference</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Flex justify="space-between" align="center">
            <PreferenceSwitch
              id="controller-preference-all"
              labelText="ALL"
              isChecked={isCheckedAll}
              onChange={onChangedAll}
            />
          </Flex>
          <Flex justify="space-between" align="center">
            <PreferenceSwitch
              id="controller-preference-show-indices"
              labelText="Line indices"
              isChecked={preference.showIndices}
              onChange={() => setPreference({ ...preference, showIndices: !preference.showIndices })}
            />
          </Flex>
          <Flex justify="space-between" align="center">
            <PreferenceSwitch
              id="controller-preference-show-orders"
              labelText="Move orders"
              isChecked={preference.showOrders}
              onChange={() => setPreference({ ...preference, showOrders: !preference.showOrders })}
            />
          </Flex>
          <Flex justify="space-between" align="center">
            <PreferenceSwitch
              id="controller-preference-emphasize-last-move"
              labelText="Last move"
              isChecked={preference.emphasizeLastMove}
              onChange={() => setPreference({ ...preference, emphasizeLastMove: !preference.emphasizeLastMove })}
            />
          </Flex>
          <Flex justify="space-between" align="center">
            <PreferenceSwitch
              id="controller-preference-show-forbiddens"
              labelText="Forbiddens"
              isChecked={preference.showForbiddens}
              onChange={() => setPreference({ ...preference, showForbiddens: !preference.showForbiddens })}
            />
          </Flex>
          <Flex justify="space-between" align="center">
            <PreferenceSwitch
              id="controller-preference-show-property-eyes"
              labelText="Threes and fours eyes"
              isChecked={preference.showPropertyEyes}
              onChange={() => setPreference({ ...preference, showPropertyEyes: !preference.showPropertyEyes })}
            />
          </Flex>
          <Flex justify="space-between" align="center">
            <PreferenceSwitch
              id="controller-preference-show-property-rows"
              labelText="Twos and closed threes rows"
              isChecked={preference.showPropertyRows}
              onChange={() => setPreference({ ...preference, showPropertyRows: !preference.showPropertyRows })}
            />
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

type PreferenceSwitchProps = {
  id: string
  labelText: string
  isChecked: boolean
  onChange: () => void
}

const PreferenceSwitch: FC<PreferenceSwitchProps> = ({
  id,
  labelText,
  isChecked,
  onChange,
}) => {
  return <>
    <FormLabel htmlFor={id}>{labelText}</FormLabel>
    <Switch
      id={id}
      isChecked={isChecked}
      onChange={onChange}
    />
  </>
}

export default Default
