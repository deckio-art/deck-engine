<#
.SYNOPSIS
    Scaffolds standalone GitHub repos for each canvas project.
    Run this AFTER authenticating with: gh auth login

.DESCRIPTION
    For each project (dev-plan, dev-random, nordcloud-devday, ghcp):
    1. Creates a GitHub repo under lopezleandro03/
    2. Scaffolds the standalone project structure (template + slides + data)
    3. Pushes to GitHub

.NOTES
    Prerequisites:
    - gh CLI installed and authenticated (gh auth login)
    - git configured with push credentials
    - Run from the canvas repo root: c:\code\canvas
#>

param(
    [string]$Owner = "lopezleandro03",
    [string]$OutputDir = "C:\code",
    [switch]$SkipGitHubCreate,
    [switch]$DryRun
)

$ErrorActionPreference = "Stop"
$CanvasRoot = "C:\code\canvas"
$TemplateDir = "$CanvasRoot\templates\canvas-project"
$ProjectsDir = "$CanvasRoot\deck\src\projects"
$DataDir = "$CanvasRoot\deck\src\data"

# ── Project definitions ──────────────────────────────────────────────────────

$Projects = @(
    @{
        Id          = "dev-plan"
        RepoName    = "canvas-project-dev-plan"
        Title       = "Development Plan"
        Subtitle    = "Dilruba Turan — Aspire"
        Icon        = "🌱"
        Accent      = "#3fb950"
        Description = "Aspire development plan deck built on the Canvas engine"
        Private     = $false
        DataFiles   = @(
            "coaches/Paul.png",
            "coaches/Marco.png",
            "coaches/Bram.png",
            "coaches/Eliane.png",
            "coaches/Emel.png",
            "coaches/Aram.png",
            "coaches/Ivo.png",
            "governance/leandro.png"
        )
    },
    @{
        Id          = "dev-random"
        RepoName    = "canvas-project-dev-random"
        Title       = "dev-random"
        Subtitle    = "Random Slides Sandbox"
        Icon        = "⚡"
        Accent      = "#3fb950"
        Description = "Random experimental slides sandbox built on the Canvas engine"
        Private     = $false
        DataFiles   = @(
            "generated/bridge.png",
            "generated/right-icons.png"
        )
    },
    @{
        Id          = "nordcloud-devday"
        RepoName    = "canvas-project-nordcloud-devday"
        Title       = "Nordcloud Developer Day"
        Subtitle    = "Opening Keynote · 2026"
        Icon        = "⚡"
        Accent      = "#58a6ff"
        Description = "Nordcloud Developer Day keynote deck built on the Canvas engine"
        Private     = $false
        DataFiles   = @(
            "images/andrej.png",
            "images/priyanka.png",
            "images/northware-microsoft-azure-logo.webp",
            "images/icons8-github-copilot-48.png",
            "generated/hourglass.png",
            "logos/ms-products/visualstudio.svg",
            "logos/ms-products/vscode.svg",
            "logos/ms-products/kubernetes.svg",
            "logos/ms-products/github.svg",
            "logos/ms-products/azuredevops.svg"
        )
    },
    @{
        Id          = "ghcp"
        RepoName    = "canvas-project-ghcp"
        Title       = "GitHub Copilot Adoption"
        Subtitle    = "Netherlands Strategic Customers"
        Icon        = "🚀"
        Accent      = "#7c3aed"
        Description = "GitHub Copilot strategic customer adoption deck built on the Canvas engine"
        Private     = $true
        DataFiles   = @(
            "opportunity.js",
            "speakers.jsx",
            "logos/ing.png",
            "logos/asml.png",
            "logos/philips.png",
            "logos/shell.png",
            "logos/ahold.png",
            "logos/abnamro.png",
            "logos/rabobank.svg",
            "governance/leandro.png",
            "governance/marcel.png",
            "governance/stefanie.png",
            "governance/eric.png",
            "speakers/Pascal.png",
            "speakers/Gerald.png",
            "speakers/Eduard.png",
            "speakers/Anton.png",
            "speakers/Ali.png",
            "speakers/Simona.png"
        )
    }
)

# ── Helper functions ─────────────────────────────────────────────────────────

function Copy-Template {
    param([string]$Dest)
    
    # Core template files
    Copy-Item "$TemplateDir\.npmrc" "$Dest\.npmrc"
    Copy-Item "$TemplateDir\index.html" "$Dest\index.html"
    
    # Vite config
    Copy-Item "$TemplateDir\vite.config.js" "$Dest\vite.config.js"
    
    # Devcontainer
    New-Item -ItemType Directory -Path "$Dest\.devcontainer" -Force | Out-Null
    Copy-Item "$TemplateDir\.devcontainer\devcontainer.json" "$Dest\.devcontainer\devcontainer.json"
    
    # App shell from template
    New-Item -ItemType Directory -Path "$Dest\src" -Force | Out-Null
    Copy-Item "$TemplateDir\src\App.jsx" "$Dest\src\App.jsx"
    Copy-Item "$TemplateDir\src\main.jsx" "$Dest\src\main.jsx"
}

