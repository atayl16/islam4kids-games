import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { QuizGame } from "../templates/QuizGame";
import { quizGamePuzzles } from "../registry";
import { QuizQuestion } from "../templates/QuizGame/types";
import { LoadingSpinner } from "../../components/LoadingSpinner";

export const QuizGameContainer = () => {
  const { quizSlug } = useParams<{ quizSlug: string }>();
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    // Reset loading/error and clear stale questions when quizSlug changes
    setLoading(true);
    setError(null);
    setQuestions([]);

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
            throw new Error(`Invalid question at index ${i}: missing required fields`);
          }
        });

        if (isMounted) {
          setQuestions(loadedQuestions);
        }
      } catch (err) {
        if (isMounted) {
          setQuestions([]);
          setError(err instanceof Error ? err.message : "Failed to load quiz");
          console.error("Quiz loading error:", err);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadQuiz();

    return () => {
      isMounted = false;
    };
  }, [quizSlug]);

  if (loading) return <LoadingSpinner message="Loading Quiz..." />;
  if (error) return <div className="error-message">{error}</div>;

  return <QuizGame questions={questions} />;
};
