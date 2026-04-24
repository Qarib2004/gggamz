export interface IRawgGame {
  id: number
  name: string
  slug: string
  metacritic: number | null
  background_image: string | null

  added: number
  added_by_status: IAddedByStatus
  clip: IRawgClip | null
  dominant_color: string
  esrb_rating: IEsrbRating | null
  genres: IRawgNamedItem[]
  parent_platforms: IParentPlatform[]
  platforms: IPlatformItem[]
  playtime: number
  rating: number
  rating_top: number
  ratings: IRating[]
  ratings_count: number
  released: string | null
  reviews_count: number
  reviews_text_count: number
  saturated_color: string
  score: string
  short_screenshots: IScreenshot[]
  stores: IStoreItem[]
  suggestions_count: number
  tags: IRawgNamedItem[]
  tba: boolean
  updated: string
  user_game: unknown | null
}

export interface IAddedByStatus {
  yet: number
  owned: number
  beaten: number
  toplay: number
  dropped: number
  playing?: number
}

export interface IRawgNamedItem {
  id: number
  name: string
  slug: string
}

export interface IParentPlatform {
  platform: IRawgNamedItem
}

export interface IPlatformItem {
  platform: IRawgNamedItem
}

export interface IRating {
  id: number
  title: string
  count: number
  percent: number
}

export interface IScreenshot {
  id: number
  image: string
}

export interface IStoreItem {
  store: IRawgNamedItem
}

export interface IRawgClip {
  clip: string
  clips: {
    320: string
    640: string
    full: string
  }
  video: string
  preview: string
}

export interface IEsrbRating {
  id: number
  name: string
  slug: string
}
