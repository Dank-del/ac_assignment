"use client";
import PostCard from "@/components/post-card";
import { Button } from "@/components/ui/button";
import { client } from "@/lib/queryclient";
import { getCookie, deleteCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { CirclePlus, LogOut } from 'lucide-react';
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "@tanstack/react-form";
import { toast } from "@/components/ui/use-toast";
import { FieldInfo } from "@/lib/form.utils";

export default function Dashboard() {
  const cookie = getCookie('token');
  const router = useRouter();
  const { mutateAsync } = client.post.useMutation();
  const { data: user } = client.me.useQuery(['user'], {
    headers: {
      authorization: `Bearer ${cookie}`,
    },
  });
  const { data } = client.posts.useQuery(['posts'], {
    query: {
      author: user?.body?.id,
    }
  });
  if (!cookie) {
    router.push('/login');
  }

  const form = useForm({
    defaultValues: {
      title: '',
      content: '',
    },
    onSubmit: async ({ value }) => {
      try {
        const result = await mutateAsync({
          body: {
            title: value.title,
            content: value.content,
          },
          headers: {
            authorization: `Bearer ${cookie}`,
          }
        })
        if (result.status === 200) {
          window.location.reload();
        }
      } catch (error) {
        console.error(error as Error)
        toast({
          title: 'Error',
          description: JSON.stringify(error),
        })
        return;
      }
    },

  })
  return (
    <div className="flex min-h-screen flex-col p-8">
      {user?.body?.email &&
        <div className="flex gap-4 items-center">
          <h1 className="h3">Welcome, {user?.body?.email}</h1>
          <Sheet>
            <SheetTrigger>
              <Button>
                <CirclePlus />
              </Button>
            </SheetTrigger>
            <SheetContent side="top">
              <SheetHeader>
                <SheetTitle>Create New Post</SheetTitle>
                <SheetDescription>
                  Compose a new post to share with the world.
                </SheetDescription>
              </SheetHeader>
              <div className="grid gap-4 py-4">
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    form.handleSubmit()
                  }}
                >
                  <form.Field
                    name="title"
                    validators={{
                      onChange: ({ value }) =>
                        !value
                          ? 'title is required'
                          : value.length < 3
                            ? 'title must be at least 3 characters'
                            : undefined,
                      onChangeAsyncDebounceMs: 500,
                      onChangeAsync: async ({ value }) => {
                        await new Promise((resolve) => setTimeout(resolve, 1000))
                        return (
                          value.includes('error') &&
                          'No "error" allowed in title'
                        )
                      },
                    }}
                    children={(field) => {
                      // Avoid hasty abstractions. Render props are great!
                      return (
                        <>
                          <div className="grid grid-cols-4 items-center mb-3 gap-4">
                            <Label htmlFor="title" className="text-right">
                              Title
                            </Label>
                            <Input id={field.name}
                              name={field.name}
                              value={field.state.value}
                              onBlur={field.handleBlur}
                              onChange={(e) => field.handleChange(e.target.value)}
                              required
                              placeholder="Change the world"
                              className="col-span-3" />
                          </div>
                          <FieldInfo field={field} />
                        </>
                      )
                    }}
                  />
                  <form.Field
                    name="content"
                    validators={{
                      onChange: ({ value }) =>
                        !value
                          ? 'content is required'
                          : value.length < 3
                            ? 'content must be at least 10 characters'
                            : undefined,
                      onChangeAsyncDebounceMs: 500,
                      onChangeAsync: async ({ value }) => {
                        await new Promise((resolve) => setTimeout(resolve, 1000))
                        return (
                          value.includes('error') &&
                          'No "error" allowed in content'
                        )
                      },
                    }}
                    children={(field) => {
                      // Avoid hasty abstractions. Render props are great!
                      return (
                        <>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="content" className="text-right">
                              Content
                            </Label>
                            <Textarea
                              id={field.name}
                              name={field.name}
                              value={field.state.value}
                              onBlur={field.handleBlur}
                              onChange={(e) => field.handleChange(e.target.value)}
                              required
                              placeholder="My final message, goodbye."
                              className="col-span-3" />
                          </div>
                          <FieldInfo field={field} />
                        </>
                      )
                    }}
                  />

                  <SheetFooter>
                    <SheetClose asChild>
                      <form.Subscribe
                        selector={(state) => [state.canSubmit, state.isSubmitting]}
                        children={([canSubmit, isSubmitting]) => (
                          <Button className="mt-4" type="submit" disabled={!canSubmit}>
                            {isSubmitting ? '...' : 'Post'}
                          </Button>
                        )}
                      />
                    </SheetClose>
                  </SheetFooter>
                </form>
              </div>
            </SheetContent>
          </Sheet>
          <Button onClick={() => {
            const sure = confirm("Are you sure you want to log out?")
            if (sure) {
              deleteCookie('token');
              window.location.href = "/"
            }
          }}>
            <LogOut />
          </Button>
        </div>
      }
      <div className="m-4 flex flex-wrap gap-2">
        {data?.body?.map((post) => (
          <PostCard id={post.id} createdAt={post.createdAt} title={post.title} authorId={post.authorId} content={post.content} key={post.id} />
        ))}
      </div>
    </div>
  );
}
