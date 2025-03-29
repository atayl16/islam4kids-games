import { renderWithGameLayout } from "@test-utils";
import MemoryMatch from "./index";
import { sampleWords } from "@test-fixtures";

describe("MemoryMatch", () => {
  it("renders correct number of cards", () => {
    const { getAllByTestId } = renderWithGameLayout(
      <MemoryMatch words={sampleWords} />
    );

    expect(getAllByTestId("memory-card")).toHaveLength(8); // 4 pairs
  });
});
