import React from "react";
import { X, Save } from "lucide-react";
import { User } from "../../types/types";

interface UserForm {
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  verified: boolean;
}

interface UserModalProps {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  userForm: UserForm;
  setUserForm: React.Dispatch<React.SetStateAction<UserForm>>;
  editingUser: User | null;
  onSave: () => void;
}

const UserModal: React.FC<UserModalProps> = ({
  showModal,
  setShowModal,
  userForm,
  setUserForm,
  editingUser,
  onSave,
}) => {
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-card rounded-2xl shadow-luxury max-w-lg w-full border border-royal-500/20">
        <div className="flex items-center justify-between p-6 border-b border-midnight-700/50">
          <h2 className="text-2xl font-heading font-bold text-white">
            {editingUser ? "Sửa người dùng" : "Thêm người dùng mới"}
          </h2>
          <button
            onClick={() => setShowModal(false)}
            className="text-lavender-400 hover:text-white transition-colors duration-300"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-heading font-medium text-lavender-300 mb-2">
              Email
            </label>
            <input
              type="email"
              value={userForm.email}
              onChange={(e) =>
                setUserForm({ ...userForm, email: e.target.value })
              }
              className="form-input w-full px-4 py-3 rounded-xl font-body"
              placeholder="email@example.com"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-heading font-medium text-lavender-300 mb-2">
                Họ
              </label>
              <input
                type="text"
                value={userForm.firstName}
                onChange={(e) =>
                  setUserForm({ ...userForm, firstName: e.target.value })
                }
                className="form-input w-full px-4 py-3 rounded-xl font-body"
                placeholder="Họ"
              />
            </div>

            <div>
              <label className="block text-sm font-heading font-medium text-lavender-300 mb-2">
                Tên
              </label>
              <input
                type="text"
                value={userForm.lastName}
                onChange={(e) =>
                  setUserForm({ ...userForm, lastName: e.target.value })
                }
                className="form-input w-full px-4 py-3 rounded-xl font-body"
                placeholder="Tên"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-heading font-medium text-lavender-300 mb-2">
              Số điện thoại
            </label>
            <input
              type="tel"
              value={userForm.phoneNumber}
              onChange={(e) =>
                setUserForm({ ...userForm, phoneNumber: e.target.value })
              }
              className="form-input w-full px-4 py-3 rounded-xl font-body"
              placeholder="0901234567"
            />
          </div>

          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="verified"
              checked={userForm.verified}
              onChange={(e) =>
                setUserForm({ ...userForm, verified: e.target.checked })
              }
              className="w-4 h-4 text-royal-600 bg-midnight-800 border-royal-500 rounded focus:ring-royal-500"
            />
            <label
              htmlFor="verified"
              className="text-sm font-body text-lavender-300"
            >
              Xác thực tài khoản
            </label>
          </div>

          <div className="flex items-center space-x-4 pt-6">
            <button
              onClick={onSave}
              className="btn-gold px-6 py-3 rounded-xl font-heading font-semibold flex items-center space-x-2"
            >
              <Save className="h-4 w-4" />
              <span>Lưu</span>
            </button>
            <button
              onClick={() => setShowModal(false)}
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

export default UserModal;
