# -*- coding: utf-8 -*-
"""Фоны сцен: тёплая рисованная книга, а не набор прямоугольников.

Все сцены 800x450. Пол — 320..450, персонаж встаёт по центру нижнего края.
Модуль подключается в tools/make-art.py и постепенно заменяет старые фоны.
"""

OUTLINE = '#4A342A'

DEFS = '''
<linearGradient id="wall" x1="0" y1="0" x2="0" y2="1">
  <stop offset="0" stop-color="#FFF9EC"/><stop offset="1" stop-color="#F2D8B2"/>
</linearGradient>
<linearGradient id="wallCool" x1="0" y1="0" x2="0" y2="1">
  <stop offset="0" stop-color="#F7F1E4"/><stop offset="1" stop-color="#E9D3B4"/>
</linearGradient>
<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
  <stop offset="0" stop-color="#BBDDE6"/><stop offset="1" stop-color="#FBE6BE"/>
</linearGradient>
<linearGradient id="glass" x1="0" y1="0" x2="1" y2="1">
  <stop offset="0" stop-color="#FFFFFF" stop-opacity=".35"/>
  <stop offset=".45" stop-color="#FFFFFF" stop-opacity="0"/>
</linearGradient>
<radialGradient id="glow">
  <stop offset="0" stop-color="#FFE9A8" stop-opacity=".9"/>
  <stop offset="1" stop-color="#FFE9A8" stop-opacity="0"/>
</radialGradient>
<pattern id="planks" width="100" height="36" patternUnits="userSpaceOnUse">
  <rect width="100" height="36" fill="#D8A870"/>
  <path d="M0 0H100 M0 35H100 M50 0V36" stroke="#B9834F" stroke-width="1.4" opacity=".55"/>
  <path d="M8 6q14 4 26 0" stroke="#C9955E" stroke-width="1.2" opacity=".45" fill="none"/>
</pattern>
<pattern id="tiles" width="64" height="64" patternUnits="userSpaceOnUse">
  <rect width="64" height="64" fill="#EAD9C0"/>
  <path d="M0 0H64 M0 0V64" stroke="#CDB695" stroke-width="2" opacity=".6"/>
</pattern>
'''


def wrap(body):
    return (
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 450" width="800" height="450" '
        'preserveAspectRatio="xMidYMid slice">\n<defs>%s</defs>\n'
        '<g stroke="%s" stroke-width="3" stroke-linejoin="round" stroke-linecap="round">%s</g>\n</svg>\n'
        % (DEFS, OUTLINE, body)
    )


def shadow(cx, cy, rx, ry, op='.14'):
    return '<ellipse cx="%d" cy="%d" rx="%d" ry="%d" fill="#6B4324" stroke="none" opacity="%s"/>' % (cx, cy, rx, ry, op)


def room_shell(floor='#D8A870', wall='url(#wall)', skirting='#F4DDBB'):
    return '''
<rect width="800" height="450" fill="%s" stroke="none"/>
<rect y="320" width="800" height="130" fill="%s" stroke="none"/>
<rect y="312" width="800" height="14" fill="%s" stroke="none"/>
<path d="M0 326H800" stroke="#B98A5E" stroke-width="3" opacity=".55"/>
''' % (wall, floor, skirting)


def window_unit(x, y, w, h, curtains='#E39A5A', sill=True):
    """Окно с осенним видом, рамой, бликом и подоконником."""
    return '''
<g transform="translate(%d,%d)">
  <rect x="-12" y="-12" width="%d" height="%d" rx="10" fill="#C99C6B"/>
  <rect x="0" y="0" width="%d" height="%d" rx="5" fill="url(#sky)"/>
  <circle cx="%d" cy="%d" r="%d" fill="#E07B39" opacity=".85" stroke="none"/>
  <circle cx="%d" cy="%d" r="%d" fill="#F2B23E" opacity=".9" stroke="none"/>
  <circle cx="%d" cy="%d" r="%d" fill="#C95F35" opacity=".8" stroke="none"/>
  <path d="M%d %dv%d M%d %dv%d M%d %dv%d" stroke="#8B5A36" stroke-width="6" opacity=".8"/>
  <path d="M0 0H%d M0 %dH%d" stroke="#4A342A" stroke-width="8"/>
  <rect width="%d" height="%d" fill="url(#glass)" stroke="none"/>
  <path d="M%d 0V%d M0 %dH%d" stroke="#4A342A" stroke-width="8"/>
  <rect x="-16" y="-16" width="%d" height="10" rx="4" fill="#A86F45"/>
</g>
''' % (x, y, w + 24, h + 24, w, h,
       int(w * .22), int(h * .62), int(h * .22),
       int(w * .45), int(h * .43), int(h * .19),
       int(w * .76), int(h * .58), int(h * .23),
       int(w * .22), h, int(w * .22), int(w * .45), h, int(w * .45), int(w * .76), h,
       w, int(h * .52), w,
       w, h, int(w * .5), h, int(w * .5), w,
       w + 32)


