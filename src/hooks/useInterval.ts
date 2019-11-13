import { useEffect, useRef } from 'react'

export default function useInterval(callback: () => void, delay: number, reset: number) {
  const savedCallback = useRef<() => void>(() => {})
  const savedReset = useRef<number>()

  useEffect(() => {
    savedCallback.current = callback
    savedReset.current = reset
  }, [callback, reset])

  useEffect(() => {
    function tick() {
      savedCallback.current()
    }
    if (delay !== null || reset !== savedReset.current) {
      const id = setInterval(tick, delay)
      return () => clearInterval(id)
    }
  }, [delay, reset])
}
