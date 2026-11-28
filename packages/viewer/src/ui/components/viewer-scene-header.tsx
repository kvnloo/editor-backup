'use client'

import {
  type LevelNode,
  type PascalI18n,
  sceneRegistry,
  useLocale,
  usePascalI18n,
  useScene,
} from '@pascal-app/core'
import { ArrowLeft, ChevronRight, Layers } from 'lucide-react'
import { type ComponentType, type ReactNode, useMemo } from 'react'
import { markPerfAction } from '../../lib/perf-actions'
import useViewer from '../../store/use-viewer'
import { cn } from '../lib/cn'
import { FLOATING_ACTIVE, FLOATING_SURFACE } from '../lib/floating'
import { localizedLevelName } from '../lib/level-name'
import { formatRoomArea } from '../lib/room-area'
import {
  applyViewerClick,
  frameViewerNode,
  roomOfObject,
  selectViewerBuilding,
  selectViewerLevel,
  selectViewerRoom,
  selectViewerUnit,
  type ViewerCrumb,
  type ViewerSidebarSection,
  type ViewerSource,
  viewerBreadcrumb,
  viewerSidebarSections,
} from '../lib/viewer-selection'

/** What a header link receives; a host passes its router's link component (e.g. Next's `Link`). */
export type ViewerLinkProps = {
  href: string
  className?: string
  'aria-label'?: string
  children: ReactNode
}

function PlainLink(props: ViewerLinkProps) {
  return <a {...props} />
}

export type ViewerSceneHeaderProps = {
  projectName?: string | null
  owner?: { username?: string | null } | null
  onBack?: () => void
  /** Fallback destination when no `onBack` handler is supplied. Must already be
   *  sanitized by the caller. `null` shows no back arrow (an embedded viewer with
   *  nowhere to go back to). */
  backHref?: string | null
  /** Extra row under the project info (e.g. like and duplicate actions). */
  stats?: ReactNode
  /** The scene the header navigates; the parametric scene store by default. */
  source?: ViewerSource
  /** Renders the back and owner links; a plain `<a>` by default. */
  linkComponent?: ComponentType<ViewerLinkProps>
}

function sectionTitle(kind: ViewerSidebarSection['kind'], i18n: PascalI18n): string {
  if (kind === 'units') return i18n._({ id: 'viewer.header.units', message: 'Units' })
  if (kind === 'rooms') return i18n._({ id: 'viewer.header.rooms', message: 'Rooms' })
  return i18n._({ id: 'viewer.header.zones', message: 'Zones' })
}

const parametricObject = (id: string) => sceneRegistry.nodes.get(id)

/**
 * The navigation of every viewer surface: the project card, the bar (building
 * › floor › room › element) and the floor list with, under the current floor,
 * its units, rooms and zones. A row or a crumb selects and frames; the canvas
 * selects in place (`ui/lib/viewer-selection.ts`).
 */
