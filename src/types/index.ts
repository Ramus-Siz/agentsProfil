export interface Departement {
  id: string;
  name: string;
}

export interface Function {
  id: string;
  name: string;
}

export interface Agent {
  id: string;
  firstName: string;
  lastName: string;
  photoUrl: string;
  status: boolean;
  functionId: string;
  departementId: string;
  phoneNumbers: string[];
  createdAt: string;
}
