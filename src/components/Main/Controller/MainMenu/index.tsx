import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  Icon,
  IconButton,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Text,
  useDisclosure,
} from '@chakra-ui/react'
import 'firebase/analytics'
import firebase from 'firebase/app'
import { FC, useContext } from 'react'
import {
  RiDownload2Line,
  RiFlaskFill,
  RiFolderChartLine,
  RiFolderForbidLine,
  RiMenuLine,
  RiQuestionLine,
} from 'react-icons/ri'
import { BoardStateContext, PreferenceContext, PreferenceOption } from '../../../contexts'
import AboutModal from './AboutModal'
import DownloadHidden, { onDownload } from './DownloadHidden'

const Default: FC = () => {
  const downloadHiddenId = 'download-hidden'
  const { boardState } = useContext(BoardStateContext)

  const advancedModeDisclosure = useDisclosure()
  const { preference, setPreference } = useContext(PreferenceContext)
  const isAdvanced = preference.has(PreferenceOption.advancedMode)
  const toggleMode = () => {
    if (isAdvanced) {
      setPreference(preference.off([PreferenceOption.advancedMode]))
    } else {
      advancedModeDisclosure.onOpen()
      setPreference(preference.on([PreferenceOption.advancedMode]))
    }
  }
  const modeIcon = isAdvanced ? RiFolderForbidLine : RiFolderChartLine

  const aboutDisclosure = useDisclosure()
  return (
    <>
      <Menu autoSelect={false} placement="top-start">
        <MenuButton as={IconButton} icon={<RiMenuLine />} />
        <MenuList>
          <MenuItem
            onClick={() => {
              onDownload(downloadHiddenId)
              firebase.analytics().logEvent('download_picture', { code: boardState.encode() })
            }}
          >
            <Icon boxSize="small" as={RiDownload2Line} />
            <Text ml={2}>Download Picture</Text>
          </MenuItem>
          <MenuDivider />
          <MenuItem onClick={toggleMode}>
            <Icon boxSize="small" as={modeIcon} />
            <Text ml={2} mr={1}>
              {isAdvanced ? 'Basic Mode' : 'Advanced Mode'}
            </Text>
            {!isAdvanced && <Icon boxSize="small" as={RiFlaskFill} />}
          </MenuItem>
          <MenuDivider />
          <MenuItem onClick={aboutDisclosure.onOpen}>
            <Icon boxSize="small" as={RiQuestionLine} />
            <Text ml={2}>About Renju Note</Text>
          </MenuItem>
        </MenuList>
      </Menu>
      <DownloadHidden id={downloadHiddenId} />
      <AdvancedModeAlertDialog
        isOpen={advancedModeDisclosure.isOpen}
        onClose={advancedModeDisclosure.onClose}
      />
      <AboutModal isOpen={aboutDisclosure.isOpen} onClose={aboutDisclosure.onClose} />
    </>
  )
}

const AdvancedModeAlertDialog: FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  return (
    <AlertDialog isOpen={isOpen} onClose={onClose} leastDestructiveRef={undefined} isCentered>
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader as="h1">Now you&apos;re in advanced mode!</AlertDialogHeader>
          <AlertDialogBody>
            All features in advanced mode are <b>EXPERIMENTAL</b>. There is no guarantee for their
            behaviour on your device.
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button colorScheme="blue" onClick={onClose}>
              OK
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  )
}

export default Default
