import { cn } from "@/lib/utils";
import { usePipelineLeads, useUpdatePipelineStage, PIPELINE_STAGES, type PipelineLead, type PipelineStage } from "@/hooks/use-pipeline";
import { Loader2 } from "lucide-react";
import { DndContext, DragOverlay, closestCorners, type DragStartEvent, type DragEndEvent, useDroppable, useDraggable } from "@dnd-kit/core";
import { useState } from "react";

function ScoreBadge({ score }: { score: number | null }) {
  if (score === null || score === 0) return null;
  return (
    <span className={cn(
      "text-[10px] font-mono font-medium px-1.5 py-0.5 rounded",
      (score ?? 0) >= 85 ? "bg-success/15 text-success" :
      (score ?? 0) >= 65 ? "bg-accent/15 text-accent" :
      "bg-muted text-muted-foreground"
    )}>
      AI {score}
    </span>
  );
}

function DraggableCard({ lead }: { lead: PipelineLead }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ id: lead.id });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={cn(
        "p-2.5 rounded-md bg-secondary/50 border border-border/50 hover:border-primary/30 transition-colors cursor-grab active:cursor-grabbing group",
        isDragging && "opacity-40"
      )}
    >
      <div className="flex items-start justify-between gap-1">
        <p className="text-xs font-medium text-card-foreground group-hover:text-primary transition-colors leading-tight">
          {lead.name}
        </p>
        <ScoreBadge score={lead.lead_score} />
      </div>
      <p className="text-[11px] text-muted-foreground mt-1">{lead.company ?? "—"}</p>
      <div className="flex items-center justify-between mt-2">
        <span className={cn(
          "text-[10px] font-medium px-2 py-0.5 rounded-full",
          lead.status === "Qualified" ? "bg-success/15 text-success" :
          lead.status === "Contacted" ? "bg-accent/15 text-accent" :
          lead.status === "Lost" ? "bg-destructive/15 text-destructive" :
          "bg-primary/15 text-primary"
        )}>
          {lead.status}
        </span>
        {lead.email && <span className="text-[10px] text-muted-foreground truncate max-w-[100px]">{lead.email}</span>}
      </div>
    </div>
  );
}

function LeadCardOverlay({ lead }: { lead: PipelineLead }) {
  return (
    <div className="p-2.5 rounded-md bg-card border border-primary/40 shadow-glow cursor-grabbing w-[200px]">
      <p className="text-xs font-medium text-card-foreground">{lead.name}</p>
      <p className="text-[11px] text-muted-foreground mt-1">{lead.company ?? "—"}</p>
    </div>
  );
}

function StageColumn({ stageKey, label, leads }: { stageKey: string; label: string; leads: PipelineLead[] }) {
  const { setNodeRef, isOver } = useDroppable({ id: stageKey });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "flex-1 min-w-[200px] p-3 space-y-2 transition-colors",
        isOver && "bg-primary/5"
      )}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-card-foreground">{label}</span>
        <span className="text-xs text-muted-foreground font-mono">{leads.length}</span>
      </div>
      <div className="space-y-2 min-h-[60px]">
        {leads.map((lead) => (
          <DraggableCard key={lead.id} lead={lead} />
        ))}
      </div>
    </div>
  );
}

export function PipelineBoard() {
  const { data: leads = [], isLoading } = usePipelineLeads();
  const updateStage = useUpdatePipelineStage();
  const [activeId, setActiveId] = useState<string | null>(null);

  const activeLead = leads.find((l) => l.id === activeId);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = event;
    if (!over) return;

    const leadId = active.id as string;
    const newStage = over.id as PipelineStage;
    const lead = leads.find((l) => l.id === leadId);

    if (lead && lead.pipeline_stage !== newStage) {
      updateStage.mutate({ leadId, stage: newStage });
    }
  };

  const groupedLeads = PIPELINE_STAGES.map((stage) => ({
    ...stage,
    leads: leads.filter((l) => l.pipeline_stage === stage.key),
  }));

  const totalLeads = leads.length;

  return (
    <div className="rounded-lg border border-border bg-card shadow-card">
      <div className="flex items-center justify-between px-5 py-3 border-b border-border">
        <h2 className="text-sm font-semibold text-card-foreground">Pipeline de Vendas</h2>
        <span className="text-xs text-muted-foreground font-mono">{totalLeads} leads no pipeline</span>
      </div>
      {isLoading ? (
        <div className="flex items-center justify-center py-10">
          <Loader2 className="w-5 h-5 animate-spin text-primary" />
        </div>
      ) : (
        <DndContext collisionDetection={closestCorners} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
          <div className="flex divide-x divide-border overflow-x-auto">
            {groupedLeads.map((stage) => (
              <StageColumn key={stage.key} stageKey={stage.key} label={stage.label} leads={stage.leads} />
            ))}
          </div>
          <DragOverlay>
            {activeLead ? <LeadCardOverlay lead={activeLead} /> : null}
          </DragOverlay>
        </DndContext>
      )}
    </div>
  );
}
