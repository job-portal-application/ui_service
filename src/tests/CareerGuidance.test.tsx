import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import axios from "axios";
import CareerGuidance from "../components/CareerGuidance";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

jest.mock("../config/env", () => ({
  env: { aiServiceBaseUrl: "http://localhost:3000" },
}));

// Mock lucide-react icons
jest.mock("lucide-react", () => ({
  Sparkles: ({ children, ...props }: any) => <svg data-testid="sparkles" {...props}>{children}</svg>,
  ArrowRight: (props: any) => <svg data-testid="arrow-right" {...props} />,
  X: (props: any) => <svg data-testid="x-icon" {...props} />,
  Loader2: (props: any) => <svg data-testid="loader2" {...props} />,
  Target: (props: any) => <svg data-testid="target" {...props} />,
  Lightbulb: (props: any) => <svg data-testid="lightbulb" {...props} />,
  Briefcase: (props: any) => <svg data-testid="briefcase" {...props} />,
  TrendingUp: (props: any) => <svg data-testid="trending-up" {...props} />,
  BookOpen: (props: any) => <svg data-testid="book-open" {...props} />,
}));

// Mock shadcn/ui components
jest.mock("../../@/components/ui/dialog", () => ({
  Dialog: ({ children, open, onOpenChange }: any) => (
    <div data-testid="dialog" data-open={open}>
      {children}
      <button data-testid="dialog-close" onClick={() => onOpenChange(false)} />
    </div>
  ),
  DialogTrigger: ({ children }: any) => <div data-testid="dialog-trigger">{children}</div>,
  DialogContent: ({ children }: any) => <div data-testid="dialog-content">{children}</div>,
  DialogHeader: ({ children }: any) => <div>{children}</div>,
  DialogTitle: ({ children }: any) => <h2>{children}</h2>,
  DialogDescription: ({ children }: any) => <p>{children}</p>,
}));

jest.mock("../../@/components/ui/button", () => ({
  Button: ({ children, onClick, disabled, ...props }: any) => (
    <button onClick={onClick} data-disabled={disabled} {...props}>{children}</button>
  ),
}));

jest.mock("../../@/components/ui/label", () => ({
  Label: ({ children, htmlFor }: any) => <label htmlFor={htmlFor}>{children}</label>,
}));

jest.mock("../../@/components/ui/input", () => ({
  Input: ({ value, onChange, onKeyPress, id, placeholder }: any) => (
    <input id={id} value={value} onChange={onChange} onKeyPress={onKeyPress} placeholder={placeholder} />
  ),
}));

const mockResponse = {
  summary: "You are a great developer",
  jobOptions: [
    { title: "Frontend Engineer", responsibilities: "Build UIs", why: "You know React" },
  ],
  skillsToLearn: [
    {
      category: "Backend",
      skills: [{ title: "Node.js", why: "Scalable", how: "Take a course" }],
    },
  ],
  learningApproach: {
    title: "Learning Plan",
    points: ["Read docs", "Build projects"],
  },
};

const alertMock = jest.spyOn(window, "alert").mockImplementation(() => {});

beforeEach(() => {
  jest.clearAllMocks();
});

