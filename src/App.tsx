import PlatformDownloader from './components/PlatformDownloader'
import React from 'react'
import { Analytics } from '@vercel/analytics/react';

function App() {
  return (
    <div className="App">
      <PlatformDownloader />
      <Analytics />
    </div>
  )
}

export default App