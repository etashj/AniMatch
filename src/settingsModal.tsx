type Props = {
  visible: boolean;
  onClose: () => void;
};

function Settings( {visible, onClose} : Props ) {
  if (!visible) return null;
  
  return (
    <div className="bg-zinc-200 px-2 py-2 rounded-3xl fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 fixed flex-column flex-nowrap justify-between space-y-2">
      <p className='mx-3 font-bold'>Settings</p>
      <button onClick={onClose} className='w-full font-bold text-zinc-200 bg-[#1D2126] px-2 py-1 rounded-2xl'>close</button>
    </div>
  );
}

export default Settings;
