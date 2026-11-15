"""Переводит тайминги слов из распознавания ElevenLabs (Scribe) в формат *_words.json.
Теги вида [pause] выбрасываются, слова раскладываются по фразам сценария по порядку.

python3 -I scribe_words.py scribe.json units.json out.json
units.json: список фраз (строки или {"text": ...}).
"""
import json, sys

src, units_path, out = sys.argv[1:4]
sw = [w for w in json.load(open(src, encoding='utf-8'))['words']
      if w.get('type', 'word') == 'word' and not w['text'].startswith('[') and not w['text'].endswith(']')]
units = [u['text'] if isinstance(u, dict) else u for u in json.load(open(units_path, encoding='utf-8'))]
norm = lambda s: s.lower().replace('́', '').strip('.,:;!?…«»" ')
words, spans, i = [], [], 0
for ui, u in enumerate(units):
    toks = u.split()
    first = i
    for tok in toks:
        w = sw[i]
        if norm(w['text']) != norm(tok):
            sys.exit(f'расхождение: фраза {ui} ждём «{tok}», в распознавании «{w["text"]}»')
        words.append({'w': tok, 'start': round(w['start'], 3), 'end': round(w['end'], 3), 'unit': ui})
        i += 1
    spans.append({'text': u, 'start': words[first]['start'], 'end': words[-1]['end']})
if i != len(sw):
    sys.exit(f'лишние слова в распознавании: {[w["text"] for w in sw[i:]]}')
json.dump({'units': spans, 'words': words}, open(out, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print('ok', len(words), 'слов,', len(units), 'фраз')
