import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Navbar from '../Navbar/navbar'
import { getRoom, createBooking } from '../../api/axios'
import './bookingPage.css'
import roomPlaceholder from '../../assets/room_placeholder.jpg'

function BookingPage() {
    const { id } = useParams()
    const navigate = useNavigate()

    const [room, setRoom] = useState(null)
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)

    const [date, setDate] = useState('')
    const [startTime, setStartTime] = useState('')
    const [endTime, setEndTime] = useState('')

    const [toast, setToast] = useState(null) // { type: 'success'|'error', msg }

    const today = new Date().toISOString().split('T')[0]

    useEffect(() => {
        const token = localStorage.getItem('token')
        if (!token) { navigate('/'); return }
        if (!id) { navigate('/rooms/'); return }

        getRoom(id)
            .then((res) => {
                setRoom(res.data)
                setLoading(false)
            })
            .catch(() => {
                setLoading(false)
                showToast('error', 'Failed to load room details.')
            })
    }, [id])

    const showToast = (type, msg) => {
        setToast({ type, msg })
        setTimeout(() => setToast(null), 4000)
    }

    const validateForm = () => {
        if (!date) return 'Please select a booking date.'
        if (!startTime) return 'Please select a start time.'
        if (!endTime) return 'Please select an end time.'
        if (startTime >= endTime) return 'End time must be after start time.'
        return null
    }

    const handleBook = async (e) => {
        e.preventDefault()
        const err = validateForm()
        if (err) { showToast('error', err); return }

        setSubmitting(true)
        try {
            await createBooking(id, date, startTime, endTime)
            showToast('success', 'Room booked successfully! 🎉')
            setTimeout(() => navigate('/bookings/'), 1800)
        } catch (err) {
            const msg = err?.response?.data?.detail
                || err?.response?.data?.non_field_errors?.[0]
                || 'Booking failed. Please try again.'
            showToast('error', msg)
        } finally {
            setSubmitting(false)
        }
    }

    const isAvailable = room && room.available_slots > 0

    return (
        <div id="booking-page">
            <Navbar />

            {toast && (
                <div id="booking-toast" className={`toast-${toast.type}`}>
                    <span className="toast-icon">{toast.type === 'success' ? '✓' : '⚠'}</span>
                    {toast.msg}
                </div>
            )}

            {loading ? (
                <div id="booking-loading">
                    <div className="bp-spinner"></div>
                    <p>Loading room details…</p>
                </div>
            ) : !room ? (
                <div id="booking-error-state">
                    <p>Room not found.</p>
                    <button onClick={() => navigate('/rooms/')}>← Back to Rooms</button>
                </div>
            ) : (
                <div id="booking-layout">

                    {/* ── LEFT: Room Info ── */}
                    <div id="booking-info-col">

                        <button id="back-btn" onClick={() => navigate('/rooms/')}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="15 18 9 12 15 6" />
                            </svg>
                            Back to Rooms
                        </button>

                        <div id="booking-room-card">
                            <div id="booking-img-wrap">
                                <img
                                    src={room.image || roomPlaceholder}
                                    alt={room.name}
                                    id="booking-room-img"
                                    onError={(e) => { e.target.src = roomPlaceholder }}
                                />
                                <span className={`bp-badge ${isAvailable ? 'bp-badge-avail' : 'bp-badge-occ'}`}>
                                    {isAvailable ? 'Available' : 'Fully Occupied'}
                                </span>
                            </div>

                            <div id="booking-room-meta">
                                <h1 id="booking-room-name">{room.name}</h1>

                                <div id="booking-stats">
                                    <div className="stat-chip">
                                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                            <circle cx="9" cy="7" r="4" />
                                            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                                            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                                        </svg>
                                        Capacity: {room.capacity}
                                    </div>
                                    <div className={`stat-chip ${isAvailable ? 'stat-chip-green' : 'stat-chip-red'}`}>
                                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                                            <line x1="16" y1="2" x2="16" y2="6" />
                                            <line x1="8" y1="2" x2="8" y2="6" />
                                            <line x1="3" y1="10" x2="21" y2="10" />
                                        </svg>
                                        {room.available_slots} / {room.capacity} slots free
                                    </div>
                                </div>

                                {/* Slots bar */}
                                <div id="booking-slots-bar-wrap">
                                    <div id="booking-slots-bar">
                                        <div
                                            id="booking-slots-fill"
                                            style={{
                                                width: `${(room.available_slots / room.capacity) * 100}%`,
                                                background: isAvailable ? '#22c55e' : '#ef4444'
                                            }}
                                        />
                                    </div>
                                    <span id="booking-slots-label">
                                        {Math.round((room.available_slots / room.capacity) * 100)}% available
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ── RIGHT: Booking Form ── */}
                    <div id="booking-form-col">
                        <div id="booking-form-card">
                            <div id="form-card-header">
                                <h2>Reserve This Room</h2>
                                <p>Fill in the details below to complete your booking</p>
                            </div>

                            {!isAvailable ? (
                                <div id="booking-unavailable">
                                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="1.5">
                                        <circle cx="12" cy="12" r="10" />
                                        <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
                                    </svg>
                                    <p>This room is fully booked and unavailable for new reservations.</p>
                                    <button onClick={() => navigate('/rooms/')}>Browse Other Rooms</button>
                                </div>
                            ) : (
                                <form id="booking-form" onSubmit={handleBook}>

                                    <div className="form-group">
                                        <label className="form-label" htmlFor="booking-date">
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                                                <line x1="16" y1="2" x2="16" y2="6" />
                                                <line x1="8" y1="2" x2="8" y2="6" />
                                                <line x1="3" y1="10" x2="21" y2="10" />
                                            </svg>
                                            Booking Date
                                        </label>
                                        <input
                                            id="booking-date"
                                            type="date"
                                            className="form-input"
                                            value={date}
                                            min={today}
                                            onChange={(e) => setDate(e.target.value)}
                                        />
                                    </div>

                                    <div className="form-row">
                                        <div className="form-group">
                                            <label className="form-label" htmlFor="booking-start">
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <circle cx="12" cy="12" r="10" />
                                                    <polyline points="12 6 12 12 16 14" />
                                                </svg>
                                                Start Time
                                            </label>
                                            <input
                                                id="booking-start"
                                                type="time"
                                                className="form-input"
                                                value={startTime}
                                                onChange={(e) => setStartTime(e.target.value)}
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label className="form-label" htmlFor="booking-end">
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <circle cx="12" cy="12" r="10" />
                                                    <polyline points="12 6 12 12 16 14" />
                                                </svg>
                                                End Time
                                            </label>
                                            <input
                                                id="booking-end"
                                                type="time"
                                                className="form-input"
                                                value={endTime}
                                                onChange={(e) => setEndTime(e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    {/* Summary preview */}
                                    {date && startTime && endTime && startTime < endTime && (
                                        <div id="booking-summary">
                                            <div className="summary-row">
                                                <span className="summary-key">Room</span>
                                                <span className="summary-val">{room.name}</span>
                                            </div>
                                            <div className="summary-row">
                                                <span className="summary-key">Date</span>
                                                <span className="summary-val">{new Date(date).toLocaleDateString('en-IN', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}</span>
                                            </div>
                                            <div className="summary-row">
                                                <span className="summary-key">Time</span>
                                                <span className="summary-val">{startTime} – {endTime}</span>
                                            </div>
                                        </div>
                                    )}

                                    <button
                                        id="booking-submit-btn"
                                        type="submit"
                                        disabled={submitting}
                                    >
                                        {submitting ? (
                                            <>
                                                <span className="btn-spinner"></span>
                                                Confirming…
                                            </>
                                        ) : (
                                            <>
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                                    <polyline points="20 6 9 17 4 12" />
                                                </svg>
                                                Confirm Booking
                                            </>
                                        )}
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default BookingPage