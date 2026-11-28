'use client'

import { usePascalI18n } from '@pascal-app/core'
import type React from 'react'
import { cn } from '../lib/cn'
import { FLOATING_SURFACE } from '../lib/floating'
import { Tooltip, TooltipContent, TooltipTrigger } from '../primitives/tooltip'
import { SKY_COMPASS_BOTTOM, useSkyPanel } from './sky-control'

export type FloorplanCompassButtonProps = {
  northRotationDeg: number
  onAlignNorth: () => void
  needleRef?: React.RefObject<SVGSVGElement | null>
  /** Horizontal anchor; defaults to the bottom-left corner. */
  style?: React.CSSProperties
}

export function FloorplanCompassButton({
  northRotationDeg,
  onAlignNorth,
  needleRef,
  style,
}: FloorplanCompassButtonProps) {
  const i18n = usePascalI18n()
  // Beside the sky chip (not when moved to the plan's right corner), centre on the docks' row.
  const besideSky = useSkyPanel((s) => s.hosts > 0) && style?.right === undefined
  const label = i18n._({
    id: 'viewer.floorplan.alignNorth',
    message: 'Align view to north',
  })
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          aria-label={label}
          className={cn(
            'group pointer-events-auto absolute bottom-3 z-30 flex size-7 items-center justify-center rounded-full transition',
            FLOATING_SURFACE,
            !style && 'left-3',
          )}
          style={besideSky ? { bottom: SKY_COMPASS_BOTTOM, ...style } : style}
          onClick={(event) => {
            event.preventDefault()
            event.stopPropagation()
            onAlignNorth()
          }}
          onPointerDown={(event) => {
            event.stopPropagation()
          }}
          type="button"
        >
          <span className="relative flex size-[22px] items-center justify-center rounded-full bg-raised dark:bg-selected">
            <svg
              aria-hidden="true"
              className="size-[22px]"
              ref={needleRef}
              style={{ transform: `rotate(${northRotationDeg}deg)` }}
              viewBox="0 0 48 48"
            >
              <path d="M24 4.5 31.5 25 24 21.5 16.5 25Z" fill="#f15b5b" />
              <path d="M24 43.5 16.5 23 24 26.5 31.5 23Z" fill="#ffffff" />
            </svg>
          </span>
        </button>
      </TooltipTrigger>
      <TooltipContent side="right">{label}</TooltipContent>
    </Tooltip>
  )
}
