#!/usr/bin/env python3
# Локальная генерация иллюстраций (SVG) и иконок PWA (PNG).
# Никаких внешних сервисов — работает офлайн.
import os
import struct
import zlib

from characters import CHARACTERS
from backgrounds import BACKGROUNDS

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
IMG = os.path.join(ROOT, "assets", "img")
ICONS = os.path.join(ROOT, "assets", "icons")

OUTLINE = '#4A342A'


def wrap(w, h, body, defs=''):
    return (
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 %d %d" width="%d" height="%d" '
        'preserveAspectRatio="xMidYMid meet">\n<defs>%s</defs>\n'
        '<g stroke="%s" stroke-width="3" stroke-linejoin="round" stroke-linecap="round">%s</g>\n</svg>\n'
        % (w, h, w, h, defs, OUTLINE, body)
    )


# ---------------- ПРЕДМЕТЫ ----------------

def item_svg(inner):
    return wrap(200, 200, '<circle cx="100" cy="100" r="88" fill="#FFF9EC" stroke="#E6CDA6" stroke-width="2"/>' + inner)


ITEMS = {
    'bread': '''<path d="M45 118c0-42 24-70 55-70s55 28 55 70z" fill="#D9A15B"/>
      <path d="M62 82l14-20 M88 70l8-22 M116 76l10-18" stroke="#B9834F" stroke-width="5"/>
      <path d="M45 118h110v18H45z" fill="#C08A57"/>''',
    'milk': '''<path d="M72 55h56l10 95H62z" fill="#FFF6E4"/>
      <path d="M72 55l28-28 28 28z" fill="#BFE0E6"/>
      <path d="M62 108h76v18H62z" fill="#2E6B66"/>
      <circle cx="100" cy="117" r="8" fill="#F2B23E" stroke="none"/>''',
    'apple': '''<path d="M100 68c-14-20-46-12-46 20 0 32 24 54 46 54s46-22 46-54c0-32-32-40-46-20z" fill="#D94F3D"/>
      <path d="M100 68V44" stroke="#8B5A36" stroke-width="7"/>
      <path d="M100 52c18-16 36-8 32 8-16 8-30 2-32-8z" fill="#4F8A5B"/>''',
    'candy': '''<path d="M70 78h60v44H70z" fill="#E07B39"/>
      <path d="M70 78l-24-20v84l24-20 M130 78l24-20v84l-24-20" fill="#F2B23E"/>
      <path d="M86 100h28" stroke="#FFF6E4" stroke-width="6"/>''',
    'toy': '''<circle cx="100" cy="78" r="36" fill="#B9834F"/>
      <circle cx="72" cy="54" r="16" fill="#B9834F"/>
      <circle cx="128" cy="54" r="16" fill="#B9834F"/>
      <circle cx="88" cy="74" r="4" fill="#4A342A" stroke="none"/>
      <circle cx="112" cy="74" r="4" fill="#4A342A" stroke="none"/>
      <path d="M92 90c5 6 11 6 16 0" fill="none" stroke="#4A342A" stroke-width="3"/>
      <path d="M70 110h60l14 48H56z" fill="#C99C6B"/>''',
    'juice': '''<rect x="72" y="52" width="56" height="100" rx="8" fill="#F2B23E"/>
      <rect x="92" y="38" width="16" height="18" rx="4" fill="#FFF6E4"/>
      <circle cx="100" cy="105" r="20" fill="#D94F3D" stroke="none"/>
      <path d="M100 85V72" stroke="#4F8A5B" stroke-width="5"/>''',
    'jacket': '''<path d="M72 62l28-14 28 14 26 30-18 18-12-14v62H76V96l-12 14-18-18z" fill="#E8A33D"/>
      <path d="M100 48v110" stroke="#B9834F" stroke-width="4"/>
      <circle cx="108" cy="86" r="4" fill="#4A342A" stroke="none"/>
      <circle cx="108" cy="112" r="4" fill="#4A342A" stroke="none"/>''',
    'pants': '''<path d="M68 54h64l10 100h-30l-12-58-12 58H58z" fill="#4F6B8A"/>
      <path d="M68 76h64" stroke="#3A5270" stroke-width="5"/>''',
    'boots': '''<path d="M62 50h32v76h32v24H58V50z" fill="#8B5A36"/>
      <path d="M106 50h32v76h-32z" fill="#6B4632"/>
      <path d="M58 142h108v12H58z" fill="#4A342A"/>''',
    'shorts': '''<path d="M66 60h68l6 62H94l-6-30-6 30H60z" fill="#6B8FA3"/>
      <path d="M66 82h68" stroke="#4E7185" stroke-width="5"/>''',
    'skirt': '''<path d="M74 58h52v22l26 66H48l26-66z" fill="#C25B4E"/>
      <path d="M74 80h52" stroke="#9C443A" stroke-width="5"/>''',
    'wallet': '''<rect x="46" y="72" width="108" height="68" rx="12" fill="#8E5A86"/>
      <path d="M46 96h108" stroke="#6E4468" stroke-width="5"/>
      <rect x="112" y="88" width="30" height="16" rx="4" fill="#F2B23E"/>''',
    'keys': '''<circle cx="72" cy="76" r="22" fill="none" stroke="#F2B23E" stroke-width="10"/>
      <path d="M72 98v58h18v-14h14v-16h-32" fill="#F2B23E"/>
      <circle cx="128" cy="86" r="16" fill="none" stroke="#C99C6B" stroke-width="8"/>
      <path d="M128 102v42h14" stroke="#C99C6B" stroke-width="8"/>''',
    'umbrella': '''<path d="M40 100c8-52 32-70 60-70s52 18 60 70z" fill="#2E6B66"/>
      <path d="M100 30v100c0 14 10 22 22 18" fill="none" stroke="#4A342A" stroke-width="6"/>
      <path d="M100 30v70 M60 100c6-30 20-52 40-70 M140 100c-6-30-20-52-40-70" stroke="#F2B23E" stroke-width="3" opacity=".7"/>''',
    'cart': '''<path d="M40 60h20l16 70h76l14-52H72" fill="none" stroke="#2E6B66" stroke-width="9"/>
      <circle cx="88" cy="148" r="12" fill="#4A342A"/>
      <circle cx="144" cy="148" r="12" fill="#4A342A"/>''',
    'basket': '''<path d="M50 86h100l-12 66H62z" fill="#C99C6B"/>
      <path d="M50 86h100 M76 86v66 M100 86v66 M124 86v66" stroke="#A97146" stroke-width="4"/>
      <path d="M76 86c0-30 48-30 48 0" fill="none" stroke="#A97146" stroke-width="7"/>''',
    'bag': '''<path d="M56 76h88l10 82H46z" fill="#B67D4B"/>
      <path d="M76 76c0-26 48-26 48 0" fill="none" stroke="#8B5A36" stroke-width="8"/>''',
    'packet': '''<path d="M54 70h92l-10 90H64z" fill="#FFF6E4"/>
      <path d="M70 70l12-14 M130 70l-12-14" stroke="#E6CDA6" stroke-width="4"/>
      <path d="M76 110h48" stroke="#E6CDA6" stroke-width="4"/>''',
    'money': '''<ellipse cx="100" cy="110" rx="58" ry="30" fill="#F2B23E"/>
      <ellipse cx="100" cy="96" rx="58" ry="30" fill="#FFD173"/>
      <circle cx="100" cy="96" r="14" fill="#E6A93B" stroke="none"/>''',
    'card': '''<rect x="40" y="66" width="120" height="74" rx="10" fill="#2E6B66"/>
      <rect x="54" y="80" width="30" height="20" rx="3" fill="#F2B23E" stroke="none"/>
      <path d="M54 122h60" stroke="#BFE0E6" stroke-width="6"/>''',
    'shop': '''<rect x="40" y="72" width="120" height="90" fill="#F2D7AE"/>
      <path d="M30 72l70-44 70 44z" fill="#E07B39"/>
      <rect x="76" y="108" width="48" height="54" fill="#2E6B66"/>
      <circle cx="60" cy="92" r="12" fill="#D94F3D" stroke="none"/>''',
    'school': '''<rect x="40" y="80" width="120" height="82" fill="#E9C79B"/>
      <path d="M30 80l70-42 70 42z" fill="#C25B4E"/>
      <rect x="62" y="104" width="24" height="24" fill="#BFE0E6"/>
      <rect x="114" y="104" width="24" height="24" fill="#BFE0E6"/>
      <rect x="90" y="130" width="24" height="32" fill="#8B5A36"/>''',
    'hospital': '''<rect x="40" y="80" width="120" height="82" fill="#FFF6E4"/>
      <path d="M30 80l70-42 70 42z" fill="#C25B4E"/>
      <rect x="62" y="104" width="24" height="24" fill="#BFE0E6"/>
      <rect x="114" y="104" width="24" height="24" fill="#BFE0E6"/>
      <path d="M100 108v36 M82 126h36" stroke="#D94F3D" stroke-width="10"/>''',
    'home': '''<path d="M30 98l70-56 70 56z" fill="#B65C25"/>
      <rect x="46" y="98" width="108" height="64" fill="#F2D7AE"/>
      <rect x="86" y="122" width="28" height="40" fill="#8B5A36"/>
      <rect x="56" y="110" width="20" height="20" fill="#BFE0E6"/>
      <rect x="124" y="110" width="20" height="20" fill="#BFE0E6"/>''',
}


