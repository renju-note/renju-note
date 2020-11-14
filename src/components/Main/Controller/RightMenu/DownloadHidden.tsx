import { Box } from '@chakra-ui/react'
import React, { FC } from 'react'
import Board from '../../../Board'
import { System, SystemContext } from '../../../contexts'

type DefaultProps = {
  id: string
}

const Default: FC<DefaultProps> = ({ id }) => {
  return (
    <Box hidden>
      <SystemContext.Provider value={new System(640)}>
        <Board id={id} />
      </SystemContext.Provider>
    </Box>
  )
}

export const onDownload = (id: string) => {
  const svgElem = (document.getElementById(id)! as unknown) as SVGSVGElement
  const svgData = new XMLSerializer().serializeToString(svgElem)
  const imageElem = new Image()
  imageElem.src =
    'data:image/svg+xml;charset=utf-8;base64,' + btoa(unescape(encodeURIComponent(svgData)))
  const canvasElem = document.createElement('canvas')
  canvasElem.width = svgElem.width.baseVal.value
  canvasElem.height = svgElem.height.baseVal.value
  const ctx = canvasElem.getContext('2d')!
  ctx.fillStyle = 'white'
  ctx.fillRect(0, 0, canvasElem.width, canvasElem.height)
  imageElem.onload = () => {
    ctx.drawImage(imageElem, 0, 0)
    const a = document.createElement('a') as HTMLAnchorElement
    a.href = canvasElem.toDataURL('image/png')
    a.setAttribute('download', 'renju-note.png')
    a.dispatchEvent(new MouseEvent('click'))
  }
}

export default Default
