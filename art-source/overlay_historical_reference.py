"""Make a fixed, labeled photo/render overlay for a face-model review.

Example:
  python art-source/overlay_historical_reference.py \
    --photo .tools/reference/hitler-1938.jpg \
    --render docs/evidence/hitler-face-20261007/r15-front.png \
    --out docs/evidence/hitler-face-20261007/overlay-r15-front.jpg

The crop and alignment describe the 1938 Bundesarchiv portrait and the fixed
Blender front camera. They are visual comparison aids, not facial measurement.
"""
import argparse
from PIL import Image, ImageDraw, ImageFont

PANEL = (320, 376)
PHOTO_CROP = (164, 15, 300, 172)
MODEL_CROP = (186, 110, 455, 420)
OPACITY = 0.48


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--photo", required=True)
    parser.add_argument("--render", required=True)
    parser.add_argument("--out", required=True)
    args = parser.parse_args()

    photo = Image.open(args.photo).convert("RGB").crop(PHOTO_CROP)
    model = Image.open(args.render).convert("RGB").crop(MODEL_CROP)
    photo = photo.resize(PANEL, Image.Resampling.LANCZOS)
    model = model.resize(PANEL, Image.Resampling.LANCZOS)
    overlay = Image.blend(photo, model, OPACITY)

    plate = Image.new("RGB", (PANEL[0] * 3, PANEL[1] + 42), "#20252c")
    plate.paste(photo, (0, 42)); plate.paste(overlay, (PANEL[0], 42)); plate.paste(model, (PANEL[0] * 2, 42))
    draw = ImageDraw.Draw(plate)
    font = ImageFont.load_default(size=18)
    for x, label in [(0, "Bundesarchiv · 1938"), (PANEL[0], "48% Overlay"), (PANEL[0] * 2, "Blender render")]:
        draw.text((x + 12, 12), label, fill="#f0f3f6", font=font)
    plate.save(args.out, quality=92, optimize=True)


if __name__ == "__main__":
    main()
