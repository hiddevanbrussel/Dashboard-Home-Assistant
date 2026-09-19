import { describe, expect, it } from "vitest";
import {
  assistTtsProxyHref,
  conversationIdFromIntentOutput,
  isAllowedHaMediaUrl,
  parsePipelineList,
  speechFromIntentOutput,
  transcriptFromSttOutput,
  ttsUrlFromOutput,
} from "./assist";

describe("assist pipeline helpers", () => {
  it("parses a pipeline list and preferred id", () => {
    const parsed = parsePipelineList({
      preferred_pipeline: "home",
      pipelines: [
        { id: "home", name: "Home Assistant", language: "nl", stt_engine: "stt.home_assistant_cloud", tts_engine: "tts.home_assistant_cloud" },
        { id: "", name: "broken" },
        { name: "missing id" },
      ],
    });
    expect(parsed.preferred_pipeline).toBe("home");
    expect(parsed.pipelines).toEqual([
      {
        id: "home",
        name: "Home Assistant",
        language: "nl",
        conversation_engine: undefined,
        stt_engine: "stt.home_assistant_cloud",
        tts_engine: "tts.home_assistant_cloud",
      },
    ]);
  });

  it("reads speech, transcript, conversation id and tts url", () => {
    expect(
      speechFromIntentOutput({
        conversation_id: "abc",
        response: { speech: { plain: { speech: "Lampen staan aan" } } },
      })
    ).toBe("Lampen staan aan");
    expect(conversationIdFromIntentOutput({ conversation_id: "abc" })).toBe("abc");
    expect(transcriptFromSttOutput({ text: "zet de lamp aan" })).toBe("zet de lamp aan");
    expect(ttsUrlFromOutput({ url: "/api/tts_proxy/demo.mp3" })).toBe("/api/tts_proxy/demo.mp3");
  });

  it("only proxies TTS from the configured Home Assistant origin", () => {
    expect(isAllowedHaMediaUrl("http://ha.local:8123", "http://ha.local:8123/api/tts_proxy/a.mp3")).toBe(true);
    expect(isAllowedHaMediaUrl("http://ha.local:8123", "/api/tts_proxy/a.mp3")).toBe(true);
    expect(isAllowedHaMediaUrl("http://ha.local:8123", "https://evil.example/api/tts_proxy/a.mp3")).toBe(false);
    expect(assistTtsProxyHref("http://ha.local:8123/api/tts_proxy/a.mp3")).toBe(
      "/api/ha/assist/tts?url=http%3A%2F%2Fha.local%3A8123%2Fapi%2Ftts_proxy%2Fa.mp3"
    );
  });
});