# ---------------- ЖЕСТЫ ----------------

GESTURES = {
    'wave': '''<circle cx="100" cy="100" r="78" fill="#FFE9C4"/>
      <path d="M62 130c0-26 16-44 38-44s38 18 38 44z" fill="#E07B39"/>
      <path d="M70 96V62 M86 90V48 M104 90V44 M122 98V64" stroke="#F2C9A0" stroke-width="12"/>
      <path d="M64 136h72" stroke="#B9834F" stroke-width="6"/>''',
    'silence': '''<circle cx="100" cy="100" r="78" fill="#FFE9C4"/>
      <circle cx="100" cy="104" r="44" fill="#F2C9A0"/>
      <path d="M82 92h10 M108 92h10" stroke="#4A342A" stroke-width="5"/>
      <path d="M88 122c8 6 16 6 24 0" fill="none" stroke="#B65C4E" stroke-width="4"/>
      <path d="M100 108v20" stroke="#C25B4E" stroke-width="6"/>''',
    'angry': '''<circle cx="100" cy="100" r="78" fill="#FFE9C4"/>
      <circle cx="100" cy="104" r="44" fill="#F2C9A0"/>
      <path d="M76 84l20 8 M124 84l-20 8" stroke="#4A342A" stroke-width="6"/>
      <circle cx="86" cy="98" r="4" fill="#4A342A" stroke="none"/>
      <circle cx="114" cy="98" r="4" fill="#4A342A" stroke="none"/>
      <path d="M86 126c10-10 18-10 28 0" fill="none" stroke="#B65C4E" stroke-width="5"/>''',
    'check': '''<circle cx="100" cy="100" r="78" fill="#E4F0DD"/>
      <path d="M56 104l30 30 60-66" fill="none" stroke="#4F8A5B" stroke-width="18"/>''',
    'cross': '''<circle cx="100" cy="100" r="78" fill="#FBE4DF"/>
      <path d="M64 64l72 72 M136 64l-72 72" fill="none" stroke="#C25B4E" stroke-width="18"/>''',
    'pay': '''<circle cx="100" cy="100" r="78" fill="#FFE9C4"/>
      <path d="M50 130c20-24 46-34 76-30l14 30z" fill="#F2C9A0"/>
      <circle cx="100" cy="92" r="22" fill="#F2B23E"/>
      <path d="M100 78v28" stroke="#E6A93B" stroke-width="4"/>''',
    'run': '''<circle cx="100" cy="100" r="78" fill="#FFE9C4"/>
      <circle cx="112" cy="58" r="20" fill="#F2C9A0"/>
      <path d="M112 78l-18 40 30 12 M94 118l-28 28 M124 130l22 22 M100 88l-30 10" fill="none" stroke="#E07B39" stroke-width="14"/>''',
    'stand': '''<circle cx="100" cy="100" r="78" fill="#FFE9C4"/>
      <circle cx="100" cy="58" r="20" fill="#F2C9A0"/>
      <path d="M100 78v58 M100 136l-22 26 M100 136l22 26 M100 92l-28 24 M100 92l28 24" fill="none" stroke="#2E6B66" stroke-width="13"/>''',
    'nod': '''<circle cx="100" cy="100" r="78" fill="#FFE9C4"/>
      <circle cx="100" cy="104" r="44" fill="#F2C9A0"/>
      <path d="M80 92c4-6 10-6 14 0 M106 92c4-6 10-6 14 0" fill="none" stroke="#4A342A" stroke-width="5"/>
      <path d="M84 118c10 12 22 12 32 0" fill="none" stroke="#B65C4E" stroke-width="5"/>
      <path d="M62 62l-10-14 M138 62l10-14" stroke="#F2B23E" stroke-width="5"/>''',
}


# ---------------- НОВЫЕ ПРЕДМЕТЫ ----------------

