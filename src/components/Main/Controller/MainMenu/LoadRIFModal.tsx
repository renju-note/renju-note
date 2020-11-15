import {
  Button,
  Flex,
  Heading,
  Input,
  Link,
  ListItem,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Progress,
  Stack,
  UnorderedList,
  useDisclosure,
} from '@chakra-ui/react'
import React, { FC, useState } from 'react'
import { AnalyzedDatabase, RIFDatabase } from '../../../../database'

type DefaultProps = {
  isOpen: boolean
  onClose: () => void
}

const Default: FC<DefaultProps> = ({ isOpen, onClose }) => {
  const [fileIsInvalid, setFileIsInvalid] = useState<boolean>(false)
  const [parsingProgress, setParsingProgress] = useState<number>(0)
  const [analyzingProgress, setAnalyzingProgress] = useState<number>(0)
  const [completed, setCompleted] = useState<boolean>(false)
  const analyzingDisclosure = useDisclosure()

  const onLoadFile = async () => {
    const elem = document.getElementById('rif-file') as HTMLInputElement
    const files = elem?.files
    if (files === null || files.length === 0) {
      setFileIsInvalid(true)
      return
    }

    onClose()
    analyzingDisclosure.onOpen()

    RIFDatabase.reset()
    const rifDB = new RIFDatabase()
    await rifDB.loadFromFile(files[0], p => setParsingProgress(p))

    AnalyzedDatabase.reset()
    const analyzedDB = new AnalyzedDatabase()
    await analyzedDB.loadFromRIFDatabase(p => setAnalyzingProgress(p))

    setCompleted(true)
  }
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader as="h1">Load .rif file</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex alignItems="center" mb="1rem">
              <Input
                id="rif-file"
                type="file"
                isInvalid={fileIsInvalid}
                onChange={() => setFileIsInvalid(false)}
                mr="1rem"
              />
              <Button onClick={onLoadFile}>Load</Button>
            </Flex>
            <Heading as="h2" size="sm" mb="1rem">
              Remarks
            </Heading>
            <UnorderedList>
              <ListItem>
                <b>EXPERIMENTAL</b>: Currently this feature is in quite an early stage and under
                heavy development. There is no guarantee for its behaviour on your device.
              </ListItem>
              <ListItem>
                It seems that the feature works only on PC with the latest version of either Chrome
                or Firefox, but does not on Mobile devices, also does not with other browsers
                including Safari and IE. This is probably due to problems around XML parsers they
                provide and any solution is not found yet.
              </ListItem>
              <ListItem>
                The data loaded from file will be stored only in your browser&apos;s storage and{' '}
                <b>never</b> uploaded to anywhere. Keep in mind that, once the storage was resetted
                by an action like deleting histories, your data will be also deleted as well.
              </ListItem>
              <ListItem>
                RIF&apos;s official dataset can be downloaded from{' '}
                <Link href="http://www.renju.net/downloads/games.php" color="teal.500" isExternal>
                  RenjuNet
                </Link>
                . Be sure to follow rules presented on the site.
              </ListItem>
            </UnorderedList>
          </ModalBody>
          <ModalFooter></ModalFooter>
        </ModalContent>
      </Modal>

      <Modal
        isOpen={analyzingDisclosure.isOpen}
        onClose={analyzingDisclosure.onClose}
        isCentered
        closeOnOverlayClick={false}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader as="h1">{completed ? 'Completed!' : 'Loading...'}</ModalHeader>
          <ModalBody>
            <Stack spacing="1rem">
              <Heading as="h2" size="sm" mb="1rem">
                Parsing content...
              </Heading>
              <Progress value={parsingProgress} />
              <Heading as="h2" size="sm" mb="1rem">
                Analyzing games...
              </Heading>
              <Progress value={analyzingProgress} />
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Button onClick={analyzingDisclosure.onClose} isDisabled={!completed}>
              OK
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default Default
