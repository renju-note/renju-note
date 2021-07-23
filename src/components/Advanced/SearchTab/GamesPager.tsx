import { Button, ButtonGroup, IconButton } from '@chakra-ui/react'
import { FC, useContext } from 'react'
import { FiChevronLeft, FiChevronRight, FiChevronsLeft, FiChevronsRight } from 'react-icons/fi'
import { PagerState } from '../../../state'
import { AdvancedContext } from '../../contexts'

const Default: FC = () => {
  const { searchState, setSearchState } = useContext(AdvancedContext)
  const [pager, setPager] = [
    searchState.pager,
    (p: PagerState) => setSearchState(searchState.setPager(p)),
  ]
  return (
    <ButtonGroup spacing={1} size="sm" variant="ghost">
      <IconButton
        aria-label="first"
        icon={<FiChevronsLeft />}
        isDisabled={pager.isFirst}
        onClick={() => setPager(pager.toFirst())}
      />
      <IconButton
        aria-label="prev"
        icon={<FiChevronLeft />}
        isDisabled={pager.isFirst}
        onClick={() => setPager(pager.prev())}
      />
      <Button isDisabled width="8rem">
        {pager.toString()}
      </Button>
      <IconButton
        aria-label="next"
        icon={<FiChevronRight />}
        isDisabled={pager.isLast}
        onClick={() => setPager(pager.next())}
      />
      <IconButton
        aria-label="last"
        icon={<FiChevronsRight />}
        isDisabled={pager.isLast}
        onClick={() => setPager(pager.toLast())}
      />
    </ButtonGroup>
  )
}

export default Default
