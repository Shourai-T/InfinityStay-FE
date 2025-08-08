import React, { useState } from "react";
import {
  Calendar,
  Users,
  Star,
  Wifi,
  Car,
  Coffee,
  Shield,
  MapPin,
  Phone,
  Mail,
  Sparkles,
  Crown,
  Gem,
  ChevronDownIcon,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { showToast } from "../utils/toast";
import { rooms } from "../data/rooms";
import { formatCurrency } from "../utils/dateUtils";
import HomeImg from "../assets/imgs/home_img.jpg";
import { RoomSlider } from "../components/home/RoomSlider";
import { HomeHero } from "../components/home/HomeHero";
import { HomeFeatures } from "../components/home/HomeFeatures";
import { HomeContact } from "../components/home/HomeContact";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setDateRange, setGuests } from "../store/bookingSlice";

export default function Home() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [searchDates, setSearchDates] = useState({
    checkIn: "",
    checkOut: "",
    guests: 1,
  });

  const handleSearch = () => {
    const { checkIn, checkOut, guests } = searchDates;

    if (!checkIn || !checkOut) {
      toast.error("Vui lòng chọn ngày nhận và trả phòng");
      return;
    }

    //dispatch vào redux store
    dispatch(setDateRange({ checkIn, checkOut }));
    dispatch(setGuests(guests));

    // chuyển route
    navigate("/phong");
  };

  return (
    <div className="min-h-screen bg-gradient-luxury">
      {/* Hero Section */}
      <HomeHero
        searchDates={searchDates}
        setSearchDates={setSearchDates}
        onSearch={handleSearch}
      />
      {/* Features Section */}
      <HomeFeatures />
      {/* Room Slider Section */}
      <RoomSlider />
      {/* Contact Section */}
      <HomeContact />
    </div>
  );
}
