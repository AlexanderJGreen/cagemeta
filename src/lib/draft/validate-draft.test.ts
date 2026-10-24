import { describe, expect, it } from "vitest";
import type { Fight } from "@/types";
import { isFightLocked } from "./locking";
import { validateDraft, type DraftValidationInput } from "./validate-draft";

const fight = (id: string, a: string, b: string, start: string, rounds: 3 | 5 = 3): Fight => ({
  id,
  eventId: "e",
  fighterAId: a,
  fighterBId: b,
  weightClass: "Lightweight",
  cardPosition: "main-card",
  boutOrder: 1,
  scheduledRounds: rounds,
  status: "scheduled",
  scheduledStartTime: start,
});

const fights = [
  fight("fi1", "a1", "b1", "2026-11-15T03:00:00Z", 5),
  fight("fi2", "a2", "b2", "2026-11-15T02:00:00Z"),
  fight("fi3", "a3", "b3", "2026-11-15T01:00:00Z"),
];
const prices = new Map([
  ["a1", 30], ["b1", 20], ["a2", 25], ["b2", 15], ["a3", 20], ["b3", 10],
]);
const BEFORE_ALL = new Date("2026-11-14T00:00:00Z");

function input(over: Partial<DraftValidationInput> & { fighterIds?: string[] } = {}): DraftValidationInput {
  const { fighterIds = [], ...rest } = over;
  return {
    league: { budget: 100, maxDraftPicks: 3, lockMode: "per-fight" },
    event: { date: "2026-11-15T01:00:00Z", status: "upcoming" },
    fights,
    priceByFighterId: prices,
    existingFighterIds: [],
    proposed: { fighterIds },
    now: BEFORE_ALL,
    ...rest,
  };
}