NEW_ITEMS = {
    # кухня и готовка
    'sandwich': '''<path d="M40 120L100 60l60 60z" fill="#D9A15B"/>
      <path d="M52 112h96" stroke="#C08A57" stroke-width="6"/>
      <path d="M48 122h104l-6 12H54z" fill="#4F8A5B"/>
      <path d="M54 134h92v12H54z" fill="#D94F3D"/>''',
    'salad': '''<path d="M44 106h112c-6 44-30 62-56 62s-50-18-56-62z" fill="#FFF6E4"/>
      <path d="M44 106h112" stroke-width="6"/>
      <circle cx="74" cy="98" r="16" fill="#4F8A5B" stroke="none"/>
      <circle cx="104" cy="90" r="18" fill="#C25B4E" stroke="none"/>
      <circle cx="130" cy="100" r="14" fill="#E8A33D" stroke="none"/>''',
    'cupcakes': '''<path d="M62 104h76l-12 58H74z" fill="#E8A33D"/>
      <path d="M62 104h76" stroke-width="5"/>
      <path d="M56 104c0-26 20-42 44-42s44 16 44 42z" fill="#C25B4E"/>
      <circle cx="100" cy="58" r="9" fill="#D94F3D" stroke="none"/>
      <path d="M74 118v30 M100 118v30 M126 118v30" stroke="#B9834F" stroke-width="4"/>''',
    'butter': '''<rect x="46" y="82" width="108" height="60" rx="6" fill="#F2C94C"/>
      <rect x="46" y="82" width="108" height="24" rx="6" fill="#FFF6E4"/>
      <path d="M46 106h108" stroke-width="4"/>''',
    'cheese': '''<path d="M42 138V86l112-30v82z" fill="#F2B23E"/>
      <path d="M42 138h116" stroke-width="5"/>
      <circle cx="80" cy="108" r="9" fill="#E0A32E" stroke="none"/>
      <circle cx="118" cy="96" r="7" fill="#E0A32E" stroke="none"/>
      <circle cx="140" cy="118" r="6" fill="#E0A32E" stroke="none"/>''',
    'sausage': '''<path d="M52 100a18 18 0 0 1 18-18h60a18 18 0 0 1 18 18 18 18 0 0 1-18 18H70a18 18 0 0 1-18-18z" fill="#C97B5A"/>
      <path d="M64 84v32 M100 84v32 M136 84v32" stroke="#A85F42" stroke-width="4"/>''',
    'cucumber': '''<rect x="44" y="88" width="112" height="34" rx="17" fill="#4F8A5B"/>
      <circle cx="70" cy="100" r="4" fill="#3C6B47" stroke="none"/>
      <circle cx="100" cy="106" r="4" fill="#3C6B47" stroke="none"/>
      <circle cx="130" cy="98" r="4" fill="#3C6B47" stroke="none"/>
      <path d="M150 90c6 6 6 24 0 30" fill="none" stroke="#3C6B47" stroke-width="4"/>''',
    'tomato': '''<circle cx="100" cy="108" r="46" fill="#D94F3D"/>
      <path d="M100 62v-12" stroke="#4F8A5B" stroke-width="7"/>
      <path d="M100 60c-14-10-28-6-30 4 10 4 22 2 30-4z M100 60c14-10 28-6 30 4-10 4-22 2-30-4z" fill="#4F8A5B"/>
      <circle cx="84" cy="96" r="7" fill="#E86A58" stroke="none"/>''',
    'onion': '''<path d="M100 58c34 0 52 30 52 56s-22 40-52 40-52-14-52-40 18-56 52-56z" fill="#D9A15B"/>
      <path d="M100 58v96 M100 58c-14 20-18 60-6 96 M100 58c14 20 18 60 6 96" fill="none" stroke="#B9834F" stroke-width="3"/>
      <path d="M100 58c-6-12-2-20 6-24 M100 58c6-12 2-20-6-24" fill="none" stroke="#4F8A5B" stroke-width="5"/>''',
    'flour': '''<path d="M62 78h76l8 84H54z" fill="#FFF6E4"/>
      <path d="M62 78l16-22h44l16 22z" fill="#E8D4B4"/>
      <path d="M74 118h52" stroke="#B9834F" stroke-width="6"/>
      <path d="M100 96c-16-6-16-26 0-26s16 20 0 26z" fill="#F2B23E" stroke="none"/>''',
    'sugar': '''<path d="M60 96h80l-8 62H68z" fill="#FFF6E4"/>
      <path d="M60 96h80" stroke-width="5"/>
      <rect x="76" y="76" width="18" height="18" rx="3" fill="#F2C94C"/>
      <rect x="100" y="72" width="18" height="18" rx="3" fill="#F2C94C"/>
      <rect x="88" y="58" width="18" height="18" rx="3" fill="#F2C94C"/>''',
    'egg': '''<path d="M100 46c26 0 44 34 44 62s-20 44-44 44-44-16-44-44 18-62 44-62z" fill="#FFF6E4"/>
      <circle cx="86" cy="98" r="6" fill="#E8D4B4" stroke="none"/>''',
    'board': '''<rect x="42" y="66" width="116" height="86" rx="10" fill="#D9A15B"/>
      <rect x="58" y="78" width="84" height="62" rx="6" fill="#C08A57"/>
      <path d="M100 152v14 M78 166h44" stroke="#8B5A36" stroke-width="6"/>''',
    'knife': '''<path d="M36 108l92-34 6 20-92 34z" fill="#CFD8D6"/>
      <rect x="128" y="72" width="44" height="20" rx="6" fill="#8B5A36" transform="rotate(-20 150 82)"/>''',
    'plate': '''<circle cx="100" cy="104" r="54" fill="#FFF6E4"/>
      <circle cx="100" cy="104" r="38" fill="none" stroke="#E6CDA6" stroke-width="4"/>
      <circle cx="100" cy="104" r="20" fill="#F5E7CE" stroke="none"/>''',
    'bowl': '''<path d="M44 100h112c-6 46-30 66-56 66s-50-20-56-66z" fill="#E8A33D"/>
      <path d="M44 100h112" stroke-width="6"/>
      <path d="M60 118c20 10 60 10 80 0" fill="none" stroke="#C97B5A" stroke-width="4"/>''',
    'spoon': '''<ellipse cx="100" cy="66" rx="22" ry="30" fill="#CFD8D6"/>
      <path d="M100 96v70" stroke="#CFD8D6" stroke-width="14"/>
      <path d="M100 166c-10 0-14-8-14-8h28s-4 8-14 8z" fill="#CFD8D6"/>''',
    'molds': '''<path d="M52 92h36l-4 46H56z" fill="#E8A33D"/>
      <path d="M52 92h36" stroke-width="4"/>
      <path d="M100 84h36l-4 54h-28z" fill="#C25B4E"/>
      <path d="M100 84h36" stroke-width="4"/>
      <path d="M148 96h32l-4 42h-24z" fill="#4F8A5B"/>
      <path d="M148 96h32" stroke-width="4"/>''',
    'oven': '''<rect x="46" y="60" width="108" height="98" rx="8" fill="#CFD8D6"/>
      <rect x="58" y="86" width="84" height="58" rx="6" fill="#6E7E78"/>
      <circle cx="70" cy="74" r="7" fill="#4A342A" stroke="none"/>
      <circle cx="92" cy="74" r="7" fill="#4A342A" stroke="none"/>
      <path d="M76 112h48" stroke="#FFF6E4" stroke-width="6"/>
      <path d="M70 158v10 M130 158v10" stroke="#8FA09C" stroke-width="6"/>''',
    'fridge': '''<rect x="62" y="48" width="76" height="122" rx="10" fill="#EDF2F0"/>
      <path d="M62 96h76" stroke-width="5"/>
      <rect x="124" y="58" width="7" height="26" rx="3" fill="#9AA9A6" stroke="none"/>
      <rect x="124" y="106" width="7" height="34" rx="3" fill="#9AA9A6" stroke="none"/>''',

    # одежда и сборы
    'tshirt': '''<path d="M74 58l26-12 26 12 24 26-16 16-10-12v58H76V88l-10 12-16-16z" fill="#4F8A5B"/>
      <path d="M92 52c4 8 12 8 16 0" fill="none" stroke="#3C6B47" stroke-width="4"/>''',
    'cap': '''<path d="M56 100c0-28 20-46 44-46s44 18 44 46z" fill="#C25B4E"/>
      <path d="M56 100h88" stroke-width="5"/>
      <path d="M144 100h34c0 12-14 18-34 18z" fill="#C25B4E"/>
      <circle cx="100" cy="54" r="6" fill="#F2B23E" stroke="none"/>''',
    'sweater': '''<path d="M72 60l28-14 28 14 24 28-16 16-10-12v58H74V92l-10 12-16-16z" fill="#8E5A86"/>
      <path d="M74 92h52" stroke="#6E4468" stroke-width="5"/>
      <path d="M86 46h28l-6 14H92z" fill="#6E4468"/>''',
    'jeans': '''<path d="M70 54h60l10 102h-26l-14-60-14 60H58z" fill="#4F6B8A"/>
      <path d="M70 76h60" stroke="#3A5270" stroke-width="5"/>
      <path d="M100 76v80" stroke="#3A5270" stroke-width="3"/>''',
    'raincoat': '''<path d="M70 60l30-14 30 14 24 34-16 14-10-14v64H72V94l-10 14-16-14z" fill="#2E6B66"/>
      <path d="M100 46v122" stroke="#1F4F4B" stroke-width="5"/>
      <path d="M88 66l12 10 12-10" fill="none" stroke="#1F4F4B" stroke-width="4"/>''',
    'winterJacket': '''<path d="M70 60l30-14 30 14 26 32-18 16-12-14v62H74V98l-12 14-18-16z" fill="#C25B4E"/>
      <path d="M100 46v124" stroke="#9C443A" stroke-width="5"/>
      <path d="M76 92h48 M76 118h48 M76 144h48" stroke="#9C443A" stroke-width="4"/>''',
    'scarf': '''<path d="M62 66h76v26H62z" fill="#E07B39"/>
      <path d="M62 66h76" stroke-width="5"/>
      <path d="M96 92h18v62l-9 12-9-12z" fill="#E07B39"/>
      <path d="M76 66v26 M100 66v26 M124 66v26" stroke="#C25B4E" stroke-width="6"/>''',
    'mittens': '''<path d="M56 92c0-16 12-28 26-28s26 12 26 28v30a26 26 0 0 1-52 0z" fill="#C25B4E"/>
      <path d="M56 108h52" stroke="#9C443A" stroke-width="5"/>
      <path d="M116 92c0-16 12-28 26-28s26 12 26 28v30a26 26 0 0 1-52 0z" fill="#4F8A5B"/>
      <path d="M116 108h52" stroke="#3C6B47" stroke-width="5"/>''',
    'hat': '''<path d="M56 112c0-32 20-54 44-54s44 22 44 54z" fill="#4F8A5B"/>
      <path d="M56 112h88" stroke-width="5"/>
      <path d="M50 112h100v18H50z" fill="#3C6B47"/>
      <circle cx="100" cy="58" r="10" fill="#FFF6E4" stroke="none"/>''',

    # дом и безопасность
    'light': '''<path d="M100 46c26 0 44 20 44 44 0 20-14 30-18 42H74c-4-12-18-22-18-42 0-24 18-44 44-44z" fill="#F2B23E"/>
      <path d="M78 132h44v14H78z" fill="#CFD8D6"/>
      <path d="M82 146h36v10H82z" fill="#9AA9A6"/>
      <path d="M84 100l12 10 12-14 14 12" fill="none" stroke="#E0A32E" stroke-width="4"/>''',
    'water': '''<path d="M100 44c22 30 40 50 40 70a40 40 0 0 1-80 0c0-20 18-40 40-70z" fill="#BFE0E6"/>
      <path d="M82 108c0 12 8 20 18 22" fill="none" stroke="#7FB6BE" stroke-width="5"/>''',
    'gas': '''<path d="M100 44c10 24 34 30 34 62a34 34 0 0 1-68 0c0-16 10-24 16-34 4 10 10 14 10 22 0-20 4-34 8-50z" fill="#E07B39"/>
      <path d="M100 92c8 12 16 16 16 30a16 16 0 0 1-32 0c0-10 8-14 16-30z" fill="#F2B23E"/>''',
    'socket': '''<rect x="56" y="56" width="88" height="88" rx="16" fill="#FFF6E4"/>
      <circle cx="84" cy="92" r="8" fill="#4A342A" stroke="none"/>
      <circle cx="116" cy="92" r="8" fill="#4A342A" stroke="none"/>
      <rect x="88" y="116" width="24" height="8" rx="4" fill="#4A342A" stroke="none"/>
      <path d="M100 144v18" stroke="#4A342A" stroke-width="8"/>''',
    'phone': '''<rect x="72" y="44" width="56" height="112" rx="12" fill="#4A342A"/>
      <rect x="80" y="58" width="40" height="78" rx="6" fill="#BFE0E6"/>
      <circle cx="100" cy="146" r="5" fill="#FFF6E4" stroke="none"/>''',

    # подъезд и площадка
    'elevator': '''<rect x="52" y="48" width="96" height="112" rx="10" fill="#C08A57"/>
      <rect x="62" y="58" width="76" height="92" rx="6" fill="#B9CDCB"/>
      <path d="M100 58v92" stroke="#8FA09C" stroke-width="5"/>
      <path d="M88 96l-10 14h12l-8 14 22-24h-14z" fill="#F2B23E" stroke="none"/>''',
    'stairs': '''<path d="M44 156h30v-28h30V100h30V72h30V44h30v112z" fill="#D8A870"/>
      <path d="M44 156h142" stroke="#8B5A36" stroke-width="5"/>
      <path d="M44 128h30 M74 100h30 M104 72h30 M134 44h30" stroke="#B9834F" stroke-width="4"/>''',
    'swing': '''<path d="M50 158L100 40l50 118" fill="none" stroke="#8B5A36" stroke-width="10"/>
      <path d="M70 66h60" stroke="#4A342A" stroke-width="5"/>
      <path d="M80 66v56 M120 66v56" stroke="#4A342A" stroke-width="4"/>
      <rect x="68" y="122" width="64" height="12" rx="6" fill="#E07B39"/>''',
    'carousel': '''<path d="M100 60v72" stroke="#8B5A36" stroke-width="8"/>
      <ellipse cx="100" cy="140" rx="56" ry="20" fill="#C95F35"/>
      <path d="M100 60l-34 30h68z" fill="#E07B39"/>
      <circle cx="100" cy="52" r="9" fill="#F2B23E"/>''',
    'sandbox': '''<ellipse cx="100" cy="118" rx="60" ry="30" fill="#E8C67A"/>
      <path d="M40 110h120 M40 126h120" stroke="#C99C6B" stroke-width="8"/>
      <path d="M100 92l18 16-18 16-18-16z" fill="#E07B39"/>
      <path d="M78 86l6 10" stroke="#4F8A5B" stroke-width="5"/>''',
    'slide': '''<path d="M56 152V70a16 16 0 0 1 16-16h24" fill="none" stroke="#2E6B66" stroke-width="12"/>
      <path d="M96 54h44l-24 98H76z" fill="#E8A33D"/>
      <path d="M104 76h34 M100 102h26 M94 128h20" stroke="#B9834F" stroke-width="5"/>''',

    # школа
    'alarm': '''<circle cx="100" cy="106" r="46" fill="#FFF6E4"/>
      <circle cx="100" cy="106" r="34" fill="none" stroke="#C25B4E" stroke-width="6"/>
      <path d="M100 106V80 M100 106l20 12" stroke="#4A342A" stroke-width="6"/>
      <path d="M70 60l-16-16 M130 60l16-16" stroke="#C25B4E" stroke-width="8"/>
      <path d="M70 152l-14 16 M130 152l14 16" stroke="#C25B4E" stroke-width="8"/>''',
    'blanket': '''<rect x="46" y="70" width="108" height="76" rx="12" fill="#4F8A5B"/>
      <path d="M46 96h108 M46 122h108" stroke="#3C6B47" stroke-width="5"/>
      <path d="M60 70v76 M140 70v76" stroke="#3C6B47" stroke-width="5"/>''',
    'pillow': '''<path d="M52 76c0-12 10-18 48-18s48 6 48 18v56c0 12-10 18-48 18s-48-6-48-18z" fill="#FFF6E4"/>
      <path d="M52 76c14 10 82 10 96 0 M52 132c14-10 82-10 96 0" fill="none" stroke="#E6CDA6" stroke-width="4"/>''',
    'cover': '''<path d="M44 72h112v80H44z" fill="#B67D4B"/>
      <path d="M44 96h112 M44 120h112" stroke="#8B5A36" stroke-width="5"/>
      <path d="M74 72v80 M126 72v80" stroke="#8B5A36" stroke-width="4"/>''',
    'tap': '''<path d="M60 150V80h30v-16h20" fill="none" stroke="#9AA9A6" stroke-width="14"/>
      <rect x="104" y="52" width="34" height="20" rx="6" fill="#9AA9A6"/>
      <path d="M74 118h40" stroke="#BFE0E6" stroke-width="8"/>
      <path d="M52 150h70" stroke="#9AA9A6" stroke-width="10"/>''',
    'soap': '''<rect x="54" y="78" width="92" height="58" rx="16" fill="#F2B23E"/>
      <path d="M54 100h92" stroke="#E0A32E" stroke-width="4"/>
      <circle cx="80" cy="112" r="6" fill="#FFF6E4" stroke="none"/>
      <circle cx="110" cy="120" r="5" fill="#FFF6E4" stroke="none"/>''',
    'towel': '''<rect x="62" y="52" width="76" height="102" rx="8" fill="#BFE0E6"/>
      <path d="M62 76h76 M62 130h76" stroke="#7FB6BE" stroke-width="5"/>
      <path d="M76 100h48" stroke="#7FB6BE" stroke-width="5"/>''',
    'porridge': '''<path d="M46 98h108c-6 44-28 62-54 62s-48-18-54-62z" fill="#E8A33D"/>
      <path d="M46 98h108" stroke-width="6"/>
      <path d="M70 98c0-16 12-24 30-24s30 8 30 24" fill="#FFF6E4"/>
      <circle cx="100" cy="84" r="5" fill="#D94F3D" stroke="none"/>''',
    'soda': '''<path d="M78 58h44l8 96H70z" fill="#C25B4E"/>
      <path d="M78 58h44" stroke-width="5"/>
      <rect x="88" y="42" width="24" height="16" rx="4" fill="#CFD8D6"/>
      <path d="M84 92h32" stroke="#FFF6E4" stroke-width="5"/>''',
    'textbook': '''<path d="M54 62h92v92H54z" fill="#2E6B66"/>
      <path d="M68 80h64 M68 100h48 M68 120h56" stroke="#BFE0E6" stroke-width="5"/>
      <path d="M54 62v92" stroke="#1F4F4B" stroke-width="10"/>''',
    'notebook': '''<rect x="60" y="56" width="80" height="96" rx="6" fill="#FFF6E4"/>
      <path d="M74 80h52 M74 100h52 M74 120h36" stroke="#BFE0E6" stroke-width="5"/>
      <path d="M60 70v14 M60 98v14 M60 126v14" stroke="#C25B4E" stroke-width="6"/>''',
    'pencilCase': '''<rect x="48" y="84" width="104" height="44" rx="12" fill="#E07B39"/>
      <path d="M48 106h104" stroke="#B65C25" stroke-width="5"/>
      <path d="M78 84l-10-22h14l8 22z" fill="#F2B23E"/>
      <path d="M120 84l10-22h-14l-8 22z" fill="#2E6B66"/>''',
    'game': '''<path d="M56 92h88c14 0 20 14 20 28s-8 26-20 26c-8 0-14-6-18-12H74c-4 6-10 12-18 12-12 0-20-12-20-26s6-28 20-28z" fill="#4A5B47"/>
      <circle cx="140" cy="106" r="7" fill="#C25B4E" stroke="none"/>
      <circle cx="126" cy="120" r="7" fill="#F2B23E" stroke="none"/>
      <path d="M62 106h20 M72 96v20" stroke="#FFF6E4" stroke-width="6"/>''',
    'backpack': '''<rect x="58" y="70" width="84" height="94" rx="16" fill="#2E6B66"/>
      <path d="M58 104h84" stroke="#1F4F4B" stroke-width="5"/>
      <path d="M76 70c0-22 48-22 48 0" fill="none" stroke="#1F4F4B" stroke-width="8"/>
      <rect x="84" y="120" width="32" height="24" rx="6" fill="#BFE0E6"/>''',
    'sun': '''<circle cx="100" cy="100" r="36" fill="#F2B23E"/>
      <path d="M100 40V22 M100 178v-18 M40 100H22 M178 100h-18 M58 58L44 44 M142 58l14-14 M58 142l-14 14 M142 142l14 14" stroke="#F2B23E" stroke-width="9"/>''',
    'cloud': '''<path d="M62 126a26 26 0 0 1 0-52 34 34 0 0 1 64-8 24 24 0 0 1 12 60z" fill="#CFD8D6"/>
      <path d="M62 126h76" stroke="#9AA9A6" stroke-width="4"/>''',
    'rain': '''<path d="M60 104a26 26 0 0 1 4-50 34 34 0 0 1 64-6 22 22 0 0 1 10 56z" fill="#BFE0E6"/>
      <path d="M76 118l-8 22 M100 118l-8 22 M124 118l-8 22" stroke="#7FB6BE" stroke-width="7"/>''',
    'snow': '''<path d="M100 44v112 M52 72l96 56 M148 72l-96 56" stroke="#BFE0E6" stroke-width="8"/>
      <path d="M100 44l-14 14 M100 44l14 14 M100 156l-14-14 M100 156l14-14" stroke="#BFE0E6" stroke-width="6"/>''',
    'pedestrian': '''<circle cx="100" cy="60" r="20" fill="#F2C9A0"/>
      <path d="M100 80l-16 42 28 10 M84 122l-24 34 M112 132l24 30 M100 92l-28 18 M100 92l30 16" fill="none" stroke="#2E6B66" stroke-width="13"/>''',
    'bus': '''<rect x="40" y="66" width="120" height="80" rx="12" fill="#E8A33D"/>
      <rect x="52" y="78" width="30" height="26" rx="4" fill="#BFE0E6"/>
      <rect x="92" y="78" width="30" height="26" rx="4" fill="#BFE0E6"/>
      <rect x="132" y="78" width="18" height="26" rx="4" fill="#BFE0E6"/>
      <circle cx="70" cy="152" r="12" fill="#4A342A"/>
      <circle cx="130" cy="152" r="12" fill="#4A342A"/>
      <path d="M40 128h120" stroke="#C97B5A" stroke-width="5"/>''',
    'greenLight': '''<rect x="76" y="52" width="48" height="100" rx="14" fill="#4A342A"/>
      <circle cx="100" cy="76" r="12" fill="#6E5B52" stroke="none"/>
      <circle cx="100" cy="104" r="12" fill="#6E5B52" stroke="none"/>
      <circle cx="100" cy="132" r="12" fill="#4F8A5B"/>
      <path d="M100 152v26" stroke="#4A342A" stroke-width="8"/>''',
    'redLight': '''<rect x="76" y="52" width="48" height="100" rx="14" fill="#4A342A"/>
      <circle cx="100" cy="76" r="12" fill="#C25B4E"/>
      <circle cx="100" cy="104" r="12" fill="#6E5B52" stroke="none"/>
      <circle cx="100" cy="132" r="12" fill="#6E5B52" stroke="none"/>
      <path d="M100 152v26" stroke="#4A342A" stroke-width="8"/>''',
    'desk': '''<rect x="40" y="82" width="120" height="16" rx="6" fill="#C08A57"/>
      <path d="M56 98v50 M144 98v50" stroke="#8B5A36" stroke-width="10"/>
      <rect x="40" y="120" width="120" height="12" rx="5" fill="#A97146"/>
      <rect x="76" y="60" width="48" height="24" rx="4" fill="#FFF6E4"/>''',
    'toilet': '''<rect x="72" y="44" width="56" height="70" rx="8" fill="#BFE0E6"/>
      <rect x="84" y="60" width="32" height="24" rx="6" fill="#2E6B66"/>
      <rect x="56" y="120" width="88" height="34" rx="12" fill="#EDF2F0"/>
      <path d="M56 132h88" stroke="#9AA9A6" stroke-width="4"/>''',
    'canteen': '''<path d="M48 96h104c-6 42-28 60-52 60s-46-18-52-60z" fill="#FFF6E4"/>
      <path d="M48 96h104" stroke-width="6"/>
      <path d="M64 96c0-14 16-22 36-22s36 8 36 22" fill="#E8A33D"/>
      <path d="M150 60v70" stroke="#9AA9A6" stroke-width="8"/>''',
    'door': '''<rect x="62" y="44" width="76" height="118" rx="8" fill="#B67D4B"/>
      <rect x="72" y="54" width="56" height="44" rx="5" fill="#D8A870"/>
      <rect x="72" y="106" width="56" height="46" rx="5" fill="#D8A870"/>
      <circle cx="126" cy="106" r="7" fill="#F2B23E" stroke="none"/>''',
    'play': '''<circle cx="100" cy="104" r="50" fill="#4F8A5B"/>
      <path d="M100 54c14 16 14 84 0 100 M50 104h100" stroke="#FFF6E4" stroke-width="5"/>
      <circle cx="100" cy="104" r="18" fill="#FFF6E4" stroke="none"/>''',
    'talk': '''<path d="M46 70h108v64H88l-26 26v-26H46z" fill="#BFE0E6"/>
      <path d="M68 94h64 M68 112h44" stroke="#7FB6BE" stroke-width="6"/>''',
    'together': '''<path d="M50 96l30-14 20 14 20-14 30 14v28l-30 14-20-14-20 14-30-14z" fill="#F2C9A0"/>
      <path d="M80 96l20 20 20-20" fill="none" stroke="#4A342A" stroke-width="4"/>''',
    'bed': '''<rect x="44" y="92" width="112" height="42" rx="8" fill="#E39A5A"/>
      <rect x="44" y="76" width="40" height="26" rx="8" fill="#FFF6E4"/>
      <path d="M44 134v18 M156 134v18" stroke="#8B5A36" stroke-width="8"/>
      <path d="M40 92h120" stroke="#8B5A36" stroke-width="6"/>''',

    # транспорт и игры
    'seat': '''<rect x="52" y="58" width="96" height="26" rx="10" fill="#4F6B8A"/>
      <rect x="46" y="80" width="108" height="34" rx="10" fill="#4F8A5B"/>
      <path d="M64 114v40 M136 114v40" stroke="#3A5270" stroke-width="9"/>
      <path d="M64 128h72" stroke="#3A5270" stroke-width="5"/>''',
    'ticTacToe': '''<rect x="46" y="46" width="108" height="108" rx="10" fill="#FFF6E4"/>
      <path d="M82 46v108 M118 46v108 M46 82h108 M46 118h108" stroke="#4A342A" stroke-width="4"/>
      <path d="M60 58l14 14 M74 58l-14 14" stroke="#C25B4E" stroke-width="5"/>
      <circle cx="100" cy="100" r="9" fill="none" stroke="#2E6B66" stroke-width="5"/>
      <path d="M60 134l14 14 M74 134l-14 14" stroke="#C25B4E" stroke-width="5"/>''',
    'sea': '''<path d="M28 96c18-16 34-16 52 0s34 16 52 0 34-16 52 0" fill="none" stroke="#7FB6BE" stroke-width="10"/>
      <path d="M28 126c18-16 34-16 52 0s34 16 52 0 34-16 52 0" fill="none" stroke="#BFE0E6" stroke-width="10"/>
      <circle cx="150" cy="56" r="16" fill="#F2B23E"/>''',
    'riddle': '''<circle cx="100" cy="100" r="58" fill="#F2B23E"/>
      <path d="M84 78c0-12 8-20 18-20s18 8 18 18c0 12-14 14-16 26" fill="none" stroke="#4A342A" stroke-width="9"/>
      <circle cx="104" cy="132" r="7" fill="#4A342A" stroke="none"/>''',
    'tree': '''<path d="M100 40l34 46h-22l30 42h-84l30-42H66z" fill="#2C6B45"/>
      <rect x="90" y="128" width="20" height="30" rx="4" fill="#8B5A36"/>
      <circle cx="100" cy="34" r="8" fill="#F2B23E" stroke="none"/>''',
    'rainbow': '''<path d="M32 150a68 68 0 0 1 136 0" fill="none" stroke="#C25B4E" stroke-width="12"/>
      <path d="M48 150a52 52 0 0 1 104 0" fill="none" stroke="#F2B23E" stroke-width="12"/>
      <path d="M64 150a36 36 0 0 1 72 0" fill="none" stroke="#4F8A5B" stroke-width="12"/>
      <path d="M80 150a20 20 0 0 1 40 0" fill="none" stroke="#4F6B8A" stroke-width="12"/>''',
    'cabbage': '''<circle cx="100" cy="106" r="50" fill="#7FB07A"/>
      <path d="M100 56c-30 8-46 34-42 62 22-6 42-30 42-62z" fill="#9CC994" stroke="none"/>
      <path d="M100 56c30 8 46 34 42 62-22-6-42-30-42-62z" fill="#8FBE86" stroke="none"/>
      <path d="M100 60v92" stroke="#5C8A57" stroke-width="5"/>''',
    'socks': '''<path d="M70 48h30v62c0 22-10 32-28 32s-30-10-30-26 8-18 28-18z" fill="#C25B4E"/>
      <path d="M70 48h30v14H70z" fill="#9C443A"/>
      <path d="M138 48h-30v62c0 22 10 32 28 32s30-10 30-26-8-18-28-18z" fill="#4F8A5B"/>
      <path d="M138 48h-30v14h30z" fill="#3C6B47"/>''',
    'bulb': '''<path d="M100 40c26 0 44 20 44 44 0 20-14 30-18 42H74c-4-12-18-22-18-42 0-24 18-44 44-44z" fill="#F7E7A8"/>
      <path d="M78 126h44v12H78z" fill="#CFD8D6"/>
      <path d="M82 138h36v12H82z" fill="#9AA9A6"/>
      <path d="M84 96l12 10 12-16 14 14" fill="none" stroke="#E0A32E" stroke-width="5"/>''',
    'pear': '''<path d="M100 62c10 0 16 8 16 16 0 10 18 20 18 44a34 34 0 0 1-68 0c0-24 18-34 18-44 0-8 6-16 16-16z" fill="#C9D65A"/>
      <path d="M100 62V46" stroke="#4F8A5B" stroke-width="7"/>
      <path d="M100 48c-10-8-20-4-22 4 8 3 16 1 22-4z" fill="#4F8A5B"/>''',
    'balloon': '''<ellipse cx="100" cy="88" rx="40" ry="48" fill="#C25B4E"/>
      <path d="M100 136l-8 12h16z" fill="#9C443A"/>
      <path d="M100 148c0 16 16 12 12 30" fill="none" stroke="#4A342A" stroke-width="4"/>
      <ellipse cx="84" cy="72" rx="9" ry="13" fill="#E8A0A0" stroke="none" opacity=".7"/>''',
}


