async function test() {
  try {
    const login = await fetch('http://localhost:5001/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'demo@investa.com', password: 'demo1234' })
    });
    const loginData = await login.json();
    const token = loginData.token;

    const res = await fetch('http://localhost:5001/api/chatbot/query', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({
        message: 'Hello',
        history: [{role: 'bot', text: 'Hi...'}],
        conversationId: null
      })
    });
    const data = await res.json();
    console.log(data);
  } catch (err) {
    console.error(err);
  }
}
test();
