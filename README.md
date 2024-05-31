# Web Terminal

This is a simple web terminal application that allows users to interact with a server via a web browser.

## Discord Community

Join our Discord community for support and discussions: [Click Here](https://discord.gg/Pv8WgVQrwY) 🙂

## Features

- Terminal interface for executing commands on a remote server.
- WebSocket communication for real-time interaction.
- Basic authentication for login.

## Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/your-username/Web-Terminal.git
    ```

2. Install dependencies:

    ```bash
    cd Web-Terminal
    npm install
    ```

3. Configure environment variables by creating a `.env` file (see `.env.example` for reference).

4. Start the server:

    ```bash
    npm start
    ```

5. Access the web terminal in your browser at `http://localhost:9001`.

## Configuration

The following environment variables can be configured in the `.env` file:

- `WEB_USERNAME`: Username for basic authentication (default: admin)
- `WEB_PASSWORD`: Password for basic authentication (default: admin)
- `SSH_HOST`: Hostname or IP address of the SSH server (default: 127.0.0.1)
- `SSH_PORT`: Port number of the SSH server (default: 22)
- `SSH_USERNAME`: Username for SSH authentication (default: root)
- `SSH_PASSWORD`: Password for SSH authentication (default: password)

## Usage

1. Visit the login page (`/login`) and enter your credentials.
2. Once logged in, you can execute commands in the terminal interface.

## License

This project is licensed under the [GNU General Public License v3.0](LICENSE).
