"""Split MVTT transcript into three topic files with filtering."""
import re

INPUT = "conversation_2026_06_04.mvtt"

# Pure filler patterns — lines that are ONLY filler with no substance
FILLER_PATTERNS = [
    r'^(DW|ZZ):\s*Yeah[,.]?\s*$',
    r'^(DW|ZZ):\s*Yeah,\s*yeah[,.]?\s*$',
    r'^(DW|ZZ):\s*Yeah,\s*yeah,\s*yeah[,.]?\s*$',
    r'^(DW|ZZ):\s*Yes[,.]?\s*$',
    r'^(DW|ZZ):\s*Exactly[,.]?\s*$',
    r'^(DW|ZZ):\s*Uh[,.]?\s*$',
    r'^(DW|ZZ):\s*Um[,.]?\s*$',
    r'^(DW|ZZ):\s*Yeah,\s*$',
    r'^(DW|ZZ):\s*No[,.]?\s*$',
    r"^(DW|ZZ):\s*That's\s*$",
]

def is_filler(line):
    for pat in FILLER_PATTERNS:
        if re.match(pat, line.strip()):
            return True
    return False

def is_s3_to_s8(line):
    return bool(re.match(r'^S[3-8]:', line.strip()))

def relabel(line):
    line = re.sub(r'^S1:', 'DW:', line)
    line = re.sub(r'^S2:', 'ZZ:', line)
    return line

# Read transcript lines (skip header)
with open(INPUT, 'r') as f:
    all_lines = f.readlines()

# Find where ## TRANSCRIPT starts
transcript_start = None
for i, line in enumerate(all_lines):
    if line.strip() == '## TRANSCRIPT':
        transcript_start = i + 1
        break

raw_lines = all_lines[transcript_start:]

# Process: drop S3-S8, relabel, strip filler
processed = []
for line in raw_lines:
    stripped = line.strip()
    if not stripped:
        continue
    if is_s3_to_s8(stripped):
        continue
    relabeled = relabel(stripped)
    if is_filler(relabeled):
        continue
    processed.append(relabeled)

# Number the processed lines for splitting reference
# Original MVTT line numbers mapped to processed indices
# HAIF: original lines 17-394 (index 0 to ~377 in raw_lines)
# Overlap: original lines 395-415
# How We Live: original lines 395-462
# Misc: original lines 463-end

# We need to map original line numbers to processed lines
# Let's track which original line each processed line came from
processed_with_orig = []
for i, line in enumerate(raw_lines):
    stripped = line.strip()
    if not stripped:
        continue
    if is_s3_to_s8(stripped):
        continue
    relabeled = relabel(stripped)
    if is_filler(relabeled):
        continue
    orig_line_num = transcript_start + 1 + i  # 1-indexed line number in original file
    processed_with_orig.append((orig_line_num, relabeled))

# Split by original line numbers
haif_lines = [text for orig, text in processed_with_orig if orig <= 415]
howwelive_lines = [text for orig, text in processed_with_orig if 395 <= orig <= 462]
misc_lines = [text for orig, text in processed_with_orig if orig >= 463]

print(f"HAIF: {len(haif_lines)} lines")
print(f"How We Live: {len(howwelive_lines)} lines")
print(f"Misc: {len(misc_lines)} lines")
print(f"Total processed (no filler, no S3-S8): {len(processed_with_orig)}")

# Write raw splits (headers will be added separately)
def write_mvtt(filename, lines, legend, header_comment):
    with open(filename, 'w') as f:
        f.write("# MVTT - Minified VTT Transcript\n")
        f.write(f"# Source: conversation_2026_06_04.md\n")
        f.write(f"# Topic: {header_comment}\n")
        f.write(f"# Entries: {len(lines)}\n")
        f.write(f"# Generated: 2026-04-06\n")
        f.write("\n")
        f.write("## LEGEND\n")
        for code, name in legend:
            f.write(f"{code}: {name}\n")
        f.write("\n")
        f.write("## KEY POINTS\n")
        f.write("(to be filled)\n")
        f.write("\n")
        f.write("## TRANSCRIPT\n")
        for line in lines:
            f.write(line + "\n")

legend = [("DW", "Dennis Wollersheim"), ("ZZ", "Zhen Zheng")]

write_mvtt("haif_discussion.mvtt", haif_lines, legend,
           "HAIF - Hospital Acupuncture Implementation Framework")
write_mvtt("how-we-live_discussion.mvtt", howwelive_lines, legend,
           "How We Live - Podcast Concept")
write_mvtt("misc_discussion.mvtt", misc_lines, legend,
           "Miscellaneous - Personal Chat")

print("\nFiles written:")
for f in ["haif_discussion.mvtt", "how-we-live_discussion.mvtt", "misc_discussion.mvtt"]:
    import os
    size = os.path.getsize(f)
    print(f"  {f}: {size} bytes")
