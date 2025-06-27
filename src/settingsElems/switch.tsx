import { Switch } from '@headlessui/react'

type Props = {
  setting: boolean; 
  toggleFunc: () => void; 
}; 

export default function SettingsSwitch( {setting, toggleFunc}: Props ) {
  
  return (
    <Switch
      checked={setting}
      onChange={toggleFunc}
      className="group inline-flex h-6 w-11 items-center rounded-full bg-zinc-300 dark:bg-[#1D2126] transition data-checked:bg-indigo-400"
    >
      <span className="size-4 translate-x-1 rounded-full bg-white transition group-data-checked:translate-x-6 group-hover:-translate-y-0.5" />
    </Switch>
  )
}
