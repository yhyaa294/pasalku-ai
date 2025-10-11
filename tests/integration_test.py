#!/usr/bin/env python3
"""
Integration Test Suite untuk Pasalku.ai
Test end-to-end untuk semua API endpoints dan integrations
"""

import asyncio
import httpx
import json
import sys
from datetime import datetime, timedelta
from pathlib import Path
import os

# Setup environment
BASE_URL = "http://localhost:5000"
TEST_EMAIL = "test@example.com"
TEST_USER_ID = "550e8400-e29b-41d4-a716-446655440000"

class IntegrationTester:
    def __init__(self, base_url: str):
        self.base_url = base_url
        self.client = httpx.AsyncClient(base_url=base_url, timeout=30.0)
        self.test_results = []
        self.passed = 0
        self.failed = 0

    async def __aenter__(self):
        return self

    async def __aexit__(self, exc_type, exc_val, exc_tb):
        await self.client.aclose()

    def log_test(self, test_name: str, success: bool, message: str = "", response_time: float = 0):
        """Log hasil test"""
        status = "✅ PASS" if success else "❌ FAIL"
        self.test_results.append({
            "test": test_name,
            "status": success,
            "message": message,
            "response_time": f"{response_time:.2f}s" if response_time > 0 else ""
        })

        if success:
            self.passed += 1
        else:
            self.failed += 1

        print("2d")

    async def test_health_endpoint(self):
        """Test health endpoint"""
        start_time = asyncio.get_event_loop().time()
        try:
            response = await self.client.get("/api/health")
            response_time = asyncio.get_event_loop().time() - start_time

            if response.status_code == 200:
                data = response.json()
                services_status = {
                    "ai_service": data.get("ai_service_available"),
                    "mongo": data.get("mongo_available"),
                    "sentry": data.get("sentry_available")
                }

                info = f"Status: {data.get('status')}, AI: {services_status['ai_service']}, MongoDB: {services_status['mongo']}, Sentry: {services_status['sentry']}"
                self.log_test("Health Check", True, info, response_time)
                return services_status
            else:
                self.log_test("Health Check", False, f"Status code: {response.status_code}", response_time)

        except Exception as e:
            response_time = asyncio.get_event_loop().time() - start_time
            self.log_test("Health Check", False, str(e), response_time)

        return {}

    async def test_consultation_flow(self):
        """Test AI consultation flow"""
        start_time = asyncio.get_event_loop().time()
        try:
            payload = {
                "query": "Apa yang harus saya lakukan jika mendapat surat peringatan dari bank karena kredit macet?",
                "session_id": f"test_session_{datetime.now().isoformat()}"
            }

            response = await self.client.post("/api/consult", json=payload)
            response_time = asyncio.get_event_loop().time() - start_time

            if response.status_code == 200:
                data = response.json()

                # Validasi response structure
                required_fields = ["session_id", "response", "citations", "model", "disclaimer"]
                missing_fields = [field for field in required_fields if field not in data]

                if not missing_fields:
                    response_length = len(data.get("response", ""))
                    citations_count = len(data.get("citations", []))

                    info = f"Response length: {response_length} chars, Citations: {citations_count}, Model: {data.get('model')}"
                    self.log_test("AI Consultation", True, info, response_time)
                    return data
                else:
                    self.log_test("AI Consultation", False, f"Missing fields: {missing_fields}", response_time)
            else:
                error_data = response.json() if response.headers.get('content-type') == 'application/json' else response.text
                self.log_test("AI Consultation", False, f"Status: {response.status_code}, Error: {error_data}", response_time)

        except Exception as e:
            response_time = asyncio.get_event_loop().time() - start_time
            self.log_test("AI Consultation", False, str(e), response_time)

        return {}

    async def test_structured_consultation(self):
        """Test structured consultation flow"""
        start_time = asyncio.get_event_loop().time()
        try:
            # Step 1: Initiate
            payload = {
                "problem_description": "Saya diputus kontrak kerja tanpa alasan yang jelas dan tidak mendapat pesangon."
            }

            response = await self.client.post("/api/structured-consult/initiate", json=payload)
            response_time = asyncio.get_event_loop().time() - start_time

            if response.status_code == 200:
                data = response.json()

                # Check required fields
                if all(key in data for key in ["session_id", "ai_greeting", "problem_classification"]):
                    classification = data.get("problem_classification", {})
                    category = classification.get("category", "Unknown")

                    info = f"Initiated session: {data['session_id']}, Category: {category}"
                    self.log_test("Structured Consultation Initiation", True, info, response_time)
                    return data
                else:
                    self.log_test("Structured Consultation Initiation", False, "Missing required fields", response_time)
            else:
                self.log_test("Structured Consultation Initiation", False, f"Status: {response.status_code}")

        except Exception as e:
            response_time = asyncio.get_event_loop().time() - start_time
            self.log_test("Structured Consultation Initiation", False, str(e), response_time)

        return {}

    async def test_subscription_plans(self):
        """Test subscription plans endpoint"""
        start_time = asyncio.get_event_loop().time()
        try:
            response = await self.client.get("/api/payments/subscription-plans")
            response_time = asyncio.get_event_loop().time() - start_time

            if response.status_code == 200:
                data = response.json()

                if "plans" in data and isinstance(data["plans"], list):
                    plan_count = len(data["plans"])

                    # Check if plans have required fields
                    plan_fields_check = all(
                        all(field in plan for field in ["id", "name", "price", "currency", "interval", "description"])
                        for plan in data["plans"]
                    )

                    if plan_fields_check:
                        plan_names = [p["name"] for p in data["plans"]]
                        info = f"Plans loaded: {plan_count} plans ({', '.join(plan_names[:3])})"
                        self.log_test("Subscription Plans", True, info, response_time)
                        return data
                    else:
                        self.log_test("Subscription Plans", False, "Plans missing required fields", response_time)
                else:
                    self.log_test("Subscription Plans", False, "Invalid response structure", response_time)
            else:
                self.log_test("Subscription Plans", False, f"Status: {response.status_code}", response_time)

        except Exception as e:
            response_time = asyncio.get_event_loop().time() - start_time
            self.log_test("Subscription Plans", False, str(e), response_time)

        return {}

    async def test_payment_intent_creation(self):
        """Test payment intent creation (simulated - no real payment)"""
        start_time = asyncio.get_event_loop().time()
        try:
            # Use test payment amount
            payload = {
                "amount": 2500,  # $25.00
                "currency": "usd",
                "description": "Test Legal Consultation Payment",
                "metadata": {"test": "true", "integration_test": "v1"}
            }

            response = await self.client.post("/api/payments/create-payment-intent", json=payload)
            response_time = asyncio.get_event_loop().time() - start_time

            if response.status_code == 200:
                data = response.json()

                # Check required payment intent fields
                required_fields = ["client_secret", "payment_intent_id", "amount", "currency"]

                if all(field in data for field in required_fields):
                    amount_match = data.get("amount") == payload["amount"]
                    currency_match = data.get("currency") == payload["currency"]

                    if amount_match and currency_match:
                        info = f"Payment intent created: {data['payment_intent_id'][:20]}..., Amount: ${data['amount']/100}"
                        self.log_test("Payment Intent Creation", True, info, response_time)
                        return data
                    else:
                        self.log_test("Payment Intent Creation", False, "Amount/currency mismatch", response_time)
                else:
                    self.log_test("Payment Intent Creation", False, "Missing required payment fields", response_time)
            else:
                error_msg = ""
                try:
                    error_data = response.json()
                    error_msg = error_data.get("detail", response.text)
                except:
                    error_msg = response.text

                self.log_test("Payment Intent Creation", False, f"Status: {response.status_code}, Error: {error_msg[:100]}", response_time)

        except Exception as e:
            response_time = asyncio.get_event_loop().time() - start_time
            self.log_test("Payment Intent Creation", False, str(e), response_time)

        return {}

    async def test_analytics_endpoints(self):
        """Test analytics endpoints"""
        endpoints_to_test = [
            { "path": "/api/analytics/dashboard-overview?days=7", "name": "Analytics Dashboard" },
            { "path": "/api/analytics/global?days=7", "name": "Global Analytics" },
            { "path": f"/api/analytics/user/{TEST_USER_ID}", "name": "User Analytics" },
        ]

        all_passed = True

        for endpoint in endpoints_to_test:
            start_time = asyncio.get_event_loop().time()
            try:
                response = await self.client.get(endpoint["path"])
                response_time = asyncio.get_event_loop().time() - start_time

                if response.status_code == 200:
                    data = response.json()
                    data_size = len(str(data))

                    info = f"Data loaded: {data_size} chars"
                    self.log_test(f"{endpoint['name']}", True, info, response_time)
                else:
                    self.log_test(f"{endpoint['name']}", False, f"Status: {response.status_code}", response_time)
                    all_passed = False

            except Exception as e:
                response_time = asyncio.get_event_loop().time() - start_time
                self.log_test(f"{endpoint['name']}", False, str(e), response_time)
                all_passed = False

        return all_passed

    async def test_ai_provider_routing(self):
        """Test AI provider routing"""
        providers_to_test = ["byteplus", "groq"]

        for provider in providers_to_test:
            start_time = asyncio.get_event_loop().time()
            try:
                payload = {
                    "query": f"Test query for {provider} provider",
                    "provider": provider,
                    "session_id": f"provider_test_{provider}_{datetime.now().isoformat()}"
                }

                response = await self.client.post("/api/consult", json=payload)
                response_time = asyncio.get_event_loop().time() - start_time

                if response.status_code == 200:
                    data = response.json()
                    used_provider = data.get("metadata", {}).get("ai_provider", "unknown")

                    if used_provider == provider:
                        info = f"Provider {provider} used successfully"
                        self.log_test(f"AI Provider - {provider}", True, info, response_time)
                    else:
                        info = f"Provider mismatch: requested {provider}, got {used_provider}"
                        self.log_test(f"AI Provider - {provider}", False, info, response_time)
                else:
                    self.log_test(f"AI Provider - {provider}", False, f"Status: {response.status_code}", response_time)

            except Exception as e:
                response_time = asyncio.get_event_loop().time() - start_time
                self.log_test(f"AI Provider - {provider}", False, str(e), response_time)

    async def run_all_tests(self):
        """Run semua integration tests"""
        print("\n🚀 Starting Pasalku.ai Integration Tests")
        print("=" * 60)

        # Wait for server to fully start
        await asyncio.sleep(2)

        # Run tests
        services_status = await self.test_health_endpoint()
        await self.test_consultation_flow()
        await self.test_structured_consultation()
        await self.test_subscription_plans()
        await self.test_payment_intent_creation()
        await self.test_analytics_endpoints()
        await self.test_ai_provider_routing()

        # Print summary
        print("\n" + "=" * 60)
        print("📊 TEST SUMMARY"        print("=" * 60)
        print(f"✅ Passed: {self.passed}")
        print(f"❌ Failed: {self.failed}")
        print(f"📈 Total:  {self.passed + self.failed}")
        print(".1f"
        print("\n📋 DETAILED RESULTS:")
        print("=" * 60)

        for result in self.test_results:
            print("<12")

        # Service status overview
        if services_status:
            print(f"\n🔧 SERVICE STATUS:")
            print(f"🤖 AI Service:    {'✅' if services_status.get('ai_service') else '❌'}")
            print(f"🍃 MongoDB:       {'✅' if services_status.get('mongo') else '❌'}")
            print(f"👁️  Sentry:        {'✅' if services_status.get('sentry') else '❌'}")

        return self.failed == 0

async def main():
    """Main test function"""
    try:
        async with IntegrationTester(BASE_URL) as tester:
            success = await tester.run_all_tests()

            if success:
                print("
🎉 ALL TESTS PASSED! Pasalku.ai is ready for deployment."                return 0
            else:
                print("
⚠️  SOME TESTS FAILED. Please review the errors above."                return 1

    except KeyboardInterrupt:
        print("\n⏹️  Tests interrupted by user")
        return 130
    except Exception as e:
        print(f"\n💥 Unexpected error during testing: {e}")
        return 1

if __name__ == "__main__":
    exit_code = asyncio.run(main())
    sys.exit(exit_code)