import LoginForm from './components/LoginForm/loginform'
import './App.css'
import { Routes, Route } from 'react-router-dom'
import RegisterForm from './components/Register Form/registerForm'
import AllRooms from './components/allRooms/allRooms'
import BookingPage from './components/bookingPage/bookingPage'
import MyBookings from './components/myBookings/myBookings'

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/rooms/" element={<AllRooms />} />
        <Route path="/rooms/:id" element={<BookingPage />} />
        <Route path="/bookings/" element={<MyBookings />} />
      </Routes>
    </>
  )
}
export default App
