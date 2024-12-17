import {
  createContext,
  useContext,
  useEffect,
  useReducer,
} from "react";
import axios from "axios";
import toast from "react-hot-toast";
// context + usereducer :
// نکته: از اونجایی که ردیوسر ی پیور فانکشنه و ساید افکتی نباید
// داخلش باشه پس نمیتونیم داخل فانکشن مرتبط ب اون ساید افکت بزاریم
const BASE_URL = "http://localhost:5000";
const BookmarkContext = createContext();

const initianalState = {
  isLoading: false,
  currentBookmarks: null,
  bookmarks: [],
  error: null,
};
// از اونجایی ک تو ردیوسر ساید افکت نباید باشه =>
// پس اون بخش های مربوط ب ساید افکت تو خود فانکشن های اصلی میمونه
// و اون بخشی ک ساید افکت نداره رو میزاریم تو یوز ردیوسر

// in reducer fun we can't mutated our state=>so we clone it =>...state
function bookmarkReducer(state, action) {
  switch (action.type) {
    case "loading":
      return {
        ...state,
        isLoading: true,
      };
    case "bookmarks/loaded":
      return {
        ...state,
        isLoading: false,
        bookmarks: action.payload,
      };
    case "bookmark/loaded":
      return {
        ...state,
        isLoading: false,
        currentBookmarks: action.payload,
      };
    case "bookmark/created":
      return {
        ...state,
        isLoading: false,
        bookmarks: [...state.bookmarks, action.payload],
        currentBookmarks: action.payload,
      };
    case "bookmark/deleted":
      return {
        ...state,
        isLoading: false,
        bookmarks: state.bookmarks.filter((item) => item.id !== action.payload),
        currentBookmarks: null,
      };
    case "rejected":
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };

    default:
      throw new Error("Unknown action");
  }
}
// 1.pending 2.success 3.rejected

function BookmarkListProvider({ children }) {
  // const [currentBookmarks, setCurrentBookmarks] = useState(null);
  // const [bookmarks, setBookmarks] = useState([]);
  // const [isLoading, setIsLoading] = useState(false);
  // const { isLoading, data: bookmarks } = useFetch(`${BASE_URL}/bookmarks`);

  const [{ isLoading, currentBookmarks, bookmarks }, dispatch] = useReducer(
    bookmarkReducer,
    initianalState
  );

  async function getBookmarks(id) {
    // ?=>چون بوک مارک نال هس این رو میزاریم تا ارور نده

    // این ایف برای ایمکه ک وقتی رو ی بوک مارک کلیک شد بعد برگشتیم
    // ب بخش قبلی و دوباره روی اون بوک مارک کلیک کردیم دیگه بار دوم
    // علامت لودینگ رو نیاره و مستقیم اون بوک مارکو بیاره
    if (Number(id) === currentBookmarks?.id) return;

    dispatch({ type: "loading" });
    // setCurrentBookmarks(null);
    try {
      const { data } = await axios.get(`${BASE_URL}/bookmarks/${id}`);
      dispatch({ type: "bookmark/loaded", payload: data });
    } catch (error) {
      toast.error(error.message);
      dispatch({ type: "rejected", payload: error.message });
      // نکته تو پروزه واقعی=> میزنیم error.message
    }
  }

  // send data of bookmarks to back-end:
  async function createBookmarks(newBookmark) {
    dispatch({ type: "loading" });
    try {
      const { data } = await axios.post(`${BASE_URL}/bookmarks/`, newBookmark);
      dispatch({ type: "bookmark/created", payload: data });
      // setCurrentBookmarks(data);
      // setBookmarks((prev) => [...prev, data])
    } catch (error) {
      toast.error(error.message);
      dispatch({ type: "rejected", payload: error.message });
    }
  }

  // show data of bookmarks in BookmarkList:
  useEffect(() => {
    async function fetchBookmarkList() {
      dispatch({ type: "loading" });
      try {
        const { data } = await axios.get(`${BASE_URL}/bookmarks`);
        dispatch({ type: "bookmarks/loaded", payload: data });
      } catch (error) {
        toast.error(error.message);
        dispatch({ type: "rejected", payload: error.message });
      }
    }
    fetchBookmarkList();
  }, []);

  // delete bookmark:
  async function deleteBookmark(id) {
    dispatch({ type: "loading" });
    try {
      await axios.delete(`${BASE_URL}/bookmarks/${id}`);
      dispatch({ type: "bookmark/deleted", payload: id });
      // setBookmark((prev) => prev.filter((item) => item.id !== id))
    } catch (error) {
      toast.error(error.message);
      dispatch({ type: "rejected", payload: error.message });
    }
  }

  //  ب جای اینکه هی کامپوننت بنویسیم و هی پراپس و استیت
  //  پاس بدیم از ترکیب یوزردیوسر و یوزکانتکست استفاده میکنیم
  return (
    <BookmarkContext.Provider
      value={{
        isLoading,
        bookmarks,
        currentBookmarks,
        getBookmarks,
        createBookmarks,
        deleteBookmark,
      }}
    >
      {children}
    </BookmarkContext.Provider>
  );
}
export default BookmarkListProvider;

export function useBookmarks() {
  return useContext(BookmarkContext);
}

//  reducer function => is a pure function => so it's can't have any side effect inside it

// sync action => maybe have side effect's
// async action => have side effect's



// 1.pass dispatch: it's good for sync function's
// تو این الگو ما خود دیسپچ رو ب عنوان ولیو ب پرووایدر پاس میدیم
// و اون کامپوننتی ک از اون ولیو استفاده میکنه => دیسپچ رو میگیره
// و باید کا فانکشن (اکشن) رو داخل خود اون کامپوننت بنویسی 
// و این جالب نیس ما از کانتکست استفاده میکنیم ک دیگ نیاز ب کار نباشه دیگه
// پس حالا چرا باید کارو برعکس کنیم و کد اضافی توی کامپوننت هامون بزاریم


// 2.pass actions: it's good for async function's
// تو این الگو ما اکشن(فانکشن) هامون رو پاس میدیم ب کامپوننت ها و
//  اونا نیازی ندارن ک اون فانکشن رو داخل کامپوننت بنویسن 