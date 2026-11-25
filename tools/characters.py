# -*- coding: utf-8 -*-
"""Персонажи приложения в стиле рисованной книжки.

Все фигуры собраны в одном viewBox 300x320, ноги и обувь перекрываются,
поэтому ботинки не отрываются от ног. Модуль используют tools/make-art.py.
"""
OUTLINE = '#4A342A'
SKIN = '#F2C9A0'
SKIN_SHADE = '#E8B48A'


def wrap(body):
    return (
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 320" width="300" height="320" '
        'preserveAspectRatio="xMidYMid meet">\n<defs></defs>\n'
        '<g stroke="%s" stroke-width="3" stroke-linejoin="round" stroke-linecap="round">%s</g>\n</svg>\n'
        % (OUTLINE, body)
    )


def _back_hair(color):
    return '''
<path d="M92 84 C88 40 112 14 150 14 C188 14 212 40 208 84 L206 122 C204 138 196 146 188 148 L186 98 C184 64 172 50 150 50 C128 50 116 64 114 98 L112 148 C104 146 96 138 94 122 Z" fill="%s"/>
''' % color


def _ears():
    return '''
<ellipse cx="97" cy="84" rx="9" ry="12" fill="%s"/>
<ellipse cx="203" cy="84" rx="9" ry="12" fill="%s"/>
''' % (SKIN, SKIN)


def _neck():
    return '''
<path d="M136 122 L136 148 Q150 156 164 148 L164 122 Z" fill="%s"/>
''' % SKIN_SHADE


def _arms():
    return '''
<path d="M120 150 C102 168 94 198 99 230 L113 236 C109 204 116 176 132 160 Z" fill="%s"/>
<path d="M180 150 C198 168 206 198 201 230 L187 236 C191 204 184 176 168 160 Z" fill="%s"/>
<path d="M96 226 q-10 6 -7 16 q4 10 15 7 q11 -4 9 -15 l-4 -8 Z" fill="%s"/>
<path d="M204 226 q10 6 7 16 q-4 10 -15 7 q-11 -4 -9 -15 l4 -8 Z" fill="%s"/>
<path d="M96 240 q6 2 10 -2 M204 240 q-6 2 -10 -2" fill="none" stroke="#C08A6A" stroke-width="2"/>
''' % (SKIN, SKIN, SKIN, SKIN)


def _adult_arms():
    return '''
<path d="M116 150 C92 170 82 200 88 232 L104 238 C100 206 108 178 128 160 Z" fill="%s"/>
<path d="M184 150 C208 170 218 200 212 232 L196 238 C200 206 192 178 172 160 Z" fill="%s"/>
<path d="M86 228 q-10 6 -7 16 q4 10 15 7 q11 -4 9 -15 l-4 -8 Z" fill="%s"/>
<path d="M214 228 q10 6 7 16 q-4 10 -15 7 q-11 -4 -9 -15 l4 -8 Z" fill="%s"/>
''' % (SKIN, SKIN, SKIN, SKIN)


def _legs(pants, cuff):
    return '''
<path d="M120 228 L148 228 L146 292 L116 292 Z" fill="%s"/>
<path d="M152 228 L180 228 L184 292 L154 292 Z" fill="%s"/>
<path d="M118 286 L146 286 M154 286 L182 286" stroke="%s" stroke-width="4"/>
''' % (pants, pants, cuff)


def _shoes(color):
    return '''
<path d="M112 288 h26 q8 0 10 8 l4 12 h-46 q-6 0 -6 -8 v-6 q0 -6 12 -6 Z" fill="%s"/>
<path d="M162 288 h26 q12 0 12 6 v6 q0 8 -6 8 h-46 l4 -12 q2 -8 10 -8 Z" fill="%s"/>
<path d="M109 296 h30 M163 296 h28" stroke="%s" stroke-width="3" opacity=".55"/>
<path d="M100 306 h50 M152 306 h48" stroke="%s" stroke-width="4"/>
''' % (color, color, OUTLINE, OUTLINE)


