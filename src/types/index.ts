export interface Department {
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
  departmentId: string;
  phones: string[];
  createdAt: string;
}
