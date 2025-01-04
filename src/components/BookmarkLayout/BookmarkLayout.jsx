import { Outlet } from "react-router-dom";
import Map from "../Map/Map";
import { useBookmarks } from "../context/BookmarkListContext";

function BookmarkLayout() {
  const { bookmarks } = useBookmarks();

  return (
    // <div className="appLayout">
    //   <div className="sidebar">
    //     <Outlet />
    //   </div>
    //     <Map markerLocation={bookmarks} />
    // </div>

    <div className="appLayout">
    <span className="sidebar">
        <Outlet />
    </span>
    <span className="map">
        <Map markerLocation={bookmarks} />
    </span>
</div>

  );
}
export default BookmarkLayout;
