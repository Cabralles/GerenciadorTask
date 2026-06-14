@echo off
REM ============================================================================
REM   SCRIPT PARA RODAR O PROJETO COMPLETO
REM   Task Manager - React 19 + FastAPI + PostgreSQL
REM ============================================================================

color 0A
cls

echo.
echo ============================================================================
echo    %%  INICIANDO PROJETO TASK MANAGER  %%
echo ============================================================================
echo.

REM Verificar se está na pasta correta
if not exist "backend" (
    echo ERRO: Voce deve estar na pasta raiz do projeto!
    echo Navegue ate: c:\Users\User\Downloads\Moderntaskmanagerinterface-main\Moderntaskmanagerinterface-main
    pause
    exit /b 1
)

REM Verificar se Python está instalado
python --version >nul 2>&1
if errorlevel 1 (
    echo ERRO: Python nao esta instalado!
    echo Consulte: INSTALAR_AMBIENTE.txt
    pause
    exit /b 1
)

REM Verificar se Node.js está instalado
node --version >nul 2>&1
if errorlevel 1 (
    echo ERRO: Node.js nao esta instalado!
    echo Consulte: INSTALAR_AMBIENTE.txt
    pause
    exit /b 1
)

REM Verificar se npm está instalado
npm --version >nul 2>&1
if errorlevel 1 (
    echo ERRO: npm nao esta instalado!
    echo Consulte: INSTALAR_AMBIENTE.txt
    pause
    exit /b 1
)

echo [✓] Python encontrado
echo [✓] Node.js encontrado
echo [✓] npm encontrado
echo.

REM Verificar se Docker está instalado
docker --version >nul 2>&1
if errorlevel 1 (
    echo [!] Docker nao encontrado - Pulando docker-compose
    set DOCKER_INSTALLED=0
) else (
    echo [✓] Docker encontrado
    set DOCKER_INSTALLED=1
)

echo.
echo ============================================================================
echo    INSTALANDO DEPENDÊNCIAS...
echo ============================================================================
echo.

REM Instalar dependências do backend
echo [1/2] Instalando dependências do BACKEND...
cd backend
if not exist venv (
    echo     Criando ambiente virtual...
    python -m venv venv
)
call venv\Scripts\activate.bat
pip install -r requirements.txt -q
if errorlevel 1 (
    echo ERRO ao instalar dependências do backend!
    pause
    exit /b 1
)
echo [✓] Backend instalado com sucesso!
cd ..

REM Instalar dependências do frontend
echo.
echo [2/2] Instalando dependências do FRONTEND...
if exist node_modules (
    echo     node_modules ja existe, pulando...
) else (
    npm install -q
    if errorlevel 1 (
        echo ERRO ao instalar dependências do frontend!
        pause
        exit /b 1
    )
)
echo [✓] Frontend instalado com sucesso!

echo.
echo ============================================================================
echo    INICIANDO SERVIÇOS...
echo ============================================================================
echo.

REM Rodar Docker (se instalado)
if %DOCKER_INSTALLED%==1 (
    echo [1/3] Iniciando PostgreSQL com Docker...
    docker-compose up -d postgres
    if errorlevel 1 (
        echo ERRO ao iniciar Docker!
        echo Verifique se Docker Desktop esta aberto
        pause
        exit /b 1
    )
    echo [✓] PostgreSQL iniciado!
    echo     Aguardando banco ficar pronto (5 segundos)...
    timeout /t 5 /nobreak
) else (
    echo [!] Docker nao instalado
    echo    Certifique-se que PostgreSQL esta rodando localmente!
    echo    Conexao esperada: postgresql://taskmanager:taskmanager_password@localhost:5432/task_manager
    echo.
)

echo.
echo ============================================================================
echo    🚀 RODANDO PROJETO
echo ============================================================================
echo.
echo Digite CTRL+C para parar os serviços
echo.

REM Detectar se tem WSL2 (Windows Subsystem for Linux)
REM Se tiver, abrir terminais separados, senao mostrar instrucoes

echo [!] ABRA 2 NOVOS TERMINAIS:
echo.
echo Terminal 1 (BACKEND):
echo   cd backend
echo   venv\Scripts\activate
echo   python run.py
echo.
echo Terminal 2 (FRONTEND):
echo   npm run dev
echo.
echo Apos rodar os 2 terminais:
echo   - Frontend: http://localhost:5173
echo   - Backend: http://localhost:8000
echo   - Swagger: http://localhost:8000/docs
echo.
echo Pressione Enter para continuar...
pause

echo.
echo Pronto! O projeto esta configurado.
echo Agora abra 2 terminais e execute os comandos acima!
echo.
echo Se tudo funcionou corretamente:
echo   ✓ http://localhost:5173 (Frontend)
echo   ✓ http://localhost:8000 (Backend)
echo   ✓ http://localhost:8000/docs (Swagger)
echo.
