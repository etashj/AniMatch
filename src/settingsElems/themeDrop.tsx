import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { Theme } from '../settingsModal.tsx'

type Props = {
  theme: Theme; 
  setTheme: (Theme) => void; 
}

export default function ThemeDrop( {theme, setTheme} : Props) {
  return (
    <Menu>
      <MenuButton><span className="dark:text-zinc-200 p-2 rounded-xl m-1 bg-zinc-300 dark:bg-[#1D2126]">{theme} ▼ </span></MenuButton>
      <MenuItems anchor="bottom">
        <MenuItem>
          <button className="block data-focus:bg-indigo-400 p-2 rounded-t-xl bg-zinc-300 dark:bg-[#24272a] w-20" onClick={() => setTheme(Theme.Light)}>
            <p className='dark:text-zinc-200' >
              Light
            </p>
          </button>
        </MenuItem>
        <MenuItem>
          <button className="block dark:text-zinc-200 data-focus:bg-indigo-400 p-2 bg-zinc-300 dark:bg-[#24272a] w-20" onClick={() => setTheme(Theme.Dark)}>
            <p className='dark:text-zinc-200' >
              Dark
            </p>
          </button>
        </MenuItem>
        <MenuItem>
          <button className="block dark:text-zinc-200 data-focus:bg-indigo-400 p-2 rounded-b-xl bg-zinc-300 dark:bg-[#24272a] w-20 " onClick={() => setTheme(Theme.System)}>
            <p className='dark:text-zinc-200' >
              System
            </p>
          </button>
        </MenuItem>
      </MenuItems>
    </Menu>
  )
}
