const axios = require('axios');

async function testAuth() {
    const baseURL = 'http://localhost:5001/api';
    const testUser = {
        name: 'Test Persistence',
        email: 'persist' + Date.now() + '@test.com',
        password: 'Password123!',
        preferredLanguage: 'English',
        riskProfile: 'Moderate'
    };

    console.log('--- Testing Registration ---');
    try {
        const regRes = await axios.post(`${baseURL}/register`, testUser);
        console.log('Registration Success:', regRes.data.email);
        
        console.log('\n--- Testing Login ---');
        const loginRes = await axios.post(`${baseURL}/login`, {
            email: testUser.email,
            password: testUser.password
        });
        console.log('Login Success:', loginRes.data.email);
        
        console.log('\n--- Testing Profile Fetch ---');
        const profileRes = await axios.get(`${baseURL}/profile`, {
            headers: { Authorization: `Bearer ${loginRes.data.token}` }
        });
        console.log('Profile Fetch Success:', profileRes.data.name);

    } catch (error) {
        console.error('Error:', error.response?.data || error.message);
    }
}

testAuth();
