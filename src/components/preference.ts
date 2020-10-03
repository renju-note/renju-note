export const preferenceItems = [
  'showIndices',
  'showOrders',
  'emphasizeLastMove',
  'showForbiddens',
  'showPropertyRows',
  'showPropertyEyes',
] as const
export type PreferenceItem = typeof preferenceItems[number]

export type Preference = Record<PreferenceItem, boolean>

export const initialPreference = {
  showIndices: false,
  showOrders: false,
  emphasizeLastMove: false,
  showForbiddens: false,
  showPropertyRows: false,
  showPropertyEyes: false,
}
