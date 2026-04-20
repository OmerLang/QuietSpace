'use client';
import { useAuth } from "@/contexts/AuthContext";
import styles from './PoiInfoWindow.module.css'
import { useState } from "react";
import RatingForm from "@/components/RatingForm/RatingForm";
import { usePois } from "@/contexts/PoisContext";
import NavLink from "@/components/Navigation/NavLink/NavLink";
import Login from "@/app/login/page";


export default function PoiInfoWindow () {


  const { activePoi } = usePois();
  const { user, loading } = useAuth();
  const [isFormOpen, setIsFormOpen] = useState(false);
  

  return (
    <div className={styles.popupWindow} key={activePoi.google_place_id}>
      <img className={styles.image} src={activePoi.photo_url} alt={`Photo of ${activePoi.display_name}`}/>
      <div className={styles.poiInfo}>
        <p>{activePoi.display_name}</p>
        <p>{activePoi.address}</p>
      {user ? (
        <>
          {activePoi.is_quiet_space ? (
            <>
              <p>Total Rating: {activePoi.total_rating}</p>
              <p>Wifi: {activePoi.wifi_rating}</p>        
              <p>Noise Level: {activePoi.noise_level_rating}</p>        
              <p>Seating Comfort: {activePoi.seating_comfort_rating}</p>        
              <p>Charging Accessibility: {activePoi.charging_accessibility_rating}</p> 
              <button onClick={() => setIsFormOpen(!isFormOpen)}>
                {!isFormOpen ? "Click to rate your experience" : "Close"}
              </button>
              {isFormOpen && <RatingForm setIsFormOpen={setIsFormOpen}/>}
            </>
          ) : (
            <>
              <button onClick={() => setIsFormOpen(!isFormOpen)}>
                {!isFormOpen ? "Click to add to QuietSpace!" : "Close"}
              </button>
              {isFormOpen && <RatingForm setIsFormOpen={setIsFormOpen}/>}
            </>
        )}
        </>
      ) : (
        <>
          {activePoi.is_quiet_space ? (
            <>
              <p>Total Rating: {activePoi.total_rating}</p>
              <p>Wifi: {activePoi.wifi_rating}</p>        
              <p>Noise Level: {activePoi.noise_level_rating}</p>        
              <p>Seating Comfort: {activePoi.seating_comfort_rating}</p>        
              <p>Charging Accessibility: {activePoi.charging_accessibility_rating}</p> 
              <NavLink className={styles.loginBtn} href={"/login"}>Login to rate your experience</NavLink>              
            </>
          ) : (
            <>
              <NavLink className={styles.loginBtn} href={"/login"}>Login to add to QuietSpace</NavLink>              
            </>
        )}
        </>
      )}
      </div>
    </div>
  )
}