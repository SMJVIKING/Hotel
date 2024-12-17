import { useSearchParams } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import { createContext, useContext, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const BASE_URL = "http://localhost:5000/hotels";
const HotelContext = createContext();


function HotelsProvider({ children }) {
  const [currentHotel, setCurrentHotel] = useState(null);
  const [isLoadingCurrHotel, setIsLoadingCurrHotel] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const destination = searchParams.get("destination");
  // ?=>برای اینکه اگ روم وجود نداشت ارور نده
  // JSON.parse=>برای اینکه دیتا ب ی چیز قابل فهم تبدیل بشه و استرینگ نباشه
  const room = JSON.parse(searchParams.get("options"))?.room;


  const { isLoading, data: hotels } = useFetch(
    BASE_URL,
    `q=${destination || ""}&accommodates_gte=${room || 1}`
  );

  async function getHotel(id) {
    setIsLoadingCurrHotel(true);
    try {
      const { data } = await axios.get(`${BASE_URL}/${id}`);
      
      setIsLoadingCurrHotel(false);
      setCurrentHotel(data);
    } catch (error) {
      toast.error(error.message);
      setIsLoadingCurrHotel(false);
    }
  }
  

  return (
    <HotelContext.Provider
      value={{ isLoading, hotels,currentHotel, getHotel, isLoadingCurrHotel }}
    >
      {children}
    </HotelContext.Provider>
  );
}
export default HotelsProvider;

export function useHotels() {
  return useContext(HotelContext);
}
