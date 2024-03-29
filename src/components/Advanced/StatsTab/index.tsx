import { Stack, Text } from '@chakra-ui/react'
import { FC, useContext } from 'react'
import { AdvancedContext } from '../../contexts'
import SearchController from '../common/SearchController'
import Stats from './Stats'

const Default: FC = () => {
  const { searchResultState } = useContext(AdvancedContext)
  return (
    <Stack width="100%" align="center">
      <SearchController />
      {searchResultState.error && (
        <Text color="gray.600" py="1rem">
          {searchResultState.error}
        </Text>
      )}
      {searchResultState.gameIds.length > 0 && <Stats />}
    </Stack>
  )
}

export default Default