export const ViewerSceneHeader = ({
  projectName,
  owner,
  onBack,
  backHref = '/',
  stats,
  source: sourceProp,
  linkComponent: Link = PlainLink,
}: ViewerSceneHeaderProps) => {
  const i18n = usePascalI18n()
  const catalogVersion = i18n.getVersion()
  const locale = useLocale()
  const sceneNodes = useScene((s) => s.nodes)
  const source = useMemo<ViewerSource>(
    () => sourceProp ?? { nodes: sceneNodes, objectFor: parametricObject },
    [sourceProp, sceneNodes],
  )
  const { nodes } = source
  const selection = useViewer((s) => s.selection)
  const focusedUnitId = useViewer((s) => s.focusedUnitId)
  const unit = useViewer((s) => s.unit)

  const crumbs = useMemo(
    () =>
      viewerBreadcrumb(selection, focusedUnitId, nodes, i18n, (nodeId, levelId) =>
        roomOfObject(nodeId, levelId, source),
      ),
    [selection, focusedUnitId, nodes, source, i18n, locale, catalogVersion],
  )
  const buildingId = crumbs.find((crumb) => crumb.kind === 'building')?.id ?? null
  // Highest first so the list reads top-down like a building section.
  const levels = useMemo(() => {
    const building = buildingId ? nodes[buildingId] : undefined
    if (building?.type !== 'building') return []
    return building.children
      .map((id) => nodes[id])
      .filter((node): node is LevelNode => node?.type === 'level')
      .sort((a, b) => b.level - a.level)
  }, [buildingId, nodes])
  const sections = useMemo(
    () => (selection.levelId ? viewerSidebarSections(selection.levelId, nodes, i18n) : []),
    [selection.levelId, nodes, i18n, locale, catalogVersion],
  )

  const handleCrumb = (crumb: ViewerCrumb) => {
    switch (crumb.kind) {
      case 'building':
        return selectViewerBuilding(source)
      case 'level':
        return selectViewerLevel(crumb.id, source)
      case 'unit':
        return selectViewerUnit(crumb.id, source)
      case 'room':
        return selectViewerRoom(crumb.id, source)
      case 'node':
        applyViewerClick({ nodeId: crumb.id, point: null }, nodes)
        return frameViewerNode(crumb.id, source)
    }
  }

  return (
    <div className="dark absolute top-4 left-4 z-20 flex max-h-[calc(100%-7rem)] flex-col gap-3 text-foreground">
      <div
        className={cn(
          'pointer-events-auto flex min-w-[200px] max-w-[min(28rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-[12px]',
          FLOATING_SURFACE,
        )}
      >
        {/* Project info + back */}
        <div className="flex items-center gap-2 p-1.5 pr-3">
          {onBack ? (
            <button
              aria-label={i18n._({ id: 'viewer.header.back', message: 'Back' })}
              className="flex size-7 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-white/8"
              onClick={onBack}
              type="button"
            >
              <ArrowLeft className="h-4 w-4 text-muted-foreground" />
            </button>
          ) : backHref === null ? null : (
            <Link
              aria-label={i18n._({ id: 'viewer.header.back', message: 'Back' })}
              className="flex size-7 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-white/8"
              href={backHref}
            >
              <ArrowLeft className="h-4 w-4 text-muted-foreground" />
            </Link>
          )}
          <div className="min-w-0 flex-1">
            <div className="truncate font-medium text-[13px] text-foreground">
              {projectName || i18n._({ id: 'viewer.header.untitled', message: 'Untitled' })}
            </div>
            {owner?.username && (
              <Link
                className="text-[11.5px] text-dim-foreground transition-colors hover:text-foreground"
                href={`/u/${owner.username}`}
              >
                @{owner.username}
              </Link>
            )}
          </div>
        </div>

        {stats && (
          <div className="flex items-center gap-1 border-border border-t px-3 py-2">{stats}</div>
        )}

        {crumbs.length > 0 && (
          <nav
            aria-label={i18n._({ id: 'viewer.header.selection', message: 'Selection' })}
            className="flex flex-wrap items-center gap-x-1.5 gap-y-1 border-border border-t px-3 py-2 text-xs"
            data-testid="viewer-breadcrumb"
          >
            {crumbs.map((crumb, index) => {
              const isLast = index === crumbs.length - 1
              return (
                <span
                  className="flex min-w-0 items-center gap-1.5"
                  key={`${crumb.kind}:${crumb.id}`}
                >
                  {index > 0 && <ChevronRight className="h-3 w-3 text-muted-foreground/50" />}
                  <button
                    className={cn(
                      'truncate transition-colors',
                      isLast
                        ? 'font-medium text-foreground'
                        : 'text-muted-foreground hover:text-foreground',
                    )}
                    data-crumb={crumb.kind}
                    onClick={() => handleCrumb(crumb)}
                    type="button"
                  >
                    {crumb.label}
                  </button>
                </span>
              )
            })}
          </nav>
        )}
      </div>

      {levels.length > 0 && (
        <div
          className={cn(
            'pointer-events-auto flex min-h-0 w-56 flex-col overflow-hidden rounded-[12px] p-1',
            FLOATING_SURFACE,
          )}
        >
          <span className="px-2 pt-1 pb-1.5 font-medium text-[11.5px] text-dim-foreground">
            {i18n._({ id: 'viewer.header.levels', message: 'Levels' })}
          </span>
          <div className="flex min-h-0 flex-col gap-0.5 overflow-y-auto">
            {levels.map((lvl) => {
              const isSelected = lvl.id === selection.levelId
              return (
                <div key={lvl.id}>
                  <button
                    className={cn(
                      'group/row relative flex h-7 w-full cursor-pointer select-none items-center rounded-[8px] px-2 text-[13px] transition-colors',
                      isSelected
                        ? FLOATING_ACTIVE
                        : 'text-muted-foreground hover:bg-white/8 hover:text-foreground',
                    )}
                    onClick={() => {
                      if (!isSelected) markPerfAction('level-switch', lvl.id)
                      selectViewerLevel(lvl.id, source)
                    }}
                    type="button"
                  >
                    <div className="flex min-w-0 flex-1 items-center gap-2">
                      <span
                        className={cn(
                          'flex h-4 w-4 shrink-0 items-center justify-center transition-all duration-200',
                          !isSelected && 'opacity-60 grayscale',
                        )}
                      >
                        <Layers className="h-3.5 w-3.5" />
                      </span>
                      <div className="min-w-0 flex-1 truncate text-left">
                        {localizedLevelName(lvl, i18n, locale)}
                      </div>
                    </div>
                  </button>
                  {isSelected &&
                    sections.map((section) => (
                      <div className="pb-1" data-viewer-section={section.kind} key={section.kind}>
                        <span className="block pt-2 pb-1 pl-8 font-medium text-[11.5px] text-dim-foreground">
                          {sectionTitle(section.kind, i18n)}
                        </span>
                        {section.rows.map((row) => {
                          const active =
                            section.kind === 'units'
                              ? row.id === focusedUnitId
                              : row.id === selection.zoneId
                          return (
                            <button
                              className={cn(
                                'flex h-7 w-full cursor-pointer select-none items-center gap-2 rounded-[8px] pr-2 pl-8 text-left text-[13px] transition-colors',
                                active
                                  ? FLOATING_ACTIVE
                                  : 'text-muted-foreground hover:bg-white/8 hover:text-foreground',
                              )}
                              key={row.id}
                              onClick={() =>
                                section.kind === 'units'
                                  ? selectViewerUnit(row.id, source)
                                  : selectViewerRoom(row.id, source)
                              }
                              type="button"
                            >
                              <span
                                className="h-2 w-2 shrink-0 rounded-full"
                                style={{ backgroundColor: row.color }}
                              />
                              <span className="min-w-0 flex-1 truncate">{row.label}</span>
                              <span className="shrink-0 font-mono text-[10.5px] text-dim-foreground tabular-nums">
                                {formatRoomArea(row.areaM2, unit, locale)}
                              </span>
                            </button>
                          )
                        })}
                      </div>
                    ))}
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
