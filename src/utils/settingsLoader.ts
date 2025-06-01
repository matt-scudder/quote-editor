export interface ApiSetting {
  apiName: string;
  apiSettings: {
    baseEditUrl: string;
    baseAddUrl: string;
    baseListUrl: string;
    baseDeleteUrl: string;
  };
}

export interface ApiSettingsList {
  apis: ApiSetting[];
}

export type FetchSettingsResult =
  | { success: true; data: ApiSettingsList }
  | { success: false; error: string };

export const fetchApiSettingsConfiguration = async (): Promise<FetchSettingsResult> => {
  const settingsPath = `${import.meta.env.BASE_URL}api_settings.json`.replace(/\/\//g, '/');
  
  try {
    const response = await fetch(settingsPath);
    if (!response.ok) {
      throw new Error(`Failed to fetch API settings from ${settingsPath}: ${response.status} ${response.statusText}`);
    }
    const data: ApiSettingsList = await response.json();

    if (!data.apis || data.apis.length === 0) {
      throw new Error(`API settings loaded from ${settingsPath} are invalid or empty.`);
    }

    
    return { success: true, data: data };
  } catch (error) {
    console.error("Error fetching API settings:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return { 
      success: false, 
      error: `Could not load API configuration: ${errorMessage}. Please ensure 'api_settings.json' is accessible at ${settingsPath}.` 
    };
  }
};
