'use client'
import MarkerWithInfoWindow from "../MarkerWithInfoWindow/MarkerWithInfoWindow"


export default function RenderMarkers ({ activePoi }) {




  return (
    <MarkerWithInfoWindow
      position={activePoi.latLng}
    />
  )
}