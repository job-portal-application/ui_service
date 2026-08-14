import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import axios from "axios";
import ResumeAnalyzer from "../components/ResumeAnalyzer";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

jest.mock("../config/env", () => ({
  env: { aiServiceBaseUrl: "http://localhost:3004" },
}));

jest.mock("lucide-react", () => ({
  FileText: (props: any) => <svg data-testid="file-text" {...props} />,
  Upload: (props: any) => <svg data-testid="upload" {...props} />,
  CheckCircle2: (props: any) => <svg data-testid="check-circle2" {...props} />,
  AlertTriangle: (props: any) => <svg data-testid="alert-triangle" {...props} />,
  TrendingUp: (props: any) => <svg data-testid="trending-up" {...props} />,
  Loader2: (props: any) => <svg data-testid="loader2" {...props} />,
  ArrowRight: (props: any) => <svg data-testid="arrow-right" {...props} />,
  FileCheck: (props: any) => <svg data-testid="file-check" {...props} />,
  Zap: (props: any) => <svg data-testid="zap" {...props} />,
}));

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
  Button: ({ children, onClick, disabled, variant, ...props }: any) => (
    <button onClick={onClick} data-disabled={disabled} data-variant={variant} {...props}>
      {children}
    </button>
  ),
}));

const alertMock = jest.spyOn(window, "alert").mockImplementation(() => {});
jest.spyOn(console, "log").mockImplementation(() => {});

const mockResponse = {
  atsScore: 85,
  summary: "Great resume!",
  scoreBreakdown: {
    formatting: { score: 90, feedback: "Good formatting" },
    keywords: { score: 80, feedback: "Good keywords" },
    structure: { score: 85, feedback: "Good structure" },
    readability: { score: 88, feedback: "Good readability" },
  },
  strengths: ["Clear layout", "Strong action verbs"],
  suggestions: [
    { category: "Keywords", issue: "Missing keywords", recommendation: "Add more", priority: "high" },
    { category: "Format", issue: "Font size", recommendation: "Use 11pt", priority: "medium" },
    { category: "Length", issue: "Too long", recommendation: "Trim to 1 page", priority: "low" },
  ],
};

const makePdfFile = (size = 1024) =>
  new File(["a".repeat(size)], "resume.pdf", { type: "application/pdf" });

beforeEach(() => {
  jest.clearAllMocks();
});

