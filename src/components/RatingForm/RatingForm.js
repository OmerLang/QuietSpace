'use client'
import insertRating from "@/app/actions/insertRating";
import { useEffect, useState } from "react";
import { usePois } from "@/contexts/PoisContext";
import styles from "./RatingForm.module.css"
import StarsForm from "../Map/Markers/MarkerWithInfoWindow/StarsForm/StarsForm";

  export default function RatingForm ({ isFormOpen, setIsFormOpen, existingRating }) {

  
  const [loading, setLoading] = useState(false);
  const { activePoi, setActivePoi, setCachedPois, setRatedPois } = usePois();
  const [filled, setIsFilled] = useState(true);
  const [activetimer, setActiveTimer] = useState(false);
  const [rateSuccess, setRateSuccess] = useState('idle');
  const [ratings, setRatings] = useState(existingRating || {
    wifi_rating: 0,
    noise_level_rating: 0,
    seating_comfort_rating: 0,
    charging_accessibility_rating: 0,
    comment: ""
  });

  useEffect(() => {
    if (existingRating && existingRating.google_place_id){
      setRatings(existingRating)
    }
    else {
      setRatings({
        wifi_rating: 0,
        noise_level_rating: 0,
        seating_comfort_rating: 0,
        charging_accessibility_rating: 0,
        comment: ""
      })
    }
  },[activePoi, existingRating])


  const validateFill = () => {
    const isAllFilled = (ratings.noise_level_rating >= 1 && ratings.wifi_rating >= 1 && ratings.seating_comfort_rating >= 1 && ratings.charging_accessibility_rating >= 1) 
    if (!isAllFilled) {
      setIsFilled(false)
      setActiveTimer(true)
      setTimeout(() => setActiveTimer(false), 1500)
      return false;
    }
    setIsFilled(true)
    return true;
  }

  const handleChange = (e) => {
    setRatings({
      ...ratings,
      [e.target.name]: e.target.value
    })
  }

  const insertData = async (e) => {
    e.preventDefault();
    const allFilled = validateFill();
    if (!allFilled)
      return
    setLoading(true);
    try {
      const response = await insertRating(activePoi, ratings);
      if (!response.passed){
        setRateSuccess('error');
      } else {
        setRateSuccess('success');
        setRatedPois((prev) => {
          const updatedMap = new Map(prev);
          updatedMap.set(response.updatedPoi.google_place_id, response.updatedPoi)
          return updatedMap;
        })
          const { lat, lng, ...rest } = response.updatedPoi;
          const updatedPoi = {
            ...rest,
            location: {
              lat,
              lng
            }
          }
          setActivePoi((prev) =>
            ({ ...prev, ...updatedPoi })
          );
          setCachedPois((prev) => 
            prev.map((poi) => 
              poi.google_place_id === updatedPoi.google_place_id ? updatedPoi  : poi
            )
          );
          setRatings({wifi_rating: 0,noise_level_rating: 0, seating_comfort_rating: 0, charging_accessibility_rating: 0, comment: ""});   
          setTimeout(() => {
            setIsFormOpen(false)},2000)
        }
    } catch (err) {
        console.error(err);
    }
    finally {
      setLoading(false);
    }
  }


  return (
    <form className={styles.ratingForm} onSubmit={insertData}>
       <div className={styles.formGrid}> 
        <div className={styles.fieldDiv}>
          <label>Quiet</label>
          <div className={`${styles.popup} ${!filled && activetimer && (ratings.noise_level_rating < 1) ? styles.showPopup : ""}`}><span className={styles.popupTextRed}>Must be filled</span></div>
          <StarsForm ratings={ratings} setRatings={setRatings} inputName={"noise_level_rating"}/>
        </div>
        <div className={styles.fieldDiv}>
          <label>Wifi</label>
          <div className={`${styles.popup} ${!filled && activetimer && (ratings.wifi_rating < 1) ? styles.showPopup : ""}`}><span className={styles.popupTextRed}>Must be filled</span></div>
          <StarsForm ratings={ratings} setRatings={setRatings} inputName={"wifi_rating"}/>
        </div>
        <div className={styles.fieldDiv}>
          <label>Seating Comfort</label>
          <div className={`${styles.popup} ${!filled && activetimer && (ratings.seating_comfort_rating < 1) ? styles.showPopup : ""}`}><span className={styles.popupTextRed}>Must be filled</span></div>                
          <StarsForm ratings={ratings} setRatings={setRatings} inputName={"seating_comfort_rating"}/>
        </div>
        <div className={styles.fieldDiv}>
          <label>Charging Accessibility</label>
          <div className={`${styles.popup} ${!filled && activetimer && (ratings.charging_accessibility_rating < 1) ? styles.showPopup : ""}`}><span className={styles.popupTextRed}>Must be filled</span></div>
          <StarsForm ratings={ratings} setRatings={setRatings} inputName={"charging_accessibility_rating"}/>
        </div>
        <div className={styles.fieldDivText}>
          <textarea name="comment" value={ratings.comment} onChange={handleChange} maxLength={200} placeholder="Tell us more..." />
          <label>{(ratings.comment || "").length} / 200</label>
        </div>
      </div>
      <div className={`${styles.popup} ${(rateSuccess === 'error' || rateSuccess === 'success') ? styles.showPopup : ""}`}>
        <span className={`${rateSuccess === 'error' && styles.popupTextRed} ${rateSuccess === 'success' && styles.popupTextGreen}`}>{rateSuccess === 'error' ? 'Rating failed, please try again' : rateSuccess === 'success' ? 'Successfully rated, thank you!' : "" }</span>
      </div>
      <div className={styles.btnsWrapper}>
        <button type="Submit" disabled={loading}>
          <span className={styles.btnText}>{loading ? "Saving..." : "Submit Rating"}</span>
        </button>
        <button type="button" className={styles.closeFormBtn} onClick={() => setIsFormOpen(!isFormOpen)}>
           <span className={styles.btnText } >Close</span>
        </button>
      </div>
      </form>
  )

}