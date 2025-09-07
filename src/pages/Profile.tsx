import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, User, Phone, Mail, Save, Edit3, Check } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";
import { getUser, updateUserInfo } from "../store/authSlice";
import { showToast } from "../utils/toast";

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { user, isLoading, error } = useSelector(
    (state: RootState) => state.auth
  );

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    phone: user?.phoneNumber || "",
    email: user?.email || "",
  });

  // useEffect(() => {
  //   const fetchUser = async () => {
  //     try {
  //       const data = await dispatch(getUser()).unwrap();
  //     } catch (err) {
  //       console.error("Failed to fetch user:", err);
  //     }
  //   };

  //   fetchUser();
  // }, [dispatch]);

  useEffect(() => {
    if (user) {
      setFormData({
        lastName: user?.lastName || "",
        firstName: user?.firstName || "",
        phone: user?.phoneNumber || "",
        email: user?.email || "",
      });
    }
  }, [user]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      showToast.error("Vui lòng nhập đầy đủ họ và tên");
      return;
    }

    if (formData.phone && !/^[0-9+\-\s()]+$/.test(formData.phone)) {
      showToast.error("Số điện thoại không hợp lệ");
      return;
    }

    setIsSaving(true);

    try {
      // Prepare update data
      const updateData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phoneNumber: formData.phone,
      };

      // Dispatch update action
      await dispatch(updateUserInfo(updateData)).unwrap();

      showToast.success("Cập nhật thông tin thành công!");
      setIsEditing(false);
    } catch (error: any) {
      showToast.error(error.message || "Cập nhật thất bại. Vui lòng thử lại.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (user) {
      setFormData({
        lastName: user?.lastName || "",
        firstName: user?.firstName || "",
        phone: user?.phoneNumber || "",
        email: user?.email || "",
      });
    }
    setIsEditing(false);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-luxury flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-heading font-bold text-white mb-4">
            Bạn cần đăng nhập để xem trang này
          </h2>
          <button
            onClick={() => navigate("/dang-nhap")}
            className="btn-primary px-6 py-3 rounded-xl font-heading font-semibold"
          >
            Đăng nhập ngay
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-luxury pt-9 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-royal-400 hover:text-royal-300 mr-6 transition-colors duration-300 font-body"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Quay lại
          </button>
          <div>
            <h1 className="text-4xl font-display font-bold text-gradient">
              Hồ sơ cá nhân
            </h1>
            <p className="text-lavender-300 font-body mt-2">
              Quản lý thông tin tài khoản của bạn
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Avatar & Basic Info */}
          <div className="lg:col-span-1">
            <div className="card-luxury rounded-2xl p-8 text-center">
              <div className="w-24 h-24 bg-gradient-royal rounded-full flex items-center justify-center mx-auto mb-6">
                <User className="h-12 w-12 text-white" />
              </div>
              <h2 className="text-xl font-heading font-bold text-white mb-2">
                {user.lastName} {user.firstName}
              </h2>
              <p className="text-lavender-400 font-body mb-4">{user.email}</p>
              <div className="flex items-center justify-center space-x-2 text-sm text-infinity-400">
                <Check className="h-4 w-4" />
                <span className="font-body">Tài khoản đã xác thực</span>
              </div>
            </div>
          </div>

          {/* Profile Form */}
          <div className="lg:col-span-2">
            <div className="card-luxury rounded-2xl p-8">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-heading font-bold text-white">
                  Thông tin cá nhân
                </h3>
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center space-x-2 text-royal-400 hover:text-royal-300 transition-colors duration-300 px-4 py-2 rounded-lg hover:bg-royal-500/10"
                  >
                    <Edit3 className="h-4 w-4" />
                    <span className="font-body">Chỉnh sửa</span>
                  </button>
                )}
              </div>

              <form className="space-y-6">
                {/* First Name */}
                <div>
                  <label className="block text-sm font-heading font-medium text-lavender-300 mb-2">
                    Tên <span className="text-red-400">*</span>
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) =>
                        handleInputChange("firstName", e.target.value)
                      }
                      className="form-input w-full px-4 py-3 rounded-xl font-body"
                      placeholder="Nhập tên của bạn"
                      required
                    />
                  ) : (
                    <div className="px-4 py-3 bg-midnight-800/30 rounded-xl border border-midnight-700/50 text-white font-body">
                      {formData.firstName || "Chưa cập nhật"}
                    </div>
                  )}
                </div>

                {/* Last Name */}
                <div>
                  <label className="block text-sm font-heading font-medium text-lavender-300 mb-2">
                    Họ <span className="text-red-400">*</span>
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) =>
                        handleInputChange("lastName", e.target.value)
                      }
                      className="form-input w-full px-4 py-3 rounded-xl font-body"
                      placeholder="Nhập họ của bạn"
                      required
                    />
                  ) : (
                    <div className="px-4 py-3 bg-midnight-800/30 rounded-xl border border-midnight-700/50 text-white font-body">
                      {formData.lastName || "Chưa cập nhật"}
                    </div>
                  )}
                </div>

                {/* Email (readonly) */}
                <div>
                  <label className="block text-sm font-heading font-medium text-lavender-300 mb-2">
                    Email
                  </label>
                  <div className="px-4 py-3 bg-midnight-800/30 rounded-xl border border-midnight-700/50 text-lavender-400 font-body flex items-center">
                    <Mail className="h-4 w-4 mr-3" />
                    {formData.email}
                    <span className="ml-auto text-xs text-lavender-500">
                      Không thể thay đổi
                    </span>
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-heading font-medium text-lavender-300 mb-2">
                    Số điện thoại
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) =>
                        handleInputChange("phone", e.target.value)
                      }
                      className="form-input w-full px-4 py-3 rounded-xl font-body"
                      placeholder="Nhập số điện thoại"
                    />
                  ) : (
                    <div className="px-4 py-3 bg-midnight-800/30 rounded-xl border border-midnight-700/50 text-white font-body flex items-center">
                      <Phone className="h-4 w-4 mr-3 text-royal-400" />
                      {formData.phone || "Chưa cập nhật"}
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                {isEditing && (
                  <div className="flex items-center space-x-4 pt-6">
                    <button
                      type="button"
                      onClick={handleSave}
                      disabled={isSaving}
                      className="btn-gold px-6 py-3 rounded-xl font-heading font-semibold flex items-center space-x-2 disabled:opacity-50"
                    >
                      {isSaving ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-midnight-900"></div>
                          <span>Đang lưu...</span>
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4" />
                          <span>Lưu thay đổi</span>
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="px-6 py-3 border border-royal-500/30 rounded-xl text-lavender-300 hover:bg-royal-500/5 transition-colors duration-300 font-body"
                    >
                      Hủy
                    </button>
                  </div>
                )}
              </form>
            </div>

            {/* Account Security Section */}
            {/* <div className="card-luxury rounded-2xl p-8 mt-8">
              <h3 className="text-xl font-heading font-bold text-white mb-6">
                Bảo mật tài khoản
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-midnight-800/30 rounded-xl border border-midnight-700/50">
                  <div>
                    <h4 className="font-heading font-semibold text-white">
                      Đổi mật khẩu
                    </h4>
                    <p className="text-sm text-lavender-400 font-body">
                      Cập nhật mật khẩu để bảo mật tài khoản
                    </p>
                  </div>
                  <button className="text-royal-400 hover:text-royal-300 transition-colors duration-300 font-body">
                    Thay đổi
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-midnight-800/30 rounded-xl border border-midnight-700/50">
                  <div>
                    <h4 className="font-heading font-semibold text-white">
                      Xác thực 2 bước
                    </h4>
                    <p className="text-sm text-lavender-400 font-body">
                      Tăng cường bảo mật cho tài khoản
                    </p>
                  </div>
                  <button className="text-lavender-400 hover:text-royal-300 transition-colors duration-300 font-body">
                    Bật
                  </button>
                </div>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
