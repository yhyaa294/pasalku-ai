"""
Script untuk fix syntax error di ai_service.py
Fix unterminated triple-quote string literal
"""

import re

# Read the file
with open('services/ai_service.py', 'r', encoding='utf-8') as f:
    content = f.read()

# Backup original
with open('services/ai_service.py.backup', 'w', encoding='utf-8') as f:
    f.write(content)

# Fix pattern 1: f-string dengan triple quotes yang kompleks
# Ganti pola f""" ... {var} ... """ dengan string concatenation

# Fix area sekitar line 1140-1145 (full_context)
pattern1 = r'full_context = f"""[\s\S]*?{legal_query}{context_docs_str}[\s\S]*?"""'
replacement1 = '''full_context = """
        KONSULTASI HUKUM STRATEGIC - LEVEL URGENCY: """ + urgency_level.upper() + """

        PERTANYAAN KLIEN:
        """ + legal_query + context_docs_str + """
        """'''

content = re.sub(pattern1, replacement1, content, count=1)

# Fix pattern 2: ark_system_prompt dengan f-string
pattern2 = r'ark_system_prompt = f"""[\s\S]*?{urgency_prompts\[urgency_level\]\["ark"\]}[\s\S]*?}}[\s\S]*?"""'
replacement2 = '''ark_prompt_text = urgency_prompts[urgency_level]["ark"]
        ark_system_prompt = """
        Anda adalah Konsultan Hukum Senior dengan pengalaman 20+ tahun di Indonesia.
        """ + ark_prompt_text + """

        Berikan respons terstruktur dengan format JSON:
        {
            "deep_analysis": "Analisis mendalam tentang kondisi hukum saat ini",
            "risk_assessment": "Penilaian risiko secara detail",
            "legal_opinions": ["Pendapat hukum 1", "Pendapat hukum 2"],
            "recommendations": ["Rekomendasi strategis 1", "Rekomendasi 2"],
            "timeline": "Estimasi timeline dalam minggu/bulan",
            "cost_implications": "Estimasi dampak biaya"
        }
        """'''

content = re.sub(pattern2, replacement2, content, count=1)

# Fix pattern 3: groq_system_prompt dengan f-string
pattern3 = r'groq_system_prompt = f"""[\s\S]*?{urgency_prompts\[urgency_level\]\["groq"\]}[\s\S]*?}}[\s\S]*?"""'
replacement3 = '''groq_prompt_text = urgency_prompts[urgency_level]["groq"]
        groq_system_prompt = """
        Anda adalah Konsultan Hukum Emergency Response Team.
        """ + groq_prompt_text + """

        Berikan respons terstruktur dengan format JSON:
        {
            "quick_assessment": "Assessment cepat 2-3 paragraph",
            "immediate_actions": ["Action 1", "Action 2", "Action 3"],
            "risk_level": "HIGH/MEDIUM/LOW",
            "next_milestone": "Next critical step dalam 24-48 jam",
            "notification_needed": "Orang/institusi yang perlu diberitahu"
        }
        """'''

content = re.sub(pattern3, replacement3, content, count=1)

# Write fixed content
with open('services/ai_service.py', 'w', encoding='utf-8') as f:
    f.write(content)

print("✅ ai_service.py fixed!")
print("✅ Backup saved to services/ai_service.py.backup")
print("\nVerifying syntax...")

# Verify syntax
import ast
try:
    ast.parse(content)
    print("✅ Syntax verification PASSED!")
except SyntaxError as e:
    print(f"❌ Syntax error still exists: {e}")
    print(f"   Line {e.lineno}: {e.text}")
