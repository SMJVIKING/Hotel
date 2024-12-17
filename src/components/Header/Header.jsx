import { MdLocationOn, MdLogout } from "react-icons/md";
import { HiCalendar, HiLogout, HiMinus, HiPlus, HiSearch } from "react-icons/hi";
import { useRef, useState } from "react";
import useOutsideClick from "../../hooks/useOutsideClick";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import { DateRange } from "react-date-range";
import { format } from "date-fns";
import {
  createSearchParams,
  NavLink,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { useAuth } from "../context/AuthProvider";


function Header() {
  // destination:
  const [searchParams, setSearchParams] = useSearchParams(); 
  const [destination, setDestination] = useState(searchParams.get("destination") || "");
  // options:
  const [openOptions, setOpenOptions] = useState(false);
  const [options, setOptions] = useState({
    adult: 0,
    children: 0,
    room: 0,
  });
  // date:
  const [date, setDate] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);
  const [openDate, setOpenDate] = useState(false);
  // search location:
  const navigate = useNavigate();

  // name اگر داخل براکت نباشه ب عنوان ی مقدار جدید جایگزین پراپرتی
  //  های قبلی میشه ولی ب کمک براکت پراپرتی های موجود رو داینامیک میکنه
  const handleOptions = (name, operation) => {
    setOptions((prev) => {
      return {
        ...prev,
        [name]: operation === "inc" ? options[name] + 1 : options[name] - 1,
      };
    });
  };

  // نکات این بخش رو تو نوت بخون
   const handleSearch = () => {
    const encodedParams = createSearchParams({
      date: JSON.stringify(date),
      destination,
      options: JSON.stringify(options),
    });
    // setSearchParams(encodedParams);
    // refresh:
    navigate({
      pathname:"/hotels",
      search:encodedParams.toString(),
      // toString => must we do that because its an object
    })
  };


  return (
    <div className="header">
      <NavLink to="/bookmark">Bookmarks</NavLink>

      <div className="headerSearch">

        <div className="headerSearchItem">
          <MdLocationOn className="headerIcon locationIcon" />
          <input
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            type="text"
            placeholder="where to go?"
            className="headerSearchInput"
            name="destination"
            id="destination"
          />
          <span className="seperator"></span>
        </div>

        <div className="headerSearchItem">
          <HiCalendar className="headerIcon dateIcon" />
          <div className="dateDropDown" onClick={() => setOpenDate(!openDate)}>
            {`${format(date[0].startDate, "MM/dd/yyyy")} to ${format(
              date[0].endDate,
              "MM/dd/yyyy"
            )}`}
          </div>
          {openDate && (
            <DateRange
              onChange={(item) => setDate([item.selection])}
              ranges={date}
              className="date"
              minDate={new Date()}
              moveRangeOnFirstSelection={true}
            />
          )}
          <span className="seperator"></span>
        </div>

        <div className="headerSearchItem">
          <div id="optionDropDown" onClick={() => setOpenOptions(!openOptions)}>
            {options.adult} adult &bull; {options.children} children &bull;{" "}
            {options.room} room
          </div>
          {/* این دیو بچه قراره پوزیش absolute بگیره نسبت ب تگ پدرش */}
          {openOptions && (
            <GuestOptionList
              setOpenOptions={setOpenOptions}
              options={options}
              handleOptions={handleOptions}
            />
          )}
          <span className="seperator"></span>
        </div>

        <div className="headerSearchItem">
          <button className="headerSearchBtn" onClick={handleSearch}>
            <HiSearch className="headerIcon" />
          </button>
        </div>
        
      </div>

      <User/>
     
    </div>
  );
}
export default Header;

function GuestOptionList({ options, handleOptions, setOpenOptions }) {
  const optionRef = useRef();
  useOutsideClick(optionRef, "optionDropDown", () => {
    setOpenOptions(false);
  });

  return (
    <div className="guestOptions" ref={optionRef}>
      <OptionItem
        handleOptions={handleOptions}
        options={options}
        type="adult"
        minLimit={0}
      />
      <OptionItem
        handleOptions={handleOptions}
        options={options}
        type="children"
        minLimit={0}
      />
      <OptionItem
        handleOptions={handleOptions}
        options={options}
        type="room"
        minLimit={0}
      />
    </div>
  );
}

function OptionItem({ options, type, minLimit, handleOptions }) {
  return (
    <div className="guestOptionItem">
      <span className="optionText">{type}</span>
      <div className="optionCounter">
        <button
          onClick={() => handleOptions(type, "dec")}
          className="optionCounterBtn"
          // چون typeیکی از پراپرتی های option نیس پس نمیشه دات تایپ بزنیم تا سلکت بشه و راه جایگزین براکته
          disabled={options[type] <= minLimit}
        >
          <HiMinus className="icon" />
        </button>
        <span className="optionCounterNumber">{options[type]}</span>
        <button
          onClick={() => handleOptions(type, "inc")}
          className="optionCounterBtn"
        >
          <HiPlus className="icon" />
        </button>
      </div>
    </div>
  );
}

function User() {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div>
      {isAuthenticated ? (
        <div>
          <strong>{user.name}</strong>
          <button>
            &nbsp; <MdLogout onClick={handleLogout} className="logout icon" />
          </button>
        </div>
      ) : (
        
        <NavLink to="/login">Login</NavLink>
      )}
    </div>
  );
}
