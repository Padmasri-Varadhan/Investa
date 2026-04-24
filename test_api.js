
const axios = require('axios');

async function testRegister() {
    try {
        const response = await axios.post('http://localhost:5000/api/register', {
            name: 'Test User ' + Date.now(),
            email: 'test' + Date.now() + '@gmail.com',
            password: 'password123',
            preferredLanguage: 'English'
        });
        console.log('Registration successful:', response.data);
    } catch (error) {
        console.error('Registration failed:', error.response ? error.response.data : error.message);
    }
}

testRegister();
