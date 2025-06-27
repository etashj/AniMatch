import { useState, useEffect, useRef } from 'react';
import { Switch } from '@headlessui/react';
import './App.css';
import Settings from './settingsModal.tsx';
import { Theme } from './settingsModal.tsx';
import Card from './Card.tsx';
import { motion } from "motion/react"
import SettingsIcon from './assets/settings.svg';
import AniListLogo from './assets/anilist.svg';

function App() {
  const [settingsVisible, setVisible] = useState(false)
  const [theme, setTheme] = useState<Theme>(Theme.System);
  const [hideMature, setMature] = useState( true );
  const [hideEcchi, setEcchi] = useState( true );  
  const [mode, setMode] = useState(false); 
  const constraintsRef = useRef(null)

  function toggleMode() { setMode(!mode); document.title = mode ? "AniMatch" : "MangaMatch"; }

  function toggleMature() {
    setMature(!hideMature); 
    localStorage.setItem('hideMature', (!hideMature).toString()); 
  }
  function toggleEcchi() {
    setEcchi(!hideEcchi); 
    localStorage.setItem('hideEcchi', (!hideEcchi).toString()); 
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
      applyTheme(saved as Theme);
    } else {
      applyTheme(Theme.Dark); // or 'system' as your default
    }

    if (localStorage.getItem('hideMature') != null) {
      setMature(localStorage.getItem('hideMature')!.toLowerCase()==='true' ); 
    }
    if (localStorage.getItem('hideEcchi') != null) {
      setEcchi(localStorage.getItem('hideEcchi')!.toLowerCase()==='true' ); 
    }
  }, []);

  return (
    <>
      <div id='mainCont' className={`${settingsVisible? 'blur-xs' : ''} transition duration-200 flex flex-col h-full `}>
        <div id='header' className='flex flex-row flex-nowrap justify-between mb-4'>
          <div className="flex flex-row flow-nowrap justify-left items-center">
          <Switch
            checked={mode}
            onChange={toggleMode}
            className="group inline-flex h-6 w-11 items-center rounded-full bg-indigo-500 transition rotate-90 scale-75"
          >
            <span className="size-4 translate-x-1 rounded-full bg-white transition group-data-checked:translate-x-6 group-hover:scale-115" />
          </Switch>
          <h1 className="font-header sm:text-5xl text-2xl text-[#1D2126] dark:text-zinc-200 ">
            {mode ? "Manga" : "Ani"}Match
          </h1>
          </div>
          <div id='btnCont' className="font-sans flex flex-row flow-nowrap justify-left ">
            <button className='text-zinc-200 bg-[#1D2126] dark:bg-[#24272a] px-4 sm:px-2 rounded-2xl sm:rounded-2xl hover:shadow-xl/20 dark:hover:shadow-indigo-500 transition duration-200 active:shadow-md/40 hover:scale-101'>
              <div className='flex gap-2 sm:gap-0 flex-row flex-nowrap justify-between items-center m-1'>
                <p className='font-bold align-middle hidden sm:inline mr-1'>Sign in with AniList</p>
                <img className='h-8 w-8 object-cover' src={AniListLogo} alt='AniList Logo'></img>
              </div>
            </button>
            <button className='bg-indigo-500 px-2 mx-2 rounded-2xl sm:rounded-2xl hover:shadow-xl/20 transition duration-200 active:shadow-md/40 dark:hover:shadow-indigo-500 hover:scale-101' onClick={() => setTimeout(() => {setVisible(true);}, 100)}>
              <div className='flex gap-2 flex-row flex-nowrap justify-between items-center'>
                <img className='h-8 w-8 object-cover' src={SettingsIcon} alt='Settings'></img>
              </div>
            </button>
          </div>
        </div>
        <motion.div ref={constraintsRef} id='cardArea' className='w-full h-full shrink flex justify-center items-center h-screen'>
          <Card constraintRef = {constraintsRef} />
        </motion.div >
      </div>
      <Settings visible={settingsVisible} onClose={() => setTimeout(() => {setVisible(false);}, 100)} theme={theme} setTheme={(theme: Theme) => {applyTheme(theme);}} hideMature={hideMature} hideEcchi={hideEcchi} toggleMature={toggleMature} toggleEcchi={toggleEcchi}/>
    </>
  )
}

export default App
