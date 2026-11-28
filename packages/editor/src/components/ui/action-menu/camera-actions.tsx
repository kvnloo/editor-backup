'use client'

import { emitter, usePascalI18n } from '@pascal-app/core'
import Image from 'next/image'
import useEditor from '../../../store/use-editor'
import { visibleScene } from '../../../store/view-layout'
import { ActionButton } from '@pascal-app/viewer/ui'
import { FollowPascalToggle } from '@pascal-app/viewer/ui'
import { cn } from '../../../lib/utils'
import { DOCK_BUTTON, DOCK_ICON, DOCK_ICON_IDLE } from './dock-styles'

export function CameraActions({ hideOrbit = false }: { hideOrbit?: boolean }) {
  const i18n = usePascalI18n()
  // Orbit stays useful in 2D-only (it spins the synced floorplan view), but
  // top view only tilts the hidden 3D camera — pointless without the canvas.
  const is2dOnly = useEditor((s) => visibleScene(s) === '2d')

  const goToTopView = () => {
    emitter.emit('camera-controls:top-view')
  }

  const orbitCW = () => {
    emitter.emit('camera-controls:orbit-cw')
  }

  const orbitCCW = () => {
    emitter.emit('camera-controls:orbit-ccw')
  }

  return (
    <div className="flex items-center gap-0.5">
      {!hideOrbit && (
        <>
          {/* Orbit CCW */}
          <ActionButton
            className={cn('group rounded-full', DOCK_BUTTON)}
            label={i18n._({ id: 'editor.actionMenu.cameraActions.orbitLeft', message: 'Orbit Left' })}
            onClick={orbitCCW}
            size="icon"
            variant="ghost"
          >
            <Image
              alt={i18n._({ id: 'editor.actionMenu.cameraActions.orbitLeft', message: 'Orbit Left' })}
              className={cn(DOCK_ICON, DOCK_ICON_IDLE, '-scale-x-100')}
              height={28}
              src="/icons/rotate.webp"
              width={28}
            />
          </ActionButton>

          {/* Orbit CW */}
          <ActionButton
            className={cn('group rounded-full', DOCK_BUTTON)}
            label={i18n._({ id: 'editor.actionMenu.cameraActions.orbitRight', message: 'Orbit Right' })}
            onClick={orbitCW}
            size="icon"
            variant="ghost"
          >
            <Image
              alt={i18n._({ id: 'editor.actionMenu.cameraActions.orbitRight', message: 'Orbit Right' })}
              className={cn(DOCK_ICON, DOCK_ICON_IDLE)}
              height={28}
              src="/icons/rotate.webp"
              width={28}
            />
          </ActionButton>
        </>
      )}

      {/* Follow Pascal */}
      {!is2dOnly && (
        <FollowPascalToggle className={cn('rounded-full', DOCK_BUTTON)} />
      )}

      {/* Top View */}
      {!is2dOnly && (
        <ActionButton
          className={cn('group rounded-full', DOCK_BUTTON)}
          label={i18n._({ id: 'editor.actionMenu.cameraActions.topView', message: 'Top View' })}
          onClick={goToTopView}
          size="icon"
          variant="ghost"
        >
          <Image
            alt={i18n._({ id: 'editor.actionMenu.cameraActions.topView', message: 'Top View' })}
            className={cn(DOCK_ICON, DOCK_ICON_IDLE)}
            height={28}
            src="/icons/topview.webp"
            width={28}
          />
        </ActionButton>
      )}
    </div>
  )
}
