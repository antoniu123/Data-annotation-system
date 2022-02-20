import { Button } from 'antd'
import React from 'react'

export const Card: React.FC<{ className?: string }> = ({ children, className = '' }) => {
  return (
    <div className={`bg-fill-text-inverse rounded shadow-md py-2 ${className}`}> {children}</div>
  )
}

export const CardSection: React.FC<{
  className?: string
  showBorder?: boolean
  padding?: boolean
}> = ({ children, className = '', showBorder = false, padding = true }) => {
  return (
    <div
      className={`${showBorder ? 'border-line-basic-subtle border-b' : ''} 
                          ${padding ? 'px-2 py-2' : ''} 
                          ${className}`}
    >
      {children}
    </div>
  )
}

export const CardSectionTitle: React.FC<{
  title: string
  onEdit?: () => void
  disabled?: boolean
}> = ({ title, onEdit, disabled }) => {
  return (
    <div className="flex justify-between items-center">
      <h2 className="text-fill-accent-medium text-2xl m-0">{title}</h2>
      {onEdit ? (
        <Button
          disabled={disabled}
          onClick={onEdit}
        >
          Edit
        </Button>
      ) : null}
    </div>
  )
}
