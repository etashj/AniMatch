import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Settings from './settingsModal.tsx'

function App() {
  const [count, setCount] = useState(0)
  const [settingsVisible, setVisible] = useState(false)

  return (
    <>
      <div id='mainCont' className={`${settingsVisible? 'blur-xs' : ''} transition duration-300`}>
        <div id='header' className='flex flex-row flex-nowrap justify-between'>
          <h1 className="font-header font-bold text-4xl ">AniMatch</h1>
          <div id='btnCont' className="font-sans flex flex-row flow-nowrap justify-left">
            <button className='text-zinc-200 bg-[#1D2126] px-4 rounded-2xl sm:rounded-2xl hover:shadow-xl/20 transition duration-300 active:shadow-md/40' onClick={() => setCount((count) => count + 1)}>
              <div className='flex gap-2 flex-row flex-nowrap justify-between items-center'>
                <p className='font-bold align-middle hidden sm:inline'>Sign in with AniList</p>
                <img className='h-8 w-8 object-cover' src='src/assets/anilist.svg'></img>
              </div>
            </button>
            <button className='bg-[#1D2126] px-1 mx-2 rounded-2xl sm:rounded-2xl hover:shadow-xl/20 transition duration-300 active:shadow-md/40' onClick={() => setTimeout(() => {setVisible(true);}, 100)}>
              <div className='flex gap-2 flex-row flex-nowrap justify-between items-center'>
                <img className='h-8 w-8 object-cover' src='src/assets/settings.svg'></img>
              </div>
            </button>
          </div>
        </div>
      </div>
      <Settings visible={settingsVisible} onClose={() => setTimeout(() => {setVisible(false);}, 100)}/>
    </>
  )
}

export default App
