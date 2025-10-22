// Quick local test for /api/chat JSON POST
(async () => {
  try {
    const res = await fetch('http://localhost:5000/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'tolong bantu saya, saya di-bully online' })
    });
    const text = await res.text();
    console.log('Status:', res.status);
    console.log('Body:', text.slice(0, 500));
  } catch (err) {
    console.error('Test failed:', err);
    process.exit(1);
  }
})();
