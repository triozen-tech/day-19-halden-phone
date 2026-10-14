"""Paint out the Veo ✦ star (bottom right of every Veo clip), frame by frame.

RUN (from the repo root, cutout venv has numpy + scipy):
  .venv-cutout/bin/python scripts/clean_mark_video.py <in.mp4> <out.mp4> [--spot cx,cy,a,d] [--no-guard]
Same method as scripts/clean_mark.py (frequency separation): the low-frequency colour comes from a normalised
blur of the pixels AROUND the star (the star itself excluded), the fine texture is borrowed from a patch
~140 px away and added back, feathered at the edge. No flat fill, no blur patch.
The star is a 4-point astroid (concave sides). The mask is the star plus d px; a = tip radius.
Spots (fixed position in every clip of a resolution):  1920x1080: 1740.5,900.5,36.5,5   1280x720: 1159.5,599.5,24.5,4
The star is a ~28% white overlay (the phone shows through it): orig = S*bg + B per channel (fitted on wall + blue-phone frames).
Guard: when an edge crosses the star (a phone passing by) a blur fill would smear it, so the inside of the star is UN-BLENDED
(bg = (orig - c*B) / (1 - c*(1-S)) with c = the overlay coverage per pixel, rim and anti-aliased fringe included, recovers the real
edge/shadow underneath), then a rim/fringe band is filled edge-aware (Telea) and a flat-area level correction removes
the per-frame drift of the fitted overlay. Plain frames keep the frequency-separation fill above.
Encodes H.264 crf 12, yuv420p, same fps, no audio."""
import subprocess, sys
import numpy as np
from scipy import ndimage as ndi

SPOTS = {1080: (1740.5, 900.5, 36.5, 5.0), 720: (1159.5, 599.5, 24.5, 4.0)}
# star overlay fit, per channel RGB: orig = SLOPE * bg + OFFSET (0..255 scale)
SLOPE = np.array([0.713, 0.716, 0.735], np.float32)
OFFSET = np.array([73.7, 72.7, 70.1], np.float32) / 255
# overlay coverage vs signed distance to the star edge (negative = inside), measured on wall frames
COV_SD = np.array([-30, -4.5, -3.5, -2.5, -1.5, -0.5, 0.5, 1.5, 2.5, 3.5, 4.5, 8], np.float32)
COV_C = np.array([1.0, 1.0, 0.98, 1.0, 1.1, 1.08, 0.9, 0.55, 0.12, 0.0, 0.0, 0.0], np.float32)
EDGE_THR = 0.03   # max gradient (per px, 0..1 scale) around the star above which the un-blend path is used


def _box(a, k, axis):
    pad = k // 2; w = [(0, 0)] * a.ndim; w[axis] = (pad + 1, pad)
    c = np.cumsum(np.pad(a, w, mode="edge"), axis=axis, dtype=np.float64)
    return ((np.take(c, np.arange(k, c.shape[axis]), axis=axis) - np.take(c, np.arange(0, c.shape[axis] - k), axis=axis)) / k).astype(np.float32)


def blur(a, s):
    k = max(1, int(round(np.sqrt(4 * s * s + 1)))) | 1
    for ax in (0, 1):
        for _ in range(3):
            a = _box(a, k, ax)
    return a


def star_masks(cx, cy, a, d, x0, y0, w, h):
    yy, xx = np.mgrid[y0:y0 + h, x0:x0 + w].astype(np.float32)
    core = (np.abs(xx - cx) / a) ** (2 / 3) + (np.abs(yy - cy) / a) ** (2 / 3) <= 1
    dist = ndi.distance_transform_edt(~core)
    return core, dist <= d


