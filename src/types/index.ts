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
  engagementDate: string;
}


export interface Agence {
  id: number;
  name: string;
  codeAgence: string;
  provinceId: number;
  agents: Agent[];
}

export interface Province {
  id: number;
  name: string;
  agences: Agence[];
  agents: Agent[];
}