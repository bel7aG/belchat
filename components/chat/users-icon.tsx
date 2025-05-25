import type { ComponentProps } from 'react'

import { Smile } from 'lucide-react'

/**
 * A component that renders a users icon
 * This is a simple wrapper around the Smile icon
 */
export function UsersIcon(props: ComponentProps<typeof Smile>) {
  return <Smile {...props} />
}
