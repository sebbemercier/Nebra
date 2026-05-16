import requests
import logging
import time

class APIClient:
    def __init__(self, base_url, api_key=None):
        self.base_url = base_url.rstrip("/")
        self.api_key = api_key
        self.logger = logging.getLogger("NebraAgent")

    def _get_headers(self):
        headers = {"Content-Type": "application/json"}
        if self.api_key:
            headers["X-API-KEY"] = self.api_key
        return headers

    def register(self, data):
        url = f"{self.base_url}/api/v1/agent/register"
        payload = {
            "hostname": data["hostname"],
            "serial_number": data["serial_number"],
            "os_name": data["os"]["system"],
            "os_version": data["os"]["release"],
            "hardware_info": data
        }
        try:
            response = requests.post(url, json=payload, headers=self._get_headers())
            if response.status_code == 201 or response.status_code == 200:
                self.logger.info("Agent registered successfully.")
                return True
            elif response.status_code == 400 and "already registered" in response.text:
                self.logger.info("Agent already registered.")
                return True
            else:
                self.logger.error(f"Failed to register agent: {response.status_code} - {response.text}")
                return False
        except Exception as e:
            self.logger.error(f"Error connecting to backend during registration: {e}")
            return False

    def send_heartbeat(self, data):
        url = f"{self.base_url}/api/v1/agent/heartbeat"
        payload = {
            "serial_number": data["serial_number"],
            "hardware_info": data
        }
        try:
            response = requests.post(url, json=payload, headers=self._get_headers())
            if response.status_code == 200:
                self.logger.info("Heartbeat sent successfully.")
                return True
            else:
                self.logger.error(f"Failed to send heartbeat: {response.status_code} - {response.text}")
                return False
        except Exception as e:
            self.logger.error(f"Error connecting to backend during heartbeat: {e}")
            return False
