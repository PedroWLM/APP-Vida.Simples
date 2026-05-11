import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";
import { AppShell } from "@/components/AppShell";
import { AppStoreProvider } from "@/lib/app-store";
import { useLocation } from "@tanstack/react-router";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Vida Simples — Sua rotina e seu dinheiro mais leves" },
      { name: "description", content: "Organize rotina, tarefas, hábitos e dinheiro sem complicação. Com Modo TDAH.Simples para foco em uma coisa por vez." },
      { name: "author", content: "Vida Simples" },
      { property: "og:title", content: "Vida Simples — Sua rotina e seu dinheiro mais leves" },
      { property: "og:description", content: "Organize rotina, tarefas, hábitos e dinheiro sem complicação. Com Modo TDAH.Simples para foco em uma coisa por vez." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:site", content: "@Lovable" },
      { name: "twitter:title", content: "Vida Simples — Sua rotina e seu dinheiro mais leves" },
      { name: "twitter:description", content: "Organize rotina, tarefas, hábitos e dinheiro sem complicação. Com Modo TDAH.Simples para foco em uma coisa por vez." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/5496cabb-9263-4edb-bd0e-2c885c1385e0/id-preview-09d2424d--a6323123-e312-40f4-a2d7-c207fdfcc39a.lovable.app-1778469603458.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/5496cabb-9263-4edb-bd0e-2c885c1385e0/id-preview-09d2424d--a6323123-e312-40f4-a2d7-c207fdfcc39a.lovable.app-1778469603458.png" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const loc = useLocation();
  const noShell = loc.pathname.startsWith("/onboarding") || loc.pathname.startsWith("/cadastro");

  return (
    <QueryClientProvider client={queryClient}>
      <AppStoreProvider>
        {noShell ? <Outlet /> : <AppShell><Outlet /></AppShell>}
      </AppStoreProvider>
    </QueryClientProvider>
  );
}
