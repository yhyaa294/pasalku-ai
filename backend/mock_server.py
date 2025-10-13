"""
Simple HTTP mock server for frontend development.
Provides:
 - GET /health -> 200
 - POST /login -> accepts JSON {email,password} and returns mock token
 - POST /logout -> 200

Run with: python backend/mock_server.py
"""
from http.server import BaseHTTPRequestHandler, HTTPServer
import json
from urllib.parse import urlparse, parse_qs

PORT = 8000

class MockHandler(BaseHTTPRequestHandler):
    def _set_cors_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')

    def do_OPTIONS(self):
        self.send_response(204)
        self._set_cors_headers()
        self.end_headers()

    def _set_headers(self, code=200, content_type='application/json'):
        self.send_response(code)
        self.send_header('Content-type', content_type)
        self._set_cors_headers()
        self.end_headers()

    def do_GET(self):
        path = urlparse(self.path).path
        if path == '/health':
            self._set_headers(200)
            self.wfile.write(json.dumps({'status': 'ok'}).encode())
            return
        # default 404
        self._set_headers(404)
        self.wfile.write(json.dumps({'error': 'not found'}).encode())

    def do_POST(self):
        path = urlparse(self.path).path
        length = int(self.headers.get('content-length', 0))
        body = self.rfile.read(length) if length else b''

        # Handle /api/auth/login from frontend
        if path == '/api/auth/login':
            # Frontend sends x-www-form-urlencoded
            if 'application/x-www-form-urlencoded' in self.headers.get('content-type', ''):
                data = parse_qs(body.decode())
                email = data.get('username', [None])[0]
                password = data.get('password', [None])[0]
            else: # Fallback for JSON
                try:
                    data = json.loads(body.decode() or '{}')
                    email = data.get('email')
                    password = data.get('password')
                except Exception:
                    email, password = None, None

            if email and password:
                self._set_headers(200)
                # Match the response structure expected by the frontend
                resp = {
                    'access_token': 'mock-jwt-token-for-user-12345',
                    'token_type': 'bearer',
                    'user': {
                        'email': email,
                        'role': 'user',
                        'id': 'mock-user-id'
                    }
                }
                self.wfile.write(json.dumps(resp).encode())
                return
            else:
                self._set_headers(400)
                self.wfile.write(json.dumps({'detail': 'Invalid credentials provided'}).encode())
                return

        if path == '/logout':
            self._set_headers(200)
            self.wfile.write(json.dumps({'status': 'ok'}).encode())
            return

        # default 404
        self._set_headers(404)
        self.wfile.write(json.dumps({'error': 'not found'}).encode())

if __name__ == '__main__':
    server = HTTPServer(('0.0.0.0', PORT), MockHandler)
    print(f"Mock server running at http://0.0.0.0:{PORT}")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print('\nStopping mock server')
        server.server_close()
