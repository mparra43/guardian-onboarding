# Script de prueba del Microservicio de Onboarding

Write-Host "🧪 Probando el microservicio de Onboarding..." -ForegroundColor Cyan
Write-Host ""

# 1. Probar Health Check
Write-Host "1️⃣ Probando GET /onboarding/health" -ForegroundColor Yellow
$healthResponse = Invoke-RestMethod -Uri "http://localhost:3002/onboarding/health" -Method GET
Write-Host "✅ Health check: " -NoNewline
Write-Host ($healthResponse | ConvertTo-Json) -ForegroundColor Green
Write-Host ""

# 2. Obtener token del servicio de auth
Write-Host "2️⃣ Obteniendo token JWT del servicio de autenticación" -ForegroundColor Yellow
try {
    $loginBody = @{
        email = "user@example.com"
        password = "password123"
    } | ConvertTo-Json

    $loginResponse = Invoke-RestMethod -Uri "http://localhost:3001/auth/login" -Method POST -Body $loginBody -ContentType "application/json"
    $token = $loginResponse.access_token
    Write-Host "✅ Token obtenido: $($token.Substring(0, 30))..." -ForegroundColor Green
    Write-Host ""

    # 3. Probar POST /onboarding con token
    Write-Host "3️⃣ Probando POST /onboarding (con autenticación)" -ForegroundColor Yellow
    $headers = @{
        Authorization = "Bearer $token"
    }
    $onboardingBody = @{
        nombre = "Juan Pérez"
        documento = "12345678"
        email = "juan.perez@example.com"
        montoInicial = 1000
    } | ConvertTo-Json

    $onboardingResponse = Invoke-RestMethod -Uri "http://localhost:3002/onboarding" -Method POST -Body $onboardingBody -ContentType "application/json" -Headers $headers
    Write-Host "✅ Onboarding creado: " -NoNewline
    Write-Host ($onboardingResponse | ConvertTo-Json) -ForegroundColor Green
    Write-Host ""

    # 4. Probar POST /onboarding sin token (debe fallar)
    Write-Host "4️⃣ Probando POST /onboarding (sin autenticación - debe fallar)" -ForegroundColor Yellow
    try {
        $failResponse = Invoke-RestMethod -Uri "http://localhost:3002/onboarding" -Method POST -Body $onboardingBody -ContentType "application/json"
        Write-Host "❌ ERROR: Debería haber fallado sin token" -ForegroundColor Red
    } catch {
        Write-Host "✅ Correctamente rechazado (401 Unauthorized)" -ForegroundColor Green
    }
    Write-Host ""

    # 5. Probar con Content-Type incorrecto
    Write-Host "5️⃣ Probando POST /onboarding (Content-Type incorrecto - debe fallar)" -ForegroundColor Yellow
    try {
        $failResponse = Invoke-RestMethod -Uri "http://localhost:3002/onboarding" -Method POST -Body $onboardingBody -ContentType "text/plain" -Headers $headers
        Write-Host "❌ ERROR: Debería haber fallado con Content-Type incorrecto" -ForegroundColor Red
    } catch {
        Write-Host "✅ Correctamente rechazado (400 Bad Request)" -ForegroundColor Green
    }
    Write-Host ""

    Write-Host "✨ ¡Todas las pruebas completadas!" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "📚 Accede a la documentación Swagger en: http://localhost:3002/api/docs" -ForegroundColor Magenta

} catch {
    Write-Host "❌ Error: No se pudo conectar al servicio de autenticación en http://localhost:3001" -ForegroundColor Red
    Write-Host "   Asegúrate de que el servicio de auth esté ejecutándose." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "   Puedes probar el health check:" -ForegroundColor Yellow
    Write-Host "   curl http://localhost:3002/onboarding/health" -ForegroundColor Gray
}
