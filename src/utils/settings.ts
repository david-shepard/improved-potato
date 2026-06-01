import 'webextension-polyfill'

export type Settings = {
  isObsidianFormat: boolean
  isDoubleSpaced: boolean
}

export const defaultSettings: Settings = {
  isObsidianFormat: false,
  isDoubleSpaced: false,
}

export const loadSettings = async (): Promise<Settings> => {
  const result = await browser.storage.local.get(Object.keys(defaultSettings))
  return { ...defaultSettings, ...result } as Settings
}