def paint(frame, spot, win, guard=True, info=None):
    """frame: HxWx3 uint8. Returns a painted copy (only the window around the star changes)."""
    cx, cy, a, d = spot
    H, W, _ = frame.shape
    x0, y0, x1, y1 = win
    w, h = x1 - x0, y1 - y0
    src = frame[y0:y1, x0:x1].astype(np.float32) / 255
    core, mark = star_masks(cx, cy, a, d, x0, y0, w, h)
    mark = mark.astype(np.float32)
    keep = 1 - mark
    smooth = blur(src * keep[..., None], 30) / np.maximum(blur(keep, 30), 1e-4)[..., None]

    tex_full = src - blur(src, 4)
    ys, xs = np.nonzero(mark > 0)
    cands = [(140, 0), (0, 140), (100, 100), (100, -100)] if guard else [(140, 0)]
    best = None
    for dx, dy in cands:                                    # take texture from (x-dx, y-dy)
        if xs.min() - dx < 0 or ys.min() - dy < 0 or xs.max() - dx >= w or ys.max() - dy >= h:
            continue
        patch = tex_full[ys - dy, xs - dx]
        e = float(np.abs(patch).mean())
        if best is None or e < best[0]:
            best = (e, dx, dy)
    e, dx, dy = best
    texture = np.roll(tex_full, (dy, dx), axis=(0, 1))

    # how busy is the ring around the star? (low-pass residual after a plane fit)
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    r = np.hypot(xx - (cx - x0), yy - (cy - y0))
    ring = (r > a + d + 6) & (r < a + d + 40)
    lp = blur(src.mean(axis=2), 2)
    A = np.stack([xx[ring], yy[ring], np.ones(ring.sum(), np.float32)], 1)
    coef, *_ = np.linalg.lstsq(A, lp[ring], rcond=None)
    resid = float(np.sqrt(np.mean((lp[ring] - A @ coef) ** 2)))
    if info is not None:
        info.update(resid=resid, tex=(dx, dy), tex_e=e)

    gy, gx = np.gradient(blur(src.mean(axis=2), 1.5))
    g = np.hypot(gx, gy)
    edge = float(np.percentile(g[(r > a + d + 4) & (r < a + d + 45)], 99.7))
    if info is not None:
        info.update(edge=edge)
    if guard and (edge > EDGE_THR or guard == 'force'):                           # an edge / object crosses the star area
        # coverage c of the overlay per pixel from the signed distance to the star edge (profile measured on the wall:
        # flat inside, rim stroke ~1.1, anti-aliased fringe 0.7 / 0.2 outside), then orig = (1 - c(1-S)) * bg + c * B
        sd = ndi.distance_transform_edt(~core) - ndi.distance_transform_edt(core)
        c = np.interp(sd, COV_SD, COV_C).astype(np.float32)
        c[sd > COV_SD[-1]] = 0
        c = c[..., None]
        work = np.clip((src - c * OFFSET) / (1 - c * (1 - SLOPE)), 0, 1)
        # what is left is the rim stroke + fringe, a ~5 px band along the star edge: fill it edge-aware (Telea) + texture
        import cv2
        band = (sd > -4.5) & (sd < d + 0.5)
        b8 = (band * 255).astype(np.uint8)
        base = cv2.inpaint((work * 255 + 0.5).astype(np.uint8), b8, 4, cv2.INPAINT_TELEA).astype(np.float32) / 255
        fill = base + texture * 0.4
        feather = np.clip(blur(band.astype(np.float32), 0.8) * 1.4, 0, 1)[..., None]
        out = work * (1 - feather) + fill * feather
        # the un-blend sits a few levels off the true background (it varies per frame): measure that offset only where the
        # un-blended interior is flat, spread it smoothly (normalised blur) and subtract it; real edges are left untouched
        inner = (sd < d + 1.0).astype(np.float32)
        gw = np.hypot(*np.gradient(blur(out.mean(axis=2), 1.5)))
        gs = np.hypot(*np.gradient(blur(smooth.mean(axis=2), 1.5)))
        ok = (inner * (gw < 0.012) * (gs < 0.004) * (np.abs(smooth - out).max(axis=2) < 0.035)).astype(np.float32)
        if ok.sum() > 150:
            delta = (smooth - out) * ok[..., None]
            delta = blur(delta, 7) / np.maximum(blur(ok, 7), 1e-3)[..., None]
            wgt = np.clip(blur(ok, 7) * 3, 0, 1)[..., None]
            out = out + delta * wgt * np.clip(blur(inner, 1.5), 0, 1)[..., None]
    else:
        fill = smooth + texture * 0.8
        feather = np.clip(blur(mark, 5) * 1.6, 0, 1)[..., None]
        out = src * (1 - feather) + fill * feather
    res = frame.copy()
    res[y0:y1, x0:x1] = np.clip(out * 255 + 0.5, 0, 255).astype(np.uint8)
    return res


def probe(path):
    o = subprocess.check_output(["ffprobe", "-v", "error", "-select_streams", "v", "-show_entries",
                                 "stream=width,height,r_frame_rate", "-of", "csv=p=0", path]).decode().strip().split(",")
    return int(o[0]), int(o[1]), o[2]


def run(src, dst, spot=None, guard=True, log=None):
    W, H, fps = probe(src)
    spot = spot or SPOTS[H]
    cx, cy, a, d = spot
    half = int(a + d + 150)
    win = (max(0, int(cx) - half), max(0, int(cy) - half), min(W, int(cx) + half), min(H, int(cy) + half))
    rd = subprocess.Popen(["ffmpeg", "-v", "error", "-i", src, "-f", "rawvideo", "-pix_fmt", "rgb24", "-"], stdout=subprocess.PIPE)
    wr = subprocess.Popen(["ffmpeg", "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}", "-r", fps, "-i", "-",
                           "-c:v", "libx264", "-crf", "12", "-preset", "slow", "-pix_fmt", "yuv420p", "-movflags", "+faststart", dst],
                          stdin=subprocess.PIPE)
    n = W * H * 3; i = 0
    while True:
        b = rd.stdout.read(n)
        if len(b) < n:
            break
        fr = np.frombuffer(b, np.uint8).reshape(H, W, 3)
        info = {}
        out = paint(fr, spot, win, guard, info)
        if log is not None:
            log.append((i, info))
        wr.stdin.write(out.tobytes()); i += 1
    wr.stdin.close(); wr.wait(); rd.wait()
    return i


if __name__ == "__main__":
    args = sys.argv[1:]
    spot = None; guard = True
    if "--spot" in args:
        j = args.index("--spot"); spot = tuple(float(v) for v in args[j + 1].split(",")); del args[j:j + 2]
    if "--no-guard" in args:
        args.remove("--no-guard"); guard = False
    log = []
    n = run(args[0], args[1], spot, guard, log)
    busy = [i for i, f in log if f["edge"] > EDGE_THR]
    print(f"{args[1]}: {n} frames, busy frames (edge near star): {len(busy)}" + (f" {busy[0]}-{busy[-1]}" if busy else ""))
