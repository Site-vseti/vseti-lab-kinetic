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
KEEP = set(['ВСЕТИ', 'в', 'и', 'сети', 'в сети', 'в сети.', 'Русский', 'English', 'O‘zbekcha', 'Тоҷикӣ', 'Кыргызча', 'Azərbaycanca', '中文', 'АБВГДЕЖЗИКЛМНОПРСТУФХЦЧШЫЭЮЯ', 'ЭР', 'РЗ', 'КП', 'ЕГ', 'КГ', 'ИН', 'СН', 'ЦД', 'БП', 'TG', 'MAX', 'VK', 'Яндекс', 'Google', 'ChatGPT', 'Алиса', 'Gemini', 'Perplexity', 'Claude', 'DeepSeek', 'Grok', 'GigaChat', 'Copilot', 'Bing', 'GPTBot', 'Telegram', 'ВКонтакте', 'ЮKassa', 'СБП', 'Schema.org', 'llms.txt', 'robots.txt', 'Элина Рихтер', 'Рина Золотарёва', 'Сонник', 'БП24', 'Цена Дня · WB', 'ЕГРН: план квартиры', 'site_vseti@mail.ru', '@vseti_agency_bot · @vseti_site',
# инициалы и имена в отзывах: как и на плитках кейсов, они не переводятся
'ИК', 'ДШ', 'МЛ', 'АТ', 'ОГ', 'СБ',
'Ирина Ковалёва', 'Денис Шилов', 'Марина Лебедева', 'Алексей Тарасов', 'Ольга Гурьева', 'Сергей Бушуев'])


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


# Имена и бренды, которые в латинских версиях пишутся латиницей.
# В таджикской и киргизской версиях кириллица остаётся как есть.
LATIN_BRANDS = {
 'Яндекс': 'Yandex', 'Алиса': 'Alice', 'ВКонтакте': 'VKontakte',
 'ЮKassa': 'YooKassa', 'СБП': 'SBP',
 'Элина Рихтер': 'Elina Rikhter', 'Рина Золотарёва': 'Rina Zolotareva',
 'Сонник': 'Sonnik', 'Цена Дня · WB': 'Tsena Dnya · WB',
 'ЕГРН: план квартиры': 'EGRN: apartment plan',
 'Справки КГИОП': 'KGIOP certificates', 'Карта парка Аватар': 'Avatar Park map',
 'Ирина Ковалёва': 'Irina Kovalyova', 'Денис Шилов': 'Denis Shilov',
 'Марина Лебедева': 'Marina Lebedeva', 'Алексей Тарасов': 'Aleksey Tarasov',
 'Ольга Гурьева': 'Olga Guryeva', 'Сергей Бушуев': 'Sergey Bushuev',
 'Инсоляция и КЕО': 'Insolation and daylight',
}
LATIN_LANGS = {'en', 'uz', 'az', 'zh'}

def esc_html(t):
    return t.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;').replace('"', '&quot;')

def esc_js(t):
    return t.replace('\\', '\\\\').replace("'", "\\'").replace('\n', ' ')

def substitute(chunk, keys, table, esc):
    """Подмена через плейсхолдеры: длинные строки первыми, ничего не переводится дважды."""
    tok = {}
    for i, k in enumerate(keys):
        if k in chunk:
            t = '\x00%d\x00' % i
            chunk = chunk.replace(k, t)
            tok[t] = esc(table[k])
    for t, v in tok.items():
        chunk = chunk.replace(t, v)
    return chunk