def _torso(shirt, long=False):
    bottom = 258 if long else 230
    return '''
<path d="M112 150 Q150 132 188 150 L184 %d Q150 242 116 %d Z" fill="%s"/>
''' % (bottom, bottom, shirt)


def _sleeves(shirt, long=False):
    if long:
        return '''
<path d="M120 150 C104 168 96 198 100 228 l14 6 C112 204 118 178 132 160 Z" fill="%s"/>
<path d="M180 150 C196 168 204 198 200 228 l-14 6 C188 204 182 178 168 160 Z" fill="%s"/>
''' % (shirt, shirt)
    return '''
<path d="M122 148 q-16 10 -22 30 l18 8 q8 -20 18 -30 Z" fill="%s"/>
<path d="M178 148 q16 10 22 30 l-18 8 q-8 -20 -18 -30 Z" fill="%s"/>
''' % (shirt, shirt)


def _collar(shirt_line='#FFF6E4', seam=None):
    seam_line = ('<path d="M150 154 v72" stroke="%s" stroke-width="2.5" opacity=".8"/>' % seam) if seam else ''
    return '''
<path d="M138 136 L150 152 L162 136 Z" fill="%s"/>
%s
''' % (shirt_line, seam_line)


def _face(girl=True, glasses=False):
    lashes = '''
<path d="M116 76 l-5 -3 M184 76 l5 -3" stroke-width="2.5"/>
''' if girl else '''
<circle cx="112" cy="96" r="1.5" fill="#B97A56" stroke="none"/>
<circle cx="119" cy="101" r="1.5" fill="#B97A56" stroke="none"/>
<circle cx="188" cy="96" r="1.5" fill="#B97A56" stroke="none"/>
<circle cx="181" cy="101" r="1.5" fill="#B97A56" stroke="none"/>
'''
    eyes = '''
<ellipse cx="126" cy="80" rx="9" ry="11" fill="#FFFDF7"/>
<ellipse cx="174" cy="80" rx="9" ry="11" fill="#FFFDF7"/>
<circle cx="127" cy="81" r="4.6" fill="#4A342A" stroke="none"/>
<circle cx="173" cy="81" r="4.6" fill="#4A342A" stroke="none"/>
<circle cx="128.5" cy="79" r="1.6" fill="#FFFDF7" stroke="none"/>
<circle cx="174.5" cy="79" r="1.6" fill="#FFFDF7" stroke="none"/>
'''
    if glasses:
        eyes = '''
<circle cx="126" cy="80" r="17" fill="none" stroke="#4A342A" stroke-width="3"/>
<circle cx="174" cy="80" r="17" fill="none" stroke="#4A342A" stroke-width="3"/>
<path d="M143 80 h14 M109 78 l-12 -4 M191 78 l12 -4" stroke-width="3"/>
<circle cx="127" cy="81" r="4.2" fill="#4A342A" stroke="none"/>
<circle cx="173" cy="81" r="4.2" fill="#4A342A" stroke="none"/>
<circle cx="128.3" cy="79.3" r="1.4" fill="#FFFDF7" stroke="none"/>
<circle cx="174.3" cy="79.3" r="1.4" fill="#FFFDF7" stroke="none"/>
'''
    return '''
<path d="M112 66 q10 -7 20 -2" fill="none" stroke-width="3"/>
<path d="M168 64 q10 -5 20 2" fill="none" stroke-width="3"/>
%s
%s
<path d="M150 84 q-3 9 3 11" fill="none" stroke-width="2.8"/>
<path d="M136 103 q14 11 28 0" fill="none" stroke="#8B3A32" stroke-width="3.4"/>
<ellipse cx="110" cy="98" rx="8" ry="5" fill="#E8A184" stroke="none" opacity=".8"/>
<ellipse cx="190" cy="98" rx="8" ry="5" fill="#E8A184" stroke="none" opacity=".8"/>
''' % (eyes, lashes)


