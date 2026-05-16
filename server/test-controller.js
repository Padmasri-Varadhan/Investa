const mongoose = require('mongoose');
const { queryChatbot } = require('./controllers/chatbotController');

async function test() {
  await mongoose.connect('mongodb://127.0.0.1:27017/investa');
  
  const req = {
    user: { _id: new mongoose.Types.ObjectId() },
    body: {
      message: 'hello',
      history: [],
      conversationId: null
    }
  };

  const res = {
    status: function(code) {
      this.statusCode = code;
      return this;
    },
    json: function(data) {
      console.log('STATUS:', this.statusCode);
      console.log('RESPONSE:', JSON.stringify(data, null, 2));
    }
  };

  await queryChatbot(req, res);
  
  mongoose.disconnect();
}
test();
