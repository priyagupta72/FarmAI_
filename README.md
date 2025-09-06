# FarmAI 🌱


FarmAI is an innovative AI-powered web application designed to empower farmers and agricultural enthusiasts with data-driven insights and intelligent tools. It offers crop recommendations, fertilizer suggestions, plant disease detection, and an AI chatbot for expert agricultural guidance. By leveraging advanced machine learning algorithms and generative AI, FarmAI helps users make informed decisions, optimize crop yield, and promote sustainable farming practices.

---

## 🚀 Live Demo

Explore the deployed application here: [FarmAI Live](https://farmai-2-m5gc.onrender.com)

---

## 💡 Key Features

- ✅ **User Authentication:** Secure sign-up and sign-in functionality to protect user data and personalize the experience.
- 🌱 **AI Crop Recommendation:** Provides optimal crop suggestions based on key environmental factors such as Nitrogen (N), Phosphorous (P), Potassium (K) levels in the soil, pH, and rainfall patterns.
- 🧪 **Fertilizer Recommendation:** Recommends the most suitable fertilizers tailored to specific crops, optimizing nutrient delivery and promoting healthy plant growth.
- 🐛 **Disease Detection:** Utilizes image recognition technology to identify plant diseases accurately, enabling timely intervention and preventing widespread crop loss.
- 🤖 **AI Chatbot:** Offers instant agricultural guidance and expert advice through an intelligent chatbot powered by Google's Gemini AI.
- 📱 **Responsive UI:** Ensures a seamless user experience across various devices, including desktops, tablets, and smartphones.
- 🛡️ **Secure Backend:** Implements robust security measures, including authentication and protected API endpoints, to safeguard sensitive data.

---

## 💻 Tech Stack

| Category     | Technology                  | Description                                                                  |
|--------------|-----------------------------|------------------------------------------------------------------------------|
| **Frontend** | React                       | JavaScript library for building user interfaces                               |
|              | React Router                | Navigation and routing for single-page applications                          |
|              | Framer Motion               | Animation library for creating smooth and engaging UI interactions            |
|              | Slick Carousel              | Responsive carousel component for showcasing content                           |
| **Backend**  | Node.js                     | JavaScript runtime environment for server-side development                   |
|              | Express                     | Web application framework for building robust APIs                             |
|              | MongoDB                     | NoSQL database for storing application data                                    |
| **AI Services**| Google Generative AI (Gemini) | Provides advanced AI capabilities for the chatbot feature                      |
|              | Custom ML Models            | Machine learning models for crop recommendation and disease detection          |
| **Styling**  | Tailwind CSS                | Utility-first CSS framework for rapid UI development                          |
|              | Custom CSS                  | Custom styling to enhance the application's visual appeal                     |
| **Deployment**| Render                      | Cloud platform for deploying and hosting the web application                   |

---

## ⚙️ Setup Instructions

### Prerequisites

- Node.js and npm installed on your machine.
- MongoDB account and connection string.
- Google Generative AI API Key.

### Installation

1.  **Obtain the Code:**

    The source code for this project can be obtained by cloning the repository from GitHub:

    3.  **Configuration:**

    > Add your MongoDB connection string and Google Generative AI API key to a `.env` file in the root directory.  Example:


    MONGODB_URI=your_mongodb_connection_string
    GEMINI_API_KEY=your_gemini_api_key
    1.  **User Interaction:** Users interact with the FarmAI web application through a responsive user interface.
2.  **Data Input:** Users provide necessary inputs such as soil parameters, crop details, and images for disease detection.
3.  **AI Processing:** The application utilizes AI models and the Gemini API to process user input and generate insights.
4.  **Recommendations:** FarmAI provides users with crop recommendations, fertilizer suggestions, and disease detection results.
5.  **Feedback Loop:** Users can provide feedback on the recommendations to improve the accuracy of the AI models over time.