describe("validateDraft", () => {
  it("accepts a valid draft", () => {
    expect(validateDraft(input({ fighterIds: ["a1", "b2", "a3"] }))).toEqual([]);
  });

  it("accepts an empty draft (clearing picks)", () => {
    expect(validateDraft(input({ fighterIds: [] }))).toEqual([]);
  });

  it("rejects going over budget", () => {
    const errors = validateDraft(input({ league: { budget: 50, maxDraftPicks: 3, lockMode: "per-fight" }, fighterIds: ["a1", "a2"] }));
    expect(errors).toEqual(["That roster costs 55 credits; the budget is 50."]);
  });

  it("allows spending exactly the budget", () => {
    const errors = validateDraft(input({ league: { budget: 55, maxDraftPicks: 3, lockMode: "per-fight" }, fighterIds: ["a1", "a2"] }));
    expect(errors).toEqual([]);
  });

  it("rejects more picks than the league allows", () => {
    const errors = validateDraft(input({ league: { budget: 500, maxDraftPicks: 2, lockMode: "per-fight" }, fighterIds: ["a1", "a2", "a3"] }));
    expect(errors).toEqual(["You can pick at most 2 fighters."]);
  });

  it("rejects both fighters from one bout", () => {
    expect(validateDraft(input({ fighterIds: ["a1", "b1"] }))).toContain(
      "You can only pick one fighter from each bout.",
    );
  });

  it("rejects duplicate fighters", () => {
    expect(validateDraft(input({ fighterIds: ["a1", "a1"] }))).toContain("A fighter was picked more than once.");
  });

  it("rejects fighters not on the card", () => {
    expect(validateDraft(input({ fighterIds: ["zzz"] }))).toContain("A picked fighter isn't on this card.");
  });

  it("rejects any change once the event is no longer upcoming", () => {
    const errors = validateDraft(input({ event: { date: "2026-11-15T01:00:00Z", status: "live" }, fighterIds: ["a1"] }));
    expect(errors).toEqual(["This event is no longer open for picks."]);
  });

  describe("per-fight locking", () => {
    const afterFi3 = new Date("2026-11-15T01:30:00Z"); // fi3 started, fi1 and fi2 haven't

    it("blocks adding a fighter on a started fight", () => {
      expect(validateDraft(input({ now: afterFi3, fighterIds: ["a3"] }))).toContain(
        "Picks are locked for a fight you tried to add.",
      );
    });

    it("blocks dropping a pick on a started fight", () => {
      const errors = validateDraft(input({ now: afterFi3, existingFighterIds: ["a3"], fighterIds: ["a1"] }));
      expect(errors).toContain("A pick on a fight that has already locked can't be removed.");
    });

    it("allows keeping a locked pick while changing others", () => {
      const errors = validateDraft(input({ now: afterFi3, existingFighterIds: ["a3"], fighterIds: ["a3", "a1"] }));
      expect(errors).toEqual([]);
    });
  });

  describe("event-start locking", () => {
    it("locks every fight once the event has started", () => {
      const now = new Date("2026-11-15T01:00:01Z");
      const errors = validateDraft(
        input({ now, league: { budget: 100, maxDraftPicks: 3, lockMode: "event-start" }, fighterIds: ["a1"] }),
      );
      expect(errors).toContain("Picks are locked for a fight you tried to add.");
    });
  });

  describe("Call the Finish", () => {
    const call = { fightId: "fi1", method: "KO/TKO" as const, round: 2 };

    it("accepts a valid call", () => {
      expect(validateDraft(input({ proposed: { fighterIds: [], finishCall: call } }))).toEqual([]);
    });

    it("rejects a round beyond the scheduled length", () => {
      const errors = validateDraft(input({ proposed: { fighterIds: [], finishCall: { fightId: "fi2", method: "KO/TKO", round: 4 } } }));
      expect(errors).toEqual(["That fight is scheduled for 3 rounds."]);
    });

    it("accepts a round 5 call on a five-round fight", () => {
      const errors = validateDraft(input({ proposed: { fighterIds: [], finishCall: { ...call, round: 5 } } }));
      expect(errors).toEqual([]);
    });

    it("rejects calling a Draw", () => {
      const errors = validateDraft(input({ proposed: { fighterIds: [], finishCall: { ...call, method: "Draw" } } }));
      expect(errors).toEqual(["Pick a method to call: KO/TKO, Submission, or a decision."]);
    });

    it("rejects a fight from another card", () => {
      const errors = validateDraft(input({ proposed: { fighterIds: [], finishCall: { ...call, fightId: "nope" } } }));
      expect(errors).toEqual(["Call the Finish must be on a fight from this card."]);
    });

    it("rejects a new call on a locked fight", () => {
      const now = new Date("2026-11-15T01:30:00Z");
      const errors = validateDraft(input({ now, proposed: { fighterIds: [], finishCall: { fightId: "fi3", method: "Submission", round: 1 } } }));
      expect(errors).toContain("That fight has already locked, so you can't call it.");
    });

    it("freezes an existing call once its fight locks", () => {
      const now = new Date("2026-11-15T01:30:00Z");
      const existing = { fightId: "fi3", method: "Submission" as const, round: 1 };
      expect(validateDraft(input({ now, existingFinishCall: existing, proposed: { fighterIds: [], finishCall: existing } }))).toEqual([]);
      expect(validateDraft(input({ now, existingFinishCall: existing, proposed: { fighterIds: [] } }))).toEqual([
        "Your Call the Finish is locked and can't be changed.",
      ]);
      expect(
        validateDraft(input({ now, existingFinishCall: existing, proposed: { fighterIds: [], finishCall: { ...existing, round: 2 } } })),
      ).toContain("Your Call the Finish is locked and can't be changed.");
    });

    it("lets a user move an unlocked call to another unlocked fight", () => {
      const existing = { fightId: "fi1", method: "KO/TKO" as const, round: 1 };
      const errors = validateDraft(input({ existingFinishCall: existing, proposed: { fighterIds: [], finishCall: { fightId: "fi2", method: "Submission", round: 2 } } }));
      expect(errors).toEqual([]);
    });
  });
});

describe("isFightLocked", () => {
  const f = { scheduledStartTime: "2026-11-15T03:00:00Z", status: "scheduled" as const };
  const e = { date: "2026-11-15T01:00:00Z", status: "upcoming" as const };

  it("locks per-fight exactly at the start time", () => {
    expect(isFightLocked("per-fight", f, e, new Date("2026-11-15T02:59:59Z"))).toBe(false);
    expect(isFightLocked("per-fight", f, e, new Date("2026-11-15T03:00:00Z"))).toBe(true);
  });

  it("uses the event start in event-start mode", () => {
    expect(isFightLocked("event-start", f, e, new Date("2026-11-15T01:00:00Z"))).toBe(true);
  });

  it("always locks fights that are no longer scheduled", () => {
    expect(isFightLocked("per-fight", { ...f, status: "cancelled" }, e, new Date("2020-01-01"))).toBe(true);
  });
});
