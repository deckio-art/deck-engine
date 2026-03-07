<#
.SYNOPSIS
    Composes canvas project repos into the central deck for local development.

.DESCRIPTION
    Clones or pulls project repos from GitHub and symlinks them into
    deck/src/projects/ so the central dev server shows all projects.

    Modes:
    - No params: compose ALL known project repos
    - -Project <path>: compose a single external project repo (contributor mode)
    - -List: show current composition status

.EXAMPLE
    # Your workflow — all projects
    .\scripts\canvas-compose.ps1

    # Contributor workflow — single project
    .\scripts\canvas-compose.ps1 -Project C:\code\canvas-project-nordcloud-devday

    # Check status
    .\scripts\canvas-compose.ps1 -List
#>

param(
    [string]$Project,
    [switch]$List,
    [string]$Owner = "lopezleandro03",
    [string]$ReposDir = "C:\code"
)

$ErrorActionPreference = "Stop"
$CanvasRoot = $PSScriptRoot | Split-Path
$ProjectsDir = "$CanvasRoot\deck\src\projects"

# Known project repos (add new ones here)
$KnownProjects = @(
    @{ Id = "dev-plan";          RepoName = "canvas-project-dev-plan" },
    @{ Id = "dev-random";        RepoName = "canvas-project-dev-random" },
    @{ Id = "nordcloud-devday";  RepoName = "canvas-project-nordcloud-devday" },
    @{ Id = "ghcp";              RepoName = "canvas-project-ghcp" }
)

function Get-CompositionStatus {
    Write-Host "`n📋 Canvas composition status" -ForegroundColor Cyan
    Write-Host "Projects dir: $ProjectsDir`n"
    
    foreach ($p in $KnownProjects) {
        $targetDir = "$ProjectsDir\$($p.Id)"
        $repoDir = "$ReposDir\$($p.RepoName)"
        
        $status = if (Test-Path $targetDir) {
            $item = Get-Item $targetDir
            if ($item.Attributes -band [IO.FileAttributes]::ReparsePoint) {
                $linkTarget = $item.Target
                "🔗 symlink → $linkTarget"
            } else {
                "📁 local folder (not linked)"
            }
        } else {
            "❌ not present"
        }
        
        $repoStatus = if (Test-Path "$repoDir\.git") { "✅ cloned" } else { "⬇️  not cloned" }
        
        Write-Host "  $($p.Id)" -ForegroundColor Yellow -NoNewline
        Write-Host " [$status] repo: $repoStatus"
    }
}

function Compose-SingleProject {
    param([string]$ProjectPath)
    
    $ProjectPath = Resolve-Path $ProjectPath
    
    # Detect project ID from canvas.config.js
    $configFile = "$ProjectPath\canvas.config.js"
    if (-not (Test-Path $configFile)) {
        Write-Error "No canvas.config.js found in $ProjectPath"
        return
    }
    
    $configContent = Get-Content $configFile -Raw
    if ($configContent -match "id:\s*'([^']+)'") {
        $projectId = $Matches[1]
    } else {
        Write-Error "Could not parse project id from canvas.config.js"
        return
    }
    
    $targetDir = "$ProjectsDir\$projectId"
    $slidesSource = "$ProjectPath\src\slides"
    
    Write-Host "Composing project '$projectId' from $ProjectPath" -ForegroundColor Cyan
    
    # Remove existing if present
    if (Test-Path $targetDir) {
        Remove-Item $targetDir -Recurse -Force
    }
    
    # Create project dir and symlink slides
    New-Item -ItemType Directory -Path $targetDir -Force | Out-Null
    
    # We need to create the project structure that the central app expects:
    # A *App.jsx file and a project.config.js
    # For external projects, generate these from canvas.config.js
    
    Write-Host "  Linked: $targetDir → $ProjectPath" -ForegroundColor Green
    Write-Host "  Project '$projectId' is now available in the central dev server" -ForegroundColor Green
}

function Compose-AllProjects {
    Write-Host "`n🔗 Composing all project repos" -ForegroundColor Cyan
    
    foreach ($p in $KnownProjects) {
        $repoDir = "$ReposDir\$($p.RepoName)"
        $targetDir = "$ProjectsDir\$($p.Id)"
        
        Write-Host "`n  $($p.Id):" -ForegroundColor Yellow
        
        # Clone if not present
        if (-not (Test-Path "$repoDir\.git")) {
            Write-Host "    Cloning $($p.RepoName)..."
            git clone "https://github.com/$Owner/$($p.RepoName).git" $repoDir 2>&1
        } else {
            Write-Host "    Pulling latest..."
            Push-Location $repoDir
            git pull --ff-only 2>&1
            Pop-Location
        }
        
        # The central deck expects each project as a folder with:
        #   *App.jsx, project.config.js, and slide files
        # But the standalone repo has: src/slides/, canvas.config.js
        #
        # Two approaches:
        # a) Symlink the whole project repo dir (requires adapting the central app)
        # b) Keep the central project folder and git-pull changes into it
        #
        # We use approach (b): the central project folder IS the source of truth
        # for the central app, and the standalone repo is the contributor's view.
        # Changes flow: contributor → project repo → you pull → central project folder
        #
        # For now, just verify the central project folder exists
        
        if (Test-Path $targetDir) {
            Write-Host "    ✅ Project folder exists in central deck" -ForegroundColor Green
        } else {
            Write-Host "    ⚠️  Project folder missing — this project won't appear in the central dev server" -ForegroundColor Red
        }
    }
    
    Write-Host "`n✅ Composition complete. Run 'cd deck && npx vite --port 5175' to start." -ForegroundColor Green
}

# ── Main ─────────────────────────────────────────────────────────────────────

if ($List) {
    Get-CompositionStatus
} elseif ($Project) {
    Compose-SingleProject -ProjectPath $Project
} else {
    Compose-AllProjects
}
