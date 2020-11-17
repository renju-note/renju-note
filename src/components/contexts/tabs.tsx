import React, { createContext, FC, useState } from 'react'

export type TabsContext = {
  index: number
  setIndex: (index: number) => void
}

export const TabsContext = createContext<TabsContext>({
  index: 0,
  setIndex: () => {},
})

export const TabsProvider: FC = ({ children }) => {
  const [index, setIndex] = useState<number>(0)
  return <TabsContext.Provider value={{ index, setIndex }}>{children}</TabsContext.Provider>
}
