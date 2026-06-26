import requests

s = requests.Session()

print("1. Logging in...")
login_res = s.post('http://localhost:8080/api/auth/login', json={
    'Email': 'test_stt@test.com',
    'Password': 'Password123!'
})

print("\n2. Getting upload URL...")
upload_url_res = s.post('http://localhost:8080/api/Media/upload-url', json={
    'FileName': 'speech.mp3',
    'ContentType': 'audio/mpeg',
    'ToolName': 'voice-to-text'
})

if upload_url_res.status_code == 200:
    data = upload_url_res.json()
    upload_url = data['url']
    file_id = data['objectName']
    
    print(f"\n3. Uploading file to {file_id}...")
    with open('speech.mp3', 'rb') as f:
        upload_res = requests.put(upload_url, data=f, headers={'Content-Type': 'audio/mpeg'})
    print(f"Upload Status: {upload_res.status_code}")

    print("\n4. Calling transcribe API (translate: false)...")
    transcribe_res = s.post('http://localhost:8080/api/ai/voice-to-text/transcribe', json={
        'fileId': file_id,
        'translate': False,
        'targetLanguage': 'en'
    })
    print(transcribe_res.json())

    print("\n5. Calling transcribe API (translate: true, targetLanguage: ar)...")
    transcribe_res2 = s.post('http://localhost:8080/api/ai/voice-to-text/transcribe', json={
        'fileId': file_id,
        'translate': True,
        'targetLanguage': 'ar'
    })
    print(transcribe_res2.json())