NEW_GESTURES = {
    'wait': '''<circle cx="100" cy="100" r="78" fill="#FFE9C4"/>
      <path d="M100 40a60 60 0 1 1 0 120 60 60 0 0 1 0-120z" fill="none" stroke="#4A342A" stroke-width="8"/>
      <path d="M100 62v42l28 18" fill="none" stroke="#4A342A" stroke-width="10"/>''',
    'play': '''<circle cx="100" cy="100" r="78" fill="#E4F0DD"/>
      <circle cx="100" cy="104" r="42" fill="#4F8A5B"/>
      <path d="M100 62c12 14 12 70 0 84 M58 104h84" stroke="#FFF6E4" stroke-width="5"/>''',
    'talk': '''<circle cx="100" cy="100" r="78" fill="#DFEDF0"/>
      <path d="M54 74h92v54H88l-22 22v-22H54z" fill="#BFE0E6"/>
      <path d="M72 94h56 M72 110h38" stroke="#7FB6BE" stroke-width="6"/>''',
    'together': '''<circle cx="100" cy="100" r="78" fill="#FFE9C4"/>
      <path d="M52 100l28-14 20 14 20-14 28 14v26l-28 14-20-14-20 14-28-14z" fill="#F2C9A0"/>
      <path d="M80 100l20 18 20-18" fill="none" stroke="#4A342A" stroke-width="4"/>''',
    'give': '''<circle cx="100" cy="100" r="78" fill="#FFF0DA"/>
      <path d="M44 96h40l18-12 18 12h36v26H44z" fill="#F2C9A0"/>
      <path d="M84 84l16 12 16-12" fill="none" stroke="#4A342A" stroke-width="5"/>
      <path d="M124 96v26" stroke="#4A342A" stroke-width="4"/>''',
    'squat': '''<circle cx="100" cy="52" r="20" fill="#F2C9A0"/>
      <path d="M100 72l-16 30 30 8" fill="none" stroke="#2E6B66" stroke-width="13"/>
      <path d="M84 102l-18 34 M114 110l18 26" fill="none" stroke="#2E6B66" stroke-width="13"/>
      <path d="M66 140h64" stroke="#4A342A" stroke-width="6"/>''',
    'handsUp': '''<circle cx="100" cy="66" r="22" fill="#F2C9A0"/>
      <path d="M100 88v52" stroke="#C25B4E" stroke-width="16"/>
      <path d="M100 100L66 54 M100 100l34-46" fill="none" stroke="#F2C9A0" stroke-width="13"/>
      <path d="M100 140l-16 30 M100 140l16 30" fill="none" stroke="#4F6B8A" stroke-width="13"/>''',
}


