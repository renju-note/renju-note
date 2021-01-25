import { extendTheme } from '@chakra-ui/react'

const numericStyles = {
  '&[data-is-numeric=true]': {
    fontFamily: 'Courier Prime',
  },
}
const theme = extendTheme({
  components: {
    Table: {
      parts: ['td', 'th', 'tr'],
      sizes: {
        'rjn-info': {
          th: {
            fontSize: 'xs',
            px: 0,
            py: 1,
            lineHeight: 1.2,
          },
          td: {
            fontSize: 'md',
            px: 0,
            py: 1,
            lineHeight: 1.2,
          },
        },
      },
      variants: {
        'rjn-info': {
          th: {
            textAlign: 'center',
          },
          td: {
            textAlign: 'center',
            fontFamily: 'Noto Serif',
            ...numericStyles,
          },
        },
      },
    },
  },
})

export default theme
