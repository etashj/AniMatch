export const Theme = {
  Light : 'Light',
  Dark : 'Dark',
  System : 'System',
} as const

export type Theme = typeof Theme[keyof typeof Theme]
export default Theme;
