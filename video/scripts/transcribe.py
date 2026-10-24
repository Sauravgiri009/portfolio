# Run on your Mac:  pip install faster-whisper && python3 scripts/transcribe.py
# Writes vo_words.txt (start, end, word) so supers can be synced to the VO exactly.
from faster_whisper import WhisperModel

m = WhisperModel("small", device="cpu", compute_type="int8")
segs, _ = m.transcribe("public/vo.mp3", language="hi", word_timestamps=True)
with open("vo_words.txt", "w") as f:
    for seg in segs:
        for w in seg.words:
            f.write(f"{w.start:.2f}\t{w.end:.2f}\t{w.word.strip()}\n")
print("wrote vo_words.txt")