# ---------------- PNG-ИКОНКИ (чистый Python) ----------------

def bg_kitchen():
    return wrap(800, 450, '''
<rect width="800" height="450" fill="url(#wall)" stroke="none"/>
<rect y="332" width="800" height="118" fill="#E8D4B4" stroke="none"/>
<path d="M0 332h800" stroke="#C9A97E" stroke-width="3"/>
<g transform="translate(575,42)">
  <rect x="-10" y="-10" width="190" height="150" rx="8" fill="#C99C6B"/>
  <rect width="170" height="130" rx="5" fill="url(#sky)"/>
  <circle cx="45" cy="72" r="28" fill="#E07B39" stroke="none"/>
  <circle cx="115" cy="64" r="32" fill="#F2B23E" stroke="none"/>
  <path d="M85 0v130 M0 65h170" stroke-width="6"/>
</g>
<g transform="translate(50,52)">
  <rect width="360" height="104" rx="8" fill="#D8A870"/>
  <path d="M180 0v104" stroke-width="5"/>
  <circle cx="166" cy="54" r="6" fill="#4A342A" stroke="none"/>
  <circle cx="194" cy="54" r="6" fill="#4A342A" stroke="none"/>
</g>
<g transform="translate(60,205)">
  <rect width="170" height="120" rx="8" fill="#CFD8D6"/>
  <circle cx="45" cy="28" r="17" fill="#6E7E78" stroke="none"/>
  <circle cx="125" cy="28" r="17" fill="#6E7E78" stroke="none"/>
  <rect x="10" y="62" width="150" height="46" rx="6" fill="#8FA09C"/>
  <path d="M30 84h110" stroke="#4A342A" stroke-width="4"/>
</g>
<g transform="translate(250,158)">
  <rect width="120" height="182" rx="10" fill="#EDF2F0"/>
  <path d="M0 66h120" stroke-width="5"/>
  <rect x="100" y="18" width="8" height="32" rx="4" fill="#9AA9A6" stroke="none"/>
  <rect x="100" y="84" width="8" height="44" rx="4" fill="#9AA9A6" stroke="none"/>
</g>
<g transform="translate(430,300)">
  <rect width="330" height="20" rx="6" fill="#C08A57"/>
  <path d="M20 20v58 M310 20v58" stroke="#8B5A36" stroke-width="10"/>
  <ellipse cx="70" cy="6" rx="32" ry="11" fill="#FFF6E4"/>
  <path d="M38 6h64" stroke-width="4"/>
  <rect x="150" y="-16" width="28" height="28" rx="4" fill="#2E6B66"/>
  <circle cx="220" cy="2" r="15" fill="#D94F3D" stroke="none"/>
  <path d="M262 -2c0-14 10-22 20-22s20 8 20 22z" fill="#F2B23E"/>
</g>
<circle cx="330" cy="120" r="150" fill="url(#glow)" stroke="none"/>
''', COMMON_DEFS)


