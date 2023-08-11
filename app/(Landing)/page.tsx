import { Button } from "@/components/ui/button";
import Link from "next/dist/client/link";
export default function LandingPage() {
  return (
    <div>
        <p>Landing Page (Unprotected)</p>
        <div>
            <Link href="/sign-in">
                <Button>Login</Button>
            </Link>
            &nbsp;
            <Link href="/sign-up">
                <Button>Register</Button>
            </Link>
        </div>
        
    </div>
  )
}
