function GeoCodeError({ geoCodingError }) {
  return (
    <div style={{ display: "flex", justifyContent: "center", color: "red" }}>
      {geoCodingError}
    </div>
  );
}

export default GeoCodeError;