function Copy-ProjectSlides {
    param([string]$ProjectId, [string]$Dest)
    
    $SrcDir = "$ProjectsDir\$ProjectId"
    $SlidesDest = "$Dest\src\slides"
    New-Item -ItemType Directory -Path $SlidesDest -Force | Out-Null
    
    # Copy all slide .jsx and .module.css files (not the App file or config)
    Get-ChildItem $SrcDir -File | Where-Object {
        $_.Name -notmatch "App\.jsx$" -and
        $_.Name -ne "project.config.js" -and
        $_.Name -ne "index.js"
    } | ForEach-Object {
        $content = Get-Content $_.FullName -Raw
        
        # Fix data imports: ../../data/ → ../data/
        $content = $content -replace "from '\.\.\/\.\.\/data\/", "from '../data/"
        $content = $content -replace "from `"\.\.\/\.\.\/data\/", "from `"../data/"
        
        Set-Content -Path "$SlidesDest\$($_.Name)" -Value $content -NoNewline
    }
}

function Copy-DataFiles {
    param([string[]]$Files, [string]$Dest)
    
    $DataDest = "$Dest\src\data"
    
    foreach ($file in $Files) {
        $src = "$DataDir\$file"
        $destFile = "$DataDest\$file"
        $destDir = Split-Path $destFile -Parent
        
        if (Test-Path $src) {
            New-Item -ItemType Directory -Path $destDir -Force | Out-Null
            Copy-Item $src $destFile -Force
        } else {
            Write-Warning "Data file not found: $src"
        }
    }
    
    # Fix data JS module imports (speakers.jsx imports from ./speakers/*.png)
    Get-ChildItem $DataDest -Filter "*.jsx" -Recurse -ErrorAction SilentlyContinue | ForEach-Object {
        $content = Get-Content $_.FullName -Raw
        # These files' internal imports should already be relative, no changes needed
        Set-Content -Path $_.FullName -Value $content -NoNewline
    }
}

function New-CanvasConfig {
    param([hashtable]$Project, [string]$Dest)
    
    $SrcDir = "$ProjectsDir\$($Project.Id)"
    $AppFile = Get-ChildItem $SrcDir -Filter "*App.jsx" | Select-Object -First 1
    
    if (-not $AppFile) {
        Write-Error "No App file found for project $($Project.Id)"
        return
    }
    
    # Parse slide imports from the App file
    $appContent = Get-Content $AppFile.FullName -Raw
    $slideImports = @()
    $slideNames = @()
    
    # Match local slide imports (not from @lopezleandro03/canvas-engine)
    $importPattern = "import\s+(\w+)\s+from\s+'\.\/(\w+)'"
    $matches = [regex]::Matches($appContent, $importPattern)
    foreach ($m in $matches) {
        $name = $m.Groups[1].Value
        $slideImports += "import $name from './src/slides/$name.jsx'"
        $slideNames += $name
    }
    
    # Also catch GenericThankYouSlide from engine
    if ($appContent -match "import\s+(\w+)\s+from\s+'@lopezleandro03/canvas-engine/slides/GenericThankYouSlide'") {
        $name = $Matches[1]
        $slideImports += "import $name from '@lopezleandro03/canvas-engine/slides/GenericThankYouSlide'"
        $slideNames += $name
    }
    
    $importsBlock = $slideImports -join "`n"
    $slidesArray = ($slideNames | ForEach-Object { "    $_," }) -join "`n"
    
    $config = @"
$importsBlock

export default {
  id: '$($Project.Id)',
  title: '$($Project.Title)',
  subtitle: '$($Project.Subtitle)',
  icon: '$($Project.Icon)',
  accent: '$($Project.Accent)',
  slides: [
$slidesArray
  ],
}
"@
    
    Set-Content -Path "$Dest\canvas.config.js" -Value $config -NoNewline
}

function New-PackageJson {
    param([hashtable]$Project, [string]$Dest)
    
    $pkg = @"
{
  "name": "canvas-project-$($Project.Id)",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "@lopezleandro03/canvas-engine": "^1.0.0",
    "react": "^19.1.0",
    "react-dom": "^19.1.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.4.1",
    "vite": "^6.3.5"
  }
}
"@
    Set-Content -Path "$Dest\package.json" -Value $pkg -NoNewline
}

