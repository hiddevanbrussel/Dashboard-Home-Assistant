import { describe, expect, it } from "vitest";
import { formatCalendarTitle, subjectCodesFor } from "./calendar-titles";

const nl = subjectCodesFor("nl");
const en = subjectCodesFor("en");

describe("formatCalendarTitle", () => {
  it("expands a Dutch school timetable title", () => {
    const formatted = formatCalendarTitle("FA - ihu - rg1a,ra1a", nl);
    expect(formatted.title).toBe("Franse taal");
    expect(formatted.detail).toBe("ihu · rg1a,ra1a");
    expect(formatted.original).toBe("FA - ihu - rg1a,ra1a");
  });

  it("expands a bare subject code", () => {
    expect(formatCalendarTitle("NE", nl).title).toBe("Nederlands");
    expect(formatCalendarTitle("en", en).title).toBe("English");
  });

  it("leaves unknown or normal titles unchanged", () => {
    expect(formatCalendarTitle("Stand-up", nl)).toEqual({ title: "Stand-up" });
    expect(formatCalendarTitle("XYZ - foo", nl)).toEqual({ title: "XYZ - foo" });
    expect(formatCalendarTitle("", nl)).toEqual({ title: "" });
  });

  it("lets custom codes override the built-in list", () => {
    const codes = subjectCodesFor("nl", { FA: "Frans extra", ABC: "Speciale les" });
    expect(formatCalendarTitle("FA - 1a", codes).title).toBe("Frans extra");
    expect(formatCalendarTitle("ABC - groep 3", codes).title).toBe("Speciale les");
  });
});
