import LoginForm from './components/LoginForm/loginform'
import './App.css'
import { Routes, Route } from 'react-router-dom'
import RegisterForm from './components/Register Form/registerForm'

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
      </Routes>
    </>
  )
}

export default App
