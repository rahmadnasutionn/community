"use client";

import TextAreaAutoSize from 'react-textarea-autosize';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { PostCreationRequest, PostValidator } from '@/lib/validators/post';
import { useCallback, useEffect, useRef, useState } from 'react';
import type EditorJS from '@editorjs/editorjs';
import { uploadFiles } from '@/lib/uploadthing';
import { toast } from '@/hooks/use-toast';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from './ui/button';
import Spinner from './ui/spinner';

interface EditorProps {
  subredditId: string;
}

function Editor({ subredditId }: EditorProps) {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(PostValidator),
    defaultValues: {
      subredditId,
      title: '',
      content: null,
    }
  })

  const router = useRouter();
  const pathname = usePathname();
  const ref = useRef<EditorJS>();
  const _titleRef = useRef<HTMLTextAreaElement>(null);
  const [isMounted, setIsMounted] = useState(false);

  const { mutate: createPost, isLoading } = useMutation({
    mutationFn: async ({ title, content, subredditId }: PostCreationRequest) => {
      const payload: PostCreationRequest = {
        title,
        content,
        subredditId,
      };
      const { data } = await axios.post('/api/subreddit/post/create', payload);
      return data;
    },
    onError: (err) => {
      return toast({
        title: 'Something went wrong',
        description:
          'Your post not published',
        variant: 'destructive',
      });
    },
    onSuccess: () => {
      const newPathname = pathname.split('/').slice(0, -1).join('/');
      router.push(newPathname);

      router.refresh();

      return toast({
        description: 'Your post has been successfully',
      });
    }
  })

  const initializedEditor = useCallback(async () => {
    const EditorJS = (await import('@editorjs/editorjs')).default;
    const Header = (await import('@editorjs/header')).default;
    const Embed = (await import('@editorjs/embed')).default;
    const Table = (await import('@editorjs/table')).default;
    const List = (await import('@editorjs/list')).default;
    const Code = (await import('@editorjs/code')).default;
    const InlineCode = (await import('@editorjs/inline-code')).default;
    const LinkTool = (await import('@editorjs/link')).default;
    const ImageTool = (await import('@editorjs/image')).default;

    if (!ref.current) {
      const editor = new EditorJS({
        holder: 'editor',
        onReady() {
          ref.current = editor;
        },
        placeholder: 'Type here to write your post',
        inlineToolbar: true,
        data: { blocks: [] },
        tools: {
          Header,
          linkTool: {
            class: LinkTool,
            config: {
              endpoint: '/api/link',
            }
          },
          image: {
            class: ImageTool,
            config: {
              uploader: {
                async uploadByFile(file: File) {
                  const [res] = await uploadFiles([file], 'imageUploader');

                  return {
                    success: 1,
                    file: {
                      url: res.fileUrl,
                    },
                  }
                }
              }
            }
          },
          list: List,
          code: Code,
          inlineCode: InlineCode,
          table: Table,
          embed: Embed,
        }
      })
    }
  }, []);

  useEffect(() => {
    if (typeof window !== undefined) {
      setIsMounted(true);
    }
  }, []);

  useEffect(() => {
    if (Object.keys(errors)) {
      for (const [_key, value] of Object.entries(errors)) {
        toast({
          title: 'Something went wrong',
          description:
            (value as { message: string }).message,
          variant: 'destructive',
        });
      }
    }
  }, [errors]);

  useEffect(() => {
    const init = async () => {
      await initializedEditor();

      setTimeout(() => {
        _titleRef.current?.focus();
      }, 200);
    }

    if (isMounted) {
      init();
    }

    return () => {
      ref.current?.destroy();
      ref.current = undefined;
    }
  }, [isMounted, initializedEditor]);

  if (!isMounted) return null;

  const onSubmit = async (data: PostCreationRequest) => {
    const blocks = await ref.current?.save();

    const payload: PostCreationRequest = {
      title: data.title,
      content: blocks,
      subredditId,
    };

    createPost(payload);
  }

  const { ref: titleRef, ...rest } = register('title');
  
  return (
    <>
      <div className="w-full p-4 border-zinc-200 border bg-zinc-50 rounded-lg">
        <form 
          id="subreddit post form"
          className="w-fit"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="prose prose-stone dark:prose-invert">
            <TextAreaAutoSize
              ref={(event) => {
                titleRef(event);
              //@ts-ignore
                _titleRef.current = event;
              }}
              {...rest}
              placeholder='Title'
              className='w-full p-2 outline-none resize-none appearance-none overflow-hidden text-5xl bg-transparent font-bold'
            />

            <div id="editor" className='min-h-[500px]' />
          </div>
        </form>
      </div>

      <div className="w-full flex justify-end">
        <Button 
          type='submit'
          className='w-full'
          form='subreddit post form'
          disabled={isLoading}
        >
          { isLoading ? <Spinner className='bg-white' /> : 'Post' }
        </Button>
      </div>
    </>
  );
};

export default Editor;