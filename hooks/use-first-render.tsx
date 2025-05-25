import { useRef, useEffect } from 'react'

/**
 * @description useFirstRender hook used to check if the first render already done.
 * @returns boolean
 */
export default function useFirstRender() {
  const firstRender = useRef(true)

  useEffect(() => {
    firstRender.current = false
  }, [])

  return firstRender.current
}
