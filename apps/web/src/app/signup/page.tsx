"use client";
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useForm } from "@tanstack/react-form"
import { FieldInfo } from "@/lib/form.utils"
import { client } from "@/lib/queryclient";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

export default function LoginForm() {
    const router = useRouter();
    const { mutateAsync } = client.signup.useMutation();
    const form = useForm({
        defaultValues: {
            email: '',
            password: '',
            confirmPassword: '',
        },
        onSubmit: async ({ value }) => {
            if (value.password !== value.confirmPassword) {
                toast({
                    title: 'Error',
                    description: 'Passwords do not match',
                })
                return
            }
            // Do something with form data
            try {
                const result = await mutateAsync({
                    body: {
                        email: value.email,
                        password: value.password,
                    }
                })
                if (result.status === 200) {
                    console.log('Signed up')
                    router.push('/login');
                }

                console.log(value)
            } catch (error) {
                console.error(error as Error)
                toast({
                    title: 'Error',
                    description: JSON.stringify(error),
                })
            }
        },
    })
    return (
        <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 ">
            <div className="flex items-center justify-center py-12">
                <div className="mx-auto grid w-[350px] gap-6">
                    <div className="grid gap-2 text-center">
                        <h1 className="text-3xl font-bold">Login</h1>
                        <p className="text-balance text-muted-foreground">
                            Enter your email below to login to your account
                        </p>
                    </div>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            form.handleSubmit()
                        }}
                    >
                        <div className="grid gap-4">
                            <div className="grid gap-2">
                                <form.Field
                                    name="email"
                                    validators={{
                                        onChange: ({ value }) =>
                                            !value
                                                ? 'Email is required'
                                                : value.length < 3
                                                    ? 'Email name must be at least 3 characters'
                                                    : undefined,
                                        onChangeAsyncDebounceMs: 500,
                                        onChangeAsync: async ({ value }) => {
                                            await new Promise((resolve) => setTimeout(resolve, 1000))
                                            return (
                                                value.includes('error') &&
                                                'No "error" allowed in email'
                                            )
                                        },
                                    }}
                                    children={(field) => {
                                        // Avoid hasty abstractions. Render props are great!
                                        return (
                                            <>
                                                <Label htmlFor="email">Email</Label>
                                                <Input
                                                    placeholder="m@example.com"
                                                    type="email"
                                                    id={field.name}
                                                    name={field.name}
                                                    value={field.state.value}
                                                    onBlur={field.handleBlur}
                                                    onChange={(e) => field.handleChange(e.target.value)}
                                                    required
                                                />
                                                <FieldInfo field={field} />
                                            </>
                                        )
                                    }}
                                />

                            </div>
                            <div className="grid gap-2">

                                <form.Field
                                    name="password"
                                    validators={{
                                        onChange: ({ value }) =>
                                            !value
                                                ? 'password is required'
                                                : value.length < 3
                                                    ? 'password must be at least 3 characters'
                                                    : undefined,
                                        onChangeAsyncDebounceMs: 500,
                                        onChangeAsync: async ({ value }) => {
                                            await new Promise((resolve) => setTimeout(resolve, 1000))
                                            return (
                                                value.includes('error') &&
                                                'No "error" allowed in password'
                                            )
                                        },
                                    }}
                                    children={(field) => {
                                        // Avoid hasty abstractions. Render props are great!
                                        return (
                                            <>
                                                <div className="flex items-center">
                                                    <Label htmlFor="password">Password</Label>
                                                </div>
                                                <Input id={field.name}
                                                    name={field.name}
                                                    value={field.state.value}
                                                    onBlur={field.handleBlur}
                                                    onChange={(e) => field.handleChange(e.target.value)}
                                                    type="password" required
                                                />
                                                <FieldInfo field={field} />
                                            </>
                                        )
                                    }}
                                />
                            </div>
                            <div className="grid gap-2">

                                <form.Field
                                    name="confirmPassword"
                                    validators={{
                                        onChange: ({ value }) =>
                                            !value
                                                ? 'password is required'
                                                : value.length < 3
                                                    ? 'password must be at least 3 characters'
                                                    : undefined,
                                        onChangeAsyncDebounceMs: 500,
                                        onChangeAsync: async ({ value }) => {
                                            await new Promise((resolve) => setTimeout(resolve, 1000))
                                            return (
                                                value.includes('error') &&
                                                'No "error" allowed in password'
                                            )
                                        },
                                    }}
                                    children={(field) => {
                                        // Avoid hasty abstractions. Render props are great!
                                        return (
                                            <>
                                                <div className="flex items-center">
                                                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                                                </div>
                                                <Input id={field.name}
                                                    name={field.name}
                                                    value={field.state.value}
                                                    onBlur={field.handleBlur}
                                                    onChange={(e) => field.handleChange(e.target.value)}
                                                    type="password" required
                                                />
                                                <FieldInfo field={field} />
                                            </>
                                        )
                                    }}
                                />
                            </div>
                            <form.Subscribe
                                selector={(state) => [state.canSubmit, state.isSubmitting]}
                                children={([canSubmit, isSubmitting]) => (
                                    <Button type="submit" disabled={!canSubmit} className="w-full">
                                        {isSubmitting ? '...' : 'Sign Up'}
                                    </Button>
                                )}
                            />

                        </div>
                    </form>
                    <div className="mt-4 text-center text-sm">
                        Already have an account?{" "}
                        <Link href="/login" className="underline">
                            Sign in
                        </Link>
                    </div>
                </div>
            </div>
            <div className="hidden bg-muted lg:block">
                <Image
                    src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?q=80&w=2944&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    alt="Image"
                    width="1920"
                    height="1080"
                    className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
                />
            </div>
        </div>
    )
}
