'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Modal } from '@/components/ui/modal';

// Types definition
interface KanbanItem {
  id: string;
  type: 'reservation' | 'loan';
  title: string;
  subtitle: string;
  date: string;
  status: string;
  bookId: string;
  studentId: string;
  data: any; // Raw object
}

interface Column {
  id: string;
  title: string;
  items: KanbanItem[];
}

export default function AdminKanban() {
  // Helper to fix timezone issues by appending T12:00:00 if standard date
  const formatDate = (dateString: string) => {
      if (!dateString) return 'Data inv\u00E1lida';
      const date = new Date(dateString);
      // Force display using UTC components to avoid "previous day" issue
      const day = date.getUTCDate().toString().padStart(2, '0');
      const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
      const year = date.getUTCFullYear();
      return `${day}/${month}/${year}`;
  };
  const [columns, setColumns] = useState<Record<string, Column>>({
    reserved: { id: 'reserved', title: 'Solicitações (Reservas)', items: [] },
    active: { id: 'active', title: 'Emprestados (Ativos)', items: [] },
    returned: { id: 'returned', title: 'Devolvidos (Histórico)', items: [] }
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Mobile Tab State
  const [activeTab, setActiveTab] = useState('reserved');

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [pendingMove, setPendingMove] = useState<{itemId: string, fromId: string, toId: string, dueDate: string} | null>(null);
  const [dueDate, setDueDate] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/kanban/data');
      const data = await res.json();

      // Transform API data to Kanban columns
      const reservedItems: KanbanItem[] = data.reservations.map((r: any) => ({
        id: r.id,
        type: 'reservation',
        title: r.book?.title || 'Livro Desconhecido',
        subtitle: r.student?.name || 'Aluno Desconhecido',
        date: `Solicitado em: ${formatDate(r.createdAt)}`,
        status: 'reserved',
        bookId: r.bookId,
        studentId: r.studentId,
        data: r
      }));

      const activeItems: KanbanItem[] = data.activeLoans.map((l: any) => ({
        id: l.id,
        type: 'loan',
        title: l.book?.title || 'Livro Desconhecido',
        subtitle: l.student?.name || 'Aluno Desconhecido',
        date: `Devolu\u00E7\u00E3o Prevista: ${formatDate(l.dueDate)}`,
        status: 'active',
        bookId: l.bookId,
        studentId: l.studentId,
        data: l
      }));

      const returnedItems: KanbanItem[] = data.returnedLoans.map((l: any) => ({
        id: l.id,
        type: 'loan',
        title: l.book?.title || 'Livro Desconhecido',
        subtitle: l.student?.name || 'Aluno Desconhecido',
        date: `Devolvido em: ${formatDate(l.returnDate)}`,
        status: 'returned',
        bookId: l.bookId,
        studentId: l.studentId,
        data: l
      }));

      setColumns({
        reserved: { id: 'reserved', title: 'Solicitações', items: reservedItems },
        active: { id: 'active', title: 'Emprestados', items: activeItems },
        returned: { id: 'returned', title: 'Devolvidos', items: returnedItems }
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // --- UNIFIED MOVE HANDLER (Everything goes through here) ---
  const handleMoveValues = (itemId: string, fromId: string, toId: string) => {
     // 1. Reserved -> Active (Loan Creation)
    if (fromId === 'reserved' && toId === 'active') {
      // Need to ask for Due Date
      const defaultDate = new Date();
      defaultDate.setDate(defaultDate.getDate() + 7);
      const defaultDateStr = defaultDate.toISOString().split('T')[0];

      setPendingMove({ itemId, fromId, toId, dueDate: '' });
      setDueDate(defaultDateStr);
      setShowModal(true);
      return; 
    }

    // 2. Active -> Returned (Return Book)
    if (fromId === 'active' && toId === 'returned') {
       processMove(itemId, fromId, toId);
       // Optimistic Update
       optimisticMove(itemId, fromId, toId);
       return;
    }

    // Default: Just Move (if logic allows)
    optimisticMove(itemId, fromId, toId);
  }

  const onDragEnd = async (result: DropResult) => {
    const { source, destination, draggableId } = result;

    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    handleMoveValues(draggableId, source.droppableId, destination.droppableId);
  };

  const optimisticMove = (itemId: string, fromId: string, toId: string) => {
     const sourceCol = columns[fromId];
     const destCol = columns[toId];
     
     // Find and remove item
     const itemIndex = sourceCol.items.findIndex(i => i.id === itemId);
     if (itemIndex === -1) return;
     
     const item = sourceCol.items[itemIndex];
     const sourceItems = [...sourceCol.items];
     sourceItems.splice(itemIndex, 1);

     // Add to dest
     const destItems = [item, ...destCol.items]; // Add to top

     setColumns({
         ...columns,
         [fromId]: { ...sourceCol, items: sourceItems },
         [toId]: { ...destCol, items: destItems }
     });
  };

  const processMove = async (itemId: string, fromStatus: string, toStatus: string, extraData?: any) => {
    setError(null);
    try {
        const res = await fetch('/api/kanban/move', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                itemId,
                fromStatus,
                toStatus,
                ...extraData
            })
        });
        
        if (!res.ok) throw new Error('Falha ao mover');
        
        // Refresh data to ensure all IDs are correct
        fetchData(); 
    } catch (e) {
        console.error(e);
        setError('Não foi possível salvar a movimentação. Os dados foram recarregados.');
        fetchData();
    }
  };

  const confirmLoan = async () => {
     if (!pendingMove) return;
     const { itemId, fromId, toId } = pendingMove;

     setShowModal(false);
     
     // Optimistic move
     optimisticMove(itemId, fromId, toId);
     
     // API Call
     await processMove(itemId, fromId, toId, { dueDate });
     setPendingMove(null);
  };

  if (loading) return (
    <div className="space-y-4">
        <div className="h-10 w-full md:w-1/3 bg-muted/50 rounded-full animate-pulse mb-4"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
                <div key={i} className="h-64 bg-muted/30 rounded-2xl animate-pulse"></div>
            ))}
        </div>
    </div>
  );

  // Helper to render a single column's content (reusable for both views)
  const renderColumnContent = (columnId: string, column: Column, isMobile: boolean) => (
    <Droppable droppableId={columnId} isDropDisabled={isMobile}>
        {(provided, snapshot) => (
            <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className={`
                bg-muted/50 p-4 rounded-2xl 
                ${isMobile ? 'min-h-[300px]' : 'min-h-[500px]'}
                ${snapshot.isDraggingOver ? 'bg-muted' : ''}
                transition-colors
            `}
            >
            {column.items.length === 0 && (
                <div className="text-center text-muted-foreground py-8 text-sm">
                    Nenhum item aqui.
                </div>
            )}
            {column.items.map((item, index) => (
                <Draggable key={item.id} draggableId={item.id} index={index} isDragDisabled={isMobile}>
                {(provided, snapshot) => (
                    <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={`bg-card p-4 rounded-3xl shadow-sm mb-3 border-l-4 relative group ${
                        item.type === 'reservation' ? 'border-yellow-400' :
                        item.status === 'active' ? 'border-green-500' : 'border-border'
                    }`}
                    style={{
                        ...provided.draggableProps.style,
                        opacity: snapshot.isDragging ? 0.8 : 1
                    }}
                    >
                        {/* Source Badge */}
                        <span className={`absolute top-2 right-2 text-[10px] font-bold px-1.5 py-0.5 rounded ${
                            item.type === 'reservation' ? 'bg-yellow-100 text-yellow-800' :
                            item.data.loanType === 'online' ? 'bg-purple-100 text-purple-800' :
                            'bg-muted text-muted-foreground'
                        }`}>
                            {item.type === 'reservation' ? 'WEB' : 
                            item.data.loanType === 'online' ? 'ONLINE' : 'LOCAL'}
                        </span>

                    <h3 className="font-semibold text-foreground pr-16">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.subtitle}</p>
                    <p className="text-xs text-muted-foreground/70 mt-2">{item.date}</p>

                    {/* MOBILE ACTION BUTTONS (ALWAYS VISIBLE) */}
                    <div className="mt-3 pt-3 border-t border-border flex flex-wrap items-center justify-between gap-2">
                        <Link
                            href={item.type === 'reservation' ? `/admin/reservas/${item.id}` : `/admin/emprestimos/${item.id}`}
                            className="text-xs font-medium text-primary hover:underline"
                        >
                            Ver detalhes
                        </Link>
                        <div className="flex items-center gap-1.5">
                        {columnId === 'reserved' && (
                            <button 
                                onClick={() => handleMoveValues(item.id, 'reserved', 'active')}
                                className="text-xs bg-green-50 text-green-700 px-3 py-1.5 rounded-full font-medium hover:bg-green-100 flex items-center gap-1 active:scale-95 transition-transform"
                            >
                                Emprestar →
                            </button>
                        )}
                        {columnId === 'active' && (
                            <button 
                                onClick={() => handleMoveValues(item.id, 'active', 'returned')}
                                className="text-xs bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full font-medium hover:bg-blue-100 flex items-center gap-1 active:scale-95 transition-transform"
                            >
                                Devolver →
                            </button>
                        )}
                        </div>
                    </div>
                    </div>
                )}
                </Draggable>
            ))}
            {provided.placeholder}
            </div>
        )}
    </Droppable>
  );

  return (
    <div>
      {error && (
        <div
          role="alert"
          className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400"
        >
          {error}
        </div>
      )}
      <DragDropContext onDragEnd={onDragEnd}>
        {/* --- MOBILE VIEW (TABS) --- */}
        <div className="md:hidden">
            <div className="flex gap-2 mb-4 overflow-x-auto pb-2 px-1 snap-x scrollbar-hide">
                {Object.entries(columns).map(([key, col]) => (
                    <button 
                        key={key}
                        onClick={() => setActiveTab(key)}
                        className={`
                            whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors shrink-0 snap-start
                            ${activeTab === key 
                                ? 'bg-primary text-primary-foreground shadow-md' 
                                : 'bg-muted text-muted-foreground hover:bg-muted/80'}
                        `}
                    >
                        {col.title} ({col.items.length})
                    </button>
                ))}
            </div>
            
            <div className="animate-in fade-in duration-300 min-h-[300px]">
                {renderColumnContent(activeTab, columns[activeTab], true)}
            </div>
        </div>

        {/* --- DESKTOP VIEW (COLUMNS) --- */}
        <div className="hidden md:flex gap-6 overflow-x-auto pb-4">
          {Object.entries(columns).map(([columnId, column]) => (
            <div key={columnId} className="flex-1 min-w-[300px]">
              <h2 className="font-bold text-foreground mb-4 flex items-center justify-between">
                 {column.title}
                 <span className="bg-muted text-muted-foreground px-2 py-1 rounded-full text-xs">
                    {column.items.length}
                 </span>
              </h2>
              {renderColumnContent(columnId, column, false)}
              {column.id === 'returned' && (
                  <div className="mt-2 text-center">
                    <Link href="/admin/reservas" className="text-sm text-primary hover:align-top hover:underline">
                        Histórico Completo →
                    </Link>
                  </div>
              )}
            </div>
          ))}
        </div>
      </DragDropContext>

      {/* MODAL FOR DUE DATE */}
      <Modal
        isOpen={showModal}
        onClose={() => { setShowModal(false); setPendingMove(null); fetchData(); }}
        labelledBy="kanban-loan-title"
        className="max-w-sm border-border bg-card p-6 shadow-xl"
      >
        <h3 id="kanban-loan-title" className="text-lg font-bold mb-4">Confirmar empréstimo</h3>
        <p className="text-muted-foreground mb-4">Data de devolução (opcional):</p>
        <input 
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full p-2 border border-border bg-background rounded mb-6 text-foreground"
        />
        <div className="flex justify-end gap-2">
            <button 
                onClick={() => { setShowModal(false); setPendingMove(null); fetchData(); }}
                className="px-4 py-2 text-muted-foreground hover:bg-muted rounded"
            >
                Cancelar
            </button>
            <button 
                onClick={confirmLoan}
                className="px-4 py-2 bg-green-600 text-white hover:bg-green-700 rounded"
            >
                Confirmar
            </button>
        </div>
      </Modal>
    </div>
  );
}
