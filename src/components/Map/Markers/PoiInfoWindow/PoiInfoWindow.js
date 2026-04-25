'use client';
import { useAuth } from "@/contexts/AuthContext";
import styles from './PoiInfoWindow.module.css'
import { useEffect, useState } from "react";
import RatingForm from "@/components/RatingForm/RatingForm";
import { usePois } from "@/contexts/PoisContext";
import NavLink from "@/components/Navigation/NavLink/NavLink";
import Login from "@/app/login/page";


export default function PoiInfoWindow () {


  const { activePoi } = usePois();
  const { user, loading } = useAuth();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const fallbackImage = "/images/fallback.jpg";
  const imageSource = activePoi.photo_url || fallbackImage;
  

  return (
    <div className={isVisible ? styles.popupWindow : ""} key={activePoi.google_place_id}>
      <img className={styles.image} src={imageSource} onLoad={() => setIsVisible(true)} alt={`Photo of ${activePoi.display_name}`}/>
      <div className={styles.poiInfo}>
        <p>{activePoi.display_name}</p>
        <p>{activePoi.address}</p>
      {user ? (
        <>
          {activePoi.is_quiet_space ? (
            <div className={styles.rateInfo}>
              <p>Wifi: {activePoi.wifi_rating}</p>        
              <p>Quiet: {activePoi.noise_level_rating}</p>        
              <p>Seating comfort: {activePoi.seating_comfort_rating}</p>
              <p>Charging accessibility: {activePoi.charging_accessibility_rating}</p> 
              <button onClick={() => setIsFormOpen(!isFormOpen)}>
                {!isFormOpen ? "Click to rate your experience" : "Close"}
              </button>
              {isFormOpen && <RatingForm setIsFormOpen={setIsFormOpen}/>}
            </div>
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
            <div className={styles.rateInfo}>
              <p>Wifi: {activePoi.wifi_rating}</p>        
              <p>Quiet: {activePoi.noise_level_rating}</p>        
              <p>Seating comfort: {activePoi.seating_comfort_rating}</p>        
              <p>Charging accessibility: {activePoi.charging_accessibility_rating}</p> 
              <NavLink className={styles.loginBtn} href={"/login"}>Login to rate your experience</NavLink>              
            </div>
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