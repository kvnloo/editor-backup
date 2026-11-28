/**
 * Chrome that floats over the stage (view bar, level card, docks, chips): a frosted fill, a
 * hairline rim in light, a soft drop. Pair it with `rounded-full` (pills) or `rounded-xl` (cards).
 */
export const FLOATING_SURFACE =
  'bg-background/92 backdrop-blur-[14px] shadow-[0_0_0_1px_rgba(0,0,0,0.06),0_8px_22px_-10px_rgba(0,0,0,0.22)] dark:shadow-[0_8px_22px_-8px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.06)]'

/** The raised item inside floating chrome: the active view, level or tool. */
export const FLOATING_ACTIVE = 'bg-raised text-foreground dark:bg-selected'
