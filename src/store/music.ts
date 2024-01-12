import { defineStore } from 'pinia'

export const useMusicStore = defineStore('music', {
    state: () => ({
        songs: [] as string[],
        currentSong: '',
    }),
    getters: {
        isPlaying: (state) => state.currentSong !== '',
    },
    actions: {
        addSong(song: string) {
            this.songs.push(song)
        },
        playSong(song: string) {
            this.currentSong = song
        },
    },
})
