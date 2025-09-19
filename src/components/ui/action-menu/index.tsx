import React, { useState, useRef, useEffect, ReactNode } from 'react'

interface ActionMenuProps {
  trigger: ReactNode
  children: ReactNode
}

export const ActionMenu: React.FC<ActionMenuProps> = ({
  trigger,
  children
}) => {
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      <div onClick={() => setOpen((prev) => !prev)}>{trigger}</div>

      {open && (
        <div className="absolute right-0 mt-2 w-auto origin-top-right bg-white rounded-[8px] border border-gray-300 shadow-md z-50">
          <div className="py-1">{children}</div>
        </div>
      )}
    </div>
  )
}
