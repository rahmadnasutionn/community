import dynamic from 'next/dynamic';
import Image from 'next/image';
import React, { useRef } from 'react'
import ProgressiveImage from './progressive-image';
import useIntersectionObserver from '@/hooks/useIntersectionObserver';

const Output = dynamic(async () => (await import('editorjs-react-renderer')).default, {
  ssr: false,
});

const style = {
  paragraph: {
    fontSize: '0.875rem',
    lineHeight: '1.25rem',
  },
};

const renderers = {
  image: CustomImageRender,
  code: CustomCodeRender,
}

function EditorOutput({ content }: { content: any }) {
  return (
    <Output 
      className="text-sm" 
      style={style}
      data={content}
      renderers={renderers} 
    />
  );
};

export default EditorOutput;

function CustomImageRender({ data }: any) {
  const srcUrl = data.file.url;

  return (
    <div className="relative w-full min-h-[15rem]">
      <ProgressiveImage 
        src={srcUrl}
      />
    </div>
  );
};

function CustomCodeRender({ data }: any) {
  return (
    <div className='bg-gray-800 rounded-md p-4'>
      <code className='text-gray-100 text-sm'>{data.code}</code>
    </div>
  );
};