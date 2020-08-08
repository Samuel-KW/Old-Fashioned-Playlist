class Player {
    constructor(songs) {
        if (songs.length < 1) throw new Error('You must include at least 1 song');

        this.keys = {
            submit: [13],
            prev: [38, 87],
            next: [40, 83],
            shuffle: [192]
        };
        
        this.songs = songs;

        this.playing = 0;
        this.selected = 0;

        this.parent = document.getElementById('song-container');
        this.audio = new Audio();
        this.state = 'loading';

        this.reload();
        this.listeners();
    }

    open_new() {
        let page = window.open(
            'about:blank',
            'MusicPlayer',
            'menubar=no,location=no,resizable=no,scrollbars=no,status=no,toolbar=no,width=900,height=512'
        );
        page.document.write(document.documentElement.innerHTML);
    }

    listeners() {
        this.audio.addEventListener('ended', e => this.next());

        window.addEventListener('keydown', e => {
            let key = e.keyCode || e.which;

            if (this.keys.submit.includes(key)) this.play(this.selected);
            else if (this.keys.prev.includes(key)) {
                let index = this.selected - 1;

                if (this.songs[index]) this.select(index);
                else this.select(this.songs.length - 1);
            } else if (this.keys.next.includes(key)) {
                let index = this.selected + 1;

                if (this.songs[index]) this.select(index);
                else this.select(0);
            } else if (this.keys.shuffle.includes(key)) this.shuffle();
        });
    }

    play(index) {
        let song = this.songs[index];
        if (!song) throw new Error('Song index out of bounds');

        this.parent.children[this.playing].classList.remove('playing');
        this.playing = index;

        this.parent.children[this.playing].classList.add('playing');

        this.audio.src = 'songs/' + song.src;
        this.playing = index;

        this.resume();
    }

    pause() {
        if (this.state !== 'playing') return false;

        this.audio.pause();
        this.state = 'paused';
    }

    resume() {
        this.audio.play()
            .then(data => { this.state = 'playing'; })
            .catch(err => {
                this.state = 'skipping';
                this.skip();
            });
    }

    reload() {
        while (this.parent.firstChild)
            this.parent.removeChild(this.parent.firstChild);

        for (let i = 0; i < this.songs.length; ++i) {
            let song = this.songs[i],
                elem = this.element(song, i + 1);

            this.parent.appendChild(elem);
        }

        this.playing = 0;
        this.selected = 0;

        this.parent.firstChild.classList.add('selected');
    }

    element(info, num) {
        num = String(num);

        let section = document.createElement('div');
        section.className = 'section';

        let index = document.createElement('span');
        index.className = 'index';
        index.textContent = (num.padStart(2, '0') + '.').padEnd(7, '\xa0');

        let song = document.createElement('span');
        song.className = 'song';
        song.textContent = info.title;

        let artist = document.createElement('span');
        artist.className = 'artist';
        artist.textContent = info.artist;

        section.appendChild(index);
        section.appendChild(song);
        section.appendChild(artist);

        return section;
    }

    shuffle() {
        for (let i = this.songs.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1)),
                x = this.songs[i];
            this.songs[i] = this.songs[j];
            this.songs[j] = x;
        }
        this.reload();
    }

    select(index) {
        let previous = this.parent.children[this.selected],
            next = this.parent.children[index];

        if (!previous || !next) return false;

        previous.classList.remove('selected');
        next.classList.add('selected');

        this.selected = index;
    }

    next() {
        let index = this.playing + 1;

        if (this.songs[index]) this.play(index);
        else this.play(0);
    }

    previous() {
        let index = this.playing - 1;

        if (this.songs[index]) this.play(index);
        else this.play(this.songs.length - 1);
    }
}

let Playlist = new Player([
    { title: 'so long', artist: 'Powfu', src: 'Powfu - so long.mp3' },
    { title: 'Midnight Adventures', artist: 'AnimeVibe', src: 'Midnight Adventures.mp3' },
    { title: 'nice guy', artist: 'D$r', src: 'D$r - nice guy.mp3' },
]);