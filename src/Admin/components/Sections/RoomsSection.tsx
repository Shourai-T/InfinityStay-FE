import React, { useState, useEffect } from "react";
import { Plus, RefreshCw } from "lucide-react";
import { Room } from "../../types/types";
import SectionHeader from "../UI/SectionHeader";
import SearchBox from "../UI/SearchBox";
import RoomCard from "../Rooms/RoomCard";
import RoomModal from "../Rooms/RoomModal";
import {
  getRooms,
  createRoom,
  updateRoom,
  deleteRoom,
} from "../../services/RoomsService";

interface RoomsSectionProps {
  rooms: Room[];
  setRooms: React.Dispatch<React.SetStateAction<Room[]>>;
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
}

const RoomsSection: React.FC<RoomsSectionProps> = ({
  rooms,
  setRooms,
  searchTerm,
  setSearchTerm,
}) => {
  const [showRoomModal, setShowRoomModal] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [roomForm, setRoomForm] = useState<Partial<Room>>({
    name: "",
    type: "single",
    price: 0,
    maxGuests: 1,
    area: 0,
    amenities: [],
    images: [],
    shortDescription: "",
    fullDescription: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await getRooms(token || "");

      if (response.data && response.data.result) {
        // Transform API response to match our Room interface
        const apiRooms = response.data.result.map((apiRoom: any) => ({
          id: apiRoom.roomId,
          name: apiRoom.name,
          type: apiRoom.roomType,
          price: apiRoom.priceByDay,
          maxGuests: apiRoom.maxPeople,
          area: apiRoom.sizeRoom,
          amenities: apiRoom.amenities || [],
          images: apiRoom.images || [],
          shortDescription: apiRoom.shortDescription,
          fullDescription: apiRoom.fullDescription,
        }));
        setRooms(apiRooms);
      }
      setError(null);
    } catch (err) {
      console.error("Error fetching rooms:", err);
      setError("Không thể tải danh sách phòng. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveRoom = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      // Create FormData object for the API
      const formData = new FormData();

      // Add basic room information
      formData.append("name", roomForm.name || "");
      formData.append("roomType", roomForm.type || "single");
      formData.append("sizeRoom", roomForm.area?.toString() || "0");
      formData.append("shortDescription", roomForm.shortDescription || "");
      formData.append("fullDescription", roomForm.fullDescription || "");
      formData.append("maxPeople", roomForm.maxGuests?.toString() || "1");
      formData.append("priceByDay", roomForm.price?.toString() || "0");

      // Add beds based on room type
      let beds = 1;
      switch (roomForm.type) {
        case "double":
          beds = 2;
          break;
        case "suite":
          beds = 3;
          break;
        case "vip":
          beds = 2;
          break;
        default:
          beds = 1;
      }
      formData.append("beds", beds.toString());

      // Add amenities
      if (roomForm.amenities && roomForm.amenities.length > 0) {
        roomForm.amenities.forEach((amenity) => {
          formData.append("amenities[]", amenity);
        });
      }

      // Process files for upload
      const fileImages = roomForm.images?.filter(
        (img) => img instanceof File
      ) as File[];

      if (fileImages && fileImages.length > 0) {
        fileImages.forEach((file) => {
          formData.append("files", file, file.name);
        });
      }

      let response;
      if (editingRoom) {
        response = await updateRoom(editingRoom.id, formData, token || "");

        // Update the room in the local state
        if (response.data && response.data.result) {
          const updatedRoom: Room = {
            id: response.data.result.roomId || editingRoom.id,
            name: response.data.result.name,
            type: response.data.result.roomType,
            price: response.data.result.priceByDay,
            maxGuests: response.data.result.maxPeople,
            area: response.data.result.sizeRoom,
            amenities: response.data.result.amenities || [],
            images: response.data.result.image || [], // Note: API returns "image" not "images"
            shortDescription: response.data.result.shortDescription,
            fullDescription: response.data.result.fullDescription,
          };

          setRooms(
            rooms.map((room) =>
              room.id === editingRoom.id ? updatedRoom : room
            )
          );
        }
      } else {
        // CREATE ROOM - POST request
        response = await createRoom(formData, token || "");

        // Add to local state
        if (response.data && response.data.result) {
          const newRoom: Room = {
            id: response.data.result.roomId,
            name: response.data.result.name,
            type: response.data.result.roomType,
            price: response.data.result.priceByDay,
            maxGuests: response.data.result.maxPeople,
            area: response.data.result.sizeRoom,
            amenities: response.data.result.amenities || [],
            images: response.data.result.image || [],
            shortDescription: response.data.result.shortDescription,
            fullDescription: response.data.result.fullDescription,
          };
          setRooms((prev) => [...prev, newRoom]);
        }
      }

      // Reset form and close modal
      setShowRoomModal(false);
      setEditingRoom(null);
      resetRoomForm();

      // Refresh room list
      fetchRooms();
    } catch (err) {
      console.error("Error saving room:", err);
    } finally {
      setLoading(false);
    }
  };

  // Function to reset the form to its initial state
  const resetRoomForm = () => {
    setRoomForm({
      name: "",
      type: "single",
      price: 0,
      maxGuests: 1,
      area: 0,
      amenities: [],
      images: [],
      shortDescription: "",
      fullDescription: "",
    });
    setEditingRoom(null);
  };

  // Open modal for adding a new room
  const handleAddRoom = () => {
    resetRoomForm(); // Reset form before opening modal
    setShowRoomModal(true);
  };

  const handleEditRoom = (room: Room) => {
    setEditingRoom(room);
    setRoomForm(room);
    setShowRoomModal(true);
  };

  // Handle modal close event
  const handleCloseModal = () => {
    setShowRoomModal(false);
    resetRoomForm();
  };

  const handleDeleteRoom = async (roomId: string) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa phòng này không?")) {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        await deleteRoom(roomId, token || "");

        // Update local state after successful delete
        setRooms(rooms.filter((room) => room.id !== roomId));
        setError(null);
      } catch (err) {
        console.error("Error deleting room:", err);
        setError("Không thể xóa phòng. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    }
  };

  const filteredRooms = rooms.filter(
    (room) =>
      room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="">
      <div className="flex justify-between items-center">
        <SectionHeader
          title="Quản lý phòng"
          description="Tạo, sửa, xóa thông tin phòng"
        />

        <div className="flex space-x-4">
          <button
            onClick={fetchRooms}
            disabled={loading}
            className="btn-primary px-4 py-2 rounded-xl flex items-center gap-2"
            title="Làm mới dữ liệu"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            <span>Làm mới</span>
          </button>

          <button
            onClick={handleAddRoom} // Changed from setShowRoomModal(true)
            disabled={loading}
            className="btn-gold px-6 py-3 rounded-xl font-heading font-semibold flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>Thêm phòng</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 text-red-400 p-4 rounded-xl">{error}</div>
      )}

      <SearchBox
        placeholder="Tìm kiếm phòng..."
        value={searchTerm}
        onChange={setSearchTerm}
      />

      {loading && filteredRooms.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-lavender-300 flex items-center gap-3">
            <RefreshCw className="h-5 w-5 animate-spin" />
            <span>Đang tải dữ liệu...</span>
          </div>
        </div>
      ) : filteredRooms.length === 0 ? (
        <div className="card-luxury rounded-2xl p-8 text-center">
          <p className="text-lavender-300 mb-4">
            Không có phòng nào được tìm thấy
          </p>
          <button
            onClick={handleAddRoom} // Changed from setShowRoomModal(true)
            className="btn-gold px-4 py-2 rounded-xl font-body inline-flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Thêm phòng mới</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRooms.map((room) => (
            <RoomCard
              key={room.id}
              room={room}
              onEdit={handleEditRoom}
              onDelete={handleDeleteRoom}
            />
          ))}
        </div>
      )}

      {showRoomModal && (
        <RoomModal
          showModal={showRoomModal}
          setShowModal={handleCloseModal} // Changed from setShowRoomModal
          roomForm={roomForm}
          setRoomForm={setRoomForm}
          editingRoom={editingRoom}
          onSave={handleSaveRoom}
          loading={loading}
        />
      )}
    </div>
  );
};

export default RoomsSection;
