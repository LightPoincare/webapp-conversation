'use client'
import type { FC } from 'react'
import React, { useState, useEffect } from 'react'
import type { ThoughtItem, ToolInfoInThought } from '../type'
import Tool from './tool'
import type { Emoji } from '@/types/tools'
import s from './style.module.css'

export type IThoughtProps = {
  thought: ThoughtItem
  allToolIcons: Record<string, string | Emoji>
  isFinished: boolean
}

function getValue(value: string, isValueArray: boolean, index: number) {
  if (isValueArray) {
    try {
      return JSON.parse(value)[index]
    }
    catch (e) {
    }
  }
  return value
}

// 处理<think></think>标签内的内容
function processThinking(thought: string): {
  hasThinking: boolean;
  visibleContent: string;
  thinkingContent: string;
  isThinkingComplete: boolean
} {
  // 检测是否有完整的<think></think>标签
  const fullThinkRegex = /<think>([\s\S]*?)<\/think>/;
  const fullMatch = thought.match(fullThinkRegex);

  if (fullMatch) {
    // 完整标签的情况
    let thinkingContent = fullMatch[1];
    // 处理连续多次换行问题
    thinkingContent = thinkingContent.replace(/\n{3,}/g, '\n\n');
    const visibleContent = thought.replace(fullMatch[0], '');
    return {
      hasThinking: true,
      visibleContent,
      thinkingContent,
      isThinkingComplete: true
    };
  }

  // 检测是否有未闭合的<think>标签
  const openThinkRegex = /<think>([\s\S]*)/;
  const openMatch = thought.match(openThinkRegex);

  if (openMatch) {
    // 未闭合标签的情况，正在流式输出思考内容
    let thinkingContent = openMatch[1];
    // 处理连续多次换行问题
    thinkingContent = thinkingContent.replace(/\n{3,}/g, '\n\n');
    const visibleContent = thought.replace(openMatch[0], '');
    return {
      hasThinking: true,
      visibleContent,
      thinkingContent,
      isThinkingComplete: false
    };
  }

  return {
    hasThinking: false,
    visibleContent: thought,
    thinkingContent: '',
    isThinkingComplete: true
  };
}

const Thought: FC<IThoughtProps> = ({
  thought,
  allToolIcons,
  isFinished,
}) => {
  const [showThinking, setShowThinking] = useState(false);

  const [toolNames, isValueArray]: [string[], boolean] = (() => {
    try {
      if (Array.isArray(JSON.parse(thought.tool)))
        return [JSON.parse(thought.tool), true]
    }
    catch (e) {
    }
    return [[thought.tool], false]
  })()

  const toolThoughtList = toolNames.map((toolName, index) => {
    return {
      name: toolName,
      input: getValue(thought.tool_input, isValueArray, index),
      output: getValue(thought.observation, isValueArray, index),
      isFinished,
    }
  })

  // 处理思维内容，判断是否包含<think></think>标签
  const { hasThinking, visibleContent, thinkingContent, isThinkingComplete } =
    thought.thought ? processThinking(thought.thought) :
      { hasThinking: false, visibleContent: '', thinkingContent: '', isThinkingComplete: true };

  // 根据思考内容流式输出状态控制展开/折叠
  useEffect(() => {
    if (hasThinking) {
      if (!isThinkingComplete && !isFinished) {
        // 如果正在输出思考内容，则展开
        setShowThinking(true);
      } else if (isThinkingComplete && isFinished) {
        // 如果思考内容输出完毕，则折叠
        setShowThinking(false);
      }
    }
  }, [hasThinking, isThinkingComplete, isFinished]);

  return (
    <div className='my-2 space-y-2'>
      {hasThinking && (
        <div className={s.thinkingContainer}>
          <div
            className={s.thinkingHeader}
            onClick={() => setShowThinking(!showThinking)}
          >
            <span className={s.thinkingIcon}>
              {showThinking ? '▼' : '►'}
            </span>
            <span className={s.thinkingTitle}>深度思考</span>
          </div>

          {showThinking && (
            <div className={s.thinkingContent}>
              {thinkingContent}
            </div>
          )}
        </div>
      )}

      {visibleContent && (
        <div className="mb-2">{visibleContent}</div>
      )}

      {toolThoughtList.map((item: ToolInfoInThought, index) => (
        <Tool
          key={index}
          payload={item}
          allToolIcons={allToolIcons}
        />
      ))}
    </div>
  )
}
export default React.memo(Thought)
