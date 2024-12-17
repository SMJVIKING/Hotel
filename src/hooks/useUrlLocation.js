import { useSearchParams } from "react-router-dom";

function useUrlLocation() {
      // این بخش برای وقتیه ک رو یکی از هتل ها کلیک میشه و لوکیشن مربوط ب دقیقا همون هتل رو باید بیاره :
  const [searchParams, setSearchParams] = useSearchParams();
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");
  return {lat,lng};
}

export default useUrlLocation;