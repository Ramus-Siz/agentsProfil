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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { useState } from 'react';
import { Agent, Departement, Function } from '@/types';

interface Props {
  departments: Departement[];
  functions: Function[];
  onAgentAdded: () => void;
}

export function AddAgentDialog({ departments, functions, onAgentAdded }: Props) {

  const [isLoading, setIsLoading] = useState(false);

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    phoneNumbers: '',
    photoUrl: '',
    photoFile: null as File | null,
    departementId: '',
    functionId: '',
    engagementDate: '',
    status: true,
  });

  // Normalise les numéros, format +243xxxxxxxxx
  const normalizePhoneNumbers = (input: string, appendSuffix = false) => {
    let parts = input.split(',').map((p) => p.trim());

    parts = parts.map((num) => {
      let digits = num.replace(/\D/g, '');
      if (digits.startsWith('243')) digits = digits.slice(3);
      if (digits.startsWith('0')) digits = digits.slice(1);
      digits = digits.slice(0, 9);
      return '+243' + digits;
    });

    parts = parts.filter((num) => num.length === 13); // +243 + 9 chiffres

    let result = parts.join(', ');
    if (appendSuffix) {
      result += ', +243';
    }
    return result;
  };

  // Autorise la saisie libre, ajoute +243 si absent
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;

    if (!value.startsWith('+243')) {
      value = '+243' + value.replace(/^\+243/, '');
    }

    // Si la dernière touche est une virgule, ajoute suffixe
    if (value.endsWith(',')) {
      value = normalizePhoneNumbers(value, true);
    }

    setForm((prev) => ({ ...prev, phoneNumbers: value }));
  };

  // Normalise au blur (quand input perd le focus)
  const handlePhoneBlur = () => {
    const normalized = normalizePhoneNumbers(form.phoneNumbers, false);
    setForm((prev) => ({ ...prev, phoneNumbers: normalized }));
  };

  const handleChange = (field: string, value: any) => {
    // Empêche suppression du +243 au début pour phoneNumbers
    if (field === 'phoneNumbers') {
      if (!value.startsWith('+243')) {
        value = '+243' + value.replace(/^\+243/, '');
      }
      value = value.replace(/(?!^\+)[^\d, ]+/g, ''); // enlève tout sauf chiffres, virgules, espace et premier +
    }
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleChange('photoFile', file);
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

// const handleSubmit = async () => {
//   try {
//     setIsLoading(true);

//     let photoUrl = form.photoUrl;

//     if (form.photoFile) {
//       const uploadedUrl = await uploadImage(form.photoFile);
//       if (uploadedUrl) {
//         photoUrl = uploadedUrl;
//       }
//     }

//     const payload = {
//       firstName: form.firstName,
//       lastName: form.lastName,
//       phoneNumbers: form.phoneNumbers
//         .split(',')
//         .map((p) => p.trim())
//         .filter((p) => p !== ''),
//       photoUrl,
//       departementId: Number(form.departementId),
//       functionId: Number(form.functionId),
//       engagementDate: form.engagementDate,
//       status: form.status,
//     };

//     await fetch('/api/agents', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(payload),
//     });

//     onAgentAdded();
//     setOpen(false);
//     setForm({
//       firstName: '',
//       lastName: '',
//       phoneNumbers: '',
//       photoUrl: '',
//       photoFile: null,
//       departementId: '',
//       functionId: '',
//       engagementDate: '',
//       status: false,
//     });
//   } catch (error) {
//     console.error(error);
//   } finally {
//     setIsLoading(false);
//   }
// };
  const handleSubmit = async () => {
    let photoUrl = form.photoUrl;

    if (form.photoFile) {
      const uploadedUrl = await uploadImage(form.photoFile);
      if (uploadedUrl) {
        photoUrl = uploadedUrl;
      }
    }

    const payload = {
      firstName: form.firstName,
      lastName: form.lastName,
      phoneNumbers: form.phoneNumbers
        .split(',')
        .map((p) => p.trim())
        .filter((p) => p !== ''),
      photoUrl,
      departementId: Number(form.departementId),
      functionId: Number(form.functionId),
      engagementDate: form.engagementDate,
      status: form.status,
    };

    await fetch('/api/agents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    onAgentAdded();
    setOpen(false);
    setForm({
      firstName: '',
      lastName: '',
      phoneNumbers: '',
      photoUrl: '',
      photoFile: null,
      departementId: '',
      functionId: '',
      engagementDate: '',
      status: false,
    });
 
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
            placeholder="+243xxxxxxxxx, +243xxxxxxxxx"
            value={form.phoneNumbers}
            onChange={handlePhoneChange}
            onBlur={handlePhoneBlur}
            maxLength={100}
          />

          <label className="block">
            <span className="text-sm font-medium text-gray-700 mb-1 block">
              Date d'engagement (mois/année)
            </span>
            <input
              type="month"
              value={form.engagementDate}
              onChange={(e) => handleChange('engagementDate', e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </label>

          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0 file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
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
          <Button onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-t-transparent border-white" />
                  Enregistrement...
                </div>
              ) : (
                'Enregistrer'
              )}
          </Button>

        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
