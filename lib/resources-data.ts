export interface Resource {
  id: string;
  title: string;
  description: string;
  courseCode: string;
  type: "pdf" | "slides" | "exam" | "book" | "cheatsheet" | "youtube" | "github" | "website";
  author: string;
  uploadDate: string;
  downloadCount: number;
  rating: number;
  url: string;
}

export const RESOURCES: Resource[] = [];
