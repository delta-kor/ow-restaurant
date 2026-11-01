'use client'

import Icon from '@/components/Icon'
import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

export interface SelectOption<T extends string> {
  value: T
  label: string
}

/** Shared dropdown using the site's existing palette, icons and Motion transitions. */
export default function SelectMenu<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: T
  options: readonly SelectOption<T>[]
  onChange: (value: T) => void
}) {
  const id = useId()
  const trigger = useRef<HTMLButtonElement>(null)
  const panel = useRef<HTMLDivElement>(null)
  const search = useRef({ text: '', time: 0 })
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(0)
  const [position, setPosition] = useState({ left: 0, top: 0, width: 0, maxHeight: 280 })
  const selected = Math.max(
    0,
    options.findIndex((o) => o.value === value)
  )

  useLayoutEffect(() => {
    if (!open) return
    const place = () => {
      const rect = trigger.current!.getBoundingClientRect()
      const below = window.innerHeight - rect.bottom - 16
      const above = rect.top - 16
      const height = Math.min(280, options.length * 44 + 16)
      const up = below < height && above > below
      const maxHeight = Math.max(44, Math.min(280, up ? above - 8 : below - 8))
      const width = Math.min(Math.max(rect.width, 200), window.innerWidth - 32)
      setPosition({
        width,
        left: Math.max(16, Math.min(rect.left, window.innerWidth - width - 16)),
        top: up ? rect.top - Math.min(height, maxHeight) - 8 : rect.bottom + 8,
        maxHeight,
      })
    }
    place()
    const outside = (e: PointerEvent) => {
      if (
        !trigger.current?.contains(e.target as Node) &&
        !panel.current?.contains(e.target as Node)
      )
        setOpen(false)
    }
    document.addEventListener('pointerdown', outside)
    window.addEventListener('resize', place)
    window.addEventListener('scroll', place, true)
    return () => {
      document.removeEventListener('pointerdown', outside)
      window.removeEventListener('resize', place)
      window.removeEventListener('scroll', place, true)
    }
  }, [open, options.length])

  useEffect(() => {
    if (open) document.getElementById(`${id}-${active}`)?.scrollIntoView({ block: 'nearest' })
  }, [active, open, id])

  const choose = (index: number) => {
    setOpen(false)
    trigger.current?.focus()
    if (options[index] && options[index].value !== value) onChange(options[index].value)
  }
  return (
    <div className="flex max-w-full min-w-0 flex-col gap-6">
      <span id={`${id}-label`} className="text-12 text-gray font-bold">
        {label}
      </span>
      <button
        ref={trigger}
        type="button"
        role="combobox"
        aria-labelledby={`${id}-label`}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? `${id}-list` : undefined}
        aria-activedescendant={open ? `${id}-${active}` : undefined}
        className="group rounded-12 border-primary-background bg-primary-background text-primary hover:border-primary-light focus-visible:outline-primary text-14 flex min-h-44 max-w-full min-w-[168px] cursor-pointer items-center justify-between gap-16 border-2 px-14 py-10 font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
        onClick={() => {
          setActive(selected)
          setOpen(!open)
        }}
        onBlur={(e) => {
          if (!panel.current?.contains(e.relatedTarget)) setOpen(false)
        }}
        onKeyDown={(e) => {
          if (e.key === 'Escape' || e.key === 'Tab') {
            setOpen(false)
            return
          }
          if (['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(e.key)) {
            e.preventDefault()
            if (!open) {
              setOpen(true)
              setActive(
                e.key === 'ArrowUp'
                  ? options.length - 1
                  : e.key === 'End'
                    ? options.length - 1
                    : e.key === 'Home'
                      ? 0
                      : selected
              )
              return
            }
            setActive((i) =>
              e.key === 'Home'
                ? 0
                : e.key === 'End'
                  ? options.length - 1
                  : (i + (e.key === 'ArrowDown' ? 1 : -1) + options.length) % options.length
            )
          } else if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            if (open) choose(active)
            else {
              setActive(selected)
              setOpen(true)
            }
          } else if (e.key.length === 1 && !e.metaKey && !e.ctrlKey && !e.altKey) {
            const now = Date.now()
            search.current = {
              text:
                (now - search.current.time < 700 ? search.current.text : '') +
                e.key.toLocaleLowerCase(),
              time: now,
            }
            const index = options.findIndex((o) =>
              o.label.toLocaleLowerCase().startsWith(search.current.text)
            )
            if (index >= 0) {
              e.preventDefault()
              setActive(index)
              setOpen(true)
            }
          }
        }}
      >
        <span className="min-w-0 truncate">{options[selected]?.label}</span>
        <Icon.DownChevron
          className={`size-16 shrink-0 opacity-60 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {typeof document !== 'undefined' &&
        createPortal(
          <AnimatePresence>
            {open && (
              <motion.div
                ref={panel}
                id={`${id}-list`}
                role="listbox"
                aria-labelledby={`${id}-label`}
                initial={{ opacity: 0, y: -4, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -4, scale: 0.98 }}
                transition={{ duration: 0.14 }}
                style={position}
                className="rounded-12 border-primary-background fixed z-50 overflow-y-auto overscroll-contain border-2 bg-white p-6 shadow-[0_12px_32px_rgba(55,80,160,0.12)]"
              >
                {options.map((option, index) => (
                  <div
                    key={option.value}
                    id={`${id}-${index}`}
                    role="option"
                    aria-selected={option.value === value}
                    onPointerMove={() => setActive(index)}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => choose(index)}
                    data-active={active === index}
                    className={`rounded-8 text-14 flex min-h-40 cursor-pointer items-center justify-between gap-16 px-12 py-10 font-semibold transition-colors ${option.value === value ? 'bg-primary text-white' : 'text-gray data-[active=true]:bg-primary-background data-[active=true]:text-primary'}`}
                  >
                    <span>{option.label}</span>
                    {option.value === value && (
                      <svg
                        className="size-16 shrink-0"
                        viewBox="0 0 20 20"
                        fill="none"
                        aria-hidden="true"
                      >
                        <path
                          d="m4 10 4 4 8-8"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </div>
  )
}
