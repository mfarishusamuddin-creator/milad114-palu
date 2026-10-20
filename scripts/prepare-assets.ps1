Add-Type -AssemblyName System.Drawing

$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $PSScriptRoot
$srcRoot = "C:\devel\Muhammadiyah milad 114\drive-download-20261019T110338Z-1-001"
$logoDir = Join-Path $srcRoot "IDENTITAS-LOGO TANWIR DAN MILAD KE-114 MUHAMMADIYAH\LOGO\PNG"
$fontDir = Join-Path $srcRoot "IDENTITAS-LOGO TANWIR DAN MILAD KE-114 MUHAMMADIYAH\FONT"
$patternSrc = Join-Path $srcRoot "IDENTITAS-LOGO TANWIR DAN MILAD KE-114 MUHAMMADIYAH\ELEMEN GRAFIS\ELEMEN GRAFIS-LOGO TANWIR DAN MILAD KE 114 MUHAMMADIYAH.png"
$templateSrc = Join-Path $srcRoot "TEMPLATE-LOGO TANWIR DAN MILAD KE-114 MUHAMMADIYAH\2.0-MEDIA DIGITAL\1920X1080\1920x1080-LOGO TANWIR DAN MILAD KE-114 MUHAMMADIYAH-01.png"

$publicLogo = Join-Path $root "public\logo"
$publicPattern = Join-Path $root "public\pattern"
$publicOg = Join-Path $root "public\og"
$publicLicenses = Join-Path $root "public\licenses"
$appFonts = Join-Path $root "src\app\fonts"

foreach ($d in @($publicLogo, $publicPattern, $publicOg, $publicLicenses, $appFonts)) {
    New-Item -ItemType Directory -Path $d -Force | Out-Null
}

