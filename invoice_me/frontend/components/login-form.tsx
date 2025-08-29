import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="shadow-lg border-0">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-xl text-slate-900">Login to your account</CardTitle>
          <CardDescription className="text-slate-600">
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="email" className="text-slate-700 font-medium">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  className="border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
                />
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password" className="text-slate-700 font-medium">Password</Label>
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm text-emerald-600 hover:text-emerald-700 underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input 
                  id="password" 
                  type="password" 
                  required 
                  className="border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
                />
              </div>
              <div className="flex flex-col gap-3">
                <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 cursor-pointer">
                  Login
                </Button>
                <Button variant="outline" className="w-full border-slate-200 hover:bg-slate-50 cursor-pointer">
                  Login with Google
                </Button>
              </div>
            </div>
            <div className="mt-6 text-center text-sm text-slate-600">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="text-emerald-600 hover:text-emerald-700 underline underline-offset-4">
                Sign up
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}