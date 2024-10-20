import React, { useState, useEffect } from 'react';
import { Box, Button, Typography } from '@mui/material';
import AddIcon from "@mui/icons-material/Add";
import QuestionTable from './QuestionTable';
import QuestionModal from './QuestionModal';
import ConfirmModal from './ConfirmModal'; 
import { Question } from '../api/interfaces';
import { fetchQuestions, addQuestion, editQuestion, deleteQuestion } from '../api/question-api';

const QuestionManager: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [confirmModalOpen, setConfirmModalOpen] = useState<boolean>(false);
  const [questionToDelete, setQuestionToDelete] = useState<string | null>(null);


  useEffect(() => {
    const loadQuestions = async () => {
      const response = await fetchQuestions();
      setQuestions(response);
    };

    loadQuestions();
  }, []);

  const handleAdd = async (newData: Omit<Question, 'qId'>) => {
    try {
      let newQId = 1;
      const existingQId = questions.map(q => q.qId);
      for (let i = 1; i <= questions.length + 1; i++) {
        if (!existingQId.includes(i)) {
          newQId = i; 
          break; 
        }
    }
      const questionToAdd: Question = { ...newData, qId: newQId }; 
      const addedQuestion = await addQuestion(questionToAdd);
      setQuestions(prevQuestions => [...prevQuestions, addedQuestion]);
      setOpenModal(false);
    } catch (error) {
      console.error('Failed to add question:', error);
    }
  };
  const handleEdit = async (id: string, updatedData: Partial<Question>) => {
    try {
      await editQuestion(id, updatedData);
      setQuestions(prevQuestions => 
        prevQuestions.map(question => (question._id === id ? { ...question, ...updatedData } : question))
      );
      setOpenModal(false);
    } catch (error) {
      console.error('Failed to update question:', error);
    }
  };

  const handleDelete = async (questionId: string) => {
    try {
      await deleteQuestion(questionId);
      setQuestions(prevQuestions => prevQuestions.filter(question => question._id !== questionId));
      setConfirmModalOpen(false);
      setQuestionToDelete(null);
    } catch (error) {
      console.error('Failed to delete question:', error);
    }
  };

  const openDeleteConfirmModal = (questionId: string) => {
    setQuestionToDelete(questionId);
    setConfirmModalOpen(true);
  };

  const handleOpenModal = (question: Question | null) => {
    setCurrentQuestion(question);
    setOpenModal(true);
  };

  return (
    <Box   
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      sx={{ width: '75%', margin: '0 auto' }}
    >
      <Box
        sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2, width: "100%" }}
      >
        <Typography variant="h4" color="white" gutterBottom sx={{ flexGrow: 4, textAlign: "center" }}>
          Questions List
        </Typography>

        <Button
          variant="contained"
          color="success"
          startIcon={<AddIcon />}
          onClick={() => handleOpenModal(null)}
          sx={{ marginRight: 1 }}
        >
          Add Question
        </Button>
      </Box>
      
      <QuestionTable
        questions={questions}
        onEdit={handleEdit}
        onDelete={openDeleteConfirmModal}
        onOpenModal={handleOpenModal}
      />
      <QuestionModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        question={currentQuestion}
        onAdd={handleAdd}
        onEdit={handleEdit}
      />
      <ConfirmModal
        open={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        onConfirm={handleDelete}
        questionId={questionToDelete}
      />
    </Box>
  );
};

export default QuestionManager;
