# Campus Notifications

Minimal Campus Notifications app (backend + frontend).

Folder structure

- notification_app_be/
  - server.js
  - utils/priority.js
- notification_app_fe/
  - index.html
  - package.json
  - src/
    - main.jsx
    - App.jsx
    - api.js
    - components/
      - NotificationCard.jsx
      - FilterBar.jsx
      - PriorityInbox.jsx

Requirements

- Node 16+ and npm

Install & Run

1) Backend

cd notification_app_be
npm init -y
npm install express axios cors
node server.js

Server runs on :4000 by default.

2) Frontend (dev)

cd notification_app_fe
npm install
npm run dev

The frontend uses Vite. To point to a remote API set VITE_API in .env or use the default http://localhost:4000.

Notes

- No database; in-memory store only.
- Priority computed as (typeWeight * 1e9) + timestampSeconds.
- Top N unread maintained efficiently with min-heap in utils/priority.js.