def curtain(x, y, w, h, color='#E39A5A'):
    return '''
<path d="M%d %d h%d l-14 %d h-%d Z" fill="%s"/>
<path d="M%d %d v%d" stroke="#C97F44" stroke-width="3" opacity=".6"/>
''' % (x, y, w, h, w - 14, color, x + w // 2, y, h)


def picture(x, y, w=110, h=90):
    return '''
<g transform="translate(%d,%d)">
  <rect width="%d" height="%d" rx="6" fill="#C99C6B"/>
  <rect x="9" y="9" width="%d" height="%d" rx="3" fill="#FFF6E4"/>
  <path d="M9 %d l30-34 22 24 20-20 28 30 z" fill="#E39A5A" stroke="none"/>
  <circle cx="%d" cy="28" r="10" fill="#F2B23E" stroke="none"/>
</g>
''' % (x, y, w, h, w - 18, h - 18, h - 22, w - 40)


def shelf(x, y, w=210):
    return '''
<g transform="translate(%d,%d)">
  <rect x="0" y="54" width="%d" height="12" rx="5" fill="#A97146"/>
  <path d="M18 66v22 M%d 66v22" stroke="#8B5A36" stroke-width="6"/>
  <rect x="18" y="18" width="16" height="36" rx="2" fill="#2E6B66"/>
  <rect x="40" y="24" width="14" height="30" rx="2" fill="#E07B39"/>
  <rect x="60" y="10" width="18" height="44" rx="2" fill="#C25B4E"/>
  <rect x="86" y="26" width="12" height="28" rx="2" fill="#F2B23E"/>
  <path d="M136 54c-16-20-8-42 4-48 12 8 18 30 4 48z" fill="#4F8A5B"/>
  <rect x="132" y="50" width="18" height="10" rx="3" fill="#B65C25"/>
</g>
''' % (x, y, w, w - 18)


def couch(x, y, w=290, color='#E39A5A'):
    """Диван с подушками, подлокотниками и ножками."""
    return '''
<g transform="translate(%d,%d)">
  %s
  <path d="M10 60 q0-38 34-38 h%d q34 0 34 38 v64 H10 Z" fill="%s"/>
  <rect x="22" y="58" width="%d" height="52" rx="14" fill="#F6C88F"/>
  <rect x="%d" y="58" width="%d" height="52" rx="14" fill="#E8A86A"/>
  <path d="M10 96 q-18 0-18 20 v22 q0 16 16 16 h%d q16 0 16-16 v-22 q0-20-18-20 Z" fill="%s"/>
  <path d="M%d 96 q18 0 18 20 v22 q0 16-16 16 h-%d q-16 0-16-16 v-22 q0-20 18-20 Z" fill="%s"/>
  <rect x="10" y="120" width="%d" height="40" rx="10" fill="#D9894D"/>
  <path d="M26 160v18 M%d 160v18" stroke="#8B5A36" stroke-width="9"/>
  <path d="M28 70 q10 4 20 0" stroke="#B96C3C" stroke-width="2" opacity=".5"/>
</g>
''' % (x, y, shadow(0, 0, 1, 1, '0'), w - 68, color,
       int((w - 68) * .45), int((w - 68) * .48), int((w - 68) * .43),
       w - 4, color, w - 14, 28, color, w - 20, w - 60)


def table(x, y, w=170):
    return '''
<g transform="translate(%d,%d)">
  %s
  <ellipse cx="%d" cy="0" rx="%d" ry="22" fill="#C08A57"/>
  <rect x="0" y="-4" width="%d" height="18" rx="9" fill="#D8A870"/>
  <path d="M24 14v56 M%d 14v56" stroke="#8B5A36" stroke-width="10"/>
  <rect x="46" y="-24" width="46" height="18" rx="3" fill="#FFF6E4"/>
  <path d="M54-24v18" stroke="#E07B39" stroke-width="2"/>
  <circle cx="%d" cy="-26" r="10" fill="#D94F3D"/>
</g>
''' % (x, y, shadow(w // 2, 72, w // 2 - 10, 12), w // 2, w // 2, w, w - 24, w - 40)


def lamp(x, y, h=150):
    return '''
<g transform="translate(%d,%d)">
  <circle cx="0" cy="%d" r="90" fill="url(#glow)" stroke="none"/>
  <path d="M-52 0 h104 l-18 56 h-68 Z" fill="#F2B23E"/>
  <path d="M0 56v%d" stroke="#8B5A36" stroke-width="9"/>
  <ellipse cx="0" cy="%d" rx="34" ry="9" fill="#8B5A36"/>
</g>
''' % (x, y, h - 30, h - 56, h)


def bg_room():
    body = room_shell() + '''
<g transform="translate(500,42)">
  <rect x="-16" y="-16" width="270" height="210" rx="10" fill="#C99C6B"/>
  <rect width="240" height="180" rx="4" fill="url(#sky)"/>
  <circle cx="52" cy="112" r="40" fill="#E07B39" opacity=".85" stroke="none"/>
  <circle cx="106" cy="82" r="34" fill="#F2B23E" opacity=".9" stroke="none"/>
  <circle cx="184" cy="108" r="44" fill="#C95F35" opacity=".8" stroke="none"/>
  <path d="M52 148v22 M106 120v50 M184 144v26" stroke="#8B5A36" stroke-width="6"/>
  <path d="M0 0H240 M0 90H240 M120 0V180" stroke="#4A342A" stroke-width="8"/>
  <rect width="240" height="180" fill="url(#glass)" stroke="none"/>
  <rect x="-16" y="180" width="272" height="14" rx="5" fill="#A86F45"/>
</g>
''' + shelf(60, 62) + picture(330, 58) + '''
<circle cx="710" cy="220" r="120" fill="url(#glow)" stroke="none"/>
''' + couch(40, 200, 300) + table(335, 300, 175) + lamp(718, 245, 150) + '''
<ellipse cx="360" cy="400" rx="245" ry="36" fill="#D98E52" opacity=".9"/>
<ellipse cx="360" cy="400" rx="205" ry="26" fill="none" stroke="#F2C98E" stroke-width="5"/>
<path d="M180 400q180 40 360 0" fill="none" stroke="#F2C98E" stroke-width="3" opacity=".7"/>
<!-- тёплый свет из окна на пол -->
<path d="M520 250 l180 0 l70 130 l-210 0 Z" fill="#FFE9A8" opacity=".18" stroke="none"/>
'''
    return wrap(body)


def bg_window():
    body = room_shell(wall='url(#wallCool)') + '''
<g transform="translate(150,24)">
  <rect x="-18" y="-18" width="516" height="312" rx="14" fill="#C99C6B"/>
  <rect width="480" height="280" rx="6" fill="url(#sky)"/>
  <circle cx="120" cy="210" r="82" fill="#E07B39" opacity=".85" stroke="none"/>
  <circle cx="245" cy="186" r="70" fill="#F2B23E" opacity=".9" stroke="none"/>
  <circle cx="390" cy="200" r="86" fill="#C95F35" opacity=".8" stroke="none"/>
  <path d="M120 264V190 M245 264V176 M390 264V184" stroke="#7B5236" stroke-width="14"/>
  <path d="M0 0H480 M0 140H480 M240 0V280" stroke="#4A342A" stroke-width="10"/>
  <rect width="480" height="280" fill="url(#glass)" stroke="none"/>
  <rect x="-18" y="280" width="516" height="24" rx="8" fill="#A86F45"/>
</g>
<g transform="translate(220,300)">
  <path d="M0 0h58v36a14 14 0 0 1-14 14H14A14 14 0 0 1 0 36Z" fill="#FFF6E4"/>
  <path d="M58 8h12a13 13 0 0 1 0 26H58" fill="none"/>
  <path d="M14-8c0-8 8-12 8-20 M36-8c0-8 8-12 8-20" stroke="#B9834F" stroke-width="2"/>
</g>
<g transform="translate(560,282)">
  <path d="M0 0h56l-8 28H8Z" fill="#B65C25"/>
  <path d="M28-4c-26-24-12-64 0-70 14 8 26 46 0 70Z" fill="#4F8A5B"/>
  <path d="M28-4v-70" stroke="#3C6B45" stroke-width="3"/>
</g>
<!-- свет на стене и полу -->
<path d="M160 320 l480 0 l40 90 l-540 0 Z" fill="#FFE9A8" opacity=".2" stroke="none"/>
'''
    return wrap(body)


def bg_hallway():
    body = room_shell() + '''
<!-- дверь -->
<g transform="translate(548,52)">
  <rect x="-10" y="-10" width="214" height="278" rx="10" fill="#C99C6B"/>
  <rect width="194" height="258" rx="6" fill="#B67D4B"/>
  <rect x="20" y="20" width="62" height="82" rx="6" fill="#C98D58"/>
  <rect x="112" y="20" width="62" height="82" rx="6" fill="#C98D58"/>
  <rect x="20" y="126" width="62" height="108" rx="6" fill="#C98D58"/>
  <rect x="112" y="126" width="62" height="108" rx="6" fill="#C98D58"/>
  <circle cx="168" cy="138" r="7" fill="#F2B23E"/>
  <path d="M-10 248h214" stroke-width="5"/>
</g>
<!-- вешалка -->
<g transform="translate(80,92)">
  <rect width="236" height="14" rx="6" fill="#A97146"/>
  <circle cx="18" cy="7" r="3" fill="#8B5A36" stroke="none"/>
  <circle cx="218" cy="7" r="3" fill="#8B5A36" stroke="none"/>
  <path d="M34 14c-8 8-8 16 0 20 M118 14c-8 8-8 16 0 20 M202 14c-8 8-8 16 0 20" fill="none" stroke-width="5"/>
  <path d="M18 34h30l10 132H8Z" fill="#2E6B66"/>
  <path d="M104 34h28l10 118h-48Z" fill="#C25B4E"/>
  <path d="M188 34h30l10 144h-50Z" fill="#E07B39"/>
  <path d="M132 34q14 32 4 58" fill="none" stroke="#F2B23E" stroke-width="7"/>
</g>
<!-- скамейка -->
<g transform="translate(66,300)">
  <rect x="0" y="0" width="260" height="20" rx="9" fill="#C08A57"/>
  <path d="M22 20v50 M238 20v50" stroke="#8B5A36" stroke-width="10"/>
  <path d="M46 34c0-18 20-24 32-12 8-10 28-4 28 12Z" fill="#8B5A36"/>
  <path d="M132 34c0-18 20-24 32-12 8-10 28-4 28 12Z" fill="#2E6B66"/>
  <path d="M18 70h224" stroke="#8B5A36" stroke-width="3" opacity=".4"/>
</g>
<!-- ключница -->
<g transform="translate(390,120)">
  <rect width="70" height="46" rx="6" fill="#C08A57"/>
  <circle cx="35" cy="18" r="4" fill="#F2B23E"/>
  <path d="M30 24v14 M35 30h7" stroke="#F2B23E" stroke-width="4"/>
</g>
<ellipse cx="410" cy="404" rx="220" ry="34" fill="#D98E52" opacity=".9"/>
<ellipse cx="410" cy="404" rx="186" ry="24" fill="none" stroke="#F2C98E" stroke-width="5"/>
'''
    return wrap(body)


def bg_kitchen():
    body = room_shell(floor='url(#tiles)', skirting='#E8D4B4') + '''
<rect x="40" y="44" width="300" height="104" rx="8" fill="#D8A870"/>
<rect x="52" y="56" width="128" height="80" rx="5" fill="#E8BE8E"/>
<rect x="188" y="56" width="128" height="80" rx="5" fill="#E8BE8E"/>
<circle cx="174" cy="96" r="4" fill="#8B5A36"/>
<circle cx="194" cy="96" r="4" fill="#8B5A36"/>
<rect x="40" y="252" width="330" height="86" rx="8" fill="#C08A57"/>
<rect x="52" y="238" width="306" height="18" rx="7" fill="#E8C79B"/>
<rect x="60" y="268" width="86" height="62" rx="5" fill="#D8A870"/>
<rect x="156" y="268" width="86" height="62" rx="5" fill="#D8A870"/>
<rect x="252" y="268" width="94" height="62" rx="5" fill="#D8A870"/>
<circle cx="102" cy="298" r="4" fill="#8B5A36"/>
<circle cx="198" cy="298" r="4" fill="#8B5A36"/>
<rect x="288" y="174" width="78" height="64" rx="6" fill="#FFF6E4"/>
<rect x="294" y="180" width="66" height="14" rx="4" fill="#4A342A"/>
<circle cx="310" cy="187" r="5" fill="#6E7E78" stroke="none"/>
<circle cx="330" cy="187" r="5" fill="#6E7E78" stroke="none"/>
<circle cx="350" cy="187" r="5" fill="#6E7E78" stroke="none"/>
<rect x="294" y="200" width="66" height="30" rx="4" fill="#E8BE8E"/>
<path d="M300 206h54" stroke="#8B5A36" stroke-width="4"/>
<circle cx="302" cy="230" r="4" fill="#8B5A36"/>
<circle cx="330" cy="230" r="4" fill="#8B5A36"/>
<circle cx="358" cy="230" r="4" fill="#8B5A36"/>
<rect x="560" y="152" width="164" height="170" rx="10" fill="#FFF6E4"/>
<path d="M560 200h164" stroke-width="3"/>
<circle cx="700" cy="178" r="5" fill="#F2B23E"/>
<rect x="560" y="254" width="164" height="10" fill="#E8D4B4"/>
<rect x="560" y="40" width="196" height="96" rx="7" fill="#C99C6B"/>
<rect x="570" y="50" width="176" height="76" rx="4" fill="url(#sky)"/>
<circle cx="608" cy="106" r="22" fill="#E07B39" opacity=".85" stroke="none"/>
<circle cx="652" cy="98" r="18" fill="#F2B23E" opacity=".9" stroke="none"/>
<circle cx="694" cy="108" r="26" fill="#C95F35" opacity=".8" stroke="none"/>
<path d="M570 50h176 M570 88h176 M658 50v76" stroke-width="5"/>
<rect x="560" y="136" width="196" height="12" rx="4" fill="#A86F45"/>
<g transform="translate(330,300)">
  <ellipse cx="80" cy="20" rx="86" ry="20" fill="#C08A57"/>
  <rect x="0" y="8" width="160" height="16" rx="8" fill="#D8A870"/>
  <path d="M24 24v54 M136 24v54" stroke="#8B5A36" stroke-width="8"/>
  <ellipse cx="58" cy="6" rx="20" ry="5" fill="#FFF6E4"/>
  <circle cx="126" cy="2" r="9" fill="#D94F3D"/>
</g>
'''
    return wrap(body)


def bg_cashier():
    body = room_shell(floor='url(#tiles)', skirting='#E8D4B4') + '''
<g transform="translate(30,56)">
  <rect width="740" height="82" rx="8" fill="#D8A870"/>
  <rect x="12" y="12" width="700" height="58" rx="5" fill="#E8BE8E"/>
  <rect x="40" y="26" width="40" height="30" rx="4" fill="#D94F3D" stroke="none"/>
  <rect x="110" y="22" width="28" height="38" rx="4" fill="#FFF6E4"/>
  <rect x="180" y="30" width="50" height="26" rx="4" fill="#F2B23E" stroke="none"/>
  <circle cx="280" cy="42" r="16" fill="#4F8A5B" stroke="none"/>
  <rect x="340" y="20" width="30" height="42" rx="4" fill="#BFE0E6"/>
  <rect x="420" y="28" width="44" height="30" rx="4" fill="#E07B39" stroke="none"/>
  <rect x="520" y="20" width="30" height="42" rx="4" fill="#FFF6E4"/>
  <circle cx="620" cy="42" r="16" fill="#D94F3D" stroke="none"/>
</g>
<g transform="translate(60,300)">
  <rect width="680" height="92" rx="10" fill="#B67D4B"/>
  <rect x="10" y="10" width="660" height="18" rx="7" fill="#D8A870"/>
  <rect x="40" y="34" width="320" height="20" rx="5" fill="#6E7E78"/>
  <path d="M54 44h292" stroke="#D8C3A1" stroke-width="3" stroke-dasharray="10 8"/>
  <circle cx="82" cy="28" r="12" fill="#D94F3D" stroke="none"/>
  <rect x="126" y="14" width="26" height="28" rx="4" fill="#FFF6E4"/>
  <circle cx="190" cy="28" r="12" fill="#F2B23E" stroke="none"/>
  <rect x="430" y="-52" width="150" height="60" rx="8" fill="#2E6B66"/>
  <rect x="444" y="-40" width="76" height="28" rx="4" fill="#BFE0E6"/>
  <circle cx="540" cy="-26" r="7" fill="#F2B23E" stroke="none"/>
  <circle cx="560" cy="-26" r="7" fill="#E07B39" stroke="none"/>
  <path d="M310 18h62l-9 36h-44Z" fill="#FFF6E4"/>
  <path d="M320 18l10-12 M362 18l-10-12" stroke-width="3"/>
</g>
<ellipse cx="400" cy="424" rx="330" ry="22" fill="#6B4324" opacity=".08" stroke="none"/>
'''
    return wrap(body)


def bg_shop_hall():
    body = room_shell(floor='url(#tiles)', skirting='#E8D4B4') + '''
<g transform="translate(28,58)">
  <rect width="744" height="14" rx="6" fill="#A97146"/>
  <rect x="0" y="116" width="744" height="14" rx="6" fill="#A97146"/>
  <rect x="0" y="238" width="744" height="14" rx="6" fill="#A97146"/>
  <path d="M30 14v224 M714 14v224" stroke-width="7"/>
  <path d="M60 14v100 M300 14v100 M540 14v100 M60 130v108 M300 130v108 M540 130v108" stroke-width="4" opacity=".5"/>
  <rect x="48" y="70" width="26" height="44" rx="5" fill="#FFF6E4"/>
  <rect x="86" y="78" width="30" height="36" rx="4" fill="#E07B39" stroke="none"/>
  <circle cx="140" cy="96" r="16" fill="#D94F3D" stroke="none"/>
  <rect x="176" y="64" width="24" height="50" rx="5" fill="#BFE0E6"/>
  <rect x="216" y="76" width="32" height="38" rx="4" fill="#F2B23E" stroke="none"/>
  <rect x="324" y="66" width="28" height="48" rx="5" fill="#FFF6E4"/>
  <circle cx="378" cy="96" r="16" fill="#4F8A5B" stroke="none"/>
  <rect x="414" y="72" width="30" height="42" rx="4" fill="#C25B4E"/>
  <rect x="466" y="80" width="24" height="34" rx="4" fill="#F2B23E" stroke="none"/>
  <rect x="508" y="66" width="28" height="48" rx="5" fill="#FFF6E4"/>
  <circle cx="576" cy="96" r="16" fill="#D94F3D" stroke="none"/>
  <rect x="614" y="74" width="30" height="40" rx="4" fill="#E07B39" stroke="none"/>
  <rect x="660" y="68" width="26" height="46" rx="5" fill="#BFE0E6"/>
  <rect x="48" y="186" width="28" height="48" rx="5" fill="#F2B23E"/>
  <circle cx="106" cy="212" r="15" fill="#4F8A5B" stroke="none"/>
  <rect x="142" y="180" width="30" height="54" rx="4" fill="#C25B4E"/>
  <rect x="196" y="190" width="24" height="44" rx="4" fill="#FFF6E4"/>
  <rect x="240" y="182" width="30" height="52" rx="4" fill="#E07B39" stroke="none"/>
  <rect x="324" y="190" width="26" height="44" rx="4" fill="#BFE0E6"/>
  <circle cx="376" cy="212" r="15" fill="#D94F3D" stroke="none"/>
  <rect x="412" y="184" width="28" height="50" rx="5" fill="#FFF6E4"/>
  <rect x="466" y="192" width="32" height="42" rx="4" fill="#F2B23E" stroke="none"/>
  <rect x="520" y="186" width="24" height="48" rx="4" fill="#4F8A5B"/>
  <rect x="570" y="190" width="30" height="44" rx="4" fill="#FFF6E4"/>
  <circle cx="640" cy="212" r="15" fill="#E07B39" stroke="none"/>
  <rect x="680" y="188" width="24" height="46" rx="4" fill="#C25B4E"/>
</g>
<path d="M0 320h800" stroke="#B98A5E" stroke-width="3" opacity=".5"/>
'''
    return wrap(body)


def bg_classroom():
    body = room_shell(floor='url(#tiles)', skirting='#E8D4B4') + '''
<g transform="translate(60,48)">
  <rect width="420" height="160" rx="8" fill="#2E4F43"/>
  <rect x="10" y="10" width="400" height="140" rx="4" fill="#3C6B55"/>
  <path d="M38 100q40-46 82 0 M160 86q34-30 60 4" fill="none" stroke="#E8E0C8" stroke-width="3" opacity=".8"/>
  <rect x="22" y="160" width="376" height="10" rx="4" fill="#8B5A36"/>
</g>
<g transform="translate(520,50)">
  <rect width="210" height="120" rx="7" fill="#C99C6B"/>
  <rect x="10" y="10" width="190" height="100" rx="4" fill="url(#sky)"/>
  <circle cx="62" cy="82" r="28" fill="#E07B39" opacity=".85" stroke="none"/>
  <circle cx="120" cy="72" r="22" fill="#F2B23E" opacity=".9" stroke="none"/>
  <path d="M10 10h190 M10 60h190 M105 10v100" stroke-width="5"/>
</g>
<g transform="translate(40,300)">
  <rect width="140" height="16" rx="6" fill="#C08A57"/>
  <path d="M16 16v52 M124 16v52" stroke="#8B5A36" stroke-width="7"/>
  <rect x="24" y="-24" width="92" height="24" rx="4" fill="#E8BE8E"/>
</g>
<g transform="translate(220,320)">
  <rect width="130" height="14" rx="6" fill="#C08A57"/>
  <path d="M14 14v48 M116 14v48" stroke="#8B5A36" stroke-width="7"/>
  <rect x="22" y="-22" width="86" height="22" rx="4" fill="#E8BE8E"/>
</g>
<g transform="translate(600,300)">
  <rect width="150" height="18" rx="7" fill="#B67D4B"/>
  <path d="M18 18v70 M132 18v70" stroke="#8B5A36" stroke-width="9"/>
  <rect x="22" y="-30" width="106" height="30" rx="5" fill="#E8BE8E"/>
</g>
<circle cx="400" cy="140" r="34" fill="#FFF6E4" opacity=".9"/>
<path d="M400 112v28l18 12" stroke="#4A342A" stroke-width="3"/>
'''
    return wrap(body)


def bg_playground():
    body = '''
<rect width="800" height="450" fill="url(#sky)" stroke="none"/>
<circle cx="704" cy="64" r="32" fill="#F2B23E" stroke="none"/>
<path d="M74 64q18-24 44-10 12-26 40-12 24-16 36 22z" fill="#FFFDF7" stroke="none" opacity=".9"/>
<path d="M0 300q160-26 320-8t480-10v168H0Z" fill="#B7C58C" stroke="none"/>
<path d="M0 300q160-26 320-8t480-10" fill="none" stroke="#6E8B5E" stroke-width="4" opacity=".45"/>
<!-- забор -->
<g stroke="#8B5A36" stroke-width="5" opacity=".7">
  <path d="M0 286h800 M0 306h800"/>
  <path d="M26 272v44 M86 272v44 M146 272v44 M206 272v44 M266 272v44 M326 272v44 M386 272v44 M446 272v44 M506 272v44 M566 272v44 M626 272v44 M686 272v44 M746 272v44"/>
</g>
<!-- деревья -->
<g transform="translate(54,196)">
  <circle cx="0" cy="0" r="40" fill="#C95F35" stroke="none"/>
  <circle cx="30" cy="-14" r="30" fill="#E07B39" stroke="none"/>
  <path d="M10 30v110" stroke="#8B5A36" stroke-width="10"/>
</g>
<g transform="translate(742,190)">
  <circle cx="0" cy="0" r="38" fill="#E07B39" stroke="none"/>
  <circle cx="-26" cy="-8" r="28" fill="#F2B23E" stroke="none"/>
  <path d="M0 32v100" stroke="#8B5A36" stroke-width="9"/>
</g>
<!-- качели: прямые стойки и две качели -->
<g transform="translate(92,146)">
  <path d="M0 0v250 M228 0v250" stroke-width="11"/>
  <path d="M0 0h228" stroke-width="13"/>
  <path d="M0 0l-24 44 M228 0l24 44" stroke-width="7"/>
  <path d="M56 10v142 M78 10v142" stroke="#8B5A36" stroke-width="4"/>
  <rect x="46" y="152" width="42" height="13" rx="6" fill="#C08A57"/>
  <path d="M150 10v164 M172 10v164" stroke="#8B5A36" stroke-width="4"/>
  <rect x="140" y="174" width="42" height="13" rx="6" fill="#E07B39"/>
</g>
<!-- горка -->
<g transform="translate(528,188)">
  <path d="M0 0v202 M44 0v202" stroke="#8B5A36" stroke-width="7"/>
  <path d="M0 26h44 M0 58h44 M0 90h44 M0 122h44 M0 154h44 M0 186h44" stroke="#8B5A36" stroke-width="5"/>
  <rect x="-8" y="-14" width="62" height="18" rx="6" fill="#2E6B66"/>
  <path d="M48 0 L84 16 L18 202 L-28 202 Z" fill="#F2B23E"/>
  <path d="M54 18 L90 34 L24 202" fill="none" stroke="#B65C25" stroke-width="4" opacity=".6"/>
  <path d="M-28 202h46" stroke="#4A342A" stroke-width="6"/>
</g>
<!-- песочница -->
<g transform="translate(584,338)">
  <rect x="0" y="18" width="184" height="16" rx="5" fill="#C08A57"/>
  <rect x="0" y="34" width="184" height="34" rx="4" fill="#B67D4B"/>
  <ellipse cx="92" cy="26" rx="82" ry="18" fill="#E8C79B"/>
  <path d="M24 18h136" stroke="#C08A57" stroke-width="3" opacity=".6"/>
  <path d="M42 0h28l-4 18H46Z" fill="#2E6B66"/>
  <path d="M86 18l9-26 9 26Z" fill="#E07B39"/>
</g>
<path d="M340 450q22-60 60-60t60 60Z" fill="#D8C3A1" stroke="none"/>
<path d="M0 412h800" stroke="#7D6B4A" stroke-width="4" opacity=".3"/>
'''
    return wrap(body)


def _sky(ground='#B7C58C'):
    return '''
<rect width="800" height="450" fill="url(#sky)" stroke="none"/>
<circle cx="690" cy="64" r="30" fill="#F2B23E" stroke="none"/>
<path d="M90 70q18-22 42-8 12-24 38-10 22-14 34 18z" fill="#FFFDF7" stroke="none" opacity=".85"/>
<path d="M0 330q160-24 320-6t480-8v134H0Z" fill="%s" stroke="none"/>
''' % ground


def bg_street():
    body = _sky('#C9CFA0') + '''
<rect y="388" width="800" height="62" fill="#9A9184" stroke="none"/>
<path d="M0 388h800" stroke="#6E665A" stroke-width="4"/>
<path d="M40 420h60 M150 420h60 M260 420h60 M370 420h60 M480 420h60 M590 420h60 M700 420h60" stroke="#FFF6E4" stroke-width="6" opacity=".85"/>
<g transform="translate(60,164)">
  <path d="M0 120V36L80 0l80 36v84Z" fill="#E8BE8E"/>
  <path d="M-10 38L80 0l90 38" fill="none" stroke="#B65C25" stroke-width="10"/>
  <rect x="28" y="56" width="32" height="34" rx="3" fill="url(#sky)"/>
  <rect x="100" y="56" width="32" height="34" rx="3" fill="url(#sky)"/>
  <rect x="64" y="104" width="32" height="52" rx="3" fill="#8B5A36"/>
</g>
<g transform="translate(300,140)">
  <path d="M0 144V52L86 8l86 44v92Z" fill="#F2D8B2"/>
  <path d="M-10 54L86 8l96 46" fill="none" stroke="#2E6B66" stroke-width="12"/>
  <rect x="22" y="70" width="38" height="40" rx="3" fill="url(#sky)"/>
  <rect x="112" y="70" width="38" height="40" rx="3" fill="url(#sky)"/>
  <rect x="72" y="116" width="42" height="60" rx="3" fill="#2E6B66"/>
</g>
<g transform="translate(560,176)">
  <path d="M0 108V40L70 4l70 36v84Z" fill="#E39A5A"/>
  <path d="M-8 42L70 4l78 38" fill="none" stroke="#8E5A86" stroke-width="10"/>
  <rect x="22" y="54" width="32" height="32" rx="3" fill="url(#sky)"/>
  <rect x="92" y="54" width="32" height="32" rx="3" fill="url(#sky)"/>
  <rect x="58" y="96" width="32" height="48" rx="3" fill="#8B5A36"/>
</g>
<g transform="translate(200,110)">
  <circle cx="0" cy="0" r="44" fill="#E07B39" stroke="none"/>
  <circle cx="34" cy="10" r="32" fill="#F2B23E" stroke="none"/>
  <path d="M0 44v120" stroke="#8B5A36" stroke-width="10"/>
</g>
<g transform="translate(520,100)">
  <circle cx="0" cy="0" r="38" fill="#C95F35" stroke="none"/>
  <path d="M0 38v100" stroke="#8B5A36" stroke-width="9"/>
</g>
<g transform="translate(430,250)">
  <path d="M0 40V0h10v40Z" fill="#4A342A"/>
  <rect x="-6" y="-30" width="22" height="34" rx="9" fill="#F2B23E"/>
  <path d="M5 40v26" stroke="#4A342A" stroke-width="6"/>
</g>
'''
    return wrap(body)

def bg_shop_entrance():
    body = _sky('#D8C7A6') + '''
<rect y="360" width="800" height="90" fill="#C9B695" stroke="none"/>
<rect x="70" y="60" width="660" height="286" rx="8" fill="#F2D8B2"/>
<rect x="70" y="60" width="660" height="34" rx="8" fill="#C08A57"/>
<g transform="translate(96,100)">
  <path d="M0 0h608l-18 44H18Z" fill="#E07B39"/>
  <path d="M60 0v44 M150 0v44 M240 0v44 M330 0v44 M420 0v44 M510 0v44" stroke="#FFF6E4" stroke-width="18"/>
  <path d="M0 44h608" stroke="#B65C25" stroke-width="4"/>
</g>
<rect x="120" y="170" width="250" height="174" rx="6" fill="#BFE0E6"/>
<rect x="430" y="170" width="250" height="174" rx="6" fill="#BFE0E6"/>
<path d="M245 170v174 M555 170v174" stroke="#4A342A" stroke-width="6"/>
<rect x="345" y="170" width="110" height="174" rx="4" fill="#8B5A36"/>
<circle cx="370" cy="256" r="6" fill="#F2B23E"/>
<rect x="130" y="320" width="230" height="34" rx="6" fill="#C08A57"/>
<rect x="440" y="320" width="230" height="34" rx="6" fill="#C08A57"/>
<g transform="translate(150,292)">
  <circle cx="0" cy="0" r="20" fill="#D94F3D" stroke="none"/>
  <circle cx="40" cy="4" r="18" fill="#F2B23E" stroke="none"/>
  <circle cx="80" cy="0" r="20" fill="#4F8A5B" stroke="none"/>
</g>
<g transform="translate(500,286)">
  <path d="M0 0h120l-12 34H12Z" fill="#C08A57"/>
  <circle cx="26" cy="0" r="16" fill="#D94F3D" stroke="none"/>
  <circle cx="60" cy="-4" r="16" fill="#F2B23E" stroke="none"/>
  <circle cx="96" cy="0" r="16" fill="#E07B39" stroke="none"/>
</g>
<g transform="translate(300,352)">
  <circle cx="0" cy="0" r="18" fill="#4A342A"/>
  <circle cx="70" cy="0" r="18" fill="#4A342A"/>
  <path d="M-8-10h86l18 24H10Z" fill="#2E6B66"/>
  <path d="M20-10v24 M56-10v24" stroke="#8B5A36" stroke-width="4"/>
</g>
'''
    return wrap(body)

def bg_bedroom():
    body = room_shell() + '''
<g transform="translate(54,196)">
  <rect width="240" height="28" rx="8" fill="#8B5A36"/>
  <rect x="12" y="28" width="216" height="86" rx="8" fill="#E8A86A"/>
  <rect x="24" y="42" width="192" height="40" rx="6" fill="#F6C88F"/>
  <rect x="30" y="90" width="180" height="96" rx="8" fill="#E07B39"/>
  <path d="M30 120h180 M30 150h180" stroke="#C4602A" stroke-width="4" opacity=".6"/>
  <path d="M42 186v24 M208 186v24" stroke="#8B5A36" stroke-width="9"/>
</g>
<g transform="translate(330,316)">
  <rect width="90" height="60" rx="6" fill="#C08A57"/>
  <path d="M12 60v34 M78 60v34" stroke="#8B5A36" stroke-width="7"/>
  <rect x="18" y="-24" width="54" height="24" rx="4" fill="#FFF6E4"/>
  <circle cx="45" cy="-12" r="8" fill="#F2B23E"/>
</g>
<g transform="translate(600,186)">
  <rect width="150" height="150" rx="8" fill="#B67D4B"/>
  <path d="M75 0v150" stroke="#8B5A36" stroke-width="4"/>
  <circle cx="64" cy="76" r="5" fill="#F2B23E"/>
  <circle cx="86" cy="76" r="5" fill="#F2B23E"/>
</g>
<g transform="translate(560,40)">
  <rect width="190" height="110" rx="8" fill="#C99C6B"/>
  <rect x="10" y="10" width="170" height="90" rx="4" fill="url(#sky)"/>
  <circle cx="60" cy="72" r="24" fill="#E07B39" opacity=".85" stroke="none"/>
  <circle cx="112" cy="66" r="20" fill="#F2B23E" opacity=".9" stroke="none"/>
  <path d="M10 10h170 M10 55h170 M95 10v90" stroke-width="5"/>
</g>
<ellipse cx="400" cy="408" rx="170" ry="26" fill="#D98E52" opacity=".8"/>
'''
    return wrap(body)

def bg_bathroom():
    body = room_shell(floor='url(#tiles)', skirting='#E8D4B4') + '''
<g transform="translate(46,210)">
  <path d="M0 40h260v46q0 28-28 28H28q-28 0-28-28Z" fill="#FFF6E4"/>
  <path d="M0 40h260" stroke-width="5"/>
  <path d="M40 114v14 M220 114v14" stroke="#4A342A" stroke-width="6"/>
  <path d="M250 40h18q18 0 18 18t-18 18h-18" fill="none"/>
  <circle cx="230" cy="20" r="6" fill="#BFE0E6"/>
</g>
<g transform="translate(500,170)">
  <rect width="180" height="28" rx="8" fill="#FFF6E4"/>
  <rect x="34" y="28" width="112" height="100" rx="8" fill="#F2D8B2"/>
  <path d="M90 28v100" stroke="#C08A57" stroke-width="4"/>
  <ellipse cx="90" cy="0" rx="70" ry="8" fill="#BFE0E6"/>
  <circle cx="90" cy="-4" r="4" fill="#4A342A"/>
</g>
<g transform="translate(560,78)">
  <circle cx="90" cy="60" r="54" fill="#C99C6B"/>
  <circle cx="90" cy="60" r="42" fill="url(#sky)"/>
  <path d="M74 92q16-26 36-8" fill="none" stroke="#FFF6E4" stroke-width="3" opacity=".6"/>
</g>
<g transform="translate(76,120)">
  <rect width="130" height="12" rx="5" fill="#C08A57"/>
  <path d="M10 12v30 M120 12v30" stroke="#8B5A36" stroke-width="5"/>
  <rect x="20" y="-16" width="34" height="28" rx="4" fill="#FFF6E4"/>
  <rect x="62" y="-10" width="28" height="22" rx="4" fill="#BFE0E6"/>
  <rect x="98" y="-20" width="18" height="32" rx="6" fill="#F2B23E"/>
</g>
<g transform="translate(650,300)">
  <rect width="60" height="90" rx="8" fill="#FFF6E4"/>
  <rect x="8" y="10" width="44" height="50" rx="4" fill="#BFE0E6"/>
  <circle cx="30" cy="78" r="5" fill="#4A342A"/>
</g>
<path d="M0 320h800" stroke="#B9A077" stroke-width="3" opacity=".5"/>
'''
    return wrap(body)

def bg_entrance():
    body = room_shell(floor='url(#tiles)', skirting='#E8D4B4') + '''
<g transform="translate(470,40)">
  <rect width="250" height="290" rx="8" fill="#C99C6B"/>
  <rect x="12" y="12" width="226" height="266" rx="5" fill="#D8D2C6"/>
  <path d="M125 14v262" stroke="#4A342A" stroke-width="4"/>
  <circle cx="90" cy="146" r="5" fill="#F2B23E"/>
  <circle cx="160" cy="146" r="5" fill="#F2B23E"/>
  <rect x="20" y="-24" width="210" height="20" rx="6" fill="#2E6B66"/>
</g>
<g transform="translate(50,50)">
  <path d="M0 270h270 M0 220h270 M0 170h270 M0 120h270" stroke="#C08A57" stroke-width="8"/>
  <path d="M0 270v-150 M270 270v-90" stroke="#8B5A36" stroke-width="8"/>
  <rect x="0" y="260" width="270" height="20" fill="#C08A57"/>
  <rect x="0" y="210" width="270" height="20" fill="#C08A57"/>
  <rect x="0" y="160" width="270" height="20" fill="#C08A57"/>
  <rect x="0" y="110" width="270" height="20" fill="#C08A57"/>
</g>
<g transform="translate(300,64)">
  <rect width="130" height="190" rx="6" fill="#D8A870"/>
  <rect x="10" y="10" width="110" height="60" rx="4" fill="#E8BE8E"/>
  <rect x="10" y="80" width="110" height="60" rx="4" fill="#E8BE8E"/>
  <rect x="10" y="150" width="110" height="30" rx="4" fill="#C08A57"/>
</g>
<g transform="translate(340,300)">
  <path d="M0 0h90v60H0Z" fill="#C08A57"/>
  <circle cx="70" cy="20" r="4" fill="#F2B23E"/>
</g>
<path d="M0 320h800" stroke="#B9A077" stroke-width="3" opacity=".5"/>
'''
    return wrap(body)

def bg_street():
    body = _sky('#C9CFA0') + '''
<rect y="388" width="800" height="62" fill="#9A9184" stroke="none"/>
<path d="M0 388h800" stroke="#6E665A" stroke-width="4"/>
<path d="M40 420h60 M150 420h60 M260 420h60 M370 420h60 M480 420h60 M590 420h60 M700 420h60" stroke="#FFF6E4" stroke-width="6" opacity=".85"/>
<g transform="translate(70,206)">
  <path d="M0 124V40L82 0l82 40v84Z" fill="#E8BE8E"/>
  <path d="M-10 42L82 0l92 42" fill="none" stroke="#B65C25" stroke-width="10"/>
  <rect x="28" y="58" width="34" height="36" rx="3" fill="url(#sky)"/>
  <rect x="102" y="58" width="34" height="36" rx="3" fill="url(#sky)"/>
  <rect x="66" y="108" width="34" height="52" rx="3" fill="#8B5A36"/>
</g>
<g transform="translate(320,186)">
  <path d="M0 150V56L88 8l88 48v98Z" fill="#F2D8B2"/>
  <path d="M-10 58L88 8l98 50" fill="none" stroke="#2E6B66" stroke-width="12"/>
  <rect x="22" y="72" width="40" height="42" rx="3" fill="url(#sky)"/>
  <rect x="114" y="72" width="40" height="42" rx="3" fill="url(#sky)"/>
  <rect x="74" y="120" width="44" height="60" rx="3" fill="#2E6B66"/>
</g>
<g transform="translate(600,222)">
  <path d="M0 104V40L68 4l68 36v84Z" fill="#E39A5A"/>
  <path d="M-8 42L68 4l76 38" fill="none" stroke="#8E5A86" stroke-width="10"/>
  <rect x="20" y="54" width="30" height="30" rx="3" fill="url(#sky)"/>
  <rect x="88" y="54" width="30" height="30" rx="3" fill="url(#sky)"/>
  <rect x="56" y="94" width="30" height="46" rx="3" fill="#8B5A36"/>
</g>
<g transform="translate(220,150)">
  <circle cx="0" cy="0" r="42" fill="#E07B39" stroke="none"/>
  <circle cx="32" cy="12" r="30" fill="#F2B23E" stroke="none"/>
  <path d="M0 42v140" stroke="#8B5A36" stroke-width="10"/>
</g>
<g transform="translate(520,160)">
  <circle cx="0" cy="0" r="36" fill="#C95F35" stroke="none"/>
  <path d="M0 36v134" stroke="#8B5A36" stroke-width="9"/>
</g>

'''
    return wrap(body)


def bg_bus_stop():
    body = _sky('#C9CFA0') + '''
<rect y="388" width="800" height="62" fill="#9A9184" stroke="none"/>
<path d="M0 388h800" stroke="#6E665A" stroke-width="4"/>
<g transform="translate(80,150)">
  <rect width="380" height="20" rx="8" fill="#2E6B66"/>
  <path d="M20 20v170 M360 20v170" stroke="#2E6B66" stroke-width="10"/>
  <rect x="10" y="120" width="360" height="18" rx="8" fill="#C08A57"/>
  <path d="M40 138v54 M340 138v54" stroke="#8B5A36" stroke-width="8"/>
  <path d="M20 20h360" stroke="#4A342A" stroke-width="4"/>
</g>
<g transform="translate(500,170)">
  <rect width="16" height="174" rx="6" fill="#4A342A"/>
  <circle cx="8" cy="0" r="30" fill="#E07B39"/>
  <rect x="-10" y="-38" width="36" height="26" rx="4" fill="#FFF6E4"/>
  <path d="M2-26h12" stroke="#4A342A" stroke-width="4"/>
</g>
<g transform="translate(620,100)">
  <circle cx="0" cy="0" r="42" fill="#E07B39" stroke="none"/>
  <circle cx="30" cy="10" r="30" fill="#F2B23E" stroke="none"/>
  <path d="M0 42v130" stroke="#8B5A36" stroke-width="10"/>
</g>
<g transform="translate(250,120)">
  <circle cx="0" cy="0" r="34" fill="#C95F35" stroke="none"/>
  <path d="M0 34v110" stroke="#8B5A36" stroke-width="9"/>
</g>
'''
    return wrap(body)

def bg_bus():
    body = '''
<rect width="800" height="450" fill="#E8D4B4" stroke="none"/>
<rect y="330" width="800" height="120" fill="#B67D4B" stroke="none"/>
<rect x="30" y="40" width="740" height="210" rx="12" fill="#BFE0E6"/>
<rect x="30" y="40" width="740" height="210" rx="12" fill="url(#sky)" stroke="none" opacity=".5"/>
<path d="M30 40h740 M30 250h740" stroke="#4A342A" stroke-width="8"/>
<path d="M180 40v210 M340 40v210 M500 40v210 M660 40v210" stroke="#4A342A" stroke-width="6"/>
<g transform="translate(60,280)">
  <rect width="130" height="70" rx="10" fill="#2E6B66"/>
  <rect x="150" width="130" height="70" rx="10" fill="#2E6B66"/>
  <rect x="300" width="130" height="70" rx="10" fill="#2E6B66"/>
  <rect x="450" width="130" height="70" rx="10" fill="#2E6B66"/>
  <rect x="600" width="130" height="70" rx="10" fill="#2E6B66"/>
  <path d="M14 0v-30 M284 0v-30 M434 0v-30 M584 0v-30 M734 0v-30" stroke="#8B5A36" stroke-width="6"/>
</g>
<path d="M40 200h720" stroke="#F2B23E" stroke-width="6"/>
<path d="M100 110v140 M700 110v140" stroke="#F2B23E" stroke-width="5"/>
<g transform="translate(330,300)">
  <rect width="140" height="40" rx="8" fill="#4A342A"/>
  <circle cx="70" cy="14" r="16" fill="#FFF6E4"/>
</g>
<rect x="30" y="356" width="740" height="18" rx="6" fill="#8B5A36"/>
'''
    return wrap(body)

def bg_crosswalk():
    body = '''
<rect width="800" height="450" fill="url(#sky)" stroke="none"/>
<circle cx="704" cy="58" r="30" fill="#F2B23E" stroke="none"/>
<path d="M70 62q18-22 42-8 12-24 38-10 22-14 34 18z" fill="#FFFDF7" stroke="none" opacity=".9"/>
<!-- дальний тротуар -->
<rect y="282" width="800" height="46" fill="#C9B695" stroke="none"/>
<path d="M0 282h800" stroke="#A88C68" stroke-width="3" opacity=".6"/>
<path d="M0 322h800" stroke="#8B7458" stroke-width="4"/>
<!-- дома на дальней стороне -->
<g transform="translate(64,146)">
  <rect x="12" y="38" width="236" height="132" fill="#F2D8B2"/>
  <path d="M0 40 L130-24 260 40Z" fill="#E07B39"/>
  <path d="M0 40h260" stroke="#B65C25" stroke-width="5"/>
  <rect x="34" y="66" width="46" height="38" rx="3" fill="url(#sky)"/>
  <rect x="180" y="66" width="46" height="38" rx="3" fill="url(#sky)"/>
  <rect x="104" y="108" width="52" height="62" rx="3" fill="#8B5A36"/>
  <circle cx="146" cy="140" r="4" fill="#F2B23E"/>
  <path d="M28 170h204" stroke="#C08A57" stroke-width="3"/>
  <rect x="206" y="6" width="18" height="34" fill="#B65C25"/>
  <path d="M0 40v130h12V40Z" fill="#D8A870" opacity=".7"/>
</g>
<g transform="translate(536,170)">
  <rect x="10" y="30" width="190" height="106" fill="#E8BE8E"/>
  <path d="M0 32 L105-20 210 32Z" fill="#2E6B66"/>
  <path d="M0 32h210" stroke="#24544F" stroke-width="5"/>
  <rect x="32" y="54" width="36" height="30" rx="3" fill="url(#sky)"/>
  <rect x="142" y="54" width="36" height="30" rx="3" fill="url(#sky)"/>
  <rect x="86" y="88" width="40" height="48" rx="3" fill="#8B5A36"/>
  <path d="M20 136h170" stroke="#C08A57" stroke-width="3"/>
</g>
<!-- деревья и кусты -->
<g transform="translate(342,180)">
  <circle cx="0" cy="0" r="30" fill="#E07B39" stroke="none"/>
  <circle cx="24" cy="8" r="24" fill="#F2B23E" stroke="none"/>
  <path d="M0 28v90" stroke="#8B5A36" stroke-width="8"/>
</g>
<g transform="translate(470,270)">
  <ellipse cx="0" cy="0" rx="34" ry="18" fill="#4F8A5B" stroke="none"/>
  <ellipse cx="26" cy="4" rx="24" ry="14" fill="#3C6B45" stroke="none"/>
</g>
<!-- дорога -->
<rect y="328" width="800" height="104" fill="#8E8578" stroke="none"/>
<path d="M0 328h800" stroke="#6E665A" stroke-width="4"/>
<!-- зебра: поперечные полосы -->
<g fill="#FFF6E4" stroke="none" opacity=".92">
  <rect x="190" y="342" width="420" height="13" rx="3"/>
  <rect x="190" y="365" width="420" height="13" rx="3"/>
  <rect x="190" y="388" width="420" height="13" rx="3"/>
  <rect x="190" y="411" width="420" height="13" rx="3"/>
</g>
<!-- светофор на тротуаре -->
<g transform="translate(690,190)">
  <rect x="14" y="0" width="12" height="150" rx="5" fill="#4A342A"/>
  <rect x="-16" y="-6" width="72" height="104" rx="10" fill="#4A342A"/>
  <circle cx="20" cy="18" r="12" fill="#C25B4E"/>
  <circle cx="20" cy="46" r="12" fill="#F2B23E"/>
  <circle cx="20" cy="74" r="12" fill="#4F8A5B"/>
  <path d="M14 150v60" stroke="#4A342A" stroke-width="10"/>
</g>
<!-- ближний тротуар -->
<rect y="432" width="800" height="18" fill="#C9B695" stroke="none"/>
<path d="M0 432h800" stroke="#8B7458" stroke-width="4"/>
<path d="M0 410h800" stroke="#7A7368" stroke-width="2" opacity=".4"/>
'''
    return wrap(body)


def bg_school_yard():
    body = _sky('#C9CFA0') + '''
<rect y="360" width="800" height="90" fill="#C9CFA0" stroke="none"/>
<path d="M320 450q40-90 80-90t80 90Z" fill="#D8C3A1" stroke="none"/>
<g transform="translate(120,92)">
  <rect width="560" height="250" rx="8" fill="#F2D8B2"/>
  <rect x="0" y="0" width="560" height="28" rx="8" fill="#C08A57"/>
  <rect x="40" y="46" width="80" height="64" rx="4" fill="url(#sky)"/>
  <rect x="160" y="46" width="80" height="64" rx="4" fill="url(#sky)"/>
  <rect x="320" y="46" width="80" height="64" rx="4" fill="url(#sky)"/>
  <rect x="440" y="46" width="80" height="64" rx="4" fill="url(#sky)"/>
  <rect x="40" y="140" width="80" height="64" rx="4" fill="url(#sky)"/>
  <rect x="440" y="140" width="80" height="64" rx="4" fill="url(#sky)"/>
  <rect x="240" y="150" width="80" height="100" rx="5" fill="#8B5A36"/>
  <circle cx="302" cy="204" r="5" fill="#F2B23E"/>
  <rect x="230" y="124" width="100" height="18" rx="6" fill="#2E6B66"/>
</g>
<g transform="translate(40,320)">
  <path d="M0 50V20h720v30" fill="none" stroke="#8B5A36" stroke-width="8"/>
  <path d="M40 20V0 M130 20V0 M220 20V0 M310 20V0 M400 20V0 M490 20V0 M580 20V0 M670 20V0" stroke="#8B5A36" stroke-width="6"/>
</g>
<g transform="translate(70,190)">
  <circle cx="0" cy="0" r="40" fill="#E07B39" stroke="none"/>
  <path d="M0 40v140" stroke="#8B5A36" stroke-width="10"/>
</g>
<g transform="translate(720,210)">
  <circle cx="0" cy="0" r="34" fill="#C95F35" stroke="none"/>
  <path d="M0 34v120" stroke="#8B5A36" stroke-width="9"/>
</g>
'''
    return wrap(body)

def bg_corridor():
    body = room_shell(floor='url(#tiles)', skirting='#E8D4B4') + '''
<g transform="translate(40,120)">
  <rect width="220" height="190" rx="6" fill="#C08A57"/>
  <rect x="10" y="10" width="200" height="170" rx="4" fill="#D8A870"/>
  <path d="M110 10v170" stroke="#8B5A36" stroke-width="4"/>
  <circle cx="100" cy="96" r="5" fill="#F2B23E"/>
  <circle cx="120" cy="96" r="5" fill="#F2B23E"/>
</g>
<g transform="translate(300,64)">
  <rect width="180" height="246" rx="6" fill="#D8A870"/>
  <rect x="10" y="10" width="160" height="80" rx="4" fill="#E8BE8E"/>
  <rect x="10" y="100" width="160" height="80" rx="4" fill="#E8BE8E"/>
  <rect x="10" y="190" width="160" height="46" rx="4" fill="#C08A57"/>
</g>
<g transform="translate(520,100)">
  <rect width="240" height="210" rx="6" fill="#B67D4B"/>
  <path d="M20 30h90v40H20Z M130 30h90v40h-90Z" fill="#C98D58"/>
  <path d="M20 90h90v40H20Z M130 90h90v40h-90Z" fill="#C98D58"/>
  <path d="M20 150h90v40H20Z M130 150h90v40h-90Z" fill="#C98D58"/>
</g>
<g transform="translate(340,20)">
  <rect width="120" height="24" rx="8" fill="#FFF6E4"/>
  <path d="M60 24v-6" stroke="#4A342A" stroke-width="4"/>
</g>
<g transform="translate(650,20)">
  <rect width="100" height="60" rx="5" fill="#FFF6E4"/>
  <rect x="10" y="10" width="80" height="40" rx="3" fill="#E07B39" stroke="none"/>
</g>
<path d="M0 320h800" stroke="#B9A077" stroke-width="3" opacity=".5"/>
'''
    return wrap(body)


BACKGROUNDS = {
    'bg-room': bg_room,
    'bg-window': bg_window,
    'bg-hallway': bg_hallway,
    'bg-street': bg_street,
    'bg-shop-entrance': bg_shop_entrance,
    'bg-shop-hall': bg_shop_hall,
    'bg-cashier': bg_cashier,
    'bg-kitchen': bg_kitchen,
    'bg-bedroom': bg_bedroom,
    'bg-bathroom': bg_bathroom,
    'bg-entrance': bg_entrance,
    'bg-playground': bg_playground,
    'bg-bus-stop': bg_bus_stop,
    'bg-bus': bg_bus,
    'bg-crosswalk': bg_crosswalk,
    'bg-school-yard': bg_school_yard,
    'bg-classroom': bg_classroom,
    'bg-corridor': bg_corridor,
}
