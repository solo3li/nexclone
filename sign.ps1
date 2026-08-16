$cert = Get-ChildItem Cert:\CurrentUser\My -CodeSigningCert | Select-Object -First 1
if (-not $cert) {
    $cert = New-SelfSignedCertificate -Type CodeSigningCert -Subject "CN=NexCloneDev" -CertStoreLocation "Cert:\CurrentUser\My"
}
Set-AuthenticodeSignature -Certificate $cert -FilePath "NexClone.Backend\bin\Debug\net10.0\NexClone.Backend.dll"
Set-AuthenticodeSignature -Certificate $cert -FilePath "NexClone.Backend\bin\Debug\net10.0\NexClone.Backend.exe"
