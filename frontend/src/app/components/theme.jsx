"use client";

import {useTheme} from "next-themes";
import { useEffect, useState } from "react";
import ContrastIcon from '@mui/icons-material/Contrast';

export function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  if(!mounted) return null

  return (
    <div>
        <ContrastIcon 
          className={`w-7 h-7 ${theme === 'dark' ? 'text-black hover:text-gray-200' : 'text-gray-200 hover:text-black'} hover:cursor-pointer`}
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
        />
    </div>
  )
}