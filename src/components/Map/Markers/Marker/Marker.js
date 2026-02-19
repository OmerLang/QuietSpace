'use client'
import { AdvancedMarker } from "@vis.gl/react-google-maps";





export default function Marker ({ position, markerRef, handleMarkerClick }) {

  return (
    <AdvancedMarker
      position = { position }
      ref={markerRef}
      onClick={handleMarkerClick}/>
  )
}