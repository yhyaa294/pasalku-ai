"""Show exact lines around problem area"""
with open('services/ai_service.py', 'r', encoding='utf-8') as f:
    lines = f.readlines()

print("Lines 1710-1730:")
for i in range(1709, min(1730, len(lines))):
    print(f"{i+1:4d}: {lines[i]}", end='')
