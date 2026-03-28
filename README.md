# WanderLust: Premium Airbnb Clone 🌍

A modern, full-stack Airbnb clone built with the MERN stack (MongoDB, Express, EJS, and Node.js). Features include listing management, a premium glassmorphism UI, fuzzy search, and an interactive review system.

## ✨ Features
- **Premium UI**: Glassmorphism navbar with blur effects and polished card interactions.
- **Working Search**: Fuzzy search by Title, Location, or Country.
- **Reviews**: Integrated guest review system with star ratings.
- **Authorization**: Secure host-only listing controls (Edit/Delete).
- **Aesthetics**: Responsive design using Inter font and Airbnb-inspired color palettes.

---

## 🚀 How to Run Locally

Follow these steps to set up and run the project from GitHub:

### 1. Clone the Repository
```bash
git clone https://github.com/vkurmi2004/MAJORPROJECT.git
cd MAJORPROJECT
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environment Variables
Create a file named `.env` in the root directory and add the following:
```env
# Your MongoDB connection string (Local or Atlas)
DB_URL=mongodb://127.0.0.1:27017/wanderlust

# Any secret string for session cookies
SECRET=mysupersecretstring

# Server Port (Optional)
PORT=8080
```

### 4. Seed the Database
Before running the app, initialize the database with sample listings:
```bash
node init/index.js
```

### 5. Start the Server
```bash
npm start
```
The app will be live at: **[http://localhost:8080](http://localhost:8080)**

---

## 🛠️ Technology Stack
- **Frontend**: EJS (Embedded JavaScript), Bootstrap 5, Custom CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: Passport.js
- **Tools**: Method-Override, Connect-Flash, Dotenv, Node-Geocoder

## 👤 Author
- **Vivek Kurmi** ([@vkurmi2004](https://github.com/vkurmi2004))
