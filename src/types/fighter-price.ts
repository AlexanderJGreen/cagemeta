export interface FighterPrice {
  fighterId: string;
  eventId: string;
  /** Draft cost in credits; favorites cost more, underdogs are cheap. */
  price: number;
  /** American odds, if available from the data provider (e.g. -250, +180). */
  odds?: number;
}
