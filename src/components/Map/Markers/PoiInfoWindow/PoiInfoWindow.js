'use client';
import { useAuth } from "@/contexts/AuthContext";
import styles from './PoiInfoWindow.module.css'
import { useEffect, useState } from "react";
import RatingForm from "@/components/RatingForm/RatingForm";
import { usePois } from "@/contexts/PoisContext";
import NavLink from "@/components/Navigation/NavLink/NavLink";
import Login from "@/app/login/page";
import StarRating from "../MarkerWithInfoWindow/StarRating/StarRating";


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
            <>
            <div className={`${styles.wrapper} ${!isFormOpen ? styles.ratingVisible : styles.formVisible}`}>
              <div className={`${styles.rateInfo} ${isFormOpen && styles.hideRatingsText}`}>
                <div className={styles.rateWrapper}> <span>Wifi:</span><StarRating rating={activePoi.wifi_rating}/></div>   
                <div className={styles.rateWrapper}> <span>Quiet:</span><StarRating rating={activePoi.noise_level_rating}/></div>    
                <div className={styles.rateWrapper}> <span>Seating Comfort:</span><StarRating rating={activePoi.seating_comfort_rating}/></div>    
                <div className={styles.rateWrapperC}> <span>Charging Accessibility:</span><StarRating rating={activePoi.charging_accessibility_rating}/></div>  
                {!isFormOpen && 
                <button className={styles.openFormBtn} onClick={() => setIsFormOpen(!isFormOpen)}>
                  <span className={styles.btnText }>Rate your experience</span>
                </button>}  
              </div>
              <div className={`${styles.formInfo} ${isFormOpen && styles.formVisibleText}`}>
                <RatingForm  isFormOpen={isFormOpen} setIsFormOpen={setIsFormOpen}/>
              </div>
              
            </div>
            
              </>
            ) : (
            <>
              <div className={`${styles.wrapper} ${!isFormOpen ? styles.ratingVisible : styles.formVisible}`}>
                <div className={`${styles.rateInfo} ${isFormOpen && styles.hideRatingsText}`}>
                {!isFormOpen && 
                  <button className={styles.openFormBtnAdd} onClick={() => setIsFormOpen(!isFormOpen)}>
                    <span className={styles.btnText}>Add to QuietSpace</span>
                  </button>}
                </div>
                {isFormOpen && 
                  <div className={`${styles.formInfo} ${isFormOpen && styles.formVisibleText}`}>
                    <RatingForm  isFormOpen={isFormOpen} setIsFormOpen={setIsFormOpen}/>
                  </div>}             
              </div>
            </>
          )}
        </>
      ) : (
        <>
          {activePoi.is_quiet_space ? (
            <>
            <div className={styles.rateInfo}>
              <div className={styles.rateWrapper}> <span>Wifi:</span><StarRating rating={activePoi.wifi_rating}/></div>   
              <div className={styles.rateWrapper}> <span>Quiet:</span><StarRating rating={activePoi.noise_level_rating}/></div>    
              <div className={styles.rateWrapper}> <span>Seating Comfort:</span><StarRating rating={activePoi.seating_comfort_rating}/></div>    
              <div className={styles.rateWrapperC}> <span>Charging Accessibility:</span><StarRating rating={activePoi.charging_accessibility_rating}/></div>    
            </div>
            <NavLink className={styles.loginBtn} href={"/login"}><span className={styles.btnText}>Login to rate your experience</span></NavLink>              
            </>
          ) : (
            <>
              <NavLink className={styles.loginBtnNotQuietSpace} href={"/login"}><span className={styles.btnText}>Login to add to QuietSpace</span></NavLink>              
            </>
        )}
        </>
      )}
      </div>
    </div>
  )
}