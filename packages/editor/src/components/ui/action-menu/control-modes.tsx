'use client'

import { usePascalI18n } from '@pascal-app/core'
import type { MessageDescriptor } from '@pascal-app/core'

import { Icon } from '@iconify/react'
import { type LucideIcon, Trash2 } from 'lucide-react'
import Image from 'next/image'
import { Fragment, type ReactNode } from 'react'
import { cn } from './../../../lib/utils'
import useEditor from './../../../store/use-editor'
import { ActionButton } from '@pascal-app/viewer/ui'
import { DOCK_BUTTON, DOCK_BUTTON_ON, DOCK_ICON, DOCK_ICON_IDLE } from './dock-styles'
import { MeasurementControl } from './measurement-control'
import { PointAskButton } from './point-ask-button'

type ControlId = 'select' | 'box-select' | 'delete'

type ControlConfig = {
  id: ControlId
  icon?: LucideIcon
  iconifyIcon?: string
  imageSrc?: string
  label: MessageDescriptor
  shortcut?: string
}

// Fixed set of controls — always visible, never morphs
const controls: ControlConfig[] = [
  {
    id: 'select',
    imageSrc: '/icons/select.webp',
    label: /* i18n */ { id: 'editor.actionMenu.controlModes.select', message: 'Select' },
    shortcut: 'V',
  },
  {
    id: 'delete',
    icon: Trash2,
    label: /* i18n */ { id: 'editor.actionMenu.controlModes.delete', message: 'Delete' },
    shortcut: 'X',
  },
]

export function ControlModes({ pointAskIcon }: { pointAskIcon?: ReactNode }) {
  const i18n = usePascalI18n()
  const mode = useEditor((state) => state.mode)
  const selectionTool = useEditor((state) => state.floorplanSelectionTool)
  const armToolMode = useEditor((state) => state.armToolMode)
  const setSelectionTool = useEditor((state) => state.setFloorplanSelectionTool)

  const getIsActive = (id: ControlId): boolean => {
    if (id === 'select') return mode === 'select' && selectionTool === 'click'
    if (id === 'box-select') return mode === 'select' && selectionTool === 'marquee'
    return mode === id
  }

  const handleClick = (id: ControlId) => {
    if (id === 'select') {
      armToolMode({ mode: 'select' })
      setSelectionTool('click')
    } else if (id === 'box-select') {
      armToolMode({ mode: 'select' })
      setSelectionTool('marquee')
    } else {
      armToolMode({ mode: id })
    }
  }

  return (
    <div className="flex items-center gap-0.5">
      {controls.map((c) => {
        const ModeIcon = c.icon
        const isActive = getIsActive(c.id)

        return (
          <Fragment key={c.id}>
            {c.id === 'delete' ? (
              <>
                <PointAskButton icon={pointAskIcon} />
                <MeasurementControl />
              </>
            ) : null}
            <ActionButton
              className={cn(
                'group rounded-full',
                DOCK_BUTTON,
                isActive && DOCK_BUTTON_ON,
                c.id === 'delete' && !isActive && 'hover:text-destructive',
              )}
              // A static hook for a host app that wants to point a first-run
              // tour at this button. Nothing here reads it.
              data-guide-target={c.id === 'select' ? 'mode-select' : undefined}
              isActive={isActive}
              label={i18n._(c.label)}
              onClick={() => handleClick(c.id)}
              shortcut={c.shortcut}
              size="icon"
              variant="ghost"
            >
              {c.imageSrc ? (
                <Image
                  alt={i18n._(c.label)}
                  className={cn(DOCK_ICON, !isActive && DOCK_ICON_IDLE)}
                  height={28}
                  src={c.imageSrc}
                  width={28}
                />
              ) : c.iconifyIcon ? (
                <Icon color="currentColor" height={16} icon={c.iconifyIcon} width={16} />
              ) : (
                ModeIcon && <ModeIcon className="size-4" />
              )}
            </ActionButton>
          </Fragment>
        )
      })}
    </div>
  )
}
