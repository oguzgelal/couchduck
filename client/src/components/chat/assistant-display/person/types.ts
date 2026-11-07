export type Person = {
  name: string;
  avatar?: string;
  role?: string;
  reason?: string;
};

export type PersonList = {
  heading?: string;
  people: Person[];
};
