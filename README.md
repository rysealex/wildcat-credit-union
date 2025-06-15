# 🏦 Wildcat Credit Union Banking Web Application

## 📄 Overview
**Wildcat Credit Union** is a full-stack banking web application built to deliver secure, modern, and efficient banking services. Developed with the Software Development Life Cycle (SDLC) and documented using Microsoft Visio and Project, this app showcases robust architecture and professional development practices.

- **Frontend:** React.js
- **Backend:** Node.js, Express.js
- **Database:** MySQL
- **Containerization:** Docker
- **APIs:** Google Maps API
- **Documentation:** Microsoft Visio, Microsoft Project

---

## 🚀 Key Features

### 🔐 Secure User Authentication
- Password encryption and secure credential handling.
- Account lockdown feature for enhanced security.

### 🧾 Account Management
- Create and manage bank accounts.
- View account balances and transaction history.

### 💸 Fund Transfers
- Seamlessly transfer funds between linked accounts.

### 💰 Deposit & Receive
- Simple interface for handling deposits and incoming transactions.

### 📍 ATM Locator
- Integrated Google Maps API.
- Displays Wildcat Credit Union ATMs near Central Washington University.
- Get live directions to selected ATMs.

### 🐳 Docker Containerization
- Entire application runs in isolated containers for consistent deployment and local development.

---

## 🗂️ Project Documentation

### 📊 Project Plan (Gantt Chart) 
Located in the **/documentation/Project Plan** folder.
<img src="./documentation/Project Plan/ProjectPlanGantt1.png" alt="Gantt Chart" width="800"/>

### 📋 Analysis
Includes requirements, sequence diagrams, and use cases located in the **/documentation/Analysis** folder.
<img src="./documentation/Analysis/RegistrationSequenceDiagram.png" alt="Sequence Diagram" width="600"/>

### 🛠️ Design
Covers activity diagrams, class diagrams, and the Requirements Traceability Matrix (RTM) located in the **/documentation/Design** folder.
<img src="./documentation/Design/ATMLocatorActivityDiagram.png" alt="Activity Diagram" width="600"/>

### ✅ Testing
Test cases for verifying system functionality are included in the **/documentation/Testing** folder.

### 🧑‍🏫 Group Presentation
Final PowerPoint presentation available in the **/documentation/Group Presentation** folder.

### 📂 Full Documentation
You can explore all diagrams, documents, and files in the **/documentation** folder of this repository.

---

## 🛠️ Local Setup Instructions

### ✅ Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop) (installed and running)
- [Git](https://git-scm.com/)
- [Make](https://www.gnu.org/software/make/)

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/wildcat-credit-union.git
cd wildcat-credit-union
```
### 2. Configure Environment Variables
Create a .env file in both the client/ and server/ directories:
- client/.env
```bash
REACT_APP_Maps_API_KEY=AIzaSyCMT1qgGGU593rZLwtJtPDEMYOoYmib82Q
REACT_APP_Maps_MAP_ID=fd06dc25e21bc77e58abb98f
```
- server/.env
```bash
MYSQL_HOST=db    
MYSQL_USER=root
MYSQL_PASSWORD=rootpass
MYSQL_DATABASE=wcu_db
```
### 3. Run the Application
Ensure Docker Desktop is running, then from the root project directory:
```bash
make run
```
Once the containers are up, open your browser and navigate to:
http://localhost:3000

### 4. Stop and Clean Up
To stop the application:
- Press Ctrl + C

To clean up the Docker containers:
```bash
make clean
```

---

## 📱 Usage Guide
### 1. Register: Create a secure user account.

### 2. Login: Log in with your credentials.

### 3. Explore:

- Open new bank accounts.

- Transfer money between accounts.

- Deposit funds or receive payments.

- Use the ATM Locator for ATM navigation.

---

## 👨‍💻 Developers

- Alex Ryse

- Garrett Kraxberger

- Victoria Cendejas Garibay

Students at Central Washington University
