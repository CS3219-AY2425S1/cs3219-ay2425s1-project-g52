import { python } from "@codemirror/lang-python";
import { javascript } from "@codemirror/lang-javascript";
import { java } from "@codemirror/lang-java";
import { cpp } from "@codemirror/lang-cpp";

export const languageMap: Record<number, { name: string; mode: any }> = {
  100: { name: "Python", mode: python() },
  63: { name: "JavaScript", mode: javascript() },
  91: { name: "Java", mode: java() },
  54: { name: "C++", mode: cpp() },
};