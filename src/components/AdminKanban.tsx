'use client';

import { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';

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
  
  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [pendingMove, setPendingMove] = useState<{result: DropResult, dueDate: string} | null>(null);
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
        reserved: { id: 'reserved', title: 'Solicitações (Reservas)', items: reservedItems },
        active: { id: 'active', title: 'Emprestados (Ativos)', items: activeItems },
        returned: { id: 'returned', title: 'Devolvidos', items: returnedItems }
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const onDragEnd = async (result: DropResult) => {
    const { source, destination } = result;

    if (!destination) return;

    // If dropped in same place
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    const sourceCol = columns[source.droppableId];
    const item = sourceCol.items[source.index];

    // --- Validation Rules ---
    
    // 1. Reserved -> Active (Loan Creation)
    if (source.droppableId === 'reserved' && destination.droppableId === 'active') {
      // Need to ask for Due Date
      setPendingMove({ result, dueDate: '' });
      // Default due date: 7 days from now
      const defaultDate = new Date();
      defaultDate.setDate(defaultDate.getDate() + 7);
      setDueDate(defaultDate.toISOString().split('T')[0]);
      setShowModal(true);
      return; 
    }

    // 2. Active -> Returned (Return Book)
    if (source.droppableId === 'active' && destination.droppableId === 'returned') {
       await processMove(item.id, 'active', 'returned');
       // Optimistic Update
       moveItem(source, destination);
       return;
    }

    // Prevent other weird moves
    if (source.droppableId === destination.droppableId) {
        moveItem(source, destination);
    } else {
        alert('Movimentação não permitida por enquanto.');
    }
  };

  const moveItem = (source: any, destination: any) => {
     const sourceCol = columns[source.droppableId];
     const destCol = columns[destination.droppableId];
     const sourceItems = [...sourceCol.items];
     const destItems = [...destCol.items];
     const [removed] = sourceItems.splice(source.index, 1);
     destItems.splice(destination.index, 0, removed);

     setColumns({
         ...columns,
         [source.droppableId]: { ...sourceCol, items: sourceItems },
         [destination.droppableId]: { ...destCol, items: destItems }
     });
  };

  const processMove = async (itemId: string, fromStatus: string, toStatus: string, extraData?: any) => {
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
        alert('Erro ao salvar movimentação. Recarregando...');
        fetchData();
    }
  };

  const confirmLoan = async () => {
     if (!pendingMove) return;
     const { result } = pendingMove;
     const item = columns[result.source.droppableId].items[result.source.index];

     setShowModal(false);
     
     // Optimistic move
     moveItem(result.source, result.destination!);
     
     // API Call
     await processMove(item.id, 'reserved', 'active', { dueDate });
     setPendingMove(null);
  };

  if (loading) return <div>Carregando quadro...</div>;

  return (
    <div>
      <div className="flex flex-col md:flex-row gap-6 overflow-x-auto pb-4">
        <DragDropContext onDragEnd={onDragEnd}>
          {Object.entries(columns).map(([columnId, column]) => (
            <div key={columnId} className="flex-1 min-w-[300px]">
              <h2 className="font-bold text-gray-700 mb-4 flex items-center justify-between">
                 {column.title}
                 <span className="bg-gray-200 text-gray-600 px-2 py-1 rounded-full text-xs">
                    {column.items.length}
                 </span>
              </h2>
              <Droppable droppableId={columnId}>
                {(provided, snapshot) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className={`bg-gray-100 p-4 rounded-lg min-h-[500px] transition-colors ${
                        snapshot.isDraggingOver ? 'bg-gray-200' : ''
                    }`}
                  >
                    {column.items.map((item, index) => (
                      <Draggable key={item.id} draggableId={item.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`bg-white p-4 rounded shadow-sm mb-3 border-l-4 relative ${
                                item.type === 'reservation' ? 'border-yellow-400' :
                                item.status === 'active' ? 'border-green-500' : 'border-gray-400'
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
                                 'bg-gray-100 text-gray-600'
                             }`}>
                                 {item.type === 'reservation' ? 'SOLICITAÇÃO WEB' : 
                                  item.data.loanType === 'online' ? 'ONLINE' : 'PRESENCIAL'}
                             </span>

                            <h3 className="font-semibold text-gray-800 pr-16">{item.title}</h3>
                            <p className="text-sm text-gray-600">{item.subtitle}</p>
                            <p className="text-xs text-gray-400 mt-2">{item.date}</p>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
              {column.id === 'returned' && (
                  <div className="mt-2 text-center">
                    <a href="/admin/reservas" className="text-sm text-blue-600 hover:align-top hover:underline">
                        Ver Histórico Completo →
                    </a>
                  </div>
              )}
            </div>
          ))}
        </DragDropContext>
      </div>

      {/* MODAL FOR DUE DATE */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl w-96">
                <h3 className="text-lg font-bold mb-4">Confirmar Empréstimo</h3>
                <p className="text-gray-600 mb-4">Data de devolução (Opcional):</p>
                <input 
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full p-2 border rounded mb-6"
                />
                <div className="flex justify-end gap-2">
                    <button 
                        onClick={() => { setShowModal(false); setPendingMove(null); fetchData(); }}
                        className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                    >
                        Cancelar
                    </button>
                    <button 
                        onClick={confirmLoan}
                        className="px-4 py-2 bg-green-600 text-white hover:bg-green-700 rounded"
                    >
                        Confirmar {dueDate ? '' : '(Padrão 14 dias)'}
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
}