function New-Gitignore {
    param([string]$Dest)
    
    $content = @"
node_modules/
dist/
.env
.env.local
*.local
"@
    Set-Content -Path "$Dest\.gitignore" -Value $content -NoNewline
}

function New-Readme {
    param([hashtable]$Project, [string]$Dest)
    
    $readme = @"
# $($Project.Title)

$($Project.Description)

Built on the [Canvas engine](https://github.com/$Owner/github-ai-adoption-program).

## Quick start — Codespaces (recommended)

1. Click **Code → Codespaces → New codespace** on this repo
2. Wait ~30 seconds — dependencies install and dev server starts automatically
3. A browser preview opens with your slides. **Edit any file in ``src/slides/`` and see changes instantly.**

## Quick start — Local

```bash
git clone https://github.com/$Owner/$($Project.RepoName).git
cd $($Project.RepoName)
npm install
npm run dev
```

Open http://localhost:5173 in your browser.

## Creating a slide

```jsx
import { BottomBar, Slide } from '@lopezleandro03/canvas-engine'
import styles from './MySlide.module.css'

export default function MySlide({ index }) {
  return (
    <Slide index={index} className={styles.mySlide}>
      <div className="accent-bar" />
      <div className="content-frame content-gutter">
        <h1>Hello</h1>
      </div>
      <BottomBar />
    </Slide>
  )
}
```

Then add it to the ``slides`` array in ``canvas.config.js``.
"@
    Set-Content -Path "$Dest\README.md" -Value $readme -NoNewline
}

# ── Main ─────────────────────────────────────────────────────────────────────

Write-Host "`n🎨 Canvas Project Repo Scaffolder" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan

foreach ($project in $Projects) {
    $repoDir = "$OutputDir\$($project.RepoName)"
    
    Write-Host "`n📦 $($project.RepoName)" -ForegroundColor Yellow
    
    # Clean existing
    if (Test-Path $repoDir) {
        Write-Host "  Removing existing directory..."
        Remove-Item -Recurse -Force $repoDir
    }
    
    New-Item -ItemType Directory -Path $repoDir -Force | Out-Null
    
    if ($DryRun) {
        Write-Host "  [DRY RUN] Would scaffold to $repoDir"
        continue
    }
    
    # 1. Copy template structure
    Write-Host "  Copying template..."
    Copy-Template -Dest $repoDir
    
    # 2. Copy project slides (with import fixes)
    Write-Host "  Copying slides..."
    Copy-ProjectSlides -ProjectId $project.Id -Dest $repoDir
    
    # 3. Copy data/assets
    Write-Host "  Copying data assets ($($project.DataFiles.Count) files)..."
    Copy-DataFiles -Files $project.DataFiles -Dest $repoDir
    
    # 4. Generate canvas.config.js
    Write-Host "  Generating canvas.config.js..."
    New-CanvasConfig -Project $project -Dest $repoDir
    
    # 5. Generate package.json
    Write-Host "  Generating package.json..."
    New-PackageJson -Project $project -Dest $repoDir
    
    # 6. Generate .gitignore
    New-Gitignore -Dest $repoDir
    
    # 7. Generate README
    Write-Host "  Generating README..."
    New-Readme -Project $project -Dest $repoDir
    
    # 8. Create GitHub repo
    if (-not $SkipGitHubCreate) {
        $visibility = if ($project.Private) { "--private" } else { "--public" }
        Write-Host "  Creating GitHub repo ($visibility)..."
        gh repo create "$Owner/$($project.RepoName)" $visibility --description "$($project.Description)" 2>&1
    }
    
    # 9. Git init and push
    Write-Host "  Initializing git and pushing..."
    Push-Location $repoDir
    git init -b main 2>&1 | Out-Null
    git add -A 2>&1 | Out-Null
    git commit -m "Initial scaffold from canvas engine" 2>&1 | Out-Null
    git remote add origin "https://github.com/$Owner/$($project.RepoName).git" 2>&1
    git push -u origin main 2>&1
    Pop-Location
    
    Write-Host "  ✅ https://github.com/$Owner/$($project.RepoName)" -ForegroundColor Green
}

Write-Host "`n🎉 All project repos created!" -ForegroundColor Cyan
Write-Host "`nNext steps:" -ForegroundColor White
Write-Host "  1. Publish the engine: bump version in packages/canvas-engine/package.json and push to main" -ForegroundColor Gray
Write-Host "  2. Test a Codespace: go to any project repo → Code → Codespaces → New" -ForegroundColor Gray
Write-Host "  3. Invite collaborators to individual project repos" -ForegroundColor Gray