def _head_girl(hair, clip=True):
    clip_svg = '''
<path d="M188 54 q14 -12 20 2 q-12 10 -20 -2 Z" fill="#2E6B66"/>
<path d="M198 62 q2 10 -4 14" fill="none" stroke="#2E6B66" stroke-width="3"/>
''' if clip else ''
    return _back_hair(hair) + _ears() + _neck() + '''
<path d="M96 78 C96 36 118 20 150 20 C182 20 204 36 204 78 C204 110 184 132 150 132 C116 132 96 110 96 78 Z" fill="%s"/>
<path d="M102 90 C96 42 118 18 150 18 C182 18 204 42 198 90 C192 68 180 56 164 52 C156 64 144 68 136 58 C124 64 110 74 102 90 Z" fill="%s"/>
<path d="M112 92 q-4 32 6 50 q-14 -18 -8 -50 Z" fill="%s"/>
<path d="M188 92 q4 32 -6 50 q14 -18 8 -50 Z" fill="%s"/>
%s
%s
''' % (SKIN, hair, hair, hair, clip_svg, _face(girl=True))


def _head_boy(hair):
    return _ears() + _neck() + '''
<path d="M96 78 C96 36 118 20 150 20 C182 20 204 36 204 78 C204 110 184 132 150 132 C116 132 96 110 96 78 Z" fill="%s"/>
<path d="M94 82 C92 38 114 12 150 12 C186 12 210 38 206 82 C200 62 188 50 174 46 C166 58 154 60 148 50 C140 58 128 56 120 44 C106 50 98 64 94 82 Z" fill="%s"/>
<path d="M102 72 C108 44 126 30 150 30 C174 30 192 44 198 72 C190 60 180 54 170 53 L176 64 L162 56 L158 66 L150 54 L140 66 L136 56 L122 64 L128 53 C118 56 108 62 102 72 Z" fill="%s"/>
<path d="M168 30 q10 -12 18 -2 q-11 0 -13 11 Z" fill="%s"/>
%s
''' % (SKIN, hair, hair, hair, _face(girl=False))


def _scarf(color, knot='#B65C25'):
    return '''
<path d="M126 136 Q150 150 174 136 L178 152 Q150 166 122 152 Z" fill="%s"/>
<path d="M164 150 l10 30 l-14 4 l-6 -26 Z" fill="%s"/>
''' % (color, knot)


def child(shirt, pants, shoe, hair, gender='girl', long=False, extras='', seam=None):
    head = _head_girl(hair) if gender == 'girl' else _head_boy(hair)
    return wrap(
        _arms() +
        _legs(pants, '#FFFFFF' if pants != '#4A342A' else '#2C1A12') +
        _shoes(shoe) +
        _torso(shirt, long) +
        _sleeves(shirt, long) +
        _collar(seam=seam) +
        extras +
        head
    )


def _adult_head(hair, glasses=False, bun=True, earrings=True):
    bun_svg = '<circle cx="150" cy="16" r="18" fill="%s"/>' % hair if bun else ''
    ear_svg = '''
<circle cx="96" cy="100" r="3" fill="#F2B23E" stroke="none"/>
<circle cx="204" cy="100" r="3" fill="#F2B23E" stroke="none"/>
''' if earrings else ''
    return _ears() + _neck() + '''
<path d="M96 78 C96 34 118 18 150 18 C182 18 204 34 204 78 C204 110 184 132 150 132 C116 132 96 110 96 78 Z" fill="%s"/>
<path d="M94 86 C90 40 114 14 150 14 C186 14 210 40 206 86 C200 64 188 52 174 50 C166 62 154 64 148 54 C140 62 128 60 120 46 C106 52 98 66 94 86 Z" fill="%s"/>
%s
<path d="M108 96 q-6 28 2 44 q-12 -16 -6 -44 Z" fill="%s"/>
<path d="M192 96 q6 28 -2 44 q12 -16 6 -44 Z" fill="%s"/>
%s
%s
''' % (SKIN, hair, bun_svg, hair, hair, ear_svg, _face(girl=True, glasses=glasses))


