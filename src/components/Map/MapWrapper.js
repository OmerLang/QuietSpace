'use client'
import { APIProvider } from '@vis.gl/react-google-maps';

export default function MapWrapper({ children }) {
  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>
      {children}
    </APIProvider>
  );
}


