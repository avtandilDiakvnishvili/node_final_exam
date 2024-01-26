document.getElementById('registerForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const name = document.getElementById('name').value;
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, username, password })
        });
        const data = await response.json();
        console.log(data);
        // Handle registration success (redirect to login page or display a message)
    } catch (error) {
        console.error('Registration failed:', error);
        // Handle registration failure (display error message)
    }
});