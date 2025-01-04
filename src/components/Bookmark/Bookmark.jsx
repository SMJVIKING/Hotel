import { Link, useNavigate } from "react-router-dom";
import { useBookmarks } from "../context/BookmarkListContext";
import Loader from "../Loader/Loader";
import ReactCountryFlag from "react-country-flag";
import { HiTrash } from "react-icons/hi";

function Bookmark() {
  const navigate = useNavigate();
  const {
    isLoading,
    deleteBookmark,
    bookmarks = [],
    currentBookmarks = {},
  } = useBookmarks();

  if (isLoading) return <Loader />;
  if (!bookmarks.length) return <p>there is no bookmark Location</p>;

  const handleDelete = async (e, id) => {
    // این برای اینکه از رفتار پیش فرض تگ لینک ک این ایونت هندلر داخلش اجرا میشه جلوگیری بشه :
    e.preventDefault();
    await deleteBookmark(id);
  };

  return (
    <div>
      <button onClick={() => navigate(-1)} className="btn btn--primary">
        &larr;
      </button>
      <h2>BookmarkList</h2>
      <div className="bookmarkList">
        {bookmarks.map((item) => {
          return (
            <Link
              key={item.id}
              to={`${item.id}?lat=${item.latitude}&lng=${item.longitude}`}
            >
              <div
                className={`bookmarkItem
                ${
                  currentBookmarks &&
                  currentBookmarks.id &&
                  item.id === currentBookmarks.id
                    ? "current-bookmark"
                    : ""
                }
                `}
              >
                <div>
                  <ReactCountryFlag svg countryCode={item.countryCode} />
                  &nbsp; <strong>{item.cityName}</strong>
                  &nbsp; <span>{item.country}</span>
                </div>
                <button onClick={(e) => handleDelete(e, item.id)}>
                  <HiTrash className="trash" />
                </button>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default Bookmark;
