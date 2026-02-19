'use client'
import { useIsMobile } from "@/hooks/useIsMobile"
import { useEffect } from "react"


export default function () {
  const setIsMobile = useIsMobile((state) => state.setIsMobile);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 1024px)")
    setIsMobile(mq.matches)
    
    const handleChange = (e) => setIsMobile(e.matches)
    mq.addEventListener('change', handleChange)
    return () => mq.removeEventListener('change', handleChange)
  },[setIsMobile])

  return null;
}