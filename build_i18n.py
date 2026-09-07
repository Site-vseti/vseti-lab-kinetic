# -*- coding: utf-8 -*-
"""Сборка языковых версий сайта агентства «в сети».
Строки берутся из index.html (тексты, атрибуты, строковые литералы в скриптах),
переводы — из i18n/<код>.json вида {"русская строка": "перевод"}.
Запуск: python3 build_i18n.py extract   — обновить i18n/ru.json
        python3 build_i18n.py build     — собрать папки языков
"""
import json, os, re, sys, html

SRC = 'index.html'
LANGS = {
    'en': ('English', 'en'),
    'uz': ("O‘zbekcha", 'uz'),
    'tg': ('Тоҷикӣ', 'tg'),
    'ky': ('Кыргызча', 'ky'),
    'az': ('Azərbaycanca', 'az'),
    'zh': ('中文', 'zh-Hans'),
}
CYR = re.compile(r'[А-Яа-яЁё]')

# строки, которые НЕ переводятся: имена собственные, бренды, названия языков,
# инициалы плиток и служебный алфавит анимации
KEEP = set(['ВСЕТИ', 'в', 'и', 'сети', 'в сети', 'в сети.', 'Русский', 'English', 'O‘zbekcha', 'Тоҷикӣ', 'Кыргызча', 'Azərbaycanca', '中文', 'АБВГДЕЖЗИКЛМНОПРСТУФХЦЧШЫЭЮЯ', 'ЭР', 'РЗ', 'КП', 'ЕГ', 'КГ', 'ИН', 'СН', 'ЦД', 'БП', 'TG', 'MAX', 'VK', 'Яндекс', 'Google', 'ChatGPT', 'Алиса', 'Gemini', 'Perplexity', 'Claude', 'DeepSeek', 'Grok', 'GigaChat', 'Copilot', 'Bing', 'GPTBot', 'Telegram', 'ВКонтакте', 'ЮKassa', 'СБП', 'Schema.org', 'llms.txt', 'robots.txt', 'Элина Рихтер', 'Рина Золотарёва', 'Сонник', 'БП24', 'Цена Дня · WB', 'ЕГРН: план квартиры', 'site_vseti@mail.ru', '@vseti_agency_bot · @vseti_site'])


def strings(src):
    """Все переводимые строки в порядке появления, без дублей."""
    out = []
    def add(t):
        t = t.strip()
        if t and CYR.search(t) and t not in out and t not in KEEP:
            out.append(t)

    # 1) текстовые узлы вне script/style
    body = re.sub(r'<script\b.*?</script>', lambda m: '\x01'*len(m.group(0)), src, flags=re.S)
    body = re.sub(r'<style\b.*?</style>', lambda m: '\x01'*len(m.group(0)), body, flags=re.S)
    for m in re.finditer(r'>([^<>]+)<', body):
        add(m.group(1))
    # 2) атрибуты
    for attr in ('alt', 'placeholder', 'title', 'aria-label', 'content', 'data-t'):
        for m in re.finditer(attr + r'="([^"]*)"', src):
            add(m.group(1))
    # 3) строковые литералы внутри скриптов
    for sm in re.finditer(r'<script\b[^>]*>(.*?)</script>', src, flags=re.S):
        for m in re.finditer(r"'((?:[^'\\]|\\.)*)'", sm.group(1)):
            add(m.group(1))
    out.sort(key=len, reverse=True)   # длинные заменяем первыми
    return out

def extract():
    src = open(SRC, encoding='utf-8').read()
    st = strings(src)
    json.dump({s: '' for s in st}, open('i18n/ru.json', 'w', encoding='utf-8'),
              ensure_ascii=False, indent=1)
    print('строк:', len(st), '| знаков:', sum(len(x) for x in st))

def translate_html(src, table, code, htmllang, name):
    # 1) подменяем строки через плейсхолдеры, чтобы не переводить дважды
    keys = [k for k in sorted(table, key=len, reverse=True) if table[k]]
    tok = {}
    for i, k in enumerate(keys):
        t = '\x00%d\x00' % i
        if k in src:
            src = src.replace(k, t)
            tok[t] = table[k]
    for t, v in tok.items():
        src = src.replace(t, v)
    # 2) язык документа и относительные пути
    src = src.replace('<html lang="ru">', '<html lang="%s">' % htmllang, 1)
    src = re.sub(r'(src|href)="assets/', r'\1="../assets/', src)
    src = re.sub(r'url\(assets/', 'url(../assets/', src)
    for pg in ('oferta.html', 'politika.html', 'rekvizity.html'):
        src = src.replace('href="%s"' % pg, 'href="../%s"' % pg)
    # 3) отметка текущего языка в переключателе
    src = src.replace('<a href="/" aria-current="true">', '<a href="/">', 1)
    src = src.replace('<a href="/%s/">' % code, '<a href="/%s/" aria-current="true">' % code, 1)
    src = re.sub(r'(<span class="nm">)RU(</span>)', r'\g<1>%s\g<2>' % code.upper(), src, count=1)
    return src

def hreflangs():
    tags = ['<link rel="alternate" hreflang="ru" href="https://vseti-site.ru/">']
    for c, (_, hl) in LANGS.items():
        tags.append('<link rel="alternate" hreflang="%s" href="https://vseti-site.ru/%s/">' % (hl, c))
    tags.append('<link rel="alternate" hreflang="x-default" href="https://vseti-site.ru/">')
    return '\n'.join(tags)

def build():
    src = open(SRC, encoding='utf-8').read()
    # hreflang во все версии, включая русскую
    if 'hreflang="ru"' not in src:
        src = src.replace('</head>', hreflangs() + '\n</head>', 1)
        open(SRC, 'w', encoding='utf-8').write(src)
    done = []
    for code, (name, htmllang) in LANGS.items():
        path = 'i18n/%s.json' % code
        if not os.path.exists(path):
            print('нет перевода:', path); continue
        table = json.load(open(path, encoding='utf-8'))
        empty = [k for k, v in table.items() if not v]
        out = translate_html(src, table, code, htmllang, name)
        os.makedirs(code, exist_ok=True)
        open('%s/index.html' % code, 'w', encoding='utf-8').write(out)
        left = len(CYR.findall(re.sub(r'<script\b.*?</script>|<style\b.*?</style>', '', out, flags=re.S)))
        done.append('%s: пустых строк %d, осталось кириллицы в разметке %d' % (code, len(empty), left))
    print('\n'.join(done) if done else 'нечего собирать')

if __name__ == '__main__':
    cmd = sys.argv[1] if len(sys.argv) > 1 else 'extract'
    (extract if cmd == 'extract' else build)()
