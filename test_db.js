const URL = 'https://sygkebaaugyoxniuywet.supabase.co';
const KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN5Z2tlYmFhdWd5b3huaXV5d2V0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQwMTg3MjMsImV4cCI6MjA5OTU5NDcyM30.hDuck7LodeXbIPjFrnO1KuFbQgcQFAXX0y-V1-XbmMQ';

async function test() {
    const r = await fetch(URL + '/rest/v1/products', {
        headers: { 'apikey': KEY, 'Authorization': 'Bearer ' + KEY }
    });
    const d = await r.json();
    console.log('STATUS:', r.status);
    console.log('DATA:', JSON.stringify(d).substring(0, 400));
}
test().catch(e => console.log('ERR:', e.message));
