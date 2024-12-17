import { Outlet } from "react-router-dom";
import Map from "../Map/Map";
import { useBookmarks } from "../context/BookmarkListContext";

function BookmarkLayout() {
const {bookmarks}=useBookmarks();

    return (
        <div className="appLayout">
          <div className="sidebar">
            <Outlet />
          </div>
         <Map markerLocation={bookmarks}/>
        </div>
      );
}
export default BookmarkLayout;


// Bookmark
// bookmark/id 