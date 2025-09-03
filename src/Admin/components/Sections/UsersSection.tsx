import React, { useState, useEffect } from "react";
import { Plus, RefreshCw } from "lucide-react";
import { User } from "../../types/types";
import SectionHeader from "../UI/SectionHeader";
import SearchBox from "../UI/SearchBox";
import UserTable from "../Users/UserTable";
import UserModal from "../Users/UserModal";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";

const API_URL = import.meta.env.VITE_API_URL;

interface UsersSectionProps {
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
}

const UsersSection: React.FC<UsersSectionProps> = ({
  users,
  setUsers,
  searchTerm,
  setSearchTerm,
}) => {
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [userForm, setUserForm] = useState({
    email: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
    verified: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const currentUser = useSelector((state: RootState) => state.auth.user);

  // Fetch users when component mounts
  useEffect(() => {
    fetchUsers();
  }, [currentPage]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${API_URL}/users?limit=10&page=${currentPage}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data && response.data.result) {
        // Transform API response to match our User interface
        const apiUsers = response.data.result.map((apiUser: any) => {
          // Split the name into firstName and lastName
          const nameParts = (apiUser.name || "").split(" ");
          const lastName = nameParts.pop() || "";
          const firstName = nameParts.join(" ");

          return {
            id: apiUser._id,
            email: apiUser.email || "",
            firstName: firstName,
            lastName: lastName,
            phoneNumber: apiUser.contactPhone || "", // Changed from phoneNumber
            verified: apiUser.isVerified || false, // Changed from verified
            joinDate: apiUser.createdAt
              ? new Date(apiUser.createdAt).toISOString().split("T")[0]
              : "",
            totalBookings: apiUser.bookingsCount || 0, // Changed from totalBookings
            totalSpent: apiUser.totalSpent || 0,
            status: apiUser.status || "active",
          };
        });

        setUsers(apiUsers);

        // Handle pagination if the API provides it
        if (response.data.totalPages) {
          setTotalPages(response.data.totalPages);
        }
      }
      setError(null);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Không thể tải danh sách người dùng. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveUser = () => {
    if (editingUser) {
      setUsers(
        users.map((user) =>
          user.id === editingUser.id
            ? {
                ...user,
                ...userForm,
              }
            : user
        )
      );
    } else {
      const newUser: User = {
        ...userForm,
        id: Date.now().toString(),
        joinDate: new Date().toISOString().split("T")[0],
        role: "user",
        totalBookings: 0,
        totalSpent: 0,
        status: "active",
      };
      setUsers([...users, newUser]);
    }
    setShowUserModal(false);
    setEditingUser(null);
    setUserForm({
      email: "",
      firstName: "",
      lastName: "",
      phoneNumber: "",
      verified: false,
    });
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setUserForm({
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber,
      verified: user.verified,
    });
    setShowUserModal(true);
  };

  const handleDeleteUser = (userId: string) => {
    setUsers(users.filter((user) => user.id !== userId));
  };

  const toggleUserVerification = (userId: string) => {
    setUsers(
      users.map((user) =>
        user.id === userId ? { ...user, verified: !user.verified } : user
      )
    );
  };

  const filteredUsers = users.filter(
    (user) =>
      (user.role === "user" || !user.role) && // Nếu không có role thì mặc định là user
      user.id !== currentUser?.id &&
      (user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phoneNumber.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <SectionHeader
          title="Quản lý người dùng"
          description="Tạo, sửa, xóa tài khoản người dùng"
        />

        <div className="flex space-x-4">
          <button
            onClick={fetchUsers}
            disabled={loading}
            className="btn-primary px-4 py-2 rounded-xl flex items-center gap-2"
            title="Làm mới dữ liệu"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            <span>Làm mới</span>
          </button>

          {/* <button
            onClick={() => setShowUserModal(true)}
            disabled={loading}
            className="btn-gold px-6 py-3 rounded-xl font-heading font-semibold flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>Thêm user</span>
          </button> */}
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 text-red-400 p-4 rounded-xl">{error}</div>
      )}

      <SearchBox
        placeholder="Tìm kiếm người dùng..."
        value={searchTerm}
        onChange={setSearchTerm}
      />

      <div className="card-luxury rounded-2xl p-8">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-lavender-300 flex items-center gap-3">
              <RefreshCw className="h-5 w-5 animate-spin" />
              <span>Đang tải dữ liệu...</span>
            </div>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center p-8">
            <p className="text-lavender-300 mb-4">
              Không có người dùng nào được tìm thấy
            </p>
          </div>
        ) : (
          <UserTable
            users={filteredUsers}
            onEdit={handleEditUser}
            onDelete={handleDeleteUser}
            onToggleVerification={toggleUserVerification}
          />
        )}
      </div>

      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="flex justify-center space-x-2 mt-4">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-1 rounded-md ${
                currentPage === page
                  ? "bg-royal-500 text-white"
                  : "bg-royal-500/20 text-royal-400 hover:bg-royal-500/30"
              }`}
            >
              {page}
            </button>
          ))}
        </div>
      )}

      {showUserModal && (
        <UserModal
          showModal={showUserModal}
          setShowModal={setShowUserModal}
          userForm={userForm}
          setUserForm={setUserForm}
          editingUser={editingUser}
          onSave={handleSaveUser}
        />
      )}
    </div>
  );
};

export default UsersSection;
