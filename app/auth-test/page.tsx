"use client";

import {useState, useEffect} from "react";
import {createClient} from "@/lib/supabase/client";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";

export default function AuthTestPage() {
  const [providers, setProviders] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [envVars, setEnvVars] = useState<Record<string, string>>({});

  useEffect(() => {
    async function checkConfig() {
      try {
        setLoading(true);
        const supabase = createClient();

        // Check environment variables
        setEnvVars({
          NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || "Not set",
          NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || "Not set",
        });

        // This is just a test to see if Supabase is configured
        const {error} = await supabase.auth.getSession();

        if (error) {
          setError(`Supabase error: ${error.message}`);
          return;
        }

        // We can't directly check which providers are enabled from the client
        // So we'll just list the ones we're trying to use
        setProviders(["google", "apple"]);
      } catch (e) {
        setError(`Unexpected error: ${e instanceof Error ? e.message : String(e)}`);
      } finally {
        setLoading(false);
      }
    }

    checkConfig();
  }, []);

  async function testGoogleSignIn() {
    try {
      const supabase = createClient();
      const {data, error} = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: "https://bsyrobgaeadswftzzvay.supabase.co/auth/v1/callback",
        },
      });

      if (error) {
        setError(`Google sign-in error: ${error.message}`);
        return;
      }

      if (data?.url) {
        window.location.href = data.url;
      } else {
        setError("No redirect URL returned from Google sign-in");
      }
    } catch (e) {
      setError(`Unexpected error: ${e instanceof Error ? e.message : String(e)}`);
    }
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Auth Configuration Test</CardTitle>
          <CardDescription>Testing your Supabase auth configuration</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Loading configuration...</p>
          ) : error ? (
            <div className="p-4 bg-destructive/10 text-destructive rounded-md">{error}</div>
          ) : (
            <>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Environment Variables:</h3>
                  <ul className="space-y-1 text-sm">
                    {Object.entries(envVars).map(([key, value]) => (
                      <li key={key} className="flex justify-between">
                        <span className="font-mono">{key}:</span>
                        <span className="font-mono truncate max-w-[200px]">{value}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Configured Providers:</h3>
                  <ul className="space-y-1">
                    {providers.map((provider) => (
                      <li key={provider} className="capitalize">
                        {provider}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </>
          )}
        </CardContent>
        <CardFooter className="flex-col space-y-2">
          <Button onClick={testGoogleSignIn} className="w-full" disabled={loading}>
            Test Google Sign In
          </Button>
          <p className="text-xs text-muted-foreground text-center">This will attempt to sign in with Google using the current URL as the base.</p>
        </CardFooter>
      </Card>
    </div>
  );
}
