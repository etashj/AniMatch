import { Link } from 'react-router-dom';

function Issue() {
  return (
    <div className="bg-zinc-50 dark:bg-[#221a1d] h-screen flex items-center justify-center overflow-y-auto">
      <div className="text-center flex flex-col items-center w-full px-4 sm:px-0">
        <h1 className="font-header sm:text-5xl text-2xl text-[#1D2126] dark:text-zinc-200">
          AniMatch
        </h1>
        <br />
        <p className="sm:text-xl sm:w-1/2 w-full self-center text-zinc-700 dark:text-zinc-300">
          You can report issues on the <a target='_blank' href='https://github.com/etashj/AniMatch/issues'>GitHub issues page</a> or using the form below
          <br />
          <br />
          <iframe src="https://docs.google.com/forms/d/e/1FAIpQLSdIvcMmokOFh3CY5boJcrj-e67zWMYQKTmbwTXrto6FkD1FSQ/viewform?embedded=true" width="640" height="500">Loading…</iframe>
        </p>
        <br />
        <Link to='/'>
          <button className='mx-1 font-bold text-zinc-200 bg-indigo-500 px-2 py-1 rounded-md hover:shadow-lg/20 transition duration-300 active:shadow-sm/40 dark:hover:shadow-indigo-500 hover:scale-101'>back</button>
        </Link>
      </div>

    </div>
  );
}
export default Issue; 
