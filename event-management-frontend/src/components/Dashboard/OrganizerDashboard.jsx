import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Heart, MessageCircle, Share2, CheckCircle, ChevronDown, MoreHorizontal, XCircle } from "lucide-react";
import EventForm from "../Event/EventForm";
import "../App.css";

const OrganizerDashboard = () => {
  const [showForm, setShowForm] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false); // New state for delete confirmation
  const [events, setEvents] = useState([]);
  const [success, setSuccess] = useState("");
  const [user, setUser] = useState({});
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [eventToEdit, setEventToEdit] = useState(null);
  const [eventToDelete, setEventToDelete] = useState(null); // State to store event to delete
  const navigate = useNavigate();

  useEffect(() => {
    fetchEvents();
    fetchUser();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/event/getevent", {
        headers: { "x-auth-token": localStorage.getItem("token") },
      });
      setEvents(res.data);
    } catch (error) {
      console.error("Error fetching events", error);
    }
  };

  const fetchUser = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/user/profile", {
        headers: { "x-auth-token": localStorage.getItem("token") },
      });
      setUser(res.data);
    } catch (error) {
      console.error("Error fetching user details", error);
    }
  };

  // Create event callback
  const handleEventCreated = async (newEvent) => {
    try {
      const res = await axios.post("http://localhost:8000/api/event/create", newEvent, {
        headers: { "x-auth-token": localStorage.getItem("token") },
      });
      setEvents([res.data, ...events]);
      setSuccess("Event Created Successfully!");
      setShowForm(false);
    } catch (error) {
      console.error("Error creating event", error);
    }
  };

  // Update event callback
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
        `http://localhost:8000/api/event/${eventData._id}`,
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
  

  // Show delete confirmation modal
  const handleEventDelete = (eventId) => {
    setEventToDelete(eventId);
    setShowDeleteModal(true); // Show delete confirmation modal
  };
  
  // Confirm delete event
  const confirmDeleteEvent = async () => {
    console.log("Deleting event with id:", eventToDelete);
    try {
      // Make the API call to delete the event
      await axios.delete(`http://localhost:8000/api/event/${eventToDelete}`, {
        headers: { "x-auth-token": localStorage.getItem("token") },
      });
  
      // Update the local events state by filtering out the deleted event
      setEvents(events.filter((event) => event._id !== eventToDelete));
  
      setSuccess("Event Deleted Successfully!");
      setShowDeleteModal(false); // Close the delete modal
      setEventToDelete(null); // Reset eventToDelete state
    } catch (error) {
      console.error("Error deleting event", error);
    }
  };
  
  // Cancel delete
  const cancelDelete = () => {
    setShowDeleteModal(false);
    setEventToDelete(null); // Reset eventToDelete state
  };

  const handleProfileClick = () => {
    navigate("/organizer-profile");
  };

  // When user clicks the Edit button from the dropdown
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
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("userType");
    localStorage.removeItem("userName");
    navigate("/");
  };
  
  return (
    <div className="bg-gray-50 min-h-screen flex flex-col items-center py-6 px-4 md:px-12">
      <div className="w-full max-w-6xl">
        {/* Profile Section */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-blue-700">Organizer Dashboard</h1>
          <div className="relative">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => setDropdownOpen("profile")}>
              <img
                src={user.photo || "https://via.placeholder.com/150"}
                alt="Profile"
                className="w-10 h-10 rounded-full border-2 border-gray-500"
              />
              <ChevronDown size={20} />
            </div>
            {dropdownOpen === "profile" && (
              <div className="absolute right-0 mt-2 bg-white shadow-lg rounded-lg p-3 w-48 z-10">
                <button onClick={handleProfileClick} className="w-full text-left py-2 hover:bg-gray-100 rounded-lg">
                  Profile
                </button>
                <button className="w-full text-left py-2 hover:bg-gray-100 rounded-lg">Settings</button>
                <button className="w-full text-left py-2 hover:bg-gray-100 rounded-lg" onClick = {handleLogout}>Logout</button>
              </div>
            )}
          </div>
        </div>

        {success && (
          <div className="bg-green-100 text-green-800 p-3 rounded-lg mb-4 flex items-center">
            <CheckCircle size={18} className="mr-2" /> {success}
          </div>
        )}

        {/* Create Event Button */}
        <button
          onClick={() => {
            setShowForm(!showForm);
            setEventToEdit(null);
          }}
          className="bg-blue-500  py-2 px-4 rounded-lg mb-4 hover:bg-blue-600 transition"
        >
          {showForm ? "Hide Form" : "Create Event"}
        </button>

        {/* Create Event Form */}
        {showForm && !eventToEdit && (
          <div className="mb-6">
            <EventForm onEventCreated={handleEventCreated} />
          </div>
        )}

        {/* Event List */}
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">Your Published Events</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <div key={event._id} className="bg-white p-5 rounded-lg shadow-md hover:shadow-xl transition relative">
              <img
                src={event.thumbnail || "https://via.placeholder.com/500x300"}
                alt={event.title}
                className="w-full h-48 object-cover rounded-md mb-3"
              />
              <h2 className="text-xl font-semibold text-gray-800">{event.title}</h2>
              <p className="text-gray-600 text-sm mt-2">{event.description}</p>
              <p className="text-sm text-gray-500 mt-2">
                {new Date(event.date).toLocaleDateString()}
              </p>

              {/* Event Action Menu */}
              <div className="absolute top-2 right-2">
                <button
                  onClick={() => setDropdownOpen((prev) => (prev === event._id ? null : event._id))}
                  className="text-gray-600 hover:text-gray-800 focus:outline-none"
                >
                  <MoreHorizontal size={20} />
                </button>
                {dropdownOpen === event._id && (
                  <div className="absolute right-0 mt-2 bg-white shadow-lg rounded-lg p-3 w-40 z-10">
                    <button
                      onClick={() => handleEditClick(event)}
                      className="w-full text-left py-2 hover:bg-gray-100 rounded-lg"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleEventDelete(event._id)}
                      className="w-full text-left py-2 hover:bg-gray-100 rounded-lg text-red-600"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>

              <div className="mt-4 flex justify-between text-gray-600">
                <button className="flex items-center gap-1 hover:text-red-500">
                  <Heart size={16} /> Like
                </button>
                <button className="flex items-center gap-1 hover:text-blue-500">
                  <MessageCircle size={16} /> Comment
                </button>
                <button className="flex items-center gap-1 hover:text-green-500">
                  <Share2 size={16} /> Share
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Edit Modal Popup */}
      {showEditModal && eventToEdit && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-11/12 md:w-1/2 relative animate-fadeIn">
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 focus:outline-none"
            >
              <XCircle size={24} />
            </button>
            <h2 className="text-2xl font-semibold mb-4">Edit Event</h2>
            <EventForm eventToEdit={eventToEdit} onEventUpdate={handleEventUpdate} />
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-11/12 md:w-1/3 text-center relative animate-fadeIn">
            <h3 className="text-xl font-semibold mb-4">Are you sure you want to delete this event?</h3>
            <button
              onClick={confirmDeleteEvent}
              className="bg-red-600 py-2 px-4 rounded-lg hover:bg-red-700 mr-3"
            >
              Yes, Delete
            </button>
            <button
              onClick={cancelDelete}
              className="bg-gray-500  py-2 px-4 rounded-lg hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrganizerDashboard;
