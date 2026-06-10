import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/service_role";

const supabase = createClient();
const GOOGLE_API_KEY = process.env.GOOGLE_PLACES_CRON_API_KEY;
const CHUNK_SIZE = 100;

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function GET(request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const twelveMonthAgo = new Date();
    twelveMonthAgo.setMonth(twelveMonthAgo.getMonth() - 12);

    const { data: stalePlaces, error: dbError } = await supabase
      .from("poi_cache")
      .select("google_place_id")
      .lt("last_updated", twelveMonthAgo.toISOString())
      .limit(CHUNK_SIZE);

    if (dbError) throw dbError;
    if (!stalePlaces || stalePlaces.length === 0) {
      return Response.json({ message: "No stale records found" });
    }

    const updatedRecords = [];
    const deadRecords = [];

    const fetchPromises = stalePlaces.map(async (place) => {
      const oldId = place.google_place_id;
      const url = `https://places.googleapis.com/v1/places/${oldId}`;
      let ms = 200;
      let attempts = 0;

      while (attempts < 4) {
        try {
          const res = await fetch(url, {
            headers: {
              "X-Goog-Api-Key": GOOGLE_API_KEY,
              "X-Goog-FieldMask": "id",
            },
          });

          if (!res.ok) {
            const status = res.status;

            if (status === 404) {
              deadRecords.push(oldId);
              return;
            }

            if (status === 429 || status === 503) {
              attempts++;
              await delay(ms);
              ms *= 2;
              continue;
            }

            console.error(
              `Google API returned status ${status} for ID ${oldId}`,
            );
            return;
          }

          const responseBody = await res.json();
          const newId = responseBody.id;

          if (newId) {
            updatedRecords.push({ oldId, newId });
          }
          return;
        } catch (error) {
          console.error(`Network error checking ID ${oldId}:`, error.message);
          attempts++;
          await delay(ms);
          ms *= 2;
        }
      }
      console.warn(`Exhausted retries for Place ID: ${oldId}`);
    });

    await Promise.all(fetchPromises);

    const nowTimestamp = new Date().toISOString();

    for (const record of updatedRecords) {
      await supabase
        .from("poi_cache")
        .update({
          google_place_id: record.newId,
          last_updated: nowTimestamp,
        })
        .eq("google_place_id", record.oldId);
    }

    if (deadRecords.length > 0) {
      await supabase
        .from("poi_cache")
        .update({
          is_suitable: false,
          last_updated: nowTimestamp,
        })
        .in("google_place_id", deadRecords);
    }

    return NextResponse.json({
      processed: stalePlaces.length,
      updated_or_verified: updatedRecords.length,
      flagged_dead: deadRecords.length,
    });
  } catch (error) {
    console.error("Cron job internal error", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
