import { Button, ButtonGroup, IconButton } from '@chakra-ui/react'
import { FC } from 'react'
import { FiChevronLeft, FiChevronRight, FiChevronsLeft, FiChevronsRight } from 'react-icons/fi'

type Props = {
  page: number
  setPage: (page: number) => void
  hit: number
  pageSize: number
}

const Default: FC<Props> = ({ page, setPage, hit, pageSize }) => {
  const lastPage = ~~((hit - 1) / pageSize)
  return (
    <ButtonGroup spacing={1} size="sm" variant="ghost">
      <IconButton
        aria-label="first"
        icon={<FiChevronsLeft />}
        isDisabled={page <= 0}
        onClick={() => setPage(0)}
      />
      <IconButton
        aria-label="prev"
        icon={<FiChevronLeft />}
        isDisabled={page <= 0}
        onClick={() => setPage(Math.max(0, page - 1))}
      />
      <Button isDisabled width="8rem">
        {`${page * pageSize + 1}-${Math.min((page + 1) * pageSize, hit)} of ${hit}`}
      </Button>
      <IconButton
        aria-label="next"
        icon={<FiChevronRight />}
        isDisabled={page >= lastPage}
        onClick={() => setPage(Math.min(lastPage, page + 1))}
      />
      <IconButton
        aria-label="last"
        icon={<FiChevronsRight />}
        isDisabled={page >= lastPage}
        onClick={() => setPage(lastPage)}
      />
    </ButtonGroup>
  )
}

export default Default
