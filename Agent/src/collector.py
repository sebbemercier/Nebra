import platform
import socket
import psutil
import uuid
import getpass

class Collector:
    @staticmethod
    def get_hostname():
        return socket.gethostname()

    @staticmethod
    def get_current_user():
        try:
            return getpass.getuser()
        except Exception:
            return "unknown"

    @staticmethod
    def get_os_info():
        return {
            "system": platform.system(),
            "release": platform.release(),
            "version": platform.version(),
            "machine": platform.machine(),
            "processor": platform.processor(),
            "current_user": Collector.get_current_user()
        }

    @staticmethod
    def get_cpu_info():
        return {
            "physical_cores": psutil.cpu_count(logical=False),
            "total_cores": psutil.cpu_count(logical=True),
            "max_frequency": psutil.cpu_freq().max if psutil.cpu_freq() else None,
            "min_frequency": psutil.cpu_freq().min if psutil.cpu_freq() else None,
            "current_frequency": psutil.cpu_freq().current if psutil.cpu_freq() else None,
            "total_usage": psutil.cpu_percent(interval=1)
        }

    @staticmethod
    def get_memory_info():
        svmem = psutil.virtual_memory()
        return {
            "total": svmem.total,
            "available": svmem.available,
            "used": svmem.used,
            "percentage": svmem.percent
        }

    @staticmethod
    def get_disk_info():
        partitions = psutil.disk_partitions()
        disk_data = []
        for partition in partitions:
            try:
                usage = psutil.disk_usage(partition.mountpoint)
                disk_data.append({
                    "device": partition.device,
                    "mountpoint": partition.mountpoint,
                    "fstype": partition.fstype,
                    "total": usage.total,
                    "used": usage.used,
                    "free": usage.free,
                    "percentage": usage.percent
                })
            except (PermissionError, OSError):
                continue
        return disk_data

    @staticmethod
    def get_network_info():
        if_addrs = psutil.net_if_addrs()
        net_data = {}
        for interface_name, interface_addresses in if_addrs.items():
            net_data[interface_name] = []
            for address in interface_addresses:
                net_data[interface_name].append({
                    "family": str(address.family),
                    "address": address.address,
                    "netmask": address.netmask,
                    "broadcast": address.broadcast
                })
        return net_data

    @staticmethod
    def get_serial_number():
        try:
            # On macOS/Linux, we can try to get a more stable ID
            # For this prototype, hash of MAC is a good fallback
            mac = uuid.getnode()
            return f"NB-{socket.gethostname().upper()}-{str(mac)[-6:]}"
        except Exception:
            return f"NB-UNKNOWN-{uuid.uuid4().hex[:8].upper()}"

    def collect_all(self):
        return {
            "hostname": self.get_hostname(),
            "current_user": self.get_current_user(),
            "os": self.get_os_info(),
            "cpu": self.get_cpu_info(),
            "memory": self.get_memory_info(),
            "disks": self.get_disk_info(),
            "network": self.get_network_info(),
            "serial_number": self.get_serial_number()
        }
