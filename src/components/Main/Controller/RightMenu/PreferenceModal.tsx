import {
  Flex,
  FormLabel,
  Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay,
  Switch,
  Icon,
  Text,
} from '@chakra-ui/core'
import { FiToggleRight } from 'react-icons/fi'
import {
  RiFocus2Fill,
  RiCloseLine,
  RiStopMiniFill,
  RiGitCommitFill,
  RiGridLine,
  RiInformationLine,
  RiAtLine,
} from 'react-icons/ri'
import React, { FC, useContext } from 'react'
import { PreferenceContext } from '../../../contexts'
import { IconType } from 'react-icons'

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
    preference.showPropertyEyes &&
    preference.showMarkerAlphabets
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
        showMarkerAlphabets: false,
      })
    } else {
      setPreference({
        showIndices: true,
        showOrders: true,
        emphasizeLastMove: true,
        showForbiddens: true,
        showPropertyRows: true,
        showPropertyEyes: true,
        showMarkerAlphabets: true,
      })
    }
  }
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Preferences</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Flex justify="space-between" align="center" mb={4}>
            <PreferenceSwitch
              id="controller-preference-all"
              icon={FiToggleRight}
              labelText="All"
              isChecked={isCheckedAll}
              onChange={onChangedAll}
            />
          </Flex>
          <Flex justify="space-between" align="center">
            <PreferenceSwitch
              id="controller-preference-show-forbiddens"
              icon={RiCloseLine}
              labelText="Forbidden Points"
              isChecked={preference.showForbiddens}
              onChange={() => setPreference({ ...preference, showForbiddens: !preference.showForbiddens })}
            />
          </Flex>
          <Flex justify="space-between" align="center">
            <PreferenceSwitch
              id="controller-preference-show-property-eyes"
              icon={() => <RiStopMiniFill style={{ transform: 'rotate(45deg)' }} />}
              labelText="Threes and Fours"
              isChecked={preference.showPropertyEyes}
              onChange={() => setPreference({ ...preference, showPropertyEyes: !preference.showPropertyEyes })}
            />
          </Flex>
          <Flex justify="space-between" align="center" mb={4}>
            <PreferenceSwitch
              id="controller-preference-show-property-rows"
              icon={RiGitCommitFill}
              labelText="Potential Rows"
              isChecked={preference.showPropertyRows}
              onChange={() => setPreference({ ...preference, showPropertyRows: !preference.showPropertyRows })}
            />
          </Flex>
          <Flex justify="space-between" align="center">
            <PreferenceSwitch
              id="controller-preference-show-indices"
              icon={RiGridLine}
              labelText="Line Indices"
              isChecked={preference.showIndices}
              onChange={() => setPreference({ ...preference, showIndices: !preference.showIndices })}
            />
          </Flex>
          <Flex justify="space-between" align="center">
            <PreferenceSwitch
              id="controller-preference-emphasize-last-move"
              icon={RiFocus2Fill}
              labelText="Last Move"
              isChecked={preference.emphasizeLastMove}
              onChange={() => setPreference({ ...preference, emphasizeLastMove: !preference.emphasizeLastMove })}
            />
          </Flex>
          <Flex justify="space-between" align="center">
            <PreferenceSwitch
              id="controller-preference-show-orders"
              icon={RiInformationLine}
              labelText="Orders on Moves"
              isChecked={preference.showOrders}
              onChange={() => setPreference({ ...preference, showOrders: !preference.showOrders })}
            />
          </Flex>
          <Flex justify="space-between" align="center">
            <PreferenceSwitch
              id="controller-preference-show-marker-alphabets"
              icon={RiAtLine}
              labelText="Alphabets on Marked Points"
              isChecked={preference.showMarkerAlphabets}
              onChange={() => setPreference({ ...preference, showMarkerAlphabets: !preference.showMarkerAlphabets })}
            />
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

type PreferenceSwitchProps = {
  id: string
  icon: IconType
  labelText: string
  isChecked: boolean
  onChange: () => void
}

const PreferenceSwitch: FC<PreferenceSwitchProps> = ({
  id,
  icon,
  labelText,
  isChecked,
  onChange,
}) => {
  return <>
    <FormLabel htmlFor={id}>
      <Flex alignItems="center">
        <Icon size="small" as={icon} />
        <Text ml={2} >{labelText}</Text>
      </Flex>
    </FormLabel>
    <Switch
      id={id}
      isChecked={isChecked}
      onChange={onChange}
    />
  </>
}

export default Default
