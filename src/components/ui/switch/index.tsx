import React, { useState } from 'react'

type SwitchProps = {
  checked?: boolean
  onChange?: (checked: boolean) => void
  disabled?: boolean
  label?: string
}

const Switch: React.FC<SwitchProps> = ({
  checked,
  onChange,
  disabled = false,
  label
}) => {
  const [internalChecked, setInternalChecked] = useState(checked ?? false)

  const toggle = () => {
    if (disabled) return
    const next = !internalChecked
    setInternalChecked(next)
    onChange?.(next)
  }

  return (
    <div className="inline-flex items-center gap-2">
      <button
        type="button"
        role="switch"
        aria-checked={internalChecked}
        disabled={disabled}
        onClick={toggle}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
          internalChecked ? 'bg-blue-600' : 'bg-gray-300'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            internalChecked ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
      {label && (
        <span className={`${disabled ? 'opacity-50' : ''}`}>{label}</span>
      )}
    </div>
  )
}

export default Switch
