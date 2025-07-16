# 📘 Overview 🚀🚀🚀

This module handles secure score updates for users and live score broadcast to clients. It make sure

- Prevent hacking to increase scores.

- Score updates are only enabled by valid users with sufficient permissions to act

- Show realtime top 10 scoreboard updates.

# ⚙️ High Architecture

![Scoreboard_API_Module](Scoreboard_API_Module.png)

# 📌 Endpoints

### List APIs as below

#### API 1

- Endpoint: POST `/api/v1/update-score`

- Description:
  API used to increase the score of a specified user, user action needs valid permission to update the score in the system.

- Header

```makefile
Authorization: Bearer <JWT Token>
```

- Body

```json
{
  "actionId": "T001" // some-unique-identifier
}
```

- Response

```json
{
  "statusCode": 200,
  "message": "Update score of user successfully!",
  "newScore": 1450
}
```

- Validations

  - JWT must be valid and not expired.

  - `actionId` must be unique and verifiable.

# 🗃️ Database Structure

```postgres
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) NOT NULL,
  score INT DEFAULT 0,
  created_by VARCHAR(255),
  updated_by VARCHAR(255),
  created_dt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_dt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create an index on the score column
CREATE INDEX idx_user_score ON "user"(score);
```

# 📡 WebSocket

- Endpoint: `/ws/scoreboard`

- Description:

  - Broadcasts top 10 scores in real-time to all connected clients.
  - Emitted after every valid score update.

- Payload

```json
{
  "scoreboard": [
    { "username": "Tom", "score": 1000 },
    { "username": "Jerry", "score": 2000 },
    ...
  ]
}
```

# ⏱️ Real-Time Broadcast Flow

- Score update succeeds in DB.

- Top 10 queried from DB (ORDER BY score DESC LIMIT 10).

- Result pushed via WebSocket.

# 🔐 Security Measures

- Authentication: All API calls require a valid JWT.

- Rate Limiting: Throttle score update endpoint (e.g. 5 times/min).

- Action Verification: Optional nonce or signed action ID to verify the legitimacy of the user’s action.

- Audit Logging: Log all score update attempts with IP, userID, timestamp.

- Replay Prevention: Reject duplicate actionId values.

- WebSocket Auth: Only authenticated clients can subscribe to /ws/scoreboard.

# ✅ TODOs for Engineering Team

- Implement secure JWT authentication and user identity resolution.

- Enforce rate limiting on `/api/v1/update-score`.

- Prevent duplicate or replayed actionId.

- Secure WebSocket server with token-based handshake.

- Create a pub-sub mechanism (e.g. Redis) for scalability.
