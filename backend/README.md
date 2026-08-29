# Project Manager API

A MERN-stack backend for a collaborative project/task management tool (Trello/Asana-style), featuring JWT authentication, role-based permissions, nested resource hierarchies, file uploads, real-time updates via Socket.io, and in-app notifications.

## Table of Contents

- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Setup & Installation](#setup--installation)
- [Environment Variables](#environment-variables)
- [Resource Hierarchy](#resource-hierarchy)
- [Authentication](#authentication)
- [Permissions Model](#permissions-model)
- [API Reference](#api-reference)
  - [Auth](#auth)
  - [Workspaces](#workspaces)
  - [Projects](#projects)
  - [Tasks](#tasks)
  - [Comments](#comments)
  - [Attachments](#attachments)
  - [Notifications](#notifications)
- [Real-Time Events (Socket.io)](#real-time-events-socketio)
- [Pagination & Filtering](#pagination--filtering)

---

## Tech Stack

- **Runtime:** Node.js + Express
- **Database:** MongoDB + Mongoose
- **Auth:** JWT (jsonwebtoken) + bcrypt
- **File uploads:** Multer (disk storage)
- **Real-time:** Socket.io

## Project Structure

```
backend/
├── config/
│   └── db.js                  # MongoDB connection
├── controllers/                # Business logic per resource
├── middleware/
│   ├── authMiddleware.js       # JWT verification (protect)
│   ├── workspaceAuth.js        # isMember / isOwner / isWorkspaceMember
│   ├── projectAuth.js          # isProjectMember factory
│   └── taskAuth.js             # isTaskMember factory
├── models/                     # Mongoose schemas
├── routes/                     # Express routers
├── utils/
│   ├── generateToken.js        # JWT signing helper
│   └── socket.js               # Socket.io init + getIO()
├── uploads/                    # Uploaded file storage (gitignored contents)
├── .env.example
└── server.js
```

## Setup & Installation

```bash
git clone <repo-url>
cd backend
npm install
cp .env.example .env   # then fill in real values
npm run dev             # or: npx nodemon server.js
```

Server runs on `http://localhost:<PORT>` (default suggested: 5050).

## Environment Variables

| Variable | Description |
|---|---|
| `PORT` | Port the server listens on |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret used to sign JWTs |

## Resource Hierarchy

```
User
 └── Workspace (members: [{ user, role: 'owner' | 'member' }])
      └── Project
           └── Task
                ├── Comment
                └── Attachment
Notification (independent resource, created as a side effect of Task/Comment actions)
```

Access to any nested resource is derived by walking **up** this chain to find the owning Workspace and checking membership there — never trusted from client-supplied IDs.

## Authentication

All protected routes require a header:

```
Authorization: Bearer <token>
```

Tokens are obtained via `POST /api/auth/register` or `POST /api/auth/login`, and expire after 7 days. The `protect` middleware decodes the token, loads the user (excluding the password hash), and attaches it to `req.user`.

## Permissions Model

| Role | Can do |
|---|---|
| **Owner** (of a workspace) | Everything a member can, plus: update/delete the workspace, add members |
| **Member** (of a workspace) | View/create/update/delete projects, tasks, comments, attachments within that workspace |
| **Any authenticated user** | Create workspaces (becoming owner), register/login |

Additional resource-specific rules:
- Only a comment's **author** may delete that comment.
- Only an attachment's **uploader** may delete that attachment.
- Any workspace member may update or delete any task (matches common collaborative-tool behavior).

---

## API Reference

Base URL: `/api`

### Auth

| Method | Endpoint | Auth | Body | Description |
|---|---|---|---|---|
| POST | `/auth/register` | No | `{ username, email, password }` | Create an account, returns user info + token |
| POST | `/auth/login` | No | `{ email, password }` | Authenticate, returns user info + token |

### Workspaces

Base: `/workspaces`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/` | Yes | Create a workspace (creator becomes owner) |
| GET | `/` | Yes | List workspaces the user belongs to *(paginated)* |
| GET | `/:id` | Yes, member | Get one workspace |
| PUT | `/:id` | Yes, owner | Update workspace name |
| DELETE | `/:id` | Yes, owner | Delete workspace |
| POST | `/:id/members` | Yes, owner | Add a member by email — body: `{ email, role? }` |
| POST | `/:workspaceId/projects` | Yes, member | Create a project in this workspace |
| GET | `/:workspaceId/projects` | Yes, member | List projects in this workspace *(paginated, `?name=` search)* |

### Projects

Base: `/projects`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/:id` | Yes, workspace member | Get one project |
| PUT | `/:id` | Yes, workspace member | Update project name/description |
| DELETE | `/:id` | Yes, workspace member | Delete project |
| POST | `/:projectId/tasks` | Yes, workspace member | Create a task in this project |
| GET | `/:projectId/tasks` | Yes, workspace member | List tasks *(paginated, filterable — see below)* |

### Tasks

Base: `/tasks`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/:id` | Yes, workspace member | Get one task |
| PUT | `/:id` | Yes, workspace member | Update task (title, description, status, priority, assignee by email) |
| DELETE | `/:id` | Yes, workspace member | Delete task |
| POST | `/:taskId/comments` | Yes, workspace member | Add a comment to a task |
| GET | `/:taskId/comments` | Yes, workspace member | List comments on a task |
| DELETE | `/:taskId/comments/:id` | Yes, comment author | Delete a comment |
| POST | `/:taskId/attachments` | Yes, workspace member | Upload a file — multipart form-data, field name `file` |
| GET | `/:taskId/attachments` | Yes, workspace member | List attachments on a task |
| DELETE | `/:taskId/attachments/:id` | Yes, uploader | Delete an attachment (removes DB record + file from disk) |

**Task fields:** `title` (required), `description`, `status` (`todo` \| `in-progress` \| `done`, default `todo`), `priority` (`low` \| `medium` \| `high`, default `medium`), `assignee` (set via email in request body, stored as user ref), `createdBy`, `project`.

### Comments

Fields: `text` (required), `author` (auto-set from token), `task`.

### Attachments

Fields: `filename`, `size`, `mimetype`, `url` (e.g. `/uploads/<filename>`, served statically), `uploadedBy`, `task`.

### Notifications

Base: `/notifications`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/` | Yes | List current user's notifications, newest first *(paginated)* |
| PUT | `/:id/read` | Yes, recipient only | Mark a notification as read |

Notifications are created automatically (not via direct client request) when:
- A user is assigned to a task (`type: 'task_assigned'`)
- Someone comments on a task the current user is assigned to (`type: 'new_comment'`, skipped if the commenter is the assignee)

---

## Real-Time Events (Socket.io)

Connect to the same host/port as the REST API. Clients should join rooms to scope which events they receive:

| Client emits | Payload | Effect |
|---|---|---|
| `joinTask` | `taskId` (string) | Joins the room for a specific task |
| `joinUser` | `userId` (string) | Joins the room for personal notifications |

| Server emits | Room | Payload | Fired when |
|---|---|---|---|
| `newComment` | task | comment object | A comment is created |
| `newAttachment` | task | attachment object | A file is uploaded |
| `updateTask` | project | updated task object | A task is updated |
| `newNotification` | user | notification object | A notification is created for that user |

## Pagination & Filtering

List endpoints (`workspaces`, `projects`, `tasks`, `notifications`) accept:

| Query param | Applies to | Notes |
|---|---|---|
| `page` | all list endpoints | Default `1`, minimum `1` |
| `limit` | all list endpoints | Default `10`, minimum `1`, maximum `100` |
| `status` | tasks | Exact match |
| `priority` | tasks | Exact match |
| `assignee` | tasks | Exact match on user ID |
| `name` | projects | Case-insensitive partial match |

Every paginated response has the shape:
```json
{
  "<resource>": [ ... ],
  "pagination": { "total": 42, "page": 1, "limit": 10, "totalPages": 5 }
}
```
