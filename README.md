# ChefMate: Smart Kitchen Assistant with AI

ChefMate is a smart kitchen assistant platform that helps users search for recipes, plan menus, and receive real-time cooking advice through an AI-powered chatbot. ChefMate assists users by recommending recipes, offering personalized cooking tips, and organizing weekly meal plans based on their available ingredients, dietary restrictions, or preferences.

## Table of Contents

1. [Features](#features)
2. [Tech Stack](#tech-stack)
3. [Installation](#installation)
4. [Usage](#usage)
5. [Contributing](#contributing)
6. [License](#license)

## Features

- **Recipe Search**: Find and filter recipes by ingredients, food types, or dietary restrictions (e.g., vegetarian, gluten-free).
- **Meal Planning**: Create weekly meal plans with shopping list generation.
- **AI Chatbot Cooking Assistant**: Real-time cooking advice, personalized cooking techniques, and recipe adjustments powered by AI.
- **User Reviews & Sharing**: Review and share recipes, save favorites, and browse recommendations.

## Tech Stack

### Frontend
- **Framework**: React or Next.js
- **UI Framework**: Tailwind CSS or Material-UI
- **State Management**: Redux or Context API

### Backend
- **Server**: Node.js with Express.js
- **Database**: MongoDB or PostgreSQL

### AI Model Integration
- **AI Engine**: Connect to Ollama Model using an API

## Installation

### Prerequisites

- Node.js (v14 or higher)
- MongoDB or PostgreSQL
- Environment variables (see [Environment Variables](#environment-variables))

### Steps

1. **Clone the repository**:
   ```bash
   git clone https://github.com/krtnp/ChefMate.git
   ```

2. **Install dependencies**:
   ```bash
   cd ChefMate
   npm install
   ```

3. **Configure environment variables**: Create a `.env` file in the project root and add the necessary environment variables (see below).

4. **Start the development server**:
   ```bash
   npm run dev
   ```

5. **Run the backend server**:
   ```bash
   npm run server
   ```

## Usage

Once the development server is running, you can access the ChefMate platform at `http://localhost:3000`.

1. **Search for recipes**: Input ingredients or food types to get recipe recommendations.
2. **Plan your meals**: Create a weekly meal plan, and generate a shopping list based on your selected recipes.
3. **AI Chatbot**: Use the chatbot to get cooking tips and personalized recommendations.

## Contributing

We welcome contributions! If you want to help improve ChefMate, feel free to fork this repository, create a feature branch, and submit a pull request. 

1. Fork the repository
2. Create a new feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m 'Add new feature'`
4. Push to the branch: `git push origin feature/my-feature`
5. Submit a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
