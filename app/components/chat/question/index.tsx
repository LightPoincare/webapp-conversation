'use client'
import type { FC } from 'react'
import React from 'react'
import type { IChatItem } from '../type'
import s from '../style.module.css'

import { Markdown } from '@/app/components/base/markdown'
import ImageGallery from '@/app/components/base/image-gallery'
import { formatFileSize } from '@/app/components/base/file-uploader/utils'
import type { FileType } from '@/types/app'

type IQuestionProps = Pick<IChatItem, 'id' | 'content' | 'useCurrentUserAvatar'> & {
  imgSrcs?: string[]
  attachments?: FileType[]
}

const Question: FC<IQuestionProps> = ({ id, content, useCurrentUserAvatar, imgSrcs, attachments }) => {
  const userName = ''
  return (
    <div className='flex items-start justify-end' key={id}>
      <div>
        <div className={`${s.question} relative text-sm text-gray-900`}>
          <div
            className={'mr-2 py-3 px-4 bg-blue-500 rounded-tl-2xl rounded-b-2xl'}
          >
            {imgSrcs && imgSrcs.length > 0 && (
              <ImageGallery srcs={imgSrcs} />
            )}

            {attachments && attachments.length > 0 && (
              <div className="mt-2 mb-3 space-y-2">
                <div className="text-white font-medium mb-1">附件:</div>
                {attachments.map((file) => (
                  <div key={file._id} className="flex items-center p-2 rounded-lg bg-blue-400">
                    <div className="flex-shrink-0 mr-2">
                      <FileIcon extension={file.extension} />
                    </div>

                    <div className="flex-grow min-w-0">
                      <div className="text-sm font-medium text-white truncate" title={file.name}>
                        {file.name}
                      </div>
                      <div className="text-xs text-blue-100">
                        {formatFileSize(file.size)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <Markdown content={content} />
          </div>
        </div>
      </div>
      {useCurrentUserAvatar
        ? (
          <div className='w-10 h-10 shrink-0 leading-10 text-center mr-2 rounded-full bg-primary-600 text-white'>
            {userName?.[0].toLocaleUpperCase()}
          </div>
        )
        : (
          <div className={`${s.questionIcon} w-10 h-10 shrink-0 `}></div>
        )}
    </div>
  )
}

const FileIcon: React.FC<{ extension: string }> = ({ extension }) => {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
      <polyline points="14 2 14 8 20 8"></polyline>
    </svg>
  )
}

export default React.memo(Question)
