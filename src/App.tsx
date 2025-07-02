import React, { Suspense, useState, useEffect } from 'react';
import './App.css';
import { Switch } from '@headlessui/react';

const Settings = React.lazy(() => import('./settingsModal.tsx'));
import Theme from './settingsElems/theme.tsx';

const Card = React.lazy(()=> import('./Card.tsx'));
import { motion } from "motion/react"

import SettingsIcon from './assets/settings.svg';
import AniListLogo from './assets/anilist.svg';
import UndoIcon from './assets/undo.svg';

const ids = [66, 165287, 30104];

function App() {
  const [settingsVisible, setVisible] = useState(false)
  const [theme, setTheme] = useState<Theme>(Theme.System);
  const [hideMature, setMature] = useState( true );
  const [hideEcchi, setEcchi] = useState( true );  
  const [mode, setMode] = useState(false); 
  
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
        <button className='flex gap-2 flex-row flex-nowrap justify-between px-2 items-center h-12 w-12 bg-indigo-500  mx-2 rounded-2xl sm:rounded-2xl hover:shadow-xl/30 transition duration-200 active:shadow-md/40 dark:hover:shadow-indigo-500 hover:scale-101 fixed bottom-10 right-10'>
            <img className='h-7 w-7 object-cover' src={UndoIcon} alt='Undo'></img>
        </button>
        <motion.div id='cardArea' className='w-full h-full shrink flex justify-center items-center h-screen relative'>
      <Suspense fallback={<div className='font-header text-xl text-zinc-500'>Loading...</div>}>
          {ids.map((id: number) => (
              <Card key={id} id={id} />
            ))}
      </Suspense>
        </motion.div >
      </div>
        <p className='z-50 tracking-wider font-header text-zinc-500 text-lg fixed rotate-270 -left-14 top-1/2 '>not interested :/</p>
        <p className='z-50 tracking-wider font-header text-zinc-500 text-lg fixed rotate-90 -right-12 top-1/2'>interested :)</p>
      <Suspense fallback={<div>Loading...</div>}>
      <Settings visible={settingsVisible} onClose={() => setTimeout(() => {setVisible(false);}, 100)} theme={theme} setTheme={(theme: Theme) => {applyTheme(theme);}} hideMature={hideMature} hideEcchi={hideEcchi} toggleMature={toggleMature} toggleEcchi={toggleEcchi}/>
      </Suspense>
    </>
  )
}

export default App
