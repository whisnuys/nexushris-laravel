# NexusHRIS - Modern Human Resource Information System

![NexusHRIS Banner](https://via.placeholder.com/1200x400?text=NexusHRIS+Dashboard)

NexusHRIS is a comprehensive, modern Human Resource Information System built with **Laravel 12**, **Inertia.js**, **React**, and **Tailwind CSS**. It provides a seamless experience for managing employees, attendance, payroll, and more, featuring a beautiful UI with full **Dark Mode** support.

## 🚀 Tech Stack

-   **Backend**: Laravel 12
-   **Frontend**: React 18 (TypeScript)
-   **Glue**: Inertia.js
-   **Styling**: Tailwind CSS
-   **Icons**: Lucide React
-   **Database**: MySQL

## ✨ Key Features

### 👥 Employee Management

-   Comprehensive employee profiles
-   Department and role management
-   Document storage

### ⏱️ Attendance & Leave

-   Daily attendance tracking
-   Leave request and approval workflow
-   Real-time attendance stats

### 💰 Payroll

-   Automated payroll processing
-   Salary structure management
-   Payslip generation

### 📢 Communication

-   **Announcements System**: Create and publish company-wide announcements
-   **Notification Center**: Real-time notification dropdown for important updates
-   **Priority Levels**: Urgent, High, Normal, Low priority announcements

### 📊 Reports & Analytics

-   **Interactive Dashboard**: Key metrics at a glance
-   **Detailed Reports**: Attendance, Leave, and Payroll analytics
-   **Visual Trends**: Charts and graphs for data visualization

### 🎨 UI/UX

-   **Dark Mode**: Fully supported across all components
-   **Responsive Design**: Works seamlessly on desktop and mobile
-   **Modern Components**: Custom-built UI components (Cards, Tables, Stats)

## 🛠️ Installation

1. **Clone the repository**

    ```bash
    git clone https://github.com/yourusername/nexushris-laravel.git
    cd nexushris-laravel
    ```

2. **Install PHP dependencies**

    ```bash
    composer install
    ```

3. **Install Node.js dependencies**

    ```bash
    npm install
    ```

4. **Environment Setup**

    ```bash
    cp .env.example .env
    php artisan key:generate
    ```

    _Configure your database settings in `.env`_

5. **Run Migrations & Seeders**

    ```bash
    php artisan migrate --seed
    ```

6. **Start Development Server**

    ```bash
    # Terminal 1: Laravel Server
    php artisan serve

    # Terminal 2: Vite Dev Server
    npm run dev
    ```

## 📝 License

This project is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).