function Resize-Image {
    param(
        [string]$Source,
        [string]$Destination,
        [int]$Width,
        [int]$Height
    )

    $src = [System.Drawing.Bitmap]::FromFile($Source)
    $dst = New-Object System.Drawing.Bitmap($Width, $Height, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $g = [System.Drawing.Graphics]::FromImage($dst)
    $g.Clear([System.Drawing.Color]::Transparent)
    $g.CompositingMode = [System.Drawing.Drawing2D.CompositingMode]::SourceCopy
    $g.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.DrawImage($src, 0, 0, $Width, $Height)
    $g.Dispose()
    $dst.Save($Destination, [System.Drawing.Imaging.ImageFormat]::Png)
    $dst.Dispose()
    $src.Dispose()
}

function Resize-Crop {
    param(
        [string]$Source,
        [string]$Destination,
        [int]$Width,
        [int]$Height,
        [int]$CropY = 0
    )

    $src = [System.Drawing.Bitmap]::FromFile($Source)
    $scaledW = $Width
    $scaledH = [int][math]::Round($src.Height * ($Width / $src.Width))
    $scaled = New-Object System.Drawing.Bitmap($scaledW, $scaledH, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $g = [System.Drawing.Graphics]::FromImage($scaled)
    $g.CompositingMode = [System.Drawing.Drawing2D.CompositingMode]::SourceCopy
    $g.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.DrawImage($src, 0, 0, $scaledW, $scaledH)
    $g.Dispose()

    $dst = New-Object System.Drawing.Bitmap($Width, $Height, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $g2 = [System.Drawing.Graphics]::FromImage($dst)
    $g2.CompositingMode = [System.Drawing.Drawing2D.CompositingMode]::SourceCopy
    $g2.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
    $g2.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g2.DrawImage($scaled, (New-Object System.Drawing.Rectangle(0, 0, $Width, $Height)), (New-Object System.Drawing.Rectangle(0, $CropY, $Width, $Height)), [System.Drawing.GraphicsUnit]::Pixel)
    $g2.Dispose()
    $dst.Save($Destination, [System.Drawing.Imaging.ImageFormat]::Png)
    $dst.Dispose()
    $scaled.Dispose()
    $src.Dispose()
}

function Crop-Resize {
    param(
        [string]$Source,
        [string]$Destination,
        [int]$CropY,
        [int]$Width,
        [int]$Height
    )

    $src = [System.Drawing.Bitmap]::FromFile($Source)
    $cropH = $src.Height - $CropY
    $crop = New-Object System.Drawing.Bitmap($src.Width, $cropH, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $g = [System.Drawing.Graphics]::FromImage($crop)
    $g.CompositingMode = [System.Drawing.Drawing2D.CompositingMode]::SourceCopy
    $g.DrawImage($src, (New-Object System.Drawing.Rectangle(0, 0, $src.Width, $cropH)), (New-Object System.Drawing.Rectangle(0, $CropY, $src.Width, $cropH)), [System.Drawing.GraphicsUnit]::Pixel)
    $g.Dispose()

    $dst = New-Object System.Drawing.Bitmap($Width, $Height, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $g2 = [System.Drawing.Graphics]::FromImage($dst)
    $g2.Clear([System.Drawing.Color]::Transparent)
    $g2.CompositingMode = [System.Drawing.Drawing2D.CompositingMode]::SourceCopy
    $g2.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
    $g2.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g2.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g2.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g2.DrawImage($crop, 0, 0, $Width, $Height)
    $g2.Dispose()
    $dst.Save($Destination, [System.Drawing.Imaging.ImageFormat]::Png)
    $dst.Dispose()
    $crop.Dispose()
    $src.Dispose()
}

# Logos
Resize-Image (Join-Path $logoDir "HORIZONTAL-LOGO TANWIR DAN MILAD 114-MUHAMMADIYAH-2026-01.png") (Join-Path $publicLogo "horizontal-color.png") 1600 900
Resize-Image (Join-Path $logoDir "HORIZONTAL-LOGO TANWIR DAN MILAD 114-MUHAMMADIYAH-2026-03.png") (Join-Path $publicLogo "horizontal-white.png") 1600 900
Resize-Image (Join-Path $logoDir "VERTIKAL-LOGO TANWIR DAN MILAD 114-MUHAMMADIYAH-2026-01.png") (Join-Path $publicLogo "vertical-color.png") 900 1600
Resize-Image (Join-Path $logoDir "LOGOGRAM-LOGO TANWIR DAN MILAD 114-MUHAMMADIYAH-2026-01.png") (Join-Path $publicLogo "logogram-color.png") 512 512
Resize-Image (Join-Path $logoDir "LOGOGRAM-LOGO TANWIR DAN MILAD 114-MUHAMMADIYAH-2026-03.png") (Join-Path $publicLogo "logogram-white.png") 512 512
Copy-Item -LiteralPath (Join-Path $publicLogo "logogram-color.png") -Destination (Join-Path $root "src\app\icon.png") -Force

# Pattern: crop the navy band starting around y=350, then scale.
Crop-Resize $patternSrc (Join-Path $publicPattern "kelor-strip.png") 350 1800 541

# OG image: use the official 1920x1080 template, scale to 1200x675, crop center to 1200x630.
Resize-Crop $templateSrc (Join-Path $publicOg "og-milad114.png") 1200 630 23
$ogPng = [System.Drawing.Bitmap]::FromFile((Join-Path $publicOg "og-milad114.png"))
$ogJpg = New-Object System.Drawing.Bitmap(1200, 630, [System.Drawing.Imaging.PixelFormat]::Format24bppRgb)
$g = [System.Drawing.Graphics]::FromImage($ogJpg)
$g.Clear([System.Drawing.Color]::White)
$g.DrawImage($ogPng, 0, 0, 1200, 630)
$g.Dispose()
$ogJpg.Save((Join-Path $publicOg "og-milad114.jpg"), [System.Drawing.Imaging.ImageFormat]::Jpeg)
$ogJpg.Dispose()
$ogPng.Dispose()

# Fonts and licenses
Copy-Item -LiteralPath (Join-Path $fontDir "El_Messiri\ElMessiri-VariableFont_wght.ttf") -Destination (Join-Path $appFonts "ElMessiri-VariableFont_wght.ttf") -Force
Copy-Item -LiteralPath (Join-Path $fontDir "Familjen_Grotesk\FamiljenGrotesk-VariableFont_wght.ttf") -Destination (Join-Path $appFonts "FamiljenGrotesk-VariableFont_wght.ttf") -Force
Copy-Item -LiteralPath (Join-Path $fontDir "Familjen_Grotesk\FamiljenGrotesk-Italic-VariableFont_wght.ttf") -Destination (Join-Path $appFonts "FamiljenGrotesk-Italic-VariableFont_wght.ttf") -Force
Copy-Item -LiteralPath (Join-Path $fontDir "El_Messiri\OFL.txt") -Destination (Join-Path $publicLicenses "OFL-ElMessiri.txt") -Force
Copy-Item -LiteralPath (Join-Path $fontDir "Familjen_Grotesk\OFL.txt") -Destination (Join-Path $publicLicenses "OFL-FamiljenGrotesk.txt") -Force

# WebP pattern via ffmpeg if available
if (Get-Command ffmpeg -ErrorAction SilentlyContinue) {
    & ffmpeg -y -loglevel error -i (Join-Path $publicPattern "kelor-strip.png") -c:v libwebp -quality 82 (Join-Path $publicPattern "kelor-strip.webp")
}

# Clean the default create-next-app public assets and favicon.
$cleanup = @(
    (Join-Path $root "public\file.svg"),
    (Join-Path $root "public\globe.svg"),
    (Join-Path $root "public\next.svg"),
    (Join-Path $root "public\vercel.svg"),
    (Join-Path $root "public\window.svg"),
    (Join-Path $root "src\app\favicon.ico")
)
foreach ($f in $cleanup) {
    if (Test-Path -LiteralPath $f) { Remove-Item -LiteralPath $f -Force }
}

Write-Output "Assets prepared."
Get-ChildItem -LiteralPath $publicLogo, $publicPattern, $publicOg -File | Select-Object FullName, @{n='KB';e={[math]::Round($_.Length/1KB)}} | Format-Table -AutoSize -Wrap
