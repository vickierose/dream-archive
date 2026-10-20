"use client";

import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import ForceGraph2D, {
  type ForceGraphMethods,
  type NodeObject,
  type LinkObject,
} from "react-force-graph-2d";
import { useTranslations } from "next-intl";
import { Maximize, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SelectedDreamsPanel } from "./selected-dreams-panel";
import {
  connectionWidth,
  nodeRadius,
  matchingDreams,
  type ConstellationDream,
  type ConstellationData,
  type ConstellationNode,
} from "@/lib/explore/constellation";

type GraphNode = NodeObject<ConstellationNode>;
type Edge = {
  dreamCount: number;
  sourceEmoji: string;
  targetEmoji: string;
  sourceName: string;
  targetName: string;
  id: string;
};
type GraphLink = LinkObject<ConstellationNode, Edge>;

export default function ConstellationCanvas({
  data,
  dreams,
}: {
  data: ConstellationData;
  dreams: ConstellationDream[];
}) {
  const t = useTranslations("Explore");
  const common = useTranslations("Dreams");
  const helpId = useId();
  const container = useRef<HTMLDivElement>(null);
  const graph = useRef<ForceGraphMethods<GraphNode, GraphLink> | undefined>(
    undefined,
  );
  const fitted = useRef(false);
  const interacted = useRef(false);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [hover, setHover] = useState<GraphNode | GraphLink | null>(null);
  const [pointer, setPointer] = useState({ x: 0, y: 0 });
  const [showText, setShowText] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const selection = useMemo(() => new Set(selectedIds), [selectedIds]);
  const sharedDreams = useMemo(() => matchingDreams(dreams, selectedIds), [dreams, selectedIds]);
  const [dimOpacity, setDimOpacity] = useState(1);
  const opacity = useRef(1);

  const focused = useMemo(() => {
    const nodes = new Set<string>();
    const links = new Set<string>();
    if (selection.size) {
      for (const id of selection) nodes.add(id);
      // Read immutable endpoints: the graph engine replaces its own with objects.
      for (const link of data.links) {
        if (selection.has(link.source) || selection.has(link.target)) {
          nodes.add(link.source);
          nodes.add(link.target);
          links.add(JSON.stringify([link.source, link.target]));
        }
      }
    }
    return { nodes, links };
  }, [data.links, selection]);

  // The engine mutates positions and link endpoints; keep the server data intact.
  const graphData = useMemo(() => {
    const symbols = new Map(data.nodes.map((node) => [node.id, node]));
    return {
      nodes: data.nodes.map((node): GraphNode => ({ ...node })),
      links: data.links.map((link) => ({
        ...link,
        sourceEmoji: symbols.get(link.source)!.emoji,
        targetEmoji: symbols.get(link.target)!.emoji,
        sourceName: symbols.get(link.source)!.name,
        targetName: symbols.get(link.target)!.name,
        id: JSON.stringify([link.source, link.target]),
      })),
    };
  }, [data]);

  useEffect(() => {
    const element = container.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) => {
      setSize({
        width: Math.floor(entry.contentRect.width),
        height: Math.floor(entry.contentRect.height),
      });
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!size.width) return;
    graph.current?.d3Force("charge")?.strength(-180).distanceMax(300);
    graph.current?.d3Force("link")?.distance(115);
    // Centering alone moves the whole graph without bringing its groups together.
    // A gentle pull on each node keeps disconnected constellations nearby.
    graph.current?.d3Force("clusterPull", (alpha) => {
      for (const node of graphData.nodes) {
        node.vx = (node.vx ?? 0) - (node.x ?? 0) * 0.025 * alpha;
        node.vy = (node.vy ?? 0) - (node.y ?? 0) * 0.025 * alpha;
      }
    });
    graph.current?.d3ReheatSimulation();
  }, [size.width, graphData]);

  useEffect(() => {
    const from = opacity.current;
    const target = selectedIds.length ? 0.12 : 1;
    const duration = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 220;
    let frame: number;
    let start: number | undefined;
    const animate = (time: number) => {
      start ??= time;
      const progress = duration ? Math.min(1, (time - start) / duration) : 1;
      opacity.current = from + (target - from) * (1 - (1 - progress) ** 3);
      setDimOpacity(opacity.current);
      if (progress < 1) frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [selectedIds.length]);

  const selectNode = useCallback((id: string) => {
    interacted.current = true;
    setSelectedIds((current) => current.includes(id) ? current : [...current, id]);
    setHover(null);
  }, []);

  const fit = useCallback(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    graph.current?.zoomToFit(reduceMotion ? 0 : 350, 55);
  }, []);

  const drawNode = useCallback(
    (node: GraphNode, ctx: CanvasRenderingContext2D) => {
      const radius = nodeRadius(node.dreamCount);
      const x = node.x ?? 0;
      const y = node.y ?? 0;
      ctx.save();
      ctx.globalAlpha = focused.nodes.has(node.id) ? 1 : dimOpacity;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fillStyle = "#fcf8f2";
      ctx.fill();
      ctx.strokeStyle = selection.has(node.id) ? "#604b7a" : "#b9a6d0";
      ctx.lineWidth = selection.has(node.id) ? 2.5 : 1.5;
      ctx.stroke();
      ctx.font = `${radius * 1.15}px "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "#443653";
      ctx.fillText(node.emoji, x, y + radius * 0.04);
      ctx.restore();
    },
    [selection, dimOpacity, focused],
  );

  return (
    <section
      aria-label={t("chartLabel")}
      aria-describedby={helpId}
      className="font-base"
    >
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <p id={helpId} className="max-w-xl text-sm text-ink-soft">
          {t("instructions")} {t("focusHint")}
        </p>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            aria-label={t("zoomOut")}
            onClick={() => {
              interacted.current = true;
              graph.current?.zoom(
                Math.max(0.05, (graph.current?.zoom() ?? 1) / 1.4),
                200,
              );
            }}
          >
            <Minus size={16} aria-hidden="true" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            aria-label={t("zoomIn")}
            onClick={() => {
              interacted.current = true;
              graph.current?.zoom(
                Math.min(8, (graph.current?.zoom() ?? 1) * 1.4),
                200,
              );
            }}
          >
            <Plus size={16} aria-hidden="true" />
          </Button>
          {selectedIds.length > 0 && (
            <Button variant="ghost" size="sm" onClick={() => setSelectedIds([])}>
              {t("clearFocus")}
            </Button>
          )}
          <Button variant="secondary" size="sm" onClick={fit}>
            <Maximize size={16} aria-hidden="true" />
            {t("reset")}
          </Button>
        </div>
      </div>
      <div
        ref={container}
        className="relative h-[65svh] min-h-96 max-h-200 overflow-hidden rounded-panel border border-paper-lilac-border bg-paper-lilac"
        style={{
          backgroundImage:
            "radial-gradient(circle, #d9cce1 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
        onPointerDown={() => {
          interacted.current = true;
        }}
        onWheel={() => {
          interacted.current = true;
        }}
        onPointerMove={(event) => {
          const bounds = event.currentTarget.getBoundingClientRect();
          setPointer({
            x: event.clientX - bounds.left,
            y: event.clientY - bounds.top,
          });
        }}
        onPointerLeave={() => setHover(null)}
      >
        {size.width > 0 && size.height > 0 && (
          <ForceGraph2D<ConstellationNode, Edge>
            ref={graph}
            graphData={graphData}
            width={size.width}
            height={size.height}
            backgroundColor="rgba(0,0,0,0)"
            nodeVal={(node) => (nodeRadius(node.dreamCount) / 4) ** 2}
            nodeCanvasObject={drawNode}
            nodePointerAreaPaint={(node, color, ctx) => {
              ctx.beginPath();
              ctx.arc(
                node.x ?? 0,
                node.y ?? 0,
                nodeRadius(node.dreamCount) + 2,
                0,
                Math.PI * 2,
              );
              ctx.fillStyle = color;
              ctx.fill();
            }}
            nodeLabel={() => ""}
            linkLabel={() => ""}
            linkWidth={(link) => connectionWidth(link.dreamCount)}
            linkColor={(link) =>
              `rgba(161, 138, 185, ${focused.links.has(link.id) ? 1 : dimOpacity})`
            }
            linkHoverPrecision={8}
            onNodeHover={setHover}
            onLinkHover={setHover}
            onNodeDrag={() => setHover(null)}
            onNodeClick={(node) => selectNode(node.id)}
            onBackgroundClick={() => { setSelectedIds([]); setHover(null); }}
            minZoom={0.05}
            maxZoom={8}
            warmupTicks={80}
            cooldownTicks={120}
            onEngineStop={() => {
              if (!fitted.current && !interacted.current) fit();
              fitted.current = true;
            }}
          />
        )}
        {hover && (
          <div
            role="tooltip"
            className="pointer-events-none absolute z-10 max-w-[calc(100%-1.5rem)] rounded-control border border-paper-lilac-border bg-paper-light px-3 py-2 text-sm text-ink shadow-popover"
            style={{
              left: Math.max(12, Math.min(pointer.x + 14, size.width - 230)),
              top: Math.max(12, Math.min(pointer.y + 16, size.height - 65)),
            }}
          >
            {"emoji" in hover
              ? `${hover.emoji} ${hover.name}: ${common("count", { count: hover.dreamCount })}`
              : `${hover.sourceEmoji} + ${hover.targetEmoji}: ${common("count", { count: hover.dreamCount })}`}
          </div>
        )}
      </div>
      {selectedIds.length >= 2 && (
        <SelectedDreamsPanel
          dreams={sharedDreams}
          symbols={data.nodes.filter((node) => selection.has(node.id))}
        />
      )}
      <p className="mt-3 text-sm text-ink-soft">{t("legend")}</p>
      <details
        className="mt-4 text-sm text-ink-soft"
        onToggle={(event) => setShowText(event.currentTarget.open)}
      >
        <summary className="control-interaction w-fit rounded-control">
          {t("textView")}
        </summary>
        {showText && (
          <>
            <ul className="mt-3 grid gap-2 sm:grid-cols-2">
              {data.nodes.map((node) => (
                <li key={node.id}>
                  <button
                    type="button"
                    aria-pressed={selection.has(node.id)}
                    className="control-interaction rounded-control text-left"
                    onClick={() => selectNode(node.id)}
                  >
                    {node.emoji} {node.name}:{" "}
                    {common("count", { count: node.dreamCount })}
                  </button>
                </li>
              ))}
            </ul>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {graphData.links.map((link) => (
                <li key={link.id}>
                  {link.sourceName} + {link.targetName}:{" "}
                  {common("count", { count: link.dreamCount })}
                </li>
              ))}
            </ul>
          </>
        )}
      </details>
    </section>
  );
}
