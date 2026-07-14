import { render, screen, act } from "@testing-library/react"
import { ThemeProvider, useTheme } from "../components/ThemeProvider"

const TestConsumer = () => {
  const { theme, setTheme } = useTheme()
  return (
    <>
      <span data-testid="theme">{theme}</span>
      <button onClick={() => setTheme("dark")}>dark</button>
      <button onClick={() => setTheme("light")}>light</button>
      <button onClick={() => setTheme("system")}>system</button>
    </>
  )
}

describe("ThemeProvider", () => {
  let localStorageMock: Record<string, string>
  let matchMediaMock: jest.Mock

  beforeEach(() => {
    localStorageMock = {}
    jest.spyOn(Storage.prototype, "getItem").mockImplementation((k) => localStorageMock[k] ?? null)
    jest.spyOn(Storage.prototype, "setItem").mockImplementation((k, v) => { localStorageMock[k] = v })
    matchMediaMock = jest.fn().mockReturnValue({ matches: false })
    window.matchMedia = matchMediaMock
    document.documentElement.classList.remove("light", "dark")
  })

  afterEach(() => jest.restoreAllMocks())

  it("uses defaultTheme when localStorage is empty", () => {
    render(<ThemeProvider defaultTheme="light"><TestConsumer /></ThemeProvider>)
    expect(screen.getByTestId("theme").textContent).toBe("light")
    expect(document.documentElement.classList.contains("light")).toBe(true)
  })

  it("reads theme from localStorage", () => {
    localStorageMock["vite-ui-theme"] = "dark"
    render(<ThemeProvider><TestConsumer /></ThemeProvider>)
    expect(screen.getByTestId("theme").textContent).toBe("dark")
    expect(document.documentElement.classList.contains("dark")).toBe(true)
  })

  it("uses custom storageKey", () => {
    localStorageMock["my-key"] = "light"
    render(<ThemeProvider storageKey="my-key"><TestConsumer /></ThemeProvider>)
    expect(screen.getByTestId("theme").textContent).toBe("light")
  })

  it("system theme resolves to dark when prefers-color-scheme is dark", () => {
    matchMediaMock.mockReturnValue({ matches: true })
    render(<ThemeProvider defaultTheme="system"><TestConsumer /></ThemeProvider>)
    expect(document.documentElement.classList.contains("dark")).toBe(true)
  })

  it("system theme resolves to light when prefers-color-scheme is light", () => {
    matchMediaMock.mockReturnValue({ matches: false })
    render(<ThemeProvider defaultTheme="system"><TestConsumer /></ThemeProvider>)
    expect(document.documentElement.classList.contains("light")).toBe(true)
  })

  it("setTheme updates theme and localStorage", () => {
    render(<ThemeProvider defaultTheme="light"><TestConsumer /></ThemeProvider>)
    act(() => screen.getByText("dark").click())
    expect(screen.getByTestId("theme").textContent).toBe("dark")
    expect(localStorageMock["vite-ui-theme"]).toBe("dark")
    expect(document.documentElement.classList.contains("dark")).toBe(true)
  })

  it("setTheme to system applies system preference", () => {
    matchMediaMock.mockReturnValue({ matches: true })
    render(<ThemeProvider defaultTheme="light"><TestConsumer /></ThemeProvider>)
    act(() => screen.getByText("system").click())
    expect(document.documentElement.classList.contains("dark")).toBe(true)
  })

  it("useTheme throws when used outside ThemeProvider", () => {
    const spy = jest.spyOn(console, "error").mockImplementation(() => {})
    expect(() => render(<TestConsumer />)).toThrow("useTheme must be used within a ThemeProvider")
    spy.mockRestore()
  })
})
