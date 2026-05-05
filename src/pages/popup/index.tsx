import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { setup } from 'twind'
import 'twind/shim'

setup()

const root = document.querySelector('#root')

if (root) {
  createRoot(root).render(<App />)
}
