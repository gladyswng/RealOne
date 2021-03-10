import React, { useEffect, useRef, useState } from 'react'

const useClickOutside = <T extends HTMLElement> (initialVisible: boolean) => {
  const [ componentVisible, setComponentVisible ] =useState<boolean>(initialVisible)

  const myRef = useRef<T>(null)

  const handleDropdown = (e:KeyboardEvent) => {
    if (e.key === 'Escape') {
      setComponentVisible(false)
    }
  }

  const handleClickOutside = (e:MouseEvent) => {
    if (myRef.current === null) {
      return
    }
    if (myRef.current && !myRef.current!.contains(e.target as HTMLElement)) {
      setComponentVisible(false)
    }
  }

  useEffect(() => {
    document.addEventListener('keydown', handleDropdown, true)
    document.addEventListener('click', handleClickOutside, true)
    return () => {
      document.removeEventListener('keydown', handleDropdown, true)
      document.removeEventListener('click', handleClickOutside, true)
    }
  })

  return { ref: myRef, componentVisible, setComponentVisible }
}

export default useClickOutside