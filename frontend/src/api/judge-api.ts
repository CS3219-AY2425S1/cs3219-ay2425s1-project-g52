import axios from "axios";

const RAPID_API_URL = process.env.REACT_APP_RAPID_API_URL;
const RAPID_API_HOST = process.env.REACT_APP_RAPID_API_HOST;
const RAPID_API_KEY = process.env.REACT_APP_RAPID_API_KEY;

interface CompileCodeProps {
  languageId: number;
  sourceCode: string;
}

export const compileCode = async ({ languageId, sourceCode }: CompileCodeProps) => {
  const formData = {
    language_id: languageId,
    source_code: btoa(sourceCode), // encode source code in base64
  };

  const options = {
    method: "POST",
    url: RAPID_API_URL,
    params: { base64_encoded: "true", fields: "*" },
    headers: {
      "content-type": "application/json",
      "X-RapidAPI-Host": RAPID_API_HOST,
      "X-RapidAPI-Key": RAPID_API_KEY,
    },
    data: formData,
  };

  try {
    const response = await axios.request(options);
    return response.data.token;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      // Handle Axios error
      throw error.response ? error.response.data : error;
    } else {
      // Handle unexpected errors
      throw new Error("An unexpected error occurred");
    }
  }
};

export const checkStatus = async (token: string) => {
  const options = {
    method: "GET",
    url: `${RAPID_API_URL}/${token}`,
    params: { base64_encoded: "true", fields: "*" },
    headers: {
      "X-RapidAPI-Host": RAPID_API_HOST,
      "X-RapidAPI-Key": RAPID_API_KEY,
    },
  };

  try {
    const response = await axios.request(options);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      // Handle Axios error
      throw error.response ? error.response.data : error;
    } else {
      // Handle unexpected errors
      throw new Error("An unexpected error occurred");
    }
  }
};
