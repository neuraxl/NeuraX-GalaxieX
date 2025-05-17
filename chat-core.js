// chat-core.js

const chatWindow = document.getElementById('chatWindow');
const chatLog = document.getElementById('chatLog');
const userInput = document.getElementById('userInput');

const OPENAI_API_KEY = 'ta_clef_api_ici'; // Remplace par ta clé OpenAI

function toggleChat() {
  if (chatWindow.style.display === 'flex') {
    chatWindow.style.display = 'none';
  } else {
    chatWindow.style.display = 'flex';
    userInput.focus();
  }
}

async function sendMessage() {
  const message = userInput.value.trim();
  if (!message) return;
  
  appendLog('👤 Toi : ' + message);
  userInput.value = '';
  
  // Envoi à OpenAI GPT-4
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages: [{ role: 'user', content: message }],
      max_tokens: 500,
      temperature: 0.7
    })
  });

  const data = await response.json();
  if (data.error) {
    appendLog('⚠️ Erreur API : ' + data.error.message);
    speakText("Désolé, une erreur s'est produite dans le cerveau cosmique.");
    return;
  }

  const reply = data.choices[0].message.content.trim();
  appendLog('🤖 NeuraX : ' + reply);
  speakText(reply);
}

function appendLog(text) {
  chatLog.value += text + '\n\n';
  chatLog.scrollTop = chatLog.scrollHeight;
}

function speakText(text) {
  if (!('speechSynthesis' in window)) return;
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'fr-FR';
  utterance.rate = 1;
  utterance.pitch = 1.1;
  utterance.volume = 1;
  speechSynthesis.speak(utterance);
}

window.toggleChat = toggleChat;
window.sendMessage = sendMessage;
