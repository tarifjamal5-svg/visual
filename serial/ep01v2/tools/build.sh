#!/usr/bin/env bash
# Полная сборка серии: голос -> таймлайн -> звук -> картинка -> MP4.
# bash tools/build.sh [workers]
set -euo pipefail
EP="$(cd "$(dirname "$0")/.." && pwd)"
W="${1:-3}"
cd "$EP"
python3 -I tools/assemble.py "$EP"
node -e "
require('./anim/data.js'); const E=require('./anim/episode.js');
const TL=E.buildTimeline(globalThis.DATA);
require('fs').writeFileSync('audio/cues.json', JSON.stringify({cues:TL.cues, rainAuto:TL.rainAuto, duration:TL.duration}, null, 1));
console.log('cues', TL.cues.length, 'duration', TL.duration.toFixed(2));"
python3 -I tools/mix.py "$EP" audio/cues.json audio/mix.wav
mkdir -p out
node tools/render.js "$EP" out/video_noaudio.mp4 "$W" 30
ffmpeg -v error -y -i out/video_noaudio.mp4 -i audio/mix.wav -map 0:v -map 1:a \
  -c:v libx264 -preset slow -crf 19 -maxrate 6M -bufsize 12M -profile:v high -level 4.2 -pix_fmt yuv420p -g 60 -r 30 \
  -c:a aac -b:a 192k -ar 44100 -shortest -movflags +faststart out/presledovatel_s01e01_nas_dvoe.mp4
rm -rf out/video_noaudio.mp4.parts
ffprobe -v error -show_entries stream=codec_name,width,height,r_frame_rate:format=duration -of compact out/presledovatel_s01e01_nas_dvoe.mp4
