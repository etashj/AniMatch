import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Settings from './settingsModal.tsx'
import { Theme } from './settingsModal.tsx'

function App() {
  const [settingsVisible, setVisible] = useState(false)
  const [theme, setTheme] = useState(Theme.System);
  const [hideMature, setMature] = useState( true );
  const [hideEcchi, setEcchi] = useState( true );  

  function toggleMature() {
    setMature(!hideMature); 
    localStorage.setItem('hideMature', !hideMature); 
  }
  function toggleEcchi() {
    setEcchi(!hideEcchi); 
    localStorage.setItem('hideEcchi', !hideEcchi); 
  }

  function applyTheme( t : Theme ) {
    setTheme(t); 
    localStorage.setItem("theme", t);
    const root = document.documentElement;
    if (t==Theme.Light) {
      root.classList.remove("dark");
    } else if (t==Theme.Dark) {
      root.classList.add("dark");
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.classList.toggle('dark', prefersDark);
    }
  }
  
  const darkThemeMq = window.matchMedia("(prefers-color-scheme: dark)");
  darkThemeMq.addListener(e => {
    const root = document.documentElement;
    if (theme==Theme.System) {
      if (e.matches) root.classList.add('dark');
      else root.classList.remove('dark');
    }
  });

  useEffect(() => {
    const saved = localStorage.getItem('theme'); 
    if (saved) {
      applyTheme(Theme[saved]);
    } else {
      applyTheme(Theme.Dark); // or 'system' as your default
    }

    if (localStorage.getItem('hideMature') != null) {
      setMature(localStorage.getItem('hideMature').toLowerCase()==='true' ); 
    }
    if (localStorage.getItem('hideEcchi') != null) {
      setEcchi(localStorage.getItem('hideEcchi').toLowerCase()==='true' ); 
    }
  }, []);

  return (
    <>
      <div id='mainCont' className={`${settingsVisible? 'blur-xs' : ''} transition duration-300`}>
        <div id='header' className='flex flex-row flex-nowrap justify-between'>
          <h1 className="font-header font-bold text-4xl text-[#1D2126] dark:text-zinc-200">AniMatch</h1>
          <div id='btnCont' className="font-sans flex flex-row flow-nowrap justify-left">
            <button className='text-zinc-200 bg-[#1D2126] dark:bg-[#24272a] px-4 rounded-2xl sm:rounded-2xl hover:shadow-xl/20 dark:hover:shadow-indigo-500 transition duration-300 active:shadow-md/40'>
              <div className='flex gap-2 flex-row flex-nowrap justify-between items-center'>
                <p className='font-bold align-middle hidden sm:inline'>Sign in with AniList</p>
                <img className='h-8 w-8 object-cover' src='src/assets/anilist.svg'></img>
              </div>
            </button>
            <button className='bg-indigo-500 px-1 mx-2 rounded-2xl sm:rounded-2xl hover:shadow-xl/20 transition duration-300 active:shadow-md/40 dark:hover:shadow-indigo-500 ' onClick={() => setTimeout(() => {setVisible(true);}, 100)}>
              <div className='flex gap-2 flex-row flex-nowrap justify-between items-center'>
                <img className='h-8 w-8 object-cover' src='src/assets/settings.svg'></img>
              </div>
            </button>
          </div>
        </div>
      </div>
      <Settings visible={settingsVisible} onClose={() => setTimeout(() => {setVisible(false);}, 100)} theme={theme} setTheme={(theme: Theme) => {applyTheme(theme);}} hideMature={hideMature} hideEcchi={hideEcchi} toggleMature={toggleMature} toggleEcchi={toggleEcchi}/>
    </>
  )
}

export default App
