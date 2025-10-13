# Chat Features Documentation

## Greeting Detection

The chat interface now includes intelligent greeting detection that provides immediate, friendly responses to user greetings without requiring API calls.

### Supported Greetings

The system recognizes the following greetings (case-insensitive):
- `hai` - Indonesian greeting
- `halo` - Indonesian greeting
- `hello` - English greeting
- `hi` - English greeting
- `hei` - Informal greeting
- `selamat pagi` - Good morning (Indonesian)
- `selamat siang` - Good afternoon (Indonesian)
- `selamat malam` - Good evening/night (Indonesian)

### How It Works

1. When a user sends a message, the system first checks if it's a simple greeting
2. If detected, it responds immediately with a welcoming message and menu of available legal topics
3. If not a greeting, the message is sent to the AI backend for legal consultation

### Example Response

When a user types "hai", they receive:

```
Hai! Selamat datang kembali di Pasalku.ai 👋

Saya siap membantu Anda dengan pertanyaan hukum Indonesia. Silakan tanyakan apa yang ingin Anda ketahui tentang:

• Peraturan perundang-undangan
• Kontrak dan perjanjian
• Hak dan kewajiban hukum
• Prosedur hukum
• Dan topik hukum lainnya

Apa yang bisa saya bantu hari ini?
```

### Benefits

- **Faster Response**: No API latency for simple greetings
- **Better UX**: Immediate feedback creates a more responsive feel
- **Cost Efficient**: Reduces unnecessary AI API calls
- **Culturally Appropriate**: Supports both Indonesian and English greetings

### Implementation Details

Location: `app/chat/page.tsx` in the `handleSendMessage` function

The greeting detection uses a simple pattern matching approach that checks if the message:
- Exactly matches a greeting
- Starts with a greeting followed by a space
- Starts with a greeting followed by a comma

This ensures flexible matching while avoiding false positives.
