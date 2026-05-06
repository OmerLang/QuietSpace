'use client'
import styles from "./QuietSpacePin.module.css"
import { usePois } from "@/contexts/PoisContext";

export default function QuietSpacePin ({ total_rating, google_place_id }) {

  const { activePoi } = usePois();

  const color = total_rating < 1.7 ? 'low' : total_rating < 3.4 ? 'medium' : 'high';

  const colors = {
    high: '#10b981b7',
    medium: '#fbbe24b7',
    low: '#ef4444b7',
  }

  return (
    <div className={`${styles.pinWrapper} ${activePoi?.google_place_id === google_place_id ? styles.bouncingPin : ""}`}>
      <svg
        width={'60'}
        height={'30'}
        viewBox="0 14 32 18"
        fill="none"
      >
        <path
          d="M16 14c-4.42 0-8 3.58-8 8 0 3 2.5 6 8 10 5.5-4 8-7 8-10 0-4.42-3.58-8-8-8z" 
          fill={colors[color]}
        />
        <circle cx="16" cy="22" r="4" fill="white" />
      </svg>
    </div>
  );
}