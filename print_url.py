import requests
s = requests.Session()
login_res = s.post('http://localhost:8080/api/auth/login', json={'Email': 'test_stt@test.com', 'Password': 'Password123!'})
upload_url_res = s.post('http://localhost:8080/api/Media/upload-url', json={'FileName': 'speech.mp3', 'ContentType': 'audio/mpeg', 'ToolName': 'voice-to-text'})
print(upload_url_res.json()['url'])
