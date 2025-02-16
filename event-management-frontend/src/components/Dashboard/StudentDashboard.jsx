import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Heart, MessageCircle, Share2, X, LogOut, Camera, UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "../App.css";

const StudentDashboard = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [commentInputs, setCommentInputs] = useState({});
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [commentsModalOpen, setCommentsModalOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [userProfile, setUserProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    photoUrl: "",
  });
  const [suggestions, setSuggestions] = useState([]);
  const [showMoreSuggestions, setShowMoreSuggestions] = useState(false);
  const observer = useRef();
  const eventIds = useRef(new Set());
  const navigate = useNavigate();

  // Fetch Events
  const fetchEvents = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const res = await axios.get(`http://localhost:8000/api/event/getevent?page=${page}`, {
        headers: { "x-auth-token": localStorage.getItem("token") },
      });

      if (res.data.length === 0) {
        setHasMore(false);
      } else {
        const uniqueEvents = res.data.filter((event) => !eventIds.current.has(event._id));
        uniqueEvents.forEach((event) => eventIds.current.add(event._id));
        setEvents((prevEvents) => [...prevEvents, ...uniqueEvents]);
      }
    } catch (err) {
      console.error("Error fetching events:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch Suggestions
  const fetchSuggestions = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/user/suggestions", {
        headers: { "x-auth-token": localStorage.getItem("token") },
      });
  
      const currentUserId = localStorage.getItem("userId"); // ✅ Get logged-in user ID
      const filteredUsers = res.data.filter(user => user._id !== currentUserId); // ✅ Ensure current user is removed
  
      setSuggestions(filteredUsers); // ✅ Store only valid users
    } catch (err) {
      console.error("Error fetching suggestions:", err);
    }
  };
  
  
  

  useEffect(() => {
    fetchEvents();
    fetchSuggestions();
  }, [page]);

  useEffect(() => {
    if (!hasMore || loading) return;

    const observerCallback = (entries) => {
      if (entries[0].isIntersecting) {
        setPage((prevPage) => prevPage + 1);
      }
    };

    observer.current = new IntersectionObserver(observerCallback, { threshold: 0.5 });

    return () => observer.current && observer.current.disconnect();
  }, [loading, hasMore]);

  // Like Handler
  const handleLike = async (eventId) => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    if (!userId || !token) return;

    setEvents((prevEvents) =>
      prevEvents.map((event) =>
        event._id === eventId
          ? {
              ...event,
              likes: event.likes.includes(userId)
                ? event.likes.filter((id) => id !== userId)
                : [...event.likes, userId],
            }
          : event
      )
    );

    try {
      await axios.post(
        `http://localhost:8000/api/stat/like/${eventId}`,
        { userId },
        { headers: { "x-auth-token": token } }
      );
    } catch (err) {
      console.error("Error liking event:", err);
    }
  };

  // Comment Handler
  const handleComment = async (eventId) => {
    const text = commentInputs[eventId]?.trim();
    if (!text) return;

    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    if (!userId || !token) return;

    try {
      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event._id === eventId
            ? { ...event, comments: [...event.comments, { userId, text, timestamp: new Date() }] }
            : event
        )
      );
      setCommentInputs((prev) => ({ ...prev, [eventId]: "" }));

      await axios.post(
        `http://localhost:8000/api/stat/comment/${eventId}`,
        { userId, text },
        { headers: { "x-auth-token": token } }
      );
    } catch (err) {
      console.error("Error commenting on event:", err);
    }
  };

  // Open Comment Modal
  const openCommentsModal = (event) => {
    setSelectedEvent(event);
    setCommentsModalOpen(true);
  };

  // Close Comment Modal
  const closeCommentsModal = () => {
    setCommentsModalOpen(false);
    setSelectedEvent(null);
  };

  // Toggle Profile Dropdown
  const toggleProfileDropdown = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  // Edit Profile Modal Toggle
  const toggleEditProfileModal = () => {
    setIsEditProfileOpen(!isEditProfileOpen);
  };

  // Fetch User Profile Info
  const fetchUserProfile = async () => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    if (!userId || !token) return;

    try {
      const res = await axios.get(`http://localhost:8000/api/user/details`, {
        headers: { "x-auth-token": token },
      });
      setUserProfile(res.data);
    } catch (err) {
      console.error("Error fetching user profile:", err);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  // Logout Handler
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("userType");
    localStorage.removeItem("userName");
    navigate("/");
  };

  // Handle Profile Update
  const handleProfileUpdate = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await axios.put(
        "http://localhost:8000/api/user/details",
        {
          firstName: userProfile.firstName,
          lastName: userProfile.lastName,
          email: userProfile.email,
        },
        {
          headers: { "x-auth-token": token },
        }
      );
      setUserProfile(res.data);
    } catch (err) {
      console.error("Error updating profile:", err);
    }
  };

  // Handle Profile Photo Upload
  const handleProfilePhotoChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("photo", file);

    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await axios.put(
        "http://localhost:8000/api/user/update-photo",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setUserProfile((prev) => ({ ...prev, photoUrl: res.data.user.photo }));
    } catch (err) {
      console.error("Error updating profile photo:", err);
    }
  };

  // Add User to Connections
  const handleAddUser = async (userId) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      await axios.post(
        `http://localhost:8000/api/user/add-connection/${userId}`,
        {},
        { headers: { "x-auth-token": token } }
      );
      fetchSuggestions(); // Refresh suggestions after adding
    } catch (err) {
      console.error("Error adding user:", err);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Main Feed */}
      <div className="flex-1 p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Student Feed</h1>

        {/* Profile Section */}
        <div className="absolute top-4 right-4">
          <div className="relative">
            <button
              onClick={toggleProfileDropdown}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
            >
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                {userProfile.photoUrl ? (
                  <img
                    src={userProfile.photoUrl}
                    alt="Profile"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <span className="text-sm font-bold">
                    {userProfile.firstName[0]}
                    {userProfile.lastName[0]}
                  </span>
                )}
              </div>
              Profile
            </button>
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg border border-gray-200 z-10">
                <button
                  onClick={toggleEditProfileModal}
                  className="block w-full px-4 py-2 text-gray-700 hover:bg-gray-100 text-left"
                >
                  Edit Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="block w-full px-4 py-2 text-gray-700 hover:bg-gray-100 text-left"
                >
                  <LogOut size={18} className="inline mr-2" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Edit Profile Modal */}
        {isEditProfileOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-3/4 max-w-lg">
              <button
                onClick={toggleEditProfileModal}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
              >
                <X size={24} />
              </button>

              <h3 className="text-lg font-semibold mb-4">Edit Profile</h3>

              <div className="space-y-4">
                <input
                  type="text"
                  value={userProfile.firstName}
                  onChange={(e) => setUserProfile({ ...userProfile, firstName: e.target.value })}
                  className="w-full p-3 border rounded-md"
                  placeholder="First Name"
                />
                <input
                  type="text"
                  value={userProfile.lastName}
                  onChange={(e) => setUserProfile({ ...userProfile, lastName: e.target.value })}
                  className="w-full p-3 border rounded-md"
                  placeholder="Last Name"
                />
                <input
                  type="email"
                  value={userProfile.email}
                  onChange={(e) => setUserProfile({ ...userProfile, email: e.target.value })}
                  className="w-full p-3 border rounded-md"
                  placeholder="Email"
                  disabled
                />
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    onChange={handleProfilePhotoChange}
                    className="border border-gray-300 p-2 rounded-md"
                  />
                  <Camera size={20} />
                </div>
                <button
                  onClick={handleProfileUpdate}
                  className="w-full bg-blue-600 py-3 rounded-lg font-medium hover:bg-blue-700"
                >
                  Update Profile
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Events Feed */}
        <div className="space-y-6">
          {events.map((event, index) => (
            <div
              key={event._id}
              ref={index === events.length - 1 ? observer : null}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <img
                src={event.thumbnail || "https://via.placeholder.com/500x300"}
                alt={event.title}
                className="w-full h-64 object-cover rounded-md mb-4"
              />
              <h2 className="text-2xl font-semibold text-gray-800">{event.title}</h2>
              <p className="text-gray-600 mt-2">{event.description}</p>

              <div className="mt-4 flex justify-between text-gray-600">
                <button
                  onClick={() => handleLike(event._id)}
                  className="flex items-center gap-1 hover:text-red-500"
                >
                  <Heart size={18} /> {event.likes.length}
                </button>

                <button
                  onClick={() => openCommentsModal(event)}
                  className="flex items-center gap-1 hover:text-blue-500"
                >
                  <MessageCircle size={18} /> {event.comments.length}
                </button>

                <button className="flex items-center gap-1 hover:text-green-500">
                  <Share2 size={18} /> Share
                </button>
              </div>
            </div>
          ))}

          {loading && <p className="text-gray-500">Loading more events...</p>}
          {!hasMore && !loading && <p className="text-gray-500">No more events available.</p>}
        </div>

        {/* Comments Modal */}
        {commentsModalOpen && selectedEvent && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-3/4 max-w-lg">
              <button
                onClick={closeCommentsModal}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
              >
                <X size={24} />
              </button>

              <h3 className="text-lg font-semibold mb-4">Comments</h3>

              <div className="flex items-center gap-2 mb-4">
                <input
                  type="text"
                  value={commentInputs[selectedEvent._id] || ""}
                  onChange={(e) =>
                    setCommentInputs((prev) => ({ ...prev, [selectedEvent._id]: e.target.value }))
                  }
                  className="flex-1 p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                  placeholder="Write a comment..."
                />
                <button
                  className="bg-blue-500 px-4 py-2 rounded-md hover:bg-blue-700"
                  onClick={() => handleComment(selectedEvent._id)}
                >
                  Comment
                </button>
              </div>

              <div className="max-h-60 overflow-y-auto">
                {selectedEvent.comments.map((comment, idx) => (
                  <div key={idx} className="mb-4 flex items-start gap-3 p-3 bg-gray-100 rounded-md">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                      {comment.profileData ? (
                        <img
                          src={comment.profileData.photoUrl}
                          alt="User Profile"
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-sm font-bold">
                          {comment.profileData?.userName ? comment.profileData.userName[0] : "NA"}
                        </span>
                      )}
                    </div>

                    <div className="flex-1">
                      {comment.profileData?.userName && (
                        <p className="text-blue-600 font-semibold">{comment.profileData.userName}</p>
                      )}
                      <p className="text-gray-600">{comment.text}</p>
                      <p className="text-xs text-gray-400">{new Date(comment.timestamp).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Suggestions Corner */}
      <div className="w-10 p-3 mt-27 bg-white border-l border-gray-200">
  <h2 className="text-xl font-semibold text-gray-800 mb-4">Suggestions</h2>

  <div className="space-y-4">
    {suggestions.slice(0, showMoreSuggestions ? suggestions.length : 3).map((user) => (
      <div key={user._id} className="flex items-center justify-between p-2 hover:bg-gray-100 transition duration-200">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
            {user.photoUrl ? (
              <img
                src={user.photoUrl}
                alt="Profile"
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <span className="text-sm font-bold text-gray-600">
                {user.firstName[0]}
                {user.lastName[0]}
              </span>
            )}
          </div>
          <div>
            <p className="text-md font-medium text-gray-700">{user.firstName} {user.lastName}</p>
            <p className="text-sm text-gray-500">@{user.username}</p>
          </div>
        </div>
        <button
          onClick={() => handleAddUser(user._id)}
          className="text-blue-500 hover:text-blue-700 transition-colors duration-200"
        >
          <UserPlus size={20} />
        </button>
      </div>
    ))}
  </div>

  {suggestions.length > 3 && (
    <button
      onClick={() => setShowMoreSuggestions(!showMoreSuggestions)}
      className="w-full mt-4 text-blue-500 hover:text-blue-700 transition-colors duration-200 pt-4"
    >
      {showMoreSuggestions ? "Show Less" : "See More"}
    </button>
  )}
</div>

    
    </div>
  );
};

export default StudentDashboard;
