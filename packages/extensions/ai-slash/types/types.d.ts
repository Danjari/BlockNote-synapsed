export type AICommandAction = "explain" | "quiz-me" | "summarize" | "diagram" | "intro";
export type AICommandPayload = {
    selectedText?: string;
    context?: string;
    [key: string]: any;
};
export type AICommandEvent = {
    action: AICommandAction;
    payload: AICommandPayload;
};
export type AIStreamChunk = {
    content: string;
    isComplete: boolean;
    blockId?: string;
};
export type QuizResult = {
    correct: number;
    total: number;
    answers: Array<{
        question: string;
        selectedAnswer: string;
        correctAnswer: string;
        isCorrect: boolean;
    }>;
};
export type AISlashCallbacks = {
    onAICommand?: (event: AICommandEvent) => void;
    onStream?: (chunk: AIStreamChunk) => void;
    onQuizComplete?: (result: QuizResult) => void;
};
export type AISlashConfig = {
    classId?: string;
    nodeId?: string;
    jwt?: string;
    callbacks?: AISlashCallbacks;
};
export type AISlashHook = {
    emitAICommand: (action: AICommandAction, payload?: AICommandPayload) => void;
    updateStream: (chunk: AIStreamChunk) => void;
    completeQuiz: (result: QuizResult) => void;
};
export type AISlashMenuItem = {
    key: string;
    title: string;
    subtext?: string;
    badge?: string;
    aliases?: string[];
    group?: string;
    onItemClick: () => void;
};
export type SynapsedTheme = {
    fontFamily: string;
    accentColor: string;
    borderRadius: string;
};
//# sourceMappingURL=types.d.ts.map