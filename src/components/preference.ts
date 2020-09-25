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
