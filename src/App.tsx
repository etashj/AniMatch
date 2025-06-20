import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div id='header' class='flex flex-row flex-nowrap justify-between'>
        <h1 class="font-header font-bold text-2xl lg:text-4xl">AniMatch</h1>
        <div id='btnCont' class="font-sans flex flex-row flow-nowrap justify-left">
          <button class='text-zinc-200 bg-[#1D2126] px-4 rounded-xl' onClick={() => setCount((count) => count + 1)}>
            <div class='flex gap-2 flex-row flex-nowrap justify-between items-center'>
              <p class='align-middle'>Sign in with AniList</p>
              <img class='h-8 w-8 object-cover' src='src/assets/anilist.svg'></img>
            </div>
          </button>
          <button class='bg-[#1D2126] px-1 mx-2 rounded-xl' onClick={() => setCount((count) => count + 1)}>
            <div class='flex gap-2 flex-row flex-nowrap justify-between items-center'>
              <img class='h-8 w-8 object-cover' src='src/assets/settings.svg'></img>
            </div>
          </button>
        </div>
      </div>
    </>
  )
}

export default App
