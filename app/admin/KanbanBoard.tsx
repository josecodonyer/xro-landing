'use client';

import { useState, useTransition } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  useDroppable,
  useDraggable,
} from '@dnd-kit/core';
import Link from 'next/link';
import { updateTicketStatusAction } from './actions';
import styles from './admin.module.css';

const COLUMNS = [
  { id: 'OPEN',        label: 'Abierto',     color: styles.colOpen },
  { id: 'IN_PROGRESS', label: 'En Progreso',  color: styles.colInProgress },
  { id: 'RESOLVED',    label: 'Resuelto',     color: styles.colResolved },
  { id: 'CLOSED',      label: 'Cerrado',      color: styles.colClosed },
] as const;

const CATEGORY_LABELS: Record<string, string> = {
  BUG: '🐛 Bug',
  SUGGESTION: '💡 Sugerencia',
  SUPPORT: '🛟 Soporte',
};

type Ticket = {
  id: number;
  title: string;
  category: string;
  status: string;
  userId: string;
  createdAt: Date;
  replies: unknown[];
};

function TicketCard({ ticket, isDragging }: { ticket: Ticket; isDragging?: boolean }) {
  return (
    <div className={`${styles.card} ${isDragging ? styles.cardDragging : ''}`}>
      <div className={styles.cardTop}>
        <span className={styles.cardCategory}>{CATEGORY_LABELS[ticket.category] ?? ticket.category}</span>
        <span className={styles.cardId}>#{ticket.id}</span>
      </div>
      <Link href={`/admin/${ticket.id}`} className={styles.cardTitle} onClick={e => e.stopPropagation()}>
        {ticket.title}
      </Link>
      <div className={styles.cardBottom}>
        <span className={styles.cardUser}>{ticket.userId}</span>
        <span className={styles.cardDate}>
          {new Date(ticket.createdAt).toLocaleDateString('es-ES')}
        </span>
        {(ticket.replies as unknown[]).length > 0 && (
          <span className={styles.cardReplies}>💬 {(ticket.replies as unknown[]).length}</span>
        )}
      </div>
    </div>
  );
}

function DraggableCard({ ticket }: { ticket: Ticket }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: ticket.id,
    data: { ticket },
  });

  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
    : undefined;

  return (
    <div ref={setNodeRef} style={{ ...style, opacity: isDragging ? 0.3 : 1 }} {...listeners} {...attributes}>
      <TicketCard ticket={ticket} />
    </div>
  );
}

function DroppableColumn({
  column,
  tickets,
}: {
  column: typeof COLUMNS[number];
  tickets: Ticket[];
}) {
  const { setNodeRef, isOver } = useDroppable({ id: column.id });

  return (
    <div className={`${styles.column} ${column.color} ${isOver ? styles.columnOver : ''}`}>
      <div className={styles.columnHeader}>
        <span className={styles.columnLabel}>{column.label}</span>
        <span className={styles.columnCount}>{tickets.length}</span>
      </div>
      <div ref={setNodeRef} className={styles.columnBody}>
        {tickets.map(ticket => (
          <DraggableCard key={ticket.id} ticket={ticket} />
        ))}
        {tickets.length === 0 && (
          <div className={styles.columnEmpty}>Sin tickets</div>
        )}
      </div>
    </div>
  );
}

export default function KanbanBoard({ initialTickets }: { initialTickets: Ticket[] }) {
  const [tickets, setTickets] = useState(initialTickets);
  const [activeTicket, setActiveTicket] = useState<Ticket | null>(null);
  const [, startTransition] = useTransition();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  const grouped = COLUMNS.reduce<Record<string, Ticket[]>>((acc, col) => {
    acc[col.id] = tickets.filter(t => t.status === col.id);
    return acc;
  }, {} as Record<string, Ticket[]>);

  function onDragStart(e: DragStartEvent) {
    const ticket = tickets.find(t => t.id === e.active.id);
    if (ticket) setActiveTicket(ticket);
  }

  function onDragEnd(e: DragEndEvent) {
    setActiveTicket(null);
    const { active, over } = e;
    if (!over) return;

    const ticketId = active.id as number;
    const newStatus = over.id as string;
    const ticket = tickets.find(t => t.id === ticketId);
    if (!ticket || ticket.status === newStatus) return;

    // Optimistic update
    setTickets(prev => prev.map(t => t.id === ticketId ? { ...t, status: newStatus } : t));

    startTransition(async () => {
      try {
        await updateTicketStatusAction(ticketId, newStatus);
      } catch {
        // Revert on error
        setTickets(prev => prev.map(t => t.id === ticketId ? { ...t, status: ticket.status } : t));
      }
    });
  }

  return (
    <DndContext sensors={sensors} onDragStart={onDragStart} onDragEnd={onDragEnd}>
      <div className={styles.kanban}>
        {COLUMNS.map(col => (
          <DroppableColumn key={col.id} column={col} tickets={grouped[col.id] ?? []} />
        ))}
      </div>
      <DragOverlay>
        {activeTicket && <TicketCard ticket={activeTicket} isDragging />}
      </DragOverlay>
    </DndContext>
  );
}