def bg_bedroom():
    return wrap(800, 450, '''
<rect width="800" height="450" fill="url(#wall)" stroke="none"/>
<rect y="330" width="800" height="120" fill="url(#planks)" stroke="none"/>
<g transform="translate(500,40)">
  <rect x="-10" y="-10" width="230" height="180" rx="8" fill="#C99C6B"/>
  <rect width="210" height="160" rx="5" fill="url(#sky)"/>
  <circle cx="55" cy="90" r="34" fill="#E07B39" stroke="none"/>
  <circle cx="150" cy="80" r="40" fill="#F2B23E" stroke="none"/>
  <path d="M105 0v160 M0 80h210" stroke-width="6"/>
</g>
<g transform="translate(50,210)">
  <rect x="-10" y="0" width="330" height="30" rx="8" fill="#B67D4B"/>
  <rect x="0" y="-90" width="300" height="95" rx="12" fill="#EEB072"/>
  <rect x="0" y="-30" width="300" height="60" rx="12" fill="#E39A5A"/>
  <rect x="20" y="-104" width="90" height="40" rx="10" fill="#FFF6E4"/>
  <path d="M0 30v70 M300 30v70" stroke="#8B5A36" stroke-width="12"/>
</g>
<g transform="translate(410,220)">
  <rect width="120" height="20" rx="5" fill="#A97146"/>
  <path d="M12 20v72 M108 20v72" stroke="#8B5A36" stroke-width="9"/>
  <rect x="20" y="-24" width="46" height="46" rx="6" fill="#EDF2F0"/>
  <circle cx="43" cy="0" r="15" fill="#FFF6E4"/>
  <path d="M43 -12v12 M37 0l6 6 6-6" stroke-width="3"/>
</g>
<g transform="translate(600,150)">
  <rect width="150" height="230" rx="10" fill="#C08A57"/>
  <path d="M75 0v230" stroke-width="5"/>
  <circle cx="64" cy="115" r="6" fill="#4A342A" stroke="none"/>
  <circle cx="86" cy="115" r="6" fill="#4A342A" stroke="none"/>
</g>
<ellipse cx="400" cy="420" rx="330" ry="50" fill="url(#glow)" stroke="none"/>
''', COMMON_DEFS)


def bg_bathroom():
    return wrap(800, 450, '''
<rect width="800" height="450" fill="#EAF3F2" stroke="none"/>
<rect y="360" width="800" height="90" fill="#D7E5E3" stroke="none"/>
<path d="M0 360h800" stroke="#B9CDCB" stroke-width="3"/>
<g transform="translate(90,120)">
  <rect width="300" height="230" rx="10" fill="#FFF6E4"/>
  <rect x="30" y="150" width="240" height="70" rx="14" fill="#FFFFFF"/>
  <path d="M150 150v-40h70v-40" fill="none" stroke="#9AA9A6" stroke-width="12"/>
  <rect x="200" y="52" width="40" height="20" rx="6" fill="#9AA9A6"/>
  <path d="M130 186h40" stroke="#BFE0E6" stroke-width="8"/>
  <circle cx="150" cy="120" r="8" fill="#F2B23E" stroke="none"/>
</g>
<g transform="translate(470,80)">
  <circle cx="70" cy="70" r="66" fill="#C99C6B"/>
  <circle cx="70" cy="70" r="54" fill="#DCEBEC"/>
  <path d="M35 100l30-52 24 36 14-18 18 34z" fill="#FFF6E4" stroke="none" opacity=".6"/>
</g>
<g transform="translate(640,120)">
  <path d="M0 0h60v150H0z" fill="#D7E5E3"/>
  <path d="M-6 0h72" stroke-width="6"/>
  <rect x="-4" y="40" width="68" height="70" rx="8" fill="#BFE0E6"/>
</g>
<rect x="60" y="400" width="680" height="24" rx="8" fill="#C99C6B"/>
<circle cx="120" cy="390" r="22" fill="#FFF6E4"/>
<circle cx="120" cy="390" r="12" fill="#BFE0E6" stroke="none"/>
''', COMMON_DEFS)


def bg_entrance():
    return wrap(800, 450, '''
<rect width="800" height="450" fill="#EDE3D2" stroke="none"/>
<rect y="350" width="800" height="100" fill="#D8C3A1" stroke="none"/>
<path d="M0 350h800" stroke="#B9A077" stroke-width="3"/>
<g transform="translate(60,90)">
  <rect width="250" height="290" rx="10" fill="#C08A57"/>
  <rect x="18" y="18" width="214" height="254" rx="6" fill="#B9CDCB"/>
  <path d="M125 18v254" stroke="#8FA09C" stroke-width="6"/>
  <circle cx="125" cy="150" r="10" fill="#F2B23E" stroke="none"/>
</g>
<g transform="translate(125,20)">
  <rect width="130" height="50" rx="8" fill="#2E6B66"/>
  <path d="M55 14l-12 16h14l-8 14 18-20h-14z" fill="#F2B23E" stroke="none"/>
</g>
<g transform="translate(400,150)">
  <path d="M0 230h60v-40h60v-40h60v-40h60v-40h60v-40h60v270z" fill="#D8A870"/>
  <path d="M0 230h420" stroke="#8B5A36" stroke-width="5"/>
  <path d="M0 190h60 M60 150h60 M120 110h60 M180 70h60 M240 30h60" stroke="#B9834F" stroke-width="4"/>
</g>
<g transform="translate(360,60)">
  <rect width="80" height="60" rx="8" fill="#FFF6E4"/>
  <rect x="14" y="14" width="52" height="34" rx="4" fill="#2E6B66"/>
</g>
<circle cx="690" cy="120" r="110" fill="url(#glow)" stroke="none"/>
''', COMMON_DEFS)


