"'use client'";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  BookOpen,
  Image as ImageIcon,
  FileText,
} from "lucide-react";
import ReactMarkdown from "react-markdown";

type JournalEntry = {
  id: number;
  content: string;
};

type Chapter = {
  id: number;
  title: string;
  entries: JournalEntry[];
};

export function EnhancedChapterBookJournal() {
  const [chapters, setChapters] = useState<Chapter[]>([
    { id: 1, title: "'Chapter 1'", entries: [{ id: 1, content: "''" }] },
  ]);
  const [currentChapter, setCurrentChapter] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [isPreview, setIsPreview] = useState(false);
  const [summary, setSummary] = useState<string>("''");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const savedChapters = localStorage.getItem("'journalChapters'");
    if (savedChapters) {
      setChapters(JSON.parse(savedChapters));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("'journalChapters'", JSON.stringify(chapters));
  }, [chapters]);

  const handleEntryChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const updatedChapters = chapters.map((chapter) =>
      chapter.id === currentChapter
        ? {
            ...chapter,
            entries: chapter.entries.map((entry) =>
              entry.id === currentPage
                ? { ...entry, content: e.target.value }
                : entry
            ),
          }
        : chapter
    );
    setChapters(updatedChapters);
    setSavedAt(new Date().toLocaleTimeString());
  };

  const handleNewPage = () => {
    const updatedChapters = chapters.map((chapter) =>
      chapter.id === currentChapter
        ? {
            ...chapter,
            entries: [
              ...chapter.entries,
              { id: chapter.entries.length + 1, content: "''" },
            ],
          }
        : chapter
    );
    setChapters(updatedChapters);
    setCurrentPage(chapters[currentChapter - 1].entries.length + 1);
  };

  const handleNewChapter = () => {
    const newChapter = {
      id: chapters.length + 1,
      title: `Chapter ${chapters.length + 1}`,
      entries: [{ id: 1, content: "''" }],
    };
    setChapters([...chapters, newChapter]);
    setCurrentChapter(newChapter.id);
    setCurrentPage(1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    } else if (currentChapter > 1) {
      setCurrentChapter(currentChapter - 1);
      setCurrentPage(chapters[currentChapter - 2].entries.length);
    }
  };

  const handleNextPage = () => {
    const currentChapterData = chapters[currentChapter - 1];
    if (currentPage < currentChapterData.entries.length) {
      setCurrentPage(currentPage + 1);
    } else if (currentChapter < chapters.length) {
      setCurrentChapter(currentChapter + 1);
      setCurrentPage(1);
    }
  };

  const handleChapterChange = (value: string) => {
    setCurrentChapter(Number(value));
    setCurrentPage(1);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageMarkdown = `![${file.name}](${reader.result as string})\n\n`;
        insertTextAtCursor(imageMarkdown);
      };
      reader.readAsDataURL(file);
    }
  };

  const insertTextAtCursor = (text: string) => {
    const textarea = textareaRef.current;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const content = textarea.value;
      const newContent =
        content.substring(0, start) + text + content.substring(end);

      const updatedChapters = chapters.map((chapter) =>
        chapter.id === currentChapter
          ? {
              ...chapter,
              entries: chapter.entries.map((entry) =>
                entry.id === currentPage
                  ? { ...entry, content: newContent }
                  : entry
              ),
            }
          : chapter
      );
      setChapters(updatedChapters);

      // Set cursor position after the inserted text
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + text.length;
        textarea.focus();
      }, 0);
    }
  };

  const handleAddImageClick = () => {
    fileInputRef.current?.click();
  };

  const generateSummary = () => {
    const currentChapterData = chapters[currentChapter - 1];
    const chapterContent = currentChapterData.entries
      .map((entry) => entry.content)
      .join("'\n\n'");
    setSummary(
      `This is a summary of Chapter ${currentChapter}. It contains ${currentChapterData.entries.length} pages.`
    );
  };

  const currentChapterData = chapters[currentChapter - 1];
  const currentEntry = currentChapterData.entries.find(
    (entry) => entry.id === currentPage
  ) || { id: 1, content: "''" };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4 dark:bg-slate-950">
      <Card className="w-full max-w-4xl">
        <CardContent className="p-6">
          <div className="mb-4 flex justify-between items-center">
            <Select
              onValueChange={handleChapterChange}
              value={currentChapter.toString()}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Chapter" />
              </SelectTrigger>
              <SelectContent>
                {chapters.map((chapter) => (
                  <SelectItem key={chapter.id} value={chapter.id.toString()}>
                    {chapter.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="text-lg font-semibold">Page {currentPage}</span>
            <Button onClick={handleNewChapter} variant="outline" size="sm">
              <Plus className="mr-2 h-4 w-4" /> New Chapter
            </Button>
          </div>
          <div className="mb-4 flex justify-between items-center">
            <Button
              onClick={handlePreviousPage}
              disabled={currentChapter === 1 && currentPage === 1}
              variant="outline"
              size="icon"
              aria-label="Previous page"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              onClick={handleNextPage}
              disabled={
                currentChapter === chapters.length &&
                currentPage === chapters[chapters.length - 1].entries.length
              }
              variant="outline"
              size="icon"
              aria-label="Next page"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          {isPreview ? (
            <div className="prose max-w-none mb-4">
              <ReactMarkdown>{currentEntry.content}</ReactMarkdown>
            </div>
          ) : (
            <Textarea
              ref={textareaRef}
              placeholder="Start writing your journal entry here... (Markdown supported)"
              value={currentEntry.content}
              onChange={handleEntryChange}
              className="w-full h-[50vh] text-lg resize-none mb-4"
              aria-label={`Journal entry for ${currentChapterData.title}, page ${currentPage}`}
            />
          )}
          <div className="flex justify-between items-center mb-4">
            <Button onClick={() => setIsPreview(!isPreview)} variant="outline">
              {isPreview ? "'Edit'" : "'Preview'"}
            </Button>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="image-upload"
              ref={fileInputRef}
            />
            <Button variant="outline" onClick={handleAddImageClick}>
              <ImageIcon className="mr-2 h-4 w-4" /> Insert Image
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" onClick={generateSummary}>
                  <FileText className="mr-2 h-4 w-4" /> Summarize
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Chapter Summary</DialogTitle>
                </DialogHeader>
                <div className="mt-4">
                  <p>{summary}</p>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <div className="flex justify-between items-center">
            <Button
              onClick={handleNewPage}
              className="bg-slate-900 text-slate-50 dark:bg-slate-50 dark:text-slate-900"
            >
              <BookOpen className="mr-2 h-4 w-4" /> New Page
            </Button>
            {savedAt && (
              <span className="text-sm text-slate-500 dark:text-slate-400">
                Last saved at {savedAt}
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
