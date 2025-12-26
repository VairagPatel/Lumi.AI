// Simple test script to verify payment order creation works
const axios = require('axios');

async function testPaymentOrder() {
    try {
        console.log('Testing payment order creation...');
        
        // Test without authentication first (since we made it public)
        const response = await axios.post('http://localhost:8080/api/v1/payment/create-order', {
            amount: 100,
            creditsAmount: 1000
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        console.log('✅ Payment order creation successful!');
        console.log('Response:', JSON.stringify(response.data, null, 2));
        
        // Check if it's a mock order
        if (response.data.data && response.data.data.orderId && response.data.data.orderId.startsWith('mock_order_')) {
            console.log('✅ Mock payment mode is working correctly!');
        }
        
    } catch (error) {
        console.log('❌ Payment order creation failed:');
        if (error.response) {
            console.log('Status:', error.response.status);
            console.log('Data:', JSON.stringify(error.response.data, null, 2));
        } else {
            console.log('Error:', error.message);
        }
    }
}

// Test payment status endpoint
async function testPaymentStatus() {
    try {
        console.log('\nTesting payment status...');
        
        const response = await axios.get('http://localhost:8080/api/v1/payment/status');
        
        console.log('✅ Payment status check successful!');
        console.log('Response:', JSON.stringify(response.data, null, 2));
        
    } catch (error) {
        console.log('❌ Payment status check failed:');
        if (error.response) {
            console.log('Status:', error.response.status);
            console.log('Data:', JSON.stringify(error.response.data, null, 2));
        } else {
            console.log('Error:', error.message);
        }
    }
}

// Run tests
async function runTests() {
    console.log('=== Payment Service Test ===\n');
    
    await testPaymentStatus();
    await testPaymentOrder();
    
    console.log('\n=== Test Complete ===');
}

runTests();