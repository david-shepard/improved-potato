import React, { useEffect, useState } from 'react'
import { type Settings, defaultSettings } from '../../utils/settings'

type ToggleProps = {
  id: string
  label: string
  checked: boolean
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const Toggle = ({ id, label, checked, onChange }: ToggleProps): JSX.Element => (
  <label htmlFor={id} className="flex items-center justify-between cursor-pointer">
    <span className="text-base">{label}</span>
    <div className="relative">
      <input type="checkbox" id={id} checked={checked} onChange={onChange} className="sr-only" />
      <div className={`w-11 h-6 rounded-full transition-colors ${checked ? 'bg-blue-600' : 'bg-gray-500'}`} />
      <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
    </div>
  </label>
)

const App = (): JSX.Element => {
  const [settings, setSettings] = useState<Settings>(defaultSettings)

  useEffect(() => {
    chrome.storage.local.get(Object.keys(defaultSettings), (result: Record<string, unknown>) => {
      setSettings({ ...defaultSettings, ...result })
    })
  }, [])

  const handleChange = (key: keyof Settings) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const updated = { ...settings, [key]: e.target.checked }
    chrome.storage.local.set(updated)
    setSettings(updated)
  }

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center bg-gray-800 text-white">
      <div className="w-full max-w-md bg-gray-700 rounded-xl p-8 shadow-lg">
        <h1 className="text-2xl font-medium mb-6">Options</h1>
        <div className="flex flex-col space-y-4">
          <Toggle
            id="formatObsidian"
            label="Format for Obsidian"
            checked={settings.isObsidianFormat}
            onChange={handleChange('isObsidianFormat')}
          />
          <Toggle
            id="doubleSpaced"
            label="Double spacing"
            checked={settings.isDoubleSpaced}
            onChange={handleChange('isDoubleSpaced')}
          />
        </div>
      </div>
    </div>
  )
}

export default App
