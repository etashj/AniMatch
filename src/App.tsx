import React, { Suspense, useState, useEffect, useRef, useCallback } from 'react';
import './App.css';
import { Switch } from '@headlessui/react';

const Settings = React.lazy(() => import('./settingsModal.tsx'));
import Theme from './settingsElems/theme.tsx';

const Card = React.lazy(()=> import('./Card.tsx'));
import { motion } from "motion/react"

import SettingsIcon from './assets/settings.svg';
import AniListLogo from './assets/anilist.svg';
import UndoIcon from './assets/undo.svg';

function App() {
  const [settingsVisible, setVisible] = useState(false)
  const [theme, setTheme] = useState<Theme>(Theme.System);
  const [hideMature, setMature] = useState( true );
  const [hideEcchi, setEcchi] = useState( true );  
  const [mode, setMode] = useState(false); 

  const [animeIds, setAnimeIds] = useState(localStorage.getItem('anime-ids')==null || localStorage.getItem('anime-ids')==JSON.stringify([]) || localStorage.getItem('anime-queue')==JSON.stringify([])? [ 16498, 1535, 66 ] : JSON.parse(localStorage.getItem('anime-ids')!) ); 
  const [mangaIds, setMangaIds] = useState(localStorage.getItem('manga-ids')==null || localStorage.getItem('manga-ids')==JSON.stringify([]) || localStorage.getItem('manga-queue')==JSON.stringify([])? [30002, 105778, 30104] : JSON.parse(localStorage.getItem('manga-ids')!) ); 

  const animeHistory =useRef<number[]>( localStorage.getItem('anime-history')==null || localStorage.getItem('anime-ids')==JSON.stringify([])  || localStorage.getItem('manga-queue')==JSON.stringify([])? [] : JSON.parse(localStorage.getItem('anime-history')!) );
  const mangaHistory =useRef<number[]>( localStorage.getItem('manga-history')==null || localStorage.getItem('manga-ids')==JSON.stringify([])  || localStorage.getItem('anime-queue')==JSON.stringify([])? [] : JSON.parse(localStorage.getItem('manga-history')!) );

  const animeQueue =useRef<number[]>( localStorage.getItem('anime-queue')==null ? [] : JSON.parse(localStorage.getItem('anime-queue')!) );
  const mangaQueue =useRef<number[]>( localStorage.getItem('manga-queue')==null ? [] : JSON.parse(localStorage.getItem('manga-queue')!) );
  
  function toggleMode() { setMode(!mode); document.title = mode ? "AniMatch" : "MangaMatch"; }

  // Memoize idRemFunc using useCallback
    const idRemFunc = useCallback((idToRem: number) => {
      if (mode) {
        setMangaIds((prev: number[]) => prev.filter(id => id !== idToRem));
        localStorage.setItem('manga-ids', JSON.stringify(mangaIds));
      } else {
        setAnimeIds((prev: number[]) => prev.filter(id => id !== idToRem));
        localStorage.setItem('anime-ids', JSON.stringify(animeIds));
      }
    }, [mode, mangaIds, animeIds]); // Empty dependency array means this function is created once

    // Memoize idAddFunc using useCallback
    const idAddFunc = useCallback((idToAdd: number) => {
      if (mode) { 
        setMangaIds((prev: number[]) => [idToAdd, ...prev]);
        localStorage.setItem('manga-ids', JSON.stringify(mangaIds));
      } else {
        setAnimeIds((prev: number[]) => [idToAdd, ...prev]);
        localStorage.setItem('anime-ids', JSON.stringify(animeIds));
      }
    }, [mode, mangaIds, animeIds]); // Empty dependency array means this function is created once


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


  //console.log("IDs: " + ids); 
  //console.log("Queue: " + queue.current.length); 
  //console.log("History: " + history.current.length); 
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
            <button className='text-zinc-200 bg-[#1D2126] dark:bg-[#24272a] px-4 sm:px-2 rounded-2xl sm:rounded-2xl hover:shadow-xl/20 dark:hover:shadow-indigo-500 transition duration-200 active:shadow-md/40 hover:scale-101' onClick={()=>alert("This feature is coming soon!")}>
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
        {/*<button className='flex gap-2 flex-row flex-nowrap justify-between px-2 items-center h-12 w-12 bg-indigo-500  mx-2 rounded-2xl sm:rounded-2xl hover:shadow-xl/30 transition duration-200 active:shadow-md/40 dark:hover:shadow-indigo-500 hover:scale-101 fixed bottom-10 right-10' onClick={()=>alert("This feature is coming soon!")}>
            <img className='z-50 h-7 w-7 object-cover' src={UndoIcon} alt='Undo'></img>
        </button> */}
        <motion.div id='cardArea' className='w-full h-full shrink flex justify-center items-center h-screen relative'>
          <div className='w-3/5 max-sm:w-1/2  min-w-[240px] dark:text-zinc-200 bg-zinc-200 dark:bg-[#141112] ring-zinc-400 dark:ring-zinc-800 ring-3 px-2 py-2 rounded-3xl max-h-7/8 absolute shadow-xl dark:shadow-black-900/30 shadow-black-900 hover:scale-105 transition duration-50 overflow-clip flex flex-col select-none' style={{  touchAction: "none" }}>Loading...<br/> Loading times may exceed 30s because of the AniList API's degraded state. <br /> Consider reloading the page. <br /> Tip: Clicking the title will link to the official AniList page so you can add the item to your list. </div>
      <Suspense fallback={<div className='font-header text-xl text-zinc-500'>Loading...</div>}>
          {(mode?mangaIds:animeIds).map((id: number) => (
              <Card 
              key={id} 
              id={id} 
              idList={(mode?mangaIds:animeIds)}
              animeHistory = {animeHistory}
              animeQueue = {animeQueue}
              mangaHistory = {mangaHistory}
              mangaQueue = {mangaQueue}
              idRemFunc={idRemFunc}
              idAddFunc={idAddFunc}
              hideMature = {hideMature}
                hideEcchi={hideEcchi}
                mode={mode}
            />
            ))
            }
      </Suspense>
        </motion.div >
      </div>
        <p className='z-50 tracking-wider font-header text-zinc-500 text-lg fixed rotate-270 -left-10 top-1/2 '>not interested :/ <br/> ↑</p>
        <p className='z-50 tracking-wider font-header text-zinc-500 text-lg fixed rotate-90 -right-6 top-1/2'>interested :) <br/>↑</p>
      <Suspense fallback={<div>Loading...</div>}>
      <Settings visible={settingsVisible} onClose={() => setTimeout(() => {setVisible(false);}, 100)} theme={theme} setTheme={(theme: Theme) => {applyTheme(theme);}} hideMature={hideMature} hideEcchi={hideEcchi} toggleMature={toggleMature} toggleEcchi={toggleEcchi}/>
      </Suspense>
    </>
  )
}

export default App
