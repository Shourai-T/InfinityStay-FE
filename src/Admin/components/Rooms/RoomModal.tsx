import React, { useState } from "react";
import { X, Save, Upload, Plus } from "lucide-react";
import { Room } from "../../types/types";

interface RoomModalProps {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  roomForm: Partial<Room>;
  setRoomForm: React.Dispatch<React.SetStateAction<Partial<Room>>>;
  editingRoom: Room | null;
  onSave: () => void;
  loading?: boolean;
}

const RoomModal: React.FC<RoomModalProps> = ({
  showModal,
  setShowModal,
  roomForm,
  setRoomForm,
  editingRoom,
  onSave,
  loading = false,
}) => {
  const [newAmenity, setNewAmenity] = useState("");
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  // Thêm state cho giá hiển thị
  const [priceDisplay, setPriceDisplay] = useState(
    roomForm.price ? roomForm.price.toLocaleString("en-US") : ""
  );

  const commonAmenities = [
    "WiFi miễn phí",
    "Điều hòa",
    "TV màn hình phẳng",
    "Minibar",
    "Két an toàn",
    "Bồn tắm",
    "Vòi sen",
    "Máy sấy tóc",
    "Tủ quần áo",
    "Bàn làm việc",
  ];

  const handleAddAmenity = () => {
    if (newAmenity.trim() !== "") {
      setRoomForm({
        ...roomForm,
        amenities: [...(roomForm.amenities || []), newAmenity.trim()],
      });
      setNewAmenity("");
    }
  };

  const handleRemoveAmenity = (index: number) => {
    const updatedAmenities =
      roomForm.amenities?.filter((_, i) => i !== index) || [];
    setRoomForm({ ...roomForm, amenities: updatedAmenities });
  };

  const handleSelectCommonAmenity = (amenity: string) => {
    if (!roomForm.amenities?.includes(amenity)) {
      setRoomForm({
        ...roomForm,
        amenities: [...(roomForm.amenities || []), amenity],
      });
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Lưu File object vào state
    setRoomForm((prev) => ({
      ...prev,
      images: [...(prev.images || []), ...files],
    }));
  };

  // Helper function to get image preview URL
  const getImagePreviewUrl = (image: any): string => {
    // If it's a File object, create an object URL for preview
    if (image instanceof File) {
      return URL.createObjectURL(image);
    }
    // If it's already a string URL, use it directly
    return image;
  };

  // Handle modal close with form reset
  const handleClose = () => {
    setShowModal(false);
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-card rounded-2xl shadow-luxury max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-royal-500/20">
        <div className="flex items-center justify-between p-6 border-b border-midnight-700/50">
          <h2 className="text-2xl font-heading font-bold text-white">
            {editingRoom ? "Sửa phòng" : "Thêm phòng mới"}
          </h2>
          <button
            onClick={handleClose}
            className="text-lavender-400 hover:text-white transition-colors duration-300"
            disabled={loading}
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-heading font-medium text-lavender-300 mb-2">
                Tên phòng <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={roomForm.name}
                onChange={(e) =>
                  setRoomForm({ ...roomForm, name: e.target.value })
                }
                className="form-input w-full px-4 py-3 rounded-xl font-body"
                placeholder="Nhập tên phòng"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-heading font-medium text-lavender-300 mb-2">
                Loại phòng <span className="text-red-400">*</span>
              </label>
              <select
                value={roomForm.type}
                onChange={(e) =>
                  setRoomForm({
                    ...roomForm,
                    type: e.target.value as any,
                  })
                }
                className="form-input w-full px-4 py-3 rounded-xl font-body"
                required
              >
                <option value="single">Single</option>
                <option value="double">Double</option>
                <option value="suite">Suite</option>
                <option value="vip">VIP</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-heading font-medium text-lavender-300 mb-2">
                Giá (VNĐ/đêm) <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={priceDisplay}
                onChange={(e) => {
                  // Xóa ký tự không phải số
                  const raw = e.target.value.replace(/[^\d]/g, "");
                  setPriceDisplay(
                    raw ? Number(raw).toLocaleString("en-US") : ""
                  );
                  setRoomForm({
                    ...roomForm,
                    price: raw === "" ? 0 : Number(raw),
                  });
                }}
                className="form-input w-full px-4 py-3 rounded-xl font-body [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                placeholder="Nhập giá phòng"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-heading font-medium text-lavender-300 mb-2">
                Số khách tối đa <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                value={roomForm.maxGuests}
                onChange={(e) => {
                  const value = Math.max(
                    1,
                    Math.min(6, Number(e.target.value))
                  );
                  setRoomForm({
                    ...roomForm,
                    maxGuests: value,
                  });
                }}
                min={1}
                max={6}
                className="form-input w-full px-4 py-3 rounded-xl font-body"
                placeholder="1"
                required
              />
              <p className="text-xs text-lavender-400 mt-1">
                Giới hạn từ 1-6 khách
              </p>
            </div>

            <div>
              <label className="block text-sm font-heading font-medium text-lavender-300 mb-2">
                Diện tích (m²) <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                value={roomForm.area === 0 ? "" : roomForm.area}
                onChange={(e) => {
                  const inputValue = e.target.value;
                  setRoomForm({
                    ...roomForm,
                    area: inputValue === "" ? 0 : Number(inputValue),
                  });
                }}
                min={1}
                className="form-input w-full px-4 py-3 rounded-xl font-body [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                placeholder="Nhập diện tích"
                required
              />
            </div>
          </div>

          {/* Amenities Section */}
          <div>
            <label className="block text-sm font-heading font-medium text-lavender-300 mb-2">
              Tiện ích <span className="text-red-400">*</span>
            </label>

            {/* Common amenities quick select */}
            <div className="mb-4">
              <p className="text-xs text-lavender-400 mb-2">
                Tiện ích phổ biến:
              </p>
              <div className="flex flex-wrap gap-2">
                {commonAmenities.map((amenity, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleSelectCommonAmenity(amenity)}
                    className={`px-3 py-1 text-xs rounded-full ${
                      roomForm.amenities?.includes(amenity)
                        ? "bg-royal-500 text-white"
                        : "bg-royal-500/20 text-royal-400 hover:bg-royal-500/30"
                    } transition-colors duration-300`}
                  >
                    {amenity}
                  </button>
                ))}
              </div>
            </div>

            {/* Add custom amenity */}
            <div className="flex space-x-2">
              <input
                type="text"
                value={newAmenity}
                onChange={(e) => setNewAmenity(e.target.value)}
                placeholder="Thêm tiện ích khác..."
                className="form-input flex-1 px-4 py-2 rounded-xl font-body"
                onKeyPress={(e) => e.key === "Enter" && handleAddAmenity()}
              />
              <button
                type="button"
                onClick={handleAddAmenity}
                className="px-4 py-2 bg-royal-500/20 text-royal-400 rounded-xl hover:bg-royal-500/30 transition-colors duration-300"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            {/* Selected amenities */}
            {roomForm.amenities && roomForm.amenities.length > 0 && (
              <div className="mt-4">
                <p className="text-xs text-lavender-400 mb-2">
                  Tiện ích đã chọn:
                </p>
                <div className="flex flex-wrap gap-2">
                  {roomForm.amenities.map((amenity, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-royal-500 text-white text-xs rounded-full flex items-center"
                    >
                      {amenity}
                      <button
                        type="button"
                        onClick={() => handleRemoveAmenity(index)}
                        className="ml-2 hover:text-red-300"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Images Section */}
          <div>
            <label className="block text-sm font-heading font-medium text-lavender-300 mb-2">
              Hình ảnh phòng <span className="text-red-400">*</span>
            </label>
            <div className="space-y-4">
              {/* Image Upload */}
              <div className="border-2 border-dashed border-royal-500/30 rounded-xl p-6 text-center hover:border-royal-500/50 transition-colors duration-300">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="room-images"
                />
                <label
                  htmlFor="room-images"
                  className="cursor-pointer flex flex-col items-center space-y-2"
                >
                  <Upload className="h-8 w-8 text-royal-400" />
                  <div className="text-sm text-lavender-300">
                    <span className="font-semibold text-royal-400">
                      Nhấn để tải ảnh
                    </span>
                    <span className="block text-xs text-lavender-400 mt-1">
                      Hỗ trợ nhiều ảnh, định dạng JPG, PNG
                    </span>
                  </div>
                </label>
              </div>

              {/* Image Preview Grid */}
              {roomForm.images && roomForm.images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {roomForm.images.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={getImagePreviewUrl(image)}
                        alt={`Room image ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg border border-royal-500/20"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const newImages =
                            roomForm.images?.filter((_, i) => i !== index) ||
                            [];
                          setRoomForm({ ...roomForm, images: newImages });
                        }}
                        className="absolute z-10 -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-red-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex items-center justify-center">
                        <span className="text-white text-xs">
                          {image instanceof File
                            ? `${image.name.substring(0, 15)}...`
                            : `Ảnh ${index + 1}`}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Image URL Input (Alternative method) */}
              <div className="border-t border-royal-500/20 pt-4">
                <div className="flex space-x-2">
                  <input
                    type="url"
                    placeholder="Hoặc nhập URL hình ảnh"
                    className="form-input flex-1 px-4 py-2 rounded-xl font-body text-sm"
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        const input = e.target as HTMLInputElement;
                        const url = input.value.trim();
                        if (url) {
                          setRoomForm({
                            ...roomForm,
                            images: [...(roomForm.images || []), url],
                          });
                          input.value = "";
                        }
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      const input = (e.target as HTMLButtonElement)
                        .previousElementSibling as HTMLInputElement;
                      const url = input.value.trim();
                      if (url) {
                        setRoomForm({
                          ...roomForm,
                          images: [...(roomForm.images || []), url],
                        });
                        input.value = "";
                      }
                    }}
                    className="px-4 py-2 bg-royal-500/20 text-royal-400 rounded-xl hover:bg-royal-500/30 transition-colors duration-300 text-sm"
                  >
                    Thêm
                  </button>
                </div>
                <p className="text-xs text-lavender-400 mt-2">
                  Nhấn Enter hoặc click "Thêm" để thêm ảnh từ URL
                </p>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-heading font-medium text-lavender-300 mb-2">
              Mô tả ngắn <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={roomForm.shortDescription}
              onChange={(e) =>
                setRoomForm({
                  ...roomForm,
                  shortDescription: e.target.value,
                })
              }
              className="form-input w-full px-4 py-3 rounded-xl font-body"
              placeholder="Mô tả ngắn về phòng"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-heading font-medium text-lavender-300 mb-2">
              Mô tả chi tiết <span className="text-red-400">*</span>
            </label>
            <textarea
              value={roomForm.fullDescription}
              onChange={(e) =>
                setRoomForm({
                  ...roomForm,
                  fullDescription: e.target.value,
                })
              }
              className="form-input w-full px-4 py-3 rounded-xl font-body resize-none"
              rows={4}
              placeholder="Mô tả chi tiết về phòng"
              required
            />
          </div>

          <div className="flex items-center space-x-4 pt-6">
            <button
              onClick={onSave}
              disabled={loading}
              className="btn-gold px-6 py-3 rounded-xl font-heading font-semibold flex items-center space-x-2"
            >
              {loading ? (
                <>
                  <span className="animate-spin">⟳</span>
                  <span>Đang lưu...</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span>Lưu</span>
                </>
              )}
            </button>
            <button
              onClick={handleClose}
              disabled={loading}
              className="px-6 py-3 border border-royal-500/30 rounded-xl text-lavender-300 hover:bg-royal-500/5 transition-colors duration-300 font-body"
            >
              Hủy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomModal;
