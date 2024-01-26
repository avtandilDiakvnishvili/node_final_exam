const socket = io();

// Handle login form submission
document.getElementById('loginForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });
        const data = await response.json();
        console.log(data);

        // Check if login was successful
        if (response.ok) {
            // Redirect to chat page or display success message
            socket.emit('add user', data._id, username);

            window.location.href = '/chat.html';
        } else {
            alert(data.error);
        }
    } catch (error) {
        console.error('Login failed:', error);
        // Handle login failure (display error message)
    }
});



socket.on('disconnect', () => {
    console.log('Disconnected from Socket.IO server');
});

socket.on('chat message', (data) => {
    console.log('Received message:', data);
    // Handle incoming messages (e.g., display them in chat window)
});