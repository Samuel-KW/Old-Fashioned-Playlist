import os, re, time, json, pafy

from colorama import Fore
from colorama import init

init(convert = True) if os.name == 'nt' else init()

print(Fore.MAGENTA + '\nYouTube Downloader')
print(Fore.WHITE + 'https://github.com/Samuel-UC\n')

songs = []

with open('../songs/data.json') as json_file:
    songs = json.load(json_file)
    print(Fore.CYAN + 'Parsed JSON data from' + Fore.YELLOW, '../songs/data.json')

def get_audio(url, directory):

    try:
        audio = pafy.new(url)
        
        print(Fore.CYAN + '\nDownloading' + Fore.YELLOW, audio.title + Fore.WHITE)
        
        # Get best audio quality
        audio_stream = audio.getbestaudio(preftype='m4a', ftypestrict=True)

        # Create filename
        filename = re.sub('[^a-zA-Z0-9_ ]', '', audio.title)
        filename = str(time.time()) + re.sub('[ ]', '_', filename).strip()
        
        # Save the file
        filepath = os.path.join(directory, filename + '.m4a')
        audio_output = audio_stream.download(filepath=filepath)

        songs.append({ 'title': audio.title, 'artist': audio.author, 'src': filename + '.m4a' })

        return filepath, filename

    except Exception as e:
        print(Fore.RED + '\n', e)

def start(filename, directory):

    urls = open(filename).read().splitlines()
    print(Fore.CYAN + 'Found file with' + Fore.YELLOW, len(urls), Fore.CYAN + 'links.\n')

    index = 0
    for url in urls:
        index += 1
        audio = get_audio(url.strip(), directory)
        
        if os.name == 'nt':
            os.system('title Progress: ' + str(index) + ' / ' + str(len(urls)))

    with open('../songs/data.json', 'w') as json_file:
        json.dump(songs, json_file)

    print(Fore.CYAN + '\nFinished downloading' + Fore.YELLOW, len(urls), Fore.CYAN + 'audio files.')

start('urls.txt', '../songs/')