def bg_playground():
    return wrap(800, 450, '''
<rect width="800" height="450" fill="url(#sky)" stroke="none"/>
<g fill="#FFF8E9" stroke="none" opacity=".8">
  <ellipse cx="160" cy="70" rx="70" ry="22"/><ellipse cx="215" cy="60" rx="45" ry="26"/>
  <ellipse cx="640" cy="55" rx="60" ry="20"/><ellipse cx="685" cy="48" rx="38" ry="22"/>
</g>
<rect y="300" width="800" height="150" fill="#CDD9A8" stroke="none"/>
<path d="M0 300h800" stroke="#A9BB7E" stroke-width="3"/>
<g transform="translate(60,120)">
  <path d="M0 180L70 0l70 180" fill="none" stroke="#8B5A36" stroke-width="12"/>
  <path d="M70 0v20" stroke="#8B5A36" stroke-width="8"/>
  <path d="M40 40h60" stroke="#4A342A" stroke-width="6"/>
  <path d="M48 40v70 M92 40v70" stroke="#4A342A" stroke-width="4"/>
  <rect x="36" y="108" width="68" height="14" rx="6" fill="#E07B39"/>
</g>
<g transform="translate(330,90)">
  <path d="M0 200V90a20 20 0 0 1 20-20h30" fill="none" stroke="#2E6B66" stroke-width="14"/>
  <path d="M50 70h90l-30 130H50z" fill="#E8A33D"/>
  <path d="M60 96h70 M70 130h50 M80 164h30" stroke="#B9834F" stroke-width="6"/>
  <path d="M50 70h110" stroke="#2E6B66" stroke-width="10"/>
</g>
<g transform="translate(520,240)">
  <ellipse cx="110" cy="60" rx="110" ry="46" fill="#E8C67A"/>
  <path d="M20 44h180 M20 76h180" stroke="#C99C6B" stroke-width="10"/>
  <path d="M100 30l24 22-24 22-24-22z" fill="#E07B39"/>
</g>
<g transform="translate(700,200)">
  <ellipse cx="40" cy="70" rx="60" ry="26" fill="#C95F35"/>
  <path d="M40 70V0" stroke="#8B5A36" stroke-width="8"/>
  <circle cx="40" cy="0" r="10" fill="#F2B23E"/>
</g>
<path d="M40 300V230" stroke="#7B5236" stroke-width="14"/>
<circle cx="40" cy="210" r="48" fill="#E07B39" stroke="none"/>
<circle cx="770" cy="220" r="52" fill="#C95F35" stroke="none"/>
<path d="M770 300v-70" stroke="#7B5236" stroke-width="14"/>
''', COMMON_DEFS)


def bg_bus_stop():
    return wrap(800, 450, '''
<rect width="800" height="450" fill="url(#sky)" stroke="none"/>
<rect y="320" width="800" height="130" fill="#D8C3A1" stroke="none"/>
<path d="M0 320h800" stroke="#B9A077" stroke-width="3"/>
<path d="M0 400h800" stroke="#8FA09C" stroke-width="14"/>
<path d="M40 400h60 M160 400h60 M280 400h60 M400 400h60 M520 400h60 M640 400h60 M760 400h40" stroke="#FFF6E4" stroke-width="6"/>
<g transform="translate(150,90)">
  <rect width="360" height="200" rx="12" fill="#BFE0E6"/>
  <rect x="-10" y="-14" width="380" height="26" rx="8" fill="#E07B39"/>
  <path d="M10 0v200 M350 0v200" stroke="#8B5A36" stroke-width="10"/>
  <rect x="40" y="130" width="280" height="40" rx="8" fill="#C99C6B"/>
</g>
<g transform="translate(560,60)">
  <rect width="30" height="230" rx="6" fill="#4A342A"/>
  <circle cx="15" cy="40" r="30" fill="#2E6B66"/>
  <circle cx="15" cy="40" r="18" fill="#BFE0E6"/>
  <rect x="40" y="20" width="150" height="60" rx="10" fill="#2E6B66"/>
  <path d="M70 50h90" stroke="#F2B23E" stroke-width="8"/>
</g>
<g transform="translate(60,240)">
  <rect width="70" height="90" rx="8" fill="#E8A33D"/>
  <circle cx="35" cy="60" r="14" fill="#D94F3D" stroke="none"/>
</g>
''', COMMON_DEFS)


def bg_bus():
    return wrap(800, 450, '''
<rect width="800" height="450" fill="#F2E3C8" stroke="none"/>
<rect y="360" width="800" height="90" fill="#C9B48F" stroke="none"/>
<rect x="40" y="40" width="200" height="120" rx="10" fill="#BFE0E6"/>
<rect x="290" y="40" width="200" height="120" rx="10" fill="#BFE0E6"/>
<rect x="540" y="40" width="200" height="120" rx="10" fill="#BFE0E6"/>
<path d="M40 200h700" stroke="#8B5A36" stroke-width="8"/>
<path d="M60 230h660 M120 230V110 M380 230V110 M640 230V110" stroke="#9AA9A6" stroke-width="10"/>
<g transform="translate(60,250)">
  <rect width="200" height="60" rx="12" fill="#2E6B66"/>
  <rect x="0" y="-30" width="200" height="40" rx="12" fill="#4F8A5B"/>
</g>
<g transform="translate(300,250)">
  <rect width="200" height="60" rx="12" fill="#2E6B66"/>
  <rect x="0" y="-30" width="200" height="40" rx="12" fill="#4F8A5B"/>
</g>
<g transform="translate(540,250)">
  <rect width="200" height="60" rx="12" fill="#2E6B66"/>
  <rect x="0" y="-30" width="200" height="40" rx="12" fill="#4F8A5B"/>
</g>
<g transform="translate(20,150)">
  <rect width="70" height="120" rx="10" fill="#8FA09C"/>
  <path d="M35 20v80" stroke="#4A342A" stroke-width="4"/>
</g>
''', COMMON_DEFS)


def bg_crosswalk():
    return wrap(800, 450, '''
<rect width="800" height="450" fill="url(#sky)" stroke="none"/>
<rect y="250" width="800" height="200" fill="#8FA09C" stroke="none"/>
<path d="M0 250h800" stroke="#6E7E78" stroke-width="4"/>
<g fill="#FFF6E4" opacity=".95">
  <rect x="40" y="290" width="90" height="120"/>
  <rect x="180" y="290" width="90" height="120"/>
  <rect x="320" y="290" width="90" height="120"/>
  <rect x="460" y="290" width="90" height="120"/>
  <rect x="600" y="290" width="90" height="120"/>
</g>
<g transform="translate(690,60)">
  <rect x="0" y="60" width="16" height="200" fill="#4A342A" stroke="none"/>
  <rect x="-30" y="0" width="76" height="130" rx="12" fill="#4A342A"/>
  <circle cx="8" cy="28" r="18" fill="#C25B4E"/>
  <circle cx="8" cy="66" r="18" fill="#F2B23E"/>
  <circle cx="8" cy="104" r="18" fill="#4F8A5B"/>
</g>
<g transform="translate(60,60)">
  <path d="M0 60V20" stroke="#4A342A" stroke-width="12"/>
  <circle cx="0" cy="0" r="34" fill="#D94F3D"/>
  <path d="M-18 0h36" stroke="#FFF6E4" stroke-width="8"/>
</g>
<rect x="90" y="120" width="90" height="130" fill="#E9C79B"/>
<path d="M80 120l55-50 55 50z" fill="#B65C25"/>
<rect x="120" y="180" width="34" height="70" fill="#8B5A36"/>
''', COMMON_DEFS)


def bg_school_yard():
    return wrap(800, 450, '''
<rect width="800" height="450" fill="url(#sky)" stroke="none"/>
<g fill="#FFF8E9" stroke="none" opacity=".8">
  <ellipse cx="180" cy="60" rx="70" ry="20"/><ellipse cx="235" cy="52" rx="44" ry="24"/>
</g>
<rect y="300" width="800" height="150" fill="#CDD9A8" stroke="none"/>
<g transform="translate(130,70)">
  <rect width="540" height="240" fill="#F2D7AE"/>
  <path d="M-20 0L270-70 560 0z" fill="#C25B4E"/>
  <rect x="40" y="50" width="70" height="60" fill="#BFE0E6"/>
  <rect x="160" y="50" width="70" height="60" fill="#BFE0E6"/>
  <rect x="310" y="50" width="70" height="60" fill="#BFE0E6"/>
  <rect x="430" y="50" width="70" height="60" fill="#BFE0E6"/>
  <rect x="220" y="140" width="100" height="100" fill="#8B5A36"/>
  <path d="M270 140v100" stroke-width="5"/>
  <rect x="120" y="150" width="70" height="60" rx="6" fill="#FFF6E4"/>
  <circle cx="155" cy="180" r="16" fill="#F2B23E" stroke="none"/>
</g>
<path d="M0 300h800" stroke="#A9BB7E" stroke-width="3"/>
<path d="M60 330V250" stroke="#7B5236" stroke-width="14"/>
<circle cx="60" cy="230" r="48" fill="#E07B39" stroke="none"/>
<path d="M740 340V260" stroke="#7B5236" stroke-width="14"/>
<circle cx="740" cy="240" r="50" fill="#C95F35" stroke="none"/>
<g transform="translate(700,340)">
  <ellipse cx="30" cy="24" rx="26" ry="20" fill="#E07B39"/>
  <path d="M30 4V-8" stroke="#4F8A5B" stroke-width="6"/>
</g>
''', COMMON_DEFS)


