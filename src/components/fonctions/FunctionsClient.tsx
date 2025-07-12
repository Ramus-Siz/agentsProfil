'use client';

import { useEffect, useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
  AlertDialogTrigger,
  AlertDialogTitle,
  AlertDialogDescription,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Function as AppFunction } from '@/types';

const ITEMS_PER_PAGE = 5;

export default function FunctionsClient() {
  const [functions, setFunctions] = useState<AppFunction[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [newName, setNewName] = useState<string>('');
  const [addName, setAddName] = useState<string>('');
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchData = async () => {
    const res = await fetch('/api/function');
    const data = await res.json();
    setFunctions(data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const startEdit = (func: AppFunction) => {
    setEditingId(Number(func.id));
    setNewName(func.name);
  };

  const saveEdit = async (id: number) => {
    await fetch(`/api/function`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, name: newName }),
    });
    await fetchData();
    setEditingId(null);
    setNewName('');
  };

  const confirmDelete = async () => {
    if (deleteId == null) return;
    await fetch(`/api/function`, {
      method: 'DELETE',
      body: JSON.stringify({ id: deleteId }),
    });
    setDeleteId(null);
    await fetchData();
  };

  const addFunction = async () => {
    if (!addName.trim()) return;
    await fetch('/api/function', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: addName }),
    });
    setAddName('');
    await fetchData();
  };

  const totalPages = Math.ceil(functions.length / ITEMS_PER_PAGE);
  const paginatedFunctions = functions.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Fonctions</h1>
      <div className="flex gap-2">
        <Input
          placeholder="Nouvelle fonction"
          value={addName}
          onChange={(e) => setAddName(e.target.value)}
          className="w-64"
        />
        <Button onClick={addFunction}>Ajouter</Button>
      </div>
      <Separator />
      <table className="w-full table-auto border border-gray-200">
        <thead>
          <tr className="bg-gray-50 text-left">
            <th className="p-2 border">ID</th>
            <th className="p-2 border">Nom</th>
            <th className="p-2 border text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedFunctions.map((func) => (
            <tr key={func.id} className="hover:bg-gray-50">
              <td className="p-2 border">{func.id}</td>
              <td className="p-2 border">
                {editingId === Number(func.id) ? (
                  <Input
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full"
                  />
                ) : (
                  func.name
                )}
              </td>
              <td className="p-2 border text-center flex justify-center gap-2">
                {editingId === Number(func.id) ? (
                  <Button size="sm" onClick={() => saveEdit(Number(func.id))}>
                    Enregistrer
                  </Button>
                ) : (
                  <Button variant="ghost" size="icon" onClick={() => startEdit(func)}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                )}
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setDeleteId(Number(func.id))}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
                      <AlertDialogDescription>
                        Êtes-vous sûr de vouloir supprimer cette fonction ? Cette action est irréversible.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Annuler</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={confirmDelete}
                        className="bg-red-500 hover:bg-red-600"
                      >
                        Supprimer
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-between items-center pt-4">
        <Button
          variant="outline"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
        >
          Précédent
        </Button>
        <span className="text-sm text-muted-foreground">
          Page {currentPage} sur {totalPages}
        </span>
        <Button
          variant="outline"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => prev + 1)}
        >
          Suivant
        </Button>
      </div>
    </div>
  );
}
