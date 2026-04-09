#!/bin/bash
# Build all HAIF PDF resources from Typst source files
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
SITE_DIR="$(dirname "$SCRIPT_DIR")"
SRC_DIR="$SITE_DIR/src/pdfs"
OUT_DIR="$SITE_DIR/public/downloads"

mkdir -p "$OUT_DIR"

echo "Building HAIF PDFs..."
count=0
for typ_file in "$SRC_DIR"/*.typ; do
  # Skip the template file
  [[ "$(basename "$typ_file")" == "haif-template.typ" ]] && continue

  pdf_name="$(basename "${typ_file%.typ}").pdf"
  echo "  $pdf_name"
  typst compile "$typ_file" "$OUT_DIR/$pdf_name"
  count=$((count + 1))
done

echo "Done. $count PDFs built in $OUT_DIR/"