def bg_classroom():
    return wrap(800, 450, '''
<rect width="800" height="450" fill="#F3E7D0" stroke="none"/>
<rect y="350" width="800" height="100" fill="#D8C3A1" stroke="none"/>
<g transform="translate(120,40)">
  <rect x="-14" y="-14" width="420" height="220" rx="10" fill="#B67D4B"/>
  <rect width="392" height="192" rx="6" fill="#2E6B66"/>
  <path d="M40 60h180 M40 100h140 M40 140h200" stroke="#BFE0E6" stroke-width="6" opacity=".7"/>
  <rect x="420" y="70" width="30" height="52" rx="4" fill="#FFF6E4"/>
  <circle cx="435" cy="140" r="12" fill="#D94F3D" stroke="none"/>
</g>
<g transform="translate(600,60)">
  <rect width="170" height="130" rx="8" fill="url(#sky)"/>
  <path d="M85 0v130 M0 65h170" stroke-width="6"/>
  <rect x="-10" y="-10" width="190" height="150" rx="10" fill="none" stroke-width="6"/>
</g>
<g transform="translate(80,300)">
  <rect width="200" height="18" rx="6" fill="#C08A57"/>
  <path d="M20 18v46 M180 18v46" stroke="#8B5A36" stroke-width="9"/>
  <rect x="0" y="60" width="200" height="12" rx="5" fill="#A97146"/>
</g>
<g transform="translate(330,300)">
  <rect width="200" height="18" rx="6" fill="#C08A57"/>
  <path d="M20 18v46 M180 18v46" stroke="#8B5A36" stroke-width="9"/>
  <rect x="0" y="60" width="200" height="12" rx="5" fill="#A97146"/>
</g>
<g transform="translate(580,300)">
  <rect width="200" height="18" rx="6" fill="#C08A57"/>
  <path d="M20 18v46 M180 18v46" stroke="#8B5A36" stroke-width="9"/>
  <rect x="0" y="60" width="200" height="12" rx="5" fill="#A97146"/>
</g>
<ellipse cx="400" cy="80" rx="360" ry="70" fill="url(#glow)" stroke="none"/>
''', COMMON_DEFS)


def bg_corridor():
    return wrap(800, 450, '''
<rect width="800" height="450" fill="#F3E7D0" stroke="none"/>
<rect y="340" width="800" height="110" fill="#D8C3A1" stroke="none"/>
<path d="M0 340h800" stroke="#B9A077" stroke-width="3"/>
<g transform="translate(60,90)">
  <rect width="150" height="250" rx="8" fill="#C08A57"/>
  <rect x="14" y="14" width="122" height="90" rx="5" fill="#D8A870"/>
  <rect x="14" y="120" width="122" height="110" rx="5" fill="#D8A870"/>
  <circle cx="130" cy="150" r="8" fill="#F2B23E" stroke="none"/>
</g>
<g transform="translate(290,90)">
  <rect width="150" height="250" rx="8" fill="#C08A57"/>
  <rect x="14" y="14" width="122" height="90" rx="5" fill="#D8A870"/>
  <rect x="14" y="120" width="122" height="110" rx="5" fill="#D8A870"/>
  <circle cx="130" cy="150" r="8" fill="#F2B23E" stroke="none"/>
</g>
<g transform="translate(520,90)">
  <rect width="150" height="250" rx="8" fill="#C08A57"/>
  <rect x="14" y="14" width="122" height="90" rx="5" fill="#D8A870"/>
  <rect x="14" y="120" width="122" height="110" rx="5" fill="#D8A870"/>
  <circle cx="130" cy="150" r="8" fill="#F2B23E" stroke="none"/>
</g>
<g transform="translate(730,60)">
  <rect width="60" height="160" rx="8" fill="#BFE0E6"/>
  <path d="M760 60v160" stroke-width="5"/>
</g>
<g transform="translate(120,400)">
  <rect width="70" height="20" rx="6" fill="#E07B39"/>
  <circle cx="20" cy="30" r="10" fill="#4A342A" stroke="none"/>
  <circle cx="50" cy="30" r="10" fill="#4A342A" stroke="none"/>
</g>
<ellipse cx="400" cy="60" rx="360" ry="70" fill="url(#glow)" stroke="none"/>
''', COMMON_DEFS)


# ---------------- PNG-ИКОНКИ (чистый Python) ----------------

def png_write(path, size, pixels):
    raw = b''.join(b'\x00' + bytes(pixels[y * size * 4:(y + 1) * size * 4]) for y in range(size))
    def chunk(tag, data):
        return struct.pack('>I', len(data)) + tag + data + struct.pack('>I', zlib.crc32(tag + data) & 0xffffffff)
    out = (b'\x89PNG\r\n\x1a\n'
           + chunk(b'IHDR', struct.pack('>IIBBBBB', size, size, 8, 6, 0, 0, 0))
           + chunk(b'IDAT', zlib.compress(raw, 9))
           + chunk(b'IEND', b''))
    with open(path, 'wb') as f:
        f.write(out)


def blend(pixels, size, x, y, color, alpha=1.0):
    if x < 0 or y < 0 or x >= size or y >= size or alpha <= 0:
        return
    i = (y * size + x) * 4
    r, g, b = color
    if alpha >= 1:
        pixels[i:i + 3] = bytes((r, g, b))
        pixels[i + 3] = 255
    else:
        for c in range(3):
            pixels[i + c] = int(pixels[i + c] * (1 - alpha) + color[c] * alpha)
        pixels[i + 3] = 255


def png_circle(pixels, size, cx, cy, r, color):
    for y in range(max(0, int(cy - r)), min(size, int(cy + r + 1))):
        for x in range(max(0, int(cx - r)), min(size, int(cx + r + 1))):
            d = ((x + .5 - cx) ** 2 + (y + .5 - cy) ** 2) ** .5
            if d <= r:
                blend(pixels, size, x, y, color, min(1, r - d + .5))


def png_ellipse(pixels, size, cx, cy, rx, ry, color):
    for y in range(max(0, int(cy - ry)), min(size, int(cy + ry + 1))):
        for x in range(max(0, int(cx - rx)), min(size, int(cx + rx + 1))):
            if ((x + .5 - cx) / rx) ** 2 + ((y + .5 - cy) / ry) ** 2 <= 1:
                blend(pixels, size, x, y, color)


def make_icon(path, size, maskable=False):
    px = bytearray(size * size * 4)
    bg = (255, 244, 222)
    for i in range(0, len(px), 4):
        px[i:i + 3] = bytes(bg)
        px[i + 3] = 255
    scale = .80 if maskable else 1.0
    cx = cy = size / 2
    png_circle(px, size, cx, cy + size * .03, size * .33 * scale, (224, 123, 57))
    png_circle(px, size, cx, cy + size * .03, size * .28 * scale, (239, 154, 78))
    # листик
    png_ellipse(px, size, cx + size * .10 * scale, cy - size * .24 * scale,
                size * .09 * scale, size * .045 * scale, (46, 107, 102))
    # «речевые» точки внутри — три светлых кружка
    for dx in (-.10, 0, .10):
        png_circle(px, size, cx + size * dx * scale, cy + size * .03, size * .035 * scale, (255, 249, 236))
    png_write(path, size, px)


def main():
    os.makedirs(IMG, exist_ok=True)
    os.makedirs(ICONS, exist_ok=True)

    scenes = BACKGROUNDS
    for name, fn in scenes.items():
        with open(os.path.join(IMG, name + '.svg'), 'w', encoding='utf-8') as f:
            f.write(fn())

    chars = CHARACTERS
    for name, fn in chars.items():
        with open(os.path.join(IMG, name + '.svg'), 'w', encoding='utf-8') as f:
            f.write(fn())

    all_items = dict(ITEMS)
    all_items.update(NEW_ITEMS)
    for name, inner in all_items.items():
        with open(os.path.join(IMG, 'item-' + name + '.svg'), 'w', encoding='utf-8') as f:
            f.write(item_svg(inner))

    all_gestures = dict(GESTURES)
    all_gestures.update(NEW_GESTURES)
    for name, inner in all_gestures.items():
        with open(os.path.join(IMG, 'gest-' + name + '.svg'), 'w', encoding='utf-8') as f:
            f.write(item_svg(inner))

    make_icon(os.path.join(ICONS, 'icon-192.png'), 192)
    make_icon(os.path.join(ICONS, 'icon-512.png'), 512)
    make_icon(os.path.join(ICONS, 'icon-512-maskable.png'), 512, maskable=True)

    # Проверяем, что каждый SVG — корректный XML: иначе браузер его не покажет.
    import xml.etree.ElementTree as ET
    bad = []
    for name in sorted(os.listdir(IMG)):
        if name.endswith('.svg'):
            try:
                ET.parse(os.path.join(IMG, name))
            except Exception as exc:
                bad.append('%s: %s' % (name, exc))
    if bad:
        raise SystemExit('Некорректные SVG:\n' + '\n'.join(bad))

    print('Фонов:', len(scenes), 'персонажей:', len(chars), 'предметов:', len(all_items), 'жестов:', len(all_gestures))


if __name__ == '__main__':
    main()
