export type Person = {
  name: string;
  avatar?: string;
  role?: string;
  reason?: string;
};

export type Credit = {
  title: string;
  image?: string;
  year?: number;
  role?: string;
};

export type PersonProfile = Person & {
  born?: string;
  died?: string;
  biography?: string;
  knownFor?: Credit[];
};

export type PersonList = {
  heading?: string;
  people: Person[];
};
