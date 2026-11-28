'use client'

import { usePascalI18n } from '@pascal-app/core'
import { Video } from 'lucide-react'
import { cn } from '../lib/cn'
import { FLOATING_ACTIVE } from '../lib/floating'
import { useFollowPascal } from '../store/use-follow-pascal'
import { ActionButton } from './action-button'

/** The toolbar's switch for Follow Pascal: the camera follows what the agent builds. */
export function FollowPascalToggle({
  className,
  tooltipClassName,
}: {
  className?: string
  tooltipClassName?: string
}) {
  const i18n = usePascalI18n()
  const on = useFollowPascal((state) => state.on)
  const setOn = useFollowPascal((state) => state.setOn)
  return (
    <ActionButton
      aria-pressed={on}
      className={cn(
        on ? undefined : 'hover:bg-black/5 hover:text-violet-ink dark:hover:bg-white/8',
        className,
        // On: raised, in the violet that marks agent state.
        on && cn(FLOATING_ACTIVE, 'text-violet-ink hover:bg-raised dark:hover:bg-selected'),
      )}
      label={
        on
          ? i18n._({ id: 'editor.actionMenu.followPascalToggle.on', message: 'Follow Pascal: On' })
          : i18n._({
              id: 'editor.actionMenu.followPascalToggle.off',
              message: 'Follow Pascal: Off',
            })
      }
      onClick={() => setOn(!on)}
      size="icon"
      tooltipClassName={tooltipClassName}
      variant="ghost"
    >
      <Video className="size-[18px]" />
    </ActionButton>
  )
}
