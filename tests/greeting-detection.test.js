/**
 * Greeting Detection Test Cases
 * 
 * This file documents test cases for the greeting detection feature
 * in the chat interface (app/chat/page.tsx)
 */

// Test Case 1: Exact greeting match
// Input: "hai"
// Expected: Immediate greeting response (no API call)
// Status: ✅ Should pass

// Test Case 2: Greeting with space
// Input: "hai saya butuh bantuan"
// Expected: Immediate greeting response (no API call)
// Status: ✅ Should pass

// Test Case 3: Greeting with comma
// Input: "hai, saya ada pertanyaan"
// Expected: Immediate greeting response (no API call)
// Status: ✅ Should pass

// Test Case 4: Case insensitive
// Input: "HAI"
// Expected: Immediate greeting response (no API call)
// Status: ✅ Should pass

// Test Case 5: Indonesian greeting
// Input: "selamat pagi"
// Expected: Immediate greeting response (no API call)
// Status: ✅ Should pass

// Test Case 6: English greeting
// Input: "hello"
// Expected: Immediate greeting response (no API call)
// Status: ✅ Should pass

// Test Case 7: Not a greeting
// Input: "Apa itu UU ITE?"
// Expected: Sent to AI backend for processing
// Status: ✅ Should pass

// Test Case 8: Greeting in middle of sentence (should NOT trigger)
// Input: "Apa yang disebut dengan hai"
// Expected: Sent to AI backend for processing
// Status: ✅ Should pass

// Expected Greeting Response Format:
const expectedResponse = {
  type: 'bot',
  content: `Hai! Selamat datang kembali di Pasalku.ai 👋

Saya siap membantu Anda dengan pertanyaan hukum Indonesia. Silakan tanyakan apa yang ingin Anda ketahui tentang:

• Peraturan perundang-undangan
• Kontrak dan perjanjian
• Hak dan kewajiban hukum
• Prosedur hukum
• Dan topik hukum lainnya

Apa yang bisa saya bantu hari ini?`
};

// Supported Greetings Array (from implementation):
const supportedGreetings = [
  'hai',
  'halo', 
  'hello',
  'hi',
  'hei',
  'selamat pagi',
  'selamat siang',
  'selamat malam'
];

/**
 * Test the greeting detection logic
 * @param {string} message - The message to test
 * @returns {boolean} - Whether the message should trigger greeting response
 */
function shouldTriggerGreeting(message) {
  const messageText = message.toLowerCase().trim();
  const greetings = supportedGreetings;
  
  return greetings.some(greeting => 
    messageText === greeting || 
    messageText.startsWith(greeting + ' ') || 
    messageText.startsWith(greeting + ',')
  );
}

// Test Cases Validation
console.log('Test Results:');
console.log('Test 1 (hai):', shouldTriggerGreeting('hai')); // true
console.log('Test 2 (hai saya):', shouldTriggerGreeting('hai saya butuh bantuan')); // true
console.log('Test 3 (hai,):', shouldTriggerGreeting('hai, saya ada pertanyaan')); // true
console.log('Test 4 (HAI):', shouldTriggerGreeting('HAI')); // true
console.log('Test 5 (selamat pagi):', shouldTriggerGreeting('selamat pagi')); // true
console.log('Test 6 (hello):', shouldTriggerGreeting('hello')); // true
console.log('Test 7 (legal question):', shouldTriggerGreeting('Apa itu UU ITE?')); // false
console.log('Test 8 (hai in middle):', shouldTriggerGreeting('Apa yang disebut dengan hai')); // false

module.exports = { shouldTriggerGreeting, supportedGreetings };
