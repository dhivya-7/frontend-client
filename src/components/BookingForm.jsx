import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./bookingform.css";

export default function BookingForm({ prefillCar, onClose }) {
  const [pickupLocation, setPickupLocation] = useState("");
  const [dropoffLocation, setDropoffLocation] = useState("");
  const [pickupCoords, setPickupCoords] = useState(null);
  const [dropoffCoords, setDropoffCoords] = useState(null);
  const [activeSelection, setActiveSelection] = useState("pickup");

  const [pickupDate, setPickupDate] = useState("");
  const [pickupTime, setPickupTime] = useState("");
  const [dropoffDate, setDropoffDate] = useState("");
  const [dropoffTime, setDropoffTime] = useState("");
  const [driverAge, setDriverAge] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [totalPrice, setTotalPrice] = useState(prefillCar?.price || 0);

  // Handles map clicks
  function LocationSelector() {
    useMapEvents({
      click(e) {
        const latlng = [e.latlng.lat, e.latlng.lng];
        if (activeSelection === "pickup") {
          setPickupCoords(latlng);
          setPickupLocation(`${latlng[0]},${latlng[1]}`);
        } else {
          setDropoffCoords(latlng);
          setDropoffLocation(`${latlng[0]},${latlng[1]}`);
        }
      },
    });
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!pickupCoords || !dropoffCoords || !pickupDate || !dropoffDate || !pickupTime || !dropoffTime || !driverAge) {
      alert("Please fill all required fields and select locations on the map.");
      return;
    }

    // Example: POST to backend
    const bookingData = {
      carId: prefillCar?.id,
      pickupLocation,
      dropoffLocation,
      pickupLatLng: pickupCoords,
      dropoffLatLng: dropoffCoords,
      pickupDate,
      pickupTime,
      dropoffDate,
      dropoffTime,
      driverAge,
      promoCode,
      totalPrice,
    };

    console.log("Booking Data:", bookingData);

    alert("Booking saved successfully!");

    if (onClose) onClose();
  };

  return (
    <div className="booking-form-container">
      {prefillCar && (
        <div className="selected-car">
          <img src={prefillCar.img} alt={prefillCar.name} />
          <h3>{prefillCar.name}</h3>
          <p>Price per day: ₹{prefillCar.price}</p>
        </div>
      )}

      <form className="yellow-bar" onSubmit={handleSubmit}>
        <input type="text" placeholder="Pickup Location" value={pickupLocation} readOnly />
        <input type="text" placeholder="Drop-off Location" value={dropoffLocation} readOnly />
        <input type="date" value={pickupDate} onChange={(e) => setPickupDate(e.target.value)} required />
        <input type="time" value={pickupTime} onChange={(e) => setPickupTime(e.target.value)} required />
        <input type="date" value={dropoffDate} onChange={(e) => setDropoffDate(e.target.value)} required />
        <input type="time" value={dropoffTime} onChange={(e) => setDropoffTime(e.target.value)} required />
        <input type="number" placeholder="Driver Age" value={driverAge} onChange={(e) => setDriverAge(e.target.value)} required />
        <input type="text" placeholder="Promo Code" value={promoCode} onChange={(e) => setPromoCode(e.target.value)} />
        <input type="number" placeholder="Total Price" value={totalPrice} onChange={(e) => setTotalPrice(e.target.value)} required />
        <button type="submit" className="submit-btn">Book Now</button>
      </form>

      <div className="map-section">
        <div className="map-buttons">
          <button type="button" className={activeSelection === "pickup" ? "active" : ""} onClick={() => setActiveSelection("pickup")}>Set Pickup</button>
          <button type="button" className={activeSelection === "dropoff" ? "active" : ""} onClick={() => setActiveSelection("dropoff")}>Set Drop-off</button>
        </div>
        <MapContainer center={[20.5937, 78.9629]} zoom={5} style={{ height: "300px", width: "100%" }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <LocationSelector />
          {pickupCoords && <Marker position={pickupCoords} />}
          {dropoffCoords && <Marker position={dropoffCoords} />}
        </MapContainer>
      </div>
    </div>
  );
}

