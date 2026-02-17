'use client'
import { useQuery, QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { createClient } from "@/utils/supabase/client"
import { useLocation } from "@/contexts/LocationContext"




export default function QuitePlacesByRadius(){
  
  const location = useLocation();
  const supabase = createClient();

  const queryClient = new QueryClient();

  const { isPending, isError, error, data} = useQuery({ queryKey: ["byRadius"], queryFn: fetchPlaces })

  if (isPending) return <span>Loading...</span>

  if (isError) return <span>An error occured: {`${error}`}</span>

  async function fetchPlaces() {
    
  }
  
  return (
    <>
      {data.array.forEach(element => {
        console.log(data.id);
      })};
    </>
  )

}