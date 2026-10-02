import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAllRooms } from '../../api/axios'
import Navbar from '../Navbar/navbar'
import './allRooms.css'
import roomPlaceholder from '../../assets/room_placeholder.jpg'

function AllRooms() {
    const [rooms, setRooms] = useState([])
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedRoom, setSelectedRoom] = useState(null)
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate('/')
            return
        }
        getAllRooms().then((res) => {
            setRooms(res.data.data || res.data)
            setLoading(false)
        }).catch((err) => {
            console.log(err)
            setLoading(false)
        })
    }, [])

    const isAvailable = (room) => room.available_slots > 0

    const filteredRooms = rooms.filter(room =>
        room.name.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div id="all-rooms-page">
            <Navbar />

            {/* Hero Banner */}
            <div id="rooms-hero">
                <div id="rooms-hero-icon">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="1.5">
                        <rect x="2" y="3" width="20" height="18" rx="2" />
                        <path d="M8 3v18M16 3v18M2 9h20M2 15h20" />
                    </svg>
                </div>
                <div>
                    <h1 id="rooms-hero-title">Find Your Perfect Room</h1>
                    <p id="rooms-hero-sub">Book rooms easily for your meetings, study sessions, or events.</p>
                </div>
            </div>

            {/* Main Layout */}
            <div id="rooms-layout">

                {/* Sidebar */}
                <aside id="rooms-sidebar">
                    <div id="rooms-search-box">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2">
                            <circle cx="11" cy="11" r="8" />
                            <line x1="21" y1="21" x2="16.65" y2="16.65" />
                        </svg>
                        <input
                            id="rooms-search-input"
                            type="text"
                            placeholder="Search rooms..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="sidebar-section">
                        <h3 className="sidebar-heading">Filters</h3>
                    </div>

                    <div className="sidebar-section">
                        <h4 className="sidebar-label">Availability</h4>
                        <label className="sidebar-checkbox">
                            <input type="checkbox" defaultChecked />
                            Available Now
                        </label>
                        <label className="sidebar-checkbox">
                            <input type="checkbox" />
                            Show All
                        </label>
                    </div>

                    <div className="sidebar-section">
                        <h4 className="sidebar-label">Min. Free Slots</h4>
                        <label className="sidebar-checkbox"><input type="checkbox" defaultChecked /> Any</label>
                        <label className="sidebar-checkbox"><input type="checkbox" /> 1+</label>
                        <label className="sidebar-checkbox"><input type="checkbox" /> 3+</label>
                        <label className="sidebar-checkbox"><input type="checkbox" /> 5+</label>
                    </div>
                </aside>

                {/* Room Grid */}
                <main id="rooms-grid-area">
                    <div id="rooms-grid-header">
                        <span id="rooms-count">
                            {loading ? 'Loading...' : `${filteredRooms.length} room${filteredRooms.length !== 1 ? 's' : ''} found`}
                        </span>
                        <div id="rooms-sort">
                            <label>Sort by:</label>
                            <select>
                                <option>Recommended</option>
                                <option>Capacity: Low to High</option>
                                <option>Capacity: High to Low</option>
                                <option>Most Available</option>
                            </select>
                        </div>
                    </div>

                    {loading ? (
                        <div id="rooms-loading">
                            <div className="spinner"></div>
                            <p>Fetching rooms...</p>
                        </div>
                    ) : filteredRooms.length === 0 ? (
                        <div id="rooms-empty">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="1.5">
                                <rect x="2" y="3" width="20" height="18" rx="2" />
                                <path d="M8 3v18M16 3v18M2 9h20M2 15h20" />
                            </svg>
                            <p>No rooms match your search.</p>
                        </div>
                    ) : (
                        <div id="rooms-grid">
                            {filteredRooms.map((room) => {
                                const available = isAvailable(room)
                                return (
                                    <div
                                        className={`room-card ${selectedRoom?.id === room.id ? 'room-card-selected' : ''}`}
                                        key={room.id}
                                        onClick={() => setSelectedRoom(room)}
                                    >
                                        <div className="room-card-img-wrap">
                                            <img src={roomPlaceholder} alt={room.name} className="room-card-img" />
                                            <span className={`room-badge ${available ? 'room-badge-available' : 'room-badge-occupied'}`}>
                                                {available ? 'Available' : 'Occupied'}
                                            </span>
                                        </div>
                                        <div className="room-card-body">
                                            <h3 className="room-card-name">{room.name}</h3>
                                            <div className="room-card-amenities">
                                                <span className="amenity">
                                                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                                                        <circle cx="9" cy="7" r="4"/>
                                                        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                                                        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                                                    </svg>
                                                    Capacity: {room.capacity}
                                                </span>
                                            </div>
                                            <div className="room-card-footer">
                                                <span className="room-slots">
                                                    {room.available_slots} / {room.capacity} slots free
                                                </span>
                                                <button
                                                    className={`room-book-btn ${!available ? 'room-book-btn-disabled' : ''}`}
                                                    disabled={!available}
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        navigate(`/rooms/${room.id}`)
                                                    }}
                                                >
                                                    {available ? 'Book Now' : 'Occupied'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </main>

                {/* Right Panel — Room Detail */}
                {selectedRoom && (
                    <aside id="rooms-detail-panel">
                        <div id="panel-header">
                            <h3 id="panel-title">Book {selectedRoom.name}</h3>
                            <button id="panel-close" onClick={() => setSelectedRoom(null)}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <line x1="18" y1="6" x2="6" y2="18"/>
                                    <line x1="6" y1="6" x2="18" y2="18"/>
                                </svg>
                            </button>
                        </div>

                        <div id="panel-img-wrap">
                            <img src={roomPlaceholder} alt={selectedRoom.name} id="panel-img" />
                            <span className={`room-badge ${isAvailable(selectedRoom) ? 'room-badge-available' : 'room-badge-occupied'}`} id="panel-badge">
                                {isAvailable(selectedRoom) ? 'Available' : 'Occupied'}
                            </span>
                        </div>

                        <div id="panel-info">
                            <h4 id="panel-room-name">{selectedRoom.name}</h4>
                            <div className="room-card-amenities" style={{marginTop: '8px'}}>
                                <span className="amenity">
                                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                                        <circle cx="9" cy="7" r="4"/>
                                    </svg>
                                    Capacity: {selectedRoom.capacity}
                                </span>
                            </div>
                        </div>

                        <div className="panel-field">
                            <label className="panel-label">Available Slots</label>
                            <div id="panel-slots-bar">
                                <div
                                    id="panel-slots-fill"
                                    style={{width: `${(selectedRoom.available_slots / selectedRoom.capacity) * 100}%`}}
                                ></div>
                            </div>
                            <p id="panel-slots-text">
                                {selectedRoom.available_slots} of {selectedRoom.capacity} slots available
                            </p>
                        </div>

                        <button
                            id="panel-confirm-btn"
                            disabled={!isAvailable(selectedRoom)}
                            onClick={() => navigate(`/rooms/${selectedRoom.id}`)}
                        >
                            {isAvailable(selectedRoom) ? 'Confirm Booking' : 'Room Fully Occupied'}
                        </button>
                    </aside>
                )}
            </div>
        </div>
    )
}

export default AllRooms