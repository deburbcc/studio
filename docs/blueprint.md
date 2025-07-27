# **App Name**: AutoMedic

## Core Features:

- Login & Authentication: User authentication and session management via a login page with email and password fields, secured by token storage and handling.
- Dashboard Summary: Display doctor's summary data from REST API on a dashboard with key stats.
- Patient Directory: List patients fetched from a REST endpoint, searchable and navigable to detail views.
- Patient Details View: Display a patient's complete profile fetched from the REST API, along with the option to start a new prescription.
- Prescription Form: Generate a structured form for creating new prescriptions, which supports repeatable medication entries and detailed medical information.
- Prescription Sharing: Enable users to send prescriptions to patients or clinic via REST calls for email, WhatsApp, and clinic reception.
- Account settings: Doctor Settings: Doctor details fetched from, and updated to, the REST API can be edited within the settings.

## Style Guidelines:

- Primary color: Soft light blue (#E0F2FF), reflecting calmness and reliability.
- Background color: Very light blue (#F5FAFE), providing a clean and unobtrusive background.
- Accent color: A slightly darker shade of blue (#A2D1FF) to highlight interactive elements.
- Font: 'Roboto' (sans-serif) as requested by the user. Note: currently only Google Fonts are supported.
- Follow Material Design principles, using soft shadows and 2xl rounded corners as specified.
- Implement a responsive layout ensuring adaptability and consistent rendering across various screen sizes and devices.
- Apply subtle animations and transitions for UI elements, like loading screens, button presses, and form validation feedback, to enhance user engagement and provide clear system status indicators.