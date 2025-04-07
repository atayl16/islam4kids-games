import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { QuizGame } from "../templates/QuizGame";
import { quizGamePuzzles } from "../registry";
import { QuizQuestion } from "../templates/QuizGame/types";

export const QuizGameContainer = () => {
  const { quizSlug } = useParams<{ quizSlug: string }>();
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadQuiz = async () => {
      try {
        if (!quizSlug || !(quizSlug in quizGamePuzzles)) {
          throw new Error(`Quiz "${quizSlug}" not found`);
        }
        
        const loadedQuestions = await quizGamePuzzles[quizSlug]();
        
        if (!loadedQuestions || loadedQuestions.length === 0) {
          throw new Error("No questions found for this quiz");
        }
        
        // Validate questions to ensure all fields are present
        loadedQuestions.forEach((q: QuizQuestion, i: number) => {
          if (!q.question || !q.correctAnswer || !q.options || q.options.length < 2) {
            console.warn(`Invalid question at index ${i}:`, q);
          }
        });
        
        setQuestions(loadedQuestions);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load quiz");
        console.error("Quiz loading error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadQuiz();
  }, [quizSlug]);

  if (loading) return <div className="loading">Loading quiz...</div>;
  if (error) return <div className="error">{error}</div>;

  return <QuizGame questions={questions} />;
};
