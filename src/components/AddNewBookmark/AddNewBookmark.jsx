import { useNavigate } from "react-router-dom";
import useUrlLocation from "../../hooks/useUrlLocation";
import { useEffect, useState } from "react";
import axios from "axios";
import Loader from "../Loader/Loader";
import ReactCountryFlag from "react-country-flag";
import GeoCodeError from "../GeoCodeError/GeoCodeError";
import { useBookmarks } from "../context/BookmarkListContext";

const BASE_GEOCODING_URL =
  "https://api.bigdatacloud.net/data/reverse-geocode-client";

function AddNewBookmark() {
  const navigate = useNavigate();
  const { lat, lng } = useUrlLocation();
  const [cityName, setCityName] = useState("");
  const [country, setCountry] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [isLoadingGeoCoding, setIsLoadingGeoCoding] = useState(false);
  const [geoCodingError, setGeoCodingError] = useState(null);

const {createBookmarks}=useBookmarks();

  // its work in mac laptop:
  // function getFlagEmoji(countryCode) {
  //   const codePoints = countryCode
  //     .toUpperCase()
  //     .split("")
  //     .map((char) => 127397 + char.charCodeAt());
  //   return String.fromCodePoint(...codePoints);
  // }

  // برای اینکه بتونیم لوکیشن مد نظر رو اد کنیم نیاز ب ی ای پی ای بنام
  // reverce geocoding clientنیاز داریم ک میتونی از سایت  big data بگیری :

  // براساس این یوزافکت ی رکوئست میفرسته ب این ای پی ای و طبق اون اطلاعات لوکیشنو پیدا میکنه:
  useEffect(() => {
    if (!lat || !lng) return;

    async function fetchLocationData() {
      setIsLoadingGeoCoding(true);
      setGeoCodingError(null);

      try {
        const { data } = await axios.get(
          `${BASE_GEOCODING_URL}?latitude=${lat}&longitude=${lng}`
        );

        if (!data.countryCode)
          throw new Error(
            "this location is not a city ! please click somewhere else."
          );

        setCityName(data.city || data.locality || "");
        setCountry(data.countryName);
        setCountryCode(data.countryCode);
        // setCountryCode(getFlagEmoji(data.countryCode));
      } catch (error) {
        setGeoCodingError(error.message);
      } finally {
        setIsLoadingGeoCoding(false);
      }
    }
    fetchLocationData();
  }, [lat, lng]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!cityName || !country) return;

    const newBookmark = {
      cityName,
      country,
      countryCode,
      latitude: lat,
      longitude: lng,
      host_location: cityName + "" + country,
    };

   await createBookmarks(newBookmark);
   navigate("/bookmark");
  };


  if (isLoadingGeoCoding) return <Loader />;
  if (geoCodingError) return <GeoCodeError geoCodingError={geoCodingError} />;

  return (
    <div>
      <h2>Bookmark New Location</h2>
      <form className="form" onSubmit={handleSubmit}>
        <div className="formControl">
          <label htmlFor="cityName">CityName</label>
          <input
            value={cityName}
            onChange={(e) => setCityName(e.target.value)}
            type="text"
            name="cityName"
            id="cityName"
          />
        </div>
        <div className="formControl">
          <label htmlFor="country">Country</label>
          <input
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            type="text"
            name="country"
            id="country"
          />
          <ReactCountryFlag className="flag" svg countryCode={countryCode} />
          {/* <span className="flag">{countryCode}</span> */}
        </div>

        <div className="buttons">
          <button
            className="btn btn--primary"
            onClick={(e) => {
              // توی فرم ها رفرش داریم => اینجا ک بک میزنیم رفرش میشه و
              // برای جلوگیری از این =>این خط کد رو زدیم
              e.preventDefault();
              navigate(-1);
            }}
          >
            &larr; back
          </button>
          <button className="btn btn--primary">add</button>
        </div>
      </form>
    </div>
  );
}

export default AddNewBookmark;
