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
  Icon,
  Text,
} from '@chakra-ui/core'
import {
  FiAlertCircle,
  FiToggleRight,
  FiHash,
  FiInfo,
  FiXSquare,
  FiTarget,
  FiGitCommit,
  FiType,
} from 'react-icons/fi'
import React, { FC, useContext } from 'react'
import { PreferenceContext } from '../../contexts'
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
              id="controller-preference-show-indices"
              icon={FiHash}
              labelText="Line Indices"
              isChecked={preference.showIndices}
              onChange={() => setPreference({ ...preference, showIndices: !preference.showIndices })}
            />
          </Flex>
          <Flex justify="space-between" align="center">
            <PreferenceSwitch
              id="controller-preference-show-orders"
              icon={FiInfo}
              labelText="Move Orders"
              isChecked={preference.showOrders}
              onChange={() => setPreference({ ...preference, showOrders: !preference.showOrders })}
            />
          </Flex>
          <Flex justify="space-between" align="center">
            <PreferenceSwitch
              id="controller-preference-emphasize-last-move"
              icon={FiTarget}
              labelText="Last Move"
              isChecked={preference.emphasizeLastMove}
              onChange={() => setPreference({ ...preference, emphasizeLastMove: !preference.emphasizeLastMove })}
            />
          </Flex>
          <Flex justify="space-between" align="center">
            <PreferenceSwitch
              id="controller-preference-show-forbiddens"
              icon={FiXSquare}
              labelText="Forbidden Points"
              isChecked={preference.showForbiddens}
              onChange={() => setPreference({ ...preference, showForbiddens: !preference.showForbiddens })}
            />
          </Flex>
          <Flex justify="space-between" align="center">
            <PreferenceSwitch
              id="controller-preference-show-property-eyes"
              icon={FiAlertCircle}
              labelText="Threes and Fours Eyes"
              isChecked={preference.showPropertyEyes}
              onChange={() => setPreference({ ...preference, showPropertyEyes: !preference.showPropertyEyes })}
            />
          </Flex>
          <Flex justify="space-between" align="center">
            <PreferenceSwitch
              id="controller-preference-show-property-rows"
              icon={FiGitCommit}
              labelText="Twos and Closed-Threes Rows"
              isChecked={preference.showPropertyRows}
              onChange={() => setPreference({ ...preference, showPropertyRows: !preference.showPropertyRows })}
            />
          </Flex>
          <Flex justify="space-between" align="center">
            <PreferenceSwitch
              id="controller-preference-show-marker-alphabets"
              icon={FiType}
              labelText="Alphabets on Marker Points"
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
        <Icon size="small" as={icon}/>
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
