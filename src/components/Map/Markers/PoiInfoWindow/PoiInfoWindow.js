"use client";
import { useAuth } from "@/contexts/AuthContext";
import styles from "./PoiInfoWindow.module.css";
import { useState } from "react";
import RatingForm from "@/components/RatingForm/RatingForm";
import { usePois } from "@/contexts/PoisContext";
import NavLink from "@/components/Navigation/NavLink/NavLink";
import SingleStar from "../MarkerWithInfoWindow/StarRating/SingleStar";
import { useMenu } from "@/contexts/MenuContext";

export default function PoiInfoWindow() {
  const { activePoi, setActivePoi, ratedPois } = usePois();
  const { user } = useAuth();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { openOverlay } = useMenu();

  const fallbackImage = "/images/fallback.jpg";
  const imageSource = activePoi.photo_url || fallbackImage;

  const existingRating = ratedPois.get(activePoi?.google_place_id);

  const openLoginBtn = () => {
    setActivePoi(null);
    openOverlay("login");
  };

  return (
    <div className={styles.popupWindow} key={activePoi.google_place_id}>
      <img
        className={styles.image}
        src={imageSource}
        alt={`Photo of ${activePoi.display_name}`}
      />
      <div className={styles.poiInfo}>
        <p>{activePoi.display_name}</p>
        <p>{activePoi.address}</p>
        {user ? (
          <>
            {activePoi.is_quiet_space ? (
              <>
                <div
                  className={`${styles.wrapper} ${!isFormOpen ? styles.ratingVisible : styles.formVisible}`}
                >
                  <div
                    className={`${styles.rateInfo} ${isFormOpen && styles.hideRatingsText}`}
                  >
                    <div className={styles.innerWrap}>
                      <div className={styles.rateWrapper}>
                        {" "}
                        <span>Quiet</span>
                        <div className={styles.scoreStar}>
                          <span className={styles.score}>
                            {activePoi.noise_level_rating}
                          </span>
                          <SingleStar rating={activePoi.noise_level_rating} />
                        </div>
                      </div>
                      <div className={styles.rateWrapper}>
                        {" "}
                        <span>Wifi</span>
                        <div className={styles.scoreStar}>
                          <span className={styles.score}>
                            {activePoi.wifi_rating}
                          </span>
                          <SingleStar rating={activePoi.wifi_rating} />
                        </div>
                      </div>
                      <div className={styles.rateWrapper}>
                        {" "}
                        <span>Seating Comfort</span>
                        <div className={styles.scoreStar}>
                          <span className={styles.score}>
                            {activePoi.seating_comfort_rating}
                          </span>
                          <SingleStar
                            rating={activePoi.seating_comfort_rating}
                          />
                        </div>
                      </div>
                      <div className={styles.rateWrapperC}>
                        {" "}
                        <span>Charging Accessibility</span>
                        <div className={styles.scoreStar}>
                          <span className={styles.score}>
                            {activePoi.charging_accessibility_rating}
                          </span>
                          <SingleStar
                            rating={activePoi.charging_accessibility_rating}
                          />
                        </div>
                      </div>
                    </div>
                    {!isFormOpen && (
                      <button
                        className={styles.openFormBtn}
                        onClick={() => setIsFormOpen(!isFormOpen)}
                      >
                        <span className={styles.btnText}>
                          {!existingRating?.google_place_id
                            ? "Rate your experience"
                            : "Edit your rating"}{" "}
                        </span>
                      </button>
                    )}
                  </div>
                  <div
                    className={`${styles.formInfo} ${isFormOpen && styles.formVisibleText}`}
                  >
                    <RatingForm
                      key={activePoi.google_place_id}
                      isFormOpen={isFormOpen}
                      setIsFormOpen={setIsFormOpen}
                      existingRating={existingRating}
                    />
                  </div>
                </div>
              </>
            ) : (
              <>
                <div
                  className={`${styles.wrapper} ${!isFormOpen ? styles.ratingVisible : styles.formVisible}`}
                >
                  <div
                    className={`${styles.rateInfo} ${isFormOpen && styles.hideRatingsText}`}
                  >
                    {!isFormOpen && (
                      <button
                        className={styles.openFormBtnAdd}
                        onClick={() => setIsFormOpen(!isFormOpen)}
                      >
                        <span className={styles.btnText}>
                          Add to QuietSpace
                        </span>
                      </button>
                    )}
                  </div>
                  {isFormOpen && (
                    <div
                      className={`${styles.formInfo} ${isFormOpen && styles.formVisibleText}`}
                    >
                      <RatingForm
                        isFormOpen={isFormOpen}
                        setIsFormOpen={setIsFormOpen}
                      />
                    </div>
                  )}
                </div>
              </>
            )}
          </>
        ) : (
          <>
            {activePoi.is_quiet_space ? (
              <>
                <div className={styles.innerWrap}>
                  <div className={styles.rateWrapper}>
                    {" "}
                    <span>Quiet</span>
                    <div className={styles.scoreStar}>
                      <span className={styles.score}>
                        {activePoi.noise_level_rating}
                      </span>
                      <SingleStar rating={activePoi.noise_level_rating} />
                    </div>
                  </div>
                  <div className={styles.rateWrapper}>
                    {" "}
                    <span>Wifi</span>
                    <div className={styles.scoreStar}>
                      <span className={styles.score}>
                        {activePoi.wifi_rating}
                      </span>
                      <SingleStar rating={activePoi.wifi_rating} />
                    </div>
                  </div>
                  <div className={styles.rateWrapper}>
                    {" "}
                    <span>Seating Comfort</span>
                    <div className={styles.scoreStar}>
                      <span className={styles.score}>
                        {activePoi.seating_comfort_rating}
                      </span>
                      <SingleStar rating={activePoi.seating_comfort_rating} />
                    </div>
                  </div>
                  <div className={styles.rateWrapperC}>
                    {" "}
                    <span>Charging Accessibility</span>
                    <div className={styles.scoreStar}>
                      <span className={styles.score}>
                        {activePoi.charging_accessibility_rating}
                      </span>
                      <SingleStar
                        rating={activePoi.charging_accessibility_rating}
                      />
                    </div>
                  </div>
                </div>
                <button className={styles.loginBtn} onClick={openLoginBtn}>
                  <span className={styles.btnTextUnlogged}>
                    Login to rate your experience
                  </span>
                </button>
              </>
            ) : (
              <>
                <button className={styles.loginBtn} onClick={openLoginBtn}>
                  <span className={styles.btnTextUnlogged}>
                    Login to add to QuietSpace
                  </span>
                </button>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
