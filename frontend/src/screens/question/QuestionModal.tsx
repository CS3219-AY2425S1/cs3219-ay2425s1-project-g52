import React, { useEffect, useState } from 'react';
import { Modal, Button, Select, Input, Form } from 'antd';
import { Question } from '../../api/interfaces';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css'; // LaTeX rendering

interface QuestionModalProps {
  open: boolean;
  onClose: () => void;
  question: Question | null;
  onAdd: (newData: Omit<Question, '_id'>) => void;
  onEdit: (id: string, updatedData: Partial<Question>) => void;
}

const QuestionModal: React.FC<QuestionModalProps> = ({ open, onClose, question, onAdd, onEdit }) => {
  const [form] = Form.useForm();
  const [showMarkdownPreview, setShowMarkdownPreview] = useState(false);

  useEffect(() => {
    if (question) {
      form.setFieldsValue({
        qTitle: question.qTitle,
        qDescription: question.qDescription,
        qCategory: question.qCategory,
        qComplexity: question.qComplexity,
      });
    } else {
      form.resetFields();
    }
  }, [question, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (question) {
        onEdit(question._id || '', values);
      } else {
        onAdd(values as Omit<Question, '_id'>);
      }
      onClose();
    } catch (errorInfo) {
      console.error('Validation Failed:', errorInfo);
    }
  };

  const topics = [
    "Strings",
    "Algorithms",
    "Data Structures",
    "Bit Manipulation",
    "Recursion",
    "Databases",
    "Arrays",
    "Brainteaser",
  ];

  return (
    <Modal open={open} onCancel={onClose} footer={null}>
      <h2>{question ? 'Edit Question' : 'Add Question'}</h2>

      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          name="qTitle"
          label="Title"
          rules={[{ required: true, message: 'Title is required' }]}
        >
          <Input />
        </Form.Item>

        <Button onClick={() => setShowMarkdownPreview(!showMarkdownPreview)} style={{ marginBottom: 8 }}>
          {showMarkdownPreview ? 'Edit Description' : 'Preview Description'}
        </Button>

        {showMarkdownPreview ? (
          <div style={{ padding: 16, backgroundColor: '#f5f5f5', borderRadius: 4, maxHeight: 200, overflow: 'auto', whiteSpace: 'pre-line' }}>
            <ReactMarkdown
              remarkPlugins={[remarkMath]}
              rehypePlugins={[rehypeKatex]}
            >
              {form.getFieldValue('qDescription') || ''}
            </ReactMarkdown>
          </div>
        ) : (
          <Form.Item
            name="qDescription"
            label="Description (Markdown supported)"
            rules={[{ required: true, message: 'Description is required' }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>
        )}

        <Form.Item
          name="qCategory"
          label="Category"
          rules={[{ required: true, message: 'Please select at least one category' }]}
        >
          <Select mode="multiple">
            {topics.map((category) => (
              <Select.Option key={category} value={category}>
                {category}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="qComplexity"
          label="Complexity"
          rules={[{ required: true, message: 'Complexity is required' }]}
        >
          <Select>
            <Select.Option value="Easy">Easy</Select.Option>
            <Select.Option value="Medium">Medium</Select.Option>
            <Select.Option value="Hard">Hard</Select.Option>
          </Select>
        </Form.Item>

        <Button onClick={onClose} style={{ margin: 4 }}>
          Cancel
        </Button>
        <Button type="primary" htmlType="submit" style={{ margin: 4 }}>
          Save
        </Button>
      </Form>
    </Modal>
  );
};

export default QuestionModal;
