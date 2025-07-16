import React, { useEffect, useState } from "react";
import './App.css'; // ✅ Make sure App.css exists in src/

const API = "http://localhost:5000"; // Change this if your backend runs on a different port

function App() {
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [newUserName, setNewUserName] = useState("");
  const [leaderboard, setLeaderboard] = useState([]);
  const [lastClaim, setLastClaim] = useState("");

  useEffect(() => {
    fetchUsers();
    fetchLeaderboard();
  }, []);

  const fetchUsers = async () => {
    const res = await fetch('${API}/users');
    const data = await res.json();
    setUsers(data);
  };

  const fetchLeaderboard = async () => {
    const res = await fetch('${API}/leaderboard');
    const data = await res.json();
    setLeaderboard(data);
  };

  const addUser = async () => {
    if (!newUserName.trim()) return;
    await fetch('${API}/users', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newUserName }),
    });
    setNewUserName("");
    fetchUsers();
    fetchLeaderboard();
  };

  const claimPoints = async () => {
    if (!selectedUserId) return;
    const res = await fetch('${API}/claim', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: selectedUserId }),
    });
    const data = await res.json();
    setLastClaim('🎉 ${data.name} claimed ${data.points} points!');
    fetchUsers();
    fetchLeaderboard();
  };

  return (
    <div className="container">
      <h1 className="title">🎯 User Points Leaderboard</h1>

      <div style={{ marginBottom: "20px" }}>
        <select
          className="select-box"
          value={selectedUserId}
          onChange={(e) => setSelectedUserId(e.target.value)}
        >
          <option value="">-- Select a User --</option>
          {users.map((user) => (
            <option key={user._id} value={user._id}>
              {user.name}
            </option>
          ))}
        </select>

        <button className="button" onClick={claimPoints}>
          Claim Points
        </button>
      </div>

      {lastClaim && <p className="message">{lastClaim}</p>}

      <div style={{ marginBottom: "20px" }}>
        <input
          className="input-box"
          type="text"
          placeholder="Enter new user"
          value={newUserName}
          onChange={(e) => setNewUserName(e.target.value)}
        />
        <button className="button button-blue" onClick={addUser}>
          Add User
        </button>
      </div>

      <table className="leaderboard-table">
        <thead>
          <tr>
            <th>Rank</th>
            <th>Name</th>
            <th>Total Points</th>
          </tr>
        </thead>
        <tbody>
          {leaderboard.map((user, index) => (
            <tr key={user._id}>
              <td>{index + 1}</td>
              <td>{user.name}</td>
              <td>{user.points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;