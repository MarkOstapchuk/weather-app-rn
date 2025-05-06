export type SpotifyPlaylist = {
    id: string;
    name: string;
    description?: string;
    images: { url: string; height: number | null; width: number | null }[];
    external_urls: { spotify: string };
    href: string;
    uri: string;
    owner: {
        display_name: string;
        id: string;
        external_urls: { spotify: string };
    };
    tracks: {
        href: string;
        total: number;
    };
    type: 'playlist';
    public?: boolean;
    collaborative?: boolean;
};
export type SpotifyReturn = {
    playlists: {
        href: string;
        items: SpotifyPlaylist[];
        limit: number;
        next: string | null;
        offset: number;
        previous: string | null;
        total: number;
    };
}
