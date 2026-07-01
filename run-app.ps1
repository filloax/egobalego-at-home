# Find a way to run Python, trying in order: py, python3, python, uv run
$pyCmd = Get-Command py -ErrorAction SilentlyContinue
if (-not $pyCmd) {
    $pyCmd = Get-Command python3 -ErrorAction SilentlyContinue
}
if (-not $pyCmd) {
    $pyCmd = Get-Command python -ErrorAction SilentlyContinue
}
$uvCmd = $null
if (-not $pyCmd) {
    $uvCmd = Get-Command uv -ErrorAction SilentlyContinue
}
if (-not $pyCmd -and -not $uvCmd) {
    Write-Host "Could not find 'py', 'python3', 'python' or 'uv', please install Python 3.x: https://www.python.org/downloads/"
    exit 1
}

# Run the Python script with the passed language argument
$lang = If ([string]::IsNullOrEmpty($args[0])) { "en_us" } Else { $args[0] }
$extraArgs = @()
if ($args[1] -eq "legacy") {
    $extraArgs += "--legacy"
}
$requirementsFile = "$PSScriptRoot\program\requirements.txt"

# Ensure we run from the repository root so that "-m program" finds the "program" package
Push-Location $PSScriptRoot

if ($uvCmd) {
    Write-Host "Using uv to run the app."
    & $uvCmd.Source run --with-requirements $requirementsFile -- python -m program.egobalego --open --no-debug --lang $lang @extraArgs
}
else {
    $pythonExePath = $pyCmd.Source
    Write-Host "Using Python from '$pythonExePath'."

    # Check if the virtual environment exists, create it if it doesn't
    $venvFolderName = ".egovenv"
    $venvPath = "$PSScriptRoot\$venvFolderName"
    if (!(Test-Path $venvPath)) {
        Write-Host "Virtual environment does not exist. Creating now (please wait)..."
        & $pythonExePath -m venv $venvPath
    }
    if (!(Test-Path "$venvPath\Scripts\Activate.ps1")) {
        Write-Host "Virtual environment is broken ('$venvFolderName\Scripts\Activate.ps1' not found), recreating (please wait)..."
        & $pythonExePath -m venv $venvPath
    }
    if (!(Test-Path "$venvPath\Scripts\Activate.ps1")) {
        Write-Host "Could not create virtual environment, please check your Python installation."
        exit 1
    }

    # Activate the virtual environment
    & "$venvPath\Scripts\Activate.ps1"

    # Install requirements if they are not already installed (in that case, avoid cluttering the output)
    $venvPythonExe = "$venvPath\Scripts\python.exe"
    & $venvPythonExe -m pip install -r $requirementsFile | find /V "already satisfied"

    & $venvPythonExe -m program.egobalego --open --no-debug --lang $lang @extraArgs
}

Pop-Location