describe("ResumeAnalyzer", () => {
  it("renders static content", () => {
    render(<ResumeAnalyzer />);
    expect(screen.getByText("AI-Powered ATS Analysis")).toBeInTheDocument();
    expect(screen.getByText("Optimize Your Resume for ATS")).toBeInTheDocument();
    expect(screen.getByText(/Get instant feedback/)).toBeInTheDocument();
    expect(screen.getByText("Analyze My Resume")).toBeInTheDocument();
  });

  it("renders upload form inside dialog", () => {
    render(<ResumeAnalyzer />);
    expect(screen.getByText("Upload Your Resume")).toBeInTheDocument();
    expect(screen.getByText("Click to upload your resume")).toBeInTheDocument();
    expect(screen.getByText("PDF format only, maximum 5MB")).toBeInTheDocument();
    expect(screen.getByText("Analyze Resume")).toBeInTheDocument();
  });

  it("alerts when analyzing without a file", () => {
    render(<ResumeAnalyzer />);
    fireEvent.click(screen.getByText("Analyze Resume"));
    expect(alertMock).toHaveBeenCalledWith("Please upload a resume");
  });

  it("alerts when non-PDF file is selected", () => {
    render(<ResumeAnalyzer />);
    const input = getByAcceptingPdf();
    const txtFile = new File(["content"], "resume.txt", { type: "text/plain" });
    fireEvent.change(input, { target: { files: [txtFile] } });
    expect(alertMock).toHaveBeenCalledWith("Please upload a PDF file");
  });

  it("alerts when PDF file exceeds 5MB", () => {
    render(<ResumeAnalyzer />);
    const input = getByAcceptingPdf();
    const bigFile = new File(["a".repeat(6 * 1024 * 1024)], "big.pdf", { type: "application/pdf" });
    Object.defineProperty(bigFile, "size", { value: 6 * 1024 * 1024 });
    fireEvent.change(input, { target: { files: [bigFile] } });
    expect(alertMock).toHaveBeenCalledWith("File size should be less than 5MB");
  });

  it("shows file name and success indicator after valid file selection", () => {
    render(<ResumeAnalyzer />);
    const input = getByAcceptingPdf();
    fireEvent.change(input, { target: { files: [makePdfFile()] } });
    expect(screen.getByText("resume.pdf")).toBeInTheDocument();
    expect(screen.getByText("File uploaded successfully")).toBeInTheDocument();
  });

  it("does nothing when file input has no files", () => {
    render(<ResumeAnalyzer />);
    const input = getByAcceptingPdf();
    fireEvent.change(input, { target: { files: [] } });
    expect(alertMock).not.toHaveBeenCalled();
  });

  it("calls API and shows analysis results on success", async () => {
    mockedAxios.post.mockResolvedValueOnce({ data: mockResponse });
    render(<ResumeAnalyzer />);
    const input = getByAcceptingPdf();
    fireEvent.change(input, { target: { files: [makePdfFile()] } });
    fireEvent.click(screen.getByText("Analyze Resume"));
    await waitFor(() => expect(alertMock).toHaveBeenCalledWith("Resume analyzed successfully!"));
    expect(screen.getByText("Your Resume Analysis")).toBeInTheDocument();
    expect(screen.getByText("ATS Compatibility Score")).toBeInTheDocument();
    expect(screen.getByText("85")).toBeInTheDocument();
    expect(screen.getByText("Great resume!")).toBeInTheDocument();
    expect(screen.getByText("Detailed Score Breakdown")).toBeInTheDocument();
    expect(screen.getByText("Good formatting")).toBeInTheDocument();
    expect(screen.getByText("What Your Resume Does Well")).toBeInTheDocument();
    expect(screen.getByText("Clear layout")).toBeInTheDocument();
    expect(screen.getByText("Strong action verbs")).toBeInTheDocument();
    expect(screen.getByText("Recommendations for Improvement")).toBeInTheDocument();
    expect(screen.getByText("Keywords")).toBeInTheDocument();
    expect(screen.getByText("Missing keywords")).toBeInTheDocument();
    expect(screen.getByText("Add more")).toBeInTheDocument();
    expect(screen.getByText("high")).toBeInTheDocument();
    expect(screen.getByText("medium")).toBeInTheDocument();
    expect(screen.getByText("low")).toBeInTheDocument();
    expect(screen.getByText("Analyze Another Resume")).toBeInTheDocument();
  });

  it("shows loading state while API call is in progress", async () => {
    let resolvePost!: (val: any) => void;
    mockedAxios.post.mockReturnValueOnce(new Promise((res) => { resolvePost = res; }) as any);
    render(<ResumeAnalyzer />);
    const input = getByAcceptingPdf();
    fireEvent.change(input, { target: { files: [makePdfFile()] } });
    fireEvent.click(screen.getByText("Analyze Resume"));
    await waitFor(() => expect(screen.getByText("Analyzing Your Resume...")).toBeInTheDocument());
    resolvePost({ data: mockResponse });
    await waitFor(() => expect(alertMock).toHaveBeenCalled());
  });

  it("alerts error message on API failure with response message", async () => {
    mockedAxios.post.mockRejectedValueOnce({ response: { data: { message: "Server error" } } });
    render(<ResumeAnalyzer />);
    const input = getByAcceptingPdf();
    fireEvent.change(input, { target: { files: [makePdfFile()] } });
    fireEvent.click(screen.getByText("Analyze Resume"));
    await waitFor(() => expect(alertMock).toHaveBeenCalledWith("Server error"));
  });

  it("alerts fallback error message when no response message", async () => {
    mockedAxios.post.mockRejectedValueOnce(new Error("Network error"));
    render(<ResumeAnalyzer />);
    const input = getByAcceptingPdf();
    fireEvent.change(input, { target: { files: [makePdfFile()] } });
    fireEvent.click(screen.getByText("Analyze Resume"));
    await waitFor(() => expect(alertMock).toHaveBeenCalledWith("Failed to analyze resume"));
  });

  it("resets dialog when 'Analyze Another Resume' is clicked", async () => {
    mockedAxios.post.mockResolvedValueOnce({ data: mockResponse });
    render(<ResumeAnalyzer />);
    const input = getByAcceptingPdf();
    fireEvent.change(input, { target: { files: [makePdfFile()] } });
    fireEvent.click(screen.getByText("Analyze Resume"));
    await waitFor(() => screen.getByText("Analyze Another Resume"));
    fireEvent.click(screen.getByText("Analyze Another Resume"));
    expect(screen.getByText("Upload Your Resume")).toBeInTheDocument();
    expect(screen.queryByText("Your Resume Analysis")).not.toBeInTheDocument();
  });

  it("dialog open state is controlled by onOpenChange", () => {
    render(<ResumeAnalyzer />);
    const dialog = screen.getByTestId("dialog");
    expect(dialog).toHaveAttribute("data-open", "false");
    fireEvent.click(screen.getByTestId("dialog-close"));
    expect(dialog).toHaveAttribute("data-open", "false");
  });

  it("getScoreColor returns correct class for score >= 80", async () => {
    mockedAxios.post.mockResolvedValueOnce({ data: { ...mockResponse, atsScore: 80 } });
    render(<ResumeAnalyzer />);
    fireEvent.change(getByAcceptingPdf(), { target: { files: [makePdfFile()] } });
    fireEvent.click(screen.getByText("Analyze Resume"));
    await waitFor(() => screen.getByText("Your Resume Analysis"));
    expect(screen.getByText("80").className).toContain("text-green-600");
  });

  it("getScoreColor returns correct class for score >= 60 and < 80", async () => {
    mockedAxios.post.mockResolvedValueOnce({
      data: { ...mockResponse, atsScore: 65, scoreBreakdown: { formatting: { score: 65, feedback: "ok" }, keywords: { score: 65, feedback: "ok" }, structure: { score: 65, feedback: "ok" }, readability: { score: 65, feedback: "ok" } } },
    });
    render(<ResumeAnalyzer />);
    fireEvent.change(getByAcceptingPdf(), { target: { files: [makePdfFile()] } });
    fireEvent.click(screen.getByText("Analyze Resume"));
    await waitFor(() => screen.getByText("Your Resume Analysis"));
    expect(screen.getByText("65").className).toContain("text-yellow-600");
  });

  it("getScoreColor returns correct class for score < 60", async () => {
    mockedAxios.post.mockResolvedValueOnce({
      data: { ...mockResponse, atsScore: 40, scoreBreakdown: { formatting: { score: 40, feedback: "poor" }, keywords: { score: 40, feedback: "poor" }, structure: { score: 40, feedback: "poor" }, readability: { score: 40, feedback: "poor" } } },
    });
    render(<ResumeAnalyzer />);
    fireEvent.change(getByAcceptingPdf(), { target: { files: [makePdfFile()] } });
    fireEvent.click(screen.getByText("Analyze Resume"));
    await waitFor(() => screen.getByText("Your Resume Analysis"));
    expect(screen.getByText("40").className).toContain("text-red-600");
  });

  it("upload area click triggers file input click", () => {
    render(<ResumeAnalyzer />);
    const input = getByAcceptingPdf();
    const clickSpy = jest.spyOn(input, "click");
    fireEvent.click(screen.getByText("Click to upload your resume").closest("button")!);
    expect(clickSpy).toHaveBeenCalled();
  });
});

// Helper to get the hidden file input
function getByAcceptingPdf() {
  return document.querySelector('input[type="file"][accept="application/pdf"]') as HTMLInputElement;
}
