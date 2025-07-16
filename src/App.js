import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [randomPoints, setRandomPoints] = useState(null);
  const [newUserName, setNewUserName] = useState('');

  const backendURL = 'http://localhost:5000';

  // Fetch users
  const fetchUsers = async () => {
    try {
      const res = await axios.get(backendURL + '/api/users');
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAddUser = async () => {
    if (!newUserName.trim()) return;
    try {
      await axios.post(backendURL + '/api/users', { name: newUserName });
      setNewUserName('');
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  const handleClaim = async () => {
    if (!selectedUserId) return;
    try {
      const res = await axios.post(backendURL + '/api/claim', {
        userId: selectedUserId,
      });
      setRandomPoints(res.data.randomPoints);
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container">
      <h1>🏆 User Points Leaderboard</h1>

      <div className="card">
        <h2>Select User</h2>
        <select
          value={selectedUserId}
          onChange={(e) => setSelectedUserId(e.target.value)}
        >
          <option value="">-- Select a user --</option>
          {users.map((user) => (
            <option key={user._id} value={user._id}>
              {user.name}
            </option>
          ))}
        </select>

        <button onClick={handleClaim}>Claim Points</button>

        {randomPoints && (
          <p className="points">🎉 Random Points Claimed: {randomPoints}</p>
        )}
      </div>

      <div className="card">
        <h2>Add New User</h2>
        <input
          type="text"
          value={newUserName}
          onChange={(e) => setNewUserName(e.target.value)}
          placeholder="Enter name"
        />
        <button onClick={handleAddUser}>Add User</button>
      </div>

      <div className="card leaderboard">
        <h2>Leaderboard</h2>
        <table>
          <thead>
            <tr>
              <th>Rank</th>
              <th>Name</th>
              <th>Total Points</th>
            </tr>
          </thead>
          <tbody>
            {users
              .sort((a, b) => b.points - a.points)
              .map((user, index) => (
                <tr key={user._id}>
                  <td>{index + 1}</td>
                  <td>{user.name}</td>
                  <td>{user.points}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