def translate_html(src, table, code, htmllang, name):
    keys = [k for k in sorted(table, key=len, reverse=True) if table[k]]
    # разметку Schema.org и Open Graph НЕ переводим построчно: их русский текст не
    # входит в словарь и словам достались бы куски перевода. Вырезаем и собираем заново.
    src = re.sub(r'<script type="application/ld\+json">.*?</script>\n?', '', src, flags=re.S)
    src = re.sub(r'<meta (?:property="og:|name="twitter:)[^>]*>\n?', '', src)
    # скрипты и разметка переводятся раздельно: в скриптах апостроф надо экранировать,
    # в разметке — амперсанд и кавычки, иначе ломается либо JS, либо HTML
    out, pos = [], 0
    for m in re.finditer(r'<script\b.*?</script>', src, flags=re.S):
        out.append(substitute(src[pos:m.start()], keys, table, esc_html))
        out.append(substitute(m.group(0), keys, table, esc_js))
        pos = m.end()
    out.append(substitute(src[pos:], keys, table, esc_html))
    src = ''.join(out)
    # язык документа и относительные пути
    src = src.replace('<html lang="ru">', '<html lang="%s">' % htmllang, 1)
    src = re.sub(r'(src|href)="assets/', r'\1="../assets/', src)
    src = re.sub(r'url\(assets/', 'url(../assets/', src)
    for pg in ('oferta.html', 'politika.html', 'rekvizity.html'):
        src = src.replace('href="%s"' % pg, 'href="../%s"' % pg)
    # канонический адрес и Open Graph — свои у каждой версии
    src = src.replace('<link rel="canonical" href="https://vseti-site.ru/">',
                      '<link rel="canonical" href="https://vseti-site.ru/%s/">' % code, 1)
    src = src.replace('<meta property="og:url" content="https://vseti-site.ru/">',
                      '<meta property="og:url" content="https://vseti-site.ru/%s/">' % code, 1)
    src = src.replace('"inLanguage":"ru"', '"inLanguage":"%s"' % htmllang, 1)
    # отметка текущего языка в переключателе
    src = src.replace('<a href="/" aria-current="true">', '<a href="/">', 1)
    src = src.replace('<a href="/%s/">' % code, '<a href="/%s/" aria-current="true">' % code, 1)
    src = re.sub(r'(<span class="nm">)RU(</span>)', r'\g<1>%s\g<2>' % code.upper(), src, count=1)
    if code in LATIN_LANGS:
        for a, b in sorted(LATIN_BRANDS.items(), key=lambda kv: -len(kv[0])):
            src = src.replace(a, b)
    # заголовок и описание уже переведены — на них и строим Open Graph и Schema.org
    t = re.search(r'<title>(.*?)</title>', src, flags=re.S)
    d = re.search(r'<meta name="description" content="([^"]*)"', src)
    title = t.group(1).strip() if t else 'в сети'
    desc = d.group(1).strip() if d else ''
    url = 'https://vseti-site.ru/%s/' % code
    og = ('<meta property="og:type" content="website">\n'
          '<meta property="og:site_name" content="в сети">\n'
          '<meta property="og:title" content="%s">\n'
          '<meta property="og:description" content="%s">\n'
          '<meta property="og:url" content="%s">\n'
          '<meta property="og:image" content="https://vseti-site.ru/assets/logo.png">\n'
          '<meta name="twitter:card" content="summary_large_image">\n'
          '<meta name="twitter:title" content="%s">\n'
          '<meta name="twitter:description" content="%s">\n'
          '<meta name="twitter:image" content="https://vseti-site.ru/assets/logo.png">\n') % (title, desc, url, title, desc)
    ld = {"@context": "https://schema.org", "@type": "ProfessionalService",
          "@id": "https://vseti-site.ru/#org", "name": "в сети", "url": url,
          "logo": "https://vseti-site.ru/assets/logo.png", "description": desc,
          "email": "site_vseti@mail.ru", "telephone": "+79119261617",
          "priceRange": "35000-120000 RUB",
          "address": {"@type": "PostalAddress", "addressCountry": "RU", "addressLocality": "Izhevsk"},
          "areaServed": [{"@type": "Country", "name": "Russia"}],
          "knowsLanguage": ["ru", "en", "uz", "tg", "ky", "az", "zh"],
          "sameAs": ["https://t.me/vseti_site", "https://max.ru/id183474446770_4_bot"],
          "inLanguage": htmllang}
    block = og + '<script type="application/ld+json">\n' + json.dumps(ld, ensure_ascii=False, indent=1) + '\n</script>\n'
    src = src.replace('</head>', block + '</head>', 1)
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
