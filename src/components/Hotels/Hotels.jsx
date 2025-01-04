import { Link, useNavigate } from "react-router-dom";
import Loader from "../Loader/Loader";
import { useHotels } from "../context/HotelsProvider";
// نکته:نتیجه سرچ هتلها باید علاوه بر کامپوننت هتل تو بقیه کامپوننت ها از جمله کامپوننت مپ هم در دسترس باشه
//  => پس بهترین گزینه اینه ک نتیجه سرچ رو داخل ی کانتکست قرار بدیم

function Hotels() {
  const navigate = useNavigate();
  const { isLoading, hotels, currentHotel } = useHotels();
  if (isLoading) <Loader />;

  return (
    <div>
      <button onClick={() => navigate(-1)} className="btn btn--primary">
        &larr;
      </button>

      <div className="searchList">
        <h2>Search results ({hotels.length})</h2>
        {hotels.map((item) => {
          return (
            <Link
              key={item.id}
              to={`/hotels/${item.id}?lat=${item.latitude}&lng=${item.longitude}`}
            >
              <div
                className={`searchItem  ${
                  item.id === currentHotel?.id ? "current-hotel" : ""
                }`}
              >
                <img src={item.thumbnail_url} alt={item.name} />
                <div className="searchItemDesc">
                  <p className="location">{item.smart_location}</p>
                  <p className="name">{item.name}</p>
                  €&nbsp;{item.price} &nbsp;
                  <span>night</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
export default Hotels;

// _like => دیتای مشابه رو میاره ینی نیاز نیس حتما حروف بزرگ و
//  کوچک و همه چیز کلمه ای ک سرچ کردی مث اون دیتا باشه

// اگر بخایم موقع سرچ هردیتایی ک همچین مدل مشابهی رو تو اون دید نشون بده=>
// فقط این مدلی مینویسیم نمیخاد اسم و لوکیشن رو جدا سرچ کنه
// q=${destination || ""} q =>it's mean query string

// host_location_like=${destination || ""}&
// name_like=${destination || ""}&
