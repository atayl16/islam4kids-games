import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MemoryMatch from ".";
import { Word } from "../../../types/game";
import { GameLayout } from "../../../components/game-common/GameLayout";

const mockWords: Word[] = [
  {
    term: "Shahada",
    translation: "Declaration of Faith",
    arabic: "الشهادة",
    hints: ["First pillar"],
    categories: ["Beliefs"],
  },
  {
    term: "Salah",
    translation: "Prayer",
    arabic: "الصلاة",
    hints: ["Second pillar"],
    categories: ["Beliefs"],
  },
  {
    term: "Zakat",
    translation: "Charity",
    arabic: "الزكاة",
    hints: ["Third pillar"],
    categories: ["Beliefs"],
  },
  {
    term: "Sawm",
    translation: "Fasting",
    arabic: "الصوم",
    hints: ["Fourth pillar"],
    categories: ["Beliefs"],
  },
  {
    term: "Hajj",
    translation: "Pilgrimage",
    arabic: "الحج",
    hints: ["Fifth pillar"],
    categories: ["Beliefs"],
  },
  {
    term: "Quran",
    translation: "Recitation",
    arabic: "القرآن",
    hints: ["Holy book"],
    categories: ["Beliefs"],
  },
  {
    term: "Hadith",
    translation: "Traditions",
    arabic: "الحديث",
    hints: ["Sayings of the Prophet"],
    categories: ["Beliefs"],
  },
  {
    term: "Sunnah",
    translation: "Way of life",
    arabic: "السنة",
    hints: ["Actions of the Prophet"],
    categories: ["Beliefs"],
  },
];

describe("MemoryMatch", () => {
  it("flips cards and detects matches", async () => {
    render(
      <GameLayout>
        <MemoryMatch words={mockWords} />
      </GameLayout>
    );

    const cards = await screen.findAllByRole("button");
    await userEvent.click(cards[0]);
    await userEvent.click(cards[1]);

    await waitFor(() => {
      expect(screen.getByTestId("score")).toHaveTextContent("0");
    });

    // Click matching pair
    const [firstMatch, secondMatch] = cards.filter((c) =>
      c.textContent.includes(mockWords[0].arabic)
    );
    await userEvent.click(firstMatch);
    await userEvent.click(secondMatch);

    await waitFor(() => {
      expect(screen.getByTestId("score")).toHaveTextContent("392");
    });
  });

  it("shows victory state when all pairs matched", async () => {
    // Test full game completion
  });
});
