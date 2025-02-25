import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Heart, MessageCircle, Share2, CheckCircle, ChevronDown, MoreHorizontal, XCircle, Camera, BarChart2 } from "lucide-react";
import EventForm from "../Event/EventForm";

const OrganizerDashboard = () => {
  const [showForm, setShowForm] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showCommentsModal, setShowCommentsModal] = useState(false);
  const [showLikesModal, setShowLikesModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [events, setEvents] = useState([]);
  const [success, setSuccess] = useState("");
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    photoUrl: "", // Changed to photoUrl to match StudentDashboard
  });
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [eventToEdit, setEventToEdit] = useState(null);
  const [eventToDelete, setEventToDelete] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [likedUsers, setLikedUsers] = useState([]);
  const [commentReply, setCommentReply] = useState({});
  const [filter, setFilter] = useState("all");
  const navigate = useNavigate();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
  useEffect(() => {
    fetchEvents();
    fetchUserProfile();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await axios.get( `${API_BASE_URL}/api/event/getevent`, {
        headers: { "x-auth-token": localStorage.getItem("token") },
      });
      setEvents(res.data);
    } catch (error) {
      console.error("Error fetching events", error);
    }
  };

  const fetchUserProfile = async () => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    if (!userId || !token) return;

    try {
      const res = await axios.get(`${API_BASE_URL}/api/user/details`, {
        headers: { "x-auth-token": token },
      });
      // Expecting response: { firstName, lastName, email, photoUrl }
      setUser(res.data);
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  const handleEventCreated = async (newEvent) => {
    try {
      const res = await axios.post( `${API_BASE_URL}/api/event/create`, newEvent, {
        headers: { "x-auth-token": localStorage.getItem("token") },
      });
      setEvents([res.data, ...events]);
      setSuccess("Event Created Successfully!");
      setShowForm(false);
    } catch (error) {
      console.error("Error creating event", error);
    }
  };
  
  // OrganizerDashboard.jsx (handleEventUpdate)
  const handleEventUpdate = async (updatedEvent) => {
    const eventData = { ...updatedEvent, _id: eventToEdit?._id };
    console.log("Updating event with data:", eventData);
  
    try {
      if (!eventData._id) {
        console.error("No event _id provided for update.");
        return;
      }
  
      // Update the event
      const res = await axios.put(
       `${API_BASE_URL}/api/event/${eventData._id}`,
        eventData,
        { headers: { "x-auth-token": localStorage.getItem("token") } }
      );
      
      // Update the local events array with the updated event
      const updatedEvents = events.map((event) =>
        event._id === eventData._id ? res.data : event
      );
      setEvents(updatedEvents);
      setSuccess("Event Updated Successfully!");
      setEventToEdit(null);
      setShowEditModal(false); // Close the modal after update
    } catch (error) {
      console.error("Error updating event", error);
    }
  };
  

  const handleEventDelete = (eventId) => {
    setEventToDelete(eventId);
    setShowDeleteModal(true);
  };

  const confirmDeleteEvent = async () => {
    try {
      await axios.delete(`${API_BASE_URL}/api/event/${eventToDelete}`, {
        headers: { "x-auth-token": localStorage.getItem("token") },
      });
      setEvents(events.filter((event) => event._id !== eventToDelete));
      setSuccess("Event Deleted Successfully!");
      setShowDeleteModal(false);
      setEventToDelete(null);
    } catch (error) {
      console.error("Error deleting event", error);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setEventToDelete(null);
  };

  const handleProfileClick = () => {
    setShowProfileModal(true);
    setDropdownOpen(null);
  };

  const handleEditClick = (event) => {
    setEventToEdit(event);
    setShowEditModal(true);
    setDropdownOpen(null);
  };

  const closeModal = () => {
    setShowEditModal(false);
    setEventToEdit(null);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const handleProfileUpdate = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const res = await axios.put(
        "http://localhost:8000/api/user/details",
        {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
        },
        { headers: { "x-auth-token": token } }
      );
      setUser(res.data);
      setSuccess("Profile Updated Successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleProfilePhotoChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("photo", file);
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const res = await axios.put(
        `${API_BASE_URL}/api/user/update-photo`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setUser((prev) => ({ ...prev, photoUrl: res.data.user.photo })); // Changed to photoUrl
    } catch (error) {
      console.error("Error updating profile photo:", error);
    }
  };

  const openCommentsModal = (event) => {
    setSelectedEvent(event);
    setShowCommentsModal(true);
  };

  const openLikesModal = async (event) => {
    setSelectedEvent(event);
    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/stat/users`,
        { userIds: event.likes },
        { headers: { "x-auth-token": localStorage.getItem("token") } }
      );
      setLikedUsers(res.data);
      setShowLikesModal(true);
    } catch (error) {
      console.error("Error fetching liked users:", error);
    }
  };

  const openShareModal = (event) => {
    setSelectedEvent(event);
    setShowShareModal(true);
  };

  const handleReply = async (eventId, commentId) => {
    const replyText = commentReply[commentId]?.trim();
    if (!replyText) return;
    const token = localStorage.getItem("token");
    if (!token) return;

    const reply = {
      userId: localStorage.getItem("userId"),
      text: replyText,
      date: new Date(),
      photo: user.photoUrl || "",
      isOrganizerReply: true,
    };

    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/stat/comment/${eventId}`,
        { userId: reply.userId, text: replyText, photo: reply.photo, isOrganizerReply: true },
        { headers: { "x-auth-token": token } }
      );
      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event._id === eventId
            ? { ...event, comments: [...event.comments, res.data] }
            : event
        )
      );
      setCommentReply((prev) => ({ ...prev, [commentId]: "" }));
    } catch (error) {
      console.error("Error posting reply:", error);
    }
  };

  const filteredEvents = events.filter((event) => {
    const now = new Date();
    const eventDate = new Date(event.date);
    if (filter === "upcoming") return eventDate >= now;
    if (filter === "past") return eventDate < now;
    return true;
  });

  const totalLikes = events.reduce((sum, event) => sum + (event.likes?.length || 0), 0);
  const totalComments = events.reduce((sum, event) => sum + (event.comments?.length || 0), 0);

  return (
    <div className="relative min-h-screen bg-gray-100">
      {/* HEADER */}
      <header className="fixed top-0 left-0 right-0 z-20 bg-gradient-to-r from-purple-700 to-blue-600  shadow-lg flex items-center justify-between px-6 py-4">
        <h1 className="text-2xl font-extrabold tracking-tight drop-shadow-md text-white">
          Organizer Dashboard 
        </h1>
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(dropdownOpen === "profile" ? null : "profile")}
            className="flex items-center gap-2 hover:bg-white/10 p-2 rounded-full transition-all"
          >
            <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden shadow-md">
              {user.photoUrl ? (
                <img src={user.photoUrl} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <span className="flex items-center justify-center h-full text-lg font-bold text-purple-600">
                  {user.firstName?.[0]}{user.lastName?.[0]}
                </span>
              )}
            </div>
            <ChevronDown size={20} />
          </button>
          {dropdownOpen === "profile" && (
            <div className="absolute right-0 mt-2 w-56 bg-white/90 backdrop-blur-md border border-white/20 shadow-xl rounded-lg text-gray-800 z-10">
              <button
                onClick={handleProfileClick}
                className="block w-full px-4 py-2 hover:bg-gray-100 text-left transition-all"
              >
                Profile
              </button>
              <button
                className="block w-full px-4 py-2 hover:bg-gray-100 text-left transition-all"
              >
                Settings
              </button>
              <button
                onClick={handleLogout}
                className=" w-full px-4 py-2 hover:bg-gray-100 text-left transition-all flex items-center gap-2"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="pt-20 pb-8 px-4 md:px-12">
        <div className="max-w-6xl mx-auto">
          {success && (
            <div className="bg-green-100/90 backdrop-blur-md border border-green-200 text-green-800 p-3 rounded-lg mb-6 flex items-center">
              <CheckCircle size={20} className="mr-2" /> {success}
            </div>
          )}

          {/* Quick Stats */}
          <div className="bg-white/90 backdrop-blur-md border border-white/20 p-6 rounded-xl shadow-lg mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <BarChart2 size={24} /> Quick Stats
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <p className="text-gray-600">Total Events: <span className="font-semibold">{events.length}</span></p>
              <p className="text-gray-600">Total Likes: <span className="font-semibold">{totalLikes}</span></p>
              <p className="text-gray-600">Total Comments: <span className="font-semibold">{totalComments}</span></p>
            </div>
          </div>

          <div className="flex justify-between items-center mb-6">
            <button
              onClick={() => {
                setShowForm(!showForm);
                setEventToEdit(null);
              }}
              className="bg-gradient-to-r from-purple-600 to-blue-600 py-3 px-6 rounded-lg font-semibold shadow-lg hover:from-purple-700 hover:to-blue-700 transition-all"
            >
              {showForm ? "Hide Form" : "Create Event"}
            </button>
            <div className="flex gap-2">
              <button
                onClick={() => setFilter("all")}
                className={`px-4 py-2 rounded-lg ${filter === "all" ? "bg-purple-600" : "bg-white/50 text-gray-800"}`}
              >
                All
              </button>
              <button
                onClick={() => setFilter("upcoming")}
                className={`px-4 py-2 rounded-lg ${filter === "upcoming" ? "bg-purple-600" : "bg-white/50 text-gray-800"}`}
              >
                Upcoming
              </button>
              <button
                onClick={() => setFilter("past")}
                className={`px-4 py-2 rounded-lg ${filter === "past" ? "bg-purple-600 " : "bg-white/50 text-gray-800"}`}
              >
                Past
              </button>
            </div>
          </div>

          {showForm && !eventToEdit && (
            <div className="mb-8">
              <EventForm onEventCreated={handleEventCreated} />
            </div>
          )}

          <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Published Events</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <div
                key={event._id}
                className="bg-white/90 backdrop-blur-md border border-white/20 p-5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 relative"
              >
                <img
                  src={event.thumbnail || "https://via.placeholder.com/500x300"}
                  alt={event.title}
                  className="w-full h-48 object-cover rounded-lg mb-3"
                />
                <h2 className="text-xl font-semibold text-gray-800">{event.title}</h2>
                <p className="text-gray-600 text-sm mt-2 line-clamp-2">{event.description}</p>
                <p className="text-sm text-gray-500 mt-2">
                  {new Date(event.date).toLocaleDateString()}
                </p>

                <div className="absolute top-3 right-3">
                  <button
                    onClick={() => setDropdownOpen((prev) => (prev === event._id ? null : event._id))}
                    className="text-gray-600 hover:text-gray-800 focus:outline-none"
                  >
                    <MoreHorizontal size={24} />
                  </button>
                  {dropdownOpen === event._id && (
                    <div className="absolute right-0 mt-2 w-40 bg-white/90 backdrop-blur-md border border-white/20 shadow-xl rounded-lg text-gray-800 z-10">
                      <button
                        onClick={() => handleEditClick(event)}
                        className="block w-full px-4 py-2 hover:bg-gray-100 text-left transition-all"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleEventDelete(event._id)}
                        className="block w-full px-4 py-2 hover:bg-red-100 text-left text-red-600 transition-all"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>

                <div className="mt-4 flex justify-between text-gray-600">
                  <button
                    onClick={() => openLikesModal(event)}
                    className="flex items-center gap-1 hover:text-red-500 transition-colors"
                  >
                    <Heart size={18} /> {event.likes?.length || 0}
                  </button>
                  <button
                    onClick={() => openCommentsModal(event)}
                    className="flex items-center gap-1 hover:text-blue-500 transition-colors"
                  >
                    <MessageCircle size={18} /> {event.comments?.length || 0}
                  </button>
                  <button
                    onClick={() => openShareModal(event)}
                    className="flex items-center gap-1 hover:text-green-500 transition-colors"
                  >
                    <Share2 size={18} /> Share
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Edit Modal */}
        {showEditModal && eventToEdit && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
            <div className="bg-white/90 backdrop-blur-md border border-white/20 p-6 rounded-xl shadow-2xl w-11/12 md:w-2/3 max-h-[80vh] overflow-y-auto relative">
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
              >
                <XCircle size={24} />
              </button>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Edit Event</h2>
              <EventForm eventToEdit={eventToEdit} onEventUpdate={handleEventUpdate} />
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
            <div className="bg-white/90 backdrop-blur-md border border-white/20 p-6 rounded-xl shadow-2xl w-11/12 md:w-1/3 text-center">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Are you sure you want to delete this event?
              </h3>
              <div className="flex justify-center gap-4">
                <button
                  onClick={confirmDeleteEvent}
                  className="bg-gradient-to-r from-red-600 to-red-700 py-2 px-6 rounded-lg text-white hover:from-red-700 hover:to-red-800 transition-all"
                >
                  Yes, Delete
                </button>
                <button
                  onClick={cancelDelete}
                  className="bg-gradient-to-r from-gray-500 to-gray-600 py-2 px-6 rounded-lg text-white hover:from-gray-600 hover:to-gray-700 transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Profile Modal */}
        {showProfileModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
            <div className="bg-white/90 backdrop-blur-md border border-white/20 p-6 rounded-xl shadow-2xl w-11/12 max-w-lg relative">
              <button
                onClick={() => setShowProfileModal(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
              >
                <XCircle size={24} />
              </button>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Organizer Profile</h3>
              <p className="text-sm text-blue-600 mb-4">Event Organizer</p> {/* Organizer distinction */}
              <div className="space-y-4">
                <input
                  type="text"
                  value={user.firstName || ""}
                  onChange={(e) => setUser({ ...user, firstName: e.target.value })}
                  className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all" /* Blue ring for organizer */
                  placeholder="First Name"
                />
                <input
                  type="text"
                  value={user.lastName || ""}
                  onChange={(e) => setUser({ ...user, lastName: e.target.value })}
                  className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                  placeholder="Last Name"
                />
                <input
                  type="email"
                  value={user.email || ""}
                  onChange={(e) => setUser({ ...user, email: e.target.value })}
                  className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                  placeholder="Email"
                  disabled
                />
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    onChange={handleProfilePhotoChange}
                    className="w-full p-2 bg-white/10 border border-white/20 rounded-lg text-gray-800"
                  />
                  <Camera size={20} className="text-gray-500" />
                </div>
                <button
                  onClick={handleProfileUpdate}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 py-3 rounded-lg font-semibold text-white shadow-lg hover:from-purple-700 hover:to-blue-700 transition-all"
                >
                  Update Profile
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Comments Modal */}
        {showCommentsModal && selectedEvent && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
            <div className="bg-white/90 backdrop-blur-md border border-white/20 p-6 rounded-xl shadow-2xl w-11/12 max-w-lg max-h-[80vh] overflow-y-auto relative">
              <button
                onClick={() => setShowCommentsModal(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
              >
                <XCircle size={24} />
              </button>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Comments</h3>
              <div className="space-y-4">
                {selectedEvent.comments?.length > 0 ? (
                  selectedEvent.comments.map((comment, idx) => (
                    <div key={idx} className="space-y-2">
                      <div className="flex items-start gap-3 p-3 bg-white/50 rounded-lg">
                        <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                          {comment.photo ? (
                            <img src={comment.photo} alt="User" className="w-full h-full object-cover" />
                          ) : (
                            <span className="flex items-center justify-center h-full text-sm font-bold text-gray-600">
                              {comment.userId?.firstName?.charAt(0) || "N"}
                            </span>
                          )}
                        </div>
                        <div className="flex-1">
                          {comment.userId && (
                            <p className={`font-semibold ${comment.isOrganizerReply ? "text-blue-600" : "text-purple-600"}`}>
                              {comment.isOrganizerReply ? "Reply by Organizer" : `${comment.userId.firstName} ${comment.userId.lastName}`}
                            </p>
                          )}
                          <p className="text-gray-600">{comment.text}</p>
                          <p className="text-xs text-gray-400">{new Date(comment.date).toLocaleString()}</p>
                        </div>
                      </div>
                      {!comment.isOrganizerReply && (
                        <div className="flex items-center gap-2 pl-12">
                          <input
                            type="text"
                            value={commentReply[comment._id] || ""}
                            onChange={(e) =>
                              setCommentReply((prev) => ({ ...prev, [comment._id]: e.target.value }))
                            }
                            className="flex-1 p-2 bg-white/10 border border-white/20 rounded-lg text-gray-800 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                            placeholder="Write a reply..."
                          />
                          <button
                            onClick={() => handleReply(selectedEvent._id, comment._id)}
                            className="bg-gradient-to-r from-purple-600 to-blue-600 px-4 py-2 rounded-lg text-white hover:from-purple-700 hover:to-blue-700 transition-all"
                          >
                            Reply
                          </button>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-gray-600">No comments yet.</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Likes Modal */}
        {showLikesModal && selectedEvent && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
            <div className="bg-white/90 backdrop-blur-md border border-white/20 p-6 rounded-xl shadow-2xl w-11/12 max-w-lg max-h-[80vh] overflow-y-auto relative">
              <button
                onClick={() => setShowLikesModal(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
              >
                <XCircle size={24} />
              </button>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Users Who Liked This Event</h3>
              <div className="space-y-4">
                {likedUsers.length > 0 ? (
                  likedUsers.map((user) => (
                    <div key={user._id} className="flex items-center gap-3 p-3 bg-white/50 rounded-lg">
                      <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                        {user.photo ? (
                          <img src={user.photo} alt="User" className="w-full h-full object-cover" />
                        ) : (
                          <span className="flex items-center justify-center h-full text-sm font-bold text-gray-600">
                            {user.firstName?.charAt(0) || "N"}
                          </span>
                        )}
                      </div>
                      <p className="text-gray-800 font-semibold">
                        {user.firstName} {user.lastName}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-600">No likes yet.</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Share Modal */}
        {showShareModal && selectedEvent && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
            <div className="bg-white/90 backdrop-blur-md border border-white/20 p-6 rounded-xl shadow-2xl w-11/12 max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800">Share this Event</h3>
                <button onClick={() => setShowShareModal(false)}>
                  <XCircle size={24} className="text-gray-500 hover:text-gray-800" />
                </button>
              </div>
              <div className="space-y-3">
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`${window.location.origin}/event/${selectedEvent._id}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-2 bg-white/50 rounded-lg hover:bg-white/70 transition-all"
                >
                  <img src="/facebook-icon.png" alt="Facebook" className="w-6 h-6" />
                  <span className="text-sm text-gray-700">Share on Facebook</span>
                </a>
                <a
                  href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(`${window.location.origin}/event/${selectedEvent._id}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-2 bg-white/50 rounded-lg hover:bg-white/70 transition-all"
                >
                  <img src="/twitter-icon.svg" alt="Twitter" className="w-6 h-6" />
                  <span className="text-sm text-gray-700">Share on Twitter</span>
                </a>
              </div>
              <hr className="my-4 border-white/20" />
              <div className="space-y-2">
                <p className="text-gray-600 text-sm">Or copy the full event details:</p>
                <button
                  onClick={() => {
                    const textToCopy = `Event Details:
Title: ${selectedEvent.title}
Date: ${selectedEvent.date || "N/A"}
Time: ${selectedEvent.time || "N/A"}
Location: ${selectedEvent.location || "N/A"}
Description: ${selectedEvent.description || "N/A"}`;
                    navigator.clipboard.writeText(textToCopy);
                    alert("Event details copied to clipboard!");
                  }}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 py-2 rounded-lg text-white hover:from-purple-700 hover:to-blue-700 transition-all"
                >
                  Copy Details
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default OrganizerDashboard;
