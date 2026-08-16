const http = require('http');

const postData = JSON.stringify({
    ToolName: 'text-to-video',
    IsActive: true,
    MaxConcurrentOperations: 10
});

const options = {
  hostname: '127.0.0.1',
  port: 8080,
  path: '/ToolConfigAdmin/SaveConfig',
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Content-Length': Buffer.byteLength('ToolName=text-to-video&IsActive=true')
  }
};

const req = http.request(options, (res) => {
  console.log(STATUS: );
  res.setEncoding('utf8');
  res.on('data', (chunk) => {
    // console.log(BODY: );
  });
  res.on('end', () => {
    console.log('No more data in response.');
  });
});

req.on('error', (e) => {
  console.error(problem with request: );
});

req.write('ToolName=text-to-video&IsActive=true');
req.end();
