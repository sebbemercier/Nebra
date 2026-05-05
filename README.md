# Système de Gestion d'Inventaire IT - Nebra - Stack Technique Recommandée

## Vue d'ensemble
Ce document décrit une stack moderne, scalable et prête pour la production pour construire un système d'inventaire IT open source (type CMDB).

---

## 🧠 Architecture principale

### Backend
- Python (FastAPI)
- SQLAlchemy 2.0 / SQLModel
- PostgreSQL

### Frontend
- React (Next.js)
- TailwindCSS

### Temps réel
- WebSockets (natif FastAPI ou via Redis)

### Tâches asynchrones
- Celery + Redis (ou Dramatiq)

### Agent
- Python (version initiale)
- Futur : Go ou Rust (performance)

### Infrastructure
- Docker / Docker Compose
- Nginx ou Traefik

---

## 🧱 Composants du système

### 1. API principale
- Gestion des assets (machines)
- Gestion des utilisateurs
- Relations
- Logs / historique

### 2. Agent
- Collecte hardware (CPU, RAM, OS)
- Inventaire des logiciels
- Infos réseau (IP, MAC)
- Heartbeat (online/offline)
- Mise à jour automatique

### 3. Service de découverte réseau
- Scan IP
- SNMP (switchs, imprimantes)
- SSH / WMI

### 4. Workers asynchrones
- Scan réseau
- Import CSV
- Synchronisation AD / Entra ID
- Alertes

### 5. Temps réel
- Statut des machines
- Alertes
- Mises à jour en direct

---

## 🗄️ Base de données (PostgreSQL)

### Tables principales
- assets
- asset_types
- users
- locations
- networks
- installed_software
- audit_logs
- alerts

---

## 🔐 Authentification
- OpenID Connect (OIDC)
- Microsoft Entra ID / Active Directory
- Authentification locale en fallback

Librairies :
- authlib
- fastapi-users

---

## 📱 Intégration QR Code
- Association rapide des équipements
- Inventaire physique

---

## 🔌 API externe
- Webhooks
- Intégrations (ITSM, outils financiers)
- Automatisation

---

## 🔥 Points différenciants
- Interface moderne
- Temps réel natif
- API-first
- Découverte automatique intelligente
- Historique complet

---

## ⚠️ Pièges à éviter
1. Sous-estimer la complexité de l’agent
2. Mauvais schéma de base de données
3. Trop complexifier dès le début

---

## 🚀 Stratégie de développement

### Phase 1 (MVP)
- CRUD assets
- Agent basique
- UI simple

### Phase 2
- Temps réel
- Authentification (OIDC)
- Découverte réseau

### Phase 3
- Intégrations avancées
- Optimisation performance
- Réécriture agent (optionnel)

---

## 🧩 Notes finales
Prioriser une architecture modulaire pour permettre l’évolution sans refonte complète.
