import { useEffect, useState } from 'react'
import { useSpring } from 'framer-motion'

export function AnimatedNumber({ value }: { value: number }) {
  const spring = useSpring(0, { bounce: 0, duration: 2000 })
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    spring.set(value)
  }, [value, spring])

  useEffect(() => {
    return spring.on('change', (latest) => setDisplay(Math.round(latest)))
  }, [spring])

  return <>{display}</>
}
