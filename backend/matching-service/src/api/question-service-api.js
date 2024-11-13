import fetch from "node-fetch";

const getQuestion = async (category, difficulty) => {
  try {
    // Construct the URL with query parameters
    const url = `${
      process.env.QUESTION_SERVICE_URL
    }/questions?category=${encodeURIComponent(
      category
    )}&difficulty=${encodeURIComponent(difficulty)}`;
    console.log("URL:", url);
    // const url = `http://localhost:8000/questions?category=${category}&difficulty=${difficulty}`;
    // console.log("URL:", url);
    // Make the GET request
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Check if the response is OK
    if (!response.ok) {
      throw new Error("Failed to fetch the question");
    }

    // Parse the response JSON
    const question = await response.json();
    console.log("Random question:", question);

    // Return the random question
    return question;
  } catch (error) {
    console.error("Error fetching question:", error);
    return null; // Return null if an error occurs
  }
};

export { getQuestion };
