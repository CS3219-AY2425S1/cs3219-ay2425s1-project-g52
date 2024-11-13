import React from 'react';
import { Tooltip, TooltipProps, Box } from '@mui/material';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css'; // Import KaTeX styles for LaTeX rendering

interface MarkdownTooltipProps extends TooltipProps {
  title: string;
}

const MarkdownTooltip: React.FC<MarkdownTooltipProps> = ({ title, children, ...props }) => (
  <Tooltip
    {...props}
    title={
      <Box sx={{ maxWidth: 500, p: 1, fontSize: "14px", }}>
        <ReactMarkdown
          remarkPlugins={[remarkMath]}
          rehypePlugins={[rehypeKatex]}
          components={{
            p: ({ node, ...props }) => <span {...props} />,
          }}
        >
          {title}
        </ReactMarkdown>
      </Box>
    }
    placement='top'
  >
    {children}
  </Tooltip>
);

export default MarkdownTooltip;
