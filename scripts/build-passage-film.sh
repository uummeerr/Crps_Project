#!/usr/bin/env bash
# Builds the frames for the scroll film behind the lower half of the home page
# (components/passage/Passage.js). Run it again only when the film changes.
#
#   usage: scripts/build-passage-film.sh <ffmpeg> <footage-dir> [work-dir]
#   e.g.   scripts/build-passage-film.sh ffmpeg ~/footage /tmp/passage
#
# It writes public/passage/d/ (landscape, 1600x900) and public/passage/m/
# (portrait, 720x1280): numbered .webp frames, a poster.jpg, and prints the
# frame counts to copy into FILMS in components/passage/Passage.js.
#
# <footage-dir> must hold the source clips, each downloaded from Pexels
# (https://www.pexels.com/video/<id>/, "Free download", original size):
#   7089596.mp4  MRI scanner seen from the side      (3840x2160)
#   7088517.mp4  facing the scanner tunnel           (3840x2160)
#   29184317.mp4 signals along a nerve network       (1920x1080)
#   32333921.mp4 glowing fibre-optic strands         (3840x2160)
# The X-ray of the stimulator leads is already in public/images/stock/.
# Credits for all of these are in src/content/stock.js.
#
# The film, 29.4 s at 25 frames a second:
#   A  0.0  the scanner from the side
#   B  5.2  facing the tunnel, moving in until the opening fills the screen
#   X 11.6  the X-ray, travelling up the stimulator leads
#   C 14.9  signals travelling along nerve fibres
#   E 22.4  glowing fibres, the calm ending
# ACTS in Passage.js relies on B ending at about 12.2 s; change both together.
set -euo pipefail
FF="$1"; SRC="$2"; TMP="${3:-/tmp/passage-film}"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
XRAY="$ROOT/public/images/stock/scs-xray.jpg"
ENC="-an -c:v libx264 -preset fast -crf 14 -pix_fmt yuv420p -r 25"
# Colour grades that pull every clip toward the site's dark teal.
MRI="eq=contrast=1.14:brightness=-0.11:saturation=0.45,colorbalance=rs=-0.16:gs=0.02:bs=0.10:rm=-0.14:gm=0.03:bm=0.10:rh=-0.06:gh=0.01:bh=0.05"
TEAL="colorbalance=rs=-0.22:gs=0.06:bs=0.08:rm=-0.2:gm=0.08:bm=0.1:rh=-0.1:gh=0.04:bh=0.04"
FIBRE="hue=s=0,eq=contrast=1.08:brightness=-0.07,colorbalance=rs=-0.3:gs=0.1:bs=0.05:rm=-0.25:gm=0.12:bm=0.08:rh=-0.12:gh=0.08:bh=0.02"

# build <name> <width> <height> <frames-per-second> <webp-quality> <crops...>
# The crops cut each source to the output's shape before it is scaled; the
# tunnel shot also needs the point to move toward (as a fraction of its crop).
build() {
  local name="$1" W="$2" H="$3" FPS="$4" Q="$5" cropA="$6" cropB="$7" aimB="$8" cropX="$9" cropC="${10}" cropE="${11}"
  local T="$TMP/$name" OUT="$ROOT/public/passage/$name"
  mkdir -p "$T"; rm -rf "$OUT"; mkdir -p "$OUT"
  local run=("$FF" -hide_banner -loglevel error -y)

  "${run[@]}" -ss 0.5 -t 6 -i "$SRC/7089596.mp4" -vf "fps=25,$cropA,scale=$W:$H,$MRI" $ENC "$T/a.mp4"
  "${run[@]}" -i "$SRC/7088517.mp4" -vf "fps=25,$cropB,zoompan=z='1+2.7*pow(on/185,2)':x='iw*${aimB%,*}-(iw/zoom/2)':y='ih*${aimB#*,}-(ih/zoom/2)':d=1:s=${W}x${H}:fps=25,$MRI" $ENC "$T/b.mp4"
  "${run[@]}" -loop 1 -t 4.5 -i "$XRAY" -vf "fps=25,$cropX,scale=$W:$H:flags=lanczos,hue=s=0,eq=contrast=1.2:brightness=-0.08,$TEAL" $ENC "$T/x.mp4"
  "${run[@]}" -t 9 -i "$SRC/29184317.mp4" -vf "fps=25,$cropC,scale=$W:$H,hue=h=165:s=0.85" $ENC "$T/c.mp4"
  "${run[@]}" -t 7 -i "$SRC/32333921.mp4" -vf "fps=25,$cropE,scale=$W:$H,$FIBRE" $ENC "$T/e.mp4"

  "${run[@]}" -i "$T/a.mp4" -i "$T/b.mp4" -i "$T/x.mp4" -i "$T/c.mp4" -i "$T/e.mp4" -filter_complex \
    "[0][1]xfade=transition=fade:duration=0.8:offset=5.2[ab];[ab][2]xfade=transition=fadeblack:duration=1.0:offset=11.64[abx];[abx][3]xfade=transition=fade:duration=1.2:offset=14.94[abxc];[abxc][4]xfade=transition=fade:duration=1.5:offset=22.44[v]" \
    -map "[v]" $ENC "$T/film.mp4"

  "${run[@]}" -i "$T/film.mp4" -vf "fps=$FPS" -c:v libwebp -quality "$Q" -compression_level 6 -start_number 0 "$OUT/%04d.webp"
  "${run[@]}" -i "$T/film.mp4" -frames:v 1 -q:v 4 "$OUT/poster.jpg"
  echo "$name: $(ls "$OUT"/*.webp | wc -l) frames, $(du -sh "$OUT" | cut -f1)"
}

# Landscape. The X-ray pans upward: the crop's y runs from 600 to 150.
build d 1600 900 10 58 \
  "null" "null" "0.405,0.47" \
  "crop=900:506:33:'600-450*((t/4.5)*(t/4.5)*(3-2*t/4.5))'" "null" "null"

# Portrait: each clip is cut to 9:16 around its subject first.
build m 720 1280 6 52 \
  "crop=1215:2160:1082:0" "crop=1215:2160:948:0" "0.5,0.47" \
  "crop=540:960:210:'400-340*((t/4.5)*(t/4.5)*(3-2*t/4.5))'" "crop=608:1080:656:0" "crop=1215:2160:1312:0"
