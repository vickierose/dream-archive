"use client";

import { useEffect, useRef } from "react";
import { Picker } from "emoji-mart";
import data from "@emoji-mart/data";

export default function EmojiPicker({
  onSelect,
}: {
  onSelect: (emoji: string) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const onSelectRef = useRef(onSelect);

  useEffect(() => {
    onSelectRef.current = onSelect;
  }, [onSelect]);

  useEffect(() => {
    const container = containerRef.current!;
    const picker = new Picker({
      data,
      theme: "light",
      set: "native",
      autoFocus: false,
      dynamicWidth: true,
      emojiSize: 20,
      emojiButtonSize: 28,
      previewPosition: "none",
      skinTonePosition: "search",
      onEmojiSelect: (emoji: { native: string }) =>
        onSelectRef.current(emoji.native),
    });
    container.appendChild(picker as unknown as HTMLElement);
    return () => container.replaceChildren();
  }, []);

  return <div ref={containerRef} className="dream-emoji-picker" />;
}
