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
    Example: /api/firewall/port/8080/on  or  /api/firewall/port/22/off
    """
    if action == "on":
        result = fw.allow_port(port)
    elif action == "off":
        result = fw.deny_port(port)
    else:
        result = "Invalid action"
    return {"port": port, "action": action, "result": result}


# Optional root endpoint
@app.get("/")
def root():
    return {"message": "AI Firewall Backend running on Kali"}
