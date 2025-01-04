import { useNavigate, useParams } from "react-router-dom";
import { useBookmarks } from "../context/BookmarkListContext";
import Loader from "../Loader/Loader";
import { useEffect } from "react";
import ReactCountryFlag from "react-country-flag";

function SingleBookmark() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { currentBookmarks, isLoading, getBookmarks } = useBookmarks();

  useEffect(() => {
    getBookmarks(id);
  }, [id]);

  if (isLoading || !currentBookmarks) return <Loader />;

  return (
    <div>
      <button onClick={() => navigate(-1)} className="btn btn--primary">
        &larr;
      </button>
      <div>
        <h2>{currentBookmarks.cityName}</h2>
        <div className="bookmarkItem">
          <ReactCountryFlag svg countryCode={currentBookmarks.countryCode} />
          &nbsp; <strong>{currentBookmarks.cityName}</strong>
          &nbsp; <span>{currentBookmarks.country}</span>
        </div>
      </div>
    </div>
  );
}
export default SingleBookmark;
