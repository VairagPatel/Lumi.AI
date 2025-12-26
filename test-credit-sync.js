// Test script to verify credit synchronization
const axios = require('axios');

const API_BASE_URL = 'http://localhost:8080/api/v1';

async function testCreditSync() {
    try {
        console.log('🧪 Testing Credit Synchronization...\n');

        // Test 1: Check health endpoint
        console.log('1. Checking API health...');
        const healthResponse = await axios.get(`${API_BASE_URL}/health`);
        console.log('✅ API is healthy:', healthResponse.data);

        // Test 2: Login (you'll need to replace with actual credentials)
        console.log('\n2. Testing login...');
        const loginData = {
            email: 'test@example.com', // Replace with actual test user
            password: 'password123'     // Replace with actual password
        };

        let token;
        try {
            const loginResponse = await axios.post(`${API_BASE_URL}/auth/login`, loginData);
            token = loginResponse.data.data.accessToken;
            console.log('✅ Login successful');
        } catch (error) {
            console.log('⚠️  Login failed, testing as guest user');
        }

        // Test 3: Check credits before generation
        if (token) {
            console.log('\n3. Checking credits before generation...');
            const creditsResponse = await axios.get(`${API_BASE_URL}/auth/credits`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log('💰 Credits before:', creditsResponse.data.data);
        }

        // Test 4: Generate text-to-image
        console.log('\n4. Testing text-to-image generation...');
        const generationData = {
            prompt: 'A magical forest with floating lanterns',
            style: 'anime'
        };

        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        
        try {
            const generationResponse = await axios.post(
                `${API_BASE_URL}/generation/text-to-image`, 
                generationData,
                { 
                    headers,
                    responseType: 'blob',
                    timeout: 60000 // 60 seconds timeout
                }
            );
            console.log('✅ Image generation successful');
            console.log('📊 Response size:', generationResponse.data.size, 'bytes');
        } catch (error) {
            console.log('❌ Image generation failed:', error.response?.data || error.message);
        }

        // Test 5: Check credits after generation
        if (token) {
            console.log('\n5. Checking credits after generation...');
            // Wait a moment for the database to update
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            const creditsAfterResponse = await axios.get(`${API_BASE_URL}/auth/credits`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log('💰 Credits after:', creditsAfterResponse.data.data);
        }

        console.log('\n✅ Credit sync test completed!');

    } catch (error) {
        console.error('❌ Test failed:', error.response?.data || error.message);
    }
}

// Run the test
testCreditSync();