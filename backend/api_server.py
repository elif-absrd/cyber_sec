from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.firewall_manager import FirewallManager
from backend.firewall_domain import router as domain_router

# Initialize FastAPI once
app = FastAPI(title="AI Firewall Backend - Kali Integration")

# CORS for your frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:8080",
        "http://127.0.0.1:8080",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



# Initialize firewall manager
fw = FirewallManager()

# Include the domain blocking routes
app.include_router(domain_router)

# ------------------------
# Core Firewall Endpoints
# ------------------------

@app.get("/api/firewall/status")
def get_status():
    """Return current UFW rules"""
    return {"rules": fw.service_status()}


@app.post("/api/firewall/{service}/{action}")
def control_service(service: str, action: str):
    """
    Example: /api/firewall/http/on  or  /api/firewall/https/off
    """
    result = fw.toggle_service(service, action)
    return {"service": service, "action": action, "result": result}


@app.post("/api/firewall/port/{port}/{action}")
def control_port(port: int, action: str):
    """
    Control a specific port (blocks both IN and OUT)
    Example: /api/firewall/port/8080/on  or  /api/firewall/port/22/off
    
    Validates:
    - Port range (1-65535)
    - Critical ports (22, 8000, 8080 cannot be blocked)
    - Protocol support
    """
    result = fw.toggle_port(port, action)
    
    # Handle validation errors
    if isinstance(result, dict) and not result.get("success"):
        from fastapi import HTTPException
        raise HTTPException(status_code=400, detail=result.get("error"))
    
    return result


@app.post("/api/firewall/emergency-stop")
def emergency_stop():
    """
    Emergency Stop - Disable ALL firewall rules
    WARNING: This will reset UFW and allow all traffic!
    """
    result = fw.reset_firewall()
    # After reset, re-enable UFW with default deny policy for safety
    fw.run_cmd("sudo ufw --force enable")
    fw.run_cmd("sudo ufw default deny incoming")
    fw.run_cmd("sudo ufw default allow outgoing")
    
    return {
        "status": "emergency_stop_executed",
        "message": "All firewall rules have been reset. UFW is now in default deny mode.",
        "result": result
    }


# Optional root endpoint
@app.get("/")
def root():
    return {"message": "AI Firewall Backend running on Kali"}
