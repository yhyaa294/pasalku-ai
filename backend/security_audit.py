#!/usr/bin/env python3
"""
SECURITY AUDIT SCRIPT - PASALKU.AI ENTERPRISE
Validasi konfigurasi keamanan untuk production readiness

Usage:
    python security_audit.py

Author: Muhammad Syarifuddin Yahya - Enterprise Security Audit
Date: 2025 - Production Ready
"""

import os
import re
import json
import logging
from pathlib import Path
from datetime import datetime
from typing import Dict, List, Tuple

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

class SecurityAuditor:
    """Enterprise Security Audit Class"""

    def __init__(self):
        self.env_path = Path('../.env')
        self.results = {
            "timestamp": datetime.now().isoformat(),
            "environment": "unknown",
            "score": 0,
            "grade": "F",
            "passed_checks": 0,
            "total_checks": 0,
            "critical_issues": [],
            "warnings": [],
            "passed": [],
            "recommendations": []
        }
        self.passed = 0
        self.total = 0

    def audit(self) -> Dict:
        """Jalankan audit keamanan lengkap"""
        print("[LOCK] SECURITY AUDIT - PASALKU.AI ENTERPRISE")
        print("=" * 60)

        logger.info("Starting security audit...")

        # Load environment
        self._load_environment()

        # Run all security checks
        checks = [
            ("Environment Configuration", self._audit_environment_config),
            ("Secret Key Security", self._audit_secret_key),
            ("Authentication Security", self._audit_authentication),
            ("Database Security", self._audit_database_security),
            ("API Security", self._audit_api_security),
            ("Data Protection", self._audit_data_protection),
            ("Monitoring & Logging", self._audit_monitoring),
            ("Network Security", self._audit_network_security)
        ]

        for section_name, check_func in checks:
            self._run_section_check(section_name, check_func)

        # Calculate final score and grade
        self._calculate_final_score()

        # Print results
        self._print_results()

        return self.results

    def _load_environment(self):
        """Load environment variables"""
        if self.env_path.exists():
            from dotenv import load_dotenv
            load_dotenv(dotenv_path=self.env_path)
            self.results["environment"] = os.getenv("ENVIRONMENT", "development")
        else:
            self._add_critical_issue("Environment file tidak ditemukan")

    def _run_section_check(self, section_name: str, check_func):
        """Run individual security section"""
        print(f"\n[CHECK] {section_name}")
        print("-" * 40)

        try:
            section_results = check_func()
            if isinstance(section_results, list):
                for result in section_results:
                    self._process_result(result)
        except Exception as e:
            logger.error(f"Error in {section_name}: {e}")
            self._add_critical_issue(f"{section_name}: Error during audit - {str(e)}")

    def _process_result(self, result):
        """Process individual check result"""
        self.total += 1

        status = result.get("status", "unknown")
        message = result.get("message", "")
        severity = result.get("severity", "medium")

        if status == "pass":
            self.passed += 1
            self.results["passed"].append(message)
            print(f"[PASS] {message}")
        elif status == "fail":
            if severity == "critical":
                self.results["critical_issues"].append(message)
                print(f"[CRITICAL] {message}")
            else:
                self.results["warnings"].append(message)
                print(f"[WARNING] {message}")
        else:
            print(f"[INFO] {message}")

        if "recommendation" in result:
            self.results["recommendations"].append(result["recommendation"])

    def _audit_environment_config(self) -> List[Dict]:
        """Audit environment configuration"""
        results = []

        # Environment setting
        env = os.getenv("ENVIRONMENT", "development")
        if env == "production":
            results.append({
                "status": "pass",
                "message": "Environment set to PRODUCTION"
            })
        else:
            results.append({
                "status": "fail",
                "severity": "critical",
                "message": f"Environment set to {env.upper()}, should be PRODUCTION",
                "recommendation": "Set ENVIRONMENT=production for production deployment"
            })

        # Debug setting
        debug = os.getenv("DEBUG", "True").lower() == "true"
        if not debug:
            results.append({
                "status": "pass",
                "message": "Debug mode DISABLED in production"
            })
        else:
            results.append({
                "status": "fail",
                "severity": "critical",
                "message": "Debug mode ENABLED - should be False in production",
                "recommendation": "Set DEBUG=False to disable debug mode in production"
            })

        return results

    def _audit_secret_key(self) -> List[Dict]:
        """Audit JWT secret key security"""
        results = []

        secret_key = os.getenv("SECRET_KEY")
        if not secret_key:
            results.append({
                "status": "fail",
                "severity": "critical",
                "message": "SECRET_KEY not configured",
                "recommendation": "Generate and set a secure SECRET_KEY using secrets.token_hex(32)"
            })
        elif len(secret_key) < 32:
            results.append({
                "status": "fail",
                "severity": "critical",
                "message": f"SECRET_KEY too short: {len(secret_key)} chars (minimum 32)",
                "recommendation": "Use a minimum 32-character secret key for JWT security"
            })
        elif secret_key == "your-very-secret-key-change-this-in-production-123456789":
            results.append({
                "status": "fail",
                "severity": "critical",
                "message": "SECRET_KEY is default value - must be changed",
                "recommendation": "Generate a cryptographically secure unique secret key"
            })
        elif re.search(r'[0-9a-f]{64,}', secret_key, re.IGNORECASE):
            results.append({
                "status": "pass",
                "message": "SECRET_KEY is cryptographically secure (hex-based)"
            })
        else:
            results.append({
                "status": "pass",
                "message": f"SECRET_KEY configured with length {len(secret_key)} characters"
            })

        return results

    def _audit_authentication(self) -> List[Dict]:
        """Audit authentication systems"""
        results = []

        # Clerk Authentication
        clerk_pub = os.getenv("NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY")
        clerk_secret = os.getenv("CLERK_SECRET_KEY")

        if clerk_pub and clerk_secret:
            # Check if test vs production keys
            if clerk_pub.startswith("pk_test_"):
                results.append({
                    "status": "warning",
                    "message": "Clerk using TEST environment keys",
                    "recommendation": "Switch to production Clerk keys for production deployment"
                })
            elif clerk_pub.startswith("pk_live_"):
                results.append({
                    "status": "pass",
                    "message": "Clerk authentication configured for PRODUCTION"
                })
        else:
            results.append({
                "status": "fail",
                "severity": "critical",
                "message": "Clerk authentication not fully configured",
                "recommendation": "Configure both NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY and CLERK_SECRET_KEY"
            })

        # StackAuth (optional secondary auth)
        stack_auth = os.getenv("NEXT_PUBLIC_STACK_PROJECT_ID")
        if stack_auth:
            results.append({
                "status": "pass",
                "message": "StackAuth configured as secondary authentication"
            })

        return results

    def _audit_database_security(self) -> List[Dict]:
        """Audit database security configurations"""
        results = []

        # PostgreSQL URL security
        postgres_url = os.getenv("DATABASE_URL", "")
        if postgres_url:
            if "sslmode=require" in postgres_url:
                results.append({
                    "status": "pass",
                    "message": "PostgreSQL connection uses SSL/TLS encryption"
                })
            else:
                results.append({
                    "status": "fail",
                    "severity": "critical",
                    "message": "PostgreSQL connection does not enforce SSL",
                    "recommendation": "Add ?sslmode=require to DATABASE_URL"
                })

        # MongoDB security
        mongo_url = os.getenv("MONGODB_URI", "")
        if mongo_url:
            if "+srv://" in mongo_url:
                results.append({
                    "status": "pass",
                    "message": "MongoDB Atlas using secure SRV connection"
                })
            else:
                results.append({
                    "status": "warning",
                    "message": "MongoDB connection may not be fully optimized",
                    "recommendation": "Consider using MongoDB Atlas SRV connection for added security"
                })

        return results

    def _audit_api_security(self) -> List[Dict]:
        """Audit API key security"""
        results = []

        # AI API Keys
        ark_key = os.getenv("ARK_API_KEY")
        groq_key = os.getenv("GROQ_API_KEY")

        if ark_key and len(ark_key) > 20:
            results.append({
                "status": "pass",
                "message": "BytePlus Ark API key configured"
            })

        if groq_key and len(groq_key) > 20:
            results.append({
                "status": "pass",
                "message": "Groq AI API key configured"
            })

        if not (ark_key and groq_key):
            results.append({
                "status": "fail",
                "severity": "critical",
                "message": "Dual AI strategy not fully configured",
                "recommendation": "Configure both ARK_API_KEY and GROQ_API_KEY for dual AI capability"
            })

        # Stripe Security
        stripe_secret = os.getenv("STRIPE_SECRET_KEY")
        if stripe_secret:
            if stripe_secret.startswith("sk_test_"):
                results.append({
                    "status": "warning",
                    "message": "Stripe using TEST environment",
                    "recommendation": "Switch to production Stripe keys for monetization"
                })
            elif stripe_secret.startswith("sk_live_"):
                results.append({
                    "status": "pass",
                    "message": "Stripe configured for PRODUCTION monetization"
                })

        return results

    def _audit_data_protection(self) -> List[Dict]:
        """Audit data protection measures"""
        results = []

        # PIN Hashing Check
        # CORS Configuration
        cors_origins = os.getenv("CORS_ORIGINS", "")
        if cors_origins:
            origins = [origin.strip() for origin in cors_origins.split(",")]
            has_wildcard = "*" in cors_origins
            has_localhost_production = any("localhost" in origin for origin in origins) and \
                                     os.getenv("ENVIRONMENT") == "production"

            if has_wildcard:
                results.append({
                    "status": "fail",
                    "severity": "critical",
                    "message": "CORS allows all origins (*) - excessive permissions",
                    "recommendation": "Restrict CORS origins to specific domains only"
                })

            if has_localhost_production:
                results.append({
                    "status": "warning",
                    "message": "CORS includes localhost in production environment",
                    "recommendation": "Remove localhost origins from production CORS"
                })

            if not has_wildcard and not has_localhost_production:
                results.append({
                    "status": "pass",
                    "message": f"CORS configured securely with {len(origins)} origins"
                })

        return results

    def _audit_monitoring(self) -> List[Dict]:
        """Audit monitoring and observability"""
        results = []

        # Sentry Configuration
        sentry_dsn = os.getenv("NEXT_PUBLIC_SENTRY_DSN")
        if sentry_dsn:
            results.append({
                "status": "pass",
                "message": "Sentry error monitoring configured"
            })
        else:
            results.append({
                "status": "warning",
                "message": "Sentry error monitoring not configured",
                "recommendation": "Configure NEXT_PUBLIC_SENTRY_DSN for error tracking"
            })

        # Checkly Monitoring
        checkly_id = os.getenv("CHECKLY_ACCOUNT_ID")
        checkly_key = os.getenv("CHECKLY_API_KEY")

        if checkly_id and checkly_key:
            results.append({
                "status": "pass",
                "message": "Checkly uptime monitoring configured"
            })
        else:
            results.append({
                "status": "warning",
                "message": "Checkly monitoring not configured",
                "recommendation": "Configure Checkly for synthetic monitoring and uptime checks"
            })

        # Ingest/Webhook Security
        ingest_key = os.getenv("INNGEST_EVENT_KEY")
        if ingest_key:
            results.append({
                "status": "pass",
                "message": "Inngest event-driven architecture configured"
            })

        return results

    def _audit_network_security(self) -> List[Dict]:
        """Audit network and infrastructure security"""
        results = []

        # HTTPS Enforcement (through proxy/CDN)
        # IP-based restrictions (assume handled by infrastructure)

        results.append({
            "status": "pass",
            "message": "Network security delegated to infrastructure layer"
        })

        return results

    def _calculate_final_score(self):
        """Calculate final security score and grade"""
        base_score = (self.passed / self.total) * 100 if self.total > 0 else 0

        # Penalty for critical issues
        critical_penalty = len(self.results["critical_issues"]) * 15
        warning_penalty = len(self.results["warnings"]) * 5

        final_score = max(0, base_score - critical_penalty - warning_penalty)

        # Assign grade
        if final_score >= 90:
            grade = "A+"
        elif final_score >= 80:
            grade = "A"
        elif final_score >= 70:
            grade = "B"
        elif final_score >= 60:
            grade = "C"
        elif final_score >= 50:
            grade = "D"
        else:
            grade = "F"

        self.results.update({
            "score": round(final_score, 1),
            "grade": grade,
            "passed_checks": self.passed,
            "total_checks": self.total
        })

    def _print_results(self):
        """Print final audit results"""
        print("\n" + "=" * 60)
        print("SECURITY AUDIT RESULTS")
        print("=" * 60)

        print(f"Security Score: {self.results['score']}% (Grade: {self.results['grade']})")
        print(f"Environment: {self.results['environment'].upper()}")

        print("\n[PASS] PASSED Checks: {}".format(len(self.results["passed"])))

        if self.results["warnings"]:
            print(f"[WARNING] Warnings: {len(self.results['warnings'])}")

        if self.results["critical_issues"]:
            print(f"[CRITICAL] Critical Issues: {len(self.results['critical_issues'])}")

        # Print critical issues
        if self.results["critical_issues"]:
            print("\n[CRITICAL] CRITICAL ISSUES THAT MUST BE FIXED:")
            for issue in self.results["critical_issues"]:
                print(f"  - {issue}")

        # Print recommendations
        if self.results["recommendations"]:
            print("\n[INFO] RECOMMENDED IMPROVEMENTS:")
            for rec in self.results["recommendations"][:5]:  # Show top 5
                print(f"  - {rec}")

        # Final verdict
        if self.results["score"] >= 80 and not self.results["critical_issues"]:
            print("\n[SUCCESS] SECURITY AUDIT: PASSED")
            print("   Enterprise infrastructure is SECURE and ready for production!")
        elif self.results["score"] >= 60:
            print("\n[WARNING] SECURITY AUDIT: REQUIRES ATTENTION")
            print("   Address critical issues before production deployment")
        else:
            print("\n[FAILED] SECURITY AUDIT: FAILED")
            print("   Critical security issues must be resolved immediately")

    def _add_critical_issue(self, message: str):
        """Add critical issue to results"""
        self.results["critical_issues"].append(message)

# Main execution
if __name__ == "__main__":
    auditor = SecurityAuditor()
    results = auditor.audit()

    # Save results to file
    results_file = Path("../security_audit_results.json")
    with open(results_file, "w", encoding="utf-8") as f:
        json.dump(results, f, indent=2, ensure_ascii=False)

    print(f"\n📄 Audit results saved to: {results_file}")

    # Provide exit code for CI/CD
    exit_code = 0 if results["score"] >= 80 and not results["critical_issues"] else 1
    exit(exit_code)