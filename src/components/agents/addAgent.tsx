'use client';

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
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
import { useEffect, useState } from 'react';
import { Agence, Departement, Function } from '@/types';
import { toast } from 'sonner';


interface Props {
  departments: Departement[];
  functions: Function[];
  agences: Agence[];
  onAgentAdded: () => void;
}

export function AddAgentDialog({ departments, functions, onAgentAdded }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [openAddFunction, setOpenAddFunction] = useState(false);

  const [agences, setAgences] = useState<Agence[]>([]);
  const [addName, setAddName] = useState('');
  const [addFonctionId, setAddFonctionId] = useState('');




  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    phoneNumbers: '',
    photoUrl: '',
    photoFile: null as File | null,
    departementId: '',
    functionId: '',
    agenceId: '',
    engagementDate: '',
    status: true,
  });

   const fetchData = async () => {
      try {
        const [agencesRes] = await Promise.all([
          fetch('/api/agences'),
        ]);
        const agencesData = await agencesRes.json();
        setAgences(agencesData);
      } catch (error) {
        toast.error('Erreur lors du chargement des agences');
      } 
    };
  
   useEffect(() => {
       fetchData();
     }, []);

  const validatePhoneNumber = (phone: string) => {
    const clean = phone.replace('+243', '').replace(/\s/g, '');
    return clean.length === 9 && /^[1-9]\d{8}$/.test(clean);
  };

  const getPhonesValidation = (input: string) => {
    const numbers = input
      .split(',')
      .map((n) => n.trim())
      .filter((n) => n !== '');
    if (numbers.length > 2) return false;
    return numbers.every(validatePhoneNumber);
  };

  const normalizePhoneNumbers = (input: string) => {
    let parts = input.split(',').map((p) => p.trim());
    parts = parts.map((num) => {
      let digits = num.replace(/\D/g, '');
      if (digits.startsWith('243')) digits = digits.slice(3);
      if (digits.startsWith('0')) digits = digits.slice(1);
      digits = digits.slice(0, 9);
      return '+243' + digits;
    });
    return parts.join(', ');
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    value = value.replace(/[^\d,+]/g, '');

    let parts = value.split(',').map((p) => p.trim());
    if (parts.length > 2) parts = parts.slice(0, 2);

    parts = parts.map((num) => {
      let digits = num.replace(/\D/g, '');
      if (digits.startsWith('243')) digits = digits.slice(3);
      if (digits.startsWith('0')) digits = digits.slice(1);
      digits = digits.slice(0, 9);
      return '+243' + digits;
    });

    setForm((prev) => ({
      ...prev,
      phoneNumbers: parts.join(', '),
    }));
  };

  const handleChange = (field: string, value: any) => {
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

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      let photoUrl = form.photoUrl;
      if (form.photoFile) {
        const uploadedUrl = await uploadImage(form.photoFile);
        if (uploadedUrl) photoUrl = uploadedUrl;
      }

      const payload = {
        firstName: form.firstName,
        lastName: form.lastName,
        phoneNumbers: form.phoneNumbers
          .split(',')
          .map((p) => p.trim())
          .filter((p) => p !== ''),
        photoUrl,
        agenceId: form.agenceId,
        departementId: Number(form.departementId),
        functionId: addFonctionId !== '' ? addFonctionId : Number(form.functionId),
        engagementDate: form.engagementDate,
        status: form.status,
      };

      const res = await fetch('/api/agents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Erreur lors de l’enregistrement de l’agent.');

      onAgentAdded();
      setOpen(false);
    setOpenAddFunction(false);
      setForm({
        firstName: '',
        lastName: '',
        phoneNumbers: '',
        photoUrl: '',
        photoFile: null,
        departementId: '',
        functionId: '',
        agenceId: '',
        engagementDate: '',
        status: false,
      });

      toast.success('Agent ajouté avec succès');
    } catch (error) {
      toast.error("Erreur lors de l’enregistrement de l’agent.");
      console.error('Erreur lors de l’ajout de l’agent :', error);
    } finally {
      setIsLoading(false);
    }
  };

 const addFunction = async () => {
  setAddFonctionId('');
  
  try {
    if (!addName.trim()) return;

    const res = await fetch('/api/function', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: addName }),
    });

    if (!res.ok) throw new Error('Erreur serveur');

    const data = await res.json();
    setAddFonctionId(data.id); 
    setOpenAddFunction(true);
    console.log('Fonction ajoutée avec ID :', data.id); 

    setAddName('');
    // await fetchData();
    toast.success(`Fonction ajoutée avec succès (ID: ${data.id})`);
  } catch (error) {
    console.error("Erreur lors de l'ajout de la fonction", error);
    toast.error("Erreur lors de l'ajout de la fonction");
  }
};


  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Ajouter un agent</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Nouvel Agent</DialogTitle>
          <DialogDescription>
            Modifie les informations ci-dessous et clique sur Enregistrer.
        </DialogDescription>
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
            onBlur={() =>
              setForm((prev) => ({
                ...prev,
                phoneNumbers: normalizePhoneNumbers(prev.phoneNumbers),
              }))
            }
            maxLength={50}
            className={
              getPhonesValidation(form.phoneNumbers)
                ? 'bg-green-50 border-green-500'
                : 'bg-red-50 border-red-500'
            }
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
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
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
                <Label className="mb-1 block">Agence</Label>
                <Select onValueChange={(value) => handleChange('agenceId', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choisir une agence" />
                  </SelectTrigger>
                  <SelectContent>
                    {agences.map((agence) => (
                      <SelectItem key={agence.id} value={String(agence.id)}>
                        {agence.name} ({agence.codeAgence})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

            <div className="col-span-2 flex justify-between items-center ">
              <div>
                <Label className="mb-1 block">Fonction</Label>
                <Select onValueChange={(value) => handleChange('functionId', value) } disabled={openAddFunction}>
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
            
              <div className="">
                <Label className="mb-1 block">Nouvelle fonction</Label>
                <div className='flex items-center gap-2'>
                  <Input
                  placeholder="Ou créer une nouvelle fonction"
                  value={addName}
                  onChange={(e) => setAddName(e.target.value)}
                  className="w-64 text-sm"
                />
                <Button className='border bg-transparent border-[#95c11e] text-[#656564] px-2 py-1 text-sm' onClick={addFunction}>Créer</Button>

                </div>
                
              </div>
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
            {isLoading && (
              <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-[#ffcb00] border-r-transparent" />
            )}
            Enregistrer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
