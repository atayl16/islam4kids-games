import { RenderResult, render } from "@testing-library/react";
import { GameLayout } from "@components/game-common/GameLayout";

export const renderWithGameLayout = (
  component: React.ReactElement
): RenderResult => {
  return render(
    <GameLayout>
      {({ difficulty, handleScoreChange, startTimer }) => (
        <div data-testid="game-content">{component}</div>
      )}
    </GameLayout>
  );
};
