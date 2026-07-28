import py_compile
import os

failed = []
for root, _, files in os.walk('app'):
    for file in files:
        if file.endswith('.py'):
            path = os.path.join(root, file)
            try:
                py_compile.compile(path, doraise=True)
            except Exception as e:
                failed.append((path, str(e)))

if failed:
    print("Compilation failed for:")
    for f, err in failed:
        print(f"{f}: {err}")
else:
    print("All files compiled successfully.")
