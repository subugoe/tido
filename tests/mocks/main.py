import requests
import os
import json
import shutil
import sys
import time

# ==================== Configuration ====================

# If True the crawler does not iterate over the complete collections, manifests and items but rather
# only a small portion of the endpoints to just get an idea of how the API is structured.
# This can be useful when you quickly want to create integration or end-to-end tests for your application and need some
# real world data.

example_mode = True

collection_url = 'https://ahikar-dev.sub.uni-goettingen.de/api/textapi/ahiqar/arabic-karshuni/collection.json'

output_dir = 'ahiqar'
collections_dir = 'collections'
manifests_dir = 'manifests'
items_dir = 'items'
mocks_dir = 'mocks'
manifest_filters = [
    'https://ahikar-dev.sub.uni-goettingen.de/api/textapi/ahikar/arabic-karshuni/3r177/manifest.json',
    'https://ahikar-dev.sub.uni-goettingen.de/api/textapi/ahikar/arabic-karshuni/3r17b/manifest.json',
    'https://ahikar-dev.sub.uni-goettingen.de/api/textapi/ahikar/arabic-karshuni/3r17d/manifest.json',
    'https://ahikar-dev.sub.uni-goettingen.de/api/textapi/ahikar/arabic-karshuni/3r7vd/manifest.json',
    'https://ahikar-dev.sub.uni-goettingen.de/api/textapi/ahikar/arabic-karshuni/3r176/manifest.json',
    'https://ahikar-dev.sub.uni-goettingen.de/api/textapi/ahikar/arabic-karshuni/3r7tp/manifest.json'
]
manifest_filters = []
crawl_annotations = True

server_base_url = 'https://ahikar-dev.sub.uni-goettingen.de/api'
output_base_url = 'http://localhost:8181/ahiqar'

# =================== End Configuration ===================


for i, arg in enumerate(sys.argv):
    argNumber = i + 1

    if arg == '-c' and sys.argv[argNumber]:
        collection_url = sys.argv[argNumber]
    elif arg == '-fm' and sys.argv[argNumber]:
        manifest_filters = sys.argv[argNumber].split(',')


def crawl_collection(url):
    url_parts = url.replace(server_base_url + '/', '').split('/')

    if url_parts[-1] != 'collection.json':
        return

    url_parts.pop()

    path = output_dir + '/' + '/'.join(url_parts)

    os.makedirs(path, exist_ok=True)

    r = requests.get(url)
    collection_json = r.json()

    print('collection: ' + collection_json['title'][0]['title'])

    save_clean_file(path + '/collection.json', collection_json)

    collection_sequence = collection_json['sequence']

    if collection_json['sequence']:
        for seq_item in collection_sequence:
            if not manifest_filters or manifest_filters.count(seq_item['id']) > 0:
                crawl_manifest(seq_item['id'])


def crawl_manifest(url):
    url_parts = url.replace(server_base_url + '/', '').split('/')

    if url_parts[-1] != 'manifest.json':
        return

    dir_name = url_parts[-2]
    print('manifest: ' + dir_name)

    url_parts.pop()

    path = output_dir + '/' + '/'.join(url_parts)

    os.makedirs(path, exist_ok=True)

    r = requests.get(url)
    manifest_json = r.json()

    save_clean_file(path + '/manifest.json', manifest_json)

    #return

    sequence = manifest_json['sequence']
    support = manifest_json['support']

    print('sequence of manifest items', sequence)

    if sequence:
        for i, seq_item in enumerate(sequence):
            if example_mode is False:
                crawl_item(seq_item['id'])
            else:
                if i < 2 or i > len(sequence) - 3:
                    crawl_item(seq_item['id'])

    if support:
        for i, support_item in enumerate(support):
            sup_url = support_item['url']
            sup_url_parts = sup_url.replace(server_base_url + '/', '').split('/')
            sup_file_name = sup_url_parts[-1]
            sup_url_parts.pop()
            sup_path = output_dir + '/' + '/'.join(sup_url_parts)
            sup_req = requests.get(sup_url)
            sup_content = sup_req.text

            os.makedirs(sup_path, exist_ok=True)
            save_clean_file(sup_path + '/' + sup_file_name, sup_content)


def crawl_item(url):
    url_parts = url.replace(server_base_url + '/', '').split('/')

    if url_parts[-1] != 'item.json':
        return

    item_slug = str(url_parts[-3])
    print('item: ' + item_slug)

    url_parts.pop()

    r = requests.get(url)
    item_json = None

    try:
        item_json = r.json()
    except:
        print('item:  ======== JSON parse error ========')

    if not item_json:
        return

    path = output_dir + '/' + '/'.join(url_parts)

    os.makedirs(path, exist_ok=True)

    crawl_content(item_json['content'])

    item_json['image'] = crawl_image(item_json['image'])

    if crawl_annotations and item_json['annotationCollection']:
        crawl_annotation_collection(item_json['annotationCollection'])

    save_clean_file(path + '/item.json', item_json)


def crawl_content(content_arr):
    if not content_arr:
        return

    for content_item in content_arr:
        url = content_item['url']
        url_parts = url.replace(server_base_url + '/', '').split('/')
        content_file_name = url_parts[-1]

        r = requests.get(url)
        content = r.text

        url_parts.pop()

        path = output_dir + '/' + '/'.join(url_parts)

        os.makedirs(path, exist_ok=True)

        save_clean_file(path + '/' + content_file_name, content)

def crawl_image(image_obj):
    url = image_obj['id']

    if not url:
        return

    url_parts = url.replace(server_base_url + '/', '').split('/')

    url_parts.pop()

    path = output_dir + '/' + '/'.join(url_parts)

    os.makedirs(path, exist_ok=True)

    example_file_name = 'text-api.png'

    if example_mode:
        src_path = mocks_dir + '/text-api.png'
        dst_path = path + '/text-api.png'

        shutil.copy(src_path, dst_path)

    url_parts = [server_base_url, *url_parts, example_file_name]

    image_obj['id'] = '/'.join(url_parts)
    return image_obj

def crawl_annotation_collection(url):
    url_parts = url.replace(server_base_url + '/', '').split('/')

    if url_parts[-1] != 'annotationCollection.json':
        return

    url_parts.pop()

    r = requests.get(url)
    anno_col_json = r.json()

    path = output_dir + '/' + '/'.join(url_parts)

    os.makedirs(path, exist_ok=True)

    save_clean_file(path + '/annotationCollection.json', anno_col_json)

    if anno_col_json['first']:
        crawl_annotation_page(anno_col_json['first'])


def crawl_annotation_page(url):
    url_parts = url.replace(server_base_url + '/', '').split('/')

    if url_parts[-1] != 'annotationPage.json':
        return

    url_parts.pop()

    r = requests.get(url)
    anno_page_json = r.json()

    path = output_dir + '/' + '/'.join(url_parts)

    os.makedirs(path, exist_ok=True)

    save_clean_file(path + '/annotationPage.json', anno_page_json)

def replace_base_url(data_string):
    return data_string.replace(server_base_url, output_base_url)


def save_clean_file(path, content):
    content_is_string = isinstance(content, str)

    f = open(path, 'w+', encoding="utf-8")
    f.write(replace_base_url(content if content_is_string else json.dumps(content)))
    f.close()

def main():
    # get the start time
    st = time.time()

    if os.path.exists(output_dir):
        shutil.rmtree(output_dir, ignore_errors=True)

    os.mkdir(output_dir)

    crawl_collection(collection_url)

    et = time.time()

    # get the execution time
    elapsed_time = et - st
    print('Execution time:', elapsed_time, 'seconds')


main()
