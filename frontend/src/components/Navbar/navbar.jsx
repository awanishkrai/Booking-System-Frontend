import rect from "react";

export default function Navbar() {
  return (
    <div id="navbar">
      <h1>RoomFinder</h1>
      <div id="navLinks">
        <a href="/login">Login</a>
        <a href="/register">Register</a>
      </div>
    </div>
  );
}