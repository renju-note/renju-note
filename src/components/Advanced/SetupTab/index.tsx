import {
  Box,
  Button,
  Heading,
  Input,
  InputGroup,
  InputLeftAddon,
  Link,
  ListItem,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Progress,
  Stack,
  UnorderedList,
  useDisclosure,
} from '@chakra-ui/react'
import { FC, useState } from 'react'
import { RiFileLine } from 'react-icons/ri'
import { AnalyzedDatabase, RIFDatabase } from '../../../database'

const Default: FC = () => {
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
      <Stack>
        <Heading as="h2" size="sm">
          Load RIF database
        </Heading>
        <Stack isInline>
          <InputGroup size="sm">
            <InputLeftAddon width="5rem">
              <RiFileLine /> &nbsp; .rif
            </InputLeftAddon>
            <Input
              id="rif-file"
              type="file"
              isInvalid={fileIsInvalid}
              onChange={() => setFileIsInvalid(false)}
            />
          </InputGroup>
          <Button size="sm" colorScheme="blue" onClick={onLoadFile}>
            Load
          </Button>
        </Stack>
        <Heading as="h3" size="sm">
          Remarks
        </Heading>
        <Box>
          <UnorderedList>
            <ListItem>
              The data loaded from file will be stored only in your browser&apos;s storage and{' '}
              <b>never</b> uploaded to anywhere. Keep in mind that, once the storage was resetted by
              an action like deleting histories, your data will be also deleted as well.
            </ListItem>
            <ListItem>
              RIF&apos;s official dataset can be downloaded from{' '}
              <Link href="//www.renju.net/game/" color="teal.500" isExternal>
                RenjuNet (XML format)
              </Link>
              . Be sure to follow rules presented on the site.
            </ListItem>
          </UnorderedList>
        </Box>
      </Stack>
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
            <Button onClick={() => window.location.reload()} isDisabled={!completed}>
              Reload App
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default Default
