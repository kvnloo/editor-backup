import { FLOATING_ACTIVE } from '@pascal-app/viewer/ui'

/** A tool dock button: 28 px, muted until its tool is on, then raised. Add the corner rounding. */
export const DOCK_BUTTON =
  'size-7 p-0 text-muted-foreground hover:bg-black/5 hover:text-foreground dark:hover:bg-white/8'
export const DOCK_BUTTON_ON = `${FLOATING_ACTIVE} hover:bg-raised dark:hover:bg-selected`
/** The chevron half of a split dock button. */
export const DOCK_CHEVRON =
  'flex h-7 w-4 items-center justify-center rounded-r-full text-muted-foreground transition-colors hover:bg-black/5 hover:text-foreground dark:hover:bg-white/8'
/** A rich icon in the dock: greyed while idle, full colour when on or hovered. */
export const DOCK_ICON = 'size-[19px] object-contain transition-[opacity,filter] duration-200'
export const DOCK_ICON_IDLE = 'opacity-70 grayscale group-hover:opacity-100 group-hover:grayscale-0'
