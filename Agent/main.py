import os
import time
import logging
from dotenv import load_dotenv
from src.collector import Collector
from src.api_client import APIClient

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger("NebraAgent")

def main():
    load_dotenv()
    
    backend_url = os.getenv("NEBRA_BACKEND_URL", "http://localhost:8000")
    api_key = os.getenv("NEBRA_API_KEY")
    heartbeat_interval = int(os.getenv("NEBRA_HEARTBEAT_INTERVAL", "60"))

    logger.info("Starting Nebra Agent...")
    
    collector = Collector()
    client = APIClient(backend_url, api_key)

    # Initial collection and registration
    data = collector.collect_all()
    if client.register(data):
        logger.info("Initial registration successful.")
    else:
        logger.warning("Initial registration failed, will retry during heartbeats.")

    # Main loop
    while True:
        try:
            logger.info("Collecting data...")
            data = collector.collect_all()
            client.send_heartbeat(data)
        except Exception as e:
            logger.error(f"Error in main loop: {e}")
        
        time.sleep(heartbeat_interval)

if __name__ == "__main__":
    main()
