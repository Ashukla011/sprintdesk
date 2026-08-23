import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, test } from "vitest";
import App from "./App";

describe("App", () => {
  beforeEach(() => {
    window.history.replaceState({}, "", "/dashboard");
    document.documentElement.classList.remove("dark");
  });

  test("renders the application shell", () => {
    render(<App />);

   
    expect(screen.getByRole("heading", { name: /your sprint at a glance/i })).toBeInTheDocument();
  });

  test("supports navigation and theme switching", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("link", { name: /^board$/i }));
    expect(screen.getByRole("link", { name: /board/i })).toHaveAttribute("aria-current", "page");

    await user.click(screen.getByRole("button", { name: /toggle dark mode/i }));
    expect(document.documentElement).toHaveClass("dark");
  });

  test("renders workspace routes without authentication", () => {
    window.history.pushState({}, "", "/board");
    render(<App />);

    expect(screen.getByText("Board Page")).toBeInTheDocument();
  });

  test("redirects unknown routes to the dashboard", async () => {
    window.history.pushState({}, "", "/unknown");
    render(<App />);

    expect(await screen.findByRole("heading", { name: /your sprint at a glance/i })).toBeInTheDocument();
  });
});