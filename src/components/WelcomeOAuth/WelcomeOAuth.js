"use client";

import { useEffect, useState, Suspense, useMemo } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import styles from "./WelcomeOAuth.module.css";

function WelcomeOAuthContent() {
  const [isOpen, setIsOpen] = useState(null);
  const [userName, setUserName] = useState("");

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    let timeoutId;
    if (searchParams.get("welcome") === "true") {
      const getProfileData = async () => {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user) {
          const splitEmail = user.email.split("@")[0];
          setUserName(
            user.user_metadata?.full_name?.split(" ")[0] || splitEmail,
          );
          setIsOpen(true);
        }
      };

      getProfileData();

      timeoutId = setTimeout(() => {
        const params = new URLSearchParams(searchParams.toString());
        params.delete("welcome");
        const newQuery = params.toString() ? `?${params.toString()}` : "";
        router.replace(`${pathname}${newQuery}`, { scroll: false });
        setIsOpen(false);
      }, 3000);
    }
    return () => {
      clearTimeout(timeoutId);
    };
  }, [searchParams, router, pathname, supabase]);

  return (
    <div
      className={`${styles.container} ${isOpen === true ? styles.showWelcome : isOpen === false ? styles.hideWelcome : ""}`}
    >
      <button className={styles.closeBtn} onClick={() => setIsOpen(false)}>
        <span className={styles.x1}></span>
        <span className={styles.x2}></span>
      </button>
      <div className={styles.welcomeText}>
        <h1>Welcome</h1> <span>{userName}</span>
      </div>
    </div>
  );
}

export default function WelcomeOAuth() {
  return (
    <Suspense fallback={null}>
      <WelcomeOAuthContent />
    </Suspense>
  );
}
