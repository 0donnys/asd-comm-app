from PIL import Image, ImageDraw, ImageFont
import math

W, H = 2000, 1414
INK = (38, 50, 56)
MUTED = (92, 105, 100)
WHITE = (255, 253, 247)
PAPER = (248, 244, 235)
GREEN = (47, 93, 80)
TERRA = (166, 84, 55)
GOLD = (170, 132, 62)
LINE = (205, 196, 182)
FONT = "/System/Library/Fonts/Supplemental/Arial.ttf"
FONT_B = "/System/Library/Fonts/Supplemental/Arial Bold.ttf"

def f(size, bold=False):
    return ImageFont.truetype(FONT_B if bold else FONT, size)

def wrap(text, font, maxw):
    words, lines, line = text.split(), [], ""
    for w in words:
        test = (line + " " + w).strip()
        if font.getlength(test) <= maxw:
            line = test
        else:
            if line: lines.append(line)
            line = w
    if line: lines.append(line)
    return lines

def text_block(d, text, box, font, fill=INK, align="center", gap=6):
    x, y, w, h = box
    lines = wrap(text, font, w)
    heights = [d.textbbox((0,0), ln, font=font)[3] for ln in lines]
    total = sum(heights) + gap*(len(lines)-1)
    yy = y + (h-total)/2
    for ln, hh in zip(lines, heights):
        tw = d.textlength(ln, font=font)
        xx = x + (w-tw)/2 if align == "center" else x
        d.text((xx, yy), ln, font=font, fill=fill)
        yy += hh + gap

def box(d, xy, title, node):
    x,y,w,h = xy
    accent = GREEN if node in ("A0", "A1", "A21") else TERRA if node in ("A2", "A22") else GOLD
    d.rounded_rectangle((x,y,x+w,y+h), radius=3, fill=WHITE, outline=INK, width=2)
    d.rectangle((x+2,y+2,x+w-2,y+9), fill=accent)
    text_block(d, title, (x+22,y+26,w-44,h-56), f(23), gap=4, align="left")
    nf = f(17, True)
    tw = d.textlength(node, font=nf)
    d.rounded_rectangle((x+w-tw-30, y+h-36, x+w-12, y+h-12), radius=3, fill=accent)
    d.text((x+w-tw-21, y+h-33), node, font=nf, fill=WHITE)

def head(d, p1, p2):
    ang = math.atan2(p2[1]-p1[1], p2[0]-p1[0])
    L, Wd = 17, 8
    a = (p2[0]-L*math.cos(ang)+Wd*math.sin(ang), p2[1]-L*math.sin(ang)-Wd*math.cos(ang))
    b = (p2[0]-L*math.cos(ang)-Wd*math.sin(ang), p2[1]-L*math.sin(ang)+Wd*math.cos(ang))
    d.polygon([p2,a,b], fill=INK)

def arrow(d, pts, label=None, lx=None, ly=None, anchor="mm", size=18):
    d.line(pts, fill=INK, width=3, joint="curve")
    head(d, pts[-2], pts[-1])
    if not label:
        return
    ft = f(size)
    lines = label.split("\n")
    widths = [d.textlength(s, font=ft) for s in lines]
    tw, th = max(widths), len(lines)*23
    if lx is None: lx = (pts[0][0]+pts[-1][0])/2
    if ly is None: ly = (pts[0][1]+pts[-1][1])/2
    if anchor == "mm": tx, ty = lx-tw/2, ly-th/2
    elif anchor == "lm": tx, ty = lx, ly-th/2
    elif anchor == "rm": tx, ty = lx-tw, ly-th/2
    else: tx, ty = lx-tw/2, ly
    d.rectangle((tx-4,ty-2,tx+tw+4,ty+th+2), fill=PAPER)
    for i,s in enumerate(lines):
        d.text((tx,ty+i*23), s, font=ft, fill=MUTED)

def header(d, title, sub=None):
    d.rectangle((28, 24, W-28, H-24), outline=LINE, width=2)
    d.text((64, 48), "ФУНКЦИОНАЛЬНАЯ МОДЕЛЬ IDEF0", font=f(15, True), fill=TERRA)
    d.text((64, 78), title, font=f(35, True), fill=INK)
    d.line((64, 132, 330, 132), fill=TERRA, width=4)
    if sub:
        d.text((64, 152), sub, font=f(20), fill=MUTED)
    d.text((W-64, 50), "РАСигры · ВКР", font=f(16), fill=MUTED, anchor="ra")

def footer(d, n):
    d.line((64, H-54, W-64, H-54), fill=LINE, width=2)
    d.text((64, H-44), "IDEF0 · РАСигры · 2026", font=f(16), fill=MUTED)
    d.text((W-64, H-44), f"Лист {n} из 3", font=f(16), fill=MUTED, anchor="ra")

