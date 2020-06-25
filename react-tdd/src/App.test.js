import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";
import { MemoryRouter } from "react-router-dom";
import fetchMock from "jest-fetch-mock";
import mockResponse from "./__mocks__/subreddit-reactjs-response.json";

fetchMock.enableMocks();

const setup = () =>
  render(
    <MemoryRouter>
      <App />
    </MemoryRouter>
  );

describe("Header", () => {
  test(`"How it works" link points to correct page`, () => {
    setup();
    const link = screen.getByRole("link", { name: /how it works/i });
    userEvent.click(link);
    expect(
      screen.getByRole("heading", { name: /how it works/i })
    ).toBeInTheDocument();
  });
});

describe("Subreddit form", () => {
  test("loads posts that are rendered on the page", async () => {
    fetch.once(JSON.stringify(mockResponse));
    setup();

    const subredditInput = screen.getByLabelText("r /");
    userEvent.type(subredditInput, "reactjs");

    const submitButton = screen.getByRole("button", { name: /search/i });
    userEvent.click(submitButton);

    const loadingMessage = screen.getByText(/is loading/i);
    expect(loadingMessage).toBeInTheDocument();

    const numberOfTopPosts = await screen.findByText(
      /number of top posts: 17/i
    );
    expect(fetch).toHaveBeenCalledWith(
      "https://www.reddit.com/r/reactjs/top.json"
    );
    
    screen.debug(numberOfTopPosts);
  });
});
