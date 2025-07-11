'use client';

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
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';
import { Agent, Departement, Function } from '@/types';




interface Props {
  departments: Departement[];
  functions: Function[];
  onAgentAdded: () => void;
}

export function AddAgentDialog({ departments, functions, onAgentAdded }: Props) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    phoneNumbers: '',
    photoUrl: '',
    departementId: '',
    functionId: '',
    status: true,
  });

  const handleChange = (field: string, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    const payload = {
      ...form,
      phoneNumbers: form.phoneNumbers.split(',').map((p) => p.trim()),
      departementId: Number(form.departementId),
      functionId: Number(form.functionId),
    };

    await fetch('/api/agents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    onAgentAdded(); // Refresh list
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Ajouter un agent</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Nouvel Agent</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              placeholder="Prénom"
              value={form.firstName}
              onChange={(e) => handleChange('firstName', e.target.value)}
            />
            <Input
              placeholder="Nom"
              value={form.lastName}
              onChange={(e) => handleChange('lastName', e.target.value)}
            />
          </div>


          <Input
            placeholder="Téléphones (séparés par virgule)"
            value={form.phoneNumbers}
            onChange={(e) => handleChange('phoneNumbers', e.target.value)}
          />
          <Input
            placeholder="URL photo (/image.jpg)"
            value={form.photoUrl}
            onChange={(e) => handleChange('photoUrl', e.target.value)}
          />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="mb-1 block">Département</Label>
              <Select onValueChange={(value) => handleChange('departementId', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Choisir un département" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept.id} value={String(dept.id)}>
                      {dept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="mb-1 block">Fonction</Label>
              <Select onValueChange={(value) => handleChange('functionId', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Choisir une fonction" />
                </SelectTrigger>
                <SelectContent>
                  {functions.map((func) => (
                    <SelectItem key={func.id} value={String(func.id)}>
                      {func.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center gap-4 mt-2">
            <Label>Actif</Label>
            <Switch
              checked={form.status}
              onCheckedChange={(val) => handleChange('status', val)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button onClick={handleSubmit}>Enregistrer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
