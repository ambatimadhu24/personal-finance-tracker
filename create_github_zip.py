import os
import zipfile
from pathlib import Path

root = Path(__file__).resolve().parent
zip_path = root / "personal-finance-tracker-github.zip"
exclude_dirs = {"node_modules", "venv", ".venv", "__pycache__", ".git", "dist"}
exclude_files = {"db.sqlite3", ".env", "package-lock.json"}

with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED) as zf:
    for dirpath, dirnames, filenames in os.walk(root):
        rel_dir = Path(dirpath).relative_to(root)
        dirnames[:] = [d for d in dirnames if d not in exclude_dirs]
        for filename in filenames:
            if filename in exclude_files or filename.endswith(".pyc"):
                continue
            path = Path(dirpath) / filename
            if path == zip_path:
                continue
            zf.write(path, path.relative_to(root))

print(f"created {zip_path}")
