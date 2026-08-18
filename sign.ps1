$cert = Get-ChildItem Cert:\CurrentUser\My -CodeSigningCert | Select-Object -First 1
if (-not $cert) {
    $cert = New-SelfSignedCertificate -Type CodeSigningCert -Subject "CN=NexCloneDev" -CertStoreLocation "Cert:\CurrentUser\My"
}
$targetDir = Join-Path $PSScriptRoot "NexClone.Backend\bin\Debug\net10.0"
if (Test-Path (Join-Path $targetDir "NexClone.Backend.dll")) {
    Set-AuthenticodeSignature -Certificate $cert -FilePath (Join-Path $targetDir "NexClone.Backend.dll") -HashAlgorithm SHA256
}
if (Test-Path (Join-Path $targetDir "NexClone.Backend.exe")) {
    Set-AuthenticodeSignature -Certificate $cert -FilePath (Join-Path $targetDir "NexClone.Backend.exe") -HashAlgorithm SHA256
}

