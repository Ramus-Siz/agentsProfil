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
import { toast } from 'sonner';

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
  const [newPhotoFile, setNewPhotoFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setFormData(agent);
    setNewPhotoFile(null);
  }, [agent]);

  const handleChange = (field: keyof Agent, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewPhotoFile(file);
    }
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) return null;

    const data = await res.json();
    return data.url;
  };

  const deleteImage = async (url: string) => {
    await fetch('/api/delete-image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
    });
  };

const handleSubmit = async () => {
  setLoading(true);
  try {
    let photoUrl = formData.photoUrl;

    if (newPhotoFile) {
      if (photoUrl) {
        await deleteImage(photoUrl); // supprime l’ancienne image
      }
      const uploaded = await uploadImage(newPhotoFile);
      if (uploaded) photoUrl = uploaded;
    }

    const res = await fetch('/api/agents', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...formData, photoUrl }),
    });

    if (!res.ok) {
      throw new Error('Erreur lors de la mise à jour de l’agent.');
    }

    const updated = await res.json();
    onAgentUpdated(updated);
    toast.success('Agent mis à jour avec succès');
    onClose();
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l’agent :', error);
    toast.error('Erreur lors de la mise à jour de l’agent.');
  } finally {
    setLoading(false);
  }
};

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] bg-white" showCloseButton={true}>
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

          {/* Affichage de l’image actuelle */}
          {formData.photoUrl && (
            <img
              src={formData.photoUrl}
              alt="Photo actuelle"
              className="h-32 w-32 object-cover rounded-md border border-gray-300"
            />
          )}

          {/* Upload nouvelle image */}
          <Input type="file" accept="image/*" onChange={handlePhotoChange} />

          <Select
            value={String(formData.departementId)}
            onValueChange={(val) => handleChange('departementId', Number(val))}
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
            onValueChange={(val) => handleChange('functionId', Number(val))}
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
            {loading && <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-[#ffcb00] border-r-transparent" />}
            Enregistrer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
