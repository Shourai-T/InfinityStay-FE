import React from "react";
import { Edit, Trash2, UserCheck } from "lucide-react";
import { formatCurrency } from "../../../utils/dateUtils";
import { User } from "../../types/types";

interface UserTableProps {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (userId: string) => void;
  onToggleVerification: (userId: string) => void;
}

const UserTable: React.FC<UserTableProps> = ({
  users,
  onEdit,
  onDelete,
  onToggleVerification,
}) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-midnight-700/50">
            <th className="text-left py-4 px-4 font-heading font-semibold text-lavender-300">
              Người dùng
            </th>
            <th className="text-left py-4 px-4 font-heading font-semibold text-lavender-300">
              Liên hệ
            </th>
            <th className="text-left py-4 px-4 font-heading font-semibold text-lavender-300">
              Trạng thái
            </th>
            <th className="text-left py-4 px-4 font-heading font-semibold text-lavender-300">
              Đặt phòng
            </th>
            <th className="text-left py-4 px-4 font-heading font-semibold text-lavender-300">
              Tổng chi tiêu
            </th>
            {/* <th className="text-left py-4 px-4 font-heading font-semibold text-lavender-300">
              Thao tác
            </th> */}
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr
              key={user.id}
              className="border-b border-midnight-800/30 hover:bg-royal-500/5"
            >
              <td className="py-4 px-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-royal rounded-full flex items-center justify-center">
                    <span className="text-white font-heading font-semibold">
                      {user.firstName.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <div className="font-body font-semibold text-white">
                      {user.firstName} {user.lastName}
                    </div>
                    <div className="text-sm text-lavender-400">
                      {user.email}
                    </div>
                  </div>
                </div>
              </td>
              <td className="py-4 px-4 font-body text-lavender-300">
                {user.phoneNumber}
              </td>
              <td className="py-4 px-4">
                <div className="flex items-center space-x-2">
                  <button
                    // onClick={() => onToggleVerification(user.id)}
                    className={`p-1 rounded ${
                      user.verified
                        ? "text-green-400 hover:bg-green-500/10"
                        : "text-gray-400 hover:bg-gray-500/10"
                    }`}
                  >
                    <UserCheck className="h-4 w-4" />
                  </button>
                </div>
              </td>
              <td className="py-4 px-4 font-body text-white">
                {user.totalBookings}
              </td>
              <td className="py-4 px-4 font-body text-infinity-400 font-semibold">
                {formatCurrency(user.totalSpent)}
              </td>
              {/* <td className="py-4 px-4">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onEdit(user)}
                    className="p-2 text-infinity-400 hover:bg-infinity-500/10 rounded-lg transition-colors duration-300"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onDelete(user.id)}
                    className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors duration-300"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </td> */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
