import { Link } from 'react-router-dom';

function About() {
  return (
    <div className="bg-zinc-50 dark:bg-[#221a1d] h-screen flex items-center justify-center">
      <div className="text-center flex flex-col items-center w-full px-4 sm:px-0">
        <h1 className="font-header sm:text-5xl text-2xl text-[#1D2126] dark:text-zinc-200">
          AniMatch
        </h1>
        <br />
        <p className="sm:text-xl sm:w-1/2 w-full self-center text-zinc-700 dark:text-zinc-300">
          This website was built with React, Typescript, Tailwind CSS, and Vite! The source is available on <a target='_blank' href='https://github.com/etashj/AniMatch/issues'>GitHub</a>. 
          <br />
          <br />
          The site sources anime/manga information from the AniList GraphQL database and, depending on the user's preference, will fetch the API's recommendations and queue them up. To avoid 429 errors, the Apollo package caches the API pulls so repeated requests are not blocked. No API key is required, so the rate limit is based on user actions.
        </p>
        <br />
        <Link to='/'>
          <button className='mx-1 font-bold text-zinc-200 bg-indigo-500 px-2 py-1 rounded-md hover:shadow-lg/20 transition duration-300 active:shadow-sm/40 dark:hover:shadow-indigo-500 hover:scale-101'>back</button>
        </Link>
      </div>

    </div>
  );
}


export default About; 
