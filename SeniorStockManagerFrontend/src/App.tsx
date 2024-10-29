import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <header className="flex flex-col items-center justify-center py-6">
        <img src={reactLogo} className="w-20 h-20" alt="React logo" />
        <img src={viteLogo} className="w-16 h-16 mt-2" alt="Vite logo" />
        <h1 className="mt-4 text-4xl font-bold text-blue-600">
          Hello world!
        </h1>
        <button 
          onClick={() => setCount(count + 1)}
          className="px-4 py-2 mt-4 text-white bg-blue-500 rounded hover:bg-blue-700 focus:outline-none"
        >
          Count: {count}
        </button>
      </header>
    </div>
  )
}

export default App
