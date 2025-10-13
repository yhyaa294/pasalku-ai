"""
Script untuk menemukan triple-quote yang tidak seimbang
"""
import sys
import io

# Fix Windows console encoding
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

with open('services/ai_service.py', 'r', encoding='utf-8') as f:
    lines = f.readlines()

in_triple_quote = False
triple_quote_start = None
quote_type = None

print("Scanning for triple-quote blocks...\n")

for i, line in enumerate(lines, 1):
    # Check for triple quotes
    if '"""' in line:
        count = line.count('"""')
        if count == 1:
            if not in_triple_quote:
                in_triple_quote = True
                triple_quote_start = i
                quote_type = '"""'
                print(f"[OK] Line {i}: Triple-quote OPENED")
            else:
                in_triple_quote = False
                print(f"[OK] Line {i}: Triple-quote CLOSED (started at {triple_quote_start})")
                triple_quote_start = None
        elif count == 2:
            # Inline docstring
            print(f"[OK] Line {i}: Inline triple-quote (self-closing)")
        elif count > 2:
            print(f"[WARN] Line {i}: MULTIPLE triple-quotes ({count}) - potential issue!")
    
    # Show context if we're near problem area
    if 1765 <= i <= 1786:
        status = "OPEN" if in_triple_quote else "CLOSED"
        print(f"  [{status}] Line {i}: {line.rstrip()[:80]}")

if in_triple_quote:
    print(f"\n[ERROR] FOUND ISSUE: Triple-quote opened at line {triple_quote_start} but never closed!")
else:
    print(f"\n[SUCCESS] All triple-quotes are balanced")
