'use client';

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Agent, Departement, Function } from '@/types';
import { useEffect, useState } from 'react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  agent: Agent;
  departments: Departement[];
  functions: Function[];
  onAgentUpdated: (agent: Agent) => void;
}

export function AgentDetailDialog({
  isOpen,
  onClose,
  agent,
  departments,
  functions,
  onAgentUpdated,
}: Props) {
  const [formData, setFormData] = useState<Agent>(agent);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setFormData(agent);
  }, [agent]);

  const handleChange = (field: keyof Agent, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    const res = await fetch('/api/agents', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    const updated = await res.json();
    setLoading(false);
    onAgentUpdated(updated);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="sm:max-w-[600px] bg-white"
        showCloseButton={true}
        style={{ background: 'white' }} // pour éviter le fond noir
      >
        <DialogHeader>
          <DialogTitle>Détails de l’agent</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Input
            placeholder="Prénom"
            value={formData.firstName}
            onChange={(e) => handleChange('firstName', e.target.value)}
          />
          <Input
            placeholder="Nom"
            value={formData.lastName}
            onChange={(e) => handleChange('lastName', e.target.value)}
          />
          <Input
            placeholder="Téléphones"
            value={
              Array.isArray(formData.phoneNumbers)
                ? formData.phoneNumbers.join(', ')
                : formData.phoneNumbers || ''
            }
            onChange={(e) =>
              handleChange('phoneNumbers', e.target.value.split(',').map(p => p.trim()))
            }
          />

          <Select
            value={String(formData.departementId)}
            onValueChange={(val) => handleChange('departementId', val)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Département" />
            </SelectTrigger>
            <SelectContent>
              {departments.map((d) => (
                <SelectItem key={d.id} value={String(d.id)}>
                  {d.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={String(formData.functionId)}
            onValueChange={(val) => handleChange('functionId', val)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Fonction" />
            </SelectTrigger>
            <SelectContent>
              {functions.map((f) => (
                <SelectItem key={f.id} value={String(f.id)}>
                  {f.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <DialogFooter className="pt-4">
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            Enregistrer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
