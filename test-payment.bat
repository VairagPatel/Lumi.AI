@echo off
echo === Payment Service Test ===
echo.

echo Testing payment status...
curl -X GET http://localhost:8080/api/v1/payment/status
echo.
echo.

echo Testing payment order creation...
curl -X POST http://localhost:8080/api/v1/payment/create-order -H "Content-Type: application/json" -d "{\"amount\":100,\"creditsAmount\":1000}"
echo.
echo.

echo === Test Complete ===