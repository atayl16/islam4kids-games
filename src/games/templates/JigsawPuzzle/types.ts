export interface JigsawConfig {
  meta: {
    title: string;
    difficulty: "easy" | "medium" | "hard";
    learningObjectives: string[];
    imageAlt: string;
  };
  jigsawConfig: {
    imageSrc: string;
    rows: number;
    columns: number;
  };
}
