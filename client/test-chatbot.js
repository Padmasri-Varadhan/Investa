const axios = require('axios');
async function test() {
  try {
    const login = await axios.post('http://localhost:5001/api/login', { email: 'test@example.com', password: 'password123' });
    const token = login.data.token;
    const res = await axios.post('http://localhost:5001/api/chatbot/query', { message: 'hello' }, { headers: { Authorization: `Bearer ${token}` }});
    console.log(res.data);
  } catch (err) {
    if (err.response) {
      console.error(err.response.data);
    } else {
      console.error(err.message);
    }
  }
}
test();
