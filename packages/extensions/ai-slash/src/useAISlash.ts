import { useCallback, useRef } from "react";
import type { BlockNoteEditor } from "@blocknote/core";
import type { 
  AISlashConfig, 
  AISlashHook, 
  AICommandAction, 
  AICommandPayload,
  AIStreamChunk,
  QuizResult 
} from "./types.js";

/**
 * React hook for AI slash commands in BlockNote editor
 * 
 * @param config - Configuration object with callbacks and metadata
 * @returns Object with methods to interact with AI commands
 */
export function useAISlash(config: AISlashConfig = {}): AISlashHook {
  const { callbacks } = config;
  const callbacksRef = useRef(callbacks);

  // Update callbacks ref when they change
  callbacksRef.current = callbacks;

  const emitAICommand = useCallback((action: AICommandAction, payload: AICommandPayload = {}) => {
    const event = {
      action,
      payload: {
        ...payload,
        classId: config.classId,
        nodeId: config.nodeId,
        jwt: config.jwt,
      }
    };

    callbacksRef.current?.onAICommand?.(event);
  }, [config.classId, config.nodeId, config.jwt]);

  const updateStream = useCallback((chunk: AIStreamChunk) => {
    callbacksRef.current?.onStream?.(chunk);
  }, []);

  const completeQuiz = useCallback((result: QuizResult) => {
    callbacksRef.current?.onQuizComplete?.(result);
  }, []);

  return {
    emitAICommand,
    updateStream,
    completeQuiz,
  };
} 