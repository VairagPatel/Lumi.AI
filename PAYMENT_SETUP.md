# Payment Service Setup Guide

## Overview
LumiAI uses Razorpay for payment processing. This guide will help you set up the payment service correctly.

## Prerequisites
- A Razorpay account (Sign up at https://dashboard.razorpay.com/)
- Access to your Razorpay API credentials

## Step 1: Get Razorpay Credentials

### For Test Mode (Development)
1. Go to https://dashboard.razorpay.com/
2. Sign in or create a new account
3. Navigate to **Settings** → **API Keys**
4. Click on **Generate Test Key** (if not already generated)
5. You'll see two values:
   - **Key ID** (starts with `rzp_test_`)
   - **Key Secret** (click "Show" to reveal)

### For Live Mode (Production)
1. Complete KYC verification on Razorpay
2. Navigate to **Settings** → **API Keys**
3. Switch to **Live Mode**
4. Generate Live API Keys
5. You'll get:
   - **Key ID** (starts with `rzp_live_`)
   - **Key Secret**

## Step 2: Configure Environment Variables

### Update `.env` file
Replace the placeholder values in your `.env` file:

```env
# Razorpay Configuration
RAZORPAY_KEY_ID=rzp_test_YOUR_ACTUAL_KEY_ID_HERE
RAZORPAY_KEY_SECRET=YOUR_ACTUAL_SECRET_HERE
```

**Example:**
```env
RAZORPAY_KEY_ID=rzp_test_1234567890abcd
RAZORPAY_KEY_SECRET=abcdefghijklmnopqrstuvwxyz123456
```

### Update `API/.env` file (if exists)
Make sure the same credentials are in `API/.env`:

```env
RAZORPAY_KEY_ID=rzp_test_YOUR_ACTUAL_KEY_ID_HERE
RAZORPAY_KEY_SECRET=YOUR_ACTUAL_SECRET_HERE
```

## Step 3: Restart Services

After updating the credentials, restart your Docker containers:

```bash
# Stop all containers
docker-compose down

# Rebuild and start
docker-compose up -d --build
```

Or restart just the backend:

```bash
docker-compose restart backend
```

## Step 4: Test Payment Service

### Method 1: Using the API Endpoint
```bash
curl http://localhost:8080/api/v1/payment/test-credentials
```

Expected response for success:
```json
{
  "success": true,
  "message": "Credentials test result",
  "data": "SUCCESS: Razorpay credentials are configured correctly. Key ID: rzp_test_..."
}
```

### Method 2: Using the Frontend
1. Open http://localhost:3000/pricing
2. The page should show "Payment service is available"
3. If not configured, you'll see an error message

## Step 5: Test a Payment (Test Mode)

### Razorpay Test Cards
When using test mode, use these test card details:

**Successful Payment:**
- Card Number: `4111 1111 1111 1111`
- CVV: Any 3 digits (e.g., `123`)
- Expiry: Any future date (e.g., `12/25`)
- Name: Any name

**Failed Payment:**
- Card Number: `4000 0000 0000 0002`
- CVV: Any 3 digits
- Expiry: Any future date

### Test Payment Flow
1. Go to http://localhost:3000/pricing
2. Click "Buy Now" on any plan
3. Complete the Razorpay checkout
4. Use test card details above
5. After successful payment, credits should be added to your account

## Troubleshooting

### Error: "Payment service is not configured"
**Solution:** Check that your `.env` file has valid Razorpay credentials and restart the backend.

### Error: "Invalid Razorpay Key ID format"
**Solution:** Ensure your Key ID starts with `rzp_test_` (test mode) or `rzp_live_` (live mode).

### Error: "Payment verification failed"
**Solution:** 
- Check that both Key ID and Key Secret are correct
- Ensure there are no extra spaces in the credentials
- Verify the credentials are from the same Razorpay account

### Credits not updating after payment
**Solution:**
1. Check backend logs: `docker logs lumiai-backend --tail 50`
2. Look for payment verification logs
3. Ensure the payment status is "SUCCESS" in the database
4. Refresh the page or logout/login again

### Payment modal not opening
**Solution:**
1. Check browser console for errors
2. Ensure Razorpay script is loaded (check Network tab)
3. Verify GOOGLE_CLIENT_ID is set in `.env`

## Security Best Practices

### For Production:
1. **Never commit credentials to Git**
   - Add `.env` to `.gitignore`
   - Use environment variables in production

2. **Use Live Mode credentials only in production**
   - Keep test credentials for development
   - Never mix test and live credentials

3. **Enable Webhook Signature Verification**
   - Set up webhooks in Razorpay dashboard
   - Verify webhook signatures in your backend

4. **Implement Rate Limiting**
   - Limit payment creation requests
   - Add CAPTCHA for suspicious activity

5. **Monitor Transactions**
   - Set up alerts in Razorpay dashboard
   - Monitor failed payments
   - Track refunds and disputes

## Additional Resources

- [Razorpay Documentation](https://razorpay.com/docs/)
- [Razorpay Test Cards](https://razorpay.com/docs/payments/payments/test-card-details/)
- [Razorpay API Reference](https://razorpay.com/docs/api/)
- [Razorpay Dashboard](https://dashboard.razorpay.com/)

## Support

If you encounter issues:
1. Check the backend logs: `docker logs lumiai-backend`
2. Test credentials: `curl http://localhost:8080/api/v1/payment/test-credentials`
3. Verify environment variables are loaded: Check backend startup logs
4. Contact Razorpay support if payment gateway issues persist

## Credit System

### How Credits Work
- New users get **15 free credits** upon signup
- Each image generation costs **1 credit**
- Credits are deducted immediately after successful generation
- Credits are added immediately after successful payment

### Credit Packages
- Starter: 50 credits for ₹99
- Popular: 150 credits for ₹249
- Pro: 500 credits for ₹699

### Credit Syncing
Credits are automatically synced:
- After each image generation
- After successful payment
- When loading the profile page
- When loading the create page

If credits don't update:
1. Refresh the page
2. Logout and login again
3. Check backend logs for errors
