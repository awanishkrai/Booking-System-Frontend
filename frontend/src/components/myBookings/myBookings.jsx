import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../Navbar/navbar'
import { allBookings, cancelBooking } from '../../api/axios'
import './myBookings.css'

const STATUS_LABEL = {
    CONFIRMED: 'Confirmed',
    CANCELLED: 'Cancelled',
    COMPLETED: 'Completed',
    PENDING: 'Pending',
}

const STATUS_CLASS = {
    CONFIRMED: 'status-confirmed',
    CANCELLED: 'status-cancelled',
    COMPLETED: 'status-completed',
    PENDING: 'status-pending',
}

function MyBookings() {
    const navigate = useNavigate()
    const [bookings, setBookings] = useState([])
    const [loading, setLoading] = useState(true)
    const [cancellingId, setCancellingId] = useState(null)
    const [toast, setToast] = useState(null)
    const [filter, setFilter] = useState('ALL')

    useEffect(() => {
        const token = localStorage.getItem('token')
        if (!token) { navigate('/'); return }

        allBookings()
            .then((res) => {
                setBookings(res.data.data || res.data || [])
                setLoading(false)
            })
            .catch(() => {
                setLoading(false)
                showToast('error', 'Failed to load bookings.')
            })
    }, [])

    const showToast = (type, msg) => {
        setToast({ type, msg })
        setTimeout(() => setToast(null), 4000)
    }

    const handleCancel = async (bookingId) => {
        if (!window.confirm('Are you sure you want to cancel this booking?')) return
        setCancellingId(bookingId)
        try {
            await cancelBooking(bookingId)
            setBookings((prev) =>
                prev.map((b) =>
                    b.id === bookingId ? { ...b, status: 'CANCELLED' } : b
                )
            )
            showToast('success', 'Booking cancelled successfully.')
        } catch (err) {
            const msg = err?.response?.data?.detail || 'Could not cancel booking.'
            showToast('error', msg)
        } finally {
            setCancellingId(null)
        }
    }

    const filtered = filter === 'ALL'
        ? bookings
        : bookings.filter((b) => b.status === filter)

    const formatDate = (d) => d
        ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
        : '—'

    const formatTime = (t) => t ? t.slice(0, 5) : '—'

    return (
        <div id="my-bookings-page">
            <Navbar />

            {toast && (
                <div id="mb-toast" className={`toast-${toast.type}`}>
                    <span className="toast-icon">{toast.type === 'success' ? '✓' : '⚠'}</span>
                    {toast.msg}
                </div>
            )}

            <div id="mb-container">
                {/* Header */}
                <div id="mb-header">
                    <div>
                        <h1 id="mb-title">My Bookings</h1>
                        <p id="mb-subtitle">Manage and track all your room reservations</p>
                    </div>
                    <button id="mb-new-btn" onClick={() => navigate('/rooms/')}>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <line x1="12" y1="5" x2="12" y2="19" />
                            <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                        New Booking
                    </button>
                </div>

                {/* Filter Tabs */}
                <div id="mb-filters">
                    {['ALL', 'CONFIRMED', 'COMPLETED', 'CANCELLED'].map((f) => (
                        <button
                            key={f}
                            className={`mb-filter-btn ${filter === f ? 'mb-filter-active' : ''}`}
                            onClick={() => setFilter(f)}
                        >
                            {f === 'ALL' ? 'All' : STATUS_LABEL[f]}
                            <span className="mb-filter-count">
                                {f === 'ALL'
                                    ? bookings.length
                                    : bookings.filter((b) => b.status === f).length}
                            </span>
                        </button>
                    ))}
                </div>

                {/* Content */}
                {loading ? (
                    <div id="mb-loading">
                        <div className="mb-spinner"></div>
                        <p>Loading your bookings…</p>
                    </div>
                ) : filtered.length === 0 ? (
                    <div id="mb-empty">
                        <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="1.2">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                            <line x1="16" y1="2" x2="16" y2="6" />
                            <line x1="8" y1="2" x2="8" y2="6" />
                            <line x1="3" y1="10" x2="21" y2="10" />
                            <line x1="8" y1="14" x2="16" y2="14" strokeWidth="1.5" />
                        </svg>
                        <p id="mb-empty-title">No bookings found</p>
                        <p id="mb-empty-sub">
                            {filter === 'ALL'
                                ? "You haven't made any bookings yet."
                                : `No ${STATUS_LABEL[filter].toLowerCase()} bookings.`}
                        </p>
                        {filter === 'ALL' && (
                            <button id="mb-browse-btn" onClick={() => navigate('/rooms/')}>
                                Browse Rooms
                            </button>
                        )}
                    </div>
                ) : (
                    <div id="mb-list">
                        {filtered.map((booking) => {
                            const canCancel = booking.status === 'CONFIRMED'
                            const isCancelling = cancellingId === booking.id
                            return (
                                <div className="mb-card" key={booking.id}>
                                    <div className="mb-card-left">
                                        <div className="mb-card-icon">
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                                                <rect x="2" y="3" width="20" height="18" rx="2" />
                                                <path d="M8 3v18M16 3v18M2 9h20M2 15h20" />
                                            </svg>
                                        </div>
                                        <div className="mb-card-details">
                                            <h3 className="mb-card-room">
                                                {booking.room_name || booking.room || `Room #${booking.room}`}
                                            </h3>
                                            <div className="mb-card-meta">
                                                <span className="mb-meta-item">
                                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                                                        <line x1="16" y1="2" x2="16" y2="6" />
                                                        <line x1="8" y1="2" x2="8" y2="6" />
                                                        <line x1="3" y1="10" x2="21" y2="10" />
                                                    </svg>
                                                    {formatDate(booking.date)}
                                                </span>
                                                <span className="mb-meta-item">
                                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <circle cx="12" cy="12" r="10" />
                                                        <polyline points="12 6 12 12 16 14" />
                                                    </svg>
                                                    {formatTime(booking.start_time)} – {formatTime(booking.end_time)}
                                                </span>
                                                {booking.idempotency_key && (
                                                    <span className="mb-meta-item mb-ref">
                                                        Ref: {booking.idempotency_key.slice(0, 8).toUpperCase()}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mb-card-right">
                                        <span className={`mb-status ${STATUS_CLASS[booking.status] || 'status-pending'}`}>
                                            {STATUS_LABEL[booking.status] || booking.status}
                                        </span>
                                        {canCancel && (
                                            <button
                                                className="mb-cancel-btn"
                                                onClick={() => handleCancel(booking.id)}
                                                disabled={isCancelling}
                                            >
                                                {isCancelling ? (
                                                    <span className="mb-cancel-spinner"></span>
                                                ) : (
                                                    <>
                                                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                                            <line x1="18" y1="6" x2="6" y2="18" />
                                                            <line x1="6" y1="6" x2="18" y2="18" />
                                                        </svg>
                                                        Cancel
                                                    </>
                                                )}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    )
}

export default MyBookings
