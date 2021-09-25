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
  MenuGroup,
  MenuItem,
  MenuList,
  Text,
  useClipboard,
  useDisclosure,
  useToast,
} from '@chakra-ui/react'
import { FC, useContext } from 'react'
import {
  RiClipboardLine,
  RiDownload2Line,
  RiFlaskFill,
  RiFolderChartLine,
  RiFolderForbidLine,
  RiMenuLine,
  RiQuestionLine,
} from 'react-icons/ri'
import { encodePoints } from '../../../../rule'
import { BasicContext, PreferenceContext, PreferenceOption } from '../../../contexts'
import AboutModal from './AboutModal'
import DownloadHidden, { onDownload } from './DownloadHidden'

const Default: FC = () => {
  const toast = useToast()

  // Copy Moves to Clipboard
  const { boardState } = useContext(BasicContext)
  const code = encodePoints(boardState.game.current.moves, ',')
  const { onCopy, value } = useClipboard(code)
  const onCopyMovesToClipboard = () => {
    if (!value) return
    onCopy()
    toast({
      title: 'Copied.',
      description: `Paste them as you need.`,
      status: 'success',
      duration: 5000,
      isClosable: true,
    })
  }

  // Download Board Picture
  const downloadHiddenId = 'download-hidden'
  const onDownloadBoardPicture = () => {
    onDownload(downloadHiddenId)
    toast({
      title: 'Downloaded.',
      description: "Check your browser's status.",
      status: 'success',
      duration: 5000,
      isClosable: true,
    })
  }

  // Advanced Mode
  const advancedModeDisclosure = useDisclosure()
  const { preference, setPreference } = useContext(PreferenceContext)
  const isAdvanced = preference.has(PreferenceOption.advancedMode)
  const modeIcon = isAdvanced ? RiFolderForbidLine : RiFolderChartLine
  const toggleMode = () => {
    if (isAdvanced) {
      setPreference(preference.off([PreferenceOption.advancedMode]))
    } else {
      advancedModeDisclosure.onOpen()
      setPreference(preference.on([PreferenceOption.advancedMode]))
    }
  }

  const aboutDisclosure = useDisclosure()
  return (
    <>
      <Menu autoSelect={false} placement="top-start">
        <MenuButton as={IconButton} icon={<RiMenuLine />} />
        <MenuList>
          <MenuGroup title="Actions">
            <MenuItem onClick={onCopyMovesToClipboard}>
              <Icon boxSize="small" as={RiClipboardLine} />
              <Text ml={2}>Copy Moves to Clipboard</Text>
            </MenuItem>
            <MenuItem onClick={onDownloadBoardPicture}>
              <Icon boxSize="small" as={RiDownload2Line} />
              <Text ml={2}>Download Board Picture</Text>
            </MenuItem>
          </MenuGroup>
          <MenuGroup title="Advanced">
            <MenuItem onClick={toggleMode}>
              <Icon boxSize="small" as={modeIcon} />
              <Text ml={2} mr={1}>
                {isAdvanced ? 'Basic Mode' : 'Advanced Mode'}
              </Text>
              {!isAdvanced && <Icon boxSize="small" as={RiFlaskFill} />}
            </MenuItem>
          </MenuGroup>
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
