'use client'

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Agent, Departement, Function } from '@/types';
import { useEffect, useState } from 'react';

interface AgentDetailDialogProps {
  agent: Agent;
  departments: Departement[];
  functions: Function[];
  onUpdate: () => void;
}

export function AgentDetailDialog({
  agent,
  departments,
  functions,
  onUpdate,
}: AgentDetailDialogProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({ ...agent });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setFormData({ ...agent });
  }, [agent]);

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    await fetch('/api/agents', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    setLoading(false);
    setOpen(false);
    onUpdate();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">Voir les détails</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[600px] bg-white shadow-xl">
        <DialogHeader>
          <DialogTitle>Détails de l'agent</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <Input
            placeholder="Nom"
            value={formData.lastName}
            onChange={(e) => handleChange('lastName', e.target.value)}
          />
          <Input
            placeholder="Prénom"
            value={formData.firstName}
            onChange={(e) => handleChange('firstName', e.target.value)}
          />
          <Input
            placeholder="Téléphone"
            value={Array.isArray(formData.phoneNumbers) ? formData.phoneNumbers.join(', ') : formData.phoneNumbers}
            onChange={(e) => handleChange('phoneNumbers', e.target.value.split(',').map(p => p.trim()))}
          />

          <select
            className="border rounded px-2 py-1"
            value={formData.functionId}
            onChange={(e) => handleChange('functionId', e.target.value)}
          >
            <option value="">-- Fonction --</option>
            {functions.map((f) => (
              <option key={f.id} value={f.id}>{f.name}</option>
            ))}
          </select>

          <select
            className="border rounded px-2 py-1"
            value={formData.departementId}
            onChange={(e) => handleChange('departementId', e.target.value)}
          >
            <option value="">-- Département --</option>
            {departments.map((d) => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
        </div>

        <DialogFooter>
          <Button onClick={handleSave} disabled={loading}>
            Enregistrer les modifications
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
