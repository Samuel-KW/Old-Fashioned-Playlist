import os, re, pafy

def get_audio(url, directory):

    try:
        audio = pafy.new(url)
        
        # Get best audio quality
        audio_stream = audio.getbestaudio(preftype="m4a", ftypestrict=True)

        # Create filename
        filename = re.sub("[^a-zA-Z0-9_ ]", "", audio.title)
        filename = re.sub("[ ]", "_", filename).strip()
        
        print("Downloading", filename)
        
        # Save the file
        filepath = os.path.join(directory, filename + ".m4a")
        audio_output = audio_stream.download(filepath=filepath)

        return filepath, filename
    except Exception as e:
        print(e)

def init(filename, directory):

    with open(filename, "r") as urls:
        num_videos = 0

        for url in urls.read().split():
            audio = get_audio(url, directory)
            num_videos += 1

        print("Finished downloading %d video(s)" %(num_videos))

init("urls.txt", "../www/songs/")