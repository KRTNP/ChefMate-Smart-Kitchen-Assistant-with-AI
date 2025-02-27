# ChefMate: Your AI-Powered Cooking Companion

ChefMate is a smart kitchen assistant that leverages the power of AI to help you with all your cooking needs.  Powered by Ollama, ChefMate provides real-time cooking advice, recipe suggestions, and personalized guidance, all through a conversational interface.

## Key Features

*   **AI Chatbot Cooking Assistant:** Get instant cooking advice, troubleshoot kitchen challenges, and receive recipe modifications with ChefMate's intelligent chatbot.  Powered by locally run models using Ollama.
*   **Customizable AI:** Tailor the AI assistant's personality and knowledge by setting a custom system prompt.
*   **Flexible Model Support:** ChefMate works with various language models supported by Ollama, allowing you to choose the best model for your needs (default: `llama3.2`).
*   **Temperature Control:** Adjust the creativity and randomness of the AI's responses by tweaking the temperature setting.
* **Easy local Setup** Run locally using ollama and configure via env variables.

## Tech Stack

*   **AI Engine:** Ollama (local LLM server)
*   **Frontend:** (To be implemented - details will be added as developed)
*   **Backend:** (To be implemented - details will be added as developed)

## Getting Started

### Prerequisites

*   **Ollama:** You'll need to have Ollama installed and running locally. Follow the instructions on the [Ollama website](https://ollama.com/) for installation.
* **Supported models:** You will need to pull a model to use with ollama, like: `ollama pull llama3.2`
*   **Node.js:** (v14 or higher) for running the frontend and potentially any backend components.
* **Env variables:** (see [Environment Variables](#.env))

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/krtn/ChefMate-Smart-Kitchen-Assistant-with-AI.git
    ```

2.  **Navigate to the project directory:**
    ```bash
    cd ChefMate-Smart-Kitchen-Assistant-with-AI
    ```

3.  **Install dependencies:** (if there are dependencies, otherwise remove this)
    ```bash
    npm install
    ```

4.  **Environment Variables:**
    Create a `.env` file in the project's root directory and configure the following variables:

    ```
    VITE_OLLAMA_HOST=http://127.0.0.1:11434
    VITE_DEFAULT_MODEL=llama3.2
    VITE_DEFAULT_TEMPERATURE=0.7
    VITE_DEFAULT_SYSTEM_PROMPT="You are a helpful cooking assistant. You provide accurate, clear advice about cooking, recipes, and food preparation."
    ```

    *   `VITE_OLLAMA_HOST`: The URL where your Ollama server is running. The default is `http://127.0.0.1:11434`.
    *   `VITE_DEFAULT_MODEL`: The default model to use for the AI (e.g., `llama3.2`). Make sure you have downloaded the model in ollama.
    *   `VITE_DEFAULT_TEMPERATURE`: The default temperature for the AI model (a higher value, like 1.0, makes responses more creative; a lower value, like 0.2, makes them more focused). The default is 0.7.
    * `VITE_DEFAULT_SYSTEM_PROMPT`: The default prompt to instruct the model on its role.

5.  **Start the application:**
    ```bash
    npm run dev
    ```

### Using the AI Chatbot

Once the application is running, you can interact with the AI Chatbot:

1.  **Open the Chat Interface:** Access the AI Chatbot interface from your application's web view.
2.  **Ask Your Questions:** Type in your cooking-related questions, recipe requests, or any other kitchen-related inquiry.
3.  **Receive AI-Powered Answers:** The AI will provide real-time responses, tips, and recommendations.

## Advanced Configuration

*   **Changing the Model:** Set a different default model by changing `VITE_DEFAULT_MODEL` in the `.env` file. Ensure you have downloaded the model in ollama using `ollama pull <your-model>`.
*   **Adjusting Temperature:** Adjust the `VITE_DEFAULT_TEMPERATURE` in the `.env` file.
* **Custom System Prompt:** Tailor the AI assistant's personality by changing `VITE_DEFAULT_SYSTEM_PROMPT` to change its system prompt.

## Contributing

We welcome contributions! If you want to help improve ChefMate, feel free to fork this repository, create a feature branch, and submit a pull request.

1.  Fork the repository.
2.  Create a new feature branch: `git checkout -b feature/my-feature`.
3.  Commit your changes: `git commit -m 'Add new feature'`.
4.  Push to the branch: `git push origin feature/my-feature`.
5.  Submit a pull request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Future Development
- The frontend and backend for this application are in development.
- More features will be available in the future.
