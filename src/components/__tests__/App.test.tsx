import { render, screen } from "@testing-library/react";
import App from "../../App";
import { describe, it, expect, vi } from "vitest";
import '@testing-library/jest-dom';

// Mock the settingsLoader module
vi.mock('../../utils/settingsLoader');

// Import the mocked function after setting up the mock
import { fetchApiSettingsConfiguration, FetchSettingsResult } from '../../utils/settingsLoader';

// Cast the mocked function to the correct type for TypeScript
const mockedFetchApiSettingsConfiguration = fetchApiSettingsConfiguration as vi.MockedFunction<typeof fetchApiSettingsConfiguration>; 


describe("App", () => {
  beforeEach(() => {
    // Reset the mock before each test
    mockedFetchApiSettingsConfiguration.mockReset();
  });

  it("renders the API selection dropdown when no tokens are provided", async () => {
    // Setup the mock implementation for this test
    mockedFetchApiSettingsConfiguration.mockResolvedValue({
      success: true,
      data: { // This 'data' object is of type ApiSettingsList
        apis: [
          { apiName: 'TestAPI1', apiSettings: { baseEditUrl: '', baseAddUrl: '', baseListUrl: '', baseDeleteUrl: '' } },
          { apiName: 'TestAPI2', apiSettings: { baseEditUrl: '', baseAddUrl: '', baseListUrl: '', baseDeleteUrl: '' } },
        ],
      },
    } as FetchSettingsResult); // Use the actual FetchSettingsResult type

    render(<App />);
    
    // Use findByLabelText to wait for the element to appear after async operations
    expect(await screen.findByLabelText(/select api/i)).toBeInTheDocument();
  });

  it("displays an error message if API settings fail to load", async () => {
    // Setup the mock to return an error
    mockedFetchApiSettingsConfiguration.mockResolvedValue({
      success: false,
      error: "Failed to load settings for test",
    } as FetchSettingsResult);

    render(<App />);

    // Check for the error message
    expect(await screen.findByText(/Could not load API configuration: Failed to load settings for test/i)).toBeInTheDocument();
  });

});
