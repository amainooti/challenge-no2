type task = {
  title: string;
  content: string;
  status: boolean;
};

export type updateTask = Partial<task>;
