import os
import base64
import uuid

def save_base64_image_to_public(base64_str, ext="png"):
    public_dir = os.path.join(os.path.dirname(__file__), "public")
    os.makedirs(public_dir, exist_ok=True)

    filename = f"gen_{uuid.uuid4().hex}.{ext}"
    filepath = os.path.join(public_dir, filename)

    if base64_str.startswith("data:image"):
        base64_str = base64_str.split(",")[1]

    with open(filepath, "wb") as f:
        f.write(base64.b64decode(base64_str))

    return f"/public/{filename}"