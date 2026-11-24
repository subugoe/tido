"""Generates tests/mocks/example-synopsis-scroll: three manifests with one long item each, the second
one with a transcription and a diplomatic text. The first third of every text carries no sync target;
four sync annotations (sync-1 .. sync-4) link one target of every text further down, at slightly
different paragraphs per text so that the panes have to scroll to line them up.

Run from the repository root: python3 tests/mocks/generate-synopsis-scroll.py
"""
import json
import os

NAME = 'example-synopsis-scroll'
BASE = f'http://localhost:8181/{NAME}'
ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), NAME)
CTX = 'https://gitlab.gwdg.de/subugoe/textapi/specs/-/raw/main/jsonld/v2.jsonld'
CONTENT_CTX = 'https://gitlab.gwdg.de/subugoe/textapi/specs/-/raw/main/jsonld/content.jsonld'
PARAGRAPHS = 60

# per book: title, and per content type the paragraphs (1-based) holding sync-1 .. sync-4
BOOKS = {
    'book1': ('River Chronicle', {'transcription': [22, 30, 38, 46]}),
    'book2': ('Harbour Letters', {'transcription': [25, 33, 41, 49], 'diplomatic': [21, 29, 37, 45]}),
    'book3': ('Mountain Diary', {'transcription': [24, 32, 40, 48]}),
}

WORDS = ('the river ran past the old mill while the wind moved slowly over the fields and the people of '
         'the valley went about their work from morning until the light was gone').split()


def sentence(seed, length=40):
    return ' '.join(WORDS[(seed * 7 + i * 3) % len(WORDS)] for i in range(length)).capitalize() + '.'


def write(path, data):
    full = os.path.join(ROOT, path)
    os.makedirs(os.path.dirname(full), exist_ok=True)
    with open(full, 'w') as f:
        f.write(data if isinstance(data, str) else json.dumps(data, indent=2) + '\n')


def html(title, content_type, sync_paragraphs):
    paragraphs = []
    for n in range(1, PARAGRAPHS + 1):
        text = sentence(n + len(content_type))
        if n in sync_paragraphs:
            k = sync_paragraphs.index(n) + 1
            text = f'<span id="sync-{k}">Sync target {k} of the {content_type}</span>. ' + text
        paragraphs.append(f'    <p id="para{n}">{text}</p>')
    body = '\n'.join(paragraphs)
    return (f'<!DOCTYPE html>\n<html lang="en">\n<head>\n    <meta charset="UTF-8">\n'
            f'    <title>{title} - {content_type}</title>\n</head>\n<body>\n    <h1>{title}</h1>\n{body}\n</body>\n</html>\n')


def content_url(book, content_type):
    return f'{BASE}/html/{book}-page1_{content_type}.html'


def item(book, content_types):
    return {
        '@context': CTX, 'textapi': '2.0.0', 'id': f'{BASE}/items/{book}-page1.json', 'textapiType': 'TextApiItem',
        'revision': '1', 'division': 'Chapter 1', 'titles': ['1'], 'languages': ['eng'],
        'contents': [{'@context': CONTENT_CTX, 'id': content_url(book, ct), 'contentType': f'text/html;type={ct}'}
                     for ct in content_types],
        'annotationCollection': f'{BASE}/annotations/annotationCollection/{book}-page1.json',
        'textItemType': 'page',
    }


def annotation_collection(name, label, items):
    collection_id = f'{BASE}/annotations/annotationCollection/{name}.json'
    page_id = f'{BASE}/annotations/annotationPage/{name}.json'
    write(f'annotations/annotationCollection/{name}.json', {
        '@context': 'http://www.w3.org/ns/anno.jsonld', 'id': collection_id, 'type': 'AnnotationCollection',
        'label': label, 'total': len(items), 'first': page_id, 'last': page_id,
    })
    write(f'annotations/annotationPage/{name}.json', {
        '@context': 'http://www.w3.org/ns/anno.jsonld', 'id': page_id, 'type': 'AnnotationPage',
        'partOf': {'id': collection_id, 'label': label, 'total': len(items)},
        'next': None, 'prev': None, 'startIndex': 0, 'items': items,
    })


manifests = []
for book, (title, texts) in BOOKS.items():
    for content_type, sync_paragraphs in texts.items():
        write(f'html/{book}-page1_{content_type}.html', html(title, content_type, sync_paragraphs))
    book_item = item(book, list(texts))
    write(f'items/{book}-page1.json', book_item)
    annotation_collection(f'{book}-page1', f'Annotations for {title}', [])
    manifest = {
        '@context': CTX, 'textapi': '2.0.0', 'id': f'{BASE}/manifests/{book}.json', 'label': title, 'titles': [title],
        'items': [book_item], 'textapiType': 'TextApiManifest', 'revision': '1', 'license': 'PD-US',
    }
    write(f'manifests/{book}.json', manifest)
    manifests.append(manifest)

sync_annotations = [{
    'id': f'{BASE}/annotations/annotation/sync-{k}',
    'type': 'Annotation',
    'motivation': 'linking',
    'target': [{
        'type': 'SpecificResource',
        'selector': {'type': 'CssSelector', 'value': f'#sync-{k}'},
        'source': {
            'id': content_url(book, content_type),
            'collection': f'{BASE}/collections/example.json',
            'manifest': f'{BASE}/manifests/{book}.json',
            'item': f'{BASE}/items/{book}-page1.json',
        },
        'format': 'text/html',
    } for book, (_, texts) in BOOKS.items() for content_type in texts],
} for k in range(1, 5)]
annotation_collection('example', 'Synopsis connections for the scroll sync', sync_annotations)

write('collections/example.json', {
    '@context': CTX, 'textapi': '2.0.0', 'id': f'{BASE}/collections/example.json', 'titles': ['Synopsis Scroll Library'],
    'collectors': [{'name': 'Digital Library Project', 'roles': ['collector']}], 'revision': '1',
    'total': len(manifests), 'textapiType': 'TextApiCollection', 'manifests': manifests,
    'annotationCollection': f'{BASE}/annotations/annotationCollection/example.json',
})
