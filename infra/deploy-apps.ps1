# =============================================================================
# Deploy GNO Applications to Azure
# =============================================================================
# Deploys Azure Functions, Container App (API), and Static Web App (frontend)
# Run after: setup.ps1 and setup-agent.py
# =============================================================================

param(
    [string]$ResourceGroup = "rg-gno-dev",
    [string]$Location = "eastus"
)

$ErrorActionPreference = "Stop"

# Load .env file
$envPath = Join-Path $PSScriptRoot ".env"
if (Test-Path $envPath) {
    Get-Content $envPath | ForEach-Object {
        if ($_ -match "^([^#][^=]+)=(.*)$") {
            [Environment]::SetEnvironmentVariable($matches[1], $matches[2])
        }
    }
}

$FoundryName = $env:AZURE_FOUNDRY_NAME
$ProjectEndpoint = $env:PROJECT_ENDPOINT
$ModelDeployment = $env:MODEL_DEPLOYMENT_NAME
$AgentName = $env:AGENT_NAME

Write-Host "=============================================" -ForegroundColor Cyan
Write-Host "  Deploy GNO Applications" -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host ""

# -----------------------------------------------------------------------------
# Step 1: Create Storage Account (for Functions)
# -----------------------------------------------------------------------------
Write-Host "[1/5] Creating Storage Account for Functions" -ForegroundColor Yellow

$storageRandom = -join ((48..57) + (97..122) | Get-Random -Count 8 | ForEach-Object {[char]$_})
$storageName = "stgno$storageRandom"

az storage account create `
    --name $storageName `
    --resource-group $ResourceGroup `
    --location $Location `
    --sku Standard_LRS `
    --output none

Write-Host "  ✓ Storage account: $storageName" -ForegroundColor Green

# -----------------------------------------------------------------------------
# Step 2: Create Azure Functions App
# -----------------------------------------------------------------------------
Write-Host "[2/5] Creating Azure Functions App" -ForegroundColor Yellow

$funcAppName = "func-gno-tools-$storageRandom"

az functionapp create `
    --name $funcAppName `
    --resource-group $ResourceGroup `
    --consumption-plan-location $Location `
    --runtime node `
    --runtime-version 20 `
    --functions-version 4 `
    --storage-account $storageName `
    --output none

Write-Host "  ✓ Function App: $funcAppName" -ForegroundColor Green

# Get the Function App URL
$funcUrl = az functionapp show `
    --name $funcAppName `
    --resource-group $ResourceGroup `
    --query "defaultHostName" `
    --output tsv

Write-Host "  ✓ URL: https://$funcUrl" -ForegroundColor Green

# -----------------------------------------------------------------------------
# Step 3: Create Log Analytics Workspace (for Container Apps)
# -----------------------------------------------------------------------------
Write-Host "[3/5] Creating Log Analytics Workspace" -ForegroundColor Yellow

az monitor log-analytics workspace create `
    --resource-group $ResourceGroup `
    --workspace-name "log-gno" `
    --location $Location `
    --output none

$logId = az monitor log-analytics workspace show `
    --resource-group $ResourceGroup `
    --workspace-name "log-gno" `
    --query "customerId" `
    --output tsv

$logKey = az monitor log-analytics workspace get-shared-keys `
    --resource-group $ResourceGroup `
    --workspace-name "log-gno" `
    --query "primarySharedKey" `
    --output tsv

Write-Host "  ✓ Log Analytics workspace created" -ForegroundColor Green

# -----------------------------------------------------------------------------
# Step 4: Create Container Apps Environment & App
# -----------------------------------------------------------------------------
Write-Host "[4/5] Creating Container Apps Environment" -ForegroundColor Yellow

az containerapp env create `
    --name "cae-gno" `
    --resource-group $ResourceGroup `
    --location $Location `
    --logs-workspace-id $logId `
    --logs-workspace-key $logKey `
    --output none

Write-Host "  ✓ Container Apps environment created" -ForegroundColor Green

# Note: The actual container app deployment requires a container image
# This creates a placeholder that can be updated later
Write-Host "  ℹ Container App will be created when you push the API image" -ForegroundColor Gray

# -----------------------------------------------------------------------------
# Step 5: Create Static Web App
# -----------------------------------------------------------------------------
Write-Host "[5/5] Creating Static Web App" -ForegroundColor Yellow

$swaName = "swa-gno-$storageRandom"

az staticwebapp create `
    --name $swaName `
    --resource-group $ResourceGroup `
    --location "centralus" `
    --output none

$swaUrl = az staticwebapp show `
    --name $swaName `
    --resource-group $ResourceGroup `
    --query "defaultHostname" `
    --output tsv

Write-Host "  ✓ Static Web App: $swaName" -ForegroundColor Green
Write-Host "  ✓ URL: https://$swaUrl" -ForegroundColor Green

# -----------------------------------------------------------------------------
# Update .env with deployment info
# -----------------------------------------------------------------------------
Write-Host ""
Write-Host "Updating .env with deployment URLs..." -ForegroundColor Yellow

Add-Content -Path $envPath -Value "`n# Deployment URLs (generated by deploy-apps.ps1)"
Add-Content -Path $envPath -Value "AZURE_FUNCTIONS_URL=https://$funcUrl"
Add-Content -Path $envPath -Value "AZURE_FUNCTIONS_APP=$funcAppName"
Add-Content -Path $envPath -Value "AZURE_SWA_URL=https://$swaUrl"
Add-Content -Path $envPath -Value "AZURE_SWA_NAME=$swaName"
Add-Content -Path $envPath -Value "AZURE_STORAGE_ACCOUNT=$storageName"

# -----------------------------------------------------------------------------
# Summary
# -----------------------------------------------------------------------------
Write-Host ""
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host "  Deployment Complete!" -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Resources created:" -ForegroundColor White
Write-Host "  • Storage Account:  $storageName" -ForegroundColor Gray
Write-Host "  • Function App:     $funcAppName" -ForegroundColor Gray
Write-Host "  • Container Env:    cae-gno" -ForegroundColor Gray
Write-Host "  • Static Web App:   $swaName" -ForegroundColor Gray
Write-Host ""
Write-Host "URLs:" -ForegroundColor White
Write-Host "  • Functions: https://$funcUrl" -ForegroundColor Gray
Write-Host "  • Web App:   https://$swaUrl" -ForegroundColor Gray
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host ""
Write-Host "  1. Deploy Azure Functions:" -ForegroundColor White
Write-Host "     cd apps/tools" -ForegroundColor Gray
Write-Host "     func azure functionapp publish $funcAppName" -ForegroundColor Gray
Write-Host ""
Write-Host "  2. Build and deploy API container:" -ForegroundColor White
Write-Host "     cd apps/api" -ForegroundColor Gray
Write-Host "     # Build image and push to registry" -ForegroundColor Gray
Write-Host "     # Then create container app with image" -ForegroundColor Gray
Write-Host ""
Write-Host "  3. Deploy Static Web App:" -ForegroundColor White
Write-Host "     # Configure GitHub Actions or use SWA CLI" -ForegroundColor Gray
Write-Host "     cd apps/web && npm run build" -ForegroundColor Gray
Write-Host "     swa deploy ./dist --app-name $swaName" -ForegroundColor Gray
Write-Host ""