describe("CareerGuidance", () => {
  it("renders static content", () => {
    render(<CareerGuidance />);
    expect(screen.getByText("AI powered Job search")).toBeInTheDocument();
    expect(screen.getByText("Choose your career path")).toBeInTheDocument();
    expect(screen.getByText(/Get personalized job recommendations/)).toBeInTheDocument();
    expect(screen.getByText("Get Career Guidance")).toBeInTheDocument();
  });

  it("renders skill input form inside dialog", () => {
    render(<CareerGuidance />);
    expect(screen.getByPlaceholderText(/e.g. React/)).toBeInTheDocument();
    expect(screen.getByText("Add")).toBeInTheDocument();
    expect(screen.getByText("Generate career guidance")).toBeInTheDocument();
  });

  it("adds a skill via Add button", async () => {
    render(<CareerGuidance />);
    const input = screen.getByPlaceholderText(/e.g. React/);
    await userEvent.type(input, "React");
    fireEvent.click(screen.getByText("Add"));
    expect(screen.getByText("React")).toBeInTheDocument();
    expect(screen.getByText(/Your skills \(1\)/)).toBeInTheDocument();
  });

  it("does not add duplicate skill", async () => {
    render(<CareerGuidance />);
    const input = screen.getByPlaceholderText(/e.g. React/);
    await userEvent.type(input, "React");
    fireEvent.click(screen.getByText("Add"));
    await userEvent.clear(input);
    await userEvent.type(input, "React");
    fireEvent.click(screen.getByText("Add"));
    expect(screen.getAllByText("React")).toHaveLength(1);
  });

  it("does not add empty/whitespace skill", async () => {
    render(<CareerGuidance />);
    const input = screen.getByPlaceholderText(/e.g. React/);
    await userEvent.type(input, "   ");
    fireEvent.click(screen.getByText("Add"));
    expect(screen.queryByText(/Your skills/)).not.toBeInTheDocument();
  });

  it("adds skill on Enter key press", async () => {
    render(<CareerGuidance />);
    const input = screen.getByPlaceholderText(/e.g. React/);
    await userEvent.type(input, "TypeScript");
    fireEvent.keyPress(input, { key: "Enter", charCode: 13 });
    expect(screen.getByText("TypeScript")).toBeInTheDocument();
  });

  it("does not add skill on non-Enter key press", async () => {
    render(<CareerGuidance />);
    const input = screen.getByPlaceholderText(/e.g. React/);
    await userEvent.type(input, "Go");
    fireEvent.keyPress(input, { key: "a", charCode: 65 });
    expect(screen.queryByText(/Your skills/)).not.toBeInTheDocument();
  });

  it("removes a skill", async () => {
    render(<CareerGuidance />);
    const input = screen.getByPlaceholderText(/e.g. React/);
    await userEvent.type(input, "Vue");
    fireEvent.click(screen.getByText("Add"));
    expect(screen.getByText("Vue")).toBeInTheDocument();
    // click the X button next to the skill
    const removeButtons = screen.getAllByRole("button");
    const removeBtn = removeButtons.find((btn) => btn.querySelector("[data-testid='x-icon']"));
    fireEvent.click(removeBtn!);
    expect(screen.queryByText("Vue")).not.toBeInTheDocument();
  });

  it("alerts when submitting with no skills", () => {
    render(<CareerGuidance />);
    fireEvent.click(screen.getByText("Generate career guidance"));
    expect(alertMock).toHaveBeenCalledWith("Please enter at least one skill");
  });

  it("calls API and shows response on success", async () => {
    mockedAxios.post.mockResolvedValueOnce({ data: mockResponse });
    render(<CareerGuidance />);
    const input = screen.getByPlaceholderText(/e.g. React/);
    await userEvent.type(input, "React");
    fireEvent.click(screen.getByText("Add"));
    fireEvent.click(screen.getByText("Generate career guidance"));
    await waitFor(() => {
      expect(alertMock).toHaveBeenCalledWith("Data received successfully");
    });
    expect(screen.getByText("Your personalized career guide")).toBeInTheDocument();
    expect(screen.getByText("You are a great developer")).toBeInTheDocument();
    expect(screen.getByText("Frontend Engineer")).toBeInTheDocument();
    expect(screen.getByText("Build UIs")).toBeInTheDocument();
    expect(screen.getByText("You know React")).toBeInTheDocument();
    expect(screen.getByText("Backend")).toBeInTheDocument();
    expect(screen.getByText("Node.js")).toBeInTheDocument();
    expect(screen.getByText("Take a course")).toBeInTheDocument();
    expect(screen.getByText("Learning Plan")).toBeInTheDocument();
    expect(screen.getByText("Read docs")).toBeInTheDocument();
    expect(screen.getByText("Build projects")).toBeInTheDocument();
  });

  it("shows loading state while API call is in progress", async () => {
    let resolvePost!: (val: any) => void;
    mockedAxios.post.mockReturnValueOnce(new Promise((res) => { resolvePost = res; }) as any);
    render(<CareerGuidance />);
    const input = screen.getByPlaceholderText(/e.g. React/);
    await userEvent.type(input, "React");
    fireEvent.click(screen.getByText("Add"));
    fireEvent.click(screen.getByText("Generate career guidance"));
    await waitFor(() => expect(screen.getByText(/Analyzing your skills/)).toBeInTheDocument());
    resolvePost({ data: mockResponse });
    await waitFor(() => expect(alertMock).toHaveBeenCalled());
  });

  it("alerts error message on API failure", async () => {
    mockedAxios.post.mockRejectedValueOnce({
      response: { data: { message: "Server error" } },
    });
    render(<CareerGuidance />);
    const input = screen.getByPlaceholderText(/e.g. React/);
    await userEvent.type(input, "React");
    fireEvent.click(screen.getByText("Add"));
    fireEvent.click(screen.getByText("Generate career guidance"));
    await waitFor(() => {
      expect(alertMock).toHaveBeenCalledWith("Server error");
    });
  });

  it("resets dialog when 'Start new analysis' is clicked", async () => {
    mockedAxios.post.mockResolvedValueOnce({ data: mockResponse });
    render(<CareerGuidance />);
    const input = screen.getByPlaceholderText(/e.g. React/);
    await userEvent.type(input, "React");
    fireEvent.click(screen.getByText("Add"));
    fireEvent.click(screen.getByText("Generate career guidance"));
    await waitFor(() => screen.getByText("Start new analysis"));
    fireEvent.click(screen.getByText("Start new analysis"));
    expect(screen.getByPlaceholderText(/e.g. React/)).toBeInTheDocument();
    expect(screen.queryByText("Your personalized career guide")).not.toBeInTheDocument();
  });

  it("dialog open state is controlled by onOpenChange", () => {
    render(<CareerGuidance />);
    const dialog = screen.getByTestId("dialog");
    expect(dialog).toHaveAttribute("data-open", "false");
    fireEvent.click(screen.getByTestId("dialog-close"));
    expect(dialog).toHaveAttribute("data-open", "false");
  });
});
