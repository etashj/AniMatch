type Props = {
  visible: boolean;
  onClose: () => void;
};

function Settings( {visible, onClose} : Props ) {
  if (!visible) return null;
  
  return (
    <div className="bg-zinc-200 dark:bg-[#141112] px-2 py-2 rounded-3xl fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 fixed flex-column flex-nowrap justify-between space-y-2">
      <p className='mx-3 font-bold dark:text-zinc-200'>Settings</p>
      <button onClick={onClose} className='w-full font-bold text-zinc-200 bg-indigo-500 px-2 py-1 rounded-b-2xl rounded-t-md hover:shadow-md/20 transition duration-300 active:shadow-sm/40 dark:hover:shadow-indigo-500'>close</button>
    </div>
  );
}

export default Settings;
