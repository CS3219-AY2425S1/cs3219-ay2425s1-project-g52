import { api } from "./constants";
import { Question } from "./interfaces";

const fetchQuestions = async (): Promise<Question[]> => {
  try {
    const response = await api.get("questions/").json<Question[]>();
    return response;
  } catch (error) {
    return Promise.reject(error);
  }
};

// untested
const addQuestion = async (newQuestion: Question): Promise<Question> => {
  try {
    const response = await api
      .post("questions/", {
        json: newQuestion,
      })
      .json<Question>();

    return response;
  } catch (error) {
    return Promise.reject(error);
  }
};

const deleteQuestion = async (questionId: string): Promise<void> => {
  try {
    await api.delete(`questions/${questionId}`);
    console.log("Question deleted successfully.");
  } catch (error) {
    console.error("Error deleting question:", error);
    return Promise.reject(error);
  }
};

const editQuestion = async (
  questionId: string,
  updatedData: Partial<Question>
): Promise<void> => {
  try {
    await api.patch(`questions/${questionId}`, {
      json: updatedData,
    });
  } catch (error) {
    console.error("Failed to edit question:", error);
    return Promise.reject(error);
  }
};

export { fetchQuestions, addQuestion, deleteQuestion, editQuestion };
