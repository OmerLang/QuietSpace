'use client'
import insertRating from "@/app/actions/insertRating";
import { useState } from "react";
import { usePois } from "@/contexts/PoisContext";
import styles from "./RatingForm.module.css"


  export default function RatingForm ({ isFormOpen, setIsFormOpen }) {

  
  const [loading, setLoading] = useState(false);
  const { activePoi, setActivePoi, setCachedPois } = usePois();
  const [ratings, setRatings] = useState({
    wifi: "",
    noise_level: "",
    seating_comfort: "",
    charging_accessibility: "",
    comment: ""
  });

  const handleChange = (e) => {
    setRatings({
      ...ratings,
      [e.target.name]: e.target.value
    })
  }

  const insertData = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await insertRating(activePoi, ratings);
      if (!response.passed){
        alert(response.error);
      } else {
          setIsFormOpen(false);
          const { lat, lng, ...rest } = response.updatedPoi;
          const updatedPoi = {
            ...rest,
            is_suitable: true,
            location: {
              lat,
              lng
            }
          }
          console.log("updatedPOI:", updatedPoi)
          setActivePoi((prev) =>
             ({ ...prev, ...updatedPoi })
          );
          setCachedPois((prev) => 
            prev.map((poi) => 
              poi.google_place_id === updatedPoi.google_place_id ? updatedPoi  : poi
            )
          );
          alert("Successfuly submited");
          setRatings({wifi: "",noise_level: "", seating_comfort: "", charging_accessibility: "", comment: ""});   
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
      <div className={styles.fieldDiv}>
        <label>Wifi:</label>
        <input name="wifi" type="number" value={ratings.wifi} onChange={handleChange} required min="1" max="5" placeholder="1-5"/>
      </div>
      <div className={styles.fieldDiv}>
        <label>Noise Level:</label>
        <input name="noise_level" type="number" value={ratings.noise_level} onChange={handleChange} required min="1" max="5" placeholder="1-5"/>
      </div>
      <div className={styles.fieldDiv}>
        <label>Seating Comfort:</label>
        <input name="seating_comfort" type="number" value={ratings.seating_comfort} onChange={handleChange} required min="1" max="5" placeholder="1-5"/>
      </div>
      <div className={styles.fieldDiv}>
        <label>Charging Accessibility:</label>
        <input name="charging_accessibility" type="number" value={ratings.charging_accessibility} onChange={handleChange} required min="1" max="5" placeholder="1-5"/>
      </div>
      <div className={styles.fieldDiv}>
        <label>{ratings.comment.length} / 200 Characters</label>
        <textarea name="comment" value={ratings.comment} onChange={handleChange} maxLength={200} placeholder="Tell us more..." />
      </div>
      <div className={styles.btnsWrapper}>
        <button type="Submit" disabled={loading} className={styles.btnText}>
          {loading ? "Saving..." : "Submit Rating"}
        </button>
        <button type="button" className={styles.closeFormBtn} onClick={() => setIsFormOpen(!isFormOpen)}>
           <span className={styles.btnText } >Close</span>
        </button>
      </div>
      </form>
  )

}