def adult(dress, hair, apron=None, glasses=False, skirt=None, pants=None, extras=''):
    # Ноги, юбка, корпус, руки и только потом обувь: ботинки всегда поверх юбки.
    body = _legs(pants, '#6B4324') if pants else '''
<path d="M132 236 L168 236 L166 304 L134 304 Z" fill="%s"/>
<path d="M118 286 L146 286 M154 286 L182 286" stroke="%s" stroke-width="4"/>
''' % (SKIN, SKIN_SHADE)
    if skirt:
        body += '''
<path d="M112 226 L188 226 L204 304 L96 304 Z" fill="%s"/>
<path d="M124 238 L176 238" stroke="#3A4A40" stroke-width="3" opacity=".6"/>
''' % skirt
    body += '''
<path d="M116 148 Q150 132 184 148 L188 246 Q150 258 112 246 Z" fill="%s"/>
''' % dress
    if apron:
        body += '''
<path d="M128 156 Q150 164 172 156 L174 246 Q150 256 126 246 Z" fill="%s"/>
''' % apron
    # Руки поверх платья: иначе широкий корпус их прячет.
    body += _adult_arms() + _sleeves(dress) + _shoes('#5A3B2B') + extras + _adult_head(hair, glasses=glasses)
    return wrap(body)


# ---------------- КОНКРЕТНЫЕ ПЕРСОНАЖИ ----------------

def char_girl():
    return child('#E07B39', '#2E6B66', '#8B5A36', '#6B4632', 'girl', seam='#C4602A')


def char_boy():
    return child('#2E6B66', '#8B5A36', '#4A342A', '#5A3B2B', 'boy', seam='#24544F')


def char_girl_dressed():
    extras = _scarf('#C25B4E') + '''
<circle cx="150" cy="186" r="4" fill="#B65C25" stroke="none"/>
<circle cx="150" cy="214" r="4" fill="#B65C25" stroke="none"/>
<path d="M124 238 h20 M156 238 h20" stroke="#B9834F" stroke-width="3"/>
'''
    return child('#E8A33D', '#4A5B47', '#6B4632', '#6B4632', 'girl', long=True, extras=extras)


def char_boy_dressed():
    extras = _scarf('#2E6B66') + '''
<circle cx="150" cy="186" r="4" fill="#9E4A16" stroke="none"/>
<circle cx="150" cy="214" r="4" fill="#9E4A16" stroke="none"/>
<path d="M124 238 h20 M156 238 h20" stroke="#B9834F" stroke-width="3"/>
'''
    return child('#E07B39', '#4F5E55', '#5A3B2B', '#5A3B2B', 'boy', long=True, extras=extras)


def char_friend_girl():
    return child('#C25B4E', '#6B8FA3', '#6B4632', '#7A4A2B', 'girl', seam='#9C443A')


def char_friend_boy():
    return child('#4F8A5B', '#4F6B8A', '#4A342A', '#7A4A2B', 'boy', seam='#3C6B47')


def char_cashier():
    extras = '''
<path d="M118 146 h64 l-6 18 h-52 Z" fill="#FFF6E4"/>
<path d="M128 164 h44 v40 h-44 Z" fill="#FFF6E4"/>
<circle cx="150" cy="176" r="7" fill="#2E6B66" stroke="none"/>
<path d="M140 198 h20" stroke="#2E6B66" stroke-width="4"/>
'''
    return adult('#2E6B66', '#4A342A', apron='#FFF6E4', extras=extras)


def char_mom():
    return adult('#8E5A86', '#5A3B2B', apron='#FFF6E4', skirt='#4F5E55')


def char_teacher():
    extras = '''
<path d="M138 138 L150 152 L162 138 Z" fill="#FFF6E4"/>
<path d="M150 164 l-6 12 h12 Z" fill="#C25B4E" stroke="none"/>
'''
    return adult('#2E6B66', '#6B4632', glasses=True, skirt='#4F5E55', extras=extras)


CHARACTERS = {
    'char-girl': char_girl,
    'char-girl-dressed': char_girl_dressed,
    'char-boy': char_boy,
    'char-boy-dressed': char_boy_dressed,
    'char-cashier': char_cashier,
    'char-friend-boy': char_friend_boy,
    'char-friend-girl': char_friend_girl,
    'char-mom': char_mom,
    'char-teacher': char_teacher,
}
