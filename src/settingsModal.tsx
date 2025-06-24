import SettingsSwitch from './settingsElems/switch.tsx';
import ThemeDrop from './settingsElems/themeDrop.tsx'

export enum Theme {
  Light = 'Light',
  Dark = 'Dark',
  System = 'System',
}

type Props = {
  visible: boolean;
  onClose: () => void;
  theme: Theme;
  setTheme: (t: Theme) => void;
  hideMature: boolean; 
  hideEcchi: boolean; 
  toggleMature: ()=>void;
  toggleEcchi: ()=>void; 
};

export default function Settings( {visible, onClose, theme, setTheme, hideMature, hideEcchi, toggleMature, toggleEcchi} : Props ) {
  if (!visible) return null;
  
  return (
    <div className="dark:text-zinc-200 bg-zinc-200 dark:bg-[#141112] px-2 py-2 rounded-3xl top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 fixed flex-column flex-nowrap justify-between space-y-2 max-sm:w-75">
      <p className='mx-3 font-bold dark:text-zinc-200 mt-3'>Settings</p>
      <div className='flex-column flex-nowrap justify-between space-y-1'>
        <div className='flex flex-row flex-nowrap justify-evenly mx-4 space-x-5 items-center '>
          <p className="p-2 rounded-xl ">Theme</p>
          <ThemeDrop theme={theme} setTheme={setTheme} />
        </div>
        <div className='flex flex-row flex-nowrap items-center justify-evenly mx-4 space-x-5'>
          <p className="p-2 rounded-xl ">Hide Ecchi</p>
          <SettingsSwitch setting={hideEcchi} toggleFunc={toggleEcchi}  />
        </div>
        <div className='flex flex-row flex-nowrap items-center justify-evenly mx-4 space-x-5'>
          <p className="p-2 rounded-xl ">Hide Mature</p>
          <SettingsSwitch setting={hideMature} toggleFunc={toggleMature}  />
        </div>
      </div>
      <button onClick={onClose} className='w-full font-bold text-zinc-200 bg-indigo-500 px-2 py-1 rounded-b-2xl rounded-t-md hover:shadow-md/20 transition duration-300 active:shadow-sm/40 dark:hover:shadow-indigo-500'>close</button>
    </div>
  );
}
