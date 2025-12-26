# Credit Synchronization Fix

## Problem
Credits were not decreasing in the text-to-image section after generating images when running the project via Docker.

## Root Cause Analysis

The issue was caused by two main problems:

1. **Backend Timing Issue**: Credits were being deducted **after** the image generation completed, which could cause race conditions or failures if the generation succeeded but credit deduction failed.

2. **Frontend Refresh Mechanism**: The frontend was using a delayed timeout (1500ms) to refresh credits, which was unreliable and could miss updates if the timing was off.

## Changes Made

### Backend Changes (API/src/main/java/in/LumiAI/api/service/GhibliArtService.java)

#### 1. Text-to-Image Method (`createGhibliArtFromText`)
- **Before**: Credits were deducted after successful generation
- **After**: Credits are now deducted **immediately before** generation starts
- **Added**: Credit refund mechanism if generation fails after deduction
- **Benefit**: Ensures credits are always synchronized and users don't lose credits on failed generations

```java
// Credits are now deducted BEFORE generation
creditService.deductCredits(user, creditsPerGeneration);
log.info("Credits deducted for user: {}. Proceeding with text-to-image generation.", user.getEmail());

// If generation fails, credits are refunded
try {
    creditService.addCredits(user, creditsPerGeneration);
    log.info("Credits refunded to user: {} due to generation failure", user.getEmail());
} catch (Exception refundError) {
    log.error("Failed to refund credits to user: {}", user.getEmail(), refundError);
}
```

#### 2. Image-to-Image Method (`createGhibliArt`)
- Applied the same fix as text-to-image
- Credits deducted before generation
- Automatic refund on failure

### Frontend Changes

#### 1. Generation Hooks (Frontend/src/hooks/useGeneration.js)
- **Added**: Automatic credit invalidation in `useTextToImage` hook
- **Added**: Automatic credit invalidation in `useImageToImage` hook
- **Benefit**: Credits are refreshed immediately after generation completes (success or failure)

```javascript
export const useTextToImage = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: generationAPI.textToImage,
    onSuccess: () => {
      toast.success('Image generated successfully!');
      // Immediately invalidate and refetch credits
      queryClient.invalidateQueries(['user-credits']);
      queryClient.invalidateQueries(['auth']);
    },
    onError: async (error) => {
      // ... error handling ...
      // Also refresh credits on error
      queryClient.invalidateQueries(['user-credits']);
    },
  });
};
```

#### 2. CreatePage Component (Frontend/src/pages/CreatePage.jsx)
- **Removed**: Complex delayed credit refresh logic
- **Simplified**: Credit refresh is now handled automatically by the hooks
- **Benefit**: Cleaner code, more reliable credit updates

```javascript
const handleGeneration = async () => {
  if (!user) {
    setGuestGenerations((prev) => prev + 1);
  }
  // Credit refresh is now handled automatically in the useGeneration hooks
};
```

#### 3. TextToImageSection Component (Frontend/src/components/TextToImageSection.jsx)
- **Removed**: Direct fetch fallback that bypassed authentication
- **Benefit**: All requests now go through proper authentication flow

## How It Works Now

### Flow for Text-to-Image Generation:

1. **User clicks "Generate"** → Frontend sends request with auth token
2. **Backend receives request** → Validates user authentication
3. **Check credits** → Verifies user has enough credits
4. **Deduct credits immediately** → Credits are deducted from database
5. **Generate image** → AI service generates the image
6. **If success** → Return image to frontend
7. **If failure** → Refund credits automatically
8. **Frontend receives response** → Automatically invalidates credit cache
9. **Credits refresh** → UI updates with new credit balance

### Benefits:

✅ **Immediate Credit Deduction**: Credits are deducted before generation, preventing race conditions
✅ **Automatic Refunds**: If generation fails, credits are automatically refunded
✅ **Instant UI Updates**: Frontend automatically refreshes credits after each generation
✅ **Better Error Handling**: Credits are refreshed even on errors
✅ **Cleaner Code**: Removed complex timeout-based refresh logic
✅ **More Reliable**: Works consistently in Docker and local environments

## Testing

### Manual Testing Steps:

1. **Start the application**:
   ```bash
   docker-compose up -d
   ```

2. **Login to the application** with a test user

3. **Check initial credits** in the UI

4. **Generate a text-to-image**:
   - Go to Create page
   - Select "Text to Art" tab
   - Enter a prompt
   - Click "Generate with LumiAI"

5. **Verify credits decreased** immediately after generation

6. **Test multiple generations** to ensure credits continue to decrease

### Automated Testing:

Run the test script:
```bash
node test-credit-sync.js
```

This will:
- Check API health
- Login with test credentials
- Check credits before generation
- Generate an image
- Check credits after generation
- Verify the credit was deducted

## Configuration

No configuration changes are required. The fix works with existing settings:

- `credits.per-generation: 1` (in application.yml)
- `credits.default-amount: 15` (in application.yml)

## Docker Considerations

The fix works seamlessly in Docker because:

1. **Database transactions** are properly handled by Spring's `@Transactional` annotation
2. **Redis cache** is properly invalidated on both frontend and backend
3. **Network timing** doesn't affect credit deduction since it happens before generation
4. **Container communication** is reliable through the Docker network

## Rollback Plan

If issues occur, you can rollback by:

1. Reverting the backend changes in `GhibliArtService.java`
2. Reverting the frontend changes in `useGeneration.js`
3. Restoring the original `CreatePage.jsx` with delayed refresh

However, the new implementation is more robust and should not require rollback.

## Additional Notes

- The fix also applies to **image-to-image** generation
- **Guest users** are not affected (they don't use credits)
- **Credit history** is properly maintained in the database
- **Generation history** is saved regardless of success/failure
- **Logging** has been enhanced for better debugging

## Support

If you encounter any issues:

1. Check backend logs: `docker logs lumiai-backend`
2. Check frontend console for errors
3. Verify database connection: `docker exec -it lumiai-mysql mysql -u root -p`
4. Check Redis connection: `docker exec -it lumiai-redis redis-cli`

## Conclusion

The credit synchronization issue has been fixed by:
- Moving credit deduction to happen **before** generation
- Adding automatic credit refunds on failure
- Implementing automatic frontend cache invalidation
- Simplifying the credit refresh mechanism

This ensures credits are always properly synchronized between the backend database and frontend UI, regardless of whether the application is running locally or in Docker.