def page1():
    im = Image.new("RGB", (W,H), PAPER)
    d = ImageDraw.Draw(im)
    header(d, "Контекстная диаграмма A0", "Формировать бытовые и социальные навыки у детей с РАС через визуальные сценарии")
    box(d, (700,520,820,310), "Формировать бытовые и социальные навыки у детей с РАС через визуальные сценарии в мобильном приложении", "A0")
    for y, lab in [(595,"Данные профиля\nребёнка"), (680,"Выбор\nсценария"), (765,"Ответы и действия\nребёнка")]:
        arrow(d, [(170,y),(700,y)], lab, 430, y-18)
    for x, lab in [(800,"Методика и\nпринципы"), (980,"Требования\nдоступности"), (1160,"Нормативные\nтребования"), (1340,"Правила\nоценки")]:
        arrow(d, [(x,350),(x,520)], lab, x, 300)
    for y, lab in [(600,"Освоенные\nсценарии"), (680,"Прогресс\nребёнка"), (760,"Отчёт о\nдинамике")]:
        arrow(d, [(1520,y),(1870,y)], lab, 1695, y-18)
    for x, lab in [(800,"Мобильное\nустройство"), (970,"Android WebView\n/ PWA"), (1140,"SQLite /\nlocalStorage"), (1310,"Родитель /\nспециалист")]:
        arrow(d, [(x,980),(x,830)], lab, x, 1005)
    footer(d,1)
    return im

def page2():
    im = Image.new("RGB", (W,H), PAPER)
    d = ImageDraw.Draw(im)
    header(d, "Декомпозиция контекстной диаграммы A0", "Три процесса: профиль → сценарий → прогресс")
    a1=(160,560,360,240); a2=(760,560,400,250); a3=(1360,560,360,240)
    box(d, a1, "Настроить профиль ребёнка", "A1")
    box(d, a2, "Провести визуальный сценарий", "A2")
    box(d, a3, "Сохранить прогресс и разблокировать следующий сценарий", "A3")
    arrow(d, [(40,640),(160,640)], "Данные профиля\nребёнка", 95, 615)
    arrow(d, [(40,212),(720,212),(720,610),(760,610)], "Выбор сценария", 380, 190)
    arrow(d, [(40,900),(720,900),(720,700),(760,700)], "Ответы ребёнка", 380, 878)
    for x, lab, bx in [(280,"Нормативные\nтребования",a1), (860,"Методика и\nпринципы",a2),
                       (1060,"Требования\nдоступности",a2), (1510,"Правила оценки\nи разблокировки",a3)]:
        arrow(d, [(x,320),(x,bx[1])], lab, x, 268)
    arrow(d, [(520,635),(760,635)], "Профиль\nребёнка", 640, 605)
    arrow(d, [(1160,635),(1360,635)], "Результаты\nшагов", 1260, 605)
    arrow(d, [(1360,700),(1160,700)], "Разблокированный\nсценарий", 1260, 725)
    for y, lab in [(590,"Освоенные\nсценарии"), (670,"Прогресс\nребёнка"), (750,"Отчёт о\nдинамике")]:
        arrow(d, [(1720,y),(1940,y)], lab, 1820, y-20)
    for x, lab, bx in [(260,"Мобильное устройство\nWebView",a1), (430,"SQLite /\nlocalStorage",a1),
                       (830,"WebView,\nиллюстрации,\nозвучка",a2), (1040,"Родитель /\nспециалист",a2),
                       (1470,"SQLite /\nlocalStorage",a3), (1660,"Родитель /\nспециалист",a3)]:
        arrow(d, [(x,1070),(x,bx[1]+bx[3])], lab, x, 1090)
    footer(d,2)
    return im

def page3():
    im = Image.new("RGB", (W,H), PAPER)
    d = ImageDraw.Draw(im)
    header(d, "Декомпозиция блока A2 «Провести визуальный сценарий»", "Шаг → ответ → итог")
    a21=(160,570,390,240); a22=(760,570,390,240); a23=(1350,570,380,240)
    box(d, a21, "Показать шаг сценария", "A21")
    box(d, a22, "Обработать ответ ребёнка", "A22")
    box(d, a23, "Завершить сценарий и оценить", "A23")
    arrow(d, [(40,640),(160,640)], "Профиль\nребёнка", 95, 615)
    arrow(d, [(40,700),(160,700)], "Выбор\nсценария", 95, 675)
    arrow(d, [(40,900),(720,900),(720,700),(760,700)], "Ответы ребёнка", 380, 878)
    for x, lab, bx in [(280,"Методика и\nпринципы",a21), (480,"Требования\nдоступности",a21),
                       (900,"Правила проверки\nи подсказки",a22), (1500,"Правила звёзд\nи разблокировки",a23)]:
        arrow(d, [(x,330),(x,bx[1])], lab, x, 280)
    arrow(d, [(550,650),(760,650)], "Сцена,\nреплика,\nварианты", 650, 612)
    arrow(d, [(1150,650),(1350,650)], "Результаты\nшага", 1250, 612)
    arrow(d, [(1350,710),(1150,710)], "Следующий\nшаг", 1250, 735)
    for y, lab in [(610,"Итог\nсценария"), (690,"Освоенный\nсценарий")]:
        arrow(d, [(1730,y),(1930,y)], lab, 1825, y-20)
    for x, lab, bx in [(260,"WebView,\nиллюстрации",a21), (450,"Озвучка",a21),
                       (840,"WebView,\nзвук",a22), (1030,"Родитель /\nспециалист",a22),
                       (1450,"SQLite /\nlocalStorage",a23), (1640,"Родитель /\nспециалист",a23)]:
        arrow(d, [(x,1080),(x,bx[1]+bx[3])], lab, x, 1100)
    footer(d,3)
    return im

pages=[page1(), page2(), page3()]
for i,im in enumerate(pages,1):
    im.save(f"docs/idef0/page{i}.png", "PNG")
pages[0].save("docs/IDEF0_РАСигры.pdf", "PDF", resolution=171.0, save_all=True, append_images=pages[1:])
print("saved